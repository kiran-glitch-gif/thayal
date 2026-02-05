import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Measurements from './pages/Measurements';
import Track from './pages/Track';
import Checkout from './pages/Checkout';
import { useStore } from './store/useStore';
import { useEffect } from 'react';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// SEO Page Title Updater
const PageTitle = () => {
  const location = useLocation();
  useEffect(() => {
    const titles = {
      '/': 'Thayal360 | Custom Stitching at Doorstep',
      '/services': 'Services & Designs | Thayal360',
      '/dashboard': 'My Dashboard | Thayal360',
      '/measurements': 'My Measurements | Thayal360',
      '/contact': 'Contact Us | Thayal360',
      '/checkout': 'Checkout | Thayal360'
    };
    let title = titles[location.pathname] || 'Thayal360';
    if (location.pathname.startsWith('/track')) title = 'Track Order | Thayal360';
    document.title = title;
  }, [location]);
  return null;
};

// Protected Route Component
import { Button, Result } from 'antd';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = useStore((state) => state.user);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Result
          status="403"
          title="Login Required"
          subTitle="Please sign in to access your dashboard and orders."
          extra={
            <Button type="primary" onClick={() => document.querySelector('button[aria-label="login-trigger"]')?.click()}>
              Go to Login
            </Button>
          }
        />
      </div>
    );
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageTitle />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="measurements" element={<Measurements />} />
          <Route path="track/:id" element={<Track />} />
          <Route path="checkout" element={<Checkout />} />
          {/* Dashboard needs special protection handling */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
