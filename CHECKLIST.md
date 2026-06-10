# ✅ Project Checklist — Scientific Journal Publication Trend Tracking System

> Cập nhật lần cuối: 10/06/2026

---

## 📄 1. Tài liệu (Documentation)

| # | Task | Trạng thái | File |
|---|---|:---:|---|
| 1.1 | Viết tài liệu SRS theo chuẩn IEEE 830 | ✅ Hoàn thành | `SRS.md` |
| 1.2 | Viết CHECKLIST.md tổng hợp các task | ✅ Hoàn thành | `CHECKLIST.md` |
| 1.3 | Viết task.md theo dõi tiến độ | ✅ Hoàn thành | `task.md` |
| 1.4 | [CNPM-40] Cập nhật README.md mô tả dự án | ✅ Hoàn thành | `README.md` |

---

## 🗄️ 2. Database & Schema

| # | Task | Trạng thái | File |
|---|---|:---:|---|
| 2.1 | Thiết kế schema Prisma (User, Paper, Author, Journal, Keyword, Bookmark, Report, SystemSetting) | ✅ Hoàn thành | `prisma/schema.prisma` |
| 2.2 | Viết seed data cho môi trường dev | ✅ Hoàn thành | `prisma/seed.ts` |
| 2.3 | Chạy migrations PostgreSQL | ✅ Hoàn thành | `prisma/migrations/` |
| 2.4 | Thêm index vào các cột hay query (title, publicationYear) | ⬜ Chưa làm | `prisma/schema.prisma` |
| 2.5 | Cấu hình `.env` đúng cho local và Docker | ✅ Hoàn thành | `.env`, `.env.example` |

---

## ⚙️ 3. Backend (Express.js + TypeScript)

### 3.1 Authentication
| # | Task | Trạng thái | File |
|---|---|:---:|---|
| 3.1.1 | API đăng ký (`POST /api/auth/register`) | ✅ Hoàn thành | `auth.controller.ts` |
| 3.1.2 | API đăng nhập (`POST /api/auth/login`) — JWT 24h | ✅ Hoàn thành | `auth.controller.ts` |
| 3.1.3 | API lấy thông tin cá nhân (`GET /api/auth/me`) | ✅ Hoàn thành | `auth.controller.ts` |
| 3.1.4 | Middleware xác thực JWT (`authenticateToken`) | ✅ Hoàn thành | `middlewares/auth.middleware.ts` |
| 3.1.5 | Middleware phân quyền (`authorizeRoles`) | ✅ Hoàn thành | `middlewares/role.middleware.ts` |

### 3.2 Papers
| # | Task | Trạng thái | File |
|---|---|:---:|---|
| 3.2.1 | API lấy/tìm kiếm bài báo (`GET /api/papers`) — unified endpoint | ✅ Hoàn thành | `paper.routes.ts` |
| 3.2.2 | Hỗ trợ tìm kiếm OpenAlex qua `?mode=openalex` | ✅ Hoàn thành | `paper.controller.ts` |
| 3.2.3 | API lấy bài báo theo ID (`GET /api/papers/:id`) | ✅ Hoàn thành | `paper.controller.ts` |
| 3.2.4 | API thống kê xu hướng (`GET /api/trends`) | ✅ Hoàn thành | `paper.controller.ts` |
| 3.2.5 | ~~Endpoint `/papers/search` riêng biệt~~ → Đã gộp vào `/papers` | ✅ Đã xóa/gộp | — |

### 3.3 Bookmarks
| # | Task | Trạng thái | File |
|---|---|:---:|---|
| 3.3.1 | API lấy danh sách bookmark (`GET /api/bookmarks`) | ✅ Hoàn thành | `bookmark.controller.ts` |
| 3.3.2 | API thêm bookmark (`POST /api/bookmarks`) | ✅ Hoàn thành | `bookmark.controller.ts` |
| 3.3.3 | ~~`POST /api/bookmarks/remove`~~ → Sửa thành `DELETE /api/bookmarks/:paperId` | ✅ Đã sửa | `bookmark.routes.ts` |
| 3.3.4 | Controller đọc `paperId` từ `req.params` thay vì `req.body` | ✅ Đã sửa | `bookmark.controller.ts` |

