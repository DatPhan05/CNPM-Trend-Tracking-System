import { NavLink } from 'react-router-dom';
import { 
  Search, 
  TrendingUp, 
  Bookmark, 
  ShieldAlert, 
  Menu, 
  X, 
  Home,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

export default function Sidebar({ isOpen, setIsOpen, isMobile }: SidebarProps) {
  const userRole = localStorage.getItem('user_role');
  const isLoggedIn = !!localStorage.getItem('access_token');

  const links = [
    { name: 'Trang chủ', path: '/', icon: Home },
    { name: 'Khám phá', path: '/search', icon: Search },
    { name: 'Xu hướng', path: '/trends', icon: TrendingUp },
    ...(isLoggedIn ? [{ name: 'Thư viện', path: '/dashboard', icon: Bookmark }] : []),
    ...(userRole === 'admin' ? [{ name: 'Quản trị', path: '/admin', icon: ShieldAlert }] : []),
  ];

  if (isMobile) {
    return (
      <>
        {/* Backdrop for mobile */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 bottom-0 z-50 w-72 bg-card border-r border-border p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="font-display font-bold text-foreground">Trend Scholar</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <link.icon className="h-5 w-5 flex-shrink-0" />
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="text-xs text-muted-foreground/60 text-center pt-4 border-t border-border/60">
            Trend Tracking System © 2026
          </div>
        </aside>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "fixed top-20 left-0 bottom-0 z-30 bg-card/60 backdrop-blur-md border-r border-border flex flex-col justify-between transition-all duration-300 ease-in-out hidden md:flex",
        isOpen ? "w-64 p-6" : "w-20 p-4"
      )}
    >
      <div className="space-y-6">
        {/* Toggle Collapse Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg border border-border/60 bg-card transition-all"
            title={isOpen ? "Thu nhỏ menu" : "Mở rộng menu"}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "flex items-center rounded-xl transition-all duration-200 font-medium",
                isOpen ? "gap-3 px-4 py-3 text-sm" : "justify-center p-3 text-base",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              title={!isOpen ? link.name : undefined}
            >
              <link.icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span>{link.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="text-xs text-muted-foreground/50 text-center pt-4 border-t border-border/40">
        {isOpen ? "Trend Tracking System © 2026" : "TTS"}
      </div>
    </aside>
  );
}
