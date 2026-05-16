import { LogIn, X } from 'lucide-react';
import { loginWithGoogle } from '../../lib/firebase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AppLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-6 font-sans relative">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 right-6 p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"
      >
        <X className="w-5 h-5 text-zinc-400" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-12 relative">
          <div className="w-32 h-32 bg-cyan-400/20 rounded-full blur-[40px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <h1 className="text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500 relative z-10 text-center leading-tight">
            403<br/>BY<br/>PASS
          </h1>
        </div>
        
        <p className="text-sm font-bold text-zinc-400 mb-10 text-center leading-relaxed max-w-xs">
          배리어 프리를 넘어선<br/>유니버설 서비스 공연 안내 플랫폼
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-900/40 border border-red-500/50 text-red-300 rounded-xl text-xs font-medium w-full text-center">
            {error}
          </div>
        )}

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-black font-black py-4 rounded-xl flex justify-center items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          {loading ? '로그인 중...' : 'Google 계정으로 시작하기'}
        </button>
      </div>

      <div className="py-8 text-center text-[10px] text-zinc-600 font-medium">
        로그인 시 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
      </div>
    </div>
  );
}