### 3.4 Users & Settings (Admin)
| # | Task | Trạng thái | File |
|---|---|:---:|---|
| 3.4.1 | CRUD người dùng (Admin only) | ✅ Hoàn thành | `user.controller.ts`, `user.routes.ts` |
| 3.4.2 | CRUD cài đặt hệ thống (Admin only) | ✅ Hoàn thành | `setting.controller.ts`, `setting.routes.ts` |
| 3.4.3 | ~~Alias `/api/auth/users`~~ → Đã xóa, dùng `/api/users` | ✅ Đã sửa | `app.ts` |

### 3.5 Crawler
| # | Task | Trạng thái | File |
|---|---|:---:|---|
| 3.5.1 | API crawl bài báo từ OpenAlex (`GET /api/crawler`) | ✅ Hoàn thành | `crawler.controller.ts` |
| 3.5.2 | Service gọi OpenAlex API | ✅ Hoàn thành | `services/openAlex.service.ts` |

### 3.6 RESTful & Chất lượng API
| # | Task | Trạng thái | File |
|---|---|:---:|---|
| 3.6.1 | Thêm `Cache-Control` headers middleware | ✅ Đã thêm | `app.ts` |
| 3.6.2 | Tài liệu hóa API bằng Swagger/OpenAPI | ✅ Hoàn thành | `swagger.config.ts`, route files |
| 3.6.3 | Swagger UI tại `/api-docs` | ✅ Hoàn thành | `app.ts` |
| 3.6.4 | Thêm pagination cho `GET /api/papers` | ✅ Hoàn thành | `paper.controller.ts` |
| 3.6.5 | Thêm input validation middleware (express-validator) | ⬜ Chưa làm | — |

---

## 🎨 4. Frontend (React + TypeScript)

| # | Task | Trạng thái | File |
|---|---|:---:|---|
| 4.1 | Trang chủ (`/`) | ✅ Hoàn thành | `HomePage.tsx` |
| 4.2 | Trang đăng ký (`/register`) | ✅ Hoàn thành | `RegisterPage.tsx` |
| 4.3 | Trang đăng nhập (`/login`) | ✅ Hoàn thành | `LoginPage.tsx` |
| 4.4 | Trang tìm kiếm (`/search`) — gọi `GET /papers?mode=...` | ✅ Đã cập nhật | `SearchPage.tsx` |
| 4.5 | Trang xu hướng (`/trends`) — biểu đồ Area + Bar | ✅ Hoàn thành | `TrendsPage.tsx` |
| 4.6 | Trang admin (`/admin`) — gọi `GET /users` | ✅ Đã cập nhật | `AdminDashboardPage.tsx` |
| 4.7 | Axios instance với JWT interceptor | ✅ Hoàn thành | `services/api.ts` |
| 4.8 | UI bookmark: gọi `DELETE /bookmarks/:paperId` | ✅ Hoàn thành | `SearchPage.tsx` / component |
| 4.9 | Trang dashboard cá nhân (`/dashboard`) | ✅ Hoàn thành | `DashboardPage.tsx` |
| 4.10 | Trang 404 | ✅ Hoàn thành | `NotFoundPage.tsx` |
| 4.11 | Responsive design (mobile + collapsible sidebar) | ✅ Hoàn thành | — |
| 4.12 | [CNPM-15] Thiết lập Layout chính (Navbar, Sidebar, Footer, Routing) | ✅ Hoàn thành | `components/layout/` |

---

## 🐳 5. DevOps & Hạ tầng

### 5.1 Docker
| # | Task | Trạng thái | File |
|---|---|:---:|---|
| 5.1.1 | Dockerfile cho Backend | ✅ Hoàn thành | `backend/Dockerfile` |
| 5.1.2 | Dockerfile cho Frontend | ✅ Hoàn thành | `frontend/Dockerfile` |
| 5.1.3 | Dockerfile cho NGINX | ✅ Hoàn thành | `nginx/Dockerfile` |
| 5.1.4 | Docker Compose 3-tier (postgres + backend + frontend + nginx + pgadmin) | ✅ Hoàn thành | `docker-compose.yml` |
| 5.1.5 | Health check cho PostgreSQL | ✅ Hoàn thành | `docker-compose.yml` |

