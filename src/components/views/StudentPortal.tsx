import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../store/AppContext';
import { AlertTriangle, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export function StudentPortal() {
  const { createSOSIncident, cancelIncident, incidents, resources } = useAppContext();
  
  const [countdown, setCountdown] = useState<number | null>(null);
  const [activeSosId, setActiveSosId] = useState<string | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const activeIncident = incidents.find(i => i.id === activeSosId);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      triggerSos();
      setCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePress = () => {
    if (!activeIncident && countdown === null) {
      setCountdown(3);
    }
  };

  const handleCancelCountdown = () => {
    setCountdown(null);
  };

  const triggerSos = async () => {
    setIsFetchingLocation(true);
    // Simulate GPS fetch
    const pos = await new Promise<{lat: number, lng: number}>(resolve => {
       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
           (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
           () => resolve({ lat: 34.0522, lng: -118.2437 })
         );
       } else {
         resolve({ lat: 34.0522, lng: -118.2437 });
       }
    });
    
    setIsFetchingLocation(false);
    const id = createSOSIncident(pos.lat, pos.lng);
    setActiveSosId(id);
  };

  const handleCancelSos = () => {
    if (activeSosId) {
      cancelIncident(activeSosId);
      setActiveSosId(null);
    }
  };

  return (
     <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8 px-4 w-full">
       {/* Header */}
       <div className="text-center mb-12">
         <h2 className="text-3xl font-bold text-white mb-2">Student Safety Portal</h2>
         <p className="text-slate-400">JMIT Campus Security & Medical</p>
       </div>

       {/* Main Button Area */}
       {!activeIncident ? (
         <div className="flex flex-col items-center">
           <div className="relative">
             <div className="absolute inset-0 bg-[#DC2626] rounded-full blur-[40px] opacity-20 animate-pulse pointer-events-none" />
             
             <button 
               onMouseDown={handlePress}
               onTouchStart={handlePress}
               className={`relative w-56 h-56 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.3)] transition-all transform hover:scale-105 active:scale-95 ${countdown !== null ? 'bg-[#B91C1C]' : 'bg-[#DC2626] hover:bg-[#B91C1C]'}`}
               disabled={countdown !== null || isFetchingLocation}
             >
               {isFetchingLocation ? (
                 <div className="text-white flex flex-col items-center">
                   <MapPin size={48} className="mb-2 animate-bounce" />
                   <span className="text-xl font-bold">Locating...</span>
                 </div>
               ) : countdown !== null ? (
                 <div className="text-white flex flex-col items-center">
                   <span className="text-6xl font-black mb-1">{countdown}</span>
                   <span className="text-sm font-semibold tracking-widest uppercase">Hold to Cancel</span>
                 </div>
               ) : (
                 <>
                   <AlertTriangle size={56} className="text-white mb-2" />
                   <span className="text-5xl font-black text-white tracking-widest">SOS</span>
                 </>
               )}
             </button>
           </div>

           {countdown !== null && !isFetchingLocation && (
             <button 
               onClick={handleCancelCountdown}
               className="mt-8 px-6 py-2 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
             >
               Cancel Countdown
             </button>
           )}

           {countdown === null && !isFetchingLocation && (
             <p className="mt-8 text-slate-400 text-sm font-medium text-center max-w-xs">
               <strong className="text-red-400 block mb-1">SOS – Medical / Security Emergency Only</strong>
               Pressing this button will dispatch campus security and share your live GPS location.
             </p>
           )}
         </div>
       ) : (
         <div className="w-full max-w-md">
           <Card className="border-[#DC2626]/30 shadow-[0_0_30px_rgba(220,38,38,0.15)] bg-[#101010]">
             <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">SOS Active</h3>
                <p className="text-slate-400 text-sm mb-6">Student ID: STU-8492 • Alex Johnson</p>

                <div className="w-full space-y-6 text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-base font-medium text-white">SOS Sent</p>
                      <p className="text-sm text-slate-400">Location captured and sent to command center.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${activeIncident.status !== 'NEW' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className={`text-base font-medium ${activeIncident.status !== 'NEW' ? 'text-white' : 'text-slate-400'}`}>Help on the Way</p>
                      {activeIncident.resourceId ? (
                        <p className="text-sm text-emerald-400">
                          {resources.find(r => r.id === activeIncident.resourceId)?.name} is responding.
                        </p>
                      ) : (
                        <p className="text-sm text-slate-500">Waiting for dispatch assignment...</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 w-full">
                  <button 
                    onClick={handleCancelSos}
                    className="w-full py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
                  >
                    Emergency Cancel (False Alarm)
                  </button>
                </div>
             </CardContent>
           </Card>
         </div>
       )}
     </div>
  );
}
