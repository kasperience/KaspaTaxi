// src/components/PrivacyBanner.tsx
import React, { useState, useEffect } from 'react';

interface PrivacyBannerProps {
  onAccept: () => void;
}

const PrivacyBanner: React.FC<PrivacyBannerProps> = ({ onAccept }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted the policy
    const hasAccepted = localStorage.getItem('privacyPolicyAccepted') === 'true';
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacyPolicyAccepted', 'true');
    setIsVisible(false);
    onAccept();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1ABC9C] text-white p-5 shadow-lg z-50 animate-slideUp border-t-4 border-[#F1C40F]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Privacy Notice</h3>
            <p className="text-sm leading-relaxed">
              By using KaspaTaxi, you acknowledge and accept our Privacy Policy,
              Cookie Policy, and Terms of Service. We collect and process location data to provide ride services, use cookies for
              essential functionality, and share necessary data with drivers. We use third-party map services (Mapbox) which has
              its own privacy policy. Email addresses are collected for authentication and account management purposes only.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-3 md:mt-0">
            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
              <a
                href="/privacy"
                className="text-white hover:text-[#F1C40F] text-sm font-medium underline"
              >
                Privacy Policy
              </a>
              <span className="text-white text-xs hidden md:inline">•</span>
              <a
                href="/cookies"
                className="text-white hover:text-[#F1C40F] text-sm font-medium underline"
              >
                Cookie Policy
              </a>
              <span className="text-white text-xs hidden md:inline">•</span>
              <a
                href="/terms"
                className="text-white hover:text-[#F1C40F] text-sm font-medium underline"
              >
                Terms of Service
              </a>
            </div>
            <button
              onClick={handleAccept}
              className="bg-[#F1C40F] hover:bg-[#F39C12] text-gray-900 px-6 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap shadow-md"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyBanner;
