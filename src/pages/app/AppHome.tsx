import { Search, MapPin, Eye, AudioLines, Subtitles, ChevronRight, Bookmark, Volume2, VolumeX, HelpCircle, Navigation, Mic, MicOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { useAuth } from '../../lib/auth-context';

const BASE_SHOWS = [
  { id: 1, type: '뮤지컬', title: '오페라의 유령', venue: '샤롯데씨어터', distance: '1.2km', badges: ['휠체어', '자막'], imgGradient: 'from-cyan-400/20 to-zinc-900', imgClass: 'bg-zinc-800' },
  { id: 2, type: '연극', title: '햄릿', venue: '국립극장 해오름', distance: '3.4km', badges: ['음성해설'], imgGradient: 'from-zinc-800 to-zinc-700', imgClass: 'bg-zinc-800' },
  { id: 3, type: '콘서트', title: '싸이 흠뻑쇼', venue: '잠실주경기장', distance: '4.1km', badges: ['휠체어'], imgGradient: 'from-blue-600/30 to-black', imgClass: 'bg-zinc-900' },
  { id: 4, type: '연극', title: '특별 연극 (VR 시범운영)', venue: '한림대학교 10관', distance: '500m', badges: ['휠체어', 'VR시야'], imgGradient: 'from-blue-600/30 to-black', imgClass: 'bg-zinc-900' }
];

const TYPES = ['뮤지컬', '연극', '클래식', '콘서트', '오페라', '무용', '전통예술', '대중음악'];
const BADGES = ['휠체어', '자막', '음성해설', '수어', 'VR시야'];
const GRADIENTS = ['from-cyan-400/20 to-zinc-900', 'from-zinc-800 to-zinc-700', 'from-blue-600/30 to-black', 'from-purple-600/30 to-black', 'from-green-600/30 to-black'];
const VENUES = ['예술의전당', '세종문화회관', '샤롯데씨어터', '블루스퀘어', '올림픽공원', '국립극장', 'LG아트센터', '충무아트센터'];

const GENERATED_SHOWS = Array.from({ length: 300 }, (_, i) => {
  const type = TYPES[i % TYPES.length];
  // Assign 1 to 5 badges randomly based on index, occasionally all badges to guarantee filter matches
  const badgeCount = (i % BADGES.length) + 1;
  const showBadges = [];
  if (i % 3 === 0) {
    showBadges.push('휠체어', '자막', '음성해설', '수어', 'VR시야'); 
  } else {
    for (let j = 0; j < badgeCount; j++) {
      showBadges.push(BADGES[(i + j) % BADGES.length]);
    }
  }

  return {
    id: i + 5,
    type,
    title: `공연명 ${i + 1}`,
    venue: VENUES[i % VENUES.length],
    distance: `${(Math.random() * 5 + 0.1).toFixed(1)}km`,
    badges: Array.from(new Set(showBadges)),
    imgGradient: GRADIENTS[i % GRADIENTS.length],
    imgClass: 'bg-zinc-900'
  };
});

const SHOWS = [...BASE_SHOWS, ...GENERATED_SHOWS];

export function AppHome() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [activeTag, setActiveTag] = useState('전체');
  
  // Set initial filters based on profile preferences
  const [filterMapPin, setFilterMapPin] = useState(
    profile?.preferences?.accessibility?.includes('휠체어 접근성') || false
  );
  const [filterSubtitles, setFilterSubtitles] = useState(
    profile?.preferences?.accessibility?.includes('자막 제공') || false
  );
  const [filterAudio, setFilterAudio] = useState(
    profile?.preferences?.accessibility?.includes('음성 해설') || false
  );
  const [filterSignLanguage, setFilterSignLanguage] = useState(
    profile?.preferences?.accessibility?.includes('수어 통역') || false
  );
  const [filterVR, setFilterVR] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  
  const [currentLocation, setCurrentLocation] = useState('강원도 춘천시 한림대학길 1');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationSearchKeyword, setLocationSearchKeyword] = useState('');

  useEffect(() => {
    // Simulate location fetch if no override
    if (currentLocation === '강원도 춘천시 한림대학길 1' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
           // Provide a realistic sounding mockup for the prototype
           setTimeout(() => setCurrentLocation('서울특별시 강남구 테헤란로'), 1500);
        },
        (err) => {}, // Keep default
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationSearchKeyword.trim()) {
      setCurrentLocation(locationSearchKeyword.trim());
      setLocationModalOpen(false);
      speak(`${locationSearchKeyword}로 위치를 변경했습니다.`);
    }
  };

  const recommendedShows = useMemo(() => {
    if (!profile?.preferences) return [];
    
    const userGenres = profile.preferences.genres || [];
    const userAcc = profile.preferences.accessibility || [];
    
    return SHOWS.map(show => {
      let score = 0;
      if (userGenres.includes(show.type)) score += 2;
      
      const hasWheelchair = show.badges.includes('휠체어') && userAcc.includes('휠체어 접근성');
      const hasSubtitles = show.badges.includes('자막') && userAcc.includes('자막 제공');
      const hasSign = show.badges.includes('수어') && userAcc.includes('수어 통역');
      const hasAudio = show.badges.includes('음성해설') && userAcc.includes('음성 해설');
      
      if (hasWheelchair) score += 3;
      if (hasSubtitles) score += 3;
      if (hasSign) score += 3;
      if (hasAudio) score += 3;
      
      return { ...show, score };
    })
    .filter(show => show.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // top 5 recommendations
  }, [profile]);

  const speak = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const toggleTTS = () => {
    const nextState = !ttsEnabled;
    setTtsEnabled(nextState);
    if (nextState && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("음성 읽어주기 모드가 켜졌습니다. 화면의 주요 내용을 소리 내어 읽어줍니다.");
      utterance.lang = 'ko-KR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      speak("음성 인식을 중지합니다.");
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("이 브라우저에서는 음성 인식을 지원하지 않습니다.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      speak("음성을 듣고 있습니다. 말씀해주세요.");
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      speak(`"${transcript}"으로 검색합니다.`);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('마이크 권한이 거부되었습니다. 브라우저 설정 혹은 상단의 마이크 권한을 허용해주세요. (프리뷰 환경에서는 새 탭에서 열어주세요)');
        speak("마이크 권한이 차단되어 음성 인식을 사용할 수 없습니다.");
      } else if (event.error === 'aborted') {
        // manually stopped or aborted, do not throw error or speak
      } else {
        speak("음성 인식에 실패했습니다. 다시 시도해주세요.");
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const filteredShows = useMemo(() => {
    return SHOWS.filter(show => {
      if (activeTag !== '전체' && show.type !== activeTag) return false;
      if (filterMapPin && !show.badges.includes('휠체어')) return false;
      if (filterSubtitles && !show.badges.includes('자막')) return false;
      if (filterAudio && !show.badges.includes('음성해설')) return false;
      if (filterSignLanguage && !show.badges.includes('수어')) return false;
      if (filterVR && !show.badges.includes('VR시야')) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        if (!show.title.toLowerCase().includes(query) && 
            !show.venue.toLowerCase().includes(query) &&
            !show.type.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [activeTag, filterMapPin, filterSubtitles, filterAudio, filterSignLanguage, filterVR, searchQuery]);

  return (
    <div className="flex flex-col min-h-full bg-black">
      {/* Top Header */}
      <header className="px-5 pt-8 pb-3 sticky top-0 bg-black/95 backdrop-blur-sm z-40 border-b border-zinc-900 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl tracking-tighter" onClick={() => speak("403 바이패스 앱입니다.")}>
            <span className="font-black bg-cyan-400 text-black px-1.5 py-0.5 mr-1 leading-none cursor-pointer">403</span>
            <span className="font-black text-white cursor-pointer">BYPASS</span>
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={toggleTTS} 
              className={cn("w-8 h-8 rounded-full flex justify-center items-center transition-colors", ttsEnabled ? "bg-cyan-400 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700")}
              aria-label="음성 읽어주기 토글"
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => { setHelpOpen(true); speak("이용 안내 모달을 엽니다."); }} 
              className="w-8 h-8 bg-zinc-800 text-white rounded-full flex justify-center items-center transition-colors hover:bg-zinc-700"
              aria-label="도움말 보기"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button 
              onClick={() => { setProfileOpen(true); speak("마이 접근성 프로필을 엽니다."); }} 
              className="w-8 h-8 bg-zinc-800 rounded-full flex justify-center items-center text-xs font-bold ring-2 ring-transparent hover:ring-cyan-400 transition-colors"
            >
              MY
            </button>
          </div>
        </div>
        
        {/* Location Display */}
        <div 
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 cursor-pointer w-max hover:text-cyan-400 transition-colors" 
          onClick={() => {
            speak(`현재 위치는 ${currentLocation} 입니다. 위치 변경을 원하시면 탭하세요.`);
            setLocationModalOpen(true);
          }}
        >
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentLocation}</span>
          <ChevronRight className="w-3 h-3 opacity-50" />
        </div>
      </header>

      {/* Search & Filters */}
      <section className="px-5 py-4 space-y-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="어떤 공연을 찾으시나요?" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => speak("검색창입니다. 원하시는 공연을 스크린 리더로 입력하세요.")}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-12 text-white font-medium placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
          <button 
            onClick={toggleListening}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors border",
              isListening ? "bg-cyan-400 border-cyan-400 text-black animate-pulse" : "bg-zinc-800/80 border-zinc-700 text-cyan-400 hover:bg-zinc-700"
            )}
            aria-label="음성 검색"
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Tags / Filtering */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {['전체', '뮤지컬', '연극', '콘서트', '클래식'].map((tag) => (
            <button 
              key={tag} 
              onClick={() => { setActiveTag(tag); speak(`${tag} 카테고리를 선택했습니다.`); }}
              className={cn(
                "whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-sm transition-colors border",
                activeTag === tag ? "bg-cyan-400 text-black border-cyan-400" : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-cyan-400/50"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
        
        {/* Amenity Quick Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
           <button 
             onClick={() => { setFilterMapPin(!filterMapPin); speak("휠체어 접근 가능 공연만 필터링합니다."); }}
             className={cn("flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border text-xs font-bold transition-all", filterMapPin ? "bg-cyan-400/10 border-cyan-400 text-cyan-400" : "bg-zinc-900 border-zinc-800 text-zinc-300")}
           >
             <MapPin className="w-3 h-3 text-cyan-400" /> 휠체어 접근
           </button>
           <button 
             onClick={() => { setFilterSubtitles(!filterSubtitles); speak("자막 제공 공연만 필터링합니다."); }}
             className={cn("flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border text-xs font-bold transition-all", filterSubtitles ? "bg-cyan-400/10 border-cyan-400 text-cyan-400" : "bg-zinc-900 border-zinc-800 text-zinc-300")}
           >
             <Subtitles className="w-3 h-3 text-cyan-400" /> 자막 제공
           </button>
           <button 
             onClick={() => { setFilterAudio(!filterAudio); speak("음성 해설 공연만 필터링합니다."); }}
             className={cn("flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border text-xs font-bold transition-all", filterAudio ? "bg-cyan-400/10 border-cyan-400 text-cyan-400" : "bg-zinc-900 border-zinc-800 text-zinc-300")}
           >
             <AudioLines className="w-3 h-3 text-cyan-400" /> 음성 해설
           </button>
           <button 
             onClick={() => { setFilterSignLanguage(!filterSignLanguage); speak("수어 통역 제공 공연만 필터링합니다."); }}
             className={cn("flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border text-xs font-bold transition-all", filterSignLanguage ? "bg-cyan-400/10 border-cyan-400 text-cyan-400" : "bg-zinc-900 border-zinc-800 text-zinc-300")}
           >
             <Eye className="w-3 h-3 text-cyan-400" /> 수어 통역
           </button>
           <button 
             onClick={() => { setFilterVR(!filterVR); speak("VR 시야 제공 공연만 필터링합니다."); }}
             className={cn("flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border text-xs font-bold transition-all", filterVR ? "bg-cyan-400/10 border-cyan-400 text-cyan-400" : "bg-zinc-900 border-zinc-800 text-zinc-300")}
           >
             <Navigation className="w-3 h-3 text-cyan-400" /> VR 시야
           </button>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="px-5 py-2">
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4">
          
          <div 
            className="snap-center shrink-0 w-full bg-cyan-400 text-black rounded-2xl p-6 relative overflow-hidden"
            onClick={() => speak("공식 홍보대사 403 서포터즈 1기 대모집. 접근성을 리뷰하고 리워드를 받으세요.")}
          >
            <div className="relative z-10 w-[70%]">
              <span className="text-xs font-black bg-black text-cyan-400 px-2 py-0.5 rounded-sm inline-block mb-2">공식 홍보대사</span>
              <h3 className="text-xl font-black leading-tight mb-2">403 서포터즈<br/>1기 대모집!</h3>
              <p className="text-xs font-bold opacity-80 mb-4">접근성 리뷰하고 리워드 받자</p>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  navigate('/app/supporters');
                }}
                className="text-xs font-black border-2 border-black rounded-full px-4 py-1.5 transition-colors flex items-center w-max gap-1 hover:bg-black hover:text-cyan-400"
              >
                지원하기
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-20 pointer-events-none">
              <Eye className="w-40 h-40" />
            </div>
          </div>

          <div 
            className="snap-center shrink-0 w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden"
            onClick={() => speak("단독 제휴 프로모션. 또타지하철과 코레일 콜라보. 집에서 공연장 좌석까지 끊김없이 이어집니다.")}
          >
            <div className="relative z-10 w-[75%]">
              <span className="text-xs font-black bg-white text-black px-2 py-0.5 rounded-sm inline-block mb-2">단독 제휴</span>
              <h3 className="text-xl font-bold leading-tight mb-2 text-white">또타지하철 <span className="text-cyan-400 font-black">X</span> KORAIL</h3>
              <p className="text-xs font-medium text-zinc-400 mb-4">집에서 공연장 좌석까지 끊김없이</p>
              <Link to="/map" className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400" onClick={(e) => e.stopPropagation()}>
                길찾기 연동 안내 <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Custom Recommended Shows - Only visible if there are matches */}
      {recommendedShows.length > 0 && (
        <section className="px-5 py-6 bg-gradient-to-b from-zinc-900/50 to-transparent">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-black mb-1" onClick={() => speak("유저님의 선호 장르와 필요 서비스를 반영한 맞춤 공연입니다.")}>
                나를 위한 맞춤 추천 공연
              </h2>
              <p className="text-xs text-zinc-400 font-medium">선호 장르와 필요 서비스 조건이 반영되었어요.</p>
            </div>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4">
            {recommendedShows.map((show) => (
              <Link
                key={show.id}
                to={`/app/show/${show.id}`}
                onClick={() => speak(`${show.title}. ${show.venue}. 추천 점수 ${show.score}점.`)}
                className="snap-start shrink-0 w-[240px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-colors block"
              >
                <div className={cn("w-full h-32 relative", show.imgClass)}>
                  <div className={cn("absolute inset-0 bg-gradient-to-tr opacity-50", show.imgGradient)} />
                  <div className="absolute top-2 left-2 flex gap-1">
                     <span className="text-[10px] font-black bg-cyan-400 text-black px-2 py-0.5 rounded-full">{show.type}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-lg text-white mb-1 leading-tight truncate">{show.title}</h3>
                  <p className="text-xs font-medium text-zinc-400 mb-3">{show.venue} · {show.distance}</p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {show.badges.map(badge => {
                      // Highlight badges that user wants
                      const userAcc = profile?.preferences?.accessibility || [];
                      let isPreferred = false;
                      if (badge === '휠체어' && userAcc.includes('휠체어 접근성')) isPreferred = true;
                      if (badge === '자막' && userAcc.includes('자막 제공')) isPreferred = true;
                      if (badge === '음성해설' && userAcc.includes('음성 해설')) isPreferred = true;
                      if (badge === '수어' && userAcc.includes('수어 통역')) isPreferred = true;

                      return (
                         <span key={badge} className={cn("text-[9px] font-black px-1.5 py-0.5 rounded border", isPreferred ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/30" : "bg-zinc-800/50 text-zinc-400 border-zinc-700")}>
                           {badge}
                         </span>
                      );
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popular Shows */}
      <section className="px-5 pb-6">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-black" onClick={() => speak("요즘 인기 있는 공연들입니다.")}>🔥 요즘 인기 있는 공연들</h2>
          <span className="text-xs font-bold text-cyan-400 cursor-pointer" onClick={() => speak("전체보기")}>전체보기</span>
        </div>
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4">
          {[...SHOWS].reverse().slice(0, 5).map((show) => (
            <Link
              key={show.id}
              to={`/app/show/${show.id}`}
              onClick={() => speak(`${show.title}. ${show.venue}.`)}
              className="snap-start shrink-0 w-[180px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-colors block group"
            >
              <div className={cn("w-full h-24 relative overflow-hidden", show.imgClass)}>
                <div className={cn("absolute inset-0 bg-gradient-to-tr opacity-50 group-hover:scale-110 transition-transform duration-500", show.imgGradient)} />
                <div className="absolute top-2 left-2 flex gap-1">
                   <span className="text-[9px] font-black bg-white/10 text-white backdrop-blur-md px-1.5 py-0.5 rounded-full">{show.type}</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-base text-white mb-0.5 truncate">{show.title}</h3>
                <p className="text-[10px] font-medium text-zinc-400">{show.venue}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Nearby Shows */}
      <section className="px-5 py-6 pt-0">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-black" onClick={() => speak("내 주변 예매 가능한 공연 리스트입니다.")}>내 주변 예매 가능한 공연</h2>
          <span className="text-xs font-bold text-cyan-400 cursor-pointer" onClick={() => speak("전체보기")}>전체보기</span>
        </div>

        <div className="space-y-4">
          {filteredShows.length === 0 ? (
            <div className="text-center py-10 bg-zinc-900/50 rounded-2xl border border-zinc-800" onClick={() => speak("해당 조건에 맞는 티켓이 없습니다.")}>
              <p className="text-zinc-400 font-bold text-sm">해당 조건에 맞는 티켓이 없습니다.</p>
            </div>
          ) : (
            filteredShows.map((show) => (
              <Link 
                key={show.id} 
                to={`/app/show/${show.id}`}
                onClick={() => speak(`${show.title}. ${show.venue}. 현재 위치에서 ${show.distance} 거리에 있습니다. 제공되는 서비스는 ${show.badges.join(', ')} 입니다.`)}
                className="flex gap-4 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50 hover:border-cyan-400/50 transition-colors"
                aria-label={`${show.title} 공연 페이지로 이동`}
              >
                <div className={cn("w-24 h-32 rounded-xl overflow-hidden shrink-0 relative", show.imgClass)}>
                  <div className={cn("absolute inset-0 bg-gradient-to-tr", show.imgGradient)} />
                </div>
                <div className="flex flex-col justify-center py-1 w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-cyan-400 border border-cyan-400/30 bg-cyan-400/5 px-1.5 py-0.5 rounded-sm w-max">{show.type}</span>
                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-1"><MapPin className="w-3 h-3" /> {show.distance}</span>
                  </div>
                  <h3 className="text-lg font-black mb-1 text-white tracking-tight leading-tight">{show.title}</h3>
                  <p className="text-xs text-zinc-400 font-medium mb-3">{show.venue}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {show.badges.includes('휠체어') && (
                      <div className="bg-zinc-800 px-2 py-1 rounded gap-1 flex items-center">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span className="text-[10px] font-bold text-zinc-300">단차 없음</span>
                      </div>
                    )}
                    {show.badges.includes('자막') && (
                      <div className="bg-zinc-800 px-2 py-1 rounded gap-1 flex items-center">
                        <Subtitles className="w-3 h-3 text-cyan-400" />
                        <span className="text-[10px] font-bold text-zinc-300">자막 대여</span>
                      </div>
                    )}
                    {show.badges.includes('음성해설') && (
                      <div className="bg-zinc-800 px-2 py-1 rounded gap-1 flex items-center">
                        <AudioLines className="w-3 h-3 text-cyan-400" />
                        <span className="text-[10px] font-bold text-zinc-300">음성 해설</span>
                      </div>
                    )}
                    {show.badges.includes('VR시야') && (
                      <div className="bg-blue-900/30 border border-blue-500/50 px-2 py-1 rounded gap-1 flex items-center">
                        <span className="text-[10px] font-black text-blue-400">VR 실사 시야</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
      
      {/* Spacer for bottom nav */}
      <div className="h-10"></div>

      {/* Detailed Help / Onboarding Modal */}
      <BottomSheet isOpen={helpOpen} onClose={() => setHelpOpen(false)} title="모든 기능 상세 안내">
        <div className="flex flex-col gap-6 p-1">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-lg">
             <div className="flex items-center gap-3 mb-2 text-cyan-400">
               <Volume2 className="w-5 h-5"/>
               <h4 className="font-black text-sm">시각 장애인을 위한 환경 (읽어주기)</h4>
             </div>
             <p className="text-xs text-zinc-400 font-medium leading-relaxed">
               앱 우측 상단의 <strong className="text-white">스피커 아이콘</strong>을 탭하면 음성 안내 모드가 활성화됩니다.
               화면의 주요 텍스트와 기능을 터치할 때마다 스크린 리더처럼 소리내어 상황을 안내합니다. 버튼들의 의도를 정확히 파악할 수 있도록 돕습니다.
             </p>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-lg">
             <div className="flex items-center gap-3 mb-2 text-blue-400">
               <Eye className="w-5 h-5"/>
               <h4 className="font-black text-sm">VR 좌석 360도 시야 (예매)</h4>
             </div>
             <p className="text-xs text-zinc-400 font-medium leading-relaxed">
               공연 상세 페이지에서 <strong className="text-white">VR 시야 확인</strong> 버튼을 누르면 제공되는 실제 공연장의 360도 VR 연동 기능입니다.
               시선 방향과 단차 체감을 모바일에서 자이로스코프로 생생하게 체험한 뒤, 안전하다고 판단되는 구역의 티켓을 바로 예매할 수 있습니다.
             </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-lg">
             <div className="flex items-center gap-3 mb-2 text-blue-400">
               <MapPin className="w-5 h-5"/>
               <h4 className="font-black text-sm">실시간 AR 보행 내비게이션 (길찾기)</h4>
             </div>
             <p className="text-xs text-zinc-400 font-medium leading-relaxed">
               하단 <strong className="text-white">길안내 탭</strong>에서 이용할 수 있습니다. 사용자의 스마트폰 카메라를 켜고 실제 환경과 겹쳐서 진행 방향을 AR 화살표로 띄워줍니다. 
               전방의 단차나 장애물이 발견될 경우 <strong className="text-red-400">시각적 경고창과 함께 디바이스 진동, 음성 알림</strong>을 발생시켜 휠체어 탑승자나 보행 약자가 우회할 수 있도록 돕습니다.
             </p>
          </div>
        </div>
      </BottomSheet>

      {/* Suggested Profile Modal */}
      <BottomSheet isOpen={profileOpen} onClose={() => setProfileOpen(false)} title="마이 접근성 프로필">
        <div className="flex flex-col gap-4 p-1">
          <p className="text-sm font-medium text-zinc-400 leading-relaxed mb-2" onClick={() => speak("필요한 편의 시설을 미리 저장하면 홈과 예매 화면에서 나에게 맞는 회차만 우선적으로 보여줍니다.")}>
            필요한 편의 시설을 미리 저장하면 홈과 예매 화면에서 나에게 맞는 회차만 우선적으로 보여줍니다.
          </p>
          
          <label className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl border border-zinc-700 cursor-pointer hover:border-cyan-400 transition-colors">
            <span className="font-bold">휠체어 및 스쿠터 접근</span>
            <input type="checkbox" className="w-5 h-5 accent-cyan-400" />
          </label>
          <label className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl border border-zinc-700 cursor-pointer hover:border-cyan-400 transition-colors">
            <span className="font-bold">수어 통역 / 자막</span>
            <input type="checkbox" className="w-5 h-5 accent-cyan-400" />
          </label>
          <label className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl border border-zinc-700 cursor-pointer hover:border-cyan-400 transition-colors">
            <span className="font-bold">음성 해설 단말기</span>
            <input type="checkbox" className="w-5 h-5 accent-cyan-400" />
          </label>
          <label className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl border border-zinc-700 cursor-pointer hover:border-cyan-400 transition-colors">
            <span className="font-bold">눈부심/색맹 배려 화면</span>
            <input type="checkbox" className="w-5 h-5 accent-cyan-400" defaultChecked />
          </label>

          <button onClick={() => { setProfileOpen(false); speak("프로필을 저장했습니다."); }} className="w-full bg-cyan-400 text-black font-black py-4 rounded-xl mt-4 hover:bg-white transition-colors">
            프로필 저장하기
          </button>
        </div>
      </BottomSheet>
      {/* Location Search Modal */}
      <BottomSheet isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} title="위치 변경">
        <div className="flex flex-col gap-4 p-1">
          <p className="text-sm font-medium text-zinc-400 mb-2">
            설정된 위치를 기준으로 휠체어 접근 가능 여부 및 거리를 계산합니다.
          </p>
          <form onSubmit={handleLocationSearch} className="relative">
            <input 
              type="text" 
              placeholder="동, 읍, 면 또는 도로명 주소를 입력하세요" 
              value={locationSearchKeyword}
              onChange={(e) => setLocationSearchKeyword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-4 pr-12 text-white font-medium placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-cyan-400 text-black hover:bg-white transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-4 border-t border-zinc-800 pt-4">
             <button
               onClick={() => {
                 setCurrentLocation('현재 위치 찾는 중...');
                 if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      setTimeout(() => {
                        setCurrentLocation('서울특별시 강남구 테헤란로'); // dummy successful
                        setLocationModalOpen(false);
                      }, 1000);
                    });
                 }
               }}
               className="flex items-center gap-3 w-full p-4 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors border border-zinc-800"
             >
               <div className="w-10 h-10 bg-cyan-400/20 text-cyan-400 rounded-full flex items-center justify-center shrink-0">
                 <MapPin className="w-5 h-5 pointer-events-none" />
               </div>
               <div className="flex flex-col text-left">
                  <span className="font-bold text-white">현재 위치로 설정</span>
                  <span className="text-xs text-zinc-400 mt-0.5">GPS를 사용하여 정확한 위치 찾기</span>
               </div>
             </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

