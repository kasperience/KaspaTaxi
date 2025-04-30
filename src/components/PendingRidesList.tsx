// src/components/PendingRidesList.tsx
import React, { useState } from 'react';
import { MapPin, Route } from 'lucide-react';
import Map from './Map';
import { Ride } from '../types/ride';
import { LatLng } from '../types/map';
import { calculateFare } from '../utils/firebaseUtils';
import { generateRouteGeoJSON } from '../utils/mapUtils';

interface PendingRidesListProps {
  rides: Ride[];
  driverLocation: LatLng | null;
  ratePerKm: number;
  kaspaPrice: number;
  distances: Record<string, number>;
  onAccept: (rideId: string) => void;
}

const PendingRidesList: React.FC<PendingRidesListProps> = ({
  rides,
  driverLocation,
  ratePerKm,
  kaspaPrice,
  distances,
  onAccept,
}) => {
  const [selectedRidePreview, setSelectedRidePreview] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Available Rides</h2>
      {rides.length > 0 ? (
        <ul className="space-y-4">
          {rides.map((ride) => {
            const { fareUSD, fareKAS, distance } =
              ride.pickupCoords && ride.dropoffCoords
                ? calculateFare(ride.pickupCoords, ride.dropoffCoords, ratePerKm, kaspaPrice)
                : { fareUSD: 0, fareKAS: 0, distance: 0 };
            const distToPickup = distances[ride.id] || 0;

            return (
              <li key={ride.id} className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">Ride Request</p>
                {distToPickup > 0 && (
                  <div className="flex items-center text-[#1ABC9C] text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{distToPickup.toFixed(2)} km to pickup</span>
                  </div>
                )}
                <p className="text-gray-600 text-sm">
                  Pickup:{' '}
                  {ride.pickupCoords
                    ? `${ride.pickupCoords[1].toFixed(4)}, ${ride.pickupCoords[0].toFixed(4)}`
                    : 'N/A'}
                </p>
                <p className="text-gray-600 text-sm">
                  Dropoff:{' '}
                  {ride.dropoffCoords
                    ? `${ride.dropoffCoords[1].toFixed(4)}, ${ride.dropoffCoords[0].toFixed(4)}`
                    : 'N/A'}
                </p>
                {fareUSD > 0 && (
                  <div className="mt-2 mb-3 p-3 bg-[#F1C40F] bg-opacity-10 rounded-lg">
                    <p className="text-sm text-gray-900">
                      Est: {distance.toFixed(2)} km / ${fareUSD.toFixed(2)} /{' '}
                      {fareKAS.toFixed(2)} KAS
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setSelectedRidePreview(selectedRidePreview === ride.id ? null : ride.id)}
                  className="mt-2 flex items-center justify-center w-full text-sm text-[#1ABC9C] hover:text-[#16a085] font-semibold"
                >
                  <Route className="w-4 h-4 mr-1" />
                  {selectedRidePreview === ride.id ? 'Hide preview' : 'Show route preview'}
                </button>
                {selectedRidePreview === ride.id && (
                  <div className="mt-3 w-full h-64 rounded-lg overflow-hidden">
                    <Map
                      driverLocation={driverLocation}
                      riderLocation={null}
                      showRiderLocation={false}
                      pickupLocation={ride.pickupCoords}
                      dropoffLocation={ride.dropoffCoords}
                      isSelecting={null}
                      onMapReady={() => {}}
                      trackUserLocation={false}
                      routeGeoJSON={
                        ride.pickupCoords && ride.dropoffCoords
                          ? generateRouteGeoJSON(ride.pickupCoords, ride.dropoffCoords)
                          : undefined
                      }
                    />
                  </div>
                )}
                <button
                  onClick={() => onAccept(ride.id)}
                  className="mt-3 w-full bg-[#1ABC9C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16a085] transition-colors animate-pulse"
                >
                  Accept Ride
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center p-6 bg-white rounded-lg shadow-lg border-2 border-[#1ABC9C] border-dashed">
          <p className="text-gray-900 text-lg font-semibold">No pending ride requests.</p>
          <p className="text-gray-600 mt-2">When riders request a ride, they will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default PendingRidesList;
