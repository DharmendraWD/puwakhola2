// components/AmazingServicesSection.js

import React from 'react';
import { Briefcase, Zap, Users, DollarSign, HardHat } from 'lucide-react'; 
import RoundedBgBtn from '@/components/Buttons/RoundedBgBtn';

// Data for the service cards (unchanged)
const servicesData = [
  // 1. Project Management (Now occupies a single, standard grid cell)
  {
    id: 1,
    title: "Project Management",
    description: "Streamline your construction journey with expert project planning, scheduling, and execution — ensuring timely delivery and flawless results.",
    icon: Briefcase,
    isFeatured: true, 
  },
  // 2. Sustainability & Safety
  {
    id: 2,
    title: "Sustainability & Safety",
    description: "We prioritize green building practices and strict safety standards to deliver projects that are environmentally responsible and worker-friendly.",
    icon: Zap,
    isFeatured: false,
  },
  // 3. Human resources
  {
    id: 3,
    title: "Human resources",
    description: "Enhance your team with my comprehensive HR consulting, from recruitment to employee engagement.",
    icon: Users,
    isFeatured: false,
  },
  // 4. Cost & Resource Planning
  {
    id: 4,
    title: "Cost & Resource Planning",
    description: "Optimize budgets and resources with accurate forecasting, transparent costing, and efficient allocation that keeps projects under control.",
    icon: DollarSign, 
    isFeatured: false,
  },
  // 5. Design & Engineering
  {
    id: 5,
    title: "Design & Engineering",
    description: "Transform ideas into reality with our professional design and engineering services, blending creativity, safety, and functionality.",
    icon: HardHat, 
    isFeatured: false,
  },
];

// Reusable Card Component with conditional styling
const ServiceCard = ({ service }) => {
  const IconComponent = service.icon;
  
  // Base classes for the card (ensures equal height/width across all service cards)
  let cardClasses = `p-6 group rounded-br-[95px] md:p-8 rounded-2xl h-full transition-all duration-500 ease-in-out cursor-pointer`;
  
  // Styling for all service cards (id=1 to 5)
  // All cards will now use the same hover effect
  cardClasses += `bg-white group border border-gray-100 shadow-md 
                  hover:bg-[var(--primary1)] hover:text-[white] hover:border-transparent 
                  hover:shadow-2xl hover:scale-[1.03] hover:rotate-1`; 


  // Determine text and icon colors: Start with the default gray/blue look
  let iconBg = 'bg-blue-50';
  let iconColor = 'text-blue-600';
  let textColor = 'text-gray-900';
  let descColor = 'text-gray-600';
  
  // Adjust colors for the hovered state (handled by the hover: classes above)
  // When hovered, the classes will dynamically apply text-white and other styles.

  return (
    // The main grid item, which will now be the same size as its siblings
    <div className={cardClasses}>
      
      <div className={`flex items-center mb-4 transition-colors duration-500 `}>
        {/* Icon */}
        <div className={`p-2 rounded-full mr-4 ${iconBg}`}>
          <IconComponent className={`${iconColor} group-hover:text-blue-600`} size={24} />
        </div>
        
        {/* Title */}
        <h3 className={`text-xl font-semibold ${textColor} group-hover:text-white transition-colors duration-500`}>
          {service.title}
        </h3>
      </div>
      
      {/* Description */}
      <p className={`mt-3 text-base leading-relaxed ${descColor} group-hover:text-white transition-colors duration-500`}>
{service.description} 
      </p>
    </div>
  );
};


const AmazingServicesSection = () => {
  const headingBlock = {
    title: "Amazing services",
    description: "Our construction expertise is built to meet the unique needs of every client. From planning to execution, we deliver solutions that are reliable, efficient, and designed to last.",
    buttonText: "Let's Build",
  };
  
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: All items flow in a standard grid (3 columns on large screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* 1. The Text Block (First item, no card styling/hover) */}
          <div className="flex flex-col justify-start ">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
              {headingBlock.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              {headingBlock.description}
            </p>
         <RoundedBgBtn label={headingBlock.buttonText}></RoundedBgBtn>
          </div>

          {/* 2. The Service Cards (The rest of the items, all uniform size) */}
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
          
        </div>
      </div>
    </section>
  );
};

export default AmazingServicesSection;