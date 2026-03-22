"use client";

import React, { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineHashtag,
  HiOutlineClock,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllFAQs,
  createFAQ,
  deleteFAQ,
  updateFAQ,
  setCurrentFAQ,
  clearCurrentFAQ,
} from "../redux/slices/faqSlice/faqSlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import DestroyerPopup from "../components/DestroyerPopup";

export default function FAQPage() {
  const dispatch = useDispatch();
  const faqData = useSelector((state) => state.faqs.faqData);
  const loading = useSelector((state) => state.faqs.loading);
  const currentFAQ = useSelector((state) => state.faqs.currentFAQ);

  /* ============================
     LOCAL STATE
  ============================ */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ques, setques] = useState("");
  const [ans, setans] = useState("");
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [searchQuery, setSearchQuery] = useState("");

  /* ============================
     FETCH DATA
  ============================ */
  useEffect(() => {
    dispatch(getAllFAQs());
  }, [dispatch]);

  /* ============================
     HANDLERS
  ============================ */
  const handleSubmit = async () => {
    if (!ques.trim()) {
      toast.error("Please enter a ques");
      return;
    }

    if (!ans.trim()) {
      toast.error("Please enter an ans");
      return;
    }

    const faqData = {
      ques: ques.trim(),
      ans: ans.trim(),
    };

    try {
      if (isEditMode && currentFAQ) {
        await dispatch(updateFAQ({ id: currentFAQ.id, faqData }));
      } else {
        await dispatch(createFAQ(faqData));
      }
      
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting FAQ:", error);
    }
  };

  const handleEdit = (faq) => {
    dispatch(setCurrentFAQ(faq));
    setques(faq.ques);
    setans(faq.ans);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (faqToDelete) {
      await dispatch(deleteFAQ(faqToDelete));
      setIsDeleteModalOpen(false);
      setFaqToDelete(null);
    }
  };

  const resetForm = () => {
    setques("");
    setans("");
    setIsEditMode(false);
    dispatch(clearCurrentFAQ());
  };

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };



  /* ============================
     FILTERED & SORTED DATA
  ============================ */
  const filteredFAQs = faqData
    ?.filter(faq => 
      faq.ques.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.ans.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "created_at") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return a.id - b.id;
    });

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
              <HiOutlineQuestionMarkCircle className="text-indigo-600 w-8 h-8" />
              FAQ Management
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Manage frequently asked quess ({faqData?.length || 0} FAQs)
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105 w-full sm:w-auto justify-center text-sm sm:text-base"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add New FAQ
          </button>
        </header>

        {/* SEARCH AND FILTER BAR */}
        <div className="mb-6 bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FAQs by ques or ans..."
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base text-gray-600"
                />
                <HiOutlineQuestionMarkCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
            </div>

            {/* Sort */}
            <div className="sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              >
                <option value="created_at">Sort by: Latest</option>
                <option value="id">Sort by: ID</option>
              </select>
            </div>
          </div>
        </div>

        {/* FAQS LIST */}
        {filteredFAQs && filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs?.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                {/* FAQ Header */}
                <div
                  className="p-4 sm:p-5 cursor-pointer flex justify-between items-center hover:bg-slate-50 transition-colors"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-indigo-50 text-indigo-600 rounded-lg p-2 sm:p-3">
                      <HiOutlineQuestionMarkCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1">
                        {faq.ques}
                      </h3>
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <HiOutlineHashtag className="w-3 h-3 sm:w-4 sm:h-4" />
                          ID: {faq.id}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiOutlineClock className="w-3 h-3 sm:w-4 sm:h-4" />
                          {formatDate(faq.created_at || faq.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(faq);
                        }}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:scale-110 transition-transform shadow-md"
                        title="Edit"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFaqToDelete(faq.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 bg-red-600 text-white rounded-lg hover:scale-110 transition-transform shadow-md"
                        title="Delete"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Expand/Collapse Icon */}
                    {expandedFAQ === faq.id ? (
                      <HiOutlineChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 ml-2" />
                    ) : (
                      <HiOutlineChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 ml-2" />
                    )}
                  </div>
                </div>

                {/* FAQ ans (Collapsible) */}
                {expandedFAQ === faq.id && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 sm:pt-0">
                      <div className="pl-10 sm:pl-14 border-t border-slate-100 pt-4 sm:pt-5">
                        <div className="prose prose-sm max-w-none">
                          <p className="text-slate-600 whitespace-pre-wrap">
                            {faq.ans}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 md:p-16 lg:p-20 text-center">
            <HiOutlineQuestionMarkCircle
              className="mx-auto text-slate-300 w-16 h-16 sm:w-20 sm:h-20 mb-4"
            />
            <h3 className="text-xl sm:text-2xl font-bold text-slate-600 mb-2">
              {searchQuery ? "No matching FAQs found" : "No FAQs Yet"}
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
              {searchQuery
                ? "Try a different search term or clear the search"
                : "Add your first frequently asked ques to help your users"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg inline-flex items-center gap-2 text-sm sm:text-base"
              >
                <HiOutlinePlus className="w-5 h-5" />
                Add First FAQ
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg inline-flex items-center gap-2 text-sm sm:text-base"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        <DestroyerPopup
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setFaqToDelete(null);
          }}
          title="Delete FAQ?"
          primaryAction={handleDelete}
          actionText="Yes, Delete"
          loading={loading}
          destructive={true}
        >
          <p className="text-slate-600">
            This action cannot be undone. The FAQ will be permanently removed
            from your website.
          </p>
        </DestroyerPopup>

        {/* CREATE/EDIT FAQ MODAL */}
        <DestroyerPopup
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={isEditMode ? "Edit FAQ" : "Add New FAQ"}
          primaryAction={handleSubmit}
          actionText={isEditMode ? "Update FAQ" : "Create FAQ"}
          actionColor={isEditMode ? "bg-blue-600 hover:bg-blue-700" : "bg-indigo-600 hover:bg-indigo-700"}
          size="lg"
        >
          <div className="space-y-4 sm:space-y-6">
            {/* ques Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <HiOutlineQuestionMarkCircle className="text-indigo-500 w-4 h-4 sm:w-5 sm:h-5" />
                ques
              </label>
              <input
                type="text"
                value={ques}
                onChange={(e) => setques(e.target.value)}
                placeholder="Enter the frequently asked ques"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            {/* ans Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <HiOutlineQuestionMarkCircle className="text-indigo-500 w-4 h-4 sm:w-5 sm:h-5" />
                ans
              </label>
              <textarea
                value={ans}
                onChange={(e) => setans(e.target.value)}
                placeholder="Enter the detailed ans"
                rows={6}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base resize-none"
              />
              <p className="text-xs text-slate-400 mt-2">
                You can use multiple lines for better readability
              </p>
            </div>

            {/* Preview (Optional) */}
            {ques && ans && (
              <div className="border border-slate-200 rounded-xl sm:rounded-2xl p-4 bg-slate-50">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <HiOutlineQuestionMarkCircle className="text-indigo-500" />
                  Preview
                </h4>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-slate-800 mb-2">Q: {ques}</p>
                    <p className="text-slate-600 whitespace-pre-wrap">A: {ans}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DestroyerPopup>
      </div>

      {/* FAQ Item Animation Styles */}
      <style jsx global>{`
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .prose {
          color: inherit;
        }
        
        .prose p {
          margin-top: 0;
          margin-bottom: 0;
        }
        
        /* Smooth transition for FAQ expansion */
        .faq-enter {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
        }
        
        .faq-enter-active {
          max-height: 500px;
          opacity: 1;
          transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
        }
        
        .faq-exit {
          max-height: 500px;
          opacity: 1;
        }
        
        .faq-exit-active {
          max-height: 0;
          opacity: 0;
          transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}