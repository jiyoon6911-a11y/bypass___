import { ArrowRight, Accessibility, Eye, Map, Navigation, Shield, BarChart3, Users, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-black text-white px-6 py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-8">
          <div className="inline-block border-4 border-white bg-blue-600 px-4 py-2 font-black text-xl w-max uppercase tracking-widest shadow-[8px_8px_0px_#fff]">
            Universal Service
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tighter uppercase break-keep">
            시혜적 배려에서<br />
            <span className="text-blue-500">보편적 권리</span>로
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-3xl leading-relaxed mt-4 border-l-8 border-blue-600 pl-6 py-2">
            기존의 좁은 접근성 개념을 확장하여, 모두가 차별 없이 예술을 경험하는 새로운 기준을 제시합니다.
          </p>
        </div>
        
        {/* Pixel Pattern Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(45deg, #fff 10%, transparent 10%, transparent 50%, #fff 50%, #fff 60%, transparent 60%, transparent 100%)', backgroundSize: '20px 20px' }} />
      </section>

      {/* 01. Concepts */}
      <section className="py-24 px-6 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-16">
            <span className="text-6xl md:text-8xl font-black text-black/10 leading-none">01</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Paradigm Shift</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="border-[3px] border-black p-8 shadow-[8px_8px_0px_#000] relative bg-white">
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-black border-[3px] border-black flex items-center justify-center text-white font-black text-xl">
                !
              </div>
              <h3 className="text-2xl font-black mb-4">기존 접근성 공연의 한계</h3>
              <p className="font-bold text-lg leading-relaxed text-black/80">
                지금까지의 접근성 공연은 배리어 프리(Barrier-free)라는 명목 하에 장애인이나 노약자 등 특정 계층만을 위한 좁은 의미의 시혜적 배려에 초점이 맞춰져 있었습니다.
              </p>
            </div>
            
            <div className="border-[3px] border-blue-600 p-8 shadow-[8px_8px_0px_#2563eb] relative bg-blue-50">
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-600 border-[3px] border-blue-600 flex items-center justify-center text-white font-black text-xl">
                ★
              </div>
               <h3 className="text-2xl font-black mb-4 text-blue-900">403 BYPASS의 개념 확장</h3>
              <p className="font-bold text-lg leading-relaxed text-blue-900/80">
                본 프로젝트의 공연 접근성을 특별한 서비스가 아닌, 관객이라면 누구나 마땅히 누려야 할 유니버설 서비스(Universal Service)로 정의하며 그 개념을 확장합니다.
              </p>
            </div>
          </div>
          
          <div className="mt-16 bg-black text-white p-8 md:p-12 border-4 border-black text-center shadow-[12px_12px_0px_#2563eb]">
            <h3 className="text-2xl md:text-4xl font-black mb-6 uppercase tracking-widest text-blue-400">Project Goal</h3>
            <p className="text-xl md:text-2xl font-bold leading-relaxed max-w-4xl mx-auto">
              "물리적 장벽과 정보의 비대칭을 근본적으로 허물어, 장애 유무나 개인이 처한 상황과 관계없이 모든 관객이 공연의 감동에 온전히 닿을 수 있는 환경 구축"
            </p>
          </div>
        </div>
      </section>

      {/* 02. Problems */}
      <section className="py-24 px-6 bg-gray-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
           <div className="flex items-center gap-6 mb-16">
            <span className="text-6xl md:text-8xl font-black text-black/10 leading-none">02</span>
            <div className="flex flex-col">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">문제발굴</h2>
              <p className="text-xl font-bold mt-2 text-black/60 border-l-4 border-black pl-4">현재 공연 시장이 마주한 4가지 장벽</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Problem 1 */}
            <div className="bg-white border-4 border-black p-6 md:p-10 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <h3 className="text-3xl font-black bg-red-100 px-3 py-1 inline-block">[시설 문제]</h3>
                <span className="text-5xl font-black text-red-500">1%</span>
              </div>
              <h4 className="text-2xl font-bold">턱없이 부족한 공연장 편의시설</h4>
              <div className="space-y-4 font-medium text-lg text-black/80">
                <p className="font-bold text-black border-l-4 border-red-500 pl-4">물리적 진입 자체가 불가능한 인프라의 현실.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-black">참담한 설치 지표:</strong> 전국 3,102개 공연장 중 휠체어 관객석 보유율 20%</li>
                  <li><strong className="text-black">민간 영역의 소외:</strong> 전 시설 설치된 곳은 공공 12%, 민간 단 1%(30개)</li>
                  <li><strong className="text-black">법적 사각지대:</strong> 소규모 소극장은 의무 설치 대상 제외</li>
                </ul>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="bg-white border-4 border-black p-6 md:p-10 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <h3 className="text-3xl font-black bg-yellow-100 px-3 py-1 inline-block">[정보 문제]</h3>
                <Volume2 className="w-12 h-12 text-yellow-500" />
              </div>
              <h4 className="text-2xl font-bold">파편화된 가이드와 '정보 빈곤층'</h4>
               <div className="space-y-4 font-medium text-lg text-black/80">
                <p className="font-bold text-black border-l-4 border-yellow-500 pl-4">예매부터 관람까지, 단절된 소통.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-black">파편화된 여정:</strong> 예매처와 시설 정보가 극심하게 분산</li>
                  <li><strong className="text-black">온라인 예매의 벽:</strong> 휠체어석 온라인 예매 불가, 정보 비대칭</li>
                  <li><strong className="text-black">예술적 체험 정보 부재:</strong> 실제 시야, 혼잡도 등 공유 채널 전무</li>
                </ul>
                <div className="bg-gray-100 p-4 border-l-4 border-black italic mt-4 font-bold text-black/70">
                  "건물이 어떻게 생겼는지 머릿속으로 그려보고 가고 싶어요. 사전에 어디에 뭐가 있는지만 대충 알고 가도 훨씬 편할 것 같아요."<br/>
                  <span className="text-sm not-italic mt-2 block">- 시각장애인 관객 인터뷰 중</span>
                </div>
              </div>
            </div>

            {/* Problem 3 */}
            <div className="bg-white border-4 border-black p-6 md:p-10 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <h3 className="text-3xl font-black bg-blue-100 px-3 py-1 inline-block">[환경 문제]</h3>
                 <span className="text-5xl font-black text-blue-500">65%</span>
              </div>
              <h4 className="text-2xl font-bold">단절된 '관람 여정 전체'</h4>
               <div className="space-y-4 font-medium text-lg text-black/80">
                <p className="font-bold text-black border-l-4 border-blue-500 pl-4">공연장 문을 여는 것만으로는 충분하지 않습니다.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-black">험난한 오프로드:</strong> 대학로 소극장 120곳 중 65% 접근 불가</li>
                  <li><strong className="text-black">여정의 단절:</strong> 지하철역에서 공연장, 주변 상권까지 관람 여정 단절</li>
                  <li><strong className="text-black">위험 요소:</strong> 미관을 위한 엉성한 설계가 오히려 사고의 위험 초래</li>
                </ul>
              </div>
            </div>

            {/* Problem 4 */}
            <div className="bg-white border-4 border-black p-6 md:p-10 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <h3 className="text-3xl font-black bg-green-100 px-3 py-1 inline-block">[인식 문제]</h3>
                 <Users className="w-12 h-12 text-green-500" />
              </div>
              <h4 className="text-2xl font-bold">시혜적 배려에 갇힌 '배리어 프리'</h4>
               <div className="space-y-4 font-medium text-lg text-black/80">
                <p className="font-bold text-black border-l-4 border-green-500 pl-4">소수만을 위한 배려로 치부하는 좁은 인식.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-black">시혜적 관점의 한계:</strong> 특별한 프로그램이나 배려로 치부</li>
                  <li><strong className="text-black">보편적 설계 부재:</strong> 누구나 편리해야 한다는 유니버설 디자인 인식 낮음</li>
                  <li><strong className="text-black">정보의 디지털 소외:</strong> SNS 이미지 위주의 홍보가 정보 약자 소외 심화</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. Curb Cut Effect */}
      <section className="py-24 px-6 bg-blue-600 text-white border-b-4 border-black">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 shrink-0">
               <div className="flex items-center gap-6 mb-8">
                <span className="text-6xl md:text-8xl font-black text-white/20 leading-none">03</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">커브컷 효과<br/>Curb Cut Effect</h2>
              </div>
              <p className="text-2xl font-bold leading-relaxed mb-6 border-l-8 border-white pl-6 py-2">
                휠체어를 위해 낮춘 보도블록 턱이 유모차, 캐리어 사용자 모두의 편의가 되듯, 우리의 접근성 강화는 곧 <span className="bg-white text-blue-600 px-2">모든 관객의 경험을 상향 평준화</span>합니다.
              </p>
              <p className="text-xl font-medium text-white/90">
                '모든 관객의 경험'을 완벽하게 이어주는 유니버설 서비스 앱 지향
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
              <div className="bg-black border-4 border-white p-8 text-center flex flex-col justify-center gap-4 transform rotate-2 hover:rotate-0 transition-transform">
                <span className="text-5xl md:text-7xl font-black text-blue-400">80%</span>
                <span className="font-bold text-lg md:text-xl">배리어 프리 공연<br/>관람객: 비장애인</span>
              </div>
              <div className="bg-white border-4 border-black p-8 text-center flex flex-col justify-center gap-4 text-black transform -rotate-2 hover:rotate-0 transition-transform">
                <span className="text-5xl md:text-7xl font-black text-blue-600">98%</span>
                <span className="font-bold text-lg md:text-xl">배리어프리<br/>필요성 공감</span>
              </div>
            </div>
         </div>
      </section>

      {/* 04. Core Features */}
      <section className="py-24 px-6 border-b-4 border-black bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiPjwvcmVjdD48cGF0aCBkPSJNMCAwbDh2OEgwem04IDBIMHY4bDgtdi04eiIgZmlsbD0iI2Y1ZjVmNSI+PC9wYXRoPjwvc3ZnPg==')]">
         <div className="max-w-7xl mx-auto">
           <div className="flex items-center gap-6 mb-16">
            <span className="text-6xl md:text-8xl font-black text-black/10 leading-none bg-white px-2">04</span>
             <div className="flex flex-col bg-white px-4 py-2 border-4 border-black shadow-[8px_8px_0px_#2563eb]">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">4대 핵심 기능</h2>
              <p className="text-xl font-bold mt-1 text-black/60">경험 중심 솔루션</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* MOBILITY */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#000] hover:-translate-y-2 transition-transform group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center border-[3px] border-black group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                  <Navigation className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase">Mobility</h3>
                  <p className="font-bold text-gray-500">이동 | 맞춤형 경로 안내</p>
                </div>
              </div>
              <p className="font-bold text-lg leading-relaxed text-black/80">
                단차와 점자블록의 연속성을 고려한 맞춤 경로 및 실내 AR 가이드를 통해 이동의 장벽을 제거합니다.
              </p>
            </div>

            {/* VISIBILITY */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#000] hover:-translate-y-2 transition-transform group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center border-[3px] border-black group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                  <Eye className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase">Visibility</h3>
                  <p className="font-bold text-gray-500">시야 | 사전 정보 제공</p>
                </div>
              </div>
              <p className="font-bold text-lg leading-relaxed text-black/80">
                실제 좌석별 무대 가시성과 단차 사진, 인물 및 세트 사전 안내를 제공하여 예술적 소외를 방지합니다.
              </p>
            </div>

            {/* FLOW */}
             <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#000] hover:-translate-y-2 transition-transform group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center border-[3px] border-black group-hover:bg-green-600 group-hover:border-green-600 transition-colors">
                  <ArrowRight className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase">Flow</h3>
                  <p className="font-bold text-gray-500">흐름 | 실시간 혼잡도 파악</p>
                </div>
              </div>
              <p className="font-bold text-lg leading-relaxed text-black/80">
                화장실, 매표소 등 주요 시설의 대기 현황을 안내하고 웨이팅 서비스로 대체하여 관람의 흐름을 개선합니다.
              </p>
            </div>

            {/* SAFETY */}
             <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#000] hover:-translate-y-2 transition-transform group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center border-[3px] border-black group-hover:bg-red-600 group-hover:border-red-600 transition-colors">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase">Safety</h3>
                  <p className="font-bold text-gray-500">안전 | 현장 연계 안전</p>
                </div>
              </div>
              <p className="font-bold text-lg leading-relaxed text-black/80">
                퇴장 후 대중교통 연계 및 주변 상점 접근성 정보를 통합하여 공연 전후의 모든 여정을 케어합니다.
              </p>
            </div>
          </div>
         </div>
      </section>

      {/* 05. Goals & Value */}
      <section className="py-24 px-6 bg-black text-white border-b-4 border-black text-center">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">프로젝트 지향 가치</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border-2 border-white/20 flex flex-col items-center hover:border-blue-500 transition-colors">
              <div className="text-5xl font-black mb-6 text-blue-500">01</div>
              <h3 className="text-2xl font-black mb-4 uppercase">Independent</h3>
              <p className="text-lg font-bold text-white/70">독립적 관람 환경 구축</p>
            </div>
            <div className="p-6 border-2 border-white/20 flex flex-col items-center hover:border-blue-500 transition-colors">
              <div className="text-5xl font-black mb-6 text-blue-500">02</div>
              <h3 className="text-2xl font-black mb-4 uppercase">Equality</h3>
              <p className="text-lg font-bold text-white/70">정보 불평등 해소</p>
            </div>
             <div className="p-6 border-2 border-white/20 flex flex-col items-center hover:border-green-500 transition-colors">
              <div className="text-5xl font-black mb-6 text-green-500">03</div>
              <h3 className="text-2xl font-black mb-4 uppercase">Ecosystem</h3>
              <p className="text-lg font-bold text-white/70">선순환 생태계 조성</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 flex flex-col items-center justify-center text-center bg-blue-600 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-3xl flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter mix-blend-overlay">
            Step into the<br/>Universal Service
          </h2>
          <Link to="/about" className="inline-flex items-center gap-2 bg-black text-white border-4 border-black font-black text-2xl px-10 py-6 hover:bg-white hover:text-black hover:border-white transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-2 active:translate-y-2 uppercase">
            프로젝트 워크플로우 보기
            <ArrowRight className="w-8 h-8" />
          </Link>
        </div>
         {/* Decorative grid */}
         <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      </section>
    </div>
  );
}
