import React from 'react';
import { Link } from 'react-router-dom';
import { CarTaxiFront as Taxi, ArrowLeft } from 'lucide-react';

const CookiePolicy = () => {
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
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

        <section className="mb-6">
          <p className="mb-4">This Cookie Policy explains how Kaspa Taxi ("we," "us," or "our") uses cookies and similar technologies when you use our application and services. By using Kaspa Taxi, you consent to the use of cookies as described in this policy.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">What are Cookies?</h2>
          <p className="mb-4">Cookies are small text files that are placed on your device (computer, smartphone, tablet, etc.) when you visit a website or use an application. They are widely used to make websites and applications work more efficiently, as well as to provide information to the owners of the site or app.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">How We Use Cookies</h2>
          <p className="mb-4">We use cookies for the following purposes:</p>
          <ol className="list-decimal pl-6 mb-3">
            <li className="mb-2"><strong>Essential Cookies:</strong> These cookies are necessary for the proper functioning of our application. They enable you to navigate our app and use its features. Without these cookies, some services may not be available.</li>
            <li className="mb-2"><strong>Performance and Analytics Cookies:</strong> These cookies help us understand how users interact with our application, such as which pages are visited most often and if any errors occur. This information helps us improve the performance and user experience of Kaspa Taxi.</li>
            <li className="mb-2"><strong>Functionality Cookies:</strong> These cookies allow our application to remember choices you make (such as language preferences) and provide enhanced, more personalized features.</li>
            <li className="mb-2"><strong>Security:</strong> Cookies may help us identify and prevent security risks.</li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Types of Cookies We Use</h2>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-2"><strong>Session Cookies:</strong> These are temporary cookies that are erased when you close your browser or exit the application.</li>
            <li className="mb-2"><strong>Persistent Cookies:</strong> These cookies remain on your device for a set period or until you delete them.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Managing Cookies</h2>
          <p className="mb-4">You can manage your cookie preferences through your browser settings. Most browsers allow you to:</p>
          <ul className="list-disc pl-6 mb-3">
            <li className="mb-1">View the cookies that are stored.</li>
            <li className="mb-1">Delete individual cookies.</li>
            <li className="mb-1">Block third-party cookies.</li>
            <li className="mb-1">Block cookies from particular sites.</li>
            <li className="mb-1">Block all cookies from being set.</li>
          </ul>
          <p className="mb-4">Please note that blocking or deleting cookies may affect the functionality of our application and may prevent you from accessing certain features.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="mb-4">If you have any questions about our Cookie Policy, please contact us at: <a href="mailto:dev@KASperience.xyz" className="text-[#1ABC9C] hover:text-[#16a085] font-medium">dev@KASperience.xyz</a></p>
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

export default CookiePolicy;