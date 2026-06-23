import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Clock, Loader2, PieChart as PieChartIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/api';

export default function TrendsPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [overviewRes, trendsRes, categoriesRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/trends'),
          api.get('/analytics/categories'),
        ]);

        setOverview(overviewRes.data.data);
        setTrends(trendsRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        toast.error('Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-24 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Đang tải dữ liệu phân tích...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
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
              <p className="text-sm font-medium text-muted-foreground">Tổng bài báo xuất bản</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">{overview?.totalPapers?.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-emerald-500">
            <span>+{overview?.newPapersThisMonth}</span>
            <span className="text-muted-foreground ml-2 font-normal">bài báo mới trong tháng này</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tạp chí / Danh mục</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">{overview?.totalJournals?.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Award className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs font-medium mr-2">
              Top 1
            </span>
            <span className="text-muted-foreground text-xs truncate max-w-[150px]">{categories?.[0]?.name || 'N/A'}</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng Tác giả</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">{overview?.totalAuthors?.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Sử dụng dữ liệu từ Database hệ thống
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Area Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-foreground mb-6">Tốc độ xuất bản qua các năm</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/30" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '8px' }}
                />
                <Legend />
                <Area name="Số lượng bài báo" type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">Top Tạp chí Nổi Bật</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={120} tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value} />
                <Tooltip 
                  cursor={{fill: 'var(--muted)', opacity: 0.2}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  formatter={(value) => [value, 'Số bài báo']}
                />
                <Bar name="Số lượng bài báo" dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-primary" /> Tỷ lệ phân bổ theo Tạp chí
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name.length > 10 ? name.substring(0,10)+'...' : name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categories.map((entry, index) => {
                    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  formatter={(value) => [value, 'Số bài báo']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Card */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-sm flex flex-col justify-between lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Insights & Phân tích</h3>
              <p className="text-primary-foreground/90 leading-relaxed mb-4">
                Hệ thống hiện tại đang quản lý <strong>{overview?.totalPapers}</strong> bài báo khoa học. 
                Tạp chí dẫn đầu với lượng xuất bản lớn nhất là <strong>{categories?.[0]?.name}</strong> với {categories?.[0]?.value} bài báo.
              </p>
              <p className="text-primary-foreground/90 leading-relaxed">
                Bạn có thể dễ dàng theo dõi mức độ tăng trưởng xuất bản, và phát hiện các xu hướng sớm dựa trên trực quan hóa dữ liệu từ nền tảng Trend Tracking.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold w-full hover:bg-white/90 transition-colors shadow-lg">
                Tải báo cáo phân tích (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

