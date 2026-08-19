import React from 'react';
import { Video, Maximize } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function LiveCameraView() {
  return (
    <div className="relative w-full h-full flex flex-col bg-black">
      {/* Overlay Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 backdrop-blur-md">
              <Video className="text-red-500" size={18} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">Campus Quad</h1>
          </div>
          <p className="text-slate-300 font-medium drop-shadow">Camera Feed 01 • Main Entrance View</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="critical" className="animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            <span className="w-2 h-2 rounded-full bg-white mr-2"></span>
            LIVE
          </Badge>
          <div className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-white font-mono text-sm">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Full Screen Video Container */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
          src="https://labs.google/fx/api/og-video/shared/3a06d6de-f17d-4440-ac82-dc3c68178e11"
        />
        
        {/* Subtle vignette/border effect */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none"></div>
      </div>
      
      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/90 to-transparent flex justify-center items-center pointer-events-auto">
        <div className="flex items-center gap-4 px-6 py-3 bg-[#101010]/80 backdrop-blur-md border border-[#252525] rounded-full">
           <button className="text-white hover:text-[#9B5CFF] transition-colors p-2">
             <Maximize size={20} />
           </button>
           <div className="w-[1px] h-6 bg-[#252525]"></div>
           <span className="text-slate-400 text-sm font-medium">1080p 60FPS</span>
           <div className="w-[1px] h-6 bg-[#252525]"></div>
           <span className="text-emerald-400 text-sm font-medium flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
             Network Stable
           </span>
        </div>
      </div>
    </div>
  );
}
