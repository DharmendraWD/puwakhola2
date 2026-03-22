"use client";
import React, { useEffect, useRef, useState } from 'react';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi';
import DestroyerPopup from '../components/DestroyerPopup'; // Using the Portal-based Modal we made
import { useDispatch, useSelector } from 'react-redux';
import { deleteHeroSectionImage, editHeroSection, getHeroSection } from '../redux/slices/heroSection/heroSlice';
import { getHeroSectionImage } from '../redux/slices/heroSection/heroSlice';
import { createHeroSectionImage } from '../redux/slices/heroSection/heroSlice';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

export default function page() {
// redux 
const herodata = useSelector((state) => state.heroSection);
const images = useSelector((state) => state.heroSection.heroSectionImageData);
const dispatch = useDispatch();

useEffect(() => {
  dispatch(getHeroSection());
  dispatch(getHeroSectionImage());
}, []);
let loading = herodata?.loading
// console.log(images, "from jsx file")
// redux end 


  // State for content
  const [heroData, setHeroData] = useState({
    slogan:"",
    description: "",
    btn1Text:"",
    btn1Link:"",
    btn2Text: "",
    btn2Link:"",
  });


useEffect(() => {
  if (herodata?.hesroSectionData?.length > 0) {
    const data = herodata.hesroSectionData[0];

    // console.log(data, "d")
    setHeroData({
      slogan: data?.slogan || "",
      description: data?.description || "",
      btn1Text: data?.btn1Text || "",
      btn1Link: data?.btn1Link || "",
      btn2Text: data?.btn2Text || "",
      btn2Link: data?.btn2Link || "",
      upperSlogan: data?.upperSlogan || "",
      mw: data?.mw || "",
      homesPowered: data?.homesPowered || "",
      yearsOfExp: data?.yearsOfExp || "",
      ImageBellowText: data?.ImageBellowText || ""
    });
  }
}, [herodata?.hesroSectionData]);


  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  // Handle Delete
    const [selectedImageId, setSelectedImageId] = useState(null);
  const confirmDelete = async () => {
    try {
       dispatch(deleteHeroSectionImage(selectedImageId));   
    } catch (error) {
      console.error('Error deleting image:', error);
    }
    setIsDeleteModalOpen(false);
  };

//   handle delete end 
//   preview for image when selected /
const [selectedFile, setSelectedFile] = useState(null); // Stores { name, previewURL }
const fileInputRef = useRef(null);
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // console.log(file)
    // Basic validation to keep it "production ready"
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large! Please select an image under 2MB.");
      return;
    }

    setSelectedFile({
      file: file, // Keep the actual file object for your API
      name: file.name,
      preview: URL.createObjectURL(file)
    });
  }
};
// preview for image end 
const [imageTitle, setImageTitle] = useState("")
// console.log(imageTitle)

const clearSelection = (e) => {
  e.stopPropagation(); 
  setSelectedFile(null);
  // Reset the input value so the same file can be selected again if needed
  if (fileInputRef.current) fileInputRef.current.value = "";
};
//   preview for image when selected /end 

