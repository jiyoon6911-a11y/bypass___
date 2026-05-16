import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Map, HeartHandshake, Ticket, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MobileLayout() {
  const location = useLocation();

  const tabs = [
    { name: '홈', path: '/app', icon: Home },
    { name: '안내/맵', path: '/app/map', icon: Map },
    { name: '매칭/대여', path: '/app/services', icon: HeartHandshake },
    { name: '티켓/시야', path: '/app/tickets', icon: Ticket },
    { name: '마이', path: '/app/profile', icon: User },
  ];

  return (
    <div className="min-h-[100dvh] bg-zinc-900 flex justify-center w-full font-sans">
      {/* Mobile App Container */}
      <div className="w-full max-w-md bg-black h-[100dvh] relative shadow-2xl flex flex-col overflow-hidden sm:border-x sm:border-zinc-800">
        
        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-black/90 backdrop-blur-md border-t border-zinc-800 flex justify-around items-center h-16 pb-safe z-50">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path || (tab.path !== '/app' && location.pathname.startsWith(tab.path));
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                to={tab.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]")} />
                <span className="text-[10px] font-bold">{tab.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
