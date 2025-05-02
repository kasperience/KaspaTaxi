import React, { useState } from 'react';
import { X } from 'lucide-react';

interface QuoteRequestFormProps {
  onClose: () => void;
  onSubmit: (formData: {
    name: string;
    email: string;
    company: string;
    message: string;
  }) => Promise<boolean> | boolean;
}

const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call the onSubmit handler and await its result
      const result = await onSubmit(formData);

      if (result) {
        // Success case
        setSuccess(true);
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          company: '',
          message: ''
        });
        // Close the form after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        // The submission function returned false, indicating an error
        setError('Failed to send your request. Please try again later.');
      }
    } catch (err) {
      // Handle any exceptions thrown during submission
      setError('An error occurred while sending your request. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Header with teal background */}
        <div className="bg-[#1ABC9C] p-4 text-white">
          <h2 className="text-2xl font-bold mb-1">Request a Customization Quote</h2>
          <p className="text-white text-opacity-90 text-sm">
            Get a personalized quote for your KaspaTaxi customization
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-[#F1C40F] transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="bg-[#1ABC9C] bg-opacity-10 border border-[#1ABC9C] text-[#0E6655] px-4 py-5 rounded-lg mb-4 text-center">
              <p className="font-medium">Thank you for your request!</p>
              <p className="text-sm mt-1">We'll be in touch with your personalized quote soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <p>{error}</p>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C]"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C]"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="company" className="block text-gray-700 font-medium mb-2">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C]"
                  placeholder="Your company (optional)"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C]"
                  placeholder="Describe your customization needs..."
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F1C40F] text-gray-900 rounded-lg hover:bg-[#F39C12] transition-colors font-medium shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteRequestForm;
