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

  const updateLocation = (latitude: number, longitude: number) => {
    const newLocation: LatLng = [longitude, latitude];
    setLocation(newLocation);
    if (track && rideId) {
      const field = role === 'driver' ? 'driverLocation' : 'riderLocation';
      updateRide(rideId, { [field]: new GeoPoint(latitude, longitude) }).catch((error) =>
        console.error(`Error updating ${role} location:`, error)
      );
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
