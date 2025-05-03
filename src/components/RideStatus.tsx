// src/components/RideStatus.tsx
import React, { useState } from 'react';
import { Ride } from '../types/ride';
import PaymentQRCode from './PaymentQRCode';

interface RideStatusProps {
  ride: Ride | null;
  statusMessage: string | null;
  onCancel: () => void;
  onCopy: (type: 'address' | 'amount' | 'full') => void;
  onNewRide?: () => void;
}

const RideStatus: React.FC<RideStatusProps> = ({ ride, statusMessage, onCancel, onCopy, onNewRide }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (type: 'address' | 'amount' | 'full') => {
    onCopy(type);
    setCopied(true);
    setTimeout(() => setCopied(false), 800);
  };

  // Removed normalizeKaspaAddress as it's now in the PaymentQRCode component

  return (
    <div className="w-full max-w-md mx-auto">
      {statusMessage && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-lg text-center">
          <p className="text-gray-900 font-semibold text-lg">{statusMessage}</p>

          {/* Add New Ride button for paid or cancelled status */}
          {ride && (ride.status === 'paid' || ride.status === 'cancelled') && onNewRide && (
            <button
              onClick={onNewRide}
              className="mt-4 bg-[#1ABC9C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16a085] transition-colors animate-pulse"
            >
              Request New Ride
            </button>
          )}
        </div>
      )}
      {ride && ride.status === 'pending' && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-lg text-center">
          <p className="text-gray-600 mb-3">Waiting for a driver. You can cancel your ride request at any time.</p>
          <button
            onClick={onCancel}
            className="bg-[#1ABC9C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16a085] transition-colors animate-pulse"
          >
            Cancel Request
          </button>
        </div>
      )}
      {ride && ride.status === 'accepted' && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-lg text-center">
          <p className="text-gray-600 mb-3">You can cancel the ride before the driver starts it.</p>
          <button
            onClick={onCancel}
            className="bg-[#1ABC9C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16a085] transition-colors animate-pulse"
          >
            Cancel Ride
          </button>
        </div>
      )}
      {ride && ride.status === 'in progress' && (
        <div className="mb-8 p-6 bg-[#F1C40F] bg-opacity-10 rounded-lg shadow-lg text-center">
          <p className="text-gray-900 font-semibold">
            Your ride is in progress. Cancellation is no longer available.
          </p>
        </div>
      )}
      {ride && ride.status === 'completed' && ride.driverKaspaAddress && ride.fareKAS && (
        <PaymentQRCode
          ride={ride}
          onCopy={handleCopy}
          copied={copied}
        />
      )}
    </div>
  );
};

export default RideStatus;
