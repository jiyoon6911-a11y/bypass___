import { Link } from 'react-router-dom';
import { Search, Menu, User, Settings, HelpCircle, Ticket, Info, MessageSquare, Map } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: '홈', path: '/' },
    { name: '티켓', path: '/tickets' },
    { name: '관람정보 (아이디어)', path: '/info' },
    { name: '관람후기 (중간)', path: '/reviews' },
    { name: '예매안내 (최종)', path: '/guide' },
    { name: '프로젝트 소개', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-[3px] border-black bg-white">
      {/* Top utility bar */}
      <div className="hidden md:flex justify-end items-center gap-4 px-6 py-2 border-b border-black/10 text-sm font-medium">
        <Link to="/login" className="hover:underline">로그인</Link>
        <Link to="/signup" className="hover:underline">회원가입</Link>
        <Link to="/mypage" className="hover:underline flex items-center gap-1"><User className="w-4 h-4"/> 마이페이지</Link>
        <Link to="/support" className="hover:underline flex items-center gap-1"><HelpCircle className="w-4 h-4"/> 고객센터</Link>
      </div>

      {/* Main navigation */}
      <div className="flex h-16 md:h-20 items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-black tracking-tighter bg-black text-white px-2 py-1 leading-none">403</span>
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-black leading-none pt-1">BYPASS</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 font-bold text-lg">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="hover:text-blue-600 transition-colors uppercase tracking-tight">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative group">
            <input 
              type="text" 
              placeholder="검색어를 입력해주세요" 
              className="border-2 border-black px-4 py-2 text-sm font-bold placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all w-64"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
          </div>
          
          <button 
            className="lg:hidden p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b-[3px] border-black flex flex-col p-4 shadow-xl">
           <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="검색어를 입력해주세요" 
              className="w-full border-2 border-black px-4 py-3 text-base font-bold placeholder:text-black/50 focus:outline-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
          </div>
          <nav className="flex flex-col gap-4 font-bold text-xl">
             {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="py-2 border-b border-black/10 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t font-medium">
             <Link to="/login" className="hover:underline">로그인</Link>
            <Link to="/signup" className="hover:underline">회원가입</Link>
            <Link to="/mypage" className="hover:underline">마이페이지</Link>
            <Link to="/support" className="hover:underline">고객센터</Link>
          </div>
        </div>
      )}
    </header>
  );
}
