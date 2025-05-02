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

  // Ref to store the auto-clear timeout
  const autoClearTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
              setStatusMessage('Waiting for a driver to accept your ride...');
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
    };
  }, [userId, rideId]);

  return { ride, driverLocation, statusMessage };
};
