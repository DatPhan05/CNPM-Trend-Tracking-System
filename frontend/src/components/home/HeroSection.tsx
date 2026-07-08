import { ArrowRight, Sparkles, BookOpen, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
      {/* Abstract Background Shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse-glow" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Phiên bản 1.0 đã ra mắt</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Arial'] font-extrabold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Khám phá <span className="text-gradient">Tri thức</span> <br className="hidden md:block" />
          Dẫn đầu <span className="text-gradient">Xu hướng</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Hệ thống theo dõi và phân tích xu hướng xuất bản khoa học. Trợ thủ đắc lực cho nhà nghiên cứu, giảng viên và sinh viên trong việc định hướng đề tài.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link
            to="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 hover:shadow-primary/50"
          >
            <Search className="mr-2 h-5 w-5" />
            Tìm kiếm bài báo
          </Link>
          <Link
            to="/trends"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full glass px-8 py-4 text-base font-semibold text-foreground transition-all hover:-translate-y-1 hover:bg-muted"
          >
            Xem biểu đồ xu hướng
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {/* Floating elements to give 'vibe' */}
        <div className="mt-16 relative w-full max-w-5xl mx-auto h-[300px] md:h-[400px] rounded-2xl border border-white/20 glass overflow-hidden shadow-2xl animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="absolute top-0 w-full h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-black/5 dark:bg-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="p-8 pt-20 h-full flex flex-col justify-center items-center text-muted-foreground">
             <BookOpen className="h-16 w-16 mb-4 text-primary/40 animate-float" />
             <p className="font-mono text-sm">Dashboard Preview</p>
          </div>
        </div>
      </div>
    </section>
  );
}
