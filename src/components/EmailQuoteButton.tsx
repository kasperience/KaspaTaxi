import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface EmailQuoteButtonProps {
  className?: string;
}

const EmailQuoteButton: React.FC<EmailQuoteButtonProps> = ({ className }) => {
  const [showWarning, setShowWarning] = useState(false);
  // Try to detect Brave browser - not 100% reliable but catches most cases
  const isBrave = () => {
    // Check for Brave-specific navigator property
    if ((window as any).navigator.brave !== undefined) {
      return true;
    }

    // Check for Brave in the user agent (less reliable)
    if (navigator.userAgent.includes('Brave')) {
      return true;
    }

    // Check for Chrome without Google in the user agent (potential indicator)
    if (navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Google')) {
      return true;
    }

    return false;
  };

  const handleClick = () => {
    // Open email client
    window.location.href = 'mailto:sales@kasperience.xyz?subject=KaspaTaxi%20Customization%20Quote%20Request&body=I%20am%20interested%20in%20customizing%20KaspaTaxi%20for%20my%20business.%20Please%20provide%20me%20with%20more%20information%20and%20a%20quote.%0A%0AThank%20you!';

    // If we detect Brave browser, show the warning
    if (isBrave()) {
      setShowWarning(true);
      // Hide warning after 10 seconds
      setTimeout(() => setShowWarning(false), 10000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={className || "bg-[#16A085] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0E6655] transition-colors"}
      >
        Get a Customization Quote
      </button>

      {showWarning && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-lg z-10 animate-fadeIn">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Brave browser detected!
              </p>
              <p className="text-xs mt-1 text-amber-700">
                If your email client didn't open, please check Brave's pop-up blocker settings:
              </p>
              <ol className="text-xs mt-1 text-amber-700 list-decimal ml-4 space-y-1">
                <li>Click the Brave shield icon in the address bar</li>
                <li>Make sure "Block pop-ups" is turned OFF for this site</li>
                <li>Refresh the page and try again</li>
              </ol>
              <p className="text-xs mt-2 text-amber-700 font-medium">
                Alternatively, email us directly at: <a href="mailto:sales@kasperience.xyz" className="text-[#1ABC9C] hover:text-[#16a085] font-medium">sales@kasperience.xyz</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailQuoteButton;
