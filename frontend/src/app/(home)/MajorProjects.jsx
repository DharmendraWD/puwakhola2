// components/MajorProjects.js

import React from 'react';
import Image from 'next/image'; // Recommended for Next.js image optimization

// Data for the three project cards
const projectsData = [
  {
    id: 1,
    title: "Puwa Khola One Hydropower Project",
    description: "The Puwa Khola One Hydropower Project is a 4 MW run-of-river hydroelectric plant located in the Ilam District of Koshi Province, Nepal.",
    // Replace with your local image path or hosted URL
    imageSrc: "https://media.istockphoto.com/id/1073416084/photo/shocked-young-woman-looking-at-laptop-screen.jpg?s=612x612&w=0&k=20&c=_2OwVoe5iwNnKWGg6auirOs5i5G7gVra69hq_OfYrR0=", 
    imageAlt: "Puwa Khola Dam Site"
  },
  {
    id: 2,
    title: "Aayu Malung Khola Hydropower",
    description: "The Puwa Khola One Hydropower Project is a 4 MW run-of-river hydroelectric plant located in the Ilam District of Koshi Province, Nepal.",
    // Replace with your local image path or hosted URL
    imageSrc: "https://media.istockphoto.com/id/667138552/photo/portrait-of-a-woman-working-online-at-home.jpg?s=170667a&w=0&k=20&c=HCSYdeBgMpqB_ealarmN4V2ZBUQHIaKYyjOhjAjxGyQ=", 
    imageAlt: "Aayu Malung Khola Weir"
  },
  {
    id: 3,
    title: "Khola One Hydropower Project",
    description: "The Puwa Khola One Hydropower Project is a 4 MW run-of-river hydroelectric plant located in the Ilam District of Koshi Province, Nepal.",
    // Replace with your local image path or hosted URL
    imageSrc: "https://media.istockphoto.com/id/1073416084/photo/shocked-young-woman-looking-at-laptop-screen.jpg?s=612x612&w=0&k=20&c=_2OwVoe5iwNnKWGg6auirOs5i5G7gVra69hq_OfYrR0=", 
    imageAlt: "Khola One Dam View"
  },
];

// Reusable Card Component
const ProjectCard = ({ project }) => {
  return (
    // Card container with the hover effect
    // Hover effects: subtle scale up, shadow increase, and border color change
    <div className="bg-white rounded-none rounded-br-[95px] shadow-lg hover:shadow-2xl border border-white hover:border-blue-500 
                    transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
      
      {/* Image Container */}
      <div className="relative w-full aspect-[2/1] overflow-hidden rounded-t-xl">
        <img
          src={project.imageSrc}
          alt={project.imageAlt}
          // The image should cover the container and have smooth transition
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Text Content */}
      <div className="p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {project.description}
        </p>
      </div>
    </div>
  );
};


const MajorProjects = () => {
  return (
    // Section container with generous vertical padding
    <section className="py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Major Projects
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 md:mb-16">
          Major Projects that we have worked on, and successfully completed
        </p>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default MajorProjects;