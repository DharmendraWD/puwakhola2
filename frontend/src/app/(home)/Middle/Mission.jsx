export const dynamic = 'force-dynamic';

import { Target, Eye, Heart } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { FaBolt, FaMountain, FaCalendarAlt, FaMapMarkerAlt, FaPlug } from 'react-icons/fa';
import { FiTarget } from 'react-icons/fi';
import { MdElectricBolt } from 'react-icons/md';
import { SiAffinitydesigner } from "react-icons/si";
import { BsCardHeading } from 'react-icons/bs';

// API fetch functions
async function getProjectsData() {
  try {
    const baseUrl = process.env.BASE_API || 'http://localhost:5000/api';
    const apiUrl = `${baseUrl}/contents/projects`;
    
    const res = await fetch(apiUrl, { 
        cache: 'no-store'

    });

    if (!res.ok) {
      throw new Error(`Failed to fetch projects data: ${res.status}`);
    }
    
    // return await res.json();
    const data = await res.json();
    // console.log(data)
return data?.data || data || [];
  } catch (error) {
    console.error('Error fetching projects data:', error);
    return [];
  }
}

async function getMissionData() {
  try {
    const baseUrl = process.env.BASE_API || 'http://localhost:5000/api';
    const apiUrl = `${baseUrl}/contents/mission`;
    
    const res = await fetch(apiUrl, { 
         cache: 'no-store'

    });

    if (!res.ok) {
      throw new Error(`Failed to fetch mission data: ${res.status}`);
    }
    
    // return await res.json();
    const data = await res.json();
    // console.log(data.data)
return data?.data || [];
  } catch (error) {
    console.error('Error fetching mission data:', error);
    return null;
  }
}

