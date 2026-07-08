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

        {/* Trending Marquee */}
        <div className="w-full max-w-5xl mx-auto mt-12 mb-4 overflow-hidden relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex w-max animate-marquee space-x-8 items-center py-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex space-x-8 px-4 items-center">
                <span className="flex items-center text-sm md:text-base font-medium text-muted-foreground"><Sparkles className="w-4 h-4 mr-2 text-yellow-500" /> #MachineLearning</span>
                <span className="flex items-center text-sm md:text-base font-medium text-muted-foreground"><Sparkles className="w-4 h-4 mr-2 text-blue-500" /> #DeepLearning</span>
                <span className="flex items-center text-sm md:text-base font-medium text-muted-foreground"><Sparkles className="w-4 h-4 mr-2 text-green-500" /> #DataScience</span>
                <span className="flex items-center text-sm md:text-base font-medium text-muted-foreground"><Sparkles className="w-4 h-4 mr-2 text-purple-500" /> #ArtificialIntelligence</span>
                <span className="flex items-center text-sm md:text-base font-medium text-muted-foreground"><Sparkles className="w-4 h-4 mr-2 text-red-500" /> #ComputerVision</span>
                <span className="flex items-center text-sm md:text-base font-medium text-muted-foreground"><Sparkles className="w-4 h-4 mr-2 text-pink-500" /> #NLP</span>
                <span className="flex items-center text-sm md:text-base font-medium text-muted-foreground"><Sparkles className="w-4 h-4 mr-2 text-indigo-500" /> #BigData</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating elements to give 'vibe' */}
        <div className="mt-16 relative w-full max-w-5xl mx-auto h-[300px] md:h-[400px] rounded-2xl border border-white/20 glass overflow-hidden shadow-2xl animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="absolute top-0 w-full h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-black/5 dark:bg-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="p-4 md:p-6 pt-16 md:pt-20 h-full flex flex-col gap-4 md:gap-6 text-muted-foreground overflow-hidden">
            {/* Mock Header */}
            <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center animate-pulse">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="h-5 w-32 md:w-48 bg-primary/20 rounded-md animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-muted rounded-md hidden md:block animate-pulse"></div>
                <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse"></div>
              </div>
            </div>

            {/* Mock Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`bg-background/40 backdrop-blur-md rounded-xl p-3 md:p-4 border border-border/50 flex flex-col gap-3 transition-all hover:scale-105 hover:bg-background/60 shadow-lg ${i === 2 ? 'hidden md:flex' : 'flex'}`} style={{ animation: `float ${3 + i}s ease-in-out infinite` }}>
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-16 md:w-20 bg-muted-foreground/30 rounded-full animate-pulse"></div>
                    <Sparkles className="h-4 w-4 text-primary/60 animate-pulse" />
                  </div>
                  <div className="h-6 md:h-8 w-20 md:w-28 bg-foreground/20 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                     <div className="h-full bg-primary/60 rounded-full animate-pulse" style={{ width: `${Math.random() * 40 + 40}%`, animationDuration: '2s' }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mock Content Area */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              {/* Chart Area */}
              <div className="md:col-span-2 bg-background/40 backdrop-blur-md rounded-xl border border-border/50 p-4 flex flex-col relative group overflow-hidden">
                 <div className="h-3 w-24 bg-muted-foreground/30 rounded-full mb-6 animate-pulse"></div>
                 <div className="flex-1 flex items-end justify-between gap-1.5 md:gap-2 px-1">
                   {[...Array(12)].map((_, i) => (
                     <div 
                       key={i} 
                       className="w-full bg-primary/30 rounded-t-sm md:rounded-t-md hover:bg-primary transition-all duration-300 relative group/bar" 
                       style={{ 
                         height: `${Math.max(20, Math.random() * 100)}%`,
                         animation: `grow-up 1s ease-out ${0.5 + i * 0.05}s both, pulse ${2 + (i % 3)}s infinite alternate ${i * 0.1}s`
                       }}
                     >
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[9px] md:text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                          +{(Math.random() * 100).toFixed(0)}
                        </div>
                     </div>
                   ))}
                 </div>
                 {/* Decorative gradient overlay */}
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/30 to-transparent pointer-events-none"></div>
              </div>
              
              {/* List Area */}
              <div className="bg-background/40 backdrop-blur-md rounded-xl border border-border/50 p-4 flex-col gap-4 hidden md:flex">
                <div className="h-3 w-28 bg-muted-foreground/30 rounded-full mb-2 animate-pulse"></div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-all hover:translate-x-2 cursor-default group">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/10 group-hover:bg-primary/20 transition-colors">
                       <BookOpen className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="h-2.5 w-[85%] bg-foreground/30 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                      <div className="h-2 w-[55%] bg-muted-foreground/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
