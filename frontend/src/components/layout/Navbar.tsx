import { Link, useLocation } from 'react-router-dom';
import { Search, TrendingUp, BookOpen, UserCircle, Menu, X, Zap, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';

export default function Navbar({ onToggleMobileSidebar }: { onToggleMobileSidebar?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  const checkAuth = () => {
    setUserName(localStorage.getItem('user_name'));
    setUserRole(localStorage.getItem('user_role'));
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('auth:login', checkAuth);
    window.addEventListener('auth:unauthorized', () => {
      setUserName(null);
      setUserRole(null);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Khám phá', path: '/search', icon: Search },
    { name: 'Xu hướng', path: '/trends', icon: TrendingUp },
    ...(userName ? [{ name: 'Thư viện', path: '/dashboard', icon: Bookmark }] : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    setUserName(null);
    setUserRole(null);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled
          ? 'glass py-3 shadow-sm'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-105 group-hover:shadow-primary/50">
            <BookOpen className="h-6 w-6" />
            <div className="absolute inset-0 rounded-xl bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-foreground">
            Trend<span className="text-primary"> Tracking System</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              const Icon = link.icon;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={cn(
                      'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary relative group',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-primary rounded-full animate-fade-in" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="h-6 w-px bg-border hidden lg:block" />

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {userName ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden lg:block"
                >
                  Chào, <span className="text-primary font-semibold">{userName}</span>
                </Link>
                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow transition-all hover:bg-amber-600"
                  >
                    Bảng điều khiển Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => {
            if (userName && onToggleMobileSidebar) {
              onToggleMobileSidebar();
            } else {
              setMobileMenuOpen(!mobileMenuOpen);
            }
          }}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-border animate-fade-in">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-base font-medium p-3 rounded-lg hover:bg-muted"
              >
                <link.icon className="h-5 w-5 text-primary" />
                {link.name}
              </Link>
            ))}
            <div className="h-px w-full bg-border my-2" />
            {userName ? (
              <>
                <span className="text-base font-medium px-3 py-2 text-foreground">
                  Chào, {userName}
                </span>
                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 p-3 text-base font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600"
                  >
                    Bảng điều khiển Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 text-base font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-3 text-base font-medium rounded-lg border border-border hover:bg-muted"
                >
                  <UserCircle className="h-5 w-5" />
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-3 text-base font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Zap className="h-5 w-5" />
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
