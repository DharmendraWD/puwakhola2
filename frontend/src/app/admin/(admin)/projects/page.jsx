"use client";
import React, { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineMap,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProjects,
  getAllProjects,
  createProjects,
  updateProject,
} from "../redux/slices/projects/projectSlice"; // make sure you add projectSlice methods
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import DestroyerPopup from "../components/DestroyerPopup";

export default function ProjectPage() {
  const dispatch = useDispatch();
  const projectData = useSelector((state) => state.projects.projectsData);
  const loading = useSelector((state) => state.projects.loading);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [projectToEdit, setProjectToEdit] = useState(null);

const openEditModal = (project) => {
  setProjectToEdit(project);
  setNewProject({
    title: project.title || "",
    para: project.para || "",
    statusState: project.statusState || "",
    capacity: project.capacity || "",
    Coordinates: project.Coordinates || "",
    altitudeRange: project.altitudeRange || "",
    location: project.location || "",
    commissionedDate: project.commissionedDate || "",
    NetHead: project.NetHead || "",
    DesignDischarge: project.DesignDischarge || "",
    AnnualEnergy: project.AnnualEnergy || "",
  });
  setIsEditModalOpen(true);
};


const handleUpdateProject = () => {
  if (!projectToEdit) return;

  const formData = new FormData();
  for (const key in newProject) {
    formData.append(key, newProject[key]);
  }
  
  dispatch(updateProject({ id: projectToEdit.id, formData: formData }));

  setIsEditModalOpen(false);
  setProjectToEdit(null);
  setNewProject({
    title: "",
    para: "",
    statusState: "",
    capacity: "",
    Coordinates: "",
    altitudeRange: "",
    location: "",
    commissionedDate: "",
    NetHead: "",
    DesignDischarge: "",
    AnnualEnergy: "",
  });
};

  /* ============================
     LOCAL STATE
  ============================ */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    para: "",
    statusState: "",
    capacity: "",
    Coordinates: "",
    altitudeRange: "",
    location: "",
    commissionedDate: "",
    NetHead: "",
    DesignDischarge: "",
    AnnualEnergy: "",
  });

  /* ============================
     FETCH DATA
  ============================ */
  useEffect(() => {
    dispatch(getAllProjects());
  }, []);

  /* ============================
     CREATE PROJECT
  ============================ */
  const handleCreateProject = () => {
    const formData = new FormData();
    for (const key in newProject) {
      formData.append(key, newProject[key]);
    }
    
    dispatch(createProjects(formData));
    setIsAddModalOpen(false);
    setNewProject({
      title: "",
      para: "",
      statusState: "",
      capacity: "",
      Coordinates: "",
      altitudeRange: "",
      location: "",
      commissionedDate: "",
      NetHead: "",
      DesignDischarge: "",
      AnnualEnergy: "",
    });
  };

  /* ============================
     DELETE PROJECT
  ============================ */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const confirmDelete = () => {
    if (projectToDelete) {
      dispatch(deleteProjects(projectToDelete));
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const openDeleteModal = (id) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  /* ============================
     RENDER
  ============================ */

//   console.log(newProject, "new project state")
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
              <HiOutlineDocumentText className="text-indigo-600" />
              Projects
            </h1>
            <p className="text-slate-500 mt-1">Manage your projects</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105"
          >
            <HiOutlinePlus size={20} />
            Add Project
          </button>
        </header>

        {/* PROJECT GRID */}
        {projectData && projectData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projectData?.map((project) => (
              <div
                key={project?.id}
                className="bg-white rounded-3xl border shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 p-6"
              >

                <div className="flex justify-end items-center gap-2 mb-4">
  <button
    onClick={() => openEditModal(project)}
    className="p-2 bg-yellow-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
    title="Edit Project"
  >
    ✏️
  </button>

  <button
    onClick={() => openDeleteModal(project?.id)}
    className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
  >
    <HiOutlineTrash size={18} />
  </button>
</div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-800 truncate">
                    {project?.title}
                  </h3>
                  {/* <button
                    onClick={() => openDeleteModal(project?.id)}
                    className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                  >
                    <HiOutlineTrash size={18} />
                  </button> */}
                </div>
                <p className="text-sm text-slate-500 mb-1">
                  <strong>Status:</strong> {project?.statusState}
                </p>
                <p className="text-sm text-slate-500 mb-1">
                  <strong>Capacity:</strong> {project?.capacity}
                </p>
                <p className="text-sm text-slate-500 mb-1">
                  <strong>Coordinates:</strong> {project?.Coordinates}
                </p>
                <p className="text-sm text-slate-500 mb-1">
                  <strong>Altitude Range:</strong> {project?.altitudeRange}
                </p>
                <p className="text-sm text-slate-500 mb-1">
                  <strong>Location:</strong> {project?.location}
                </p>
                <p className="text-sm text-slate-500 mb-1">
                  <strong>Commissioned:</strong> {project?.commissionedDate}
                </p>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {project?.para}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border shadow-sm p-20 text-center">
            <HiOutlineDocumentText className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No Projects Yet</h3>
            <p className="text-slate-400 mb-6">Add your first project to get started</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg inline-flex items-center gap-2"
            >
              <HiOutlinePlus size={20} />
              Add Project
            </button>
          </div>
        )}

        {/* DELETE CONFIRMATION */}
        <DestroyerPopup
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setProjectToDelete(null);
          }}
          title="Remove Project?"
          primaryAction={confirmDelete}
          actionText="Yes, Delete"
          loading={loading}
        >
          <p>This action cannot be undone. This project will be permanently removed.</p>
        </DestroyerPopup>

        {/* ADD PROJECT MODAL */}
     <div className="max-h-[300px]">
           <DestroyerPopup
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setNewProject({
              title: "",
              para: "",
              statusState: "",
              capacity: "",
              Coordinates: "",
              altitudeRange: "",
              location: "",
              commissionedDate: "",
               NetHead: "",
      DesignDischarge: "",
      AnnualEnergy: "",
            });
          }}
          title="Add New Project"
          primaryAction={handleCreateProject}
          actionText="Add Project"
        >
          <div className="space-y-5">
            {Object.keys(newProject).map((key) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <HiOutlineDocumentText className="text-indigo-500" />
                  {key}
                </label>
                <input
                  type="text"
                  value={newProject[key]}
                  onChange={(e) =>
                    setNewProject({ ...newProject, [key]: e.target.value })
                  }
                  placeholder={`Enter ${key}`}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            ))}
          </div>
        </DestroyerPopup>

        <DestroyerPopup
  isOpen={isEditModalOpen}
  onClose={() => {
    setIsEditModalOpen(false);
    setProjectToEdit(null);
    setNewProject({
      title: "",
      para: "",
      statusState: "",
      capacity: "",
      Coordinates: "",
      altitudeRange: "",
      location: "",
      commissionedDate: "",
      NetHead: "",
      DesignDischarge: "",
      AnnualEnergy: "",
    });
  }}
  title="Edit Project"
  primaryAction={handleUpdateProject}
  actionText="Save Changes"
>
  <div className="space-y-5 max-h-[300px] overflow-y-auto">
    {Object.keys(newProject).map((key) => (
      <div key={key}>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <HiOutlineDocumentText className="text-indigo-500" />
          {key}
        </label>
        <input
          type="text"
          value={newProject[key]}
          onChange={(e) =>
            setNewProject({ ...newProject, [key]: e.target.value })
          }
          placeholder={`Enter ${key}`}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>
    ))}
  </div>
</DestroyerPopup>
     </div>
      </div>
    </>
  );
}