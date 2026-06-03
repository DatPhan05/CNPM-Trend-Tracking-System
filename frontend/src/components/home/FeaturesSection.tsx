import { BarChart3, LineChart, PieChart, Search, Bookmark, BellRing } from 'lucide-react';
import { cn } from '@/utils/cn';

const features = [
  {
    title: 'Phân tích đa chiều',
    description: 'Trực quan hóa xu hướng xuất bản qua nhiều loại biểu đồ khác nhau (Bar, Line, Area) theo thời gian.',
    icon: BarChart3,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    colSpan: 'md:col-span-2',
  },
  {
    title: 'Tìm kiếm thông minh',
    description: 'Công cụ tìm kiếm mạnh mẽ với các bộ lọc Semantic Scholar, Crossref.',
    icon: Search,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    colSpan: 'md:col-span-1',
  },
  {
    title: 'Dự báo xu hướng',
    description: 'Sử dụng mô hình AI dự báo các topic nghiên cứu sắp bùng nổ.',
    icon: LineChart,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    colSpan: 'md:col-span-1',
  },
  {
    title: 'Theo dõi & Lưu trữ',
    description: 'Lưu các bài báo quan trọng và nhận thông báo khi có xuất bản mới cùng chủ đề.',
    icon: Bookmark,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    colSpan: 'md:col-span-2',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Tính năng <span className="text-primary">Nổi bật</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Cung cấp đầy đủ công cụ cần thiết để bạn làm chủ luồng thông tin khoa học khổng lồ và không bỏ lỡ bất kỳ xu hướng nào.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={cn(
                  'group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1',
                  feature.colSpan
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={cn('mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl', feature.bg, feature.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                
                {/* Decorative element */}
                <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full blur-3xl transition-all group-hover:bg-primary/20" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
