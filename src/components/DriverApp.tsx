// src/components/DriverApp.tsx
import React, { useState, useEffect } from 'react';
import { useAuthSecure } from '../hooks/useAuthSecure';
import { useGeolocation } from '../hooks/useGeolocation';
import { useDriver } from '../hooks/useDriver';
import AuthPanel from './AuthPanel';
import DriverSettings from './DriverSettings';
import PendingRidesList from './PendingRidesList';
import ActiveRidePanel from './ActiveRidePanel';
import RideHistoryPanel from './RideHistoryPanel';
import ConfirmationModal from './ConfirmationModal';
import { updateRide, saveDriverSettings, calculateFare } from '../utils/firebaseUtils';
import { Ride } from '../types/ride';
import { deleteField, serverTimestamp } from 'firebase/firestore';

const DriverApp: React.FC = () => {
  const [kaspaPrice, setKaspaPrice] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => Promise.resolve());
  const [confirmType, setConfirmType] = useState<'warning' | 'info' | 'success'>('warning');

  const { user, loading, error, signIn, signOut } = useAuthSecure();

  // Helper function to show confirmation modal
  const showConfirmation = (
    title: string,
    message: string,
    action: () => Promise<void>,
    type: 'warning' | 'info' | 'success' = 'warning'
  ) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmType(type);
    setShowConfirmModal(true);
  };

  const {
    pendingRides,
    activeRide,
    riderLocation,
    settings,
    setSettings,
    rideHistory,
    isLoadingHistory,
    fetchRideHistory,
    calculateDistances,
  } = useDriver(user?.uid || null, kaspaPrice);

  const { location } = useGeolocation(
    user !== null && activeRide !== null && ['accepted', 'in progress'].includes(activeRide.status),
    activeRide?.id,
    'driver' // Explicitly set role to 'driver' to ensure correct field updates
  );

  // Fetch Kaspa price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd'
        );
        const data = await response.json();
        if (data?.kaspa?.usd) setKaspaPrice(data.kaspa.usd);
      } catch (error) {
        console.error('Error fetching KAS price:', error);
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptRide = (rideId: string) => {
    if (!user || !settings.kaspaAddress) {
      alert('Please set Kaspa address in settings.');
      return;
    }
    if (activeRide) {
      alert('Cannot accept multiple rides.');
      return;
    }

    // Show confirmation modal for accepting a ride
    showConfirmation(
      'Accept Ride',
      'Are you sure you want to accept this ride? You will be responsible for picking up the rider.',
      async () => {
        try {
          // Hide history section when accepting a ride
          if (showHistory) {
            setShowHistory(false);
          }

          await updateRide(rideId, {
            status: 'accepted',
            driverId: user.uid,
            driverKaspaAddress: settings.kaspaAddress,
            driverRatePerKm: settings.ratePerKm,
          });
        } catch (error) {
          console.error(`Error accepting ride ${rideId}:`, error);
          alert('Failed to accept.');
        }
      },
      'info' // This will now use teal color
    );
  };

  const handleUpdateStatus = (status: Ride['status']) => {
    if (!user || !activeRide) {
      alert('Cannot update ride status.');
      return;
    }

    // Handle different status updates with appropriate confirmations
    if (status === 'cancelled') {
      const title = 'Cancel Ride';
      let message = '';

      if (activeRide.status === 'accepted') {
        message = 'Are you sure you want to cancel this ride? The rider is waiting for you.';
      } else if (activeRide.status === 'in progress') {
        message = 'Are you sure you want to cancel this ride? The rider is already in your vehicle.';
      }

      showConfirmation(title, message, async () => {
        await performStatusUpdate(status);
      }, 'warning');

    } else if (status === 'completed' && activeRide.status === 'in progress') {
      showConfirmation(
        'Complete Ride',
        'Are you sure you want to mark this ride as completed? This will generate the payment request for the rider.',
        async () => {
          await performStatusUpdate(status);
        },
        'success'
      );

    } else if (status === 'in progress') {
      showConfirmation(
        'Start Ride',
        'Are you ready to start this ride? This will indicate to the rider that you have begun the journey.',
        async () => {
          await performStatusUpdate(status);
        },
        'info' // Using teal color
      );

    } else {
      // For other status updates, no confirmation needed
      performStatusUpdate(status);
    }
  };

  // Helper function to perform the actual status update
  const performStatusUpdate = async (status: Ride['status']) => {
    if (!user || !activeRide) return;

    try {
      const updates: Partial<Ride> & { [key: string]: unknown } = { status };

      // Record start time when ride status changes to 'in progress'
      if (status === 'in progress') {
        updates.startTime = serverTimestamp();
      }

      // Record end time and calculate fare when ride is completed
      if (status === 'completed' && activeRide.pickupCoords && activeRide.dropoffCoords) {
        updates.endTime = serverTimestamp();

        const { fareUSD, fareKAS, distance } = calculateFare(
          activeRide.pickupCoords,
          activeRide.dropoffCoords,
          settings.ratePerKm,
          kaspaPrice
        );
        updates.fareUSD = fareUSD;
        updates.fareKAS = fareKAS;
        updates.distance = distance; // Store the actual distance in the ride data
      }

      if (status === 'completed' || status === 'cancelled') {
        // Use unknown type instead of any
        (updates as { driverLocation: unknown }).driverLocation = deleteField();
        (updates as { riderLocation: unknown }).riderLocation = deleteField();
      }

      await updateRide(activeRide.id, updates);
    } catch (error) {
      console.error(`Error updating ride to ${status}:`, error);
      alert('Failed to update status.');
    }
  };

  const handleConfirmPayment = () => {
    if (!user || !activeRide || activeRide.status !== 'completed') {
      alert('Cannot confirm payment.');
      return;
    }

    // Show confirmation modal for payment confirmation
    showConfirmation(
      'Confirm Payment',
      'Are you sure you want to confirm payment receipt? This will complete the ride transaction.',
      async () => {
        try {
          await updateRide(activeRide.id, { status: 'paid' });
        } catch (error) {
          console.error(`Error confirming payment:`, error);
          alert('Failed to confirm payment.');
        }
      },
      'success'
    );
  };

  const handleSaveSettings = () => {
    if (!user) return;

    // Show confirmation modal for saving settings
    showConfirmation(
      'Save Settings',
      'Are you sure you want to save these settings? Your Kaspa address and rate will be used for all future rides.',
      async () => {
        try {
          await saveDriverSettings(user.uid, settings);
          alert('Settings saved!');
        } catch (error) {
          console.error('Error saving settings:', error);
          alert('Failed to save.');
        }
      },
      'info' // Using teal color
    );
  };

  // Handle loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1ABC9C] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1ABC9C] flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1ABC9C] text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1ABC9C] relative">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-2">
        <AuthPanel
          user={user}
          onSignIn={signIn}
          onSignOut={signOut}
          onToggleSettings={() => setShowSettings(!showSettings)}
          onToggleHistory={() => {
            setShowHistory(!showHistory);
            if (!showHistory) fetchRideHistory();
          }}
          showSettings={showSettings}
          showHistory={showHistory}
        />
        {/* Notification for pending rides */}
        {user && pendingRides.length > 0 && !activeRide && (
          <div className="mb-4 p-4 bg-[#F1C40F] bg-opacity-20 rounded-lg shadow-lg text-center animate-pulse">
            <p className="text-gray-900 font-bold">
              {pendingRides.length} {pendingRides.length === 1 ? 'ride' : 'rides'} waiting for a driver!
            </p>
          </div>
        )}

        {user && showSettings && (
          <DriverSettings
            settings={settings}
            onChange={setSettings}
            onSave={handleSaveSettings}
            kaspaPrice={kaspaPrice}
          />
        )}

        {/* Show ActiveRidePanel above everything else when there's an active ride */}
        {user && activeRide && (
          <ActiveRidePanel
            ride={activeRide}
            riderLocation={riderLocation}
            driverLocation={location}
            onUpdateStatus={handleUpdateStatus}
            onConfirmPayment={handleConfirmPayment}
          />
        )}

        {/* Show PendingRidesList when there's no active ride */}
        {user && !activeRide && (
          <PendingRidesList
            rides={pendingRides}
            driverLocation={location}
            ratePerKm={settings.ratePerKm}
            kaspaPrice={kaspaPrice}
            distances={calculateDistances(location)}
            onAccept={handleAcceptRide}
          />
        )}

        {/* Only show history if explicitly requested and there's no active ride */}
        {user && showHistory && !activeRide && (
          <RideHistoryPanel rides={rideHistory} isLoading={isLoadingHistory} />
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title={confirmTitle}
        message={confirmMessage}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={async () => {
          await confirmAction();
          setShowConfirmModal(false);
        }}
        onCancel={() => setShowConfirmModal(false)}
        type={confirmType}
      />
    </div>
  );
};

export default DriverApp;