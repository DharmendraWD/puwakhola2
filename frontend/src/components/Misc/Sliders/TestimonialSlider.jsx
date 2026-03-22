// components/TestimonialSlider.jsx
"use client"; // Required for Next.js App Router for client-side functionality

import React, { useState, useEffect } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { fetchTestimonials } from './testimonialSLiderData'; // Ensure this path is correct

const TestimonialSlider = () => {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // Ensure we check if data exists before accessing the index
  const currentTestimonial = data.length > 0 ? data[currentIndex] : null;

  // 1. Data Fetching
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchTestimonials();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  // 2. Navigation Logic
  const handlePrev = () => {
    if (data.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (data.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === data.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (isLoading) {
    return <div className="text-center p-12 text-white bg-[var(--primary2)] min-h-screen">Loading testimonials...</div>;
  }
  
  if (!currentTestimonial) {
      return <div className="text-center p-12 text-white bg-[var(--primary2)] min-h-screen">No testimonials found.</div>;
  }


  return (
    // Outer Container: Full width, using the 'primary2' Tailwind variable
    <section 
      // The background is set to the 'primary2' variable
      className={`bg-[var(--primary1)] min-h-screen py-10 md:py-20 flex items-center justify-center`}
    >
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-between items-center mb-10 px-4 md:px-0">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Don't just take my word for it
          </h2>
          {/* Navigation Arrows */}
          <div className="flex space-x-3">
            <button 
              onClick={handlePrev}
              className="p-3 rounded-full cursor-pointer bg-white text-[var(--primary2)] hover:bg-gray-200 transition-colors shadow-lg"
              aria-label="Previous testimonial"
            >
              <BsChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext}
              className="p-3 rounded-full cursor-pointer bg-white text-[var(--primary2)] hover:bg-gray-200 transition-colors shadow-lg"
              aria-label="Next testimonial"
            >
              <BsChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area: Left (Text) and Right (Image) */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Side: Testimonial Card */}
          <div className="lg:w-1/2 p-6 sm:p-10 bg-white h-[300px] md:h-[635px] overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-500 ease-in-out"
               // Applying the unique rounded corner styles
               style={{ borderRadius: '110px 40px 40px 40px' }} // Default small screen
            >
            <div className='mb-8'>
              <p className="text-6xl sm:text-7xl font-extrabold text-[var(--primary2)] mb-2">
                {currentTestimonial.satisfactionRate}%
              </p>
              <p className="text-lg text-[var(--primary2)] font-semibold tracking-wider">
                satisfaction rate
              </p>
            </div>
            
            <p className="text-gray-700 text-lg italic leading-relaxed mb-8">
              "{currentTestimonial.quote}"
            </p>
            
            {/* Logo placeholder */}
            <div className="text-3xl text-[var(--primary1)] font-black ">
              {currentTestimonial.logo}
            </div>
          </div>

          {/* Right Side: Image Container */}
          <div 
            className="lg:w-1/2 relative h-[300px] md:h-[635px]  lg:min-h-0 overflow-hidden shadow-2xl"
            // Applying the unique rounded corner styles
            style={{ borderRadius: '40px 40px 110px 40px' }} // Default small screen
          >
            {/* Image element using the dynamic src from API */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                // --- KEY CHANGE: Use imageSrc from the API data ---
                style={{ 
                    backgroundImage: `url(${currentTestimonial.imageSrc})`, 
                    backgroundColor: '#ccc', // Fallback color
                }}
                aria-label={currentTestimonial.imagePlaceholder}
            >
              {/* This inner div helps create the visual space and ensure image cover */}
            </div>
            {/* Overlay for professionalism (optional) */}
            <div className="absolute inset-0 bg-black opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;