import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, BookOpen, Star, ExternalLink, Calendar, Users, Database, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { cn } from '@/utils/cn';
import api from '@/api/api';
import toast from 'react-hot-toast';

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

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [mode, setMode] = useState<'mock' | 'openalex'>('mock');
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Track which paper IDs are bookmarked by current user
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState<string | null>(null);

  const isLoggedIn = !!localStorage.getItem('access_token');

  const fetchPapers = async (searchQuery: string, page: number = 1) => {
    setIsSearching(true);
    try {
      // RESTful: unified GET /papers endpoint with query params
      // mode=openalex → OpenAlex API, mode=local (default) → internal DB
      const response = await api.get('/papers', {
        params: { keyword: searchQuery || 'machine learning', mode, page, limit: 10 }
      });
      setPapers(response.data.data || response.data.papers || []);
      setTotalPages(response.data.meta?.totalPages || 1);
      setCurrentPage(page);
      setHasSearched(true);
    } catch (error) {
      console.error('Failed to fetch papers', error);
      setPapers([]);
      setTotalPages(1);
    } finally {
      setIsSearching(false);
    }
  };

  // Load current user's bookmarks to sync bookmark button state
  const fetchBookmarks = async () => {
    if (!isLoggedIn) return;
    try {
      const { data } = await api.get('/bookmarks');
      const ids = new Set<string>((data.papers || []).map((p: Paper) => String(p.id)));
      setBookmarkedIds(ids);
    } catch {
      // Not critical — ignore silently
    }
  };

  // Fetch initial data or let user search first
  useEffect(() => {
    if (mode === 'mock') {
      setCurrentPage(1);
      fetchPapers('', 1);
    }
    fetchBookmarks();
  }, [mode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPapers(query, 1);
  };

  const handleToggleBookmark = async (paper: Paper) => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để lưu bookmark');
      return;
    }

    const paperId = String(paper.id);
    setBookmarkLoading(paperId);

    try {
      if (bookmarkedIds.has(paperId)) {
        // RESTful DELETE /api/bookmarks/:paperId
        await api.delete(`/bookmarks/${paperId}`);
        setBookmarkedIds(prev => {
          const next = new Set(prev);
          next.delete(paperId);
          return next;
        });
        toast.success('Đã xóa bookmark');
      } else {
        // POST /api/bookmarks with paperId in body
        await api.post('/bookmarks', { paperId });
        setBookmarkedIds(prev => new Set(prev).add(paperId));
        toast.success('Đã lưu bookmark ⭐');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không thể cập nhật bookmark');
    } finally {
      setBookmarkLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto pt-8">
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
          Khám phá Cơ sở dữ liệu Khoa học
        </h1>
        <p className="text-muted-foreground text-lg">
          Hàng triệu bài báo, tạp chí và hội nghị từ các nguồn uy tín nhất.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-6 relative group">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-400 opacity-20 blur-lg transition duration-500 group-hover:opacity-40" />
        <div className="relative flex items-center bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="pl-6 text-muted-foreground">
            <Search className="h-6 w-6" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm bài báo, tác giả, DOI..."
            className="flex-1 bg-transparent px-4 py-6 text-lg outline-none placeholder:text-muted-foreground/60"
          />
          <button
            type="button"
            className="px-4 text-muted-foreground hover:text-foreground transition-colors hidden md:flex items-center gap-2"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span className="text-sm font-medium">Bộ lọc</span>
          </button>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-8 py-6 font-semibold text-lg transition-colors hover:bg-primary/90"
            disabled={isSearching}
          >
            {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </div>
      </form>

      {/* Data Source Toggle */}
      <div className="max-w-4xl mx-auto mb-12 flex justify-end">
        <div className="inline-flex items-center bg-card border border-border p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setMode('mock')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
              mode === 'mock' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Database className="h-4 w-4" /> Dữ liệu mẫu (Nhanh)
          </button>
          <button
            onClick={() => setMode('openalex')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
              mode === 'openalex' ? "bg-emerald-600 text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="h-4 w-4" /> OpenAlex (Thực tế)
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold mb-4 text-foreground pb-2 border-b border-border">
              <Filter className="h-4 w-4" />
              Lọc theo năm
            </div>
            <div className="space-y-3">
              {['2024', '2023', '2022', '2021', 'Cũ hơn'].map((year) => (
                <label key={year} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary w-4 h-4 accent-primary" />
                  <span className="text-sm text-muted-foreground">{year}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold mb-4 text-foreground pb-2 border-b border-border">
              <BookOpen className="h-4 w-4" />
              Tạp chí / Hội nghị
            </div>
            <div className="space-y-3">
              {['IEEE', 'Nature', 'NIPS', 'Science'].map((j) => (
                <label key={j} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary w-4 h-4 accent-primary" />
                  <span className="text-sm text-muted-foreground">{j}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-foreground">
              {hasSearched ? (
                <>Tìm thấy <span className="text-primary font-bold">{papers.length}</span> kết quả</>
              ) : (
                <>Nhập từ khóa để tìm kiếm</>
              )}
            </h2>
            <select className="bg-transparent border border-border rounded-lg text-sm p-2 outline-none text-foreground">
              <option>Độ liên quan</option>
              <option>Trích dẫn nhiều nhất</option>
              <option>Mới nhất</option>
            </select>
          </div>

          {isSearching ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <div className="animate-pulse flex items-center gap-2 text-lg"><Search className="animate-spin" /> Đang tải dữ liệu...</div>
            </div>
          ) : papers.length === 0 && hasSearched ? (
             <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
               <BookOpen className="h-12 w-12 mb-4 opacity-50" />
               <p className="text-lg">Không tìm thấy bài báo nào phù hợp.</p>
             </div>
          ) : (
            papers.map((paper, idx) => {
              const paperId = String(paper.id);
              const isBookmarked = bookmarkedIds.has(paperId);
              const isLoadingThis = bookmarkLoading === paperId;
              return (
                <div 
                  key={paper.id} 
                  className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/40 animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-bold text-primary group-hover:underline cursor-pointer line-clamp-2" title={paper.title}>
                      {paper.title}
                    </h3>
                    {/* ── Bookmark Button ── */}
                    <button
                      id={`bookmark-btn-${paperId}`}
                      onClick={() => handleToggleBookmark(paper)}
                      disabled={isLoadingThis}
                      title={isBookmarked ? 'Xóa bookmark' : 'Lưu bài báo này'}
                      className={cn(
                        "flex-shrink-0 transition-all duration-200 rounded-lg p-1.5",
                        isBookmarked
                          ? "text-amber-500 hover:text-amber-600"
                          : "text-muted-foreground hover:text-amber-500",
                        isLoadingThis && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isBookmarked
                        ? <BookmarkCheck className="h-5 w-5 fill-current" />
                        : <BookmarkPlus className="h-5 w-5" />
                      }
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground flex-wrap">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1">{paper.authors && paper.authors.length > 0 ? paper.authors.join(', ') : 'Unknown Authors'}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium">
                    <div className="flex items-center gap-1.5 text-foreground">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {paper.year}
                    </div>
                    {paper.journal && (
                      <div className="flex items-center gap-1.5 text-foreground">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        {paper.journal}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <Star className="h-4 w-4" />
                      {(paper.citations || 0).toLocaleString()} trích dẫn
                    </div>
                  </div>

                  {paper.abstract && (
                     <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                       {paper.abstract}
                     </p>
                  )}

                  {mode === 'openalex' && (
                    <p className="mt-2 text-xs text-muted-foreground/80 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      Được cung cấp bởi OpenAlex API
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 flex-wrap">
                      {(paper.tags || ['Research']).map((tag, i) => (
                        <span key={i} className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                      Xem chi tiết <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => fetchPapers(query, currentPage - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-muted text-sm font-medium text-foreground disabled:opacity-50"
              >
                &lt;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchPapers(query, p)}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                    currentPage === p
                      ? "bg-primary text-primary-foreground font-bold shadow-md"
                      : "border border-border hover:bg-muted text-foreground"
                  )}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => fetchPapers(query, currentPage + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-muted text-sm font-medium text-foreground disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
