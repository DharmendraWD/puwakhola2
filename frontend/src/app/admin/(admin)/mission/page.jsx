"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    HiOutlinePencil,
    HiOutlinePhotograph,
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlineX,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
    getMission,
    editMission,
    getMissionImages,
    createMissionImage,
    deleteMissionImage,
} from "../redux/slices/missionSlice/missionSlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import DestroyerPopup from "../components/DestroyerPopup";

export default function MissionPage() {
    const dispatch = useDispatch();
    const missionData = useSelector((state) => state.mission.missionData);
    const missionImages = useSelector((state) => state.mission.missionImages);
    const loading = useSelector((state) => state.mission.loading);

    /* ============================
       LOCAL STATE
    ============================ */
    const [mission, setMission] = useState({
        heading: "",
        shortpara: "",
        firstCardHeading: "",
        firstCardPara: "",
        secCardHeading: "",
        secCardPara: "",
        thirdCardHeading: "",
        thirdCardPara: "",
    });

    /* ============================
       FETCH DATA
    ============================ */
    useEffect(() => {
        dispatch(getMission());
        dispatch(getMissionImages());
    }, []);

    useEffect(() => {
        if (missionData) {
            setMission({
                heading: missionData?.heading || "",
                shortpara: missionData?.shortpara || "",
                firstCardHeading: missionData?.firstCardHeading || "",
                firstCardPara: missionData?.firstCardPara || "",
                secCardHeading: missionData?.secCardHeading || "",
                secCardPara: missionData?.secCardPara || "",
                thirdCardHeading: missionData?.thirdCardHeading || "",
                thirdCardPara: missionData?.thirdCardPara || "",
            });
        }
    }, [missionData]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageTypeToUpload, setImageTypeToUpload] = useState(null); // 'img1' or 'img2'
    const fileInputRef = useRef(null);

    /* ============================
       HANDLERS
    ============================ */
    const handleSaveContent = () => {
        const formData = new FormData();

        Object.entries(mission).forEach(([key, value]) => {
            formData.append(key, value);
        });

        dispatch(editMission(formData));
    };

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
        if (!selectedFile || !imageTypeToUpload) {
            toast.error("Please select an image");
            return;
        }

        const formData = new FormData();
        formData.append(imageTypeToUpload, selectedFile.file);

        dispatch(createMissionImage(formData));
        setIsAddModalOpen(false);
        setSelectedFile(null);
        setImageTypeToUpload(null);
    };

    const openUploadModal = (type) => {
        setImageTypeToUpload(type);
        setIsAddModalOpen(true);
    };

    // Handle Delete image
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [imageTypeToDelete, setImageTypeToDelete] = useState(null);

    const confirmDelete = async () => {
        if (imageTypeToDelete) {
            dispatch(deleteMissionImage(imageTypeToDelete));
            setIsDeleteModalOpen(false);
            setImageTypeToDelete(null);
        }
    };

    const openDeleteModal = (type) => {
        setImageTypeToDelete(type);
        setIsDeleteModalOpen(true);
    };

    /* ============================
       RENDER
    ============================ */
// console.log(missionImages, "mission image")
    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center">
                    <Loading />
                </div>
            )}

            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* HEADER */}
                <header className="flex justify-between lg:flex-row flex-col  items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">Mission</h1>
                        <p className="text-slate-500">Manage Mission content and images</p>
                    </div>
                    <button
                        onClick={handleSaveContent}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
                    >
                        Save Content
                    </button>
                </header>

                {/* CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                            <h2 className="text-xl font-bold text-gray-500 mb-6 flex items-center gap-2">
                                <HiOutlinePencil className="text-indigo-500" />
                                Mission Details
                            </h2>

                            <div className="space-y-4">
                                {Object.keys(mission).map((key) => (
                                    <input
                                        key={key}
                                        value={mission[key]}
                                        onChange={(e) =>
                                            setMission({ ...mission, [key]: e.target.value })
                                        }
                                        placeholder={key}
                                        className="w-full px-5 text-[#252525] py-3 rounded-2xl border bg-slate-50"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT IMAGES */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <HiOutlinePhotograph className="text-indigo-500" /> Images
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* IMAGE 1 */}
                                {missionImages?.img1 ? (
                                    <div className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                                        <img
                                            src={
                                                process.env.NEXT_PUBLIC_BASE_CONTENT_URL +
                                                "uploads/missionimg/" +
                                                missionImages.img1
                                            }
                                            alt="Mission 1"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => openDeleteModal("img1")}
                                                className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                                            >
                                                <HiOutlineTrash size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => openUploadModal("img1")}
                                        className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-all aspect-square"
                                    >
                                        <HiOutlinePlus size={24} />
                                        <span className="text-xs font-bold mt-1 uppercase tracking-widest">
                                            Image 1
                                        </span>
                                    </button>
                                )}

                                {/* IMAGE 2 */}
                                {missionImages?.img2 ? (
                                    <div className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                                        <img
                                            src={
                                                process.env.NEXT_PUBLIC_BASE_CONTENT_URL +
                                                "uploads/missionimg/" +
                                                missionImages.img2
                                            }
                                            alt="Mission 2"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => openDeleteModal("img2")}
                                                className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                                            >
                                                <HiOutlineTrash size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => openUploadModal("img2")}
                                        className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-all aspect-square"
                                    >
                                        <HiOutlinePlus size={24} />
                                        <span className="text-xs font-bold mt-1 uppercase tracking-widest">
                                            Image 2
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Destroyer Modal (Delete Confirmation) */}
                <DestroyerPopup
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setImageTypeToDelete(null);
                    }}
                    title="Remove Image?"
                    primaryAction={confirmDelete}
                    actionText="Yes, Delete"
                    loading={loading}
                >
                    <p>
                        This action cannot be undone. This image will be permanently removed
                        from the mission section.
                    </p>
                </DestroyerPopup>

                {/* Add Image Modal */}
                <DestroyerPopup
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setSelectedFile(null);
                        setImageTypeToUpload(null);
                    }}
                    title={`Upload ${imageTypeToUpload === 'img1' ? 'Image 1' : 'Image 2'}`}
                    primaryAction={handleUploadImage}
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
                                    <HiOutlinePhotograph
                                        size={40}
                                        className="text-slate-300 mb-2 mx-auto group-hover:text-indigo-400 transition-colors"
                                    />
                                    <p className="font-semibold text-sm text-slate-600">
                                        Click to select image
                                    </p>
                                    <p className="text-[10px] mt-1 text-slate-400 uppercase tracking-wider">
                                        PNG, JPG (Max 5MB)
                                    </p>
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
                    </div>
                </DestroyerPopup>
            </div>
        </>
    );
}