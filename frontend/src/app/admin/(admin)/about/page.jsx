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
  getAboutUs,
  editAboutUs,
  getAboutUsImages,
  createAboutUsImage,
  deleteAboutUsImage,
} from "../redux/slices/aboutusSlice/aboutUsSlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import DestroyerPopup from "../components/DestroyerPopup";

export default function AboutUsPage() {
  const dispatch = useDispatch();
  const aboutUsData = useSelector((state) => state.aboutus.aboutUsData);
    const loading = useSelector((state) => state.aboutus.loading);

    //  LOCAL STATE
  const [about, setAbout] = useState({
    heading: "",
    longPara: "",
    firstCardHeading: "",
    firstCardPara: "",
    secCardHeading: "",
    secCardPara: "",
    thirdCardHeading: "",
    thirdCardPara: "",
    fourthCardHeading: "",
    fourthCardPara: "",
  });


  useEffect(() => {
    dispatch(getAboutUs());
    dispatch(getAboutUsImages());
  }, []);

  useEffect(() => {
    if (aboutUsData) {
      setAbout({
        heading: aboutUsData[0]?.heading || "",
        longPara: aboutUsData[0]?.longPara || "",
        firstCardHeading: aboutUsData[0]?.firstCardHeading || "",
        firstCardPara: aboutUsData[0]?.firstCardPara || "",
        secCardHeading: aboutUsData[0]?.secCardHeading || "",
        secCardPara: aboutUsData[0]?.secCardPara || "",
        thirdCardHeading: aboutUsData[0]?.thirdCardHeading || "",
        thirdCardPara: aboutUsData[0]?.thirdCardPara || "",
        fourthCardHeading: aboutUsData[0]?.fourthCardHeading || "",
        fourthCardPara: aboutUsData[0]?.fourthCardPara || "",
      });
    }
  }, [aboutUsData]);


  const handleSaveContent = () => {
    const formData = new FormData();

    Object.entries(about).forEach(([key, value]) => {
      formData.append(key, value);
    });

    dispatch(editAboutUs(formData));
  };




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
            <h1 className="text-3xl font-extrabold text-slate-900">
              About Us
            </h1>
            <p className="text-slate-500">
              Manage About Us content and images
            </p>
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
                About Details
              </h2>

              <div className="space-y-4">
                {Object.keys(about)?.map((key) => (
                  <input
                    key={key}
                    value={about[key]}
                    onChange={(e) =>
                      setAbout({ ...about, [key]: e.target.value })
                    }
                    placeholder={key}
                    className="w-full px-5 text-[#252525] py-3 rounded-2xl border bg-slate-50"
                  />
                ))}
              </div>
            </div>
          </div>

        </div>


      </div>
    </>
  );
}