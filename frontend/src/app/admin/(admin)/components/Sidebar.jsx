"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { HiOutlineLogout } from 'react-icons/hi';
import DestroyerPopup from '../components/DestroyerPopup';
import { 
  HiOutlineViewGrid, HiOutlineUserGroup, HiOutlinePhotograph, 
  HiOutlineInformationCircle, HiOutlineChatAlt2, HiOutlineQuestionMarkCircle,
  HiOutlineMenuAlt2, HiOutlineX
} from 'react-icons/hi';
import { GoProjectRoadmap } from "react-icons/go";
import { RiRocketLine, RiTeamLine, RiArticleLine, RiLayoutGridLine } from 'react-icons/ri';
import { TiSocialFacebook } from "react-icons/ti";
import toast from 'react-hot-toast';
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux"
// import { userDets } from '@/app/admin/(admin)/redux/slices/loggedInUserDets/loggedInUserDetsSlice';
import { userDets } from '../redux/slices/loggedInUserDets/loggedInUserDetsSlice';
import { deleteCookie } from 'cookies-next';




export default function Sidebar({ isOpen, setIsOpen }) {
const userdets = useSelector((state) => state.user?.userData?.user);
const dispatch = useDispatch();

useEffect(() => {
  dispatch(userDets());
}, []);

// console.log(userdets)
  

  const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HiOutlineViewGrid },
  { name: 'Hero Section', href: '/admin/hero', icon: RiRocketLine },
  { name: 'About Us', href: '/admin/about', icon: HiOutlineInformationCircle },
  { name: 'Projects', href: '/admin/projects', icon: GoProjectRoadmap },
  { name: 'Mission', href: '/admin/mission', icon: RiLayoutGridLine },
  { name: 'Team', href: '/admin/team', icon: HiOutlineUserGroup },
  { name: 'Gallery', href: '/admin/gallery', icon: HiOutlinePhotograph },
  { name: 'Blogs', href: '/admin/blogs', icon: RiArticleLine },
  { name: 'Client Message', href: '/admin/messages', icon: HiOutlineChatAlt2 },
  { name: 'FAQs', href: '/admin/faqs', icon: HiOutlineQuestionMarkCircle },
  { name: 'Social & Others', href: '/admin/others', icon: TiSocialFacebook },
  { name: 'Change Password', href: '/admin/change-password', icon: RiAdminFill },
];

// Add User Management only if user is super admin
// Assuming userdets.isAdmin === 1 means super admin
if (userdets?.isAdmin === 1) {
  menuItems.push({
    name: 'User Management',
    href: '/admin/manage-users', 
    icon: HiOutlineUserGroup, 
  });
}
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // LOGOUT API INTEGRATED 
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);


const handleLogoutApi = async () => {
    setIsLoggingOut(true);
    try {
      // 1. Clear Cookies with all possible variations that production might use
      const options = { path: '/', domain: window.location.hostname.includes('localhost') ? 'localhost' : 'puwakholaonehydro.com.np' };
      
      deleteCookie('token', options);
      
      // 2. Clear common fallback (without explicit domain)
      deleteCookie('token', { path: '/' });

      // 3. Optional: If your backend has a logout endpoint, call it here
      // await axios.post('/api/auth/logout');

      toast.success("Logout successful");
      
      // 4. Force a hard redirect to ensure state is wiped
      window.location.href = '/admin/login'; 
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };
  // LOGOUT API INTEGRATED END 

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
      >
        {mobileOpen ? <HiOutlineX size={24} /> : <HiOutlineMenuAlt2 size={24} />}
      </button>

      <aside className={`
        fixed top-0 left-0 h-screen bg-[#0f172a] text-slate-400 transition-all duration-300 z-50
        ${isOpen ? 'w-64' : 'w-20'} 
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
            {(isOpen || mobileOpen) && (
              <span className="text-xl font-bold text-white tracking-tight">
                Puwakhola<span className="text-indigo-500"> Admin</span>
              </span>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="hidden lg:block hover:text-white">
              <HiOutlineMenuAlt2 size={22} />
            </button>
          </div>

          <nav className="flex-1 my-scroll overflow-y-auto py-6 px-3 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}
                  className={`flex items-center p-3 rounded-xl transition-all group
                    ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <item.icon size={22} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'} />
                  {(isOpen || mobileOpen) && <span className="ml-4 font-medium">{item.name}</span>}
                </Link>
              );
            })}

            {/* Bottom Logout Button */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center w-full p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
        >
          <HiOutlineLogout size={22} className="group-hover:scale-110 transition-transform" />
          {isOpen && <span className="ml-4 font-medium">Logout</span>}
        </button>
      </div>

      {/* REUSABLE LOGOUT MODAL */}
      <DestroyerPopup
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        primaryAction={handleLogoutApi}
        actionText="Yes, Logout"
        loading={isLoggingOut}
      >
        <p>Are you sure you want to end your session? You will need to login again to access the admin panel.</p>
      </DestroyerPopup>
          </nav>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}