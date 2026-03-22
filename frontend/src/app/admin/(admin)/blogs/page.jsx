// app/admin/(admin)/blogs/page.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  HiOutlineDocumentText,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineX,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlinePhotograph,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
  setCurrentBlog,
  clearCurrentBlog,
} from "../redux/slices/blogSlice/blogSlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import DestroyerPopup from "../components/DestroyerPopup";
import RichTextEditor from "../components/RichTextEditor";

export default function BlogPage() {
  const dispatch = useDispatch();
  const blogData = useSelector((state) => state.blogs.blogData);
  const loading = useSelector((state) => state.blogs.loading);
  const currentBlog = useSelector((state) => state.blogs.currentBlog);

  /* ============================
     LOCAL STATE
  ============================ */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef(null);

  /* ============================
     FETCH DATA
  ============================ */
  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

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
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!content.trim() || content === '<p><br></p>') {
      toast.error("Please enter some content");
      return;
    }

    if (!isEditMode && !selectedFile) {
      toast.error("Please select a cover image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (selectedFile?.file) {
      formData.append("coverImage", selectedFile.file);
    }

    try {
      if (isEditMode && currentBlog) {
         dispatch(updateBlog({ id: currentBlog.id, formData }));
      } else {
         dispatch(createBlog(formData));
      }
      
      resetForm();
      setIsModalOpen(false);
      dispatch(getAllBlogs()); // Refresh the list
    } catch (error) {
      console.error("Error submitting blog:", error);
    }
  };

  const handleEdit = (blog) => {
    dispatch(setCurrentBlog(blog));
    setTitle(blog.title);
    setContent(blog.content);
    setIsEditMode(true);
    setIsModalOpen(true);
    
    // Set existing cover image
    if (blog.cover_image) {
      setSelectedFile({
        preview: `${process.env.NEXT_PUBLIC_BASE_CONTENT_URL}uploads/blogs/${blog.cover_image}`,
        name: blog.cover_image,
      });
    }
  };

  const handleDelete = async () => {
    if (blogToDelete) {
      await dispatch(deleteBlog(blogToDelete));
      setIsDeleteModalOpen(false);
      setBlogToDelete(null);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedFile(null);
    setIsEditMode(false);
    dispatch(clearCurrentBlog());
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateHTML = (html, maxLength = 150) => {
    if (!html) return "";
    const stripped = html.replace(/<[^>]+>/g, '');
    return stripped.length > maxLength 
      ? stripped.substring(0, maxLength) + '...' 
      : stripped;
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

      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 sm:px-6 lg:px-8 py-6">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <HiOutlineDocumentText className="text-indigo-600 w-8 h-8" />
              Blog Management
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Manage your blog posts ({blogData?.length || 0} posts)
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
            New Blog Post
          </button>
        </header>

        {/* BLOGS GRID */}
        {blogData && blogData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {blogData?.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                  <img
                    src={
                      blog.cover_image
                        ? `${process.env.NEXT_PUBLIC_BASE_CONTENT_URL}uploads/blogs/${blog.cover_image}`
                        : `https://via.placeholder.com/400x225/4f46e5/ffffff?text=${encodeURIComponent(blog.title.substring(0, 20))}`
                    }
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Action Buttons Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2.5 sm:p-3 bg-blue-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                      title="Edit"
                    >
                      <HiOutlinePencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setBlogToDelete(blog.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2.5 sm:p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                      title="Delete"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-grow flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  {/* Truncated Content */}
                  <div className="text-slate-600 text-sm mb-3 flex-grow">
                    <div className="line-clamp-3">
                      {truncateHTML(blog.content, 120)}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="pt-3 sm:pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <span className="flex items-center gap-1 text-slate-500">
                          <HiOutlineUser className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="truncate max-w-[80px] sm:max-w-none">
                            {blog.author_name || "Admin"}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <HiOutlineCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          {formatDate(blog.created_at || blog.updated_at)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEdit(blog)}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        Read More →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 md:p-16 lg:p-20 text-center">
            <HiOutlineDocumentText
              className="mx-auto text-slate-300 w-16 h-16 sm:w-20 sm:h-20 mb-4"
            />
            <h3 className="text-xl sm:text-2xl font-bold text-slate-600 mb-2">
              No Blog Posts Yet
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
              Create your first blog post to share your thoughts and ideas with the world
            </p>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg inline-flex items-center gap-2 text-sm sm:text-base"
            >
              <HiOutlinePlus className="w-5 h-5" />
              Create First Post
            </button>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        <DestroyerPopup
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setBlogToDelete(null);
          }}
          title="Delete Blog Post?"
          primaryAction={handleDelete}
          actionText="Yes, Delete"
          loading={loading}
          destructive={true}
        >
          <p className="text-slate-600">
            This action cannot be undone. The blog post will be permanently removed
            from your website.
          </p>
        </DestroyerPopup>

        {/* CREATE/EDIT BLOG MODAL */}
        <DestroyerPopup
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
          primaryAction={handleSubmit}
          actionText={isEditMode ? "Update Post" : "Create Post"}
          actionColor={isEditMode ? "bg-blue-600 hover:bg-blue-700" : "bg-indigo-600 hover:bg-indigo-700"}
          size="xl"
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Cover Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <HiOutlinePhotograph className="text-indigo-500 w-4 h-4 sm:w-5 sm:h-5" />
                Cover Image
                {!isEditMode && (
                  <span className="text-xs font-normal text-slate-400">
                    (Required)
                  </span>
                )}
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
                      Click to upload cover image
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
                        className="w-full h-full object-cover rounded-lg sm:rounded-xl shadow-lg border-4 border-white"
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

            {/* Title Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <HiOutlineDocumentText className="text-indigo-500 w-4 h-4 sm:w-5 sm:h-5" />
                Blog Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <HiOutlineDocumentText className="text-indigo-500 w-4 h-4 sm:w-5 sm:h-5" />
                Content
              </label>
              <div className="rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden">
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your blog content here..."
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Supports rich text formatting, images, links, and more
              </p>
            </div>
          </div>
        </DestroyerPopup>
      </div>
    </>
  );
}