// handle herosection edit 
const handleHeroSectionEdit = () => {
  let formData = new FormData();
  formData.append('slogan', heroData?.slogan);
  formData.append('description', heroData?.description);
  formData.append('btn1Text', heroData?.btn1Text);
  formData.append('btn1Link', heroData?.btn1Link);
  formData.append('btn2Text', heroData?.btn2Text);
  formData.append('btn2Link', heroData?.btn2Link);
  formData.append('upperSlogan', heroData?.upperSlogan);
  formData.append('mw', heroData?.mw);
  formData.append('homesPowered', heroData?.homesPowered);
  formData.append('yearsOfExp', heroData?.yearsOfExp);
  formData.append('ImageBellowText', heroData?.ImageBellowText);
  dispatch(editHeroSection(formData));
}
// handle herosection edit end
// console.log(heroData, "herodata from jsx")
  return (
    <>
    {
      loading && <div className="flex z-[9999999] justify-center items-center h-screen w-full fixed bg-[#000000cf] inset-0"><Loading /></div>
    }
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Hero Section</h1>
          <p className="text-slate-500">Update the first thing your visitors see.</p>
        </div>
        <button
        onClick={handleHeroSectionEdit}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 w-fit">
          Save All Changes
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: Text Content Settings --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <HiOutlinePencil className="text-indigo-500" /> Content Details
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#252525] mb-2 ml-1">Slogan</label>
                <input 
                  type="text" 
                  value={heroData.slogan}
                  onChange={(e) => setHeroData({...heroData, slogan: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[#252525] focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#252525] mb-2 ml-1">Paragraph</label>
                <input 
                  type="text" 
                  value={heroData.description}
                  onChange={(e) => setHeroData({...heroData, description: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[#252525] focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg font-semibold"
                />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-bold text-[#252525] mb-2 ml-1">Primary Button Text</label>
                  <input 
                    type="text" 
                     value={heroData.btn1Text}
                  onChange={(e) => setHeroData({...heroData, btn1Text: e.target.value})}
                    className="w-full px-5 py-3.5 text-[#252525] bg-indigo-50/50 border border-indigo-100 rounded-2xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#252525] mb-2 ml-1">Primary Button Link</label>
                  <input 
                    type="text" 
                    value={heroData.btn1Link}
                  onChange={(e) => setHeroData({...heroData, btn1Link: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[#252525] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#252525] mb-2 ml-1">Secondary Button Text</label>
                  <input 
                    type="text" 
                     value={heroData.btn2Text}
                  onChange={(e) => setHeroData({...heroData, btn2Text: e.target.value})}
                    className="w-full px-5 py-3.5 bg-indigo-50/50 border text-[#252525] border-indigo-100 rounded-2xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#252525] mb-2 ml-1">Secondary Button Link</label>
                  <input 
                      value={heroData.btn2Link}
                  onChange={(e) => setHeroData({...heroData, btn2Link: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border text-[#252525] border-slate-200 rounded-2xl text-[#252525] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: Image Management --- */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <HiOutlinePhotograph className="text-indigo-500" /> Scrolling Image
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
              >
                <HiOutlinePlus size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {images.map((img) => (
                <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <img src={process.env.NEXT_PUBLIC_BASE_CONTENT_URL + img.image} alt="Hero" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <h1>{process.env.NEXT_PUBLIC_BASE_CONTENT_URL + img.image}</h1>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => { setSelectedImageId(img.id); setIsDeleteModalOpen(true); }}
                      className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Empty State placeholder */}
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-all aspect-square"
              >
                <HiOutlinePlus size={24} />
                <span className="text-xs font-bold mt-1 uppercase tracking-widest">Add New</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Destroyer Modal (Delete Confirmation) */}
      <DestroyerPopup 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove Image?"
        primaryAction={confirmDelete}
        actionText="Yes, Delete"
        loading={loading}
      >
        <p>This action cannot be undone. This image will be permanently removed from your hero section.</p>
      </DestroyerPopup>

      {/* Add Image Modal */}
<form action="">
     <DestroyerPopup 
  isOpen={isAddModalOpen} 
  onClose={() => {
    setIsAddModalOpen(false);
    setSelectedFile(null);
    setImageTitle(""); // Clear title on close
  }}
  title="Upload New Image"
  primaryAction={() => { 
    if(!imageTitle){
        toast.error("Please enter a title for the image");
        return 
    }
  dispatch(createHeroSectionImage({images: selectedFile, title: imageTitle}));
    setIsAddModalOpen(false); 
     setSelectedFile(null);
    setImageTitle(""); // Clear title on close
  }}
  actionText="Upload Now"
>
  <div className="space-y-5">
    {/* Upload Area */}
    <div 
      onClick={() => fileInputRef.current.click()}
      className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-all cursor-pointer min-h-[180px] relative overflow-hidden group"
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
          <HiOutlinePhotograph size={40} className="text-slate-300 mb-2 mx-auto group-hover:text-indigo-400 transition-colors" />
          <p className="font-semibold text-sm text-slate-600">Click to select image</p>
          <p className="text-[10px] mt-1 text-slate-400 uppercase tracking-wider">PNG, JPG (Max 2MB)</p>
        </div>
      ) : (
        <div className="w-full animate-in zoom-in-95 duration-300 text-center">
          <div className="relative mx-auto w-24 h-24 mb-2">
            <img 
              src={selectedFile.preview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-2xl shadow-lg border-2 border-white" 
            />
            <button 
              type="button"
              onClick={clearSelection}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-all"
            >
              <HiOutlineX size={14} />
            </button>
          </div>
          <p className="text-[11px] font-bold text-indigo-500 truncate max-w-[150px] mx-auto bg-indigo-50 px-2 py-0.5 rounded-md">
            {selectedFile.name}
          </p>
        </div>
      )}
    </div>

    {/* Title Input Field */}
    <div className="text-left animate-in slide-in-from-top-2 duration-500">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2">
        Image Title
      </label>
      <input 
        type="text"
        placeholder="Enter a catchy title..."
        value={imageTitle}
        onChange={(e) => setImageTitle(e.target.value)}
        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium"
      />
    </div>
  </div>
</DestroyerPopup>

</form>

    </div>
    </>
  );
}