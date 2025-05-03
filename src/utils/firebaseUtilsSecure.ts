// src/utils/firebaseUtilsSecure.ts
import { auth } from '../firebase';
import { firestoreAPI } from '../services/api';
import { Ride } from '../types/ride';
import { LatLng } from '../types/map';

// Helper function to get the current user's ID token
const getIdToken = async (): Promise<string> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  return currentUser.getIdToken();
};

export const updateRide = async (rideId: string, updates: Partial<Ride> | { [key: string]: any }) => {
  const idToken = await getIdToken();
  await firestoreAPI.updateDocument('rides', rideId, updates, idToken);
};

export const saveDriverSettings = async (driverId: string, settings: { kaspaAddress: string; ratePerKm: number }) => {
  const idToken = await getIdToken();
  await firestoreAPI.updateDocument('drivers', driverId, settings, idToken);
};

export const requestRide = async (rideData: Partial<Ride>) => {
  const idToken = await getIdToken();
  const result = await firestoreAPI.createDocument('rides', {
    ...rideData,
    timestamp: new Date(),
  }, idToken);
  return result.id;
};

// Fetch the average rate per km from all drivers or use default
export const getAverageDriverRate = async (): Promise<number> => {
  try {
    const idToken = await getIdToken();
    const drivers = await firestoreAPI.queryDocuments('drivers', {
      limit: 10, // Limit to 10 drivers for efficiency
    }, idToken);

    if (drivers.length === 0) {
      return 1.5; // Default rate if no drivers found
    }

    let totalRate = 0;
    let count = 0;

    drivers.forEach(driver => {
      if (driver.ratePerKm && typeof driver.ratePerKm === 'number') {
        totalRate += driver.ratePerKm;
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
    const idToken = await getIdToken();
    const driver = await firestoreAPI.getDocument('drivers', driverId, idToken);

    if (driver && driver.ratePerKm) {
      return driver.ratePerKm;
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
