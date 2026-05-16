import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-12 md:py-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b-2 border-white/20 pb-12">
          
          <div className="flex flex-col gap-4 max-w-sm">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-black tracking-tighter bg-white text-black px-2 py-1 leading-none">403</span>
              <span className="text-3xl font-black tracking-tighter text-white leading-none pt-1">BYPASS</span>
            </Link>
            <p className="font-bold text-lg text-white/90">디지털 인문예술입문 프로젝트</p>
            <p className="text-white/60 font-medium leading-relaxed">
              특정 관객을 향한 배려를 넘어, 모든 관객이 장벽 없이 공연을 누릴 수 있도록 보장하는 유니버설 서비스 지향 플랫폼.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-8 md:gap-16 font-medium">
             <div className="flex flex-col gap-4">
               <h3 className="font-black text-xl mb-2 text-white/50">SERVICE</h3>
               <Link to="/" className="hover:text-blue-400 transition-colors">홈</Link>
               <Link to="/app/tickets" className="hover:text-blue-400 transition-colors">티켓</Link>
               <Link to="/info" className="hover:text-blue-400 transition-colors">관람정보</Link>
             </div>
             <div className="flex flex-col gap-4">
               <h3 className="font-black text-xl mb-2 text-white/50">SUPPORT</h3>
               <Link to="/support" className="hover:text-blue-400 transition-colors">고객센터</Link>
               <Link to="/about" className="hover:text-blue-400 transition-colors">프로젝트 소개</Link>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium text-white/60">
          <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start w-full md:w-auto">
            <Link to="/about" className="hover:text-white transition-colors">회사소개</Link>
            <Link to="/terms" className="hover:text-white transition-colors">이용약관</Link>
            <Link to="/privacy" className="hover:text-white transition-colors font-bold text-white">개인정보처리방침</Link>
            <Link to="/support" className="hover:text-white transition-colors">고객센터</Link>
          </div>
          
          <div className="text-center md:text-right flex flex-col gap-2">
            <p className="px-3 py-1 bg-white/10 text-white font-bold inline-block border border-white/20">
              본 사이트는 실제 상용 사이트가 아닌 프로젝트 아이디어 시연용 프로토타입입니다.
            </p>
            <p className="mt-2">© 403 BYPASS. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
