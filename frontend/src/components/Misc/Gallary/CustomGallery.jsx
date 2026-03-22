"use client";
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FiX, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';

// API fetch function
async function getGalleryData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000/api';
    const apiUrl = `${baseUrl}/contents/gallery`;
    
    const res = await fetch(apiUrl, { 
       cache: 'no-store'

    });

    if (!res.ok) {
      throw new Error(`Failed to fetch gallery data: ${res.status}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return [];
  }
}

// Transform API data to component format
function transformGalleryData(apiGallery) {
  if (!apiGallery || !Array.isArray(apiGallery)) return [];
  
  const baseContentUrl = process.env.NEXT_PUBLIC_BASE_CONTENT_URL || 'http://localhost:5000/';
  
  return apiGallery
    .filter(item => item?.image && item?.title)
    .map((item, index) => {
      return {
        src: item.image.startsWith('http') 
          ? item.image 
          : `${baseContentUrl}${item.image}`,
        aspect_ratio: 16 / 9,
        alt: item.title || `Gallery Image ${index + 1}`,
        id: item.id,
        title: item.title
      };
    });
}

// LIGHTBOX COMPONENT (Fullscreen Viewer)
function Lightbox({ images, isOpen, onClose, initialIndex }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (!isOpen) return;
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goToPrevious();
      if (event.key === 'ArrowRight') goToNext();
    };

    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen, onClose, goToPrevious, goToNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = currentImage.src;
    link.download = (currentImage.alt.replace(/[^a-z0-9]/gi, '_') + '.jpg').toLowerCase();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const buttonStyle = "p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/30 text-white transition duration-200 backdrop-blur-sm z-50 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/20";
  const iconStyle = "w-6 h-6 md:w-8 md:h-8";
  
  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-2 md:p-6"
      onClick={onClose}
    >
      <div 
        className="relative flex items-center justify-center max-h-[95vh] w-full sm:w-auto sm:min-w-[70%] max-w-[95vw] lg:min-w-[70%]"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="relative w-full h-full">
          <Image
            src={currentImage.src}
            unoptimized
            alt={currentImage.alt}
          fill
            width={100} 
            height={100}
   
            className="rounded-lg shadow-2xl min-w-[100%] max-h-[90vh] w-auto h-auto transition duration-300"
            quality={90}
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        <button
          className={`${buttonStyle} absolute top-4 right-4`}
          onClick={onClose}
          aria-label="Close Lightbox"
        >
          <FiX className={iconStyle} />
        </button>
        
        <button
          className={`${buttonStyle} absolute top-4 left-4`}
          onClick={handleDownload}
          aria-label="Download Image"
        >
          <FiDownload className={iconStyle} />
        </button>

        <button
          className={`${buttonStyle} absolute left-4 md:left-8`}
          onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
          aria-label="Previous Image"
        >
          <FiChevronLeft className={iconStyle} />
        </button>

        <button
          className={`${buttonStyle} absolute right-4 md:right-8`}
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
          aria-label="Next Image"
        >
          <FiChevronRight className={iconStyle} />
        </button>

        <div className="absolute bottom-0 w-full p-4 text-center bg-black/50 backdrop-blur-sm rounded-b-lg">
             <p className="text-white text-sm md:text-base font-light">{currentImage.alt}</p>
        </div>
      </div>
    </div>
  );
}

// MAIN GALLERY COMPONENT
export default function CustomGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch gallery data on component mount
  useEffect(() => {
    async function fetchGalleryData() {
      try {
        setLoading(true);
        const apiData = await getGalleryData();
        const transformedData = transformGalleryData(apiData);
        setGalleryImages(transformedData);
      } catch (error) {
        console.error('Error loading gallery:', error);
        setGalleryImages([]); // Empty array if error
      } finally {
        setLoading(false);
      }
    }

    fetchGalleryData();
  }, []);

  const openLightbox = useCallback((index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen p-4 md:p-12 bg-gray-100" id="gallery">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm mb-4">
            Gallery
          </div>
          <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
            Moments That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Define Us
            </span>
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  // If no gallery images, don't render the section
  if (!galleryImages || galleryImages.length === 0) {
    return null;
  }

  return (
    <section className="min-h-screen p-4 md:p-12 bg-gray-100" id="gallery">
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm mb-4">
          Gallery
        </div>
        <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
          Moments That{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Define Us
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore a visual journey of our projects, innovations, and the people
          driving sustainable energy solutions forward.
        </p>
      </div>
      
      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {galleryImages?.map((image, index) => (
          <div
            key={image.id || image.alt}
            className="group relative overflow-hidden rounded-xl shadow-2xl cursor-pointer transition duration-500 ease-in-out hover:shadow-blue-500/50 hover:scale-[1.03]"
            onClick={() => openLightbox(index)}
          >
            <div className="aspect-[16/9] w-full relative">
              <Image
                src={image.src}
                alt={image.alt}
                unoptimized
                fill
                
                className="transition duration-700 ease-in-out group-hover:opacity-75 group-hover:blur-sm"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={index < 3}
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
              <p className="text-white text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition duration-500 ease-out">
                View Photo
              </p>
              <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition duration-500 delay-100">
                {image.alt}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        images={galleryImages}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        initialIndex={currentImageIndex}
      />
    </section>
  );
}