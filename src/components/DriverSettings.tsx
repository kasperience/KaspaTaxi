// src/components/DriverSettings.tsx
import React from 'react';
import { DriverSettings } from '../types/ride';

interface DriverSettingsProps {
  settings: DriverSettings;
  onChange: (settings: DriverSettings) => void;
  onSave: () => void;
  kaspaPrice: number;
}

const DriverSettingsComponent: React.FC<DriverSettingsProps> = ({ settings, onChange, onSave, kaspaPrice }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Driver Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-900 text-sm font-semibold mb-2">Kaspa Address</label>
          <input
            type="text"
            value={settings.kaspaAddress}
            onChange={(e) => onChange({ ...settings, kaspaAddress: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
            placeholder="Your Kaspa address"
          />
        </div>
        <div>
          <label className="block text-gray-900 text-sm font-semibold mb-2">Rate per km (USD)</label>
          <input
            type="number"
            value={settings.ratePerKm}
            onChange={(e) => onChange({ ...settings, ratePerKm: parseFloat(e.target.value) || 0 })}
            step="0.1"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
          />
        </div>
        {kaspaPrice > 0 && (
          <p className="text-sm text-gray-600">Current KAS price: ${kaspaPrice.toFixed(4)} USD</p>
        )}
        <button
          onClick={onSave}
          className="w-full bg-[#1ABC9C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16a085] transition-colors animate-pulse"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default DriverSettingsComponent;
