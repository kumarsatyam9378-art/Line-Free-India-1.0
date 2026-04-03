import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense, useEffect, useState } from 'react';
import CinematicIntro, { shouldShowIntro } from './components/intro/CinematicIntro';
import AppSeo from './components/seo/AppSeo';

const SplashPage = lazy(() => import('./pages/onboarding/SplashPage'));
const LanguageSelect = lazy(() => import('./pages/LanguageSelect'));
const RoleSelect = lazy(() => import('./pages/RoleSelect'));
const CustomerAuth = lazy(() => import('./pages/CustomerAuth'));
const BarberAuth = lazy(() => import('./pages/BarberAuth'));
const BusinessTypeSelectPage = lazy(() => import('./pages/BusinessTypeSelectPage'));
const CustomerProfileSetup = lazy(() => import('./pages/CustomerProfileSetup'));
const BarberProfileSetup = lazy(() => import('./pages/BarberProfileSetup'));
const CustomerHome = lazy(() => import('./pages/CustomerHome'));
const CustomerSearch = lazy(() => import('./pages/CustomerSearch'));
const SalonDetail = lazy(() => import('./pages/SalonDetail'));
const CustomerTokens = lazy(() => import('./pages/CustomerTokens'));
const CustomerProfileEdit = lazy(() => import('./pages/CustomerProfileEdit'));
const CustomerSubscription = lazy(() => import('./pages/CustomerSubscription'));
const CustomerHairstyles = lazy(() => import('./pages/CustomerHairstyles'));
const CustomerHistory = lazy(() => import('./pages/CustomerHistory'));
const BarberHome = lazy(() => import('./pages/BarberHome'));
const BarberCustomers = lazy(() => import('./pages/BarberCustomers'));
const BarberProfile = lazy(() => import('./pages/BarberProfile'));
const BarberSubscription = lazy(() => import('./pages/BarberSubscription'));
const BarberAnalytics = lazy(() => import('./pages/BarberAnalytics'));
const CustomerChat = lazy(() => import('./pages/CustomerChat'));
const BarberMessages = lazy(() => import('./pages/BarberMessages'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const OwnerGallery = lazy(() => import('./pages/OwnerGallery'));
const OwnerStaff = lazy(() => import('./pages/OwnerStaff'));
const OwnerSettings = lazy(() => import('./pages/OwnerSettings'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function AuthGuard({ children, requiredRole }: { children: React.ReactNode; requiredRole: 'customer' | 'barber' }) {
  const { user, role, loading } = useApp();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-text-dim">Loading...</div>;
  if (!user) return <Navigate to={requiredRole === 'customer' ? '/customer/auth' : '/barber/auth'} replace />;
  if (role !== requiredRole) return <Navigate to="/role" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { loading } = useApp();
  const [showIntro, setShowIntro] = useState(() => shouldShowIntro());

  useEffect(() => {
    if (!showIntro) return;
    const forceClose = setTimeout(() => setShowIntro(false), 5200);
    return () => clearTimeout(forceClose);
  }, [showIntro]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-text-dim">Loading...</div>;

  return (
    <>
      {showIntro && <CinematicIntro onDone={() => setShowIntro(false)} />}
      <AppSeo />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-text-dim">Loading page...</div>}>
        <Routes>
          <Route path="/" element={
            localStorage.getItem('onboarding_done') === 'true'
              ? <Navigate to="/language" replace />
              : <Navigate to="/splash" replace />
          } />
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/language" element={<LanguageSelect />} />
          <Route path="/role" element={<RoleSelect />} />
          <Route path="/customer/auth" element={<CustomerAuth />} />
          <Route path="/barber/auth" element={<BarberAuth />} />
          <Route path="/business/select" element={<BusinessTypeSelectPage />} />
          <Route path="/business/auth" element={<BarberAuth />} />
          <Route path="/customer/setup" element={<CustomerProfileSetup />} />
          <Route path="/barber/setup" element={<BarberProfileSetup />} />

          <Route path="/customer/home" element={<AuthGuard requiredRole="customer"><CustomerHome /></AuthGuard>} />
          <Route path="/customer/search" element={<AuthGuard requiredRole="customer"><CustomerSearch /></AuthGuard>} />
          <Route path="/customer/salon/:id" element={<AuthGuard requiredRole="customer"><SalonDetail /></AuthGuard>} />
          <Route path="/customer/tokens" element={<AuthGuard requiredRole="customer"><CustomerTokens /></AuthGuard>} />
          <Route path="/customer/profile" element={<AuthGuard requiredRole="customer"><CustomerProfileEdit /></AuthGuard>} />
          <Route path="/customer/subscription" element={<AuthGuard requiredRole="customer"><CustomerSubscription /></AuthGuard>} />
          <Route path="/customer/hairstyles" element={<AuthGuard requiredRole="customer"><CustomerHairstyles /></AuthGuard>} />
          <Route path="/customer/history" element={<AuthGuard requiredRole="customer"><CustomerHistory /></AuthGuard>} />
          <Route path="/customer/chat/:salonId" element={<AuthGuard requiredRole="customer"><CustomerChat /></AuthGuard>} />
          <Route path="/customer/notifications" element={<AuthGuard requiredRole="customer"><NotificationsPage /></AuthGuard>} />

          <Route path="/barber/home" element={<AuthGuard requiredRole="barber"><BarberHome /></AuthGuard>} />
          <Route path="/barber/customers" element={<AuthGuard requiredRole="barber"><BarberCustomers /></AuthGuard>} />
          <Route path="/barber/profile" element={<AuthGuard requiredRole="barber"><BarberProfile /></AuthGuard>} />
          <Route path="/barber/subscription" element={<AuthGuard requiredRole="barber"><BarberSubscription /></AuthGuard>} />
          <Route path="/barber/analytics" element={<AuthGuard requiredRole="barber"><BarberAnalytics /></AuthGuard>} />
          <Route path="/barber/messages" element={<AuthGuard requiredRole="barber"><BarberMessages /></AuthGuard>} />
          <Route path="/barber/notifications" element={<AuthGuard requiredRole="barber"><NotificationsPage /></AuthGuard>} />
          <Route path="/barber/gallery" element={<AuthGuard requiredRole="barber"><OwnerGallery /></AuthGuard>} />
          <Route path="/barber/staff" element={<AuthGuard requiredRole="barber"><OwnerStaff /></AuthGuard>} />
          <Route path="/barber/settings" element={<AuthGuard requiredRole="barber"><OwnerSettings /></AuthGuard>} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Toaster position="top-center" />
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
