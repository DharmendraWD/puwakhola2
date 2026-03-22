



"use client";
import Sidebar from './components/Sidebar';
import StoreProvider from './redux/storeProvider/StoreProvider';
import "../admin.css"
import React, { useEffect, useState } from 'react';
import ToastProvider from '../../../components/toast/ToastProvider';


// Create a client component that uses Redux inside StoreProvider
function AdminContent({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar will get user data from its own useSelector */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 ease-in-out 
        ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} 
        w-full min-h-screen relative`}
      >
        <div className="p-4 md:p-8 pt-20 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <StoreProvider>
      <ToastProvider />
      <AdminContent>
        {children}
      </AdminContent>
    </StoreProvider>
  );
}

