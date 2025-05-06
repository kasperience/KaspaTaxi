import React from 'react';
import { Link } from 'react-router-dom';
import { CarTaxiFront as Taxi, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Introduction</h2>
          <p className="mb-4">This Privacy Policy describes how Kaspa Taxi ("we," "us," or "our") collects, uses, and protects the information of users ("you" or "your") who use the Kaspa Taxi application (the "App"). We are committed to protecting your privacy and ensuring the security of your personal information.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
          <p className="mb-4">As an open-source project, Kaspa Taxi values transparency and user control. We strive to minimize data collection. However, certain information may be collected to provide core functionality and improve user experience.</p>

          <h3 className="text-lg font-medium mt-4 mb-2">Information You Provide Directly</h3>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-1">Account Information: While our current setup does not require user accounts, if accounts are implemented in the future, we may collect information like usernames and email addresses.</li>
            <li className="mb-1">Location Data: The App may collect your location data to provide taxi services. This data is essential for connecting drivers and riders.</li>
            <li className="mb-1">Payment information: When implemented users will provide a way to pay for the service.</li>
            <li className="mb-1">Communications: Any communications you have with us, such as through feedback forms or support requests.</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">Information Collected Automatically</h3>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-1">Usage Data: Information about how you interact with the App, such as the features you use and the time and duration of your interactions.</li>
            <li className="mb-1">Device Information: Details about the device you use to access the App, such as the device type, operating system, and unique device identifiers.</li>
            <li className="mb-1">Technical Information: Error logs and other technical data to aid in debugging and improving the application.</li>
          </ul>
        </section>

        {/* Additional sections would follow */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect for the following purposes:</p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-1">Providing Services: To facilitate taxi services, connect drivers and riders, and manage payment processing.</li>
            <li className="mb-1">Improving the App: To analyze usage patterns, identify bugs, and enhance the functionality and user experience of the App.</li>
            <li className="mb-1">Customer Support: To respond to your inquiries and provide support.</li>
            <li className="mb-1">Security: To monitor and protect the App against fraud and unauthorized access.</li>
            <li className="mb-1">Communications: To communicate with you regarding updates, new features, and important notices.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="mb-4">If you have any questions or concerns about this Privacy Policy, please contact us at: <a href="mailto:dev@KASperience.xyz" className="text-[#1ABC9C] hover:text-[#16a085] font-medium">dev@KASperience.xyz</a></p>
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

export default PrivacyPolicy;