### 5.2 NGINX
| # | Task | Trạng thái | File |
|---|---|:---:|---|
| 5.2.1 | Cấu hình reverse proxy `/api/*` → Backend | ✅ Hoàn thành | `nginx/app.conf` |
| 5.2.2 | Cấu hình phục vụ React static files | ✅ Hoàn thành | `nginx/app.conf` |
| 5.2.3 | SPA fallback (`try_files $uri /index.html`) | ✅ Hoàn thành | `nginx/app.conf` |
| 5.2.4 | Gzip compression | ✅ Hoàn thành | `nginx/nginx.conf` |
| 5.2.5 | Proxy `/api-docs` → Swagger UI | ✅ Hoàn thành | `nginx/app.conf` |

### 5.3 CI/CD (Jenkins)
| # | Task | Trạng thái | File |
|---|---|:---:|---|
| 5.3.1 | Stage Checkout | ✅ Hoàn thành | `Jenkinsfile` |
| 5.3.2 | Stage Install Dependencies | ✅ Hoàn thành | `Jenkinsfile` |
| 5.3.3 | Stage Lint (parallel: TSC + ESLint) | ✅ Thêm mới | `Jenkinsfile` |
| 5.3.4 | Stage Test (Jest unit tests) | ✅ Thêm mới | `Jenkinsfile` |
| 5.3.5 | Stage Build Docker (tagged với BUILD_NUMBER) | ✅ Cải tiến | `Jenkinsfile` |
| 5.3.6 | Stage Deploy (docker compose up) | ✅ Hoàn thành | `Jenkinsfile` |
| 5.3.7 | Stage Health Check (port 80 — đã sửa từ 3000) | ✅ Đã sửa | `Jenkinsfile` |
| 5.3.8 | Post: Email success notification | ✅ Thêm mới | `Jenkinsfile` |
| 5.3.9 | Post: Email failure notification + cleanup | ✅ Thêm mới | `Jenkinsfile` |
| 5.3.10 | Post: Docker image prune | ✅ Thêm mới | `Jenkinsfile` |
| 5.3.11 | Cấu hình SMTP trong Jenkins | ✅ Có tài liệu | `README.md` |

---

## 🧪 6. Kiểm thử (Testing)

| # | Task | Trạng thái | Ghi chú |
|---|---|:---:|---|
| 6.1 | Unit tests backend (Jest + Supertest) | ✅ Hoàn thành | `backend/__tests__/` |
| 6.2 | Test API auth (register, login, me) | ✅ Hoàn thành | `auth.test.ts` |
| 6.3 | Test API papers (get, search, trends) | ✅ Hoàn thành | `api.test.ts` |
| 6.4 | Test API bookmarks (add, get, DELETE /:paperId) | ✅ Hoàn thành | `api.test.ts` |
| 6.5 | Integration tests với database | ✅ Hoàn thành | Mocks `prisma.ts` |
| 6.6 | Frontend E2E tests | ⬜ Chưa làm | — |

---

## 📊 Thống kê tổng quan

| Hạng mục | Hoàn thành | Đang làm | Chưa làm |
|---|:---:|:---:|:---:|
| Tài liệu | 5/5 | 0 | 0 |
| Database | 3/5 | 0 | 2 |
| Backend | 23/25 | 0 | 2 |
| Frontend | 12/12 | 0 | 0 |
| DevOps/Hạ tầng | 15/16 | 0 | 1 |
| Kiểm thử | 5/6 | 0 | 1 |
| **Tổng** | **63/69** | **0** | **6** |

> **Tiến độ tổng thể: ~90%** ✅

---

*Ghi chú: ✅ = Hoàn thành | ⚠️ = Cần cải thiện | ⬜ = Chưa làm | 🔄 = Đang làm*
