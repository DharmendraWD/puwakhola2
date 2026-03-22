"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  HiOutlinePhotograph,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCollection,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllGallery,
  createGallery,
  deleteGallery,
} from "../redux/slices/gallerySlice/gallerySlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import DestroyerPopup from "../components/DestroyerPopup";

export default function GalleryPage() {
  const dispatch = useDispatch();
  const gallerydata = useSelector((state) => state.gallery.galleryData);
  const loading = useSelector((state) => state.gallery.loading);


  /* ============================
     LOCAL STATE
  ============================ */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef(null);

  /* ============================
     FETCH DATA
  ============================ */
  useEffect(() => {
    dispatch(getAllGallery());
  }, []);

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
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadImage = () => {
    if (!selectedFile || !title.trim()) {
      toast.error("Please select an image and enter a title");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile.file);
    formData.append("title", title);

    dispatch(createGallery(formData));
    setIsAddModalOpen(false);
    setSelectedFile(null);
    setTitle("");
  };

  // Handle Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const confirmDelete = async () => {
    if (imageToDelete) {
      // Extract just the filename from the full path
      // e.g., "uploads/gallery/1768832340849-575503006.jpg" -> "1768832340849-575503006.jpg"
      const filename = imageToDelete.split('/').pop();
      dispatch(deleteGallery(filename));
      setIsDeleteModalOpen(false);
      setImageToDelete(null);
    }
  };

  const openDeleteModal = (imagePath) => {
    setImageToDelete(imagePath);
    setIsDeleteModalOpen(true);
  };

  /* ============================
     RENDER
  ============================ */

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center">
          <Loading />
        </div>
      )}

      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* HEADER */}
        <header className="flex justify-between lg:flex-row flex-col  items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <HiOutlineCollection className="text-indigo-600" />
              Gallery
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your image gallery ({gallerydata?.length || 0} images)
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105"
          >
            <HiOutlinePlus size={20} />
            Add Image
          </button>
        </header>

        {/* GALLERY GRID */}
        {gallerydata && gallerydata.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallerydata?.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                  <img
                    src={process.env.NEXT_PUBLIC_BASE_CONTENT_URL + item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Delete Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => openDeleteModal(item.image)}
                      className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                </div>

                {/* Title Section */}
                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border shadow-sm p-20 text-center">
            <HiOutlinePhotograph
              className="mx-auto text-slate-300 mb-4"
              size={64}
            />
            <h3 className="text-xl font-bold text-slate-600 mb-2">
              No Images Yet
            </h3>
            <p className="text-slate-400 mb-6">
              Add your first image to start building your gallery
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg inline-flex items-center gap-2"
            >
              <HiOutlinePlus size={20} />
              Add Image
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DestroyerPopup
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setImageToDelete(null);
          }}
          title="Remove Image?"
          primaryAction={confirmDelete}
          actionText="Yes, Delete"
          loading={loading}
        >
          <p>
            This action cannot be undone. This image will be permanently removed
            from your gallery.
          </p>
        </DestroyerPopup>

        {/* Add Image Modal */}
        <DestroyerPopup
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedFile(null);
            setTitle("");
          }}
          title="Add New Image"
          primaryAction={handleUploadImage}
          actionText="Upload Image"
        >
          <div className="space-y-5">
            {/* Image Upload Area */}
            <div
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-all cursor-pointer min-h-[240px] relative overflow-hidden group"
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
                    size={56}
                    className="text-slate-300 mb-3 mx-auto group-hover:text-indigo-400 transition-colors"
                  />
                  <p className="font-semibold text-sm text-slate-600 mb-1">
                    Click to select image
                  </p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    PNG, JPG (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="w-full animate-in zoom-in-95 duration-300 text-center">
                  <div className="relative mx-auto w-40 h-40 mb-3">
                    <img
                      src={selectedFile.preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-2xl shadow-lg border-4 border-white"
                    />
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-all"
                    >
                      <HiOutlineX size={18} />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-indigo-500 truncate max-w-[200px] mx-auto bg-indigo-50 px-3 py-1 rounded-lg">
                    {selectedFile.name}
                  </p>
                </div>
              )}
            </div>

            {/* Title Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <HiOutlinePhotograph className="text-indigo-500" />
                Image Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter image title or description"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </DestroyerPopup>
      </div>
    </>
  );
}