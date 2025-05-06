import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { CarTaxiFront as Taxi, CreditCard, Shield, MapPin, Wallet, Navigation, MessageSquare, Github, Twitter } from 'lucide-react';
import DriverApp from './components/DriverApp';
import WebApp from './components/WebApp';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookiePolicy from './components/CookiePolicy';
import FooterDonation from './components/FooterDonation';
import Contributing from './components/Contributing';
import Readme from './components/Readme';
import License from './components/License';
import EmailQuoteButton from './components/EmailQuoteButton';
import PrivacyBanner from './components/PrivacyBanner';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleBookRideClick = () => {
    navigate('/app');
  };

  const handleBecomeDriverClick = () => {
    navigate('/driver');
  };
  return (
    <div className="min-h-screen bg-[#1ABC9C] relative">
      {/* Hero Section */}
      <div
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(26, 188, 156, 0.9), rgba(26, 188, 156, 0.9)), url("https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <nav className="absolute top-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Taxi className="h-8 w-8 text-white" />
              <span className="text-2xl text-white font-bold">Kaspa<span className="font-normal text-[#F1C40F] bg-black px-1 rounded">Taxi</span></span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="text-white hover:text-[#F1C40F] transition-colors">Features</a>
              <a href="#how-it-works" className="text-white hover:text-[#F1C40F] transition-colors">How It Works</a>

            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              The Future of Taxi Service is Decentralized.
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              Ride smart, pay smart
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <button
              onClick={handleBookRideClick}
              className="bg-[#F1C40F] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#1ABC9C] transition-colors">Book a Ride</button>
               <button onClick={handleBecomeDriverClick} className="bg-white text-[#1ABC9C] px-8 py-3 rounded-lg font-semibold hover:bg-[#F1C40F] hover:text-gray-900 transition-colors">
                Become a Driver
              </button>
            </div>
            <div className="flex justify-center">
              <EmailQuoteButton className="bg-[#16A085] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0E6655] transition-colors" />
            </div>
          </div>
      </div>

      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose KaspaTaxi?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <CreditCard className="h-12 w-12 text-[#1ABC9C]" />, title: 'Instant Payments', description: 'No waiting for payment processing. Instant settlements with Kaspa blockchain.' },
              { icon: <Shield className="h-12 w-12 text-[#1ABC9C]" />, title: 'Decentralized & Trustless', description: 'No intermediaries. Direct peer-to-peer transactions between riders and drivers.' },
              { icon: <Wallet className="h-12 w-12 text-[#1ABC9C]" />, title: 'Low Transaction Fees', description: "Minimal transaction costs thanks to Kaspa's efficient blockchain." } // Used double quotes
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div id="tech-stack" className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Technology Stack
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Frontend</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• React with TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Vite build tool</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Data & Auth</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Firebase Firestore</li>
                <li>• Google Authentication</li>
                <li>• Real-time updates</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Blockchain</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Kaspa Blockchain</li>
                <li>• Direct payments</li>
                <li>• Low transaction fees</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Maps</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• OpenStreetMap</li>
                <li>• Real-time location</li>
                <li>• Route visualization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <MapPin className="h-12 w-12 text-[#1ABC9C]" />, title: 'Book a Ride' },
              { icon: <Wallet className="h-12 w-12 text-[#1ABC9C]" />, title: 'Pay with Kaspa' },
              { icon: <Navigation className="h-12 w-12 text-[#1ABC9C]" />, title: 'Enjoy the Ride' }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                {index < 2 && <div className="hidden md:block absolute transform translate-x-[200%] translate-y-6">→</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="book-now" className="bg-[#1ABC9C] py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Ready to Transform Your Ride Experience?
          </h2>
          <Link to="/app" className="bg-[#F1C40F] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-[#F39C12] transition-colors">
            Book a Ride Now
          </Link>
        </div>
      </div>


      {/* Footer - enhanced with content from MD files */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Taxi className="h-6 w-6" />
                <span className="text-xl font-bold">Kaspa<span className="font-normal text-[#F1C40F] bg-black px-1 rounded">Taxi</span></span>
              </div>
              <p className="text-gray-400 text-sm">Decentralized ride-booking on the Kaspa blockchain.</p>
              <div className="text-gray-400 mt-2 text-sm flex flex-col gap-1">
                <a href="/app" className="hover:text-white transition-colors">
                  Rider App
                </a>
                <a href="/driver" className="hover:text-white transition-colors">
                  Driver App
                </a>
              </div>
              {/* Add the FooterDonation component here */}
              <FooterDonation />
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link to="/license" className="text-gray-400 hover:text-white transition-colors">MIT License</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/contributing" className="text-gray-400 hover:text-white transition-colors">Contribution Guidelines</Link></li>
                <li><Link to="/readme" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                {/* Removed the Security link */}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex flex-col space-y-2 mb-4">
                <a href="https://github.com/kasperience/KaspaTaxi" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Github className="h-4 w-4 mr-2" /> GitHub Repository
                </a>
                <a href="https://x.com/KASperiencexyz" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Twitter className="h-4 w-4 mr-2" /> Twitter
                </a>
              </div>
              <p className="text-gray-400 text-sm">
                Contact: <a href="mailto:dev@KASperience.xyz" className="hover:text-white">dev@KASperience.xyz</a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 KASperience. All rights reserved.</p>
            <p className="text-xs mt-2">
              This project is licensed under the <a href="LICENSE.md" className="hover:text-white">MIT License</a>.
              We welcome <a href="CONTRIBUTING.md" className="hover:text-white">contributions</a> of all kinds.
            </p>
          </div>
        </div>
      </footer>
      {/* Removed the old DonationCard component from here */}
    </div>
  );
};


function App() {
  // We don't need to track the state here since the component handles it internally
  const handlePrivacyAccept = () => {
    // This function is passed to the PrivacyBanner component
    // The banner component will handle setting the localStorage value
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<WebApp />} />
        <Route path="/driver" element={<DriverApp />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/contributing" element={<Contributing />} />
        <Route path="/readme" element={<Readme />} />
        <Route path="/license" element={<License />} />
      </Routes>
      <PrivacyBanner onAccept={handlePrivacyAccept} />
    </Router>
  );
};

export default App;
