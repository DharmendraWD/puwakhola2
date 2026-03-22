export const dynamic = "force-dynamic";

import Image from "next/image";
import HeroSection from "./(home)/Home";
import AboutSection from "@/components/Misc/ClientCarousel";
import MajorProjects from "./(home)/MajorProjects";
import AmazingServices from "./(home)/AmazingServicesSection";
import Process from "./(home)/Middle/Process";
import MissionVisionSection from "./(home)/Middle/Mission";
import TestimonialSlider from "@/components/Misc/Sliders/TestimonialSlider";
import ClientMapSection from "./(home)/Middle/MapContainer";
import CustomGallery from "@/components/Misc/Gallary/CustomGallery";
import TeamSection from "./(home)/Middle/TeamProfilePage";
import FAQSection from "@/components/Misc/Faq/FAQSection";
import FooterHero from "./(home)/FooterHero";
import Footer from "@/components/Misc/Footer/Footer";
import Navbar from "@/components/Header/Navbar/Navbar";
import TeamCard from "./(home)/Middle/TeamCard";
import NewsSection from "./(home)/Middle/NewsAndCaseStudy";

import CTASection from "@/components/cta/Cta";


export default function Home() {
  return (
    <div className="">
      <Navbar></Navbar>
       <HeroSection></HeroSection>
<AboutSection></AboutSection>
<MissionVisionSection></MissionVisionSection>
<TeamSection></TeamSection>
<CustomGallery/>
<NewsSection></NewsSection>

    <CTASection></CTASection>
    <FAQSection></FAQSection>
    <FooterHero></FooterHero>
    <Footer></Footer>


{/* <TeamCard></TeamCard> */}
{/* 
<MajorProjects></MajorProjects>
<AmazingServices></AmazingServices>
<Process></Process> */}
{/* <TestimonialSlider></TestimonialSlider> */}
{/* <ClientMapSection></ClientMapSection> */}
{/* <TeamProfile></TeamProfile> */}
    </div>
  );
}
