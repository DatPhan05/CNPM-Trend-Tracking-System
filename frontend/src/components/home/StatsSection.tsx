import { Database, Users, GraduationCap, TrendingUp } from 'lucide-react';

const stats = [
  { id: 1, name: 'Bài báo khoa học', value: '2M+', icon: Database },
  { id: 2, name: 'Nhà nghiên cứu', value: '50K+', icon: Users },
  { id: 3, name: 'Tạp chí uy tín', value: '12K+', icon: GraduationCap },
  { id: 4, name: 'Xu hướng được cập nhật', value: 'Liên tục', icon: TrendingUp },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="flex flex-col items-center justify-center space-y-3 group">
                <div className="p-4 rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
