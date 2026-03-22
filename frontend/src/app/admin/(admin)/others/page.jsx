"use client";

import React, { useEffect, useState } from "react";
import {
  HiOutlineGlobe,
  HiOutlineLink,
  HiOutlineDeviceMobile,
  HiOutlineLocationMarker,
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineCode,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineSave,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
  HiOutlineShare,
  HiOutlineHashtag,
} from "react-icons/hi";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLink,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getOtherData,
  updateOtherData,
  updateLocalOtherData,
} from "../redux/slices/otherSlice/otherSlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

export default function OtherPage() {
  const dispatch = useDispatch();
  const otherData = useSelector((state) => state.other.otherData);
  const loading = useSelector((state) => state.other.loading);

  /* ============================
     LOCAL STATE
  ============================ */
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Footer sections
    a: "",
    b: "",
    c: "",
    d: "",
    
    // Footer info
    developedby: "",
    copyright: "",
    
    // Contact info
    location: "",
    mobNo: "",
    mobNo2: "",
    address: "",
    
    // Social media
    fb: "",
    twitter: "",
    insta: "",
    yt: "",
  });

  /* ============================
     FETCH DATA
  ============================ */
  useEffect(() => {
    dispatch(getOtherData());
  }, [dispatch]);

  useEffect(() => {
    if (otherData && Object.keys(otherData).length > 0) {
      setFormData({
        a: otherData.a || "",
        b: otherData.b || "",
        c: otherData.c || "",
        d: otherData.d || "",
        developedby: otherData.developedby || "",
        copyright: otherData.copyright || "",
        location: otherData.location || "",
        mobNo: otherData.mobNo || "",
        mobNo2: otherData.mobNo2 || "",
        address: otherData.address || "",
        fb: otherData.fb || "",
        twitter: otherData.twitter || "",
        insta: otherData.insta || "",
        yt: otherData.yt || "",
      });
    }
  }, [otherData]);

  /* ============================
     HANDLERS
  ============================ */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Also update Redux store for immediate UI feedback
    dispatch(updateLocalOtherData({ [field]: value }));
  };

  const handleSave = async () => {
    // Required fields validation
    const requiredFields = [
      'a', 'b', 'c', 'd', 
      'developedby', 'copyright', 
      'location', 'mobNo', 'address'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (missingFields.length > 0) {
      toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      await dispatch(updateOtherData(formData));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleCancel = () => {
    if (otherData && Object.keys(otherData).length > 0) {
      setFormData({
        a: otherData.a || "",
        b: otherData.b || "",
        c: otherData.c || "",
        d: otherData.d || "",
        developedby: otherData.developedby || "",
        copyright: otherData.copyright || "",
        location: otherData.location || "",
        mobNo: otherData.mobNo || "",
        mobNo2: otherData.mobNo2 || "",
        address: otherData.address || "",
        fb: otherData.fb || "",
        twitter: otherData.twitter || "",
        insta: otherData.insta || "",
        yt: otherData.yt || "",
      });
    }
    setIsEditing(false);
  };

  const handleRefresh = () => {
    dispatch(getOtherData());
    toast.success("Data refreshed successfully");
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const formatUrl = (url) => {
    if (!url) return "";
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  /* ============================
     RENDER
  ============================ */
  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center">
          <Loading />
        </div>
      )}

      <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 sm:px-6 lg:px-8 py-6">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <HiOutlineGlobe className="text-indigo-600 w-8 h-8" />
              Site Configuration
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Manage footer content, contact info, and social media links
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105 justify-center"
                >
                  <HiOutlineSave className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all justify-center"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105 justify-center"
                >
                  <HiOutlineLink className="w-5 h-5" />
                  Edit Configuration
                </button>
                <button
                  onClick={handleRefresh}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all justify-center"
                >
                  <HiOutlineRefresh className="w-5 h-5" />
                  Refresh
                </button>
              </>
            )}
          </div>
        </header>

        {/* REQUIRED FIELDS NOTE */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <HiOutlineExclamationCircle className="text-amber-600 w-5 h-5 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Required Fields: Team Heading, Team Para, Footer Slogan Heading, Footer Slogan Paragraph,  Developed By, Copyright, Location, Mobile No, Address
              </p>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT - TWO COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN - FOOTER SECTIONS */}
          <div className="space-y-6">
            {/* FOOTER SECTIONS */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <HiOutlineHashtag className="text-indigo-500" />
                Footer Sections
              </h3>
              <div className="space-y-4">
                {['a', 'b', 'c', 'd'].map((section) => (
                  <div key={section} className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      {section === 'a' ? 'Team Header' : section === 'b' ? 'Team Para' : section === 'c' ? 'Footer Slogan Heading' : section === 'd' ? 'Footer Slogan Para' : ''}
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData[section] || ""}
                        onChange={(e) => handleInputChange(section, e.target.value)}
                        placeholder={`Enter content for section ${section.toUpperCase()}`}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm resize-none"
                      />
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-3 min-h-[80px]">
                        <p className="text-slate-700 whitespace-pre-wrap">
                          {formData[section] || "No content"}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER INFO */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <HiOutlineCode className="text-indigo-500" />
                Footer Information
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Developed By *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.developedby || ""}
                      onChange={(e) => handleInputChange('developedby', e.target.value)}
                      placeholder="Enter developer name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-slate-700">{formData.developedby || "Not set"}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Copyright Text *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.copyright || ""}
                      onChange={(e) => handleInputChange('copyright', e.target.value)}
                      placeholder="Enter copyright text"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-slate-700">{formData.copyright || "Not set"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - CONTACT & SOCIAL */}
          <div className="space-y-6">
            {/* CONTACT INFORMATION */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <HiOutlineHome className="text-indigo-500" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <HiOutlineLocationMarker className="w-4 h-4" />
                    Location *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location || ""}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter location"
                      className="w-full px-3 py-2 overflow-scroll my-scroll rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-slate-700 overflow-scroll my-scroll">{formData.location || "Not set"}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                      <HiOutlinePhone className="w-4 h-4" />
                      Mobile No *
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.mobNo || ""}
                        onChange={(e) => handleInputChange('mobNo', e.target.value)}
                        placeholder="Enter primary mobile number"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                      />
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <a 
                          href={`tel:${formData.mobNo}`}
                          className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          {formatPhoneNumber(formData.mobNo) || "Not set"}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                      <HiOutlineDeviceMobile className="w-4 h-4" />
                      Mobile No 2 (Optional)
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.mobNo2 || ""}
                        onChange={(e) => handleInputChange('mobNo2', e.target.value)}
                        placeholder="Enter secondary mobile number"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                      />
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-3">
                        {formData.mobNo2 ? (
                          <a 
                            href={`tel:${formData.mobNo2}`}
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            {formatPhoneNumber(formData.mobNo2)}
                          </a>
                        ) : (
                          <p className="text-slate-400">Not set</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <HiOutlineMail className="w-4 h-4" />
                    Address *
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.address || ""}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter full address"
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm resize-none"
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-3 min-h-[80px]">
                      <p className="text-slate-700 whitespace-pre-wrap">
                        {formData.address || "Not set"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SOCIAL MEDIA LINKS */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <HiOutlineShare className="text-indigo-500" />
                Social Media Links
              </h3>
              <div className="space-y-4">
                {[
                  { key: 'fb', label: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
                  { key: 'twitter', label: 'Twitter', icon: FaTwitter, color: 'text-sky-500' },
                  { key: 'insta', label: 'Instagram', icon: FaInstagram, color: 'text-pink-600' },
                  { key: 'yt', label: 'YouTube', icon: FaYoutube, color: 'text-red-600' },
                ].map((social) => (
                  <div key={social.key} className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <social.icon className={`w-4 h-4 ${social.color}`} />
                      {social.label} (Optional)
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData[social.key] || ""}
                        onChange={(e) => handleInputChange(social.key, e.target.value)}
                        placeholder={`Enter ${social.label} URL`}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                      />
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-3">
                        {formData[social.key] ? (
                          <a 
                            href={formatUrl(formData[social.key])}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
                          >
                            <FaLink className="w-3 h-3" />
                            {formData[social.key]}
                          </a>
                        ) : (
                          <p className="text-slate-400">Not set</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW SECTION */}
        {!isEditing && (
          <div className="mt-8 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <HiOutlineGlobe className="text-indigo-500" />
              Preview
            </h3>
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Footer Sections Preview */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Footer Sections:</h4>
                  <div className="space-y-2">
                    {['a', 'b', 'c', 'd'].map((section) => (
                      <div key={section} className="text-sm">
                         <label className="block text-sm font-semibold text-slate-700">
                      {section === 'a' ? 'Team Header' : section === 'b' ? 'Team Para' : section === 'c' ? 'Footer Slogan Heading' : section === 'd' ? 'Footer Slogan Para' : ''}
                    </label>
                        <p className="text-slate-500 mt-1 line-clamp-2">
                          {formData[section] || "No content"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact & Social Preview */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Contact & Social:</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-semibold text-slate-600">Location:</span>
                      <p className="text-slate-500 overflow-scroll my-scroll">{formData.location || "Not set"}</p>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-slate-600">Phone:</span>
                      <p className="text-slate-500">
                        {formData.mobNo ? formatPhoneNumber(formData.mobNo) : "Not set"}
                        {formData.mobNo2 && ` / ${formatPhoneNumber(formData.mobNo2)}`}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-slate-600">Social Links:</span>
                      <div className="flex gap-3 mt-1">
                        {formData.fb && (
                          <a href={formatUrl(formData.fb)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            <FaFacebook className="w-4 h-4" />
                          </a>
                        )}
                        {formData.twitter && (
                          <a href={formatUrl(formData.twitter)} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600">
                            <FaTwitter className="w-4 h-4" />
                          </a>
                        )}
                        {formData.insta && (
                          <a href={formatUrl(formData.insta)} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                            <FaInstagram className="w-4 h-4" />
                          </a>
                        )}
                        {formData.yt && (
                          <a href={formatUrl(formData.yt)} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                            <FaYoutube className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Info Preview */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="text-sm text-center text-slate-500">
                  <p>{formData.copyright || "© Your Company"}</p>
                  <p className="mt-1">Developed by: {formData.developedby || "Your Developer"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODE ACTIONS (Bottom Sticky) */}
        {isEditing && (
          <div className="fixed bottom-[-80px] left-0 right-0 bg-white border-t border-slate-200 shadow-lg p-4 z-40">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="text-sm text-slate-600">
                <span className="font-medium">Editing Mode:</span> Make changes and save or cancel
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                >
                  <HiOutlineSave className="w-5 h-5" />
                  Save All Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Smooth animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        /* Bottom sticky animation */
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
      
      {/* Add padding bottom when in edit mode to prevent content being hidden */}
      {isEditing && <div className="h-20"></div>}
    </>
  );
}