async function getMissionImages() {
  try {
    const baseUrl = process.env.BASE_API || 'http://localhost:5000/api';
    const apiUrl = `${baseUrl}/contents/missionimg`;
    
    const res = await fetch(apiUrl, { 
      next: {
        revalidate: 60
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch mission images: ${res.status}`);
    }
    
    // return await res.json();
    const data = await res.json();
    // console.log(data.data)
return data|| [];

  } catch (error) {
    console.error('Error fetching mission images:', error);
    return null;
  }
}

// Transform API data to component format
function transformProjectData(apiProjects) {
  if (!apiProjects || !Array.isArray(apiProjects)) return [];
  
  return apiProjects?.map((project, index) => {
    // Determine color based on index or some condition
    const color = index === 0 ? 'blue' : 'green';
    
    // Determine icon based on title or index
    const icon = index === 0 ? FaPlug : FaMountain;
    
    // Determine if project is commissioned or under development
    const isCommissioned = !project.statusState || project.statusState.includes("Development") === false;
    
    // Build the transformed project object
    const transformed = {
      title: project.title || "",
      description: project.para || "",
      capacity: project.capacity || "",
      icon: icon,
      color: color,
      NetHead: project.NetHead || "",
      DesignDischarge:  project.DesignDischarge || "",
      AnnualEnergy:  project.AnnualEnergy || "",

    };
    
    // Add status-related fields
    if (isCommissioned) {
      transformed.status = "Commissioned";
      transformed.commissionedDate = project.commissionedDate || "";
    } else {
      transformed.status = project.statusState || "Under Development";
      // Extract stake percentage if available
      const stakeMatch = project.statusState?.match(/\((\d+%)\)/);
      if (stakeMatch) {
        transformed.stakes = stakeMatch[1];
      }
    }
    
    // Add location/coordinates
    if (project.location && project.location.trim() !== "") {
      transformed.location = project.location;
    } else if (project.Coordinates && project.Coordinates.trim() !== "") {
      transformed.coordinates = project.Coordinates;
    }
    
    // Add altitude if available
    if (project.altitudeRange && project.altitudeRange.trim() !== "") {
      transformed.altitude = project.altitudeRange;
    }
    
    // Add region based on description or title
    if (project.para?.includes("Higher Himalayan")) {
      transformed.region = "Higher Himalayan region";
    }
    
    return transformed;
  });
}

const ProjectCard = ({ project }) => {
  const IconComponent = project.icon;
  
  // Dynamic color classes
  const borderColor = project.color === 'blue' ? 'border-blue-300/50' : 'border-green-300/50';
  const shadowColor = project.color === 'blue' ? 'shadow-blue-500/30' : 'shadow-green-500/30';
  const iconBg = project.color === 'blue' ? 'bg-blue-600/70' : 'bg-green-600/70';
  const iconText = project.color === 'blue' ? 'text-blue-200' : 'text-green-200';
  const titleText = project.color === 'blue' ? 'text-blue-50' : 'text-green-50';

  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl border-2 ${borderColor} shadow-2xl ${shadowColor} 
        backdrop-blur-xl bg-white/10 text-white 
        transform transition duration-500 hover:scale-[1.02] hover:shadow-4xl h-full
        flex flex-col
      `}
    >
      {/* Header and Icon */}
      <div className="flex items-center justify-between mb-4 border-b border-white/20 pb-4">
        <h3 className={`text-2xl font-extrabold tracking-tight ${titleText}`}>
          {project.title}
        </h3>
        <div className={`p-3 rounded-full ${iconBg} shadow-lg`}>
          <IconComponent className={`w-6 h-6 ${iconText}`} />
        </div>
      </div>
      
      <p className="mb-4 text-sm font-light text-white/80 flex-grow">{project.description}</p>
      
      {/* Details Grid - Only show if there are details to display */}
      {(
        project.capacity || 
        project.commissionedDate || 
        (project.status && project.status !== "Commissioned") ||
        project.location || 
        project.coordinates || 
        project.altitude
      ) && (
        <div className="space-y-3 pt-4 border-t border-white/20">
          
          {/* Capacity */}
          {project.capacity && project.capacity.trim() !== "" && (
            <DetailItem 
              icon={FaBolt} 
              label="Capacity" 
              value={project.capacity} 
              color={project.color}
            />
          )}
          
          {/* Commission/Status */}
          {project.status === 'Commissioned' && project.commissionedDate && project.commissionedDate.trim() !== "" ? (
            <DetailItem 
              icon={FaCalendarAlt} 
              label="Commissioned Date" 
              value={project.commissionedDate} 
              color={project.color}
            />
          ) : (
            project.status && project.status.trim() !== "" && project.status !== "Commissioned" && (
              <DetailItem 
                icon={FiTarget} 
                label="Status & Stake" 
                value={project.stakes ? `${project.status} (${project.stakes})` : project.status} 
                color={project.color}
              />
            )
          )}
          
          {/* Location / Coordinates */}
          {project.location && project.location.trim() !== "" ? (
            <DetailItem 
              icon={FaMapMarkerAlt} 
              label="Location" 
              value={project.location} 
              color={project.color}
            />
          ) : (
            project.coordinates && project.coordinates.trim() !== "" && (
              <DetailItem 
                icon={FaMapMarkerAlt} 
                label="Coordinates" 
                value={project.coordinates} 
                color={project.color}
              />
            )
          )}
          
          {/* Altitude */}
          {project.altitude && project.altitude.trim() !== "" && (
            <DetailItem 
              icon={FaMountain} 
              label="Altitude Range" 
              value={project.altitude} 
              color={project.color}
            />
          )}
          {project.NetHead && project.NetHead.trim() !== "" && (
            <DetailItem 
              icon={BsCardHeading} 
              label="Net Head" 
              value={project.NetHead} 
              color={project.color}
            />
          )}
          {project.DesignDischarge && project.DesignDischarge.trim() !== "" && (
            <DetailItem 
              icon={SiAffinitydesigner} 
              label="Design Discharge" 
              value={project.DesignDischarge} 
              color={project.color}
            />
          )}
          {project.AnnualEnergy && project.AnnualEnergy.trim() !== "" && (
            <DetailItem 
              icon={MdElectricBolt} 
              label="Anual Energy" 
              value={project.AnnualEnergy} 
              color={project.color}
            />
          )}

        </div>
      )}
    </div>
  );
};

// Detail Item Sub-Component
const DetailItem = ({ icon: Icon, label, value, color }) => {
  const textColor = color === 'blue' ? 'text-blue-300' : 'text-green-300';
  
  return (
    <div className="flex items-start">
      <Icon className={`w-4 h-4 mt-1 mr-3 flex-shrink-0 ${textColor}`} />
      <div>
        <span className="text-sm font-semibold text-white/60 block">{label}:</span>
        <span className="text-base font-medium text-white block">{value}</span>
      </div>
    </div>
  );
};

export async function MissionVisionSection() {
  // Fetch all data from APIs
  const [apiProjects, missionData, missionImages] = await Promise.all([
    getProjectsData(),
    getMissionData(),
    getMissionImages()
  ]);
  
  // Transform API data to component format
  const projects = transformProjectData(apiProjects) || [];

  // console.log(missionData?.data, "m")
  
  // Get mission content with fallback
  const missionContent = missionData?.data || {
    heading: " ",
    shortpara: "",
    firstCardHeading: "Our Mission",
    firstCardPara: "Puwa Khola-One Hydropower Limited promotes sustainable hydropower in Nepal through innovation, expertise, and responsible development. We are committed to harnessing nature's power for a brighter future, fostering community prosperity, and contributing to a greener world.",
    secCardHeading: "Our Values",
    secCardPara: "- Innovation: We strive for continuous improvement and embrace innovation to meet the evolving needs of our stakeholders.\n- Reliability: We uphold the highest standards of quality, safety, and reliability in all aspects of our operations.\n- Sustainability: We are committed to minimizing our ecological footprint and promoting responsible resource management.",
    thirdCardHeading: "Our Mission",
    thirdCardPara: "Become an innovative and key Hydropower developer in Nepal."
  };

  // Get mission images with fallback
  const imagesData = missionImages?.data || {
    img1: null,
    img2: null
  };

  // Build image URLs
  const baseContentUrl = process.env.NEXT_PUBLIC_BASE_CONTENT_URL || 'http://localhost:4000/';
  const imageUrls = {
    img1: imagesData.img1 ? `${baseContentUrl}uploads/missionimg/${imagesData.img1}` : "https://images.unsplash.com/photo-1739156652224-fda317f00e94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRyb2VsZWN0cmljJTIwcGxhbnR8ZW58MXx8fHwxNzY1MzUwODU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    img2: imagesData.img2 ? `${baseContentUrl}uploads/missionimg/${imagesData.img2}` : "https://images.unsplash.com/photo-1739156652224-fda317f00e94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRyb2VsZWN0cmljJTIwcGxhbnR8ZW58MXx8fHwxNzY1MzUwODU4fDA&ixlib=rb-4.1.0&q=80&w=1080"
  };

  // console.log(imageUrls)

  // If no projects, don't render the section
  if (!projects || projects.length === 0) {
    return [];
  }

  // console.log(projects)
  return (
    <section id='projects' className="py-8 lg:py-8 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm mb-4">
          Projects
        </div>
        <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
          Our Major <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Projects</span> 
        </h2>
      </div>

      {/* Background container for the colorful glassmorphism effect */}
      <div className="bg-[#00192e] pb-20 mb-4 px-4 md:px-12 flex items-center justify-center relative overflow-hidden">
        
        {/* Decorative Background Circles for Color Pop */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="max-w-6xl mx-auto z-10 w-full">
          {/* Responsive Grid for Cards */}
          <div className="grid grid-cols-1 mt-8 lg:grid-cols-2 gap-8">
            {projects?.map((project, index) => (
              <ProjectCard key={project.id || index} project={project} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading and short paragraph from API */}
        {(missionContent.heading?.trim() || missionContent.shortpara?.trim()) && (
          <div className="text-center mb-16">
            {missionContent.heading?.trim() && (
              <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
                {missionContent.heading}
              </h2>
            )}
            {missionContent.shortpara?.trim() && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {missionContent.shortpara}
              </p>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Stacked Images */}
          <div className="relative">
            {/* Main Image */}
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <ImageWithFallback
                src={imageUrls.img1}
                alt="Hydroelectric Plant"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Overlapping Secondary Image */}
            <div className="absolute -bottom-6 -right-6 w-3/4 aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl z-20 border-4 border-white">
              <ImageWithFallback
                src={imageUrls.img2}
                alt="Hydroelectric Plant Secondary View"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative background shape */}
            <div className="absolute -top-4 -left-4 w-1/3 h-1/3 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl -z-10 opacity-20"></div>
            
            {/* Floating stat card */}
            <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl p-6 z-30">
              <div className="text-4xl text-blue-600 mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Uptime Reliability</div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-12">
            {/* Our Mission Card */}
            {missionContent.firstCardHeading?.trim() && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl text-gray-900">{missionContent.firstCardHeading}</h3>
                </div>
                {missionContent.firstCardPara?.trim() && (
                  <p className="text-gray-600 leading-relaxed">
                    {missionContent.firstCardPara}
                  </p>
                )}
              </div>
            )}

            {/* Our Values Card */}
            {missionContent.secCardHeading?.trim() && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl text-gray-900">{missionContent.secCardHeading}</h3>
                </div>
                {missionContent.secCardPara?.trim() && (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {missionContent.secCardPara}
                  </p>
                )}
              </div>
            )}

            {/* Our Mission Card (Third) */}
            {missionContent.thirdCardHeading?.trim() && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl text-gray-900">{missionContent.thirdCardHeading}</h3>
                </div>
                {missionContent.thirdCardPara?.trim() && (
                  <div className="space-y-2">
                    <p className="text-gray-600 leading-relaxed">
                      {missionContent.thirdCardPara}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MissionVisionSection;