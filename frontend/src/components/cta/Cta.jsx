"use client";
import { ArrowRight, LocationEdit, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Success Popup Component
function SuccessPopup({ isVisible, message, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 shadow-2xl animate-fadeIn">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-10 h-10 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Aww! Thanks!</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:opacity-90 transition-opacity"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

// API fetch function for contact details
async function getContactDetails() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000/api';
    const apiUrl = `${baseUrl}/contents/other`;
    
    const res = await fetch(apiUrl, { 
      cache: 'no-store' 
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch contact details: ${res.status}`);
    }
    
    const data = await res.json();
    // console.log(data)
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching contact details:', error);
    return [];
  }
}

export default function CTASection() {
  const [contactDetails, setContactDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Fetch contact details on component mount
  useEffect(() => {
    async function fetchContactDetails() {
      try {
        setLoading(true);
        const data = await getContactDetails();
        setContactDetails(data?.[0]) || {};
      } catch (error) {
        console.error('Error loading contact details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContactDetails();
  }, []);


  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000/api';
      const apiUrl = `${baseUrl}/contents/clientmessage`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      const data = await response.json();
      
      // Show success popup
      setPopupMessage('Thanks for reaching out! We\'ll get back to you soon.');
      setShowSuccessPopup(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      // Auto-hide popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section id='contact' className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <SuccessPopup
        isVisible={showSuccessPopup}
        message={popupMessage}
        onClose={() => setShowSuccessPopup(false)}
      />

      <section id='contact' className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white">
              <h2 className="text-4xl lg:text-5xl mb-6">
                Ready to Power Your Vision?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Whether you're interested in partnership opportunities, career prospects, or learning more about our projects, we'd love to hear from you.
              </p>
              
              <div className="space-y-4 mb-8">
                {/* Email 1 */}
                {contactDetails?.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-100">Email us</div>
                      <Link href={`mailto:${contactDetails?.email}`} className="hover:text-cyan-300 transition-colors">
                        {contactDetails?.email}
                      </Link>
                    </div>
                  </div>
                )}

                {/* Email 2 - Malunhydro@gmail.com */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-blue-100">Email us</div>
                    <Link href="mailto:Malunhydro@gmail.com" className="hover:text-cyan-300 transition-colors">
                      Malunhydro@gmail.com
                    </Link>
                  </div>
                </div>

                {/* Phone */}
                {contactDetails?.mobNo && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-100">Call us</div>
                      <Link href={`tel:${contactDetails.mobNo}`} className="hover:text-cyan-300 transition-colors">
                        {contactDetails?.mobNo}
                      </Link>
                    </div>
                  </div>
                )}

                {/* Phone 2 */}
                {contactDetails?.mobNo2 && contactDetails?.mobNo2 !== contactDetails?.mobNo && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-100">Call us</div>
                      <Link href={`tel:${contactDetails?.mobNo2}`} className="hover:text-cyan-300 transition-colors">
                        {contactDetails?.mobNo2}
                      </Link>
                    </div>
                  </div>
                )}

                {/* Address */}
                {contactDetails?.address && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <LocationEdit className="w-5 h-5" />
                    </div>
                    <Link 
                      className='group transition-all duration-300' 
                      href="https://maps.app.goo.gl/zBEoZtxCqZJDw8mH6" 
                      target="_blank"
                    >
                      <div className="text-sm text-blue-100">Address</div>
                      <div className='group-hover:underline group-hover:text-cyan-300 transition-all duration-300'>
                        {contactDetails?.address}
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              <Link 
                href={`mailto:${contactDetails?.email || 'puwakholahydropower@gmail.com'}`} 
                className="px-8 w-fit py-4 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300 flex items-center gap-2 group"
              >
                Get In Touch
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right content - Contact form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl text-white mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-8 py-4 bg-white text-blue-600 rounded-full transition-all duration-300 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-50'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}