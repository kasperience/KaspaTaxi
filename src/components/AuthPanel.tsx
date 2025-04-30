// src/components/AuthPanel.tsx
import React from 'react';
import { User } from 'firebase/auth';
import { CarTaxiFront as Taxi } from 'lucide-react';

interface AuthPanelProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onToggleSettings?: () => void;
  onToggleHistory?: () => void;
  showSettings?: boolean;
  showHistory?: boolean;
  isDriver?: boolean;
}

const AuthPanel: React.FC<AuthPanelProps> = ({
  user,
  onSignIn,
  onSignOut,
  onToggleSettings,
  onToggleHistory,
  showSettings,
  showHistory,
  isDriver = true,
}) => {
  return (
    <div className="text-center pt-10 pb-2">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <Taxi className="h-8 w-8 text-white mr-2" />
        <span className="text-3xl text-white font-bold">
          Kaspa<span className="font-normal text-[#F1C40F] bg-black px-1 rounded">Taxi</span>
        </span>
      </div>
      <p className="text-2xl text-white mb-8">{isDriver ? 'Driver Dashboard' : 'Rider App'}</p>

      {user ? (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
          <p className="text-gray-900 text-lg mb-4">{user.displayName || user.email}</p>
          <div className="flex justify-center space-x-3 mt-2">
            {isDriver && onToggleSettings && (
              <button
                onClick={onToggleSettings}
                className="bg-[#1ABC9C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#16a085] transition-colors"
              >
                {showSettings ? 'Hide Settings' : 'Settings'}
              </button>
            )}
            {isDriver && onToggleHistory && (
              <button
                onClick={onToggleHistory}
                className="bg-white text-[#1ABC9C] px-6 py-2 rounded-lg font-semibold hover:bg-[#16a085] hover:text-white transition-colors border-2 border-[#1ABC9C]"
              >
                {showHistory ? 'Hide History' : 'History'}
              </button>
            )}
            <button
              onClick={onSignOut}
              className="bg-[#1ABC9C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#16a085] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <button
            onClick={onSignIn}
            className="bg-white text-[#1ABC9C] px-8 py-3 rounded-lg font-semibold hover:bg-[#16a085] hover:text-white transition-colors border-2 border-[#1ABC9C]" // Updated class here
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthPanel;
