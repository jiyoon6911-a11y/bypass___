import { Glasses, Users, ArrowRight, CheckCircle2, UserCircle2, CalendarDays, Clock, Info } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../lib/auth-context';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Simulated DB of booked slots to show realistic unavailability
const INITIAL_BOOKED_SLOTS = {
  'manager': {
    '2026-05-18': ['10:00', '14:00'],
    '2026-05-19': ['11:00', '15:00', '16:00'],
    '2026-05-20': ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'], // Almost full
  },
  'glasses': {
    '2026-05-18': ['14:00', '19:00'],
    '2026-05-21': ['19:00'],
  }
};

const TIME_SLOTS = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '19:00'];

const generateCalendarDays = () => {
  // Mock calendar for May 2026
  const days = [];
  // 1st of May is Friday (padding 4 empty slots for Mon-Thu in some views, but let's just do a generic grid)
  for (let i = 0; i < 4; i++) days.push(null); // Empty slots for alignment
  for (let i = 1; i <= 31; i++) {
    days.push(`2026-05-${i.toString().padStart(2, '0')}`);
  }
  return days;
};

export function AppServices() {
  const { user, profile } = useAuth();
  
  const [activeService, setActiveService] = useState<'manager' | 'glasses' | null>(null);
  const [bookingModal, setBookingModal] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1); // 1: Date, 2: Time, 3: Success
  
  // To simulate global booked state
  const [bookedDatabase, setBookedDatabase] = useState<Record<string, Record<string, string[]>>>(INITIAL_BOOKED_SLOTS);
  
  // User's own reservations
  const [myReservations, setMyReservations] = useState<{service: string, date: string, time: string}[]>([]);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<{service: string, date: string, time: string} | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const days = useMemo(() => generateCalendarDays(), []);

  const openBookingFlow = (service: 'manager' | 'glasses') => {
    setActiveService(service);
    setBookingStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingModal(true);
  };

  const getDayStatus = (dateString: string) => {
    if (!activeService) return 'available';
    const slots = bookedDatabase[activeService][dateString] || [];
    if (slots.length >= TIME_SLOTS.length) return 'full';
    if (slots.length > TIME_SLOTS.length - 2) return 'limited';
    return 'available';
  };

  const handleConfirmReservation = () => {
    if (!activeService || !selectedDate || !selectedTime) return;
    
    // Auto add to booked database
    setBookedDatabase(prev => {
      const newDb = { ...prev };
      if (!newDb[activeService][selectedDate]) newDb[activeService][selectedDate] = [];
      newDb[activeService][selectedDate] = [...newDb[activeService][selectedDate], selectedTime];
      return newDb;
    });

    setMyReservations(prev => [...prev, { service: activeService, date: selectedDate, time: selectedTime }]);
    setBookingStep(3);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black px-5 py-8 pb-32">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black mb-2">매칭 & 예약</h1>
          <p className="text-zinc-400 font-medium text-sm">관람에 필요한 리소스를 사전에 확보하세요</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-xs font-bold text-cyan-400">
          <UserCircle2 className="w-4 h-4" />
          {profile?.displayName || 'User'}님
        </div>
      </header>

     {/* My Reservations Preview */}
      {myReservations.length > 0 && (
        <div className="mb-8 p-4 bg-zinc-900 border border-cyan-400/20 rounded-2xl shadow-[0_0_20px_rgba(0,255,204,0.1)]">
           <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-cyan-400"/> 나의 확정된 예약</h3>
           <div className="flex flex-col gap-2">
             {myReservations.map((res, idx) => (
                <div key={idx} className="flex justify-between items-center bg-black p-3 rounded-xl border border-zinc-800">
                   <div>
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-sm line-clamp-1 w-max mb-1">
                        {res.service === 'manager' ? '접근성 매니저' : 'AI 자막안경'}
                      </span>
                      <p className="text-xs font-bold text-white">{res.date} · {res.time}</p>
                   </div>
                   <div className="flex items-center gap-3">
                     <button
                       onClick={() => {
                         setCancelTarget(res);
                         setCancelReason('');
                         setCancelModalOpen(true);
                       }}
                       className="text-xs font-bold text-rose-400 border border-rose-400/30 px-3 py-1.5 rounded-full hover:bg-rose-400/10 transition-colors"
                     >
                       예약 취소
                     </button>
                     <CheckCircle2 className="w-5 h-5 text-green-500 hidden sm:block" />
                   </div>
                </div>
             ))}
           </div>
        </div>
      )}

      {/* Cancel Modal */}
      <BottomSheet isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} title="예약 취소">
        <div className="py-2 flex flex-col gap-4">
          <p className="text-sm font-medium text-zinc-400">
            예약을 취소하시려면 취소 사유를 입력해주세요. <br/>
            (노쇼 방지 및 서비스 개선을 위해 수집됩니다.)
          </p>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="어떤 이유로 취소하시나요?"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 h-32 resize-none"
          />
          <button 
            disabled={!cancelReason.trim()}
            onClick={() => {
              if (cancelTarget) {
                setMyReservations(prev => prev.filter(r => r !== cancelTarget));
                
                // Optional: remove from booked DB so it frees up the slot
                setBookedDatabase(prev => {
                  const newDb = { ...prev };
                  if (newDb[cancelTarget.service][cancelTarget.date]) {
                    newDb[cancelTarget.service][cancelTarget.date] = newDb[cancelTarget.service][cancelTarget.date].filter(t => t !== cancelTarget.time);
                  }
                  return newDb;
                });
              }
              alert('예약이 취소되었습니다.');
              setCancelModalOpen(false);
            }}
            className="w-full py-4 rounded-xl font-black bg-rose-500 text-white hover:bg-rose-600 focus:outline-none disabled:opacity-50 transition-colors"
          >
            취소 확정
          </button>
        </div>
      </BottomSheet>

      <div className="space-y-6">
        
        {/* Manager Matching */}
        <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-[60px] pointer-events-none"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-cyan-400 flex items-center justify-center rounded-2xl mb-6 shadow-[0_5px_20px_rgba(0,255,204,0.3)]">
              <Users className="w-7 h-7 text-black" />
            </div>
            <h2 className="text-2xl font-black mb-2 text-white">접근성 매니저 사전 예약</h2>
            <p className="text-sm font-medium text-zinc-400 mb-6 leading-relaxed">
              가까운 역에서 공연장 좌석까지, 오프메이트가 1:1 현장 동행을 지원합니다. (선착순 마감)
            </p>
            <button 
              onClick={() => openBookingFlow('manager')}
              className="w-full flex items-center justify-center gap-2 bg-white text-black font-black py-4 px-6 rounded-2xl hover:bg-cyan-400 transition-colors shadow-lg"
            >
              <CalendarDays className="w-5 h-5"/>
              <span>동행 매니저 일정 확인 및 예약</span>
            </button>
          </div>
        </div>

        {/* AI Glasses */}
        <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>
          <div className="w-14 h-14 bg-zinc-800 border border-zinc-700 flex items-center justify-center rounded-2xl mb-6 shadow-lg">
            <Glasses className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-black mb-2 text-white">AI 자막안경 현장 대여</h2>
          <p className="text-sm font-medium text-zinc-400 mb-6 leading-relaxed">
            무대에서 시선을 뗄 필요 없이, AR 글래스로 실시간 자막을 제공받으세요. 기기 수량이 제한되어 있습니다.
          </p>
          <button 
            onClick={() => openBookingFlow('glasses')}
            className="w-full flex justify-center items-center gap-2 font-black py-4 px-6 rounded-2xl border border-zinc-700 bg-zinc-800/80 text-white hover:bg-zinc-700"
          >
            <CalendarDays className="w-5 h-5"/>
            기기 대여 가능 시간 조회
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <BottomSheet 
        isOpen={bookingModal} 
        onClose={() => setBookingModal(false)} 
        title={activeService === 'manager' ? "접근성 매니저 예약" : "AI 안경 예약"}
      >
        <div className="min-h-[400px]">
           {bookingStep === 1 && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col">
                <div className="flex justify-between items-end mb-4 pr-1">
                  <div>
                    <h3 className="font-black text-lg text-white">날짜 선택</h3>
                    <p className="text-xs text-zinc-400">2026년 5월</p>
                  </div>
                  <div className="flex gap-2">
                     <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold"><div className="w-2 h-2 rounded-full bg-cyan-400/20 border border-cyan-400"></div>여유</span>
                     <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold"><div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500"></div>혼잡</span>
                     <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold"><div className="w-2 h-2 rounded-full bg-zinc-800 line-through"></div>마감</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5 mb-2 px-1">
                  {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                    <div key={d} className="text-center text-xs font-bold text-zinc-500 py-1">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5 mb-6 px-1">
                  {days.map((dateString, i) => {
                    if (!dateString) return <div key={i} className="aspect-square"></div>;
                    
                    const dayNum = parseInt(dateString.split('-')[2], 10);
                    const status = getDayStatus(dateString);
                    const isPast = dayNum < 18; // Mock today being 18th
                    const isSelected = selectedDate === dateString;

                    return (
                      <button
                        key={i}
                        disabled={isPast || status === 'full'}
                        onClick={() => setSelectedDate(dateString)}
                        className={cn(
                          "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all relative",
                          isPast ? "opacity-30 cursor-not-allowed bg-transparent text-zinc-600" :
                          status === 'full' ? "bg-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed line-through" :
                          isSelected ? "bg-white text-black scale-110 z-10 shadow-lg" :
                          "bg-zinc-900 border border-zinc-800 text-white hover:border-cyan-400",
                          status === 'limited' && !isSelected && !isPast && "border-yellow-500/50 text-yellow-500"
                        )}
                      >
                        {dayNum}
                        {isSelected && <motion.div layoutId="selGlow" className="absolute inset-0 border-2 border-cyan-400 rounded-xl shadow-[0_0_10px_rgba(0,255,204,0.5)]"></motion.div>}
                      </button>
                    );
                  })}
                </div>

                <button 
                  disabled={!selectedDate}
                  onClick={() => setBookingStep(2)}
                  className={cn("w-full py-4 rounded-xl font-black flex justify-center items-center gap-2 transition-all mt-auto", selectedDate ? "bg-cyan-400 text-black hover:bg-white" : "bg-zinc-800 text-zinc-500")}
                >
                  시간대 확인하기 <ArrowRight className="w-5 h-5"/>
                </button>
             </motion.div>
           )}

           {bookingStep === 2 && activeService && selectedDate && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl mb-6">
                   <p className="text-xs text-zinc-400 font-bold mb-1">선택된 날짜</p>
                   <div className="flex justify-between items-center">
                     <p className="font-black text-white">{selectedDate}</p>
                     <button onClick={() => setBookingStep(1)} className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">변경</button>
                   </div>
                </div>

                <h3 className="font-black text-lg text-white mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-cyan-400"/> 예약 시간 선택</h3>
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {TIME_SLOTS.map(time => {
                    const isBooked = (bookedDatabase[activeService][selectedDate] || []).includes(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        disabled={isBooked}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "py-3 rounded-xl font-bold flex justify-center items-center transition-all border",
                          isBooked ? "bg-zinc-900 border-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed" :
                          isSelected ? "bg-cyan-400 border-cyan-400 text-black shadow-[0_0_15px_rgba(0,255,204,0.4)]" :
                          "bg-black border-zinc-700 text-white hover:border-cyan-400"
                        )}
                      >
                        {time}
                        {isBooked && <span className="absolute text-[10px] bg-zinc-800 px-1 inline-block mt-8 line-through">예약마감</span>}
                      </button>
                    )
                  })}
                </div>

                <button 
                  disabled={!selectedTime}
                  onClick={handleConfirmReservation}
                  className={cn("w-full py-4 rounded-xl font-black mt-auto transition-all", selectedTime ? "bg-cyan-400 text-black hover:bg-white" : "bg-zinc-800 text-zinc-500")}
                >
                  최종 예약 확정
                </button>
             </motion.div>
           )}

           {bookingStep === 3 && (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="w-20 h-20 bg-cyan-400/20 rounded-full flex items-center justify-center border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,255,204,0.3)] mb-4">
                  <CheckCircle2 className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-black text-white">예약 확정 완료</h3>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl w-full max-w-xs mt-2">
                   <p className="text-xs text-zinc-400 font-bold mb-1">일정</p>
                   <p className="text-sm font-black text-white mb-3">{selectedDate} / {selectedTime}</p>
                   
                   <p className="text-xs text-zinc-400 font-bold mb-1">예약 내역</p>
                   <p className="text-sm font-medium text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded w-max mx-auto mb-2">
                     {activeService === 'manager' ? '동행 매니저 현장 미팅' : 'AI 자막안경 현장 수령'}
                   </p>
                </div>
                
                <div className="flex items-start gap-2 bg-blue-500/10 p-3 rounded-lg border border-blue-500/30 w-full max-w-xs mt-4 text-left">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-200 font-medium">카카오톡으로 상세한 약속 장소와 담당자 연락처가 발송되었습니다. 다른 예약자의 일정에 지장이 없도록 노쇼에 주의해주세요.</p>
                </div>

                <button 
                  onClick={() => setBookingModal(false)}
                  className="w-full max-w-xs py-4 rounded-xl font-black transition-all bg-white text-black hover:bg-cyan-400 mt-6"
                >
                  확인
                </button>
             </motion.div>
           )}
        </div>
      </BottomSheet>
    </div>
  );
}

