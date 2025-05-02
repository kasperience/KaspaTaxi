// src/components/WebApp.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGeolocation } from '../hooks/useGeolocation';
import { useRide } from '../hooks/useRide';
import { requestRide, updateRide, calculateFare, getAverageDriverRate } from '../utils/firebaseUtils';
import { generateRouteGeoJSON } from '../utils/mapUtils';
import AuthPanel from './AuthPanel';
import RideControls from './RideControls';
import RideStatus from './RideStatus';
import Map from './Map';
import { LatLng } from '../types/map';
// Import Firestore functions and db instance from existing utils
import { GeoPoint, deleteField, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure db is exported from your firebase.ts
import { Ride } from '../types/ride';

const WebApp: React.FC = () => {
  const { user, signIn, signOut } = useAuth();
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<LatLng | null>(null);
  const [selectionMode, setSelectionMode] = useState<'pickup' | 'dropoff' | null>(null);
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false); // Keep track if the map is ready
  const [kaspaPrice, setKaspaPrice] = useState(0);
  const [fareEstimate, setFareEstimate] = useState<{ fareUSD: number; fareKAS: number } | null>(null);
  const [isLoadingRide, setIsLoadingRide] = useState(true); // State to track if we are checking for an existing ride
  const [averageDriverRate, setAverageDriverRate] = useState(1.5); // Default rate until we fetch the actual average

  // Define handleNewRide function early so it can be used in the useRide callback
  const handleNewRide = () => {
    setCurrentRideId(null);
    // Reset map selections
    setPickupCoords(null);
    setDropoffCoords(null);
  };

  // Fetch ride details based on currentRideId (will react to changes)
  const { ride, driverLocation, statusMessage } = useRide(
    user?.uid || null,
    currentRideId,
    // Callback to handle ride completion or cancellation
    (status) => {
      console.log(`Ride auto-cleared with status: ${status}`);
      handleNewRide(); // Automatically clear the ride and allow for a new one
    }
  );

  // Geolocation hook depends on ride status
  const { location } = useGeolocation(
    // Track location when user is logged in and has an active ride
    user !== null &&
    currentRideId !== null &&
    ride !== null &&
    ['accepted', 'in progress'].includes(ride.status),
    currentRideId || undefined,
    'rider' // Explicitly set role to 'rider'
  );

  const showMyLocationOnMap = true; // Always show user's location if available

  // Fetch Kaspa price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd'
        );
        const data = await response.json();
        if (data?.kaspa?.usd) setKaspaPrice(data.kaspa.usd);
      } catch (error) {
        console.error('Error fetching KAS price:', error);
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Fetch average driver rate
  useEffect(() => {
    const fetchAverageRate = async () => {
      try {
        const rate = await getAverageDriverRate();
        setAverageDriverRate(rate);
        console.log('Fetched average driver rate:', rate);
      } catch (error) {
        console.error('Error fetching average driver rate:', error);
      }
    };
    fetchAverageRate();
    // Refresh every 10 minutes to catch any driver rate changes
    const interval = setInterval(fetchAverageRate, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Effect to check for an active ride when the user is authenticated
  useEffect(() => {
    const checkForActiveRide = async () => {
      if (user) {
        setIsLoadingRide(true);
        const ridesRef = collection(db, 'rides');
        // Query for rides associated with the user that are currently active
        // Include 'completed' status to keep the payment screen visible until payment is confirmed
        const q = query(
          ridesRef,
          where('userId', '==', user.uid),
          where('status', 'in', ['pending', 'accepted', 'in progress', 'completed']), // Added 'completed' status
          limit(1) // We only care if at least one exists
        );

        try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            // An active ride exists
            const activeRide = querySnapshot.docs[0];
            console.log("Restoring active ride:", activeRide.id);
            setCurrentRideId(activeRide.id); // Set the ride ID to trigger useRide hook
          } else {
            // No active ride found
            console.log("No active ride found for user:", user.uid);
            setCurrentRideId(null); // Ensure no ride ID is set
          }
        } catch (error) {
          console.error("Error checking for active ride:", error);
          setCurrentRideId(null); // Reset on error
        } finally {
          setIsLoadingRide(false); // Finished checking
        }
      } else {
        setCurrentRideId(null);
        setSelectionMode(null);
        setIsLoadingRide(false); // Not loading if no user
      }
    };

    checkForActiveRide();
  }, [user]); // Dependency array includes user, so it runs on login/logout

  // Calculate fare estimate using the average driver rate
  useEffect(() => {
    if (pickupCoords && dropoffCoords && kaspaPrice > 0) {
      // Use the fetched average driver rate instead of a fixed default
      const estimate = calculateFare(pickupCoords, dropoffCoords, averageDriverRate, kaspaPrice);
      setFareEstimate(estimate);
    } else {
      setFareEstimate(null);
    }
  }, [pickupCoords, dropoffCoords, kaspaPrice, averageDriverRate]);

  const handleMapClick = useCallback((coords: LatLng) => {
    if (selectionMode === 'pickup') {
      setPickupCoords(coords);
    } else if (selectionMode === 'dropoff') {
      setDropoffCoords(coords);
    }
    setSelectionMode(null); // Reset selection mode after click
  }, [selectionMode]);

  const handleRequest = async () => {
    if (!user || !pickupCoords || !dropoffCoords) return;
    setIsRequesting(true);
    try {
      // Construct the base ride data
      const rideData: Partial<Ride> = {
        userId: user.uid,
        pickupCoords,
        dropoffCoords,
        status: 'pending' as const,
      };

      // Conditionally add riderLocation only if location is available
      if (location) {
        rideData.riderLocation = new GeoPoint(location[1], location[0]);
      }

      // Add the current average driver rate to the ride data for fare consistency
      rideData.driverRatePerKm = averageDriverRate;

      // Request the ride
      const rideId = await requestRide(rideData as Partial<Ride>);

      setCurrentRideId(rideId);
      // Clear selection after request
      setPickupCoords(null);
      setDropoffCoords(null);
    } catch (error) {
      console.error('Error requesting ride:', error);
      alert('Failed to request ride. Please ensure location services are enabled and try again.'); // Provide more specific feedback
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCancel = async () => {
    // Allow cancellation only if the ride exists and is in an appropriate state (e.g., 'accepted')
    if (!currentRideId || !ride || ride.status !== 'accepted') return;
    try {
      // Use a more generic type for updates to accommodate deleteField()
      const updates: { [key: string]: unknown } = {
        status: 'cancelled',
        riderLocation: deleteField(), // Remove locations on cancellation
        driverLocation: deleteField(),
      };
      await updateRide(currentRideId, updates);
      setCurrentRideId(null); // Clear the current ride ID
    } catch (error) {
      console.error('Error cancelling ride:', error);
      alert('Failed to cancel ride.');
    }
  };

    const handleCopy = async (type: 'address' | 'amount' | 'full') => {
      if (!ride || !ride.driverKaspaAddress || !ride.fareKAS) return;
      let text = '';
      const amountFixed = ride.fareKAS.toFixed(2); // Use fixed precision for amount
      if (type === 'address') text = ride.driverKaspaAddress;
      else if (type === 'amount') text = amountFixed;
      else text = `${ride.driverKaspaAddress}?amount=${amountFixed}`;
      try {
        await navigator.clipboard.writeText(text);
        // Optional: Add feedback to user
        // alert(`${type} copied to clipboard!`);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        // Optional: Add feedback to user
        // alert(`Failed to copy ${type}.`);
      }
    };


  // handleNewRide is now defined earlier in the component

  return (
    <div className="min-h-screen bg-[#1ABC9C] relative">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-2">
        <AuthPanel user={user} onSignIn={signIn} onSignOut={signOut} isDriver={false} />
        {user && (
          <>
            {isLoadingRide ? (
              <p className="text-center text-white mt-4">Loading ride status...</p>
            ) : (
              <>
                {/* Show RideControls only if no active ride ID is found after loading */}
                {!currentRideId && (
                  <RideControls
                    pickupCoords={pickupCoords}
                    dropoffCoords={dropoffCoords}
                    onSelectPickup={() => setSelectionMode('pickup')}
                    onSelectDropoff={() => setSelectionMode('dropoff')}
                    onRequest={handleRequest}
                    isRequesting={isRequesting}
                    fareEstimate={fareEstimate}
                    kaspaPrice={kaspaPrice}
                    isMapReady={isMapReady}
                  />
                )}

                {/* Show RideStatus if an active ride ID is found after loading */}
                {currentRideId && (
                  <RideStatus
                    ride={ride}
                    statusMessage={statusMessage || "Loading ride details..."}
                    onCancel={handleCancel}
                    onCopy={handleCopy}
                    onNewRide={handleNewRide}
                  />
                )}

                <div className="w-full max-w-md mx-auto h-96 mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
                  <Map
                    pickupLocation={ride ? ride.pickupCoords : pickupCoords}
                    dropoffLocation={ride ? ride.dropoffCoords : dropoffCoords}
                    driverLocation={driverLocation}
                    riderLocation={location}
                    showRiderLocation={showMyLocationOnMap}
                    isSelecting={selectionMode}
                    onMapClick={handleMapClick}
                    onMapReady={() => setIsMapReady(true)}
                    trackUserLocation={ride ? ['accepted', 'in progress'].includes(ride.status) : false}
                    routeGeoJSON={
                      // Generate route GeoJSON if both pickup and dropoff are set
                      (ride ? ride.pickupCoords : pickupCoords) && (ride ? ride.dropoffCoords : dropoffCoords)
                        ? generateRouteGeoJSON(
                            ride ? ride.pickupCoords : pickupCoords!,
                            ride ? ride.dropoffCoords : dropoffCoords!
                          )
                        : undefined
                    }
                  />
                </div>
              </>
            )}
          </>
        )}
        {!user && !isLoadingRide && (
          <p className="text-center text-white mt-4">Please sign in to request a ride.</p>
        )}
      </div>
    </div>
  );
};

// Use React.memo for potential performance optimization if props don't change often
export default React.memo(WebApp);
