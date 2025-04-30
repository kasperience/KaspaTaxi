import React, { useState } from 'react';
import { Copy, CheckCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function FooterDonation() {
  const [copied, setCopied] = useState(false);
  // Updated donation address
  const kaspaAddress = 'kaspa:qr02ac46a6zwqzxgp97lcjw3th4f70x9mq24jsk6vgfmvvhy39lpyksqj24y5';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(kaspaAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-700">
      <h4 className="font-semibold mb-2 text-sm">Donate</h4>
      <div className="flex items-center space-x-4">
        <div className="bg-white p-1 rounded">
          <QRCodeSVG value={kaspaAddress} size={64} />
        </div>
        <div>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-1 text-xs"
            title="Copy address"
          >
            {copied ? (
              <>
                <CheckCheck className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#49EACB]" />
                <span className="text-gray-400 hover:text-white">Copy Address</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-1 break-all" title={kaspaAddress}>
            {kaspaAddress.substring(0, 10)}...{kaspaAddress.substring(kaspaAddress.length - 5)}
          </p>
        </div>
      </div>
    </div>
  );
}
