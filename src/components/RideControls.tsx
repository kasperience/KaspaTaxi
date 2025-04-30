// src/components/RideControls.tsx
import React from 'react';
import { LatLng } from '../types/map';
import { MapPin, Flag } from 'lucide-react';

interface RideControlsProps {
  pickupCoords: LatLng | null;
  dropoffCoords: LatLng | null;
  onSelectPickup: () => void;
  onSelectDropoff: () => void;
  onRequest: () => void;
  isRequesting: boolean;
  fareEstimate: { fareUSD: number; fareKAS: number } | null;
  kaspaPrice: number;
  isMapReady: boolean;
}

const RideControls: React.FC<RideControlsProps> = ({
  pickupCoords,
  dropoffCoords,
  onSelectPickup,
  onSelectDropoff,
  onRequest,
  isRequesting,
  fareEstimate,
  kaspaPrice,
  isMapReady,
}) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Request a Ride</h2>
      {!isMapReady && (
        <p className="text-gray-600 mb-4">Loading map...</p>
      )}
      {isMapReady && !pickupCoords && (
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Step 1:</span> Click "Select Pickup Location" and then tap on the map to set your pickup point.
          </p>
          <p className="text-xs text-gray-500">You'll need to confirm your selection on the map.</p>
        </div>
      )}
      {isMapReady && pickupCoords && !dropoffCoords && (
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Step 2:</span> Click "Select Dropoff Location" and then tap on the map to set your destination.
          </p>
          <p className="text-xs text-gray-500">You'll need to confirm your selection on the map.</p>
        </div>
      )}
      {isMapReady && pickupCoords && dropoffCoords && !fareEstimate && (
        <p className="text-gray-600 mb-4">Calculating fare estimate...</p>
      )}
      <div className="space-y-4">
        <button
          onClick={onSelectPickup}
          disabled={!isMapReady}
          className={`w-full flex items-center justify-center gap-2 bg-white text-[#1ABC9C] px-6 py-3 rounded-lg font-semibold hover:bg-[#16a085] hover:text-white transition-colors border-2 border-[#1ABC9C] ${!pickupCoords ? 'animate-pulse' : ''} ${!isMapReady ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <MapPin className="h-5 w-5" />
          {pickupCoords ? 'Change Pickup Location' : 'Select Pickup Location'}
          {pickupCoords && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Set ✓
            </span>
          )}
        </button>
        <button
          onClick={onSelectDropoff}
          disabled={!isMapReady}
          className={`w-full flex items-center justify-center gap-2 bg-white text-[#1ABC9C] px-6 py-3 rounded-lg font-semibold hover:bg-[#16a085] hover:text-white transition-colors border-2 border-[#1ABC9C] ${pickupCoords && !dropoffCoords ? 'animate-pulse' : ''} ${!isMapReady ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Flag className="h-5 w-5" />
          {dropoffCoords ? 'Change Dropoff Location' : 'Select Dropoff Location'}
          {dropoffCoords && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Set ✓
            </span>
          )}
        </button>
        {fareEstimate && pickupCoords && dropoffCoords && (
          <div className="p-4 bg-[#F1C40F] bg-opacity-10 rounded-lg">
            <p className="text-gray-900 font-semibold mb-1">Estimated Fare:</p>
            <p className="text-sm text-gray-700">
              Distance: {fareEstimate.distance.toFixed(2)} km
            </p>
            <p className="text-sm text-gray-700">
              Price: ${fareEstimate.fareUSD.toFixed(2)} USD / {fareEstimate.fareKAS.toFixed(2)} KAS
            </p>
            {kaspaPrice > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Current KAS price: ${kaspaPrice.toFixed(4)} USD
              </p>
            )}
          </div>
        )}
        <button
          onClick={onRequest}
          disabled={!pickupCoords || !dropoffCoords || isRequesting || !isMapReady}
          className={`w-full bg-[#1ABC9C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16a085] transition-colors disabled:opacity-50 ${pickupCoords && dropoffCoords && !isRequesting ? 'animate-pulse' : ''}`}
        >
          {isRequesting ? 'Requesting...' : 'Request Ride'}
          {pickupCoords && dropoffCoords && !isRequesting && (
            <span className="ml-2 inline-block">→</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default RideControls;
