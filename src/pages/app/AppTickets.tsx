import { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Heart, ChevronRight, Ticket as TicketIcon, Link as LinkIcon, CalendarDays, ExternalLink, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { BottomSheet } from '../../components/ui/BottomSheet';

// Dummy data for prototype
const INITIAL_TICKETS = [
  { id: 2, title: '특별 연극 (VR 시범운영)', date: '2026.06.01 (수) 20:00', venue: '한림대학교 10관', source: '자체 예매처', url: '#', status: 'upcoming' }
];

const NEW_SYNCED_TICKET = { id: 1, title: '오페라의 유령', date: '2026.05.28 (토) 19:30', venue: '샤롯데씨어터', source: '인터파크 티켓', url: 'https://tickets.interpark.com', status: 'upcoming' };

const MY_BOOKMARKS = [
  { id: 11, type: '뮤지컬', title: '시카고', venue: '디큐브 링크아트센터', ticketOpen: '2026.05.20 14:00', source: '멜론티켓' },
  { id: 12, type: '연극', title: '햄릿', venue: '국립극장 해오름', ticketOpen: '상시 예매', source: '인터파크 티켓' }
];

const PROVIDERS = [
  { id: 'interpark', name: '인터파크 티켓', color: 'bg-red-500' },
  { id: 'melon', name: '멜론티켓', color: 'bg-green-500' },
  { id: 'yes24', name: 'YES24 티켓', color: 'bg-blue-500' },
  { id: 'ticketlink', name: '티켓링크', color: 'bg-indigo-500' },
];

export function AppTickets() {
  const { profile } = useAuth();
  
  const [myTickets, setMyTickets] = useState(INITIAL_TICKETS);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSync = (providerId: string) => {
    setSyncingId(providerId);
    setTimeout(() => {
      if (!myTickets.some(t => t.id === NEW_SYNCED_TICKET.id)) {
        setMyTickets(prev => [NEW_SYNCED_TICKET, ...prev]);
      }
      setSyncingId(null);
      setSyncModalOpen(false);
      alert('예매처가 연동되었습니다.');
    }, 1500);
  };
  
  // Simple calendar generation
  const today = new Date('2026-05-16');
  const daysInMonth = Array.from({length: 31}, (_, i) => i + 1);

  return (
    <div className="flex flex-col min-h-screen bg-black pb-32 font-sans">
      <header className="px-5 py-8 pb-4">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-black">나의 티켓</h1>
          <button 
            onClick={() => setSyncModalOpen(true)}
            className="text-xs font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-cyan-400/20 transition-colors"
          >
            <LinkIcon className="w-3 h-3" /> 예매처 연동
          </button>
        </div>
        <p className="text-zinc-400 font-medium text-sm">예매 내역과 찜한 공연의 일정을 한눈에 확인하세요</p>
      </header>

      <section className="px-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TicketIcon className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-black text-white">다가오는 관람일</h2>
        </div>
        
        {myTickets.length > 0 ? (
          <div className="flex flex-col gap-4">
            {myTickets.map(ticket => (
              <div key={ticket.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group">
                {/* Decorative cutouts for ticket look */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-black rounded-full border-r border-zinc-800"></div>
                <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-black rounded-full border-l border-zinc-800"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-4 pl-4 pr-2 relative z-10">
                  <div>
                    <span className="text-xxs font-black text-cyan-400 bg-cyan-400/10 px-2 py-1.5 rounded-md mb-2 inline-block border border-cyan-400/20">예매 완료</span>
                    <h3 className="text-xl font-black text-white mb-1.5">{ticket.title}</h3>
                    <p className="text-sm text-zinc-400 font-medium tracking-tight">예매일시: {ticket.date}</p>
                  </div>
                </div>
                
                <div className="ml-4 mr-2 border-t border-dashed border-zinc-700 pt-4 flex flex-col gap-2.5 relative z-10">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-zinc-500 text-xs font-bold w-12 shrink-0">장소</span>
                    <span className="text-white text-right break-keep">{ticket.venue}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-zinc-500 text-xs font-bold w-12 shrink-0">예매처</span>
                    <a href={ticket.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-white transition-colors flex items-center gap-1 font-bold bg-cyan-400/10 px-2 py-1 rounded">
                      {ticket.source} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 font-bold text-sm">예매된 공연이 없습니다.</p>
          </div>
        )}
      </section>

      <section className="px-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-black text-white">이번 달 일정</h2>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
           {/* Mini dummy calendar */}
           <div className="grid grid-cols-7 gap-1 text-center mb-2">
             {['일','월','화','수','목','금','토'].map((d, i) => <div key={d} className={cn("text-xs font-bold py-1", i === 0 ? "text-rose-400" : "text-zinc-500")}>{d}</div>)}
           </div>
           <div className="grid grid-cols-7 gap-1">
             {/* Padding days */}
             {Array.from({length: 5}).map((_, i) => <div key={`pad-${i}`} className="aspect-square p-1"></div>)}
             
             {daysInMonth.map(d => {
                const isTicket = d === 28;
                const isTicketOpen = d === 20;

                return (
                  <div key={d} className={cn("aspect-square p-1 flex flex-col items-center justify-center relative rounded-xl transition-colors", (isTicket || isTicketOpen) ? "bg-zinc-800" : "hover:bg-zinc-800/50")}>
                    <span className={cn("text-sm font-bold", isTicket ? "text-white" : "text-zinc-400")}>{d}</span>
                    <div className="flex gap-1 mt-1">
                      {isTicket && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>}
                      {isTicketOpen && <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>}
                    </div>
                  </div>
                )
             })}
           </div>
           <div className="mt-4 pt-4 border-t border-zinc-800 flex gap-5 justify-center bg-zinc-950/50 -mx-4 -mb-4 p-4 rounded-b-2xl">
             <div className="flex items-center gap-2 text-xs font-bold text-zinc-400"><div className="w-2 h-2 rounded-full bg-cyan-400"></div> 관람 예정일</div>
             <div className="flex items-center gap-2 text-xs font-bold text-zinc-400"><div className="w-2 h-2 rounded-full bg-rose-400"></div> 티켓 오픈일</div>
           </div>
        </div>
      </section>

      <section className="px-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="w-5 h-5 text-rose-400" />
          <h2 className="text-lg font-black text-white">찜한 공연 티켓팅 정보</h2>
        </div>
        
        <div className="flex flex-col gap-3">
          {MY_BOOKMARKS.map(show => (
             <div key={show.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4 items-center">
               <div className="w-14 h-14 rounded-xl bg-zinc-800 flex flex-col items-center justify-center shrink-0 border border-zinc-700">
                  <span className="text-[10px] font-bold text-zinc-500 mb-1">{show.ticketOpen.split(' ')[0].split('.')[1]}/{show.ticketOpen.split(' ')[0].split('.')[2]||'상시'}</span>
                  <span className="text-xs font-black text-rose-400">{show.ticketOpen.split(' ')[1] || '예매'}</span>
               </div>
               <div className="flex-1 min-w-0">
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-black block w-max mb-1 inline-block">{show.type}</span>
                  <h3 className="font-black text-white truncate mb-0.5">{show.title}</h3>
                  <div className="text-xs font-bold text-zinc-500 flex items-center justify-between">
                    <span className="truncate pr-2">{show.venue}</span>
                  </div>
               </div>
               <div className="shrink-0 text-right">
                  <span className="text-[10px] font-black text-cyan-400 border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 rounded">{show.source}</span>
               </div>
             </div>
          ))}
        </div>
      </section>

      <BottomSheet isOpen={syncModalOpen} onClose={() => setSyncModalOpen(false)} title="예매처 연동하기">
        <div className="py-2 flex flex-col gap-4">
          <p className="text-sm font-medium text-zinc-400 leading-relaxed mb-2">
            예매처 계정을 연동하면 예매 내역이 자동으로 불러와집니다. 현재 프로토타입에서는 예매 내역이 가상으로 연동됩니다.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PROVIDERS.map(provider => (
              <button
                key={provider.id}
                disabled={syncingId !== null}
                onClick={() => handleSync(provider.id)}
                className={cn(
                  "flex items-center justify-center p-4 rounded-xl font-black text-white transition-all disabled:opacity-50",
                  provider.color
                )}
              >
                {syncingId === provider.id ? (
                  <span className="animate-pulse">연동 중...</span>
                ) : (
                  provider.name
                )}
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
