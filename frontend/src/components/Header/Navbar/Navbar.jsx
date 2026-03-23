"use client";
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import logo from "../../../../public/logo.jpeg"
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { 
      label: 'About Us', 
      href: '#about',
      subLinks: [
        { label: 'Financial', href: '/financial' },
        { label: 'Management Team', href: '/management-team' },
      ]
    },
    { label: 'Projects', href: '#projects' },
    { label: 'Our Team', href: '#team' },
    { label: 'Gallery', href: '#gallery' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl">
                <Image src={logo.src} alt="Logo" width={48} height={48} className="object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Puwakhola
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <div 
                key={link.label} 
                className="relative group"
                onMouseEnter={() => link.subLinks && setIsAboutOpen(true)}
                onMouseLeave={() => link.subLinks && setIsAboutOpen(false)}
              >
                <div className="flex items-center gap-1 cursor-pointer py-2">
                  <a
                    href={link.href}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                  {link.subLinks && (
                    <ChevronDown className={`w-4 h-4 text-[#00b5dd] transition-transform duration-200 ${isAboutOpen ? 'rotate-180' : ''}`} />
                  )}
                </div>

                {/* Desktop Dropdown */}
                {link.subLinks && (
                  <AnimatePresence>
                    {isAboutOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                      >
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            <Link href="#contact" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all active:scale-95">
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.subLinks ? (
                    <div className="space-y-2">
                      <button 
                        onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                        className="flex items-center justify-between w-full text-lg font-medium text-gray-800"
                      >
                        {link.label}
                        <ChevronDown className={`w-5 h-5 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileAboutOpen && (
                        <div className="pl-4 space-y-3 border-l-2 border-blue-100 ml-1">
                          {link.subLinks.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="block py-1 text-gray-600"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={link.href}
                      className="block text-lg font-medium text-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  )}
                </div>
              ))}
              <Link 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;