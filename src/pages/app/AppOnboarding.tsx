import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Music, Accessibility, HeartHandshake, UserCircle, RefreshCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

const GENRES = ['뮤지컬', '연극', '클래식', '콘서트', '오페라', '무용', '전통예술', '대중음악'];
const ACCESSIBILITY = ['휠체어 접근성', '자막 제공', '수어 통역', '음성 해설', '시각장애인 유도블록', '점자 안내'];
const SERVICES = ['동행인 매칭', '보조기기 대여', '이동 지원', '예매 대행'];

export function AppOnboarding() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const [genres, setGenres] = useState<string[]>([]);
  const [accessibilities, setAccessibilities] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);

  const handleToggle = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!username || !displayName) {
        setUsernameError('아이디와 닉네임을 모두 입력해주세요.');
        return;
      }
      setCheckingUsername(true);
      try {
        const q = query(collection(db, 'users'), where('username', '==', username));
        const snap = await getDocs(q);
        if (!snap.empty && snap.docs[0].id !== user?.uid) {
          setUsernameError('이미 사용 중인 아이디입니다.');
          setCheckingUsername(false);
          return;
        }
        setUsernameError('');
        setStep(2);
      } catch (err) {
        console.error(err);
        setUsernameError('아이디 중복 확인 중 오류가 발생했습니다.');
      } finally {
        setCheckingUsername(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        username,
        displayName,
        photoURL,
        onboardingCompleted: true,
        preferences: {
          genres,
          accessibility: accessibilities,
          services
        },
        updatedAt: serverTimestamp()
      });
      // Context will update automatically
    } catch (e) {
      console.error(e);
      alert('설정 저장 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !username || !displayName || checkingUsername;
    if (step === 2 && genres.length === 0) return true;
    if (step === 3 && accessibilities.length === 0) return true;
    return false;
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-6 py-12 font-sans relative">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : null}
          className={cn("p-2 -ml-2 rounded-full transition-colors", step > 1 ? "hover:bg-zinc-900 text-white" : "invisible")}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={cn("w-2 h-2 rounded-full transition-all", step === s ? "bg-cyan-400 w-4" : "bg-zinc-800")} />
          ))}
        </div>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mb-6 shrink-0">
                <UserCircle className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500">
                프로필 설정
              </h1>
              <p className="text-sm font-bold text-zinc-400 mb-8 leading-relaxed">
                403 BYPASS에서 사용할 프로필을 설정해주세요.<br/>아이디는 절대 겹칠 수 없습니다.
              </p>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-zinc-700">
                    {photoURL ? (
                      <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-12 h-12 text-zinc-500" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPhotoURL(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="flex items-center gap-2 text-xs font-bold text-white bg-zinc-800 px-3 py-1.5 rounded-full hover:bg-zinc-700 transition-colors"
                    >
                      갤러리에서 선택
                    </button>
                    <button 
                      onClick={() => {
                        const randomId = Math.random().toString(36).substring(7);
                        setPhotoURL(`https://api.dicebear.com/7.x/notionists/svg?seed=${randomId}`);
                      }}
                      className="flex items-center gap-2 text-xs font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-full"
                    >
                      <RefreshCcw className="w-3 h-3" /> 랜덤
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-zinc-400">아이디 (영문, 숫자만)</label>
                    <button 
                      onClick={() => setUsername(`user_${Math.random().toString(36).substring(2, 8)}`)}
                      className="text-[10px] font-bold text-cyan-400 flex items-center gap-1"
                    >
                      <RefreshCcw className="w-3 h-3" /> 랜덤
                    </button>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                    placeholder="unique_id"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors font-medium"
                  />
                  {usernameError && <p className="text-xs font-bold text-red-500 ml-1">{usernameError}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-zinc-400">닉네임</label>
                    <button 
                      onClick={() => {
                        const adjs = ['행복한', '즐거운', '멋진', '빛나는', '신나는', '우아한', '아름다운'];
                        const nouns = ['관객', '팬', '매니아', '별', '요정', '매니아'];
                        setDisplayName(`${adjs[Math.floor(Math.random() * adjs.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 100)}`);
                      }}
                      className="text-[10px] font-bold text-cyan-400 flex items-center gap-1"
                    >
                      <RefreshCcw className="w-3 h-3" /> 랜덤
                    </button>
                  </div>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors font-medium"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mb-6">
                <Music className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500">
                선호하는 공연 장르
              </h1>
              <p className="text-sm font-bold text-zinc-400 mb-8 leading-relaxed">
                관심 있는 장르를 선택해주세요.<br/>취향에 맞는 공연을 추천해드립니다. (중복 선택 가능)
              </p>

              <div className="flex flex-wrap gap-3">
                {GENRES.map(genre => {
                  const isSelected = genres.includes(genre);
                  return (
                    <button
                      key={genre}
                      onClick={() => handleToggle(genre, genres, setGenres)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-bold border transition-all flex items-center gap-2",
                        isSelected 
                          ? "bg-cyan-400/10 border-cyan-400 text-cyan-400" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      {genre}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <Accessibility className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500">
                필요한 접근성 서비스
              </h1>
              <p className="text-sm font-bold text-zinc-400 mb-8 leading-relaxed">
                앱에서 우선적으로 확인할 접근성 정보를<br/>선택해주세요. 홈 화면 필터에 자동 적용됩니다.
              </p>

              <div className="flex flex-col gap-3">
                {ACCESSIBILITY.map(item => {
                  const isSelected = accessibilities.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => handleToggle(item, accessibilities, setAccessibilities)}
                      className={cn(
                        "w-full px-5 py-4 rounded-xl text-left font-bold border transition-all flex items-center justify-between",
                        isSelected 
                          ? "bg-blue-500/10 border-blue-500 text-blue-400" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      )}
                    >
                      {item}
                      {isSelected && <Check className="w-5 h-5" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                <HeartHandshake className="w-6 h-6 text-purple-400" />
              </div>
              <h1 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500">
                추가 지원 서비스
              </h1>
              <p className="text-sm font-bold text-zinc-400 mb-8 leading-relaxed">
                공연 관람을 위해 추가로 필요한<br/>매칭/대여 서비스가 있다면 알려주세요.
              </p>

              <div className="flex flex-col gap-3">
                {SERVICES.map(item => {
                  const isSelected = services.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => handleToggle(item, services, setServices)}
                      className={cn(
                        "w-full px-5 py-4 rounded-xl text-left font-bold border transition-all flex items-center justify-between",
                        isSelected 
                          ? "bg-purple-500/10 border-purple-500 text-purple-400" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      )}
                    >
                      {item}
                      {isSelected && <Check className="w-5 h-5" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-900 bg-black">
        <button
          onClick={step < 4 ? handleNextStep : handleComplete}
          disabled={isNextDisabled() || isSubmitting}
          className="w-full bg-cyan-400 text-black font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-white transition-all disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 active:scale-[0.98]"
        >
          {checkingUsername ? '중복 확인 중...' : isSubmitting ? '저장 중...' : step < 4 ? '다음으로' : '설정 완료하고 시작하기'}
          {step < 4 && !checkingUsername && !isSubmitting && <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
