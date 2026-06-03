import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          
          {/* Brand Info */}
          <div className="md:col-span-1 lg:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-foreground">
                Trend Tracking System
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              Hệ thống theo dõi và phân tích xu hướng xuất bản tạp chí khoa học hàng đầu dành cho nhà nghiên cứu.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Khám phá</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link to="/search" className="hover:text-primary transition-colors">Tìm kiếm bài báo</Link></li>
              <li><Link to="/trends" className="hover:text-primary transition-colors">Phân tích xu hướng</Link></li>
              <li><Link to="/authors" className="hover:text-primary transition-colors">Tác giả nổi bật</Link></li>
              <li><Link to="/journals" className="hover:text-primary transition-colors">Tạp chí uy tín</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Hỗ trợ</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Tài liệu hướng dẫn</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">API Documentation</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Câu hỏi thường gặp (FAQ)</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Đăng ký nhận tin</h3>
            <p className="text-sm text-muted-foreground">Nhận thông báo về các xu hướng nghiên cứu mới nhất.</p>
            <form className="flex mt-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="flex h-10 w-full rounded-l-md border border-r-0 border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button 
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-r-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Mail className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} Trend Tracking System. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-foreground transition-colors">Điều khoản dịch vụ</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
