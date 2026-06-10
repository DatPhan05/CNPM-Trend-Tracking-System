import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Trash2, 
  ExternalLink, 
  Star, 
  Bookmark, 
  Search, 
  ChevronRight,
  TrendingUp,
  Award,
  BookOpenCheck
} from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

interface Paper {
  id: string | number;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  citations: number;
  tags?: string[];
  abstract?: string;
}

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookmarks, setBookmarks] = useState<Paper[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  const isLoggedIn = !!localStorage.getItem('access_token');

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để truy cập trang cá nhân');
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setProfile(res.data.user);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        toast.error('Không thể tải thông tin cá nhân');
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchBookmarks = async () => {
      try {
        const res = await api.get('/bookmarks');
        setBookmarks(res.data.papers || []);
      } catch (err) {
        console.error('Failed to fetch bookmarks', err);
        toast.error('Không thể tải danh sách bài báo đã lưu');
      } finally {
        setLoadingBookmarks(false);
      }
    };

    fetchProfile();
    fetchBookmarks();
  }, [isLoggedIn, navigate]);

  const handleRemoveBookmark = async (paperId: string | number) => {
    const pId = String(paperId);
    setRemovingId(pId);
    try {
      await api.delete(`/bookmarks/${pId}`);
      setBookmarks(prev => prev.filter(p => String(p.id) !== pId));
      toast.success('Đã xóa bài viết khỏi danh sách lưu trữ');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không thể xóa bookmark');
    } finally {
      setRemovingId(null);
    }
  };

  const filteredBookmarks = bookmarks.filter(paper => {
    const search = searchTerm.toLowerCase();
    const titleMatch = paper.title.toLowerCase().includes(search);
    const authorMatch = paper.authors && paper.authors.some(a => a.toLowerCase().includes(search));
    const journalMatch = paper.journal && paper.journal.toLowerCase().includes(search);
    return titleMatch || authorMatch || journalMatch;
  });

  if (loadingProfile || loadingBookmarks) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Đang đồng bộ dữ liệu nghiên cứu...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCitations = bookmarks.reduce((sum, p) => sum + (p.citations || 0), 0);
  const years = bookmarks.map(p => p.year).filter(Boolean);
  const latestYear = years.length > 0 ? Math.max(...years) : 'N/A';
  const averageCitations = bookmarks.length > 0 ? Math.round(totalCitations / bookmarks.length) : 0;

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-7xl">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-blue-500/5 to-transparent border border-primary/20 p-8 md:p-12 mb-10">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full mb-4">
              <Shield className="h-3 w-3" /> {profile?.role || 'RESEARCHER'}
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Chào mừng trở lại, {profile?.fullName}!
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Nơi quản lý thư viện cá nhân và cập nhật thông tin về các xu hướng nghiên cứu mới nhất của bạn.
            </p>
          </div>
          <Link 
            to="/search" 
            className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/95 transition-all shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Tìm tài liệu mới <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Grid Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Profile & Quick Stats */}
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Thông tin cá nhân
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary text-2xl font-bold flex items-center justify-center shadow-inner">
                {profile?.fullName.split(' ').pop()?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">{profile?.fullName}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Shield className="h-3.5 w-3.5 text-primary/70" /> {profile?.role}
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-border/60">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-muted-foreground/80 flex-shrink-0" />
                <span className="truncate">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground/80 flex-shrink-0" />
                <span>Thành viên từ: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : '10/06/2026'}</span>
              </div>
            </div>
          </div>

          {/* Quick Statistics Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Thống kê thư viện
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/30 p-4 rounded-xl border border-border/40 text-center">
                <Bookmark className="h-5 w-5 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-extrabold text-foreground">{bookmarks.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Đã lưu trữ</div>
              </div>
              <div className="bg-secondary/30 p-4 rounded-xl border border-border/40 text-center">
                <Star className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                <div className="text-2xl font-extrabold text-foreground">{totalCitations}</div>
                <div className="text-xs text-muted-foreground mt-1">Tổng trích dẫn</div>
              </div>
              <div className="bg-secondary/30 p-4 rounded-xl border border-border/40 text-center">
                <BookOpenCheck className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
                <div className="text-2xl font-extrabold text-foreground">{averageCitations}</div>
                <div className="text-xs text-muted-foreground mt-1">Trích dẫn TB</div>
              </div>
              <div className="bg-secondary/30 p-4 rounded-xl border border-border/40 text-center">
                <Award className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-extrabold text-foreground">{latestYear}</div>
                <div className="text-xs text-muted-foreground mt-1">Năm mới nhất</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Saved Bookmarks List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Bookmark className="h-6 w-6 text-primary fill-primary/10" /> Tài liệu đã lưu
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Danh sách bài báo khoa học bạn quan tâm được đồng bộ thời gian thực
              </p>
            </div>
            {/* Inner Search Box */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Lọc tài liệu đã lưu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-secondary/40 border border-border rounded-xl py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Bookmarked Papers Container */}
          <div className="space-y-4">
            {bookmarks.length === 0 ? (
              <div className="bg-card border border-border border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                <Bookmark className="h-14 w-14 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-1">Thư viện trống</h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-6">
                  Bạn chưa lưu bài báo nào. Hãy sử dụng công cụ tìm kiếm và lọc để lưu các tài liệu nghiên cứu quan tâm.
                </p>
                <Link 
                  to="/search" 
                  className="bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all text-sm shadow-md"
                >
                  Khám phá ngay
                </Link>
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <div className="bg-card border border-border rounded-3xl p-12 text-center text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium text-foreground">Không tìm thấy tài liệu phù hợp</p>
                <p className="text-sm mt-1">Vui lòng kiểm tra lại từ khóa hoặc xóa bộ lọc tìm kiếm.</p>
              </div>
            ) : (
              filteredBookmarks.map((paper) => {
                const paperId = String(paper.id);
                const isRemoving = removingId === paperId;

                return (
                  <div 
                    key={paper.id} 
                    className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {paper.title}
                        </h3>
                        <p className="text-xs font-medium text-muted-foreground mt-2 flex items-center gap-1.5 flex-wrap">
                          <span>{paper.authors && paper.authors.length > 0 ? paper.authors.join(', ') : 'Unknown Authors'}</span>
                        </p>
                      </div>
                      
                      {/* Delete Bookmark Button */}
                      <button
                        onClick={() => handleRemoveBookmark(paper.id)}
                        disabled={isRemoving}
                        title="Xóa khỏi lưu trữ"
                        className={cn(
                          "p-2 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/5 transition-all flex-shrink-0",
                          isRemoving && "opacity-40 cursor-wait"
                        )}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold">
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-secondary rounded-lg text-foreground">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {paper.year}
                      </div>
                      {paper.journal && (
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-secondary rounded-lg text-foreground max-w-xs truncate">
                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{paper.journal}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg dark:text-emerald-400">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {paper.citations.toLocaleString()} trích dẫn
                      </div>
                    </div>

                    {paper.abstract && (
                      <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed bg-secondary/20 p-3 rounded-lg border border-border/30">
                        {paper.abstract}
                      </p>
                    )}

                    <div className="flex justify-end items-center gap-2 mt-4 pt-3 border-t border-border/40">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`${paper.authors?.join(', ')} (${paper.year}). ${paper.title}. ${paper.journal || ''}`);
                          toast.success('Đã sao chép trích dẫn chuẩn APA!');
                        }}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border hover:bg-secondary transition-colors"
                      >
                        Sao chép trích dẫn
                      </button>
                      <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                        Chi tiết <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
