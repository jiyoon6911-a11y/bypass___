import { CheckCircle2, ArrowDown } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="flex flex-col">
       {/* Header */}
       <section className="bg-black text-white px-6 py-20 pb-32">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="text-6xl md:text-8xl font-black text-white/10 leading-none mb-4">06</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">프로젝트 워크플로우</h1>
           <p className="text-xl md:text-2xl font-bold max-w-3xl leading-relaxed text-blue-400">
            실현 가능한 무대를 위한 구체적 발걸음
          </p>
          <p className="text-lg font-bold max-w-2xl mt-4 text-white/80">
            우리는 단순한 아이디어에 그치지 않고, 철저한 검증과 구현 과정을 통해 '403 BYPASS'를 완성해 나갈 것입니다.
          </p>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="max-w-5xl mx-auto px-6 -mt-20 relative z-10 w-full mb-32">
        <div className="flex flex-col gap-8">
          
          {/* Phase 1 */}
          <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_#2563eb]">
            <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
              <span className="bg-blue-600 text-white px-4 py-2 text-2xl font-black uppercase">Phase 1</span>
              <h2 className="text-3xl font-black tracking-tight">리서치 고도화 및 서비스 정교화</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
               <div className="flex flex-col gap-3">
                 <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600"/> 심층 리서치 보강</h3>
                 <p className="text-black/80 font-medium">실제 공연장 이용자(장애인 및 비장애인) 대상 인터뷰와 설문을 추가 실시하여 더욱 세밀한 니즈를 파악합니다.</p>
               </div>
               <div className="flex flex-col gap-3">
                 <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600"/> 서비스 정의 및 우선순위</h3>
                 <p className="text-black/80 font-medium">4대 핵심 기능의 세부 스펙을 확정하고, '독립적 관람'을 위한 필수 기능을 정의합니다.</p>
               </div>
               <div className="flex flex-col gap-3">
                 <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600"/> 데이터베이스 설계</h3>
                 <p className="text-black/80 font-medium">파편화된 정보를 통합하기 위해, 국내외 성공 사례를 벤치마킹한 고유의 데이터 구조를 설계합니다.</p>
               </div>
            </div>
          </div>

          <div className="flex justify-center py-4">
            <ArrowDown className="w-12 h-12 text-black/20" />
          </div>

          {/* Phase 2 */}
          <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_#9333ea]">
            <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
              <span className="bg-blue-600 text-white px-4 py-2 text-2xl font-black uppercase">Phase 2</span>
              <h2 className="text-3xl font-black tracking-tight">UX/UI 디자인 및 프로토타입 시각화</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
               <div className="flex flex-col gap-3">
                 <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600"/> 사용자 여정 고도화</h3>
                 <p className="text-black/80 font-medium">예매 단계부터 공연 관람 후 귀가에 이르는 전체 여정을 '유니버설 서비스' 관점에서 재설계합니다.</p>
               </div>
               <div className="flex flex-col gap-3">
                 <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600"/> 디자인 시스템 구축</h3>
                 <p className="text-black/80 font-medium">누구나 읽기 쉽고 조작하기 편한 고대비(High Contrast) UI와 픽셀 아트 기반의 직관적인 디자인 시스템을 완성합니다.</p>
               </div>
            </div>
          </div>

          <div className="flex justify-center py-4">
            <ArrowDown className="w-12 h-12 text-black/20" />
          </div>

          {/* Phase 3 */}
          <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_#16a34a]">
            <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
              <span className="bg-green-600 text-white px-4 py-2 text-2xl font-black uppercase">Phase 3</span>
              <h2 className="text-3xl font-black tracking-tight">애플리케이션 제작 및 기술 구현</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
               <div className="flex flex-col gap-3">
                 <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600"/> 핵심 로직 개발</h3>
                 <p className="text-black/80 font-medium">복잡한 실내 동선 안내와 상황별 맞춤 정보를 제공하는 지능형 알고리즘을 구현합니다.</p>
               </div>
               <div className="flex flex-col gap-3">
                 <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600"/> 앱 프로토타입 완성</h3>
                 <p className="text-black/80 font-medium">기획된 4대 솔루션이 실제로 작동하는 앱 프로토타입을 제작하여 서비스의 실효성을 검증합니다.</p>
               </div>
            </div>
          </div>

           <div className="flex justify-center py-4">
            <ArrowDown className="w-12 h-12 text-black/20" />
          </div>

          {/* Final Step */}
          <div className="bg-black text-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_#dc2626]">
            <div className="flex items-center gap-4 mb-8 border-b-4 border-white pb-4">
              <span className="bg-red-600 text-white px-4 py-2 text-2xl font-black uppercase">Final</span>
              <h2 className="text-3xl font-black tracking-tight">최종 발표 및 웹사이트 런칭</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
               <div className="flex flex-col gap-3 border-l-4 border-red-600 pl-4">
                 <h3 className="text-xl font-bold">소개 웹사이트 정식 오픈</h3>
                 <p className="text-white/80 font-medium">프로젝트의 전 과정과 최종 결과물을 담은 공식 웹사이트를 배포합니다.</p>
               </div>
               <div className="flex flex-col gap-3 border-l-4 border-red-600 pl-4">
                 <h3 className="text-xl font-bold">최종 성과 공유</h3>
                 <p className="text-white/80 font-medium">'배리어 프리를 넘어선 유니버설 서비스'로서의 성과를 정리하고, 향후 공연 문화 생태계에 미칠 기대 효과를 발표합니다.</p>
               </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
