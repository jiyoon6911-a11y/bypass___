import { Map as MapIcon, Navigation, Train, Building2, CheckCircle2, X, Clock, BellRing, Layers, ScanSearch, Expand, Video, ArrowUp, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { cn } from '../../lib/utils';

export function AppMap() {
  const [is3DMode, setIs3DMode] = useState(false);
  const [isARMode, setIsARMode] = useState(false);
  const [arStep, setArStep] = useState<'straight' | 'obstacle' | 'detour'>('straight');
  const [waitingModal, setWaitingModal] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [mapLayer, setMapLayer] = useState<'default' | 'obstacle' | 'wheelchair'>('default');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Start camera and trigger simulated guiding
  useEffect(() => {
    if (!isARMode) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      return;
    }

    let isSubscribed = true;

    // Start camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (isSubscribed && videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
          stream.getTracks().forEach(track => track.stop());
        }
      })
      .catch(err => console.error("Camera access denied or unavailable", err));

    const speak = (text: string) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        window.speechSynthesis.speak(utterance);
      }
    };
    
    const simulateJourney = async () => {
      setArStep('straight');
      if ('vibrate' in navigator) navigator.vibrate([200]);
      speak("앞으로 15미터 직진하세요.");
      
      await new Promise(r => setTimeout(r, 6000));
      if (!isSubscribed) return;
      
      setArStep('obstacle');
      if ('vibrate' in navigator) navigator.vibrate([300, 100, 300, 100, 500]); // Danger pattern
      speak("주의. 전방 2미터 앞 단차 감지. 위험요소를 확인하세요.");
      
      await new Promise(r => setTimeout(r, 5000));
      if (!isSubscribed) return;
      
      setArStep('detour');
      if ('vibrate' in navigator) navigator.vibrate([150, 50, 150]); // Direction change pattern
      speak("우측 경사로 방향으로 진입하세요.");
    };
    
    simulateJourney();

    const interval = setInterval(() => {
      if ('vibrate' in navigator && arStep !== 'obstacle') {
        navigator.vibrate([100]); // Pulse keeping on track
      }
    }, 3000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isARMode]);

  return (
    <div className="flex flex-col min-h-screen bg-black px-5 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black mb-2">안내/맵</h1>
        <p className="text-zinc-400 font-medium text-sm">출발지부터 객석까지 통제 가능한 여정</p>
      </header>

      {/* 실시간 현장 혼잡도 */}
      <section className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
            <Clock className="w-5 h-5" /> 실시간 현장 혼잡도
          </h2>
        </div>

        <div className="space-y-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white mb-1">1층 휠체어 전용 화장실</h3>
              <p className="text-xs text-red-400 font-bold">혼잡 (현재 대기 4명)</p>
            </div>
            <button 
              onClick={() => setWaitingModal(true)}
              className={cn("px-4 py-2 rounded-lg text-xs font-black transition-colors", isWaiting ? "bg-zinc-800 text-cyan-400 border border-cyan-400" : "bg-cyan-400 text-black hover:bg-white")}
            >
              {isWaiting ? '웨이팅 중 (4/5)' : '스마트 웨이팅'}
            </button>
          </div>
        </div>

        <BottomSheet isOpen={waitingModal} onClose={() => setWaitingModal(false)} title="화장실 스마트 웨이팅">
          {!isWaiting ? (
            <div className="flex flex-col gap-4">
              <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 text-center">
                <p className="text-sm font-medium text-zinc-300">현재 예상 대기 시간</p>
                <div className="text-3xl font-black text-cyan-400 my-2">약 10분</div>
                <p className="text-xs text-zinc-500">내 앞에 4명이 대기 중입니다.</p>
              </div>
              <button 
                onClick={() => { setIsWaiting(true); setWaitingModal(false); }} 
                className="w-full bg-cyan-400 text-black font-black py-4 rounded-xl hover:bg-white transition-colors"
              >줄서기 등록</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-center py-6">
              <BellRing className="w-12 h-12 text-cyan-400 mx-auto mb-2 animate-bounce" />
              <h3 className="text-xl font-black text-white">웨이팅이 등록되었습니다</h3>
              <button onClick={() => { setIsWaiting(false); setWaitingModal(false); }} className="mt-4 text-xs font-bold text-zinc-500 underline">웨이팅 취소하기</button>
            </div>
          )}
        </BottomSheet>
      </section>

      {/* AR Navigation Feature */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Video className="text-blue-400 w-5 h-5" /> AI AR 길안내
        </h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-5 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
          
          <h3 className="text-lg font-black text-white mb-2 relative z-10">내 위치를 보며 찾아가기</h3>
          <p className="text-xs text-zinc-400 mb-5 relative z-10 leading-relaxed">
            카메라로 주변을 비추면 AI가 <strong className="text-blue-400">안전한 보행로와 단차/장애물</strong>을 인식해 진동과 AR 화살표로 알려줍니다.
          </p>

          <button 
            onClick={() => {
              setIsARMode(true);
              if ('vibrate' in navigator) navigator.vibrate(200); // Trigger a vibration on start
            }} 
            className="w-full bg-blue-600 text-white font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)] relative z-10"
          >
            <Video className="w-5 h-5" />
            AR 길안내 시작 
          </button>
        </div>

        <AnimatePresence>
          {isARMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex flex-col pt-safe">
               <div className="flex justify-between items-center px-5 py-4 z-30 absolute top-0 w-full bg-gradient-to-b from-black/80 to-transparent">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse blur-[1px]"></div>
                   <span className="font-black text-white text-sm">실시간 AI 비전 스캔중</span>
                 </div>
                 <button onClick={() => setIsARMode(false)} className="bg-white/20 backdrop-blur-md p-2 rounded-full"><X className="w-5 h-5 text-white"/></button>
               </div>

               {/* Simulated Camera View Base */}
               <div className="flex-1 w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
                  {/* Real Camera Feed */}
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
                     {/* Simulated camera noise/blur overlay for tech feel */}
                     <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
                  </div>

                  {/* AR UI Elements */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-20 pointer-events-none z-10">
                    
                    {/* Perspective Path lines */}
                    <div className="w-full h-[60vh] absolute bottom-0 flex justify-center perspective-[1000px]">
                      <div className={cn(
                        "w-48 h-full border-x-[8px] transform rotateX-60 origin-bottom transition-all duration-1000",
                        arStep === 'straight' ? "border-blue-500/50 bg-gradient-to-t from-blue-500/20 to-transparent" :
                        arStep === 'obstacle' ? "border-red-500/50 bg-gradient-to-t from-red-500/20 to-transparent" :
                        "border-cyan-400/50 bg-gradient-to-t from-cyan-400/20 to-transparent translate-x-20 rotate-12"
                      )} style={{ transform: arStep === 'detour' ? 'perspective(600px) rotateX(60deg) rotateZ(15deg) translateX(40px)' : 'perspective(600px) rotateX(60deg)' }}>
                         
                         {/* Moving scan line */}
                         <div className={cn(
                           "w-full h-10 blur-md absolute top-1/2 animate-[scan_2s_linear_infinite]",
                           arStep === 'straight' ? "bg-blue-400" : arStep === 'obstacle' ? "bg-red-500" : "bg-cyan-400"
                         )}></div>
                         <style>{`@keyframes scan { from { top: 100%; opacity: 0; } 50% { opacity: 0.8; } to { top: 0%; opacity: 0; } }`}</style>
                      </div>
                    </div>

                    <motion.div 
                       initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ repeat: Infinity, duration: 1.5 }}
                       className={cn(
                         "w-24 h-24 rounded-full flex justify-center items-center backdrop-blur-sm -mt-32 relative z-20 border-2 transition-colors duration-500",
                         arStep === 'straight' ? "bg-blue-500/20 border-blue-400" : 
                         arStep === 'obstacle' ? "bg-red-500/20 border-red-500" : 
                         "bg-cyan-400/20 border-cyan-400"
                       )}
                    >
                      <ArrowUp className={cn("w-12 h-12 transition-all duration-500", 
                        arStep === 'straight' ? "text-blue-400" : 
                        arStep === 'obstacle' ? "text-red-500 opacity-50" : 
                        "text-cyan-400 rotate-45")} 
                      />
                    </motion.div>
                    
                    <span className="font-black text-2xl text-white drop-shadow-md mt-6 relative z-20 transition-all duration-500 bg-black/40 px-6 py-2 rounded-full border border-white/10 backdrop-blur-xl">
                      {arStep === 'straight' ? "앞으로 15m 직진하세요" : 
                       arStep === 'obstacle' ? "정지! 전방 단차 감지" : 
                       "우측 경사로 방향으로 진입하세요"}
                    </span>
                  </div>

                  {/* AR Obstacle Alert */}
                  <AnimatePresence>
                    {arStep === 'obstacle' && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: -20 }} transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
                        className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur-md p-4 rounded-2xl border-2 border-red-400 flex flex-col items-center gap-2 z-30 shadow-[0_0_40px_rgba(239,68,68,0.8)] w-max"
                      >
                        <AlertTriangle className="w-10 h-10 text-white animate-pulse" />
                        <div className="text-center">
                          <h4 className="text-sm font-black text-white whitespace-nowrap uppercase tracking-widest mb-1">장애물 경고</h4>
                          <h4 className="text-lg font-black text-white whitespace-nowrap">전방 2m 앞 단차 (15cm)</h4>
                          <p className="text-xs text-white/80 font-bold bg-black/30 px-3 py-1 rounded-full mt-2 inline-block">우회 경로 탐색 중...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Bottom Navigation Stats */}
                  <div className="absolute bottom-8 left-5 right-5 z-20 pointer-events-none">
                     <div className="bg-black/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 flex justify-between items-center">
                        <div className="flex flex-col">
                           <span className="text-[10px] text-zinc-400 font-bold mb-1">도착지</span>
                           <span className="text-sm font-black text-white">객석 1층 메인 게이트</span>
                        </div>
                        <div className="text-right flex flex-col">
                           <span className="text-[10px] text-zinc-400 font-bold mb-1">남은 거리</span>
                           <span className="text-lg font-black text-cyan-400">15m <span className="text-xs text-zinc-300">/ 1분</span></span>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3D S-MAP Viewer */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Building2 className="text-cyan-400 w-5 h-5" /> 건물 내부 S-MAP (3D)
        </h2>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden border-b-4 border-r-4">
          <div className="aspect-[4/3] bg-zinc-950 relative flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#00ffcc 1px, transparent 1px), linear-gradient(90deg, #00ffcc 1px, transparent 1px)', backgroundSize: '30px 30px', transform: 'perspective(500px) rotateX(45deg) scale(2)' }}></div>
            
            <div className="relative z-10 text-center flex flex-col items-center p-5 bg-black/60 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <Layers className="w-10 h-10 text-cyan-400 mb-3 opacity-90 drop-shadow-[0_0_15px_rgba(0,255,204,0.4)]" />
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">3D 구조 시뮬레이터</h3>
              <p className="text-xs text-zinc-400 mb-5 font-medium max-w-[200px]">원하는 각도로 건물을 돌려보고, 층별 단면을 확인해보세요.</p>
              <button onClick={() => setIs3DMode(true)} className="bg-cyan-400 text-black font-black text-sm px-6 py-3 rounded-full hover:bg-white hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,204,0.3)]">
                건물 3D로 보기
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {is3DMode && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex flex-col pt-safe">
                <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-900 bg-black absolute top-0 w-full z-30 pb-safe shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                  <h2 className="font-black text-cyan-400 flex items-center gap-2"><Building2 className="w-5 h-5"/> S-MAP 디지털 트윈</h2>
                  <button onClick={() => setIs3DMode(false)} className="bg-zinc-800 p-2 rounded-full"><X className="w-5 h-5 text-white"/></button>
                </div>
                
                <div className="flex-1 w-full h-full relative overflow-hidden bg-zinc-950 flex items-center justify-center">
                  
                  {/* Layer Control Buttons */}
                  <div className="absolute top-20 left-5 z-20 flex flex-col gap-3">
                    <button onClick={() => setMapLayer('default')} className={cn("p-3 w-14 h-14 rounded-xl border flex flex-col items-center justify-center gap-1 shadow-lg backdrop-blur-md transition-all", mapLayer === 'default' ? "bg-cyan-400/20 border-cyan-400 text-cyan-400" : "bg-black/50 border-zinc-700 text-white hover:bg-zinc-800")}>
                      <Layers className="w-5 h-5 mb-0.5" />
                      <span className="text-[9px] font-bold">기본뷰</span>
                    </button>
                    <button onClick={() => setMapLayer('obstacle')} className={cn("p-3 w-14 h-14 rounded-xl border flex flex-col items-center justify-center gap-1 shadow-lg backdrop-blur-md transition-all", mapLayer === 'obstacle' ? "bg-red-500/20 border-red-500 text-red-400" : "bg-black/50 border-zinc-700 text-white hover:bg-zinc-800")}>
                      <ScanSearch className="w-5 h-5 mb-0.5" />
                      <span className="text-[9px] font-bold">장애물</span>
                    </button>
                    <button onClick={() => setMapLayer('wheelchair')} className={cn("p-3 w-14 h-14 rounded-xl border flex flex-col items-center justify-center gap-1 shadow-lg backdrop-blur-md transition-all", mapLayer === 'wheelchair' ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-black/50 border-zinc-700 text-white hover:bg-zinc-800")}>
                      <Expand className="w-5 h-5 mb-0.5" />
                      <span className="text-[9px] font-bold">반경체크</span>
                    </button>
                  </div>

                  <motion.div drag dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }} dragElastic={0.2} className="w-[300vw] h-[300vh] absolute top-1/2 left-1/2 -ml-[150vw] -mt-[150vh] cursor-grab active:cursor-grabbing flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(circle at center, #3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f4620 1px, transparent 1px), linear-gradient(0deg, #3f3f4620 1px, transparent 1px)', backgroundSize: '100px 100px', transformStyle: 'preserve-3d' }}>
                    
                    {/* Simulated 3D Building Base */}
                    <div className="relative w-96 h-[400px] transform rotateX-60 -rotate-z-12 preserve-3d" style={{ transform: 'perspective(1200px) rotateX(60deg) rotateZ(-20deg)', transformStyle: 'preserve-3d' }}>
                       
                       {/* Layer 1 (Ground / B1) */}
                       <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm border-2 border-zinc-700 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.8)]" style={{ transform: 'translateZ(-50px)' }}>
                         {/* Details on base floor */}
                       </div>
                       
                       {/* Main Interaction Layer (1F) */}
                       <div className="absolute inset-0 bg-zinc-800/80 backdrop-blur-md border border-cyan-400/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 transition-all duration-500" style={{ transform: 'translateZ(20px)' }}>
                         <h4 className="text-zinc-500 font-black text-3xl tracking-widest uppercase opacity-40 absolute top-6 left-6">1F Area</h4>
                         
                         {/* Internal Walls (Simulated 3D Extrusions) */}
                         <div className="absolute top-32 left-10 w-2 h-40 bg-zinc-600 rounded drop-shadow-xl z-20"></div>
                         <div className="absolute top-32 left-10 w-40 h-2 bg-zinc-600 rounded drop-shadow-xl z-20"></div>

                         <div className="absolute right-8 bottom-8 w-28 h-32 border border-cyan-400/40 bg-zinc-900/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform z-30">
                           <div className="text-center">
                             <MapIcon className="w-6 h-6 text-cyan-400 mx-auto mb-1 opacity-80" />
                             <span className="text-xs font-black text-cyan-400">휴게공간</span>
                           </div>
                         </div>

                         {/* Conditional Overlays */}
                         {mapLayer === 'obstacle' && (
                             <div className="absolute inset-0 z-40 pointer-events-none">
                               <div className="absolute top-20 right-20 w-32 h-16 border-2 border-red-500 bg-red-500/20 backdrop-blur-sm rounded-lg animate-pulse flex flex-col items-center justify-center font-bold text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] transform hover:scale-110 transition-transform pointer-events-auto">
                                  <AlertTriangle className="w-5 h-5 mb-1" />
                                  <span className="text-[10px]">⚠️ 계단 40cm 단차</span>
                               </div>
                             </div>
                         )}

                         {mapLayer === 'wheelchair' && (
                             <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
                               <div className="absolute bottom-16 left-20">
                                   <div className="w-40 h-40 border-[3px] border-dashed border-blue-400 bg-blue-500/10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] relative">
                                        <div className="absolute -top-8 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap">회전 반경 1.5m 완벽 충족</div>
                                        <div className="w-8 h-8 rounded-full bg-blue-400 opacity-50 relative z-10 animate-ping"></div>
                                   </div>
                               </div>
                               <svg className="absolute w-full h-full inset-0" style={{ pointerEvents: 'none' }}>
                                 <path d="M 120 300 Q 200 300 250 150 T 350 100" fill="transparent" stroke="#3b82f6" strokeWidth="6" strokeDasharray="12 6" strokeLinecap="round" className="animate-[dash_1s_linear_infinite]" />
                                 <style>{`@keyframes dash { to { stroke-dashoffset: -18; } }`}</style>
                               </svg>
                             </div>
                         )}
                       </div>
                       
                       {/* Layer 3 (Ghosted Roof) */}
                       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/10 border border-white/5 rounded-3xl" style={{ transform: 'translateZ(100px)' }}>
                       </div>
                    </div>
                  </motion.div>
                  
                  <div className="absolute bottom-8 left-5 right-5 z-20 pointer-events-none bg-black/70 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                     <h3 className="text-base font-black text-white">{mapLayer === 'default' ? "건물 입체 투시도" : mapLayer === 'obstacle' ? "위험 요소(단차/장애물) 분석" : "휠체어 이동 시뮬레이션"}</h3>
                     <p className="text-xs font-medium text-zinc-400 mt-2 leading-relaxed">{mapLayer === 'default' ? "화면을 드래그하여 로비 구조를 입체적으로 확인하세요. 줌인/줌아웃도 가능합니다." : mapLayer === 'obstacle' ? "휠체어 통행에 방해가 되는 1cm 이상의 단차와 장애 구역을 붉은색으로 강조합니다." : "보행로 유효 폭(1.2m 이상)과 휠체어 회전 구간(1.5m 구역)을 시뮬레이션합니다."}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Traffic Integrations */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Train className="text-cyan-400 w-5 h-5" /> 교통 연동
        </h2>
        <div className="grid gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
              <Navigation className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1 text-white">또타지하철 연동</h3>
              <p className="text-xs text-zinc-400">지하철역 E/V 고장 현황 실시간 반영</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
