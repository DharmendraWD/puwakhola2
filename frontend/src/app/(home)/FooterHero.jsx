
export const dynamic = "force-dynamic";

import RoundedBgBtn from "@/components/Buttons/RoundedBgBtn";
import Link from "next/link";

// API fetch function
async function getOtherContent() {
  try {
    const baseUrl = process.env.BASE_API || 'http://localhost:4000/api';
    const apiUrl = `${baseUrl}/contents/other`;
    
    const res = await fetch(apiUrl, { 
    cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch content data: ${res.status}`);
    }
    
    const data = await res.json();
    return data?.data[0] || null;
  } catch (error) {
    console.error('Error fetching content data:', error);
    return null;
  }
}

// This is a Server Component by default in Next.js App Router
export default async function FooterHero() {
  // Fetch content data on server
  const contentData = await getOtherContent();
  // console.log(contentData)
  
  // Use data from API or fallback data
  const heading = contentData?.c || "Sustainable Energy for a Brighter Tomorrow.";
  const description = contentData?.d || "We harness the pure, natural flow of Nepal’s rivers to deliver reliable, sustainable and environmentally friendly hydro-electric power. Our mission is to light homes, empower communities, and build a cleaner future for Nepal.";

  return (
    <section className="bg-white py-20 md:py-28 text-center">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Main Heading */}
        <h2 
          data-aos="fade-zoom-in"
          data-aos-easing="ease-in-back"
          data-aos-delay="800"
          data-aos-offset="0" 
          className="text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary1)] to-[var(--primary2)] font-extrabold uppercase tracking-wider mb-8"
        >
          {heading}
        </h2>

        {/* Sub-description */}
        <p 
          data-aos="fade-zoom-in"
          data-aos-easing="ease-in-back"
          data-aos-delay="800"
          data-aos-offset="0" 
          className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-12"
        >
          {description}
        </p>

        {/* Call-to-Action Button */}
        <Link 
          href={"#about-us"} 
          className="px-6 py-3 text-lg font-medium text-white bg-[var(--primary1)] m-0 rounded-[50px] cursor-pointer shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Go to Up
        </Link>  
      </div>
    </section>
  );
}