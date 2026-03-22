
export const dynamic = "force-dynamic";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Zap } from 'lucide-react';
import Link from 'next/link';

// API fetch function
async function getOtherContent() {
  try {
    const baseUrl = process.env.BASE_API || 'http://localhost:4000/api';
    const apiUrl = `${baseUrl}/contents/other`;
    
    const res = await fetch(apiUrl, { 
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch content data: ${res.status}`);
    }
    
    const data = await res.json();
    return data?.data[0] || null;
  } catch (error) {
    console.error('Error fetching content data:', error);
    return null;
  }
}

export default async function Footer() {
  // Fetch content data on server
  const contentData = await getOtherContent();
  
  // Use data from API or fallback data
  const companyDescription = contentData?.d || "Leading Nepal's renewable energy revolution with sustainable hydropower solutions.";
  const email = contentData?.email || "puwakholahydropower@gmail.com";
  const phone = contentData?.mobNo || "01-4102710";
  const phone2 = contentData?.mobNo2 || "";
  const address = contentData?.address || "Durga bhawan, Anamnagar, Kathmandu";
  const developedBy = contentData?.developedby || "Aayu Softtech";
  const copyright = contentData?.copyright || "© 2024 Puwakhola Hydropower. All rights reserved.";
  const socialLinks = {
    insta: contentData?.insta || "#",
    twitter: contentData?.twitter || "#",
    fb: contentData?.fb || "#",
    yt: contentData?.yt || "#"
  };

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Our Team', href: '#team' },
  ];

  const resources = [
    { label: 'News & Updates', href: '#news' },
    { label: 'Careers', href: '#careers' },
    { label: 'Investors', href: '#investors' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">Puwakhola</span>
            </div>
            <p className="text-gray-400 mb-6">
              {companyDescription}
            </p>
            <div className="flex gap-3">
              <Link 
                href={socialLinks.fb} 
                target="_blank" 
                className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link 
                href={socialLinks.twitter} 
                target="_blank" 
                className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link 
                href="#" 
                target="_blank" 
                className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link 
                href={socialLinks.insta} 
                target="_blank" 
                className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks?.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <Link 
                  href={`mailto:${email}`} 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {email}
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <Link 
                    href={`tel:${phone}`} 
                    className="text-gray-400 hover:text-blue-400 transition-colors block"
                  >
                    {phone}
                  </Link>
                  {phone2 && phone2 !== phone && (
                    <Link 
                      href={`tel:${phone2}`} 
                      className="text-gray-400 hover:text-blue-400 transition-colors block"
                    >
                      {phone2}
                    </Link>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <Link 
                  href="https://maps.app.goo.gl/zBEoZtxCqZJDw8mH6" 
                  target='_blank' 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {address}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col justify-center items-center gap-4">
            <p className="text-gray-400 text-sm text-center">
              {copyright}
            </p>
            <div className="text-gray-700 text-sm text-center">
              Developed by {developedBy}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}