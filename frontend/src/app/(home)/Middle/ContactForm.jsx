// components/ContactForm.jsx
"use client"; // Form interaction requires client-side behavior

import React, { useEffect, useState } from 'react';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaLinkedinIn, FaTwitter, FaTelegramPlane, FaInstagram, FaYoutube } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Link } from 'lucide-react';








const ContactForm = () => {
    
    const [data, setdata] = useState({ team: [] })
    
    const getData = async () => {
      try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/homepage/footer`)
      const data = await res.json()
      setdata(data?.footer)
        
      } catch (error) {
        console.log(error)
      }
    }
    
    useEffect(() => {
      getData()
    }, [])

    const socialLinks = [
  { icon: FaLinkedinIn, href:data[0]?.linkedin,label: "LinkedIn" },
  { icon: FaTwitter, href:data[0]?.x , label: "Twitter" },
  { icon: FaTelegramPlane, href: data[0]?.telegram, label: "Telegram" },
  { icon: FaInstagram, href: data[0]?.instagram, label: "Instagram" },
  { icon: FaYoutube, href: data[0]?.youtube, label: "YouTube" },
];

    

    // State to handle form inputs (necessary for client-side functionality)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    // Helper component for the contact details list
    const ContactItem = ({ Icon, title, content, isLink = false }) => (
        <div className="flex items-start mb-6">
            {/* Circular Icon */}
            <div className={`p-3 rounded-full bg-[var(--primary1)] bg-opacity-10 text-white mr-4 flex-shrink-0`}>
                <Icon className="w-6 h-6" />
            </div>
            
            {/* Text Content */}
            <div>
                <p className="text-xl font-semibold text-gray-900">{title}</p>
                {isLink ? (
                    <a href={title === "My email" ? `mailto:${content}` : "#"} 
                       className="text-gray-600 hover:text-primary1 transition-colors">
                        {content}
                    </a>
                ) : (
                    <p className="text-gray-600">{content}</p>
                )}
            </div>
        </div>
    );

const [isloading, setisloading] = useState(false)

    async  function addClientMess  (e) {
                e.preventDefault();
                setisloading(true)                
                try {
          const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/homepage/client-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if(!res.ok) throw new Error( 'Something went wrong');

            setisloading(false);
            setFormData({
                name: '',
                email: '',
                message: ''
            });
            
            toast.success('Message sent successfully!');
            
        } catch (error) {
            setisloading(false);
           toast.error(error.message || "Something went wrong");
        }
    }

    return (
        <section className="py-12 md:py-24" id='contact'>
            <div className="container mx-auto px-4 max-w-[1440px]">
                
                {/* Main Grid: Contact Info (Left) and Form (Right) */}
                <div  className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
                    
                    {/* Left Column: Text and Contact Details */}
                    <div className="lg:pr-10" data-aos="zoom-in-left">
                        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
                    {data[0]?.heading ?   data[0]?.heading : "Get In Touch With Us. "}
                        </h2>
                        <p className="text-lg text-gray-700 mb-12 max-w-md">
                          {data[0]?.desc}
                        </p>

                        {/* Contact Items */}
                        <div className="space-y-4 mb-10">
                            <ContactItem 
                                Icon={MdEmail} 
                                title=" email" 
                                content={"malunhydro@gmail.com"} 
                                isLink
                            />
                            <ContactItem 
                                Icon={MdPhone} 
                                title="Phone us" 
                                content={`00977-1- 4102710`}
                                isLink={false}
                            />
                            <ContactItem 
                                Icon={MdLocationOn} 
                                title="Location" 
                                content={"Anamnagar-29, Kathmandu, Nepal"} 
                                isLink
                            />
                        </div>

                        {/* Footer Social Icons */}
                        <div className="flex space-x-4 pt-4 border-t border-gray-200">
                            {socialLinks.map((social, index) => (
                                <a

                                    key={index}
                                    href={social.href} 
                                    aria-label={social.label}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-primary1 transition-colors"
                                >
                                    <social.icon className="w-6 h-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div data-aos="zoom-in-right" className="p-8 sm:p-10 bg-white rounded-[30px] shadow-xl w-full">
                        <form onSubmit={addClientMess} className="space-y-6">
                            
                            {/* Name Input */}
                            <div>
                                <label htmlFor="name" className="block text-gray-800 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Jane Smith"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary1 focus:border-primary1 transition-colors"
                                    required
                                    disabled={isloading}
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-gray-800 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="jane@framer.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary1 focus:border-primary1 transition-colors"
                                    required
                                    disabled={isloading}
                                />
                            </div>

                            {/* Message Input */}
                            <div>
                                <label htmlFor="message" className="block text-gray-800 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="I want to collaborate..."
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary1 focus:border-primary1 transition-colors resize-none"
                                    required
                                    disabled={isloading}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                disabled={isloading}

                                type="submit"
                                className="w-full cursor-pointer py-3 bg-[var(--primary1)] text-white text-lg font-semibold rounded-lg hover:bg-opacity-90 transition-all shadow-md"
                            >
                                {isloading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;