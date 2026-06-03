import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, Award, Clock } from 'lucide-react';

const yearlyData = [
  { year: '2019', ML: 4000, AI: 2400, CS: 2400 },
  { year: '2020', ML: 5000, AI: 3000, CS: 2800 },
  { year: '2021', ML: 6500, AI: 4200, CS: 3100 },
  { year: '2022', ML: 8200, AI: 5800, CS: 3600 },
  { year: '2023', ML: 11000, AI: 8900, CS: 4200 },
  { year: '2024', ML: 14500, AI: 13200, CS: 4900 },
];

const topicData = [
  { topic: 'Large Language Models', count: 1240 },
  { topic: 'Computer Vision', count: 980 },
  { topic: 'Transformers', count: 850 },
  { topic: 'Reinforcement Learning', count: 640 },
  { topic: 'Bioinformatics', count: 520 },
];

export default function TrendsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          Phân tích Xu hướng Xuất bản
        </h1>
        <p className="text-muted-foreground text-lg">
          Theo dõi sự phát triển của các lĩnh vực nghiên cứu qua thời gian.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng xuất bản (2024)</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">32,600</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-emerald-500">
            <span>+18.4%</span>
            <span className="text-muted-foreground ml-2 font-normal">so với năm ngoái</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Top Chủ đề</p>
              <h3 className="text-2xl font-bold mt-2 text-foreground">Artificial Intelligence</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Award className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs font-medium mr-2">
              LLMs
            </span>
            <span className="text-muted-foreground text-xs">Phát triển mạnh nhất</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dữ liệu cập nhật</p>
              <h3 className="text-xl font-bold mt-2 text-foreground">15 phút trước</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Sử dụng API từ Semantic Scholar
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Area Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-foreground mb-6">Tốc độ xuất bản qua các năm (CS vs AI vs ML)</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorML" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/30" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Area type="monotone" dataKey="AI" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAI)" />
                <Area type="monotone" dataKey="ML" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorML)" />
                <Area type="monotone" dataKey="CS" stroke="#f59e0b" strokeWidth={2} fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">Top Chủ Đề Nổi Bật (Tháng này)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="topic" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={120} />
                <Tooltip 
                  cursor={{fill: 'var(--muted)', opacity: 0.2}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Card */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-4">AI Insights</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Mô hình học máy của chúng tôi dự báo rằng các chủ đề liên quan đến <strong>"Large Language Models"</strong> và <strong>"Generative AI"</strong> sẽ tiếp tục thống trị các hội nghị khoa học trong năm tới, chiếm khoảng 45% tổng số bài báo đệ trình tại NeurIPS và ICML.
            </p>
          </div>
          <button className="mt-8 bg-white text-primary px-6 py-3 rounded-xl font-bold w-full hover:bg-white/90 transition-colors">
            Tải báo cáo chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
