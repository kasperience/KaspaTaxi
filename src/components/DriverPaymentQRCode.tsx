// src/components/DriverPaymentQRCode.tsx
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, CheckCheck, Download, Maximize2, Minimize2, Printer } from 'lucide-react';
import { Ride } from '../types/ride';
import { generateReceipt, createReceiptElement } from '../utils/pdfUtils';

// Function to calculate distance between two coordinates in kilometers
const calculateDistance = (pickup: [number, number], dropoff: [number, number]): number => {
  const [lon1, lat1] = pickup;
  const [lon2, lat2] = dropoff;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

interface DriverPaymentQRCodeProps {
  ride: Ride;
  onConfirmPayment: () => void;
}

const DriverPaymentQRCode: React.FC<DriverPaymentQRCodeProps> = ({ ride, onConfirmPayment }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!ride.driverKaspaAddress || !ride.fareKAS) {
    return null;
  }

  const normalizeKaspaAddress = (address: string) => {
    return address.startsWith('kaspa:') ? address : `kaspa:${address}`;
  };

  // Calculate distance if both pickup and dropoff coordinates are available
  let distance = 0;
  if (ride.pickupCoords && ride.dropoffCoords) {
    distance = calculateDistance(ride.pickupCoords, ride.dropoffCoords);
  }

  // Format the distance with 2 decimal places
  const formattedDistance = distance.toFixed(2);

  // Calculate ride duration if both start and end times are available
  let durationText = 'N/A';
  if (ride.startTime && ride.endTime) {
    try {
      const startTime = ride.startTime.toDate();
      const endTime = ride.endTime.toDate();
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = Math.round(durationMs / 60000);

      if (durationMinutes < 60) {
        durationText = `${durationMinutes} min`;
      } else {
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        durationText = `${hours}h ${minutes}min`;
      }
    } catch (error) {
      console.error('Error calculating duration:', error);
    }
  }

  const paymentUri = `${normalizeKaspaAddress(ride.driverKaspaAddress)}?amount=${ride.fareKAS.toFixed(2)}`;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      setIsGeneratingPDF(true);

      // Create the receipt element if it doesn't exist
      if (!showReceipt) {
        setShowReceipt(true);
        // Wait for the DOM to update
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await generateReceipt(ride, true, 'driver-receipt-container');
      setIsGeneratingPDF(false);
    } catch (error) {
      console.error('Error generating receipt:', error);
      setIsGeneratingPDF(false);
      alert('Failed to generate receipt. Please try again.');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${expanded ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Payment QR Code</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-gray-100 rounded-full"
          title={expanded ? "Minimize" : "Expand"}
        >
          {expanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <QRCodeSVG
            value={paymentUri}
            size={expanded ? 400 : 250}
            level="H"
            className="mx-auto"
          />
        </div>

        <div className="w-full space-y-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Trip Details:</p>
            <p className="font-mono text-lg text-gray-900 text-center font-bold">
              {formattedDistance} km
            </p>
            <p className="font-mono text-sm text-gray-600 text-center">
              Duration: {durationText}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Amount:</p>
            <p className="font-mono text-xl text-gray-900 text-center">
              {ride.fareKAS.toFixed(2)} KAS
              {ride.fareUSD && (
                <span className="text-sm text-gray-500 ml-2">
                  (${ride.fareUSD.toFixed(2)} USD)
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              {formattedDistance} km × ${ride.driverRatePerKm?.toFixed(2) || '1.50'}/km = ${ride.fareUSD?.toFixed(2) || 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Your Kaspa Address:</p>
            <div className="flex items-center">
              <p className="font-mono text-xs break-all text-gray-900 flex-1">
                {normalizeKaspaAddress(ride.driverKaspaAddress)}
              </p>
              <button
                onClick={() => handleCopy(normalizeKaspaAddress(ride.driverKaspaAddress))}
                className="ml-2 p-1 hover:bg-gray-200 rounded"
                title="Copy address"
              >
                {copied ? (
                  <CheckCheck className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex w-full gap-2 mb-4">
          <button
            onClick={handleDownloadReceipt}
            disabled={isGeneratingPDF}
            className="flex items-center justify-center flex-1 bg-[#1ABC9C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#16a085] transition-colors disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              'Generating...'
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Receipt
              </>
            )}
          </button>

          <button
            onClick={onConfirmPayment}
            className="flex items-center justify-center flex-1 bg-[#F1C40F] text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-[#F39C12] transition-colors"
          >
            Confirm Payment
          </button>
        </div>

        <div className="text-sm text-gray-700 mt-2 text-center p-4 bg-blue-50 rounded-lg">
          <p className="font-semibold mb-1">Instructions:</p>
          <p>1. Show this QR code to the rider</p>
          <p>2. They can scan it with their Kaspa wallet app</p>
          <p>3. Once payment is received, click "Confirm Payment"</p>
        </div>
      </div>

      {/* Hidden receipt container for PDF generation */}
      <div className={`${showReceipt ? '' : 'hidden'}`}>
        <div id="driver-receipt-container" className="mt-8"></div>
      </div>

      {/* Create receipt element when needed */}
      {showReceipt ? createReceiptElement(ride, true, 'driver-receipt-container') : null}
    </div>
  );
};

export default DriverPaymentQRCode;
