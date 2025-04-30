// src/hooks/useDriver.ts
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
  limit,
  doc,
  GeoPoint
} from 'firebase/firestore';
import { Ride, DriverSettings } from '../types/ride';
import { LatLng } from '../types/map';
import { calculateFare } from '../utils/firebaseUtils';

export const useDriver = (userId: string | null, kaspaPrice: number) => {
  const [pendingRides, setPendingRides] = useState<Ride[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [riderLocation, setRiderLocation] = useState<LatLng | null>(null);
  const [settings, setSettings] = useState<DriverSettings>({ kaspaAddress: '', ratePerKm: 1.5 });
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Pending rides listener
  useEffect(() => {
    if (!userId) {
      setPendingRides([]);
      return;
    }
    const q = query(collection(db, 'rides'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rides = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Ride));
        setPendingRides(rides);
      },
      (error) => console.error('Error fetching pending rides:', error)
    );
    return () => unsubscribe();
  }, [userId]);

  // Active ride listener
  useEffect(() => {
    if (!userId) {
      setActiveRide(null);
      setRiderLocation(null);
      return;
    }
    const q = query(
      collection(db, 'rides'),
      where('driverId', '==', userId),
      where('status', 'in', ['accepted', 'in progress', 'completed'])
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const rideData = { id: doc.id, ...doc.data() } as Ride;
          if (rideData.riderLocation instanceof GeoPoint) {
            const newRiderLoc: LatLng = [rideData.riderLocation.longitude, rideData.riderLocation.latitude];
            setRiderLocation((prev) =>
              !prev || prev[0] !== newRiderLoc[0] || prev[1] !== newRiderLoc[1] ? newRiderLoc : prev
            );
          } else {
            setRiderLocation(null);
          }
          setActiveRide(rideData);
        } else {
          setActiveRide(null);
          setRiderLocation(null);
        }
      },
      (error) => {
        console.error('Error fetching active ride:', error);
        setActiveRide(null);
        setRiderLocation(null);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  // Driver settings listener
  useEffect(() => {
    if (!userId) return;
    const driverRef = doc(db, 'drivers', userId);
    const unsubscribe = onSnapshot(
      driverRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setSettings({
            kaspaAddress: data.kaspaAddress || '',
            ratePerKm: data.ratePerKm || 1.5,
          });
        }
      },
      (error) => console.error('Error fetching driver settings:', error)
    );
    return () => unsubscribe();
  }, [userId]);

  // Fetch ride history
  const fetchRideHistory = async () => {
    if (!userId) return;
    setIsLoadingHistory(true);
    try {
      const q = query(
        collection(db, 'rides'),
        where('driverId', '==', userId),
        where('status', 'in', ['paid', 'completed']),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const rides = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Ride));
      setRideHistory(rides);
    } catch (error) {
      console.error('Error fetching ride history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Calculate distances to pickup
  const calculateDistances = (driverLocation: LatLng | null): Record<string, number> => {
    if (!driverLocation) return {};
    const distances: Record<string, number> = {};
    pendingRides.forEach((ride) => {
      if (ride.pickupCoords) {
        // Use the actual distance property instead of fareUSD
        distances[ride.id] = calculateFare(driverLocation, ride.pickupCoords, 1, 1).distance;
      }
    });
    return distances;
  };

  return {
    pendingRides,
    activeRide,
    riderLocation,
    settings,
    setSettings,
    rideHistory,
    isLoadingHistory,
    fetchRideHistory,
    calculateDistances,
  };
};
