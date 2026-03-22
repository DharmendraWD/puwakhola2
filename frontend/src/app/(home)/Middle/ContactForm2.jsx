"use client";
import React from 'react'
import { MdEmail, MdPhone, MdLocationOn, MdMap } from 'react-icons/md';
import { FaLinkedinIn, FaTwitter, FaTelegramPlane, FaInstagram, FaYoutube } from 'react-icons/fa';

import { motion } from 'framer-motion';

// --- Custom Icon Components (Ensuring self-contained file) ---



// --- Framer Motion Variants for Staggered Animation ---

// Main container for staggering child animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.15,
    },
  },
};

// Animation for individual items (contact points)
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// Animation for the two main cards (Info and Form)
const cardVariants = {
    hiddenLeft: { opacity: 0, x: -50 },
    hiddenRight: { opacity: 0, x: 50 },
    visible: { 
        opacity: 1, 
        x: 0, 
        transition: { 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            duration: 0.8
        } 
    },
};


const ContactSection = () => {
  const contactDetails = [
    { icon: MdEmail, label: 'Email Address', value: 'malunhydra@gmail.com' },
    { icon: MdPhone, label: 'Phone Number', value: '+977 1 4102710' },
    { icon: MdMap, label: 'Office Location', value: 'Anamnagar-29, Kathmandu, Nepal' },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary2)] py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center" id='contact'>
      
      
      {/* Main Grid Container */}
      <motion.div
        className="max-w-[1400px] w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" // Animation triggered when scrolling into view
        viewport={{ once: true, amount: 0.2 }}
      >

        {/* --- Left Side: Contact Info & Details --- */}
        <motion.div
            className="p-8 md:p-12 bg-[#3c3e43] rounded-2xl shadow-2xl relative overflow-hidden"
            variants={cardVariants}
            initial="hiddenLeft"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
          {/* Header */}
          <motion.h2 
            className="text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight"
            variants={itemVariants}
          >
            Get In Touch With Us
          </motion.h2>

          <motion.p 
            className="text-white text-lg mb-10"
            variants={itemVariants}
          >
            We'd love to hear from you. Reach out to us through any of the channels below.
          </motion.p>
          
          {/* Contact Points */}
          <motion.div 
            className="space-y-8"
            variants={containerVariants} // Use container for staggering the children below
          >
            {contactDetails.map((detail, index) => (
              <motion.div 
                key={index} 
                className="flex items-start space-x-4"
                variants={itemVariants}
              >
                <div className="flex-shrink-0 p-3 bg-[var(--primary1)] rounded-full text-white shadow-lg">
                  <detail.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{detail.label}</h3>
                  <p className="text-indigo-200 hover:text-indigo-100 transition duration-200">
                    {detail.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Icons */}
          <motion.div 
            className="mt-12 flex space-x-5"
            variants={itemVariants}
          >
            <a href="#" aria-label="LinkedIn" className="text-[var(--primary1)] hover:text-indigo-400 transition transform hover:scale-110">
              <FaLinkedinIn className="h-8 w-8" />
            </a>
            <a href="#" aria-label="Twitter" className="text-[var(--primary1)] hover:text-indigo-400 transition transform hover:scale-110">
              <FaTwitter className="h-8 w-8" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-[var(--primary1)] hover:text-indigo-400 transition transform hover:scale-110">
              <FaYoutube className="h-8 w-8" />
            </a>
            <a href="#" aria-label="Twitter" className="text-[var(--primary1)] hover:text-indigo-400 transition transform hover:scale-110">
              <FaInstagram className="h-8 w-8" />
            </a>
            <a href="#" aria-label="Twitter" className="text-[var(--primary1)] hover:text-indigo-400 transition transform hover:scale-110">
              <FaTelegramPlane className="h-8 w-8" />
            </a>
         
          </motion.div>

        </motion.div>


        {/* --- Right Side: Contact Form --- */}
        <motion.div 
            className="p-8 md:p-12 bg-white rounded-2xl shadow-2xl space-y-6"
            variants={cardVariants}
            initial="hiddenRight"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
          {/* Mock Form Structure */}
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Send a Message</h3>

          {/* Name Field */}
          <motion.div variants={itemVariants}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Jane Smith"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 outline-none hover:shadow-md"
            />
          </motion.div>

          {/* Email Field */}
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="jane@email.com"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 outline-none hover:shadow-md"
            />
          </motion.div>
          
          {/* Message Field */}
          <motion.div variants={itemVariants}>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              id="message"
              rows="5"
              placeholder="I want to collaborate..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 resize-none outline-none hover:shadow-md"
            ></textarea>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <button
              type="submit"
              className="w-full py-4 px-6 bg-[var(--primary1)] text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Send Message
            </button>
          </motion.div>

        </motion.div>

      </motion.div>
    </div>
  );
};

export default ContactSection;