"use client";
import Image from "next/image";
import img1 from "../../../../public/img/people/1.png"
import img2 from "../../../../public/img/people/2.png"
import img3 from "../../../../public/img/people/3.png"
import img4 from "../../../../public/img/people/4.png"


import abighya from "../../../../public/img/proj/Abhigya.jpeg"
import kadamkc from "../../../../public/img/proj/kadamKc.jpeg"
import kiranmalla from "../../../../public/img/proj/kiranmalla.jpeg"
import madhukar from "../../../../public/img/proj/madhukargarg.jpeg"
import kabita from "../../../../public/img/proj/kabitakc.jpeg"



import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const teamMembers = [
  {
    name: " Abhigya Malla",
    title: "Director",
    img: abighya,
    desc: `Holds Masters in Professional Accountancy and Commerce in Finance (Macquarie 
University, Australia). Vice President/Finance Controller at High Himalaya Hydro 
Construction Pvt. Ltd. Project developer and youth contractor, involved in Aayu 
Malun - 21 MW, Puwa Khola - 4 MW, Hongu Khola - 28.9 MW, Midim Khola - 3 
MW, and Upper Tamor A - 60 MW. Managing Director of Union Hydropower Public 
Ltd.`
  },
  {
    name: "Kadam KC",
    title: "Key Person | chairman - Dudhkoshi-2 (Jaleshwor)",
    img:kadamkc,
    desc:
      `Background in Environmental Science and Geotechnical Engineering (UK). 
Entrepreneur in hydropower, entertainment, and construction sectors. Significant 
roles in various successful projects including Puwa Khola-1 Hydropower (4MW) 
and Aayu Malun HPP - 21.00 MW`,
  },
  {
    name: "Kiran Malla",
    title: "Chairman",
    img:kiranmalla,
    desc:
      `Founder and Chairman of High Himalaya Hydro Construction Pvt Ltd. Over 37 
years of experience, involved in more than 50 hydropower projects. Key projects 
include Midim Khola - 3.00 MW, Aayu Malun HPP - 21.00 MW, Union Mewa - 23 
MW, Hongu Hydroelectric - 28.9 MW and Upper Tamor A - 60 MW. Education: 
Bachelors in Civil Engineering (IIT Roorkee), Masters in Hydropower (Norway).`,
  },
  {
    name: "Kabita Kc",
    title: "Managing Director",
    img:kabita,
    desc:
      `Background in Environmental Science - Masters (UK). Entrepreneur in hydropower 
and consulting sectors. Significant roles in various successful projects including 
Puwa Khola-1 Hydropower (4MW) and Aayu Malun HPP - 21.00 MW`,
  },
  {
    name: "Madhukar Garg",
    title: "Key Person",
    img:madhukar,
    desc:
      `Masters in Electrical Power Engineering (NTNU, Kathmandu University). Extensive 
experience in hydropower, focusing on electro-mechanical equipment and 
transmission lines`,
  },
];

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const TeamCarousel = () => {

  return (
    <div className="team-section max-w-[1440px] mx-auto" id="about-teams" data-aos="fade-up"
     data-aos-anchor-placement="center-bottom">
      <div className="team-header flex lg:flex-row gap-8 items-start max-w-[100%] w-full flex-col">
        <h1>Meet the talented team who make all this happen</h1>
        <p>
          Our philosophy is simple, hire great people and give them the
          resources and support to do their best work.
        </p>
      </div>

      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={2000}
        transitionDuration={800}
        containerClass="carousel-container fade-carousel"
        arrows={false}
   
      >
        {teamMembers.map((member, index) => (
          <div className="team-card rounded-xl shadow-lg transition duration-300 ease-in-out hover:scale-[1.01]s" key={index}>
            <img  src={member.img.src}  className="team-img mx-auto" />

            <h3 className="font-semibold">{member.name}</h3>
            <h4>{member.title}</h4>
            <p className="max-h-[100px] overflow-scroll my-scroll">{member.desc}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default TeamCarousel;


