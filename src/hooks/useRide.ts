// src/hooks/useRide.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, GeoPoint } from 'firebase/firestore';
import { Ride } from '../types/ride';
import { LatLng } from '../types/map';

export const useRide = (
  userId: string | null,
  rideId: string | null,
  onRideComplete?: (status: string) => void
) => {
  const [ride, setRide] = useState<Ride | null>(null);
  const [driverLocation, setDriverLocation] = useState<LatLng | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Refs to store timeouts
  const autoClearTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to clear the current ride after a delay
  const autoClearRide = useCallback((status: string, delay: number) => {
    // Clear any existing timeout
    if (autoClearTimeoutRef.current) {
      clearTimeout(autoClearTimeoutRef.current);
      autoClearTimeoutRef.current = null;
    }

    // Set a new timeout to clear the ride
    autoClearTimeoutRef.current = setTimeout(() => {
      if (onRideComplete) {
        onRideComplete(status);
      }
      autoClearTimeoutRef.current = null;
    }, delay);
  }, [onRideComplete]);

  // Function to auto-cancel a pending ride after a timeout
  const setupPendingTimeout = useCallback((rideData: Ride) => {
    // Only set up timeout for pending rides
    if (rideData.status !== 'pending') {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }
      return;
    }

    // Clear any existing timeout
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }

    // Calculate time since ride was created
    const now = new Date();
    const rideTime = rideData.timestamp?.toDate() || now;
    const elapsedMs = now.getTime() - rideTime.getTime();

    // Auto-cancel after 10 minutes (600000 ms) of waiting
    const maxWaitTime = 600000; // 10 minutes in milliseconds

    // Add a warning at 8 minutes (480000 ms)
    const warningTime = 480000; // 8 minutes in milliseconds

    const remainingTime = Math.max(0, maxWaitTime - elapsedMs);
    const warningRemainingTime = Math.max(0, warningTime - elapsedMs);

    if (elapsedMs < maxWaitTime) {
      console.log(`Setting up auto-cancel timeout for ride ${rideData.id} in ${remainingTime}ms`);

      // Set up warning timeout if we haven't passed the warning time yet
      if (elapsedMs < warningTime) {
        // Clear any existing warning timeout
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
          warningTimeoutRef.current = null;
        }

        warningTimeoutRef.current = setTimeout(() => {
          // Show a warning to the user that the ride will be auto-cancelled soon
          const warningMessage = 'Your ride request will be automatically cancelled in 2 minutes if no driver accepts it. You can cancel it now or continue waiting.';

          // We're using alert here, but in a real app you might want a more elegant notification
          alert(warningMessage);

          warningTimeoutRef.current = null;
        }, warningRemainingTime);
      }

      pendingTimeoutRef.current = setTimeout(async () => {
        try {
          // Import needed functions
          const { updateRide } = await import('../utils/firebaseUtils');

          // Show final confirmation before auto-cancelling
          const confirmMessage = 'No driver has accepted your ride request in the last 10 minutes. The request will now be cancelled.';
          alert(confirmMessage);

          // Update the ride status to cancelled
          await updateRide(rideData.id, { status: 'cancelled' });
          console.log(`Auto-cancelled pending ride ${rideData.id} after timeout`);

          // Status will be updated by the onSnapshot listener
        } catch (error) {
          console.error('Error auto-cancelling ride:', error);
        }
        pendingTimeoutRef.current = null;
      }, remainingTime);
    } else if (rideData.status === 'pending') {
      // If the ride is already past the timeout, cancel it immediately
      console.log(`Ride ${rideData.id} has exceeded maximum wait time, cancelling now`);

      // Show notification to user
      const timeoutMessage = 'Your ride request has been waiting for more than 10 minutes with no driver response. It will now be cancelled.';
      alert(timeoutMessage);

      (async () => {
        try {
          const { updateRide } = await import('../utils/firebaseUtils');
          await updateRide(rideData.id, { status: 'cancelled' });
        } catch (error) {
          console.error('Error auto-cancelling ride:', error);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (!userId || !rideId) {
      setRide(null);
      setDriverLocation(null);
      setStatusMessage(null);
      return;
    }

    const rideRef = doc(db, 'rides', rideId);
    const unsubscribe = onSnapshot(
      rideRef,
      (doc) => {
        if (doc.exists()) {
          const rideData = { id: doc.id, ...doc.data() } as Ride;
          setRide(rideData);

          // Set up auto-cancel timeout for pending rides
          setupPendingTimeout(rideData);

          // Handle driver location updates
          if (rideData.driverLocation instanceof GeoPoint) {
            const newDriverLoc: LatLng = [
              rideData.driverLocation.longitude,
              rideData.driverLocation.latitude,
            ];

            console.log('Rider app received driver location update:', newDriverLoc);

            // Always update if we have a new location
            setDriverLocation(newDriverLoc);
          } else {
            console.log('No driver location data available in ride object');
            setDriverLocation(null);
          }

          switch (rideData.status) {
            case 'pending':
              setStatusMessage('Waiting for a driver to accept your ride. You can cancel anytime. Ride will auto-cancel after 10 minutes if no driver accepts.');
              break;
            case 'accepted':
              setStatusMessage('Ride accepted! Waiting for driver to start...');
              break;
            case 'in progress':
              setStatusMessage('Ride in progress. Enjoy your trip!');
              break;
            case 'completed':
              setStatusMessage('Ride completed. Please make payment.');
              break;
            case 'paid':
              setStatusMessage('Payment confirmed. Thank you!');
              // Auto-clear paid rides after 10 seconds
              autoClearRide('paid', 10000);
              break;
            case 'cancelled':
              setStatusMessage('Ride cancelled. You can request a new ride.');
              // Auto-clear cancelled rides after 8 seconds
              autoClearRide('cancelled', 8000);
              break;
            default:
              setStatusMessage(null);
          }
        } else {
          setRide(null);
          setDriverLocation(null);
          setStatusMessage(null);
        }
      },
      (error) => {
        console.error('Error fetching ride:', error);
        setRide(null);
        setDriverLocation(null);
        setStatusMessage('Error fetching ride status.');
      }
    );

    return () => {
      unsubscribe();
      // Clear any pending timeouts when unmounting
      if (autoClearTimeoutRef.current) {
        clearTimeout(autoClearTimeoutRef.current);
        autoClearTimeoutRef.current = null;
      }

      // Clear pending ride timeout
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }

      // Clear warning timeout
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = null;
      }
    };
  }, [userId, rideId, setupPendingTimeout]);

  return { ride, driverLocation, statusMessage };
};
