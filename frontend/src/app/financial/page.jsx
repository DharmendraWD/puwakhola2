import AnimateIn from '../../utils/AnimateIn';
import { Mail, Github, Twitter } from 'lucide-react';
import building from '../../../public/building.gif';
export default function Page() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#050505] text-white overflow-hidden">
      
      {/* Background Glows - Rendered on Server */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center text-center">
        
        {/* Animated Image/Illustration */}
        <AnimateIn>
          <div className="mb-10 p-1 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-3xl">
            <div className="bg-[#0a0a0a] rounded-[22px] p-8 backdrop-blur-3xl">
              <img 
                src={building.src} 
                alt="Development" 
                className="w-48 h-48 md:w-64 md:h-64"
              />
            </div>
          </div>
        </AnimateIn>

        {/* Text Content */}
        <div className="space-y-6">
          <AnimateIn delay={0.2}>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter">
              COMING <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">SOON</span>
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.4}>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We are currently refining our platform to ensure the best experience. 
              Our developers are working hard—stay tuned for something amazing.
            </p>
          </AnimateIn>
        </div>

        {/* Subscription Form */}
        {/* <AnimateIn delay={0.6}>
          <form className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition-all shadow-inner"
              required
            />
            <button className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-blue-400 hover:text-white transition-all">
              Notify Me
            </button>
          </form>
        </AnimateIn> */}

        {/* Footer Links */}
        {/* <AnimateIn delay={0.8}>
          <div className="flex gap-8 mt-16 text-gray-500">
            <Twitter className="hover:text-white cursor-pointer transition-colors" size={20} />
            <Github className="hover:text-white cursor-pointer transition-colors" size={20} />
            <Mail className="hover:text-white cursor-pointer transition-colors" size={20} />
          </div>
        </AnimateIn> */}
      </div>

      {/* Static Footer Progress */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
    </main>
  );
}