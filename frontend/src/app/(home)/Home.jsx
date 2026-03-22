export const dynamic = 'force-dynamic';

import { ArrowRight, Zap } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import Link from 'next/link';
import img1 from "../../../public/img/gallary/1.png";
import img2 from "../../../public/img/gallary/2.png";
import img3 from "../../../public/img/gallary/3.png";
import img4 from "../../../public/img/gallary/4.png";
import { GrGallery } from "react-icons/gr";
import { FaPeopleRoof } from "react-icons/fa6";

const API_BASE_URL = process.env.BASE_API || 'http://localhost:3000/api';
const IMAGE_BASE_URL = process.env.BASE_CONTENT_URL || 'http://localhost:3000';

// Fallback data
const fallbackData = {
  slogan: "",
  description: "",
  btn1Text: "Gallery",
  btn1Link: "#gallery",
  btn2Text: "About Us",
  btn2Link: "#about",
  upperSlogan: "",
  mw: "",
  homesPowered: "",
  yearsOfExp: "",
  ImageBellowText: ""
};

const fallbackImages = [
  { src: img1.src, alt: "Hydroelectric Dam" },
  { src: img2.src, alt: "Hydropower Turbine" },
  { src: img3.src, alt: "Mountain River" },
  { src: img4.src, alt: "Renewable Energy" }
];

// Function to find a suitable word for gradient effect (word with more than 4 characters)
function findGradientWord(text) {
  const words = text.split(' ');
  
  const suitableWordIndex = words.findIndex(word => {
    const cleanWord = word.replace(/[.,!?;:'"]$/g, '');
    return cleanWord.length > 4;
  });

  if (suitableWordIndex === -1) {
    return {
      beforeWord: words.slice(0, -1).join(' '),
      gradientWord: words[words.length - 1],
      afterWord: ''
    };
  }

  const beforeWord = words.slice(0, suitableWordIndex).join(' ');
  const gradientWord = words[suitableWordIndex];
  const afterWord = words.slice(suitableWordIndex + 1).join(' ');

  return { beforeWord, gradientWord, afterWord };
}

// Fetch hero section data
async function getHeroSectionData() {
  try {
    const res = await fetch(`${API_BASE_URL}/contents/herosection`, {
      next: {
        revalidate: 60
      }
    });

    // console.log(res)
    if (!res.ok) {
      return fallbackData;

    }

    const response = await res.json();
    console.log(response.data[0], "asjaon")
    return response?.data?.[0];
  } catch (error) {
    console.error('Error fetching hero section data:', error);
    return fallbackData;
  }
}

// Fetch hero section images
async function getHeroSectionImages() {
  try {
    const res = await fetch(`${API_BASE_URL}/contents/herosectionimg`, {
      next: {
        revalidate: 60
      }
    });

    if (!res.ok) {
      return fallbackImages;
    }

    const images = await res.json() || [];
    
    if (!Array.isArray(images) || images.length === 0) {
      return fallbackImages;

    }

    return images?.map((img, index) => ({
      src: `${IMAGE_BASE_URL}${img.image}`,
      alt: img.title || `Hydropower Image ${index + 1}`
    }));
  } catch (error) {
    console.error('Error fetching hero section images:', error);
    return fallbackImages;
  }
}

export default async function HeroSection() {
  const heroData = await getHeroSectionData();
  const heroImages = await getHeroSectionImages();

  // Parse the slogan to find gradient word
  const { beforeWord, gradientWord, afterWord } = findGradientWord(heroData.slogan);

  // Parse ImageBellowText to split it into two lines
  const imageBellowTextParts = heroData?.ImageBellowText.split(' ');
  const midPoint = Math.ceil(imageBellowTextParts?.length / 2);
  const firstLine = imageBellowTextParts?.slice(0, midPoint).join(' ');
  const secondLine = imageBellowTextParts?.slice(midPoint).join(' ');

  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-white -z-10" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
              <Zap className="w-4 h-4" />
              <span className="text-sm">{heroData?.upperSlogan}</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl text-gray-900">
              {beforeWord}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                {gradientWord}
              </span>
              {afterWord && ` ${afterWord}`}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {heroData?.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href={heroData?.btn2Link} 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
              >
                <FaPeopleRoof /> {heroData?.btn2Text}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href={heroData?.btn1Link} 
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
              >
                <GrGallery /> {heroData?.btn1Text}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl text-blue-600">{heroData?.mw}</div>
                <div className="text-sm text-gray-600">MW Capacity</div>
              </div>
              <div>
                <div className="text-3xl text-blue-600">{heroData?.homesPowered}</div>
                <div className="text-sm text-gray-600">Homes Powered</div>
              </div>
              <div>
                <div className="text-3xl text-blue-600">{heroData?.yearsOfExp}</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right content - Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {heroImages[0] && (
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                    <ImageWithFallback
                      src={heroImages[0]?.src}
                      alt={heroImages[0]?.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {heroImages[1] && (
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <ImageWithFallback
                      src={heroImages[1]?.src}
                      alt={heroImages[1]?.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-4 pt-8">
                {heroImages[2] && (
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <ImageWithFallback
                      src={heroImages[2]?.src}
                      alt={heroImages[2]?.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {heroImages[3] && (
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                    <ImageWithFallback
                      src={heroImages[3]?.src}
                      alt={heroImages[3]?.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{firstLine}</div>
                  <div className="text-green-600">{secondLine}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}