// src/components/RideHistoryPanel.tsx
import React, { useState } from 'react';
import { Ride } from '../types/ride';
import { ChevronDown, ChevronUp, Clock, MapPin, DollarSign } from 'lucide-react';

// Helper function to calculate distance between two coordinates in kilometers
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

// Helper function to format ride duration
const formatDuration = (startTime: any, endTime: any): string => {
  if (!startTime || !endTime) return 'N/A';

  try {
    const start = startTime.toDate();
    const end = endTime.toDate();
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.round(durationMs / 60000);

    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return `${hours}h ${minutes}min`;
    }
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 'N/A';
  }
};

interface RideHistoryPanelProps {
  rides: Ride[];
  isLoading: boolean;
}

const RideHistoryPanel: React.FC<RideHistoryPanelProps> = ({ rides, isLoading }) => {
  const [expandedRides, setExpandedRides] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const toggleRideExpansion = (rideId: string) => {
    setExpandedRides(prev => ({
      ...prev,
      [rideId]: !prev[rideId]
    }));
  };

  // Filter rides based on search term
  const filteredRides = rides.filter(ride => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const dateStr = ride.timestamp?.toDate().toLocaleDateString() || '';
    const timeStr = ride.timestamp?.toDate().toLocaleTimeString() || '';
    const idMatch = ride.id.toLowerCase().includes(searchLower);
    const statusMatch = ride.status.toLowerCase().includes(searchLower);
    const dateMatch = dateStr.toLowerCase().includes(searchLower);
    const timeMatch = timeStr.toLowerCase().includes(searchLower);
    const fareMatch = ride.fareUSD ? `${ride.fareUSD}`.includes(searchLower) : false;

    return idMatch || statusMatch || dateMatch || timeMatch || fareMatch;
  });
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Ride History</h2>
        {rides.length > 0 && (
          <button
            onClick={() => {
              const allExpanded = rides.every(ride => expandedRides[ride.id]);
              const newState = !allExpanded;
              const updatedExpanded: Record<string, boolean> = {};
              rides.forEach(ride => {
                updatedExpanded[ride.id] = newState;
              });
              setExpandedRides(updatedExpanded);
            }}
            className="text-sm text-[#1ABC9C] hover:underline flex items-center"
          >
            {rides.every(ride => expandedRides[ride.id]) ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                Collapse All
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                Expand All
              </>
            )}
          </button>
        )}
      </div>

      {!isLoading && rides.length > 0 && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by date, time, status, or fare..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent"
            />
            <svg
              className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-center text-gray-900 text-lg font-semibold">Loading...</p>
      ) : rides.length > 0 ? (
        filteredRides.length > 0 ? (
          <div className="space-y-4">
            {filteredRides.map((ride) => (
            <div key={ride.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleRideExpansion(ride.id)}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${ride.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <div>
                    <p className="text-gray-900 font-semibold capitalize">{ride.status}</p>
                    <p className="text-xs text-gray-500">
                      {ride.timestamp?.toDate().toLocaleDateString()} •
                      {ride.fareUSD && <span className="ml-1">${ride.fareUSD.toFixed(2)}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  {ride.startTime && ride.endTime && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mr-2">
                      {formatDuration(ride.startTime, ride.endTime)}
                    </span>
                  )}
                  {expandedRides[ride.id] ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </div>
              </div>

              {expandedRides[ride.id] && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center mb-2">
                        <MapPin size={16} className="text-[#1ABC9C] mr-2" />
                        <h4 className="text-sm font-semibold text-gray-700">Trip Details</h4>
                      </div>
                      {ride.pickupCoords && ride.dropoffCoords && (
                        <p className="text-sm text-gray-600 mb-1">
                          Distance: <span className="font-semibold">{calculateDistance(ride.pickupCoords, ride.dropoffCoords).toFixed(2)} km</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        From: {ride.pickupCoords ? `${ride.pickupCoords[1].toFixed(4)}, ${ride.pickupCoords[0].toFixed(4)}` : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        To: {ride.dropoffCoords ? `${ride.dropoffCoords[1].toFixed(4)}, ${ride.dropoffCoords[0].toFixed(4)}` : 'N/A'}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center mb-2">
                        <DollarSign size={16} className="text-[#1ABC9C] mr-2" />
                        <h4 className="text-sm font-semibold text-gray-700">Payment Details</h4>
                      </div>
                      {ride.fareUSD && (
                        <>
                          <p className="text-sm text-gray-600 mb-1">
                            USD: <span className="font-semibold">${ride.fareUSD.toFixed(2)}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            KAS: <span className="font-semibold">{ride.fareKAS?.toFixed(2)}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Rate: ${ride.driverRatePerKm?.toFixed(2) || '1.50'}/km
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Clock size={16} className="text-[#1ABC9C] mr-2" />
                      <h4 className="text-sm font-semibold text-gray-700">Time Details</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Request Time:</p>
                        <p className="text-sm text-gray-700 font-medium">
                          {ride.timestamp?.toDate().toLocaleTimeString()}
                        </p>
                      </div>
                      {ride.startTime && (
                        <div>
                          <p className="text-xs text-gray-500">Start Time:</p>
                          <p className="text-sm text-gray-700 font-medium">
                            {ride.startTime.toDate().toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                      {ride.endTime && (
                        <div>
                          <p className="text-xs text-gray-500">End Time:</p>
                          <p className="text-sm text-gray-700 font-medium">
                            {ride.endTime.toDate().toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                      {ride.startTime && ride.endTime && (
                        <div>
                          <p className="text-xs text-gray-500">Duration:</p>
                          <p className="text-sm text-gray-700 font-medium">
                            {formatDuration(ride.startTime, ride.endTime)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No rides match your search</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#1ABC9C] hover:underline"
            >
              Clear search
            </button>
          </div>
        )
      ) : (
        <p className="text-center text-gray-900 text-lg font-semibold">No completed rides found.</p>
      )}
    </div>
  );
};

export default RideHistoryPanel;
