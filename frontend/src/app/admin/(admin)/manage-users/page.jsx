"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePhotograph,
  HiOutlineX,
  HiOutlineShieldCheck,
  HiOutlineShieldExclamation,
  HiOutlineCalendar,
  HiOutlineHashtag,
  HiOutlineRefresh,
} from "react-icons/hi";
import { FaUserShield, FaUserCog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  createUser,
  deleteUser,
} from "../redux/slices/userSlice/userSlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import DestroyerPopup from "../components/DestroyerPopup";

import { userDets } from '../redux/slices/loggedInUserDets/loggedInUserDetsSlice';
// import { userDets } from '@/app/admin/(admin)/redux/slices/loggedInUserDets/loggedInUserDetsSlice';



export default function UsersPage() {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.users.usersData);
  const loading = useSelector((state) => state.users.loading);
  

  /* ============================
     LOCAL STATE
  ============================ */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const fileInputRef = useRef(null);

  // Form fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobNo: "",
    gender: "male",
    isAdmin: "0", // Default to Admin (0)
  });

  /* ============================
     FETCH DATA
  ============================ */


const userdets = useSelector((state) => state.user?.userData?.user);
useEffect(() => {
  dispatch(userDets());
}, []);

  useEffect(() => {
    if (userdets?.isAdmin === 1) {
      dispatch(getAllUsers());
    }
  }, [dispatch, userdets?.isAdmin]);

  /* ============================
     HANDLERS
  ============================ */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large! Please select an image under 5MB.");
        return;
      }

      setSelectedFile({
        file: file,
        name: file.name,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const clearSelection = (e) => {
    e?.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    // Validation
    const requiredFields = ['fullName', 'email', 'password', 'mobNo'];
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (missingFields.length > 0) {
      toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a profile image");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }



    // Prepare form data
    const submitData = new FormData();
    submitData.append("fullName", formData.fullName);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("mobNo", formData.mobNo);
    submitData.append("gender", formData.gender);
    submitData.append("isAdmin", formData.isAdmin);
    submitData.append("image", selectedFile.file);

    try {
      await dispatch(createUser(submitData));
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDelete = async () => {
    if (userToDelete) {
      await dispatch(deleteUser(userToDelete));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      mobNo: "",
      gender: "male",
      isAdmin: "0",
    });
    setSelectedFile(null);
    setShowPassword(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  /* ============================
     DATA PROCESSING
  ============================ */
  const safeUsersData = Array.isArray(usersData) ? usersData : [];

  // Filter users based on search and role
  const filteredUsers = safeUsersData.filter(user => {
    if (!user || typeof user !== 'object') return false;
    
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (user.fullName || "").toLowerCase().includes(searchLower) ||
      (user.email || "").toLowerCase().includes(searchLower)
    
    if (!matchesSearch) return false;
    
    // Role filter
    if (filterRole === "super-admin") return user.isAdmin === 1;
    if (filterRole === "admin") return user.isAdmin === 0;
    return true; // "all"
  });

  // Get stats
  const stats = {
    total: safeUsersData.length,
    superAdmins: safeUsersData.filter(u => u.isAdmin === 1).length,
    admins: safeUsersData.filter(u => u.isAdmin === 0).length,
  };

  /* ============================
     RENDER - ACCESS DENIEDphone.replace
  ============================ */
  if (userdets && !userdets.isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 md:p-16 lg:p-20">
          <HiOutlineShieldExclamation className="mx-auto text-red-400 w-24 h-24 mb-6" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
            Access Denied
          </h1>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            You need Super Admin privileges to access the User Management page.
            Please contact a Super Administrator if you need access.
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-500">
            <HiOutlineShieldCheck className="w-6 h-6" />
            <span>Super Admin Required</span>
          </div>
        </div>
      </div>
    );
  }

  /* ============================
     RENDER - MAIN CONTENT
  ============================ */
  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center">
          <Loading />
        </div>
      )}

      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 sm:px-6 lg:px-8 py-6">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <HiOutlineUserGroup className="text-indigo-600 w-8 h-8" />
              User Management
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Manage system users and permissions ({stats.total} users)
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105 w-full sm:w-auto justify-center text-sm sm:text-base"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add New User
          </button>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Users</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
              </div>
              <div className="bg-indigo-50 text-indigo-600 rounded-lg p-3">
                <HiOutlineUserGroup className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Super Admins</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{stats.superAdmins}</p>
              </div>
              <div className="bg-purple-50 text-purple-600 rounded-lg p-3">
                <FaUserShield className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Admins</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{stats.admins}</p>
              </div>
              <div className="bg-blue-50 text-blue-600 rounded-lg p-3">
                <FaUserCog className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* FILTER AND SEARCH BAR */}
        <div className="mb-6 bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name, email, or phone..."
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm  text-black sm:text-base"
                />
                <HiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
            </div>

            {/* Filter and Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="sm:w-48">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm text-black sm:text-base"
                >
                  <option value="all">All Roles</option>
                  <option value="super-admin">Super Admins Only</option>
                  <option value="admin">Admins Only</option>
                </select>
              </div>
              
              <button
                onClick={() => dispatch(getAllUsers())}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-3 rounded-xl font-medium shadow-sm flex items-center gap-2 transition-all justify-center"
              >
                <HiOutlineRefresh className="w-5 h-5" />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Results Count */}
          {searchQuery && (
            <div className="mt-4 text-sm text-slate-600">
              Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} for "{searchQuery}"
            </div>
          )}
        </div>

        {/* USERS GRID */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredUsers.map((user) => {
              const userId = user.id || user._id;
              if (!userId) return null;
              
              const isSuperAdminUser = user.isAdmin === 1;
              
              return (
                <div
                  key={userId}
                  className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300"
                >
                  {/* User Header with Image */}
                  <div className="relative p-4 sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* User Avatar */}
                      <div className="relative">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                          {user.image ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_BASE_CONTENT_URL}uploads/users/${user.image}`}
                              alt={user.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                              <HiOutlineUser className="w-8 h-8 text-indigo-600" />
                            </div>
                          )}
                        </div>
                        {/* Role Badge */}
                        <div className={`absolute -bottom-2 -right-2 rounded-full p-1.5 shadow-lg ${
                          isSuperAdminUser 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          {isSuperAdminUser ? (
                            <FaUserShield className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <FaUserCog className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                              {user.fullName || "Unnamed User"}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                              {isSuperAdminUser ? "Super Admin" : "Admin"}
                            </p>
                          </div>
                          
                          {/* Delete Button - Only show if not deleting yourself */}
                          <button
                            onClick={() => {
                              setUserToDelete(userId);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete User"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center gap-2 text-sm">
                            <HiOutlineMail className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600 truncate">{user?.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <HiOutlinePhone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">{user?.mobNo}</span>
                          </div>
                          
                          {user.gender && (
                            <div className="flex items-center gap-2 text-sm">
                              <HiOutlineUser className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-600 capitalize">{user?.gender}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <HiOutlineHashtag className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>ID: {userId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{formatDate(user?.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 md:p-16 lg:p-20 text-center">
            <HiOutlineUserGroup
              className="mx-auto text-slate-300 w-16 h-16 sm:w-20 sm:h-20 mb-4"
            />
            <h3 className="text-xl sm:text-2xl font-bold text-slate-600 mb-2">
              {searchQuery ? "No matching users found" : "No Users Found"}
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
              {searchQuery
                ? "Try a different search term or clear the filters"
                : "Add your first user to start managing system access"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg inline-flex items-center gap-2 text-sm sm:text-base"
              >
                <HiOutlinePlus className="w-5 h-5" />
                Add First User
              </button>
            )}
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        <DestroyerPopup
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          title="Delete User?"
          primaryAction={handleDelete}
          actionText="Yes, Delete"
          loading={loading}
          destructive={true}
        >
          <p className="text-slate-600">
            This action cannot be undone. The user will be permanently removed
            from the system and will lose all access.
          </p>
        </DestroyerPopup>

        {/* CREATE USER MODAL */}
        <DestroyerPopup
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title="Add New User"
          primaryAction={handleSubmit}
          actionText="Create User"
          size="xl"
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Profile Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <HiOutlinePhotograph className="text-indigo-500 w-4 h-4 sm:w-5 sm:h-5" />
                Profile Image *
              </label>
              
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl sm:rounded-2xl p-4 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-all cursor-pointer min-h-[120px] sm:min-h-[140px] relative overflow-hidden group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />

                {!selectedFile ? (
                  <div className="text-center animate-in fade-in duration-300">
                    <HiOutlinePhotograph
                      className="text-slate-300 w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 mx-auto group-hover:text-indigo-400 transition-colors"
                    />
                    <p className="font-semibold text-xs sm:text-sm text-slate-600 mb-1">
                      Click to upload profile image
                    </p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                      PNG, JPG (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="w-full animate-in zoom-in-95 duration-300">
                    <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-2 sm:mb-3">
                      <img
                        src={selectedFile.preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl shadow-lg border-4 border-white"
                      />
                      <button
                        type="button"
                        onClick={clearSelection}
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 sm:p-1.5 shadow-md hover:bg-red-600 transition-all"
                      >
                        <HiOutlineX className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-indigo-500 truncate max-w-[180px] sm:max-w-[200px] mx-auto bg-indigo-50 px-2 sm:px-3 py-1 rounded-lg">
                      {selectedFile.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Two Column Layout for Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <HiOutlineUser className="text-indigo-500 w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Enter full name"
                    className="w-full px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <HiOutlineMail className="text-indigo-500 w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                    className="w-full px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <HiOutlineLockClosed className="text-indigo-500 w-4 h-4" />
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Enter password (min 6 characters)"
                      className="w-full px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff className="w-5 h-5" />
                      ) : (
                        <HiOutlineEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Mobile Number */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <HiOutlinePhone className="text-indigo-500 w-4 h-4" />
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobNo}
                    onChange={(e) => setFormData({...formData, mobNo: e.target.value})}
                    placeholder="Enter mobile number"
                    className="w-full px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <HiOutlineUser className="text-indigo-500 w-4 h-4" />
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['male', 'female'].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.gender === option
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={formData.gender === option}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          className="hidden"
                        />
                        <span className="font-medium capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Admin Role */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <HiOutlineShieldCheck className="text-indigo-500 w-4 h-4" />
                    User Role *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "0", label: "Admin", icon: FaUserCog, color: "bg-blue-50 border-blue-500 text-blue-700" },
                      { value: "1", label: "Super Admin", icon: FaUserShield, color: "bg-purple-50 border-purple-500 text-purple-700" },
                    ].map((role) => (
                      <label
                        key={role.value}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.isAdmin === role.value
                            ? role.color
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="isAdmin"
                          value={role.value}
                          checked={formData.isAdmin === role.value}
                          onChange={(e) => setFormData({...formData, isAdmin: e.target.value})}
                          className="hidden"
                        />
                        <role.icon className={`w-6 h-6 mb-2 ${
                          formData.isAdmin === role.value 
                            ? role.value === "1" ? "text-purple-600" : "text-blue-600"
                            : "text-slate-400"
                        }`} />
                        <span className="font-medium text-sm">{role.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Required Fields Note */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                * Required fields: Profile Image, Full Name, Email, Password, Mobile Number
              </p>
            </div>
          </div>
        </DestroyerPopup>
      </div>
    </>
  );
}