// src/types/ride.ts
import { DocumentData, GeoPoint } from 'firebase/firestore';
import { LatLng } from './map';

export interface Ride extends DocumentData {
  id: string;
  userId: string;
  driverId?: string;
  pickupCoords: LatLng;
  dropoffCoords: LatLng;
  status: 'pending' | 'accepted' | 'in progress' | 'completed' | 'paid' | 'cancelled';
  timestamp: any;
  startTime?: any; // Timestamp when ride starts (status changes to 'in progress')
  endTime?: any;   // Timestamp when ride ends (status changes to 'completed')
  driverLocation?: GeoPoint;
  riderLocation?: GeoPoint;
  driverKaspaAddress?: string;
  driverRatePerKm?: number;
  fareUSD?: number;
  fareKAS?: number;
}

export interface DriverSettings {
  kaspaAddress: string;
  ratePerKm: number;
}
