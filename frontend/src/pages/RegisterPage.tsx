import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, Building, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Vui lòng điền đầy đủ họ tên, email và mật khẩu!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      toast.success(response.data.message || 'Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row-reverse bg-background">
      {/* Right side - Visuals */}
      <div className="hidden md:flex flex-1 relative bg-emerald-600 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-transparent" />
        
        <div className="relative z-10 p-12 text-white max-w-xl">
          <BookOpen className="h-16 w-16 mb-8 text-white/80" />
          <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
            Khởi đầu hành trình <br /> nghiên cứu của bạn.
          </h2>
          <p className="text-white/80 text-lg">
            Trở thành một phần của cộng đồng khoa học toàn cầu. Quản lý, lưu trữ và theo dõi các xuất bản phẩm một cách thông minh.
          </p>
        </div>
      </div>

      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 md:px-16 lg:px-24 py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">Tạo tài khoản</h1>
            <p className="text-muted-foreground">Điền thông tin bên dưới để đăng ký.</p>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tổ chức / Trường học (Tùy chọn)</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Đại học Bách Khoa..."
                  className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-card border border-border rounded-xl pl-10 pr-12 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
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
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group mt-2 disabled:opacity-70 disabled:hover:-translate-y-0"
            >
              {isLoading ? 'Đang xử lý...' : (
                <>Tạo tài khoản <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-muted-foreground text-sm">
            Bằng việc đăng ký, bạn đồng ý với <Link to="#" className="text-emerald-600 hover:underline">Điều khoản dịch vụ</Link> và <Link to="#" className="text-emerald-600 hover:underline">Chính sách bảo mật</Link>.
          </p>

          <p className="mt-4 text-center text-muted-foreground">
            Đã có tài khoản? <Link to="/login" className="text-emerald-600 font-semibold hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
