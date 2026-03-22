"use client";
import React, { useEffect } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineUser } from 'react-icons/hi';
import { useDispatch, useSelector } from "react-redux"
import { userDets } from '../redux/slices/loggedInUserDets/loggedInUserDetsSlice';
// import { userDets } from '@/app/admin/(admin)/redux/slices/loggedInUserDets/loggedInUserDetsSlice';

export default function DashboardPage() {

const userdets = useSelector((state) => state.user?.userData?.user);
const dispatch = useDispatch();

useEffect(() => {
  dispatch(userDets());
}, []);

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Overview </h1>
        <p className="text-slate-500 mt-2 text-lg">Manage your application content and users.</p>
      </header>

      {/* Modern Interactive User Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative overflow-hidden bg-white p-8 rounded-3xl shadow-xl border border-slate-100 group">
          {/* Decorative Background SVG */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50 rounded-full transition-transform group-hover:scale-110 duration-500" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              {
                userdets ? (
                  userdets?.image ? (
                    <>
                    <img src={process.env.NEXT_PUBLIC_BASE_CONTENT_URL +"uploads/users/"+userdets?.image} alt="User" className="w-full h-full object-cover rounded-2xl" />
                    </>
                  ) : (
                    <HiOutlineUser size={48} />
                  )
                ) : (
                  <HiOutlineUser size={48} />
                )
              }
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-800">{userdets? userdets?.fullName : ""}</h2>
              <p className="text-indigo-600 font-semibold mb-1 italic">{userdets ? userdets?.isAdmin ? "You are a Super Admin" : "You are an Admin" : ""}</p>
              <p className="text-indigo-600 font-semibold mb-6 italic">{userdets ? userdets?.gender : ""}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <HiOutlineMail className="text-indigo-500" size={20} />
                  <span className="text-slate-600 font-medium">{userdets ? userdets?.email : ""}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <HiOutlinePhone className="text-indigo-500" size={20} />
                  <span className="text-slate-600 font-medium">{userdets ? userdets?.mobNo : ""}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-2">Account Status</h3>
            <p className="text-4xl font-bold mb-4 italic">Verified</p>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[100%] rounded-full shadow-[0_0_10px_#6366f1]" />
            </div>
            <p className="text-sm text-slate-400 mt-4"></p>
          </div>
          {/* Subtle SVG Grid */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
      </div>
    </div>
  );
}