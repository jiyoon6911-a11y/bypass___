import { Wifi, Battery, Signal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function DeviceOS() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center overflow-hidden font-sans relative">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 py-3 text-white z-10 relative">
        <span className="text-sm font-bold">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        <div className="flex gap-2">
          <Signal className="w-4 h-4" />
          <Wifi className="w-4 h-4" />
          <Battery className="w-4 h-4" />
        </div>
      </div>
      
      {/* App Grid */}
      <div className="flex-1 p-6 flex flex-col items-center pt-20 z-10 relative">
        <div className="grid grid-cols-4 gap-x-6 gap-y-8 w-full max-w-sm">
           {/* User's Custom App */}
           <button 
             onClick={() => navigate('/app')}
             className="flex flex-col items-center gap-2 group outline-none"
           >
             <div className="w-[72px] h-[72px] bg-black border border-white/20 rounded-2xl flex flex-col items-center justify-center shadow-2xl group-hover:scale-105 active:scale-95 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/30 blur-[20px] rounded-full"></div>
                <span className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500 relative z-10 leading-tight text-center">
                  403<br/>BY<br/>PASS
                </span>
             </div>
             <span className="text-xs text-white font-medium drop-shadow-md">403 Bypass</span>
           </button>

           {/* Dummy Apps */}
           <div className="flex flex-col items-center gap-2">
             <div className="w-[72px] h-[72px] bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 rounded-full bg-white/90"></div>
             </div>
             <span className="text-xs text-white font-medium drop-shadow-md">Photos</span>
           </div>

           <div className="flex flex-col items-center gap-2">
             <div className="w-[72px] h-[72px] bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-white/90 rounded-md rotate-45"></div>
             </div>
             <span className="text-xs text-white font-medium drop-shadow-md">Messages</span>
           </div>

           <div className="flex flex-col items-center gap-2">
             <div className="w-[72px] h-[72px] bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 border-4 border-white/90 rounded-xl"></div>
             </div>
             <span className="text-xs text-white font-medium drop-shadow-md">Notes</span>
           </div>
        </div>
      </div>
      
      {/* OS Home Indicator */}
      <div className="h-6 flex justify-center pb-2 z-10 relative mt-auto">
        <div className="w-32 h-1.5 bg-white/60 rounded-full"></div>
      </div>
    </div>
  );
}
