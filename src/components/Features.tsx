// src/components/Features.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CarTaxiFront as Taxi, CreditCard, Shield, MapPin, Wallet, Navigation, MessageSquare } from 'lucide-react';

const Features = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-10 max-w-4xl mx-auto">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">KaspaTaxi Features</h1>
          
          <p className="mb-6">
            KaspaTaxi is a decentralized ride-hailing platform built on the Kaspa blockchain. 
            It enables direct peer-to-peer transactions between riders and drivers without intermediaries, 
            reducing fees and increasing earnings for drivers.
          </p>

          <div className="mb-8">
            <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
              ← Back to Home
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-gray-900" id="key-features-mvp">Key Features (MVP - Currently Functional)</h2>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <Shield className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0" />
              <div>
                <strong>User Authentication:</strong> Secure login using Google Authentication (centralized for ease of onboarding in the MVP). In the future, we plan to investigate decentralized identity solutions for user authentication.
              </div>
            </li>
            <li className="flex items-start">
              <MapPin className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0" />
              <div>
                <strong>Location Services:</strong> Real-time location tracking and mapping for both riders and drivers.
              </div>
            </li>
            <li className="flex items-start">
              <Taxi className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0" />
              <div>
                <strong>Ride Requesting:</strong> Riders can request rides with pickup and destination locations.
              </div>
            </li>
            <li className="flex items-start">
              <Wallet className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0" />
              <div>
                <strong>Kaspa Payments:</strong> Direct peer-to-peer payments using Kaspa cryptocurrency.
              </div>
            </li>
            <li className="flex items-start">
              <CreditCard className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0" />
              <div>
                <strong>QR Code Payments:</strong> Easy payment via QR code scanning.
              </div>
            </li>
            <li className="flex items-start">
              <Navigation className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0" />
              <div>
                <strong>Driver Navigation:</strong> Turn-by-turn directions for drivers to reach riders and destinations.
              </div>
            </li>
            <li className="flex items-start">
              <MessageSquare className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0" />
              <div>
                <strong>Ride Status Updates:</strong> Real-time updates on ride status for both riders and drivers.
              </div>
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 text-gray-900">Planned Enhancements & Future Features</h2>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <div className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0 flex items-center justify-center">•</div>
              <div>
                <strong>Automated Ride Matching:</strong> Implement backend logic (likely via Firebase Cloud Functions) for efficient driver assignment.
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0 flex items-center justify-center">•</div>
              <div>
                <strong>On-Chain Transaction Verification:</strong> Integrate Kaspa node interaction (via backend) to confirm payments directly within the app.
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0 flex items-center justify-center">•</div>
              <div>
                <strong>Driver Registration & Verification:</strong> Develop a secure process for driver onboarding, potentially involving smart contracts in later phases.
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0 flex items-center justify-center">•</div>
              <div>
                <strong>Reputation System:</strong> Explore building an on-chain or decentralized reputation system for drivers and riders.
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0 flex items-center justify-center">•</div>
              <div>
                <strong>In-App Communication:</strong> Add chat functionality between rider and driver.
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 text-[#1ABC9C] mr-2 mt-1 flex-shrink-0 flex items-center justify-center">•</div>
              <div>
                <strong>Fare Calculation:</strong> Implement more dynamic fare calculation based on distance, time, etc.
              </div>
            </li>
          </ul>

          <div className="mt-8">
            <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
