// src/hooks/useGeolocation.ts
import { useState, useEffect, useRef } from 'react';
import { LatLng } from '../types/map';
import { GeoPoint } from 'firebase/firestore';
import { updateRide } from '../utils/firebaseUtils';

export const useGeolocation = (
  track: boolean,
  rideId?: string,
  role: 'driver' | 'rider' = 'rider'
): { location: LatLng | null; geoPoint: GeoPoint | null } => {
  const [location, setLocation] = useState<LatLng | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const UPDATE_INTERVAL = 2000; // Update database every 2 seconds to avoid excessive writes

  const updateLocation = (latitude: number, longitude: number) => {
    const newLocation: LatLng = [longitude, latitude];
    setLocation(newLocation);

    // Always update the database when tracking is enabled and we have a ride ID
    if (track && rideId) {
      const currentTime = Date.now();

      // Only update the database if enough time has passed since the last update
      // This prevents excessive database writes while still ensuring regular updates
      if (currentTime - lastUpdateTimeRef.current > UPDATE_INTERVAL) {
        const field = role === 'driver' ? 'driverLocation' : 'riderLocation';
        const geoPoint = new GeoPoint(latitude, longitude);

        console.log(`Updating ${role} location for ride ${rideId}:`, [longitude, latitude]);

        updateRide(rideId, { [field]: geoPoint })
          .then(() => {
            lastUpdateTimeRef.current = currentTime;
          })
          .catch((error) => {
            console.error(`Error updating ${role} location:`, error);
          });
      }
    }
  };

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    const clearWatch = () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };

    if (track) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => updateLocation(position.coords.latitude, position.coords.longitude),
        (error) => console.error('Geolocation watch error:', error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 }
      );
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => updateLocation(position.coords.latitude, position.coords.longitude),
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 180000 }
      );
    }

    return clearWatch;
  }, [track, rideId]);

  return {
    location,
    geoPoint: location ? new GeoPoint(location[1], location[0]) : null,
  };
};
