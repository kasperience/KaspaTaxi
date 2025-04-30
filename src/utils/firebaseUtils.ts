// src/utils/firebaseUtils.ts
import { doc, updateDoc, deleteField, setDoc, addDoc, collection, serverTimestamp, getDocs, query, limit, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Ride } from '../types/ride';
import { LatLng } from '../types/map';

export const updateRide = async (rideId: string, updates: Partial<Ride> | { [key: string]: any }) => {
  const rideRef = doc(db, 'rides', rideId);
  await updateDoc(rideRef, updates);
};

export const saveDriverSettings = async (driverId: string, settings: { kaspaAddress: string; ratePerKm: number }) => {
  const driverRef = doc(db, 'drivers', driverId);
  await setDoc(driverRef, settings, { merge: true });
};

export const requestRide = async (rideData: Partial<Ride>) => {
  const rideRef = await addDoc(collection(db, 'rides'), {
    ...rideData,
    timestamp: serverTimestamp(),
  });
  return rideRef.id;
};

// Fetch the average rate per km from all drivers or use default
export const getAverageDriverRate = async (): Promise<number> => {
  try {
    const driversRef = collection(db, 'drivers');
    const q = query(driversRef, limit(10)); // Limit to 10 drivers for efficiency
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return 1.5; // Default rate if no drivers found
    }

    let totalRate = 0;
    let count = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.ratePerKm && typeof data.ratePerKm === 'number') {
        totalRate += data.ratePerKm;
        count++;
      }
    });

    return count > 0 ? totalRate / count : 1.5; // Return average or default
  } catch (error) {
    console.error('Error fetching driver rates:', error);
    return 1.5; // Default rate on error
  }
};

// Get a specific driver's rate per km
export const getDriverRate = async (driverId: string): Promise<number> => {
  try {
    const driverRef = doc(db, 'drivers', driverId);
    const driverDoc = await getDoc(driverRef);

    if (driverDoc.exists() && driverDoc.data().ratePerKm) {
      return driverDoc.data().ratePerKm;
    }

    return 1.5; // Default rate if driver not found or no rate set
  } catch (error) {
    console.error(`Error fetching rate for driver ${driverId}:`, error);
    return 1.5; // Default rate on error
  }
};

export const calculateFare = (
  pickup: LatLng,
  dropoff: LatLng,
  ratePerKm: number,
  kaspaPrice: number
): { fareUSD: number; fareKAS: number; distance: number } => {
  const [lon1, lat1] = pickup;
  const [lon2, lat2] = dropoff;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  // Round distance to 2 decimal places for consistency
  const roundedDistance = Math.round(distance * 100) / 100;
  const fareUSD = Math.round((roundedDistance * ratePerKm) * 100) / 100;
  const fareKAS = kaspaPrice > 0 ? Math.round((fareUSD / kaspaPrice) * 100) / 100 : 0;
  return { fareUSD, fareKAS, distance: roundedDistance };
};
