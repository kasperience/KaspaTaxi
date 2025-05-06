// src/components/Documentation.tsx
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CarTaxiFront as Taxi, CreditCard, Shield, MapPin, Wallet, Navigation, MessageSquare } from 'lucide-react';
import CopyableCodeBlock from './CopyableCodeBlock';

const Documentation = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // If there's a hash in the URL, scroll to that element
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Add a small delay to ensure the DOM is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });

          // Add a visual highlight effect
          const originalBackground = element.style.backgroundColor;
          element.style.backgroundColor = 'rgba(241, 196, 15, 0.2)'; // Light yellow highlight
          setTimeout(() => {
            element.style.backgroundColor = originalBackground;
          }, 2000);
        }, 100);
      }
    }
  }, [location]);

  // Add click handler for anchor links to enable smooth scrolling
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });

        // Add a visual highlight effect
        const originalBackground = element.style.backgroundColor;
        element.style.backgroundColor = 'rgba(241, 196, 15, 0.2)'; // Light yellow highlight
        setTimeout(() => {
          element.style.backgroundColor = originalBackground;
        }, 2000);

        // Update the URL without triggering a page reload
        window.history.pushState(null, '', href);
      }
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8" id="documentation-top">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-10 max-w-4xl mx-auto">
        <div className="prose max-w-none">
          <div align="center">
            <img src="/src/assets/taxi-icon.png" alt="KaspaTaxi Logo" width="200" />
            <h1 className="text-3xl font-bold mb-6 text-gray-900">KaspaTaxi</h1>
            <p className="mb-4">A decentralized ride-hailing platform built on the Kaspa blockchain</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link to="/" className="text-[#1ABC9C] hover:text-[#16a085] font-medium mr-4">
                ← Back to Home
              </Link>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <nav className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Quick Navigation:</h3>
              <div className="flex flex-wrap gap-3">
                <a href="#overview" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">Overview</a>
                <span className="text-gray-400">•</span>
                <a href="#key-features-mvp" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">Key Features</a>
                <span className="text-gray-400">•</span>
                <a href="#getting-started" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">Getting Started</a>
                <span className="text-gray-400">•</span>
                <a href="#contribution-guidelines" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">Contributing</a>
                <span className="text-gray-400">•</span>
                <a href="#license" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">License</a>
                <span className="text-gray-400">•</span>
                <a href="#donations" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">Donations</a>
              </div>
            </nav>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-gray-900" id="overview">Overview</h2>

          <p className="mb-6">
            KaspaTaxi is a decentralized ride-hailing platform that enables direct peer-to-peer transactions between riders and drivers without intermediaries, reducing fees and increasing earnings for drivers.
          </p>

          <p className="mb-6">
            Built on the Kaspa blockchain, KaspaTaxi leverages the speed and efficiency of Kaspa's BlockDAG architecture to provide near-instant payment confirmations, making it practical for real-world transportation services.
          </p>

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

          <div className="mb-8 text-center">
            <Link to="/features" className="inline-block bg-[#1ABC9C] hover:bg-[#16a085] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              View All Features
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-gray-900" id="getting-started">Getting Started</h2>

          <h3 className="text-xl font-bold mb-3 text-gray-900">Prerequisites</h3>

          <ul className="list-disc pl-6 mb-6">
            <li>Node.js (v14 or higher)</li>
            <li>npm or yarn</li>
            <li>A Kaspa wallet (for payments)</li>
          </ul>

          <h3 className="text-xl font-bold mb-3 text-gray-900">Installation</h3>

          <ol className="list-decimal pl-6 mb-6">
            <li className="mb-4">
              <p className="mb-2"><strong>Clone the Repository:</strong></p>
              <CopyableCodeBlock>
{`git clone https://github.com/YOUR-USERNAME/KaspaTaxi.git
cd KaspaTaxi/kaspaTaxi
# Note: Ensure you are in the correct sub-directory`}
              </CopyableCodeBlock>
            </li>
            <li className="mb-4">
              <p className="mb-2"><strong>Install Dependencies:</strong></p>
              <CopyableCodeBlock>
{`npm install
# or
yarn install`}
              </CopyableCodeBlock>
            </li>
            <li className="mb-4">
              <p className="mb-2"><strong>Set up Environment Variables:</strong></p>
              <p className="mb-2">Create a <code>.env</code> file in the project root with the following variables:</p>
              <CopyableCodeBlock>
{`VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token`}
              </CopyableCodeBlock>
            </li>
            <li className="mb-4">
              <p className="mb-2"><strong>Start the Development Server:</strong></p>
              <CopyableCodeBlock>
{`npm run dev
# or
yarn dev`}
              </CopyableCodeBlock>
            </li>
          </ol>

          <h3 className="text-xl font-bold mb-3 text-gray-900">Usage</h3>

          <p className="mb-4">Once the development server is running, you can access the application at <code>http://localhost:5173</code>.</p>

          <ul className="list-disc pl-6 mb-6">
            <li><strong>Rider Interface:</strong> Navigate to <code>/app</code> to use the rider interface.</li>
            <li><strong>Driver Interface:</strong> Navigate to <code>/driver</code> to use the driver interface.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 text-gray-900" id="contribution-guidelines">Contribution Guidelines</h2>

          <p className="mb-4">We welcome contributions to KaspaTaxi! Please follow these steps to contribute:</p>

          <ol className="list-decimal pl-6 mb-6">
            <li>Fork the repository</li>
            <li>Create a feature branch (<code>git checkout -b feature/amazing-feature</code>)</li>
            <li>Commit your changes (<code>git commit -m 'Add some amazing feature'</code>)</li>
            <li>Push to the branch (<code>git push origin feature/amazing-feature</code>)</li>
            <li>Open a Pull Request</li>
          </ol>

          <p className="mb-6">
            <Link to="/contributing" className="text-[#1ABC9C] hover:text-[#16a085] font-medium">
              See our detailed contribution guidelines
            </Link>
          </p>

          <h2 className="text-2xl font-bold mb-4 text-gray-900" id="license">License</h2>

          <p className="mb-4">
            KaspaTaxi is available under a dual licensing model:
          </p>

          <ol className="list-decimal pl-6 mb-6">
            <li>
              <strong>MIT License (for Kaspa Blockchain Use Only)</strong> - Free to use, modify, and distribute when used exclusively with the Kaspa blockchain and KAS native coin.
            </li>
            <li>
              <strong>Commercial License (for Other Blockchains or KRC-20 Tokens)</strong> - For use with blockchains other than Kaspa or with KRC-20 tokens instead of KAS native coin, a commercial license is required.
            </li>
          </ol>

          <p className="mb-6">
            <Link to="/license" className="text-[#1ABC9C] hover:text-[#16a085] font-medium">
              See the full license details
            </Link>
          </p>

          <h2 className="text-2xl font-bold mb-4 text-gray-900" id="donations">Donations</h2>

          <p className="mb-4">
            If you find KaspaTaxi useful and would like to support its development, please consider donating Kaspa to:
          </p>

          <CopyableCodeBlock>
            kaspa:qzk3uh52hx0hnsuvdq7g2xdwdczn7xn6f8afuqe7p7uw8r4lx9ydgscqfzwql
          </CopyableCodeBlock>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <Link to="/" className="text-[#1ABC9C] hover:text-[#16a085] font-medium mb-4 md:mb-0">
              ← Back to Home
            </Link>
            <a href="#documentation-top" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium flex items-center">
              Back to Top ↑
            </a>
          </div>

          <nav className="mt-8 pt-6 border-t border-gray-200 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Quick Navigation:</h3>
            <div className="flex flex-wrap gap-3">
              <a href="#overview" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">Overview</a>
              <span className="text-gray-400">•</span>
              <a href="#key-features-mvp" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">Key Features</a>
              <span className="text-gray-400">•</span>
              <a href="#getting-started" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">Getting Started</a>
              <span className="text-gray-400">•</span>
              <a href="#contribution-guidelines" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">Contributing</a>
              <span className="text-gray-400">•</span>
              <a href="#license" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">License</a>
              <span className="text-gray-400">•</span>
              <a href="#donations" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">Donations</a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
