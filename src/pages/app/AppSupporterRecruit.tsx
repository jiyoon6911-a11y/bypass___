import { ChevronLeft, Info, Target, Star, CheckCircle2, User, Phone, FileText } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function AppSupporterRecruit() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'info' | 'form' | 'success'>('info');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [motivation, setMotivation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-8 font-sans">
      {/* Header */}
      <header className="px-5 pt-8 pb-3 sticky top-0 bg-black/95 backdrop-blur-sm z-40 border-b border-zinc-900 flex items-center gap-3">
        <button 
          onClick={() => {
            if (step === 'form') setStep('info');
            else navigate(-1);
          }}
          className="w-8 h-8 flex items-center justify-center text-white bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-black text-white">403 서포터즈 지원</h1>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-5 py-6 space-y-8"
            >
              {/* Cover Banner */}
              <div className="bg-cyan-400 text-black rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[50px] rounded-full"></div>
                <span className="text-[10px] font-black bg-black text-cyan-400 px-2.5 py-1 rounded-md inline-block mb-3">공식 홍보대사</span>
                <h2 className="text-3xl font-black leading-tight mb-2 tracking-tight">403 서포터즈<br />1기 대모집</h2>
                <p className="text-sm font-bold opacity-80 mt-4 leading-relaxed">
                  배리어 프리를 넘어 유니버설 디자인으로.<br />
                  장벽 없는 공연 문화를 함께 만들 활동가를 찾습니다.
                </p>
              </div>

              {/* Objectives */}
              <section>
                <h3 className="text-base font-black text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" /> 활동 목표 및 목적
                </h3>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0">
                      <span className="text-cyan-400 font-black">1</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">장벽 없는 인프라 체감</h4>
                      <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                        휠체어 접근성, 스마트 자막, 음성 해설 등 공연장에 마련된 다양한 배리어 프리 시설을 먼저 경험하고 리뷰합니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <span className="text-blue-400 font-black">2</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">접근성 데이터 고도화</h4>
                      <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                        공연장까지의 이동 경로, 내부 단차, 시야 정보를 측정하여 403 BYPASS 앱 데이터베이스에 기여합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Benefits */}
              <section>
                <h3 className="text-base font-black text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" /> 서포터즈 활동 혜택
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                    <div className="bg-blue-500/20 text-blue-400 p-3 rounded-full">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white">무료 관람 및<br/>활동비 지원</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                    <div className="bg-blue-500/20 text-blue-400 p-3 rounded-full">
                      <Info className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white">활동 증명서 및<br/>공식 굿즈 제공</span>
                  </div>
                </div>
              </section>

              <button 
                onClick={() => setStep('form')}
                className="w-full bg-white text-black font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98]"
              >
                지원서 작성하기
              </button>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-5 py-6"
            >
              <div className="mb-8">
                <span className="text-xs font-black text-cyan-400 tracking-wider mb-2 block">APPLICATION FORM</span>
                <h2 className="text-2xl font-black text-white">지원서 작성</h2>
                <p className="text-xs text-zinc-400 font-medium mt-2">입력하신 정보는 서포터즈 선발 목적으로만 활용됩니다.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 ml-1">이름</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="본명을 입력해주세요" 
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white font-medium placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 ml-1">연락처</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      required
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-0000-0000" 
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white font-medium placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 ml-1">지원 동기</label>
                  <textarea 
                    required
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="403 서포터즈에 지원하게 된 계기와 앞으로의 다짐을 자유롭게 적어주세요." 
                    className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl py-3.5 px-4 text-sm text-white font-medium placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                  />
                </div>

                <div className="p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl flex gap-3 text-cyan-400 mt-4">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium leading-relaxed opacity-90">
                    장애 여부와 관계없이 누구나 지원하실 수 있습니다. 선발 결과는 남겨주신 연락처로 개별 안내됩니다.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting || !name || !phone || !motivation}
                  className="w-full bg-cyan-400 text-black font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-white transition-all disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 mt-8"
                >
                  {isSubmitting ? '제출하는 중...' : '작성 완료 및 지원하기'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-5 py-20 flex flex-col items-center justify-center text-center h-full"
            >
              <div className="w-20 h-20 bg-cyan-400/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">지원이 완료되었습니다</h2>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-8">
                {name}님의 소중한 지원서가 성공적으로 접수되었습니다.<br/>
                서류 심사 후 연락처를 통해 개별 연락드리겠습니다.
              </p>

              <button 
                onClick={() => navigate('/app')}
                className="w-full bg-zinc-800 text-white font-black py-4 rounded-xl hover:bg-zinc-700 transition-all"
              >
                홈으로 돌아가기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
