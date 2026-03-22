// components/ProvenProcess.js
import React from 'react';
import arrow from "../../../../public/arrow.png";
import Image from 'next/image';
import RoundedBgBtn from '@/components/Buttons/RoundedBgBtn';

// Data for the three process steps
const processSteps = [
  {
    id: 1,
    title: "Intro call",
    duration: "10 min",
    description: "A quick conversation to understand your vision, requirements, and project goals..",
  },
  {
    id: 2,
    title: "Planning & Research",
    duration: "7 days",
    description: "Detailed site study, requirement analysis, and feasibility checks to gather all insights and prepare the best roadmap.",
  },
  {
    id: 3,
    title: "Consulting & feedback",
    duration: "14 days",
    description: "We present expert recommendations, cost estimates, and tailored strategies — ensuring you have a clear path forward before execution",
  },
];

// Reusable Step Component
const ProcessStep = ({ step, isLast, index }) => {
  const primaryColorClass = 'text-indigo-600'; // Placeholder for the blue text/line color
  const primaryBgClass = 'bg-indigo-600'; // Placeholder for the blue line color

  return (
    <div className={`flex flex-col w-full px-2 sm:px-4 md:w-1/3 relative z-10`}  style={{ flex: step.id }}>
        
        {/* --- Top Half: Number and Line --- */}
        <div className="flex flex-col items-baseline justify-start h-8 md:h-12 relative">
            {/* 1. Number */}
           <h1 className='font-semibold text-[30px] text-[var(--primary1)]'>{step.id}</h1>
<Image height={300} width={300} src={arrow} alt="Arrow" className="w-[70%]" />

        </div>

        {/* --- Middle Half: Title and Duration --- */}
        <div className="flex justify-between items-end mt-4">
            <h3 className="text-xl text-gray-900 leading-snug">
                {step.title}
            </h3>
            <span className="text-sm text-gray-500 font-medium ml-4 flex-shrink-0">
                {step.duration}
            </span>
        </div>

        {/* --- Bottom Half: Description --- */}
        <div className="mt-2 pb-8 md:pb-0 text-left">
            <p className="text-gray-600 text-base">
                {step.description}
            </p>
        </div>
    </div>
  );
};


const Process = () => {
    const primaryBgClass = 'bg-indigo-600'; // Placeholder for the blue button color

    return (
        <section className="bg-white py-16 md:py-24 text-center">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
                    Our Proven Process
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 md:mb-20">
                    A clear, structured workflow designed to make your project smooth, efficient, and successful.
                </p>
                
                {/* --- Timeline Container (Desktop View) --- */}
                <div className="hidden md:flex relative justify-between w-full">
                    
               
                    {/* Render Steps */}
                    {processSteps.map((step, index) => (
                        <ProcessStep 
                            key={step.id} 
                            step={step} 
                            isLast={step.id === processSteps.length}
                        />
                    ))}
                </div>

                {/* --- Timeline Container (Mobile/Tablet View) --- */}
                {/* On mobile, we switch to a simple vertical stack for readability. */}
                <div className="md:hidden flex flex-col items-start w-full mt-4">
                    {processSteps.map((step, index) => (
                        <div key={step.id} className="w-full pb-6 border-b border-gray-200 last:border-b-0">
                            <ProcessStep 
                                step={step} 
                                isLast={step.id === processSteps.length}
                            />
                        </div>
                    ))}
                </div>

                {/* Call to Action Button */}
                <div className="mt-12 md:mt-16">
                  <RoundedBgBtn label=" Schedule intro call" />
                </div>

            </div>
        </section>
    );
};

export default Process;