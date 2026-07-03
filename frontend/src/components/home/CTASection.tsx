import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CTASection() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="glass-dark !bg-primary rounded-3xl p-10 md:p-16 text-center text-primary-foreground max-w-5xl mx-auto overflow-hidden relative shadow-2xl">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 relative z-10">
            Sẵn sàng dẫn đầu xu hướng nghiên cứu?
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10">
            Tham gia cùng hàng ngàn nhà nghiên cứu, giảng viên và sinh viên đang sử dụng Trend Tracking System mỗi ngày.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-transform hover:scale-105"
            >
              Đăng ký miễn phí ngay
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-black/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-black/20"
            >
              Dùng thử không cần tài khoản
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
