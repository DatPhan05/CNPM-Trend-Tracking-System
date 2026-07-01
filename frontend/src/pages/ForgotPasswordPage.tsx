import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/api/api';
import { getErrorMessage } from '@/utils/error';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success(response.data.message || 'Link khôi phục đã được gửi!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, 'Có lỗi xảy ra, vui lòng thử lại'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row bg-background">
      {/* Left side - Visuals */}
      <div className="hidden md:flex flex-1 relative bg-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />

        <div className="relative z-10 p-12 text-primary-foreground max-w-xl">
          <BookOpen className="h-16 w-16 mb-8 text-white/80" />
          <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
            Đặt lại mật khẩu <br /> của bạn.
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Nhập địa chỉ email đã đăng ký và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 md:px-16 lg:px-24 py-12">
        <div className="w-full max-w-md mx-auto">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </Link>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">Kiểm tra email của bạn!</h1>
              <p className="text-muted-foreground mb-6">
                Nếu địa chỉ <strong className="text-foreground">{email}</strong> tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến (và thư mục spam).
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(''); }}
                className="text-primary font-medium hover:underline"
              >
                Thử email khác
              </button>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-foreground mb-2">Quên mật khẩu?</h1>
                <p className="text-muted-foreground">
                  Nhập email bạn đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="forgot-email" className="text-sm font-medium text-foreground">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-secondary/50 border border-border rounded-lg py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="email@example.com"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="forgot-password-submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-lg py-3 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isLoading ? 'Đang gửi...' : (
                    <>Gửi liên kết đặt lại <Send className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-muted-foreground">
                Nhớ ra mật khẩu rồi?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
