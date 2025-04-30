// src/utils/pdfUtils.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Ride } from '../types/ride';

// Function to generate a PDF receipt from a ride
export const generateReceipt = async (
  ride: Ride,
  isDriver: boolean,
  elementId: string
): Promise<void> => {
  try {
    // Get the HTML element to convert to PDF
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }

    // Use html2canvas to convert the element to a canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false, // Disable logging
      backgroundColor: '#ffffff', // White background
    });

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate the width and height to maintain aspect ratio
    const imgWidth = 210; // A4 width in mm (210mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the canvas as an image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Generate a filename based on the ride ID and user type
    const filename = `kaspa_taxi_receipt_${isDriver ? 'driver' : 'rider'}_${ride.id}.pdf`;

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF receipt:', error);
    throw error;
  }
};

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

// Function to create a receipt element that can be converted to PDF
export const createReceiptElement = (
  ride: Ride,
  isDriver: boolean,
  containerId: string
): null => {
  const container = document.getElementById(containerId);
  if (!container) return null;

  // Clear any existing content
  container.innerHTML = '';

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

  // Create the receipt HTML with smaller font sizes
  const receiptHTML = `
    <div class="bg-white p-6 rounded-lg shadow-lg" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 15px;">
        <h1 style="color: #1ABC9C; font-size: 20px; margin-bottom: 4px;">KaspaTaxi Receipt</h1>
        <p style="color: #666; font-size: 12px;">${new Date().toLocaleString()}</p>
      </div>

      <div style="border-top: 2px solid #eee; border-bottom: 2px solid #eee; padding: 12px 0; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Ride ID:</span>
          <span style="color: #666; font-size: 12px;">${ride.id}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Status:</span>
          <span style="color: #666; text-transform: capitalize; font-size: 12px;">${ride.status}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Date:</span>
          <span style="color: #666; font-size: 12px;">${ride.timestamp ? new Date(ride.timestamp.toDate()).toLocaleString() : 'N/A'}</span>
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <h2 style="color: #1ABC9C; font-size: 16px; margin-bottom: 8px;">Trip Details</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Distance:</span>
          <span style="color: #666; font-weight: bold; font-size: 12px;">${formattedDistance} km</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Duration:</span>
          <span style="color: #666; font-weight: bold; font-size: 12px;">${durationText}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Pickup:</span>
          <span style="color: #666; font-size: 12px;">${ride.pickupCoords ? `${ride.pickupCoords[1].toFixed(6)}, ${ride.pickupCoords[0].toFixed(6)}` : 'N/A'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Dropoff:</span>
          <span style="color: #666; font-size: 12px;">${ride.dropoffCoords ? `${ride.dropoffCoords[1].toFixed(6)}, ${ride.dropoffCoords[0].toFixed(6)}` : 'N/A'}</span>
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <h2 style="color: #1ABC9C; font-size: 16px; margin-bottom: 8px;">Payment Details</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Amount (USD):</span>
          <span style="color: #666; font-size: 12px;">$${ride.fareUSD?.toFixed(2) || 'N/A'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Amount (KAS):</span>
          <span style="color: #666; font-size: 12px;">${ride.fareKAS?.toFixed(2) || 'N/A'} KAS</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Rate per km:</span>
          <span style="color: #666; font-size: 12px;">$${ride.driverRatePerKm?.toFixed(2) || '1.50'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Price calculation:</span>
          <span style="color: #666; font-size: 12px;">${formattedDistance} km × $${ride.driverRatePerKm?.toFixed(2) || '1.50'} = $${ride.fareUSD?.toFixed(2) || 'N/A'}</span>
        </div>
      </div>

      ${isDriver ? `
      <div style="margin-bottom: 15px;">
        <h2 style="color: #1ABC9C; font-size: 16px; margin-bottom: 8px;">Driver Information</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Driver ID:</span>
          <span style="color: #666; font-size: 12px;">${ride.driverId || 'N/A'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Kaspa Address:</span>
          <span style="color: #666; font-size: 12px; word-break: break-all;">${ride.driverKaspaAddress || 'N/A'}</span>
        </div>
      </div>
      ` : `
      <div style="margin-bottom: 15px;">
        <h2 style="color: #1ABC9C; font-size: 16px; margin-bottom: 8px;">Rider Information</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #333; font-size: 12px;">Rider ID:</span>
          <span style="color: #666; font-size: 12px;">${ride.userId || 'N/A'}</span>
        </div>
      </div>
      `}

      <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px solid #eee;">
        <p style="color: #999; font-size: 10px;">Thank you for using KaspaTaxi!</p>
        <p style="color: #999; font-size: 10px;">This is an automatically generated receipt.</p>
      </div>
    </div>
  `;

  // Set the HTML content
  container.innerHTML = receiptHTML;

  return null;
};
