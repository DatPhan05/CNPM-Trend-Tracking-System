import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/utils/cn';

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const isLoggedIn = !!localStorage.getItem('access_token');

  // Close mobile sidebar on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // Cuộn lên đầu trang khi chuyển route và lắng nghe sự kiện auth:unauthorized
  useEffect(() => {
    window.scrollTo(0, 0);

    const handleUnauthorized = () => {
      navigate('/login');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary-foreground">
      {/* Khởi tạo Toaster cho thông báo global */}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      
      {/* Background decoration */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(0,0,0,0))]" />
      
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      
      {isLoggedIn && (
        <>
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={false} />
          <Sidebar isOpen={mobileSidebarOpen} setIsOpen={setMobileSidebarOpen} isMobile={true} />
        </>
      )}
      
      <main className={cn(
        "flex-1 w-full pt-20 transition-all duration-300 ease-in-out",
        isLoggedIn && sidebarOpen ? "md:pl-64" : isLoggedIn ? "md:pl-20" : ""
      )}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}
