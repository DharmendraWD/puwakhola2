"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  HiOutlineMail,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineDocumentText,
  HiOutlineClock,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMessages,
  deleteMessage,
} from "../redux/slices/messageSlice/messageSlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import DestroyerPopup from "../components/DestroyerPopup";

export default function MessagesPage() {
  const dispatch = useDispatch();
  const messageData = useSelector((state) => state.messages.messageData);
  const loading = useSelector((state) => state.messages.loading);

  /* ============================
     LOCAL STATE
  ============================ */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  /* ============================
     FETCH DATA
  ============================ */
  useEffect(() => {
    dispatch(getAllMessages());
  }, [dispatch]);

  /* ============================
     HANDLERS
  ============================ */
  const handleDelete = async () => {
    if (messageToDelete) {
      await dispatch(deleteMessage(messageToDelete));
      setIsDeleteModalOpen(false);
      setMessageToDelete(null);
      setSelectedMessage(null);
      setShowMessageDetail(false);
    }
  };

  const openDeleteModal = (messageId, e) => {
    e?.stopPropagation();
    setMessageToDelete(messageId);
    setIsDeleteModalOpen(true);
  };

  const viewMessageDetails = (message) => {
    setSelectedMessage(message);
    setShowMessageDetail(true);
  };

  const closeMessageDetail = () => {
    setSelectedMessage(null);
    setShowMessageDetail(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return "Today, " + date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (diffDays === 1) {
        return "Yesterday, " + date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (diffDays < 7) {
        return date.toLocaleDateString("en-US", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (error) {
      return dateString;
    }
  };

  const formatLongDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  /* ============================
     DATA PROCESSING
  ============================ */
  // Ensure messageData is always an array
  const safeMessageData = useMemo(() => {
    if (!messageData) return [];
    if (Array.isArray(messageData)) return messageData;
    if (messageData.data && Array.isArray(messageData.data)) return messageData.data;
    if (typeof messageData === 'object') return Object.values(messageData);
    return [];
  }, [messageData]);

  // Get message count
  const messageCount = safeMessageData.length;

  // Filter, sort, and search messages
  const filteredMessages = useMemo(() => {
    let result = [...safeMessageData];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(message => {
        if (!message || typeof message !== 'object') return false;
        
        const name = String(message.name || '').toLowerCase();
        const email = String(message.email || '').toLowerCase();
        const messageText = String(message.mess || message.message || '').toLowerCase();
        
        return name.includes(query) || email.includes(query) || messageText.includes(query);
      });
    }

    // Apply date filter
    if (filterBy !== "all") {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      result = result.filter(message => {
        if (!message.created_at) return false;
        
        const messageDate = new Date(message.created_at);
        
        switch (filterBy) {
          case "today":
            return messageDate.toDateString() === now.toDateString();
          case "week":
            return messageDate >= sevenDaysAgo;
          case "month":
            return messageDate >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [safeMessageData, searchQuery, filterBy, sortBy]);

  // Get stats
  const stats = useMemo(() => {
    const total = safeMessageData.length;
    const today = safeMessageData.filter(msg => {
      if (!msg.created_at) return false;
      const msgDate = new Date(msg.created_at);
      const todayDate = new Date();
      return msgDate.toDateString() === todayDate.toDateString();
    }).length;
    
    const unread = safeMessageData.filter(msg => !msg.read).length;
    
    return { total, today, unread };
  }, [safeMessageData]);

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

      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 sm:px-6 lg:px-8 py-6">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <HiOutlineMail className="text-indigo-600 w-8 h-8" />
              Client Messages
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Manage client inquiries and feedback ({messageCount} messages)
            </p>
          </div>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Messages</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
              </div>
              <div className="bg-indigo-50 text-indigo-600 rounded-lg p-3">
                <HiOutlineMail className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Today</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{stats.today}</p>
              </div>
              <div className="bg-green-50 text-green-600 rounded-lg p-3">
                <HiOutlineCalendar className="w-6 h-6 sm:w-8 sm:h-8" />
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
                  placeholder="Search messages by name, email, or content..."
                  className="w-full px-4 py-3 text-black pl-10 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
                <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
            </div>

            {/* Filter and Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="sm:w-40">
                <div className="relative">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full text-black px-4 py-3 pl-10 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base appearance-none"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    {/* <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option> */}
                  </select>
                  <HiOutlineFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
              
              <div className="sm:w-40">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-black px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-slate-600">
            <div>
              Found {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* MESSAGES LIST */}
        {filteredMessages.length > 0 ? (
          <div className="space-y-4">
            {filteredMessages.map((message) => {
              const messageId = message.id || message._id;
              if (!messageId) return null;
              
              const isSelected = selectedMessage?.id === messageId;
              
              return (
                <div
                  key={messageId}
                  onClick={() => viewMessageDetails(message)}
                  className={`bg-white rounded-xl sm:rounded-2xl border shadow-sm overflow-hidden group transition-all duration-300 cursor-pointer hover:shadow-lg ${
                    isSelected 
                      ? 'border-indigo-300 bg-indigo-50' 
                      : 'border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      {/* Message Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className={`rounded-lg p-2 sm:p-3 ${
                            isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <HiOutlineUser className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                                {message.name || "Anonymous"}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm text-slate-500">
                                  {formatDate(message.created_at)}
                                </span>
                                {!message.read && (
                                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              <a 
                                href={`mailto:${message.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                              >
                                {message.email || "No email"}
                              </a>
                            </div>
                            
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {message.mess || message.message || "No message content"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={(e) => openDeleteModal(messageId, e)}
                          className={`p-2 rounded-lg transition-transform hover:scale-110 shadow-md ${
                            isSelected 
                              ? 'bg-red-500 hover:bg-red-600 text-white' 
                              : 'bg-red-100 hover:bg-red-200 text-red-600'
                          }`}
                          title="Delete Message"
                        >
                          <HiOutlineTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => viewMessageDetails(message)}
                          className={`p-2 rounded-lg transition-transform hover:scale-110 shadow-md ${
                            isSelected 
                              ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                          title="View Details"
                        >
                          <HiOutlineEye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
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
            <HiOutlineMail
              className="mx-auto text-slate-300 w-16 h-16 sm:w-20 sm:h-20 mb-4"
            />
            <h3 className="text-xl sm:text-2xl font-bold text-slate-600 mb-2">
              {searchQuery ? "No matching messages found" : "No Messages Yet"}
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
              {searchQuery
                ? "Try a different search term or clear the filters"
                : "Client messages will appear here when they contact you through the contact form"}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterBy("all");
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg inline-flex items-center gap-2 text-sm sm:text-base"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* MESSAGE DETAIL MODAL */}
        {showMessageDetail && selectedMessage && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Backdrop */}
              <div 
                className="fixed  transition-opacity  bg-opacity-50"
                onClick={closeMessageDetail}
              ></div>

              {/* Modal */}
              <div className="inline-block align-bottom bg-white rounded-2xl sm:rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 text-indigo-600 rounded-lg p-2">
                            <HiOutlineMail className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">
                            Message Details
                          </h3>
                        </div>
                        <button
                          onClick={closeMessageDetail}
                          className="text-slate-400 hover:text-slate-500"
                        >
                          <span className="sr-only">Close</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Message Content */}
                      <div className="space-y-6">
                        {/* Sender Info */}
                        <div className="bg-slate-50 rounded-xl p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-slate-500 mb-1">From</p>
                              <p className="font-semibold text-slate-800">{selectedMessage.name || "Anonymous"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
                              <a 
                                href={`mailto:${selectedMessage.email}`}
                                className="text-indigo-600 hover:text-indigo-700 font-medium"
                              >
                                {selectedMessage.email || "No email"}
                              </a>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm font-medium text-slate-500 mb-1">Date & Time</p>
                              <div className="flex items-center gap-2 text-slate-600">
                                <HiOutlineClock className="w-4 h-4" />
                                <span>{formatLongDate(selectedMessage.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Message Body */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <HiOutlineDocumentText className="text-indigo-500 w-5 h-5" />
                            <h4 className="text-lg font-semibold text-slate-800">Message</h4>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-slate-700 whitespace-pre-wrap">
                              {selectedMessage.mess || selectedMessage.message || "No message content"}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                          <button
                            onClick={() => {
                              if (selectedMessage.email) {
                                window.location.href = `mailto:${selectedMessage.email}`;
                              }
                            }}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            disabled={!selectedMessage.email}
                          >
                            <HiOutlineMail className="w-5 h-5" />
                            Reply via Email
                          </button>
                          <button
                            onClick={(e) => {
                              openDeleteModal(selectedMessage.id || selectedMessage._id, e);
                              closeMessageDetail();
                            }}
                            className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <HiOutlineTrash className="w-5 h-5" />
                            Delete Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        <DestroyerPopup
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setMessageToDelete(null);
          }}
          title="Delete Message?"
          primaryAction={handleDelete}
          actionText="Yes, Delete"
          loading={loading}
          destructive={true}
        >
          <p className="text-slate-600">
            This action cannot be undone. The message will be permanently removed
            from your records.
          </p>
        </DestroyerPopup>
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
        
        /* Modal animations */
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .modal-enter {
          animation: modalEnter 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}