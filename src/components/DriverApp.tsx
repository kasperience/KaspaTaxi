// src/components/DriverApp.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGeolocation } from '../hooks/useGeolocation';
import { useDriver } from '../hooks/useDriver';
import AuthPanel from './AuthPanel';
import DriverSettings from './DriverSettings';
import PendingRidesList from './PendingRidesList';
import ActiveRidePanel from './ActiveRidePanel';
import RideHistoryPanel from './RideHistoryPanel';
import { updateRide, saveDriverSettings, calculateFare } from '../utils/firebaseUtils';
import { Ride } from '../types/ride';
import { deleteField, serverTimestamp } from 'firebase/firestore';

const DriverApp: React.FC = () => {
  const [kaspaPrice, setKaspaPrice] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { user, signIn, signOut } = useAuth();

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
    activeRide?.id
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

  const handleAcceptRide = async (rideId: string) => {
    if (!user || !settings.kaspaAddress) {
      alert('Please set Kaspa address in settings.');
      return;
    }
    if (activeRide) {
      alert('Cannot accept multiple rides.');
      return;
    }
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
  };

  const handleUpdateStatus = async (status: Ride['status']) => {
    if (!user || !activeRide) {
      alert('Cannot update ride status.');
      return;
    }
    try {
      const updates: Partial<Ride> & { [key: string]: any } = { status };

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
        // Use any type to bypass TypeScript's type checking for Firestore field values
        (updates as any).driverLocation = deleteField();
        (updates as any).riderLocation = deleteField();
      }

      await updateRide(activeRide.id, updates);
    } catch (error) {
      console.error(`Error updating ride to ${status}:`, error);
      alert('Failed to update status.');
    }
  };

  const handleConfirmPayment = async () => {
    if (!user || !activeRide || activeRide.status !== 'completed') {
      alert('Cannot confirm payment.');
      return;
    }
    try {
      await updateRide(activeRide.id, { status: 'paid' });
    } catch (error) {
      console.error(`Error confirming payment:`, error);
      alert('Failed to confirm payment.');
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    try {
      await saveDriverSettings(user.uid, settings);
      alert('Settings saved!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save.');
    }
  };

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
    </div>
  );
};

export default DriverApp;