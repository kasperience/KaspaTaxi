// src/components/Documentation.tsx
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CarTaxiFront as Taxi, CreditCard, Shield, MapPin, Wallet, Navigation, MessageSquare } from 'lucide-react';
import CopyableCodeBlock from './CopyableCodeBlock';
import taxiIconSrc from '../assets/taxi-icon.png';
import qrCodeSrc from '../assets/qr-code.png';

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

          // Scroll to the element without highlighting
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

        // Scroll to the element without highlighting

        // Update the URL without triggering a page reload
        window.history.pushState(null, '', href);
      }
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8" id="documentation-top">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-10 max-w-4xl mx-auto">
        <div className="prose max-w-none">
          <div className="text-center flex flex-col items-center">
            <img src={taxiIconSrc} alt="KaspaTaxi Logo" width="200" className="mx-auto" />
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
                <a href="#deployment-options" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">Deployment Options</a>
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

          <h3 className="text-xl font-bold mb-3 text-gray-900" id="deployment-options">Deployment Options</h3>

          <p className="mb-4">KaspaTaxi offers two deployment approaches to suit different needs:</p>

          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold text-lg mb-2">Option 1: Client-Only Deployment (Simple)</h4>
              <ul className="list-disc pl-6">
                <li><strong>Branch:</strong> <code>main</code></li>
                <li><strong>Description:</strong> Simpler setup with all functionality in the client</li>
                <li><strong>Best for:</strong> Quick demos, learning, and development</li>
                <li><strong>Security note:</strong> API keys are stored in client-side code (not recommended for production)</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-lg mb-2">Option 2: Secure Server Deployment (Recommended for Production)</h4>
              <ul className="list-disc pl-6">
                <li><strong>Branch:</strong> <code>server</code></li>
                <li><strong>Description:</strong> Secure architecture with server-side API handling</li>
                <li><strong>Best for:</strong> Production deployments and public-facing applications</li>
                <li><strong>Security benefits:</strong> API keys are protected on the server side</li>
              </ul>
            </div>
          </div>

          <h4 className="font-bold mb-2">Choosing the Right Approach</h4>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>For learning and development:</strong> The client-only approach (main branch) is simpler to set up and understand</li>
            <li><strong>For production use:</strong> The secure server approach (server branch) follows best practices for security</li>
            <li><strong>For contributing:</strong> Please follow the secure approach for any production-ready contributions</li>
          </ul>

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
            <Link to="/features#features-top" className="inline-block bg-[#1ABC9C] hover:bg-[#16a085] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              View All Features
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-gray-900" id="getting-started">Getting Started</h2>

          <h3 className="text-xl font-bold mb-3 text-gray-900">Prerequisites</h3>

          <ul className="list-disc pl-6 mb-6">
            <li>Node.js (v18 or higher)</li>
            <li>npm or yarn</li>
            <li>Firebase Account (for development/deployment)</li>
            <li>A Kaspa wallet (for testing payments)</li>
            <li>Firebase Studio or IDE</li>
          </ul>

          <h3 className="text-xl font-bold mb-3 text-gray-900">Installation</h3>

          <div className="mb-8">
            <h4 className="font-bold text-lg mb-3 bg-gray-100 p-2 rounded">Client-Only Approach (main branch)</h4>

            <ol className="list-decimal pl-6 mb-6">
              <li className="mb-4">
                <p className="mb-2"><strong>Clone the Repository:</strong></p>
                <CopyableCodeBlock>
{`git clone https://github.com/YOUR-USERNAME/KaspaTaxi.git
cd KaspaTaxi
# Clone from main branch (default)`}
                </CopyableCodeBlock>
              </li>
              <li className="mb-4">
                <p className="mb-2"><strong>Install Dependencies:</strong></p>
                <CopyableCodeBlock>
{`npm install`}
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
VITE_MAPTILER_API_KEY=your_maptiler_api_key`}
                </CopyableCodeBlock>
              </li>
              <li className="mb-4">
                <p className="mb-2"><strong>Start the Development Server:</strong></p>
                <CopyableCodeBlock>
{`npm run dev`}
                </CopyableCodeBlock>
              </li>
            </ol>
          </div>

          <div className="mb-8">
            <h4 className="font-bold text-lg mb-3 bg-gray-100 p-2 rounded">Secure Server Approach (server branch - Recommended for Production)</h4>

            <ol className="list-decimal pl-6 mb-6">
              <li className="mb-4">
                <p className="mb-2"><strong>Clone the Repository:</strong></p>
                <CopyableCodeBlock>
{`git clone https://github.com/YOUR-USERNAME/KaspaTaxi.git
cd KaspaTaxi

# Switch to the server branch
git checkout server`}
                </CopyableCodeBlock>
              </li>
              <li className="mb-4">
                <p className="mb-2"><strong>Install Client Dependencies:</strong></p>
                <CopyableCodeBlock>
{`npm install`}
                </CopyableCodeBlock>
              </li>
              <li className="mb-4">
                <p className="mb-2"><strong>Set up Client Environment Variables:</strong></p>
                <p className="mb-2">Create a <code>.env</code> file in the project root with the following variables:</p>
                <CopyableCodeBlock>
{`VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id`}
                </CopyableCodeBlock>
              </li>
              <li className="mb-4">
                <p className="mb-2"><strong>Set up Server:</strong></p>
                <CopyableCodeBlock>
{`# Navigate to the server directory
cd server

# Install server dependencies
npm install

# Create .env file with API keys
# Example content:
PORT=3001
MAPTILER_API_KEY=your_maptiler_api_key

# Return to the main directory
cd ..`}
                </CopyableCodeBlock>
              </li>
              <li className="mb-4">
                <p className="mb-2"><strong>Start Both Client and Server:</strong></p>
                <CopyableCodeBlock>
{`# Run both client and server
npm run dev:all

# Or run just the client (if you don't need the server features)
npm run dev`}
                </CopyableCodeBlock>
              </li>
            </ol>
          </div>

          <h3 className="text-xl font-bold mb-3 text-gray-900">Firebase Setup</h3>

          <ol className="list-decimal pl-6 mb-6">
            <li className="mb-4">
              <p className="mb-2"><strong>Create a Firebase project</strong></p>
            </li>
            <li className="mb-4">
              <p className="mb-2"><strong>Enable Firestore and Authentication (Google provider)</strong></p>
            </li>
            <li className="mb-4">
              <p className="mb-2"><strong>Deploy Security Rules:</strong></p>
              <p className="mb-2">After configuring your rules in the <code>firestore.rules</code> file, deploy them using the Firebase CLI:</p>
              <CopyableCodeBlock>
{`# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore for your project (if needed)
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules`}
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

          <div className="flex flex-col items-center mb-6">
            <img src={qrCodeSrc} alt="Kaspa Donation QR Code" width="200" className="mx-auto mb-4" />
          </div>

          <CopyableCodeBlock>
            kaspa:qr02ac46a6zwqzxgp97lcjw3th4f70x9mq24jsk6vgfmvvhy39lpyksqj24y5
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
              <a href="#deployment-options" onClick={handleAnchorClick} className="text-[#1ABC9C] hover:text-[#16a085] font-medium">Deployment Options</a>
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
