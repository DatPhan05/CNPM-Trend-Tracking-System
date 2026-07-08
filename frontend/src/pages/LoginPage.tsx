import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/error';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error('Vui lòng nhập email hoặc CCCD và mật khẩu!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { identifier, password });
      const { access_token, refresh_token, user } = response.data;
      login(access_token, refresh_token, user);
      toast.success(response.data.message || 'Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, 'Đăng nhập thất bại, vui lòng thử lại'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row bg-background">
      <div className="hidden md:flex flex-1 relative bg-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />

        <div className="relative z-10 p-12 text-primary-foreground max-w-xl">
          <BookOpen className="h-16 w-16 mb-8 text-white/80" />
          <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
            Nơi kết nối tri thức <br /> và tầm nhìn khoa học.
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Khám phá, phân tích và theo dõi hàng triệu bài báo nghiên cứu với hệ thống AI thông minh từ Trend Tracking System.
          </p>

          <div className="mt-16 flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-primary-foreground/20 backdrop-blur-sm" />
              ))}
            </div>
            <p className="text-sm font-medium">Tham gia cùng 50,000+ nhà nghiên cứu</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 md:px-16 lg:px-24 py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">Chào mừng trở lại!</h1>
            <p className="text-muted-foreground">Đăng nhập để tiếp tục nghiên cứu của bạn.</p>
          </div>

          <div className="mb-6">
            <GoogleAuthButton mode="login" />
          </div>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-border" />
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm font-medium">hoặc đăng nhập với tài khoản</span>
            <div className="flex-grow border-t border-border" />
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email hoặc CCCD</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Email, CCCD hoặc admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Mật khẩu</label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg py-3 pl-10 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-lg py-3 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? 'Đang xử lý...' : (
                <>Đăng nhập <LogIn className="h-5 w-5" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            Chưa có tài khoản? <Link to="/register" className="text-primary font-semibold hover:underline">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
