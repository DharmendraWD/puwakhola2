"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlinePhotograph,
  HiOutlineUser,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTeam,
  createTeam,
  deleteTeam,
} from "../redux/slices/teamSlice/teamSlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import DestroyerPopup from "../components/DestroyerPopup";
import Image from "next/image";

export default function TeamPage() {
  const dispatch = useDispatch();
  const teamData = useSelector((state) => state.team.teamData);
  const loading = useSelector((state) => state.team.loading);

  /* ============================
     LOCAL STATE
  ============================ */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newMember, setNewMember] = useState({
    name: "",
    description: "",
    designation: "",
  });
  const fileInputRef = useRef(null);

  /* ============================
     FETCH DATA
  ============================ */
  useEffect(() => {
    dispatch(getAllTeam());
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

  const handleCreateTeamMember = () => {
  // console.log(newMember)

    if (!newMember.name || !newMember.description || !selectedFile || !newMember.designation) {
      toast.error("Please fill all fields and select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", newMember.name);
    formData.append("description", newMember.description);
    formData.append("designation", newMember.designation);
    formData.append("dp", selectedFile.file);

    dispatch(createTeam(formData));
    setIsAddModalOpen(false);
    setSelectedFile(null);
    setNewMember({ name: "", description: "", designation: "" });
  };


  // Handle Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const confirmDelete = async () => {
    if (memberToDelete) {
      dispatch(deleteTeam(memberToDelete));
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
    }
  };

  const openDeleteModal = (id) => {
    setMemberToDelete(id);
    setIsDeleteModalOpen(true);
  };

  /* ============================
     RENDER
  ============================ */
  // console.log(teamData)

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center">
          <Loading />
        </div>
      )}

      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10 lg:flex-row flex-col">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <HiOutlineUserGroup className="text-indigo-600" />
              Team Members
            </h1>
            <p className="text-slate-500 mt-1">Manage your team members</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105"
          >
            <HiOutlinePlus size={20} />
            Add Member
          </button>
        </header>

        {/* TEAM GRID */}
        {teamData && teamData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamData?.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-3xl border shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                  <Image
                    width={500}
                    height={500}
                    unoptimized
                    src={
                      process.env.NEXT_PUBLIC_BASE_CONTENT_URL +
                      "uploads/team/" +
                      member.dp
                    }
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Delete Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => openDeleteModal(member.id)}
                      className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 truncate">
                    {member.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {member.designation}
                  </p>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border shadow-sm p-20 text-center">
            <HiOutlineUserGroup className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No Team Members Yet</h3>
            <p className="text-slate-400 mb-6">Add your first team member to get started</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg inline-flex items-center gap-2"
            >
              <HiOutlinePlus size={20} />
              Add Member
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DestroyerPopup
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
          }}
          title="Remove Team Member?"
          primaryAction={confirmDelete}
          actionText="Yes, Delete"
          loading={loading}
        >
          <p>
            This action cannot be undone. This team member will be permanently
            removed.
          </p>
        </DestroyerPopup>

        {/* Add Team Member Modal */}
        <DestroyerPopup
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedFile(null);
            setNewMember({ name: "", description: "", designation: "" });
          }}
          title="Add New Team Member"
          primaryAction={handleCreateTeamMember}
          actionText="Add Member"
        >
          <div className="space-y-5">
            {/* Image Upload Area */}
            <div
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-all cursor-pointer min-h-[200px] relative overflow-hidden group"
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
                    size={48}
                    className="text-slate-300 mb-3 mx-auto group-hover:text-indigo-400 transition-colors"
                  />
                  <p className="font-semibold text-sm text-slate-600 mb-1">
                    Click to select profile picture
                  </p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    PNG, JPG (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="w-full animate-in zoom-in-95 duration-300 text-center">
                  <div className="relative mx-auto w-32 h-32 mb-3">
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
                      <HiOutlineX size={16} />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-indigo-500 truncate max-w-[200px] mx-auto bg-indigo-50 px-3 py-1 rounded-lg">
                    {selectedFile.name}
                  </p>
                </div>
              )}
            </div>

            {/* Name Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <HiOutlineUser className="text-indigo-500" />
                Name
              </label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                placeholder="Enter member name"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <HiOutlineUser className="text-indigo-500" />
                Designation
              </label>
              <input
                type="text"
                value={newMember.designation}
                onChange={(e) =>
                  setNewMember({ ...newMember, designation: e.target.value })
                }
                placeholder="Enter member name"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <HiOutlineDocumentText className="text-indigo-500" />
                Description
              </label>
              <textarea
                value={newMember.description}
                onChange={(e) =>
                  setNewMember({ ...newMember, description: e.target.value })
                }
                placeholder="Enter member description or role"
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>
        </DestroyerPopup>
      </div>
    </>
  );
}