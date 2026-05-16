import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { auth, db, handleFirestoreError, logout, OperationType } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, deleteDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { Settings, LogOut, UserMinus, UserPlus, Lock, Unlock, Users, ChevronLeft, Search, UserCircle, RefreshCcw, Edit3, Music } from 'lucide-react';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { cn } from '../../lib/utils';

const GENRES = ['뮤지컬', '연극', '클래식', '콘서트', '오페라', '무용', '전통예술', '대중음악'];

export function AppProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const isMyProfile = !userId || userId === user?.uid;
  const targetUserId = isMyProfile ? user?.uid : userId;

  const [targetProfile, setTargetProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [privacySetting, setPrivacySetting] = useState<'public'|'followers'|'private'>(profile?.historyPrivacy || 'public');

  // Search
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  // Edit Profile
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(profile?.displayName || '');
  const [editPhotoURL, setEditPhotoURL] = useState(profile?.photoURL || '');
  const [editGenres, setEditGenres] = useState<string[]>(profile?.preferences?.genres || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!targetUserId) return;
    
    async function loadData() {
      setLoading(true);
      try {
        if (isMyProfile) {
          setTargetProfile(profile);
          setEditDisplayName(profile?.displayName || '');
          setEditPhotoURL(profile?.photoURL || '');
          setEditGenres(profile?.preferences?.genres || []);
          const q = query(collection(db, 'reviews'), where('authorId', '==', user?.uid), orderBy('createdAt', 'desc'));
          const snap = await getDocs(q);
          setReviews(snap.docs.map(d => ({id: d.id, ...d.data()})));
        } else {
          const docSnap = await getDoc(doc(db, 'users', targetUserId!));
          if (docSnap.exists()) {
            setTargetProfile(docSnap.data());
          }
          const followId = `${user?.uid}_${targetUserId}`;
          const followSnap = await getDoc(doc(db, 'follows', followId));
          setIsFollowing(followSnap.exists());
          try {
            const reqQuery = query(collection(db, 'reviews'), where('authorId', '==', targetUserId));
            const revSnap = await getDocs(reqQuery);
            setReviews(revSnap.docs.map(d => ({id: d.id, ...d.data()})));
         } catch (err: any) {
             setReviews([]); 
             // Intentionally swallowing for missing permissions on private reviews
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, targetUserId ? `users/${targetUserId}` : `users/${user?.uid}`);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [targetUserId, isMyProfile, profile, user]);

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKeyword.trim()) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const q = query(collection(db, 'users'), where('username', '==', searchKeyword.trim()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setSearchResult({ id: snap.docs[0].id, ...snap.docs[0].data() });
      } else {
        setSearchResult('not_found');
      }
    } catch (err) {
      setSearchResult('not_found');
      handleFirestoreError(err, OperationType.GET, 'users');
    } finally {
      setSearching(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!targetUserId || !user) return;
    const followId = `${user.uid}_${targetUserId}`;
    try {
      if (isFollowing) {
        await deleteDoc(doc(db, 'follows', followId));
        setIsFollowing(false);
      } else {
        await setDoc(doc(db, 'follows', followId), {
          followerId: user.uid,
          followingId: targetUserId,
          createdAt: new Date()
        });
        setIsFollowing(true);
      }
    } catch (error) {
      handleFirestoreError(error, isFollowing ? OperationType.DELETE : OperationType.CREATE, `follows/${followId}`);
    }
  };

  const handlePrivacyChange = async (newPrivacy: 'public'|'followers'|'private') => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { historyPrivacy: newPrivacy, updatedAt: serverTimestamp() });
      setPrivacySetting(newPrivacy);
    } catch (err) {
      console.error('Failed to update privacy', err);
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !editDisplayName.trim()) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: editDisplayName.trim(),
        photoURL: editPhotoURL,
        'preferences.genres': editGenres,
        updatedAt: serverTimestamp()
      });
      setEditProfileOpen(false);
    } catch (err) {
      alert('프로필 수정 중 오류가 발생했습니다.');
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("정말로 계정을 삭제하시겠습니까? 돌이킬 수 없습니다.")) {
       try {
         await user?.delete();
       } catch (err) {
         alert("계정 삭제에 실패했습니다. 재로그인 후 다시 시도해주세요.");
       }
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-black text-cyan-400 flex items-center justify-center font-bold">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24 font-sans">
      <header className="px-5 pt-8 pb-4 sticky top-0 bg-black/95 backdrop-blur-sm z-40 border-b border-zinc-900 flex justify-between items-center">
        {!isMyProfile ? (
          <button onClick={() => navigate(-1)} className="p-2 border border-zinc-800 rounded-full hover:bg-zinc-900 transition-colors">
            <ChevronLeft className="w-5 h-5 text-zinc-300" />
          </button>
        ) : (
          <h1 className="text-xl font-black text-white">마이 페이지</h1>
        )}
        
        {isMyProfile && (
           <button onClick={() => setSettingsOpen(true)} className="p-2 border border-zinc-800 rounded-full hover:bg-zinc-900 transition-colors">
             <Settings className="w-5 h-5 text-zinc-300" />
           </button>
        )}
      </header>

      <main className="px-5 py-6">
        {isMyProfile && (
          <div className="mb-8 relative z-30">
            <form onSubmit={handleSearchUser} className="relative">
              <input
                type="text"
                placeholder="친구 아이디 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <button type="submit" className="hidden" />
            </form>
            
            {searchResult && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-2 shadow-2xl">
                {searchResult === 'not_found' ? (
                  <div className="p-4 text-center text-zinc-400 text-sm font-bold">
                    해당 아이디를 가진 사용자를 찾을 수 없습니다.
                  </div>
                ) : (
                  <button 
                    onClick={() => { setSearchKeyword(''); setSearchResult(null); navigate(`/app/profile/${searchResult.id}`); }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                      {searchResult.photoURL ? (
                        <img src={searchResult.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-6 h-6 text-zinc-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white leading-none mb-1">{searchResult.displayName}</h4>
                      <p className="text-xs text-cyan-400 font-bold leading-none">@{searchResult.username}</p>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-black font-black text-2xl overflow-hidden shrink-0 border border-zinc-700">
            {targetProfile?.photoURL ? (
              <img src={targetProfile.photoURL} alt="profile" className="w-full h-full object-cover" />
            ) : (
              targetProfile?.displayName?.substring(0, 1) || 'U'
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-white">{targetProfile?.displayName || 'Unknown User'}</h2>
            <p className="text-xs text-cyan-400 font-bold mt-1 mb-2">@{targetProfile?.username || 'user'}</p>
            {isMyProfile && (
              <button 
                onClick={() => setEditProfileOpen(true)}
                className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded flex items-center gap-1.5 hover:bg-zinc-700 transition"
              >
                <Edit3 className="w-3 h-3"/> 프로필 수정
              </button>
            )}
          </div>
        </div>

        {!isMyProfile && (
          <button 
            onClick={handleFollowToggle}
            className={`w-full py-3.5 rounded-xl font-black flex justify-center items-center gap-2 transition-all mb-8 ${
              isFollowing 
                ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                : 'bg-cyan-400 text-black hover:bg-white shadow-[0_0_15px_rgba(0,255,204,0.3)]'
            }`}
          >
            {isFollowing ? <><UserMinus className="w-4 h-4"/>언팔로우</> : <><UserPlus className="w-4 h-4"/>팔로우하기</>}
          </button>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-black text-white">관람 히스토리 및 리뷰</h3>
             {isMyProfile && (
               <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 border border-zinc-800 px-2 py-1 rounded">
                 {privacySetting === 'public' ? '전체 공개' : privacySetting === 'followers' ? '팔로워 공개' : '비공개'}
               </span>
             )}
          </div>
          
          {reviews.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
              <p className="text-sm font-medium text-zinc-400">
                {isMyProfile ? '아직 작성한 리뷰가 없습니다.' : '이 사용자의 히스토리를 볼 수 없거나 삭제되었습니다.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-sm font-black text-white">{review.showName}</h4>
                    <span className="bg-blue-900/40 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30">
                      ★ {review.rating}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium mb-3">"{review.content}"</p>
                  <p className="text-[10px] text-zinc-600 font-bold">작성일: {new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomSheet isOpen={editProfileOpen} onClose={() => setEditProfileOpen(false)} title="프로필 수정">
        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-zinc-700">
              {editPhotoURL ? (
                <img src={editPhotoURL} alt="Profile" className="w-full h-full object-cover" />
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
                        setEditPhotoURL(reader.result as string);
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
                  setEditPhotoURL(`https://api.dicebear.com/7.x/notionists/svg?seed=${randomId}`);
                }}
                className="flex items-center gap-2 text-xs font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-full"
              >
                <RefreshCcw className="w-3 h-3" /> 랜덤
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-bold text-zinc-400">닉네임</label>
              <button 
                onClick={() => {
                  const adjs = ['행복한', '즐거운', '멋진', '빛나는', '신나는', '우아한', '아름다운'];
                  const nouns = ['관객', '팬', '매니아', '별', '요정', '매니아'];
                  setEditDisplayName(`${adjs[Math.floor(Math.random() * adjs.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 100)}`);
                }}
                className="text-[10px] font-bold text-cyan-400 flex items-center gap-1"
              >
                <RefreshCcw className="w-3 h-3" /> 랜덤
              </button>
            </div>
            <input
              type="text"
              value={editDisplayName}
              onChange={(e) => setEditDisplayName(e.target.value)}
              placeholder="홍길동"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors font-medium"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-400 ml-1">관심 장르</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {GENRES.map(genre => {
                const isSelected = editGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => {
                      if (isSelected) {
                        setEditGenres(prev => prev.filter(g => g !== genre));
                      } else {
                        setEditGenres(prev => [...prev, genre]);
                      }
                    }}
                    className={cn(
                      "px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-center transition-all border",
                      isSelected 
                        ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/30" 
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={isSaving || !editDisplayName.trim()}
            className="w-full bg-cyan-400 text-black font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-white transition-all disabled:opacity-50 mt-4"
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} title="환경설정">
        <div className="flex flex-col gap-6 py-2">
           <section>
             <h4 className="text-xs font-black text-zinc-500 mb-3 ml-1 tracking-widest">공개 설정</h4>
             <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                <button 
                  onClick={() => handlePrivacyChange('public')}
                  className={`w-full flex items-center justify-between p-4 text-sm font-bold border-b border-zinc-800 transition-colors ${privacySetting === 'public' ? 'bg-cyan-400/10 text-cyan-400' : 'text-zinc-300 hover:bg-zinc-800'}`}
                >
                  <div className="flex items-center gap-3"><Unlock className="w-4 h-4"/> 전체 공개</div>
                  {privacySetting === 'public' && <div className="w-2 h-2 rounded-full bg-cyan-400"></div>}
                </button>
                <button 
                  onClick={() => handlePrivacyChange('followers')}
                  className={`w-full flex items-center justify-between p-4 text-sm font-bold border-b border-zinc-800 transition-colors ${privacySetting === 'followers' ? 'bg-cyan-400/10 text-cyan-400' : 'text-zinc-300 hover:bg-zinc-800'}`}
                >
                  <div className="flex items-center gap-3"><Users className="w-4 h-4"/> 팔로워에게만 공개</div>
                  {privacySetting === 'followers' && <div className="w-2 h-2 rounded-full bg-cyan-400"></div>}
                </button>
                <button 
                  onClick={() => handlePrivacyChange('private')}
                  className={`w-full flex items-center justify-between p-4 text-sm font-bold transition-colors ${privacySetting === 'private' ? 'bg-cyan-400/10 text-cyan-400' : 'text-zinc-300 hover:bg-zinc-800'}`}
                >
                  <div className="flex items-center gap-3"><Lock className="w-4 h-4"/> 나만 보기</div>
                  {privacySetting === 'private' && <div className="w-2 h-2 rounded-full bg-cyan-400"></div>}
                </button>
             </div>
           </section>

           <section>
             <h4 className="text-xs font-black text-zinc-500 mb-3 ml-1 tracking-widest">계정 관리</h4>
             <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                <button 
                  onClick={() => { setSettingsOpen(false); logout(); navigate('/'); }}
                  className="w-full flex items-center p-4 text-sm font-bold text-white border-b border-zinc-800 hover:bg-zinc-800 transition-colors gap-3"
                >
                  <LogOut className="w-4 h-4 text-red-400" /> 로그아웃
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center p-4 text-sm font-bold text-red-500 hover:bg-zinc-800 transition-colors gap-3"
                >
                  탈퇴하기
                </button>
             </div>
           </section>
        </div>
      </BottomSheet>
    </div>
  );
}
