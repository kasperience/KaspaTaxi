// src/components/ActiveRidePanel.tsx
import React from 'react';
import { Ride } from '../types/ride';
import { LatLng } from '../types/map';
import Map from './Map';
import DriverPaymentQRCode from './DriverPaymentQRCode';
import { generateRouteGeoJSON } from '../utils/mapUtils';

interface ActiveRidePanelProps {
  ride: Ride;
  riderLocation: LatLng | null;
  driverLocation: LatLng | null;
  onUpdateStatus: (status: Ride['status']) => void;
  onConfirmPayment: () => void;
}

const ActiveRidePanel: React.FC<ActiveRidePanelProps> = ({
  ride,
  riderLocation,
  driverLocation,
  onUpdateStatus,
  onConfirmPayment,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Ride</h2>
        <p className="text-gray-600">
          ID: <span className="font-mono text-xs">{ride.id}</span>
        </p>
        <p className="text-gray-600">
          Status: <span className="font-semibold capitalize">{ride.status}</span>
        </p>
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
        <div className="flex gap-3 mt-4">
          {ride.status === 'accepted' && (
            <button
              onClick={() => onUpdateStatus('in progress')}
              className="flex-1 bg-[#1ABC9C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#16a085] transition-colors animate-pulse"
            >
              Start
            </button>
          )}
          {ride.status === 'in progress' && (
            <button
              onClick={() => onUpdateStatus('completed')}
              className="flex-1 bg-[#1ABC9C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#16a085] transition-colors animate-pulse"
            >
              Complete
            </button>
          )}
          {/* Removed the Confirm Payment button as it's now in the DriverPaymentQRCode component */}
          {(ride.status === 'accepted' || ride.status === 'in progress') && (
            <button
              onClick={() => onUpdateStatus('cancelled')}
              className="px-4 py-2 bg-white text-[#1ABC9C] rounded-lg font-semibold hover:bg-[#F1C40F] hover:text-gray-900 transition-colors border-2 border-[#1ABC9C]"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {/* Show payment QR code for completed rides */}
      {ride.status === 'completed' && (
        <DriverPaymentQRCode
          ride={ride}
          onConfirmPayment={onConfirmPayment}
        />
      )}

      {/* Show map for active rides */}
      {['accepted', 'in progress'].includes(ride.status) && (
        <div className="w-full h-96 rounded-lg overflow-hidden">
          <Map
            driverLocation={driverLocation}
            riderLocation={riderLocation}
            showRiderLocation={true}
            pickupLocation={ride.pickupCoords}
            dropoffLocation={ride.dropoffCoords}
            isSelecting={null}
            onMapReady={() => {}}
            trackUserLocation={true}
            routeGeoJSON={
              ride.pickupCoords && ride.dropoffCoords
                ? generateRouteGeoJSON(ride.pickupCoords, ride.dropoffCoords)
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
};

export default ActiveRidePanel;
