import { ImageWithFallback } from '@/components/Misc/Gallary/CustomGallery';
import { MapPin, Zap, Calendar } from 'lucide-react';

 function ProjectsGallery() {
  const projects = [
    {
      id: 1,
      title: 'Puwakhola Main Plant',
      location: 'Sindhupalchok District',
      capacity: '25 MW',
      year: '2018',
      image: 'https://images.unsplash.com/photo-1705747894609-6a7d17a8cfb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRyb2VsZWN0cmljJTIwZGFtfGVufDF8fHx8MTc2NTI4MTQ5MHww&ixlib=rb-4.1.0&q=80&w=1080',
      span: 'col-span-2 row-span-2',
    },
    {
      id: 2,
      title: 'Upper Puwakhola',
      location: 'Rasuwa District',
      capacity: '15 MW',
      year: '2020',
      image: 'https://images.unsplash.com/photo-1678084843501-ecc71f7dc61e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGZsb3clMjBlbmVyZ3l8ZW58MXx8fHwxNzY1MzUwOTI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      span: 'col-span-1 row-span-1',
    },
    {
      id: 3,
      title: 'Puwakhola Station A',
      location: 'Dolakha District',
      capacity: '10 MW',
      year: '2021',
      image: 'https://images.unsplash.com/photo-1756665402926-5c96e99eeb3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRyb3Bvd2VyJTIwc3RhdGlvbnxlbnwxfHx8fDE3NjUzNTA5MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      span: 'col-span-1 row-span-1',
    },
    {
      id: 4,
      title: 'Lower Cascade Project',
      location: 'Kavrepalanchok',
      capacity: '8 MW',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1476887325222-d082416771ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW0lMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzY1MzUwOTI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      span: 'col-span-1 row-span-2',
    },
    {
      id: 5,
      title: 'Grid Integration Hub',
      location: 'Central Region',
      capacity: 'Distribution',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwZ3JpZHxlbnwxfHx8fDE3NjUzNTA5MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      span: 'col-span-1 row-span-1',
    },
  ];

  return (
    <section id="projects" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm mb-4">
            Our Portfolio
          </div>
          <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
            Powering Progress <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Across Nepal</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From the rushing rivers of the Himalayas to the valleys below, our projects bring sustainable energy to communities across the nation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`${project.span} group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500`}
            >
              <div className="relative h-full min-h-[300px]">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl text-white mb-3">{project.title}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-white/90">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">{project.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{project.year}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover button */}
                  <button className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl">
          <div className="text-center">
            <div className="text-4xl text-white mb-2">58 MW</div>
            <div className="text-blue-100">Total Capacity</div>
          </div>
          <div className="text-center">
            <div className="text-4xl text-white mb-2">5</div>
            <div className="text-blue-100">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-4xl text-white mb-2">15,000+</div>
            <div className="text-blue-100">Homes Powered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl text-white mb-2">3</div>
            <div className="text-blue-100">Under Construction</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectsGallery;