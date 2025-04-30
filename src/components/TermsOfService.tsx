import React from 'react';
import { Link } from 'react-router-dom';
import { CarTaxiFront as Taxi, ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1ABC9C] text-white p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Taxi className="h-6 w-6" />
            <span className="text-xl font-bold">Kaspa<span className="font-normal text-[#F1C40F] bg-black px-1 rounded">Taxi</span></span>
          </div>
          <Link to="/" className="flex items-center text-white hover:text-[#F1C40F]">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-6 bg-white my-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using the Kaspa Taxi application (the "App"), you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.</p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
          <p className="mb-4">Kaspa Taxi is a decentralized transportation service that connects passengers with drivers. The App provides a platform for users to request and offer rides, manage payments, and communicate with each other. All operations are supported by the Kaspa blockchain network.</p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
          
          <h3 className="text-lg font-medium mt-4 mb-2">a. Eligibility</h3>
          <p className="mb-3">You must be of legal age in your jurisdiction to use the App and agree to accept full responsibility for your account.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-2">b. Account Security</h3>
          <p className="mb-3">You are responsible for maintaining the confidentiality of your account credentials and are fully responsible for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-2">c. Prohibited Conduct</h3>
          <p className="mb-3">You agree not to engage in any of the following prohibited activities:</p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-1">Violating any applicable law or regulation.</li>
            <li className="mb-1">Using the App for any illegal or unauthorized purpose.</li>
            <li className="mb-1">Impersonating any person or entity.</li>
            <li className="mb-1">Harassing, threatening, or intimidating other users.</li>
            <li className="mb-1">Transmitting any viruses, worms, or other malicious code.</li>
            <li className="mb-1">Attempting to interfere with or disrupt the operation of the App.</li>
            <li className="mb-1">Engaging in any activity that could harm the App, other users, or the Kaspa network.</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-4 mb-2">d. Respectful Conduct</h3>
          <p className="mb-3">Be respectful towards other users and engage in respectful communication.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-2">e. Payment</h3>
          <p className="mb-3">Users will be responsible for payment of rides through the kaspa blockchain.</p>
        </section>
        
        {/* Additional sections 4-11 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
          <p className="mb-4">All intellectual property rights in the App, including but not limited to the software, design, and content, are owned by the Kaspa Taxi project or its licensors. You are granted a limited, non-exclusive, non-transferable license to use the App in accordance with these Terms.</p>
          <p className="mb-4">The Kaspa Taxi project is licensed under the MIT License.</p>
        </section>
        
        {/* Sections 5-11 would follow the same pattern */}
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
          <p className="mb-4">If you have any questions about these Terms, please contact us through the channels outlined in the CONTRIBUTING.md document.</p>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p>© 2025 KASperience. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;