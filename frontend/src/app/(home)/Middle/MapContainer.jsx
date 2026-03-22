// app/page.js
// This component will be server-rendered by default in Next.js App Router

import Image from 'next/image'; // For optimized images
import { getClientData } from './mapData'; // Adjust path as necessary
import RoundedBgBtn from '@/components/Buttons/RoundedBgBtn';

export default async function ClientMapSection() {
  // Data fetching on the server
  const data = await getClientData();

  return (
    <section className="bg-lightGrayBg py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Map with Client Avatars */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none aspect-[1.3/1] lg:h-full flex items-center justify-center">
            {/* Base map image */}
            <Image
              src="/images/nepal-map.png" // Your map image path
              alt="Map of Nepal with client locations"
              fill
              style={{ objectFit: 'contain' }}
              className="z-0"
              sizes="(max-width: 1023px) 100vw, 50vw" // Responsive image sizes
              priority // High priority for LCP
            />

            {/* Overlay Avatars (positioned absolutely relative to the map's container) */}
            {data.clientAvatars.map(avatar => (
              <div
                key={avatar.id}
                className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white shadow-md z-10"
                style={{ top: avatar.top, left: avatar.left }}
              >
                <Image
                  src={avatar.src}
                  alt={avatar.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="40px" // Fixed size for avatars
                />
              </div>
            ))}
            {/* Dotted background for the map (if the map image doesn't include it) */}
            {/* If your map image *does* include dots, you can remove this. */}
            <div className="absolute inset-0 bg-map-dots opacity-75 z-0"></div> 
            {/* You'd define 'bg-map-dots' in your CSS or inline for dot pattern */}
            {/* For a simple dotted background without an image, you can use: */}
            {/*
            <div className="absolute inset-0 z-0" style={{
              backgroundImage: 'radial-gradient(#C2C8D6 1.5px, transparent 1.5px)',
              backgroundSize: '15px 15px',
              maskImage: 'url(/images/nepal-map-mask.svg)', // if you have a mask SVG
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center'
            }}></div>
            */}
          </div>

          {/* Right Side: Text, Stats, and Button */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {data.heading}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              {data.description}
            </p>

            {/* Statistics */}
            <div className="flex justify-center lg:justify-start space-x-8 mb-10">
              <div>
                <p className="text-[var(--primary1)] text-5xl font-bold ">{data.completedProjects}</p>
                <p className="text-lg text-gray-600">Completed Projects</p>
              </div>
              <div className="w-px bg-gray-300 h-16 self-center"></div> {/* Divider */}
              <div>
                <p className="text-5xl font-bold text-[var(--primary1)]">{data.ongoingProjects}</p>
                <p className="text-lg text-gray-600">Ongoing Projects</p>
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="flex justify-center lg:justify-start">
             <RoundedBgBtn label="See Our Projects"></RoundedBgBtn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}