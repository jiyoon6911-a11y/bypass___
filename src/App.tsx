import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { MobileLayout } from './components/layout/MobileLayout';
import { AppHome } from './pages/app/AppHome';
import { AppMap } from './pages/app/AppMap';
import { AppServices } from './pages/app/AppServices';
import { AppTickets } from './pages/app/AppTickets';
import { AppShowDetail } from './pages/app/AppShowDetail';
import { AppSupporterRecruit } from './pages/app/AppSupporterRecruit';
import { AppLogin } from './pages/app/AppLogin';
import { AppProfile } from './pages/app/AppProfile';
import { AppOnboarding } from './pages/app/AppOnboarding';
import { useAuth } from './lib/auth-context';
import { DeviceOS } from './pages/os/DeviceOS';

export default function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-black flex justify-center items-center text-cyan-400 font-bold">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DeviceOS />} />
        
        <Route path="/app" element={
          !user ? <AppLogin /> : 
          (profile && !profile.onboardingCompleted) ? <AppOnboarding /> : 
          <MobileLayout />
        }>
          <Route index element={<AppHome />} />
          <Route path="map" element={<AppMap />} />
          <Route path="services" element={<AppServices />} />
          <Route path="tickets" element={<AppTickets />} />
          <Route path="show/:showId" element={<AppShowDetail />} />
          <Route path="supporters" element={<AppSupporterRecruit />} />
          <Route path="profile" element={<AppProfile />} />
          <Route path="profile/:userId" element={<AppProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

