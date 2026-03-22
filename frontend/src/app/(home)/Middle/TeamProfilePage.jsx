export const dynamic = 'force-dynamic';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';

// API fetch function
async function getTeamData() {
  try {
    const baseUrl = process.env.BASE_API || 'http://localhost:4000/api';
    const apiUrl = `${baseUrl}/contents/team`;
    
    const res = await fetch(apiUrl, { 
        cache: 'no-store'

    });

    if (!res.ok) {
      throw new Error(`Failed to fetch team data: ${res.status}`);
    }
    
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching team data:', error);
    return [];
  }
}

// Transform API data to component format
function transformTeamData(apiTeam) {
  if (!apiTeam || !Array.isArray(apiTeam)) return [];
  
  const baseContentUrl = process.env.BASE_CONTENT_URL || 'http://localhost:4000/';
  
  const normalized = apiTeam
    .filter(member => 
      member?.name?.trim() && 
      member?.name !== "n,n" && 
      member?.description?.trim() &&
      member?.description !== ",n,n"
    )
    ?.map((member) => {
      const imageUrl = member?.dp 
        ? `${baseContentUrl}uploads/team/${member.dp}`
        : null;

      return {
        id: member.id,
        name: member.name?.trim() || "Team Member",
        role: member.designation?.trim() || "Role",
        image: imageUrl,
        bio: member.description?.trim() || "",
      };
    });

  // 🔽 ADD THIS SORTING LOGIC
  const getPriority = (role = "") => {
    const r = role.toLowerCase();

    if (r === "chairman") return 1;
    if (r === "managing director") return 2;

    return 3; // others
  };

  return normalized.sort((a, b) => {
    return getPriority(a.role) - getPriority(b.role);
  });
}

export default async function TeamSection() {
  // Fetch team data from API
  const apiTeamData = await getTeamData();
  
  // Transform API data to component format
  const team = transformTeamData(apiTeamData) || [];
  
  // If no team members, don't render the section
  if (!team || team.length === 0) {
    return null;
  }


  return (
    <section id="team" className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm mb-4">
            Meet Our Team
          </div>
          <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
            The Minds Behind the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Power</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our experienced leadership team brings together decades of expertise in renewable energy, engineering, and sustainable development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team?.map((member) => (
            <div
              key={member.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="overflow-hidden">
                <img
                // unoptimized
                  src={member.image}
                  alt={member.name}
                  // width={100}
                  // height={100}
                  className="w-full object-top h-[300px] object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t pointer-events-none from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl text-gray-900 mb-1">{member.name}</h3>
                {member.role && <p className="text-blue-600 mb-3">{member.role}</p>}
                <p className="text-sm text-gray-600 mb-4 max-h-[200px] my-scroll overflow-y-scroll">{member.bio}</p>
                
                {/* <div className="flex gap-3">
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div> */}
              </div>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}