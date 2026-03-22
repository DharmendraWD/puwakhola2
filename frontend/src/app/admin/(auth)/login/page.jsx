"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { RiGoogleFill, RiGithubFill } from 'react-icons/ri';
import logo from "../../../../../public/logo.jpeg"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import "../../../admin/admin.css"
import { CgSpinner } from 'react-icons/cg';
import DialogueModal from '../../(admin)/components/DialogueModal';
import toast from 'react-hot-toast';
import { setCookie } from 'cookies-next'; // Install: npm install cookies-next



export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

// frontend login page
const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
        credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      // Set cookie
  //     setCookie('token', data.token, {
  //       maxAge: 30 * 24 * 60 * 60,
  //       path: '/',
  //    secure: process.env.NODE_ENV === "production",
  // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  //     });


      setCookie("token", data.token, {
  maxAge: 30 * 24 * 60 * 60,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  domain: process.env.NODE_ENV === "production"
    ? "puwakholaonehydro.com.np"
    : "localhost",
});


      toast.success("Login successful!");
      
      // Small delay to ensure cookie is set
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 100);
      
    } else {
      setError(data.message || "Invalid credentials. Please try again.");
      toast.error(data.message || "Invalid credentials. Please try again.");
    }
  } catch (err) {
    console.error("Login error:", err);
    setError("Network error. Please check your connection.");
    toast.error("Network error. Please check your connection.");
  } finally {
    setLoading(false);
  }
};





  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center lg:p-0 p-4">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl flex overflow-hidden min-h-[600px]">
        
        {/* Left Side */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#262c31] relative overflow-hidden flex-col justify-center p-12 text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>

          <div className="relative z-10">
            <Image src={logo} alt="logo" className="w-20 rounded-full h-20 mb-4 mx-auto" />
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Manage your <br /> 
              <span className="text-indigo-200 underline decoration-wavy decoration-indigo-300">Digital Presence</span> <br /> 
              with ease.
            </h2>
            <p className="text-indigo-100 text-lg mb-8">
              The most powerful and <b className='font-semibold'>user-friendly</b> admin panel for your business.
            </p>
            <div className="flex gap-4">
              <div className="h-1 w-12 bg-white rounded-full"></div>
              <div className="h-1 w-4 bg-indigo-300 rounded-full"></div>
              <div className="h-1 w-4 bg-indigo-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <HiOutlineMail size={20} />
                </div>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-700"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <HiOutlineLockClosed size={20} />
                </div>
                <input 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-700"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all shadow-xl 
                ${loading 
                  ? "bg-indigo-400 cursor-not-allowed text-white/80" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98]"
                }`}
            >
              {loading ? (
                <>
                  <CgSpinner className="animate-spin" size={24} />
                  <span>Authenticating...</span>
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative cursor-pointer flex justify-center text-xs uppercase"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="bg-white text-indigo-600 font-bold hover:bg-[#c0cbff21] transition duration-300 ease-in-out rounded-full px-[5px] pb-[4px] hover:text-indigo-700 tracking-widest">
                  Ahh I don't have an Account <span className='text-[28px] abolute top-[13px]'>&#x1F926;</span>
                </span>
              </div>
            </div>
          </form>

          <DialogueModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            title="Account Access"
          >
            <p>
              To maintain security, accounts are created exclusively by the 
              <span className="font-bold text-indigo-600"> Main Administrator</span>.
            </p>
            <p className="mt-4 text-sm">
              Please reach out to your department head to receive your official credentials. 
              Once provided, you can log in here to access your dashboard.
            </p>
          </DialogueModal>
        </div>
      </div>
    </div>
  );
}