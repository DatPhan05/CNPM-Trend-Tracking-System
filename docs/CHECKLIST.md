# ✅ Project Checklist — Scientific Journal Publication Trend Tracking System

> Cập nhật lần cuối: 10/06/2026

Dưới đây là bảng phân rã chi tiết các đầu việc (Sub-tasks) tương ứng với các Task trên Jira.

---

## 🚀 Giai đoạn 1: Khởi tạo và cấu hình dự án (PLAN 1)

| Jira ID | Task / Sub-task | Trạng thái | File / Ghi chú |
|---|---|:---:|---|
| **[CNPM-3]** | **Task 1.1: Viết tài liệu đặc tả yêu cầu (SRS) và xác định phạm vi hệ thống** | ✅ Hoàn thành | `SRS.md` |
| **[CNPM-4]** | **Task 1.2: Vẽ các sơ đồ UML cơ bản** | ✅ Hoàn thành | `diagrams/` |
| **[CNPM-6]** | **Task 1.3: Thiết kế giao diện cơ bản (Wireframe/UI Design)** | ✅ Hoàn thành | `Figma/Design` |
| **[CNPM-5]** | **Task 1.4: Khởi tạo source code cho Frontend và Backend** | ✅ Hoàn thành | Github Repo |
| **[CNPM-7]** | **Task 1.5: Thiết lập quy trình CI/CD cơ bản và môi trường Database local** | ✅ Hoàn thành | `.env` |
| | - Viết Dockerfile cho Backend, Frontend, NGINX | ✅ Hoàn thành | `Dockerfile` |
| | - Thiết lập Docker Compose 3-tier | ✅ Hoàn thành | `docker-compose.yml` |
| | - Viết pipeline CI/CD cơ bản | ✅ Hoàn thành | — |

---

## 💻 Giai đoạn 2: Xây dựng Backend và các API (PLAN 2)

| Jira ID | Task / Sub-task | Trạng thái | File / Ghi chú |
|---|---|:---:|---|
| **[CNPM-9]** | **Task 2.1: Khởi tạo Schema/Models Database và thực hiện kết nối ORM** | ✅ Hoàn thành | `prisma/schema.prisma` |
| | - Thiết kế các model: User, Paper, Author, Journal... | ✅ Hoàn thành | `schema.prisma` |
| | - Viết seed data cho môi trường phát triển | ✅ Hoàn thành | `seed.ts` |
| | - Chạy migration PostgreSQL | ✅ Hoàn thành | `migrations/` |
| **[CNPM-10]** | **Task 2.2: Xây dựng API Authentication và phân quyền (RBAC)** | ✅ Hoàn thành | `auth.controller.ts` |
| | - API Đăng ký, Đăng nhập (JWT) | ✅ Hoàn thành | `auth.routes.ts` |
| | - Middleware xác thực `authenticateToken`, `authorizeRoles` | ✅ Hoàn thành | `auth.middleware.ts` |
| **[CNPM-11]** | **Task 2.3: Xây dựng các API CRUD cho Quản lý User và Cấu hình** | ✅ Hoàn thành | `user.controller.ts` |
| | - API CRUD Users (Admin only) | ✅ Hoàn thành | `user.routes.ts` |
| | - API CRUD System Settings (Admin only) | ✅ Hoàn thành | `setting.routes.ts` |
| | - API Quản lý Bookmarks (`/api/bookmarks`) | ✅ Hoàn thành | `bookmark.controller.ts` |
| **[CNPM-12]** | **Task 2.4: Phát triển module Crawler/Scraper thu thập dữ liệu** | ✅ Hoàn thành | `crawler.controller.ts` |
| | - Gọi dữ liệu bài báo từ OpenAlex API | ✅ Hoàn thành | `openAlex.service.ts` |
| | - API tìm kiếm/lấy danh sách bài báo (`GET /api/papers`) | ✅ Hoàn thành | `paper.controller.ts` |
| **[CNPM-13]** | **Task 2.5: Viết Unit Test cho các API và tích hợp Swagger** | ✅ Hoàn thành | `__tests__/` |
| | - Unit test Auth, Papers, Bookmarks với Jest | ✅ Hoàn thành | `auth.test.ts`, `api.test.ts` |
| | - Tài liệu hóa API bằng Swagger UI | ✅ Hoàn thành | `swagger.config.ts` |

---

## 🎨 Giai đoạn 3: Phát triển Frontend & Tích hợp User (PLAN 3)

| Jira ID | Task / Sub-task | Trạng thái | File / Ghi chú |
|---|---|:---:|---|
| **[CNPM-15]** | **Task 3.1: Thiết lập Layout chính** | ✅ Hoàn thành | `components/layout/` |
| | - Cấu hình Navbar, Sidebar, Footer, Routing | ✅ Hoàn thành | `App.tsx` |
| | - Trang chủ, Trang 404, Responsive Design | ✅ Hoàn thành | `HomePage.tsx` |
| **[CNPM-16]** | **Task 3.2: Xây dựng trang Authentication** | ✅ Hoàn thành | `LoginPage.tsx` |
| | - Giao diện Đăng nhập, Đăng ký | ✅ Hoàn thành | `RegisterPage.tsx` |
| | - Axios JWT interceptor xử lý Refresh token | ✅ Hoàn thành | `services/api.ts` |
| **[CNPM-17]** | **Task 3.3: Xây dựng giao diện Admin Dashboard** | ✅ Hoàn thành | `AdminDashboardPage.tsx` |
| | - Hiển thị danh sách User, API tích hợp | ✅ Hoàn thành | `AdminRoute.tsx` |
| **[CNPM-18]** | **Task 3.4: Xây dựng trang Profile cá nhân cho User** | ✅ Hoàn thành | `ProfilePage.tsx` |
| | - Giao diện hiển thị thông tin và đổi mật khẩu | ✅ Hoàn thành | `ProfilePage.tsx` |
| **[CNPM-19]** | **Task 3.5: Thiết lập Global State Management (AuthContext)** | ✅ Hoàn thành | `AuthContext.tsx` |
| | - Bọc toàn bộ App với AuthProvider | ✅ Hoàn thành | `main.tsx` |
| | - Refactor các component để sử dụng `useAuth()` | ✅ Hoàn thành | Nhiều file |

---

## 📈 Giai đoạn 4: Xử lý dữ liệu & Phân tích Xu hướng (PLAN 4)

| Jira ID | Task / Sub-task | Trạng thái | File / Ghi chú |
|---|---|:---:|---|
| **[CNPM-21]** | **Task 4.1: (BE) Xây dựng logic phân tích dữ liệu, tính toán thống kê** | ⬜ Chưa làm | — |
| **[CNPM-22]** | **Task 4.2: (BE) Xây dựng API trả về dữ liệu phục vụ biểu đồ** | 🔄 Đang làm | `paper.controller.ts` (1 phần) |
| **[CNPM-23]** | **Task 4.3: (FE) Tích hợp thư viện biểu đồ và xây dựng UI** | 🔄 Đang làm | `TrendsPage.tsx` (1 phần) |
| **[CNPM-24]** | **Task 4.4: (FE) Tích hợp API và hoàn thiện giao diện Dashboard** | ⬜ Chưa làm | — |
| **[CNPM-25]** | **Task 4.5: (FE/BE) Hoàn thiện tính năng Lọc (Filter) và Tìm kiếm nâng cao** | 🔄 Đang làm | `SearchPage.tsx` (1 phần) |

---

## 📝 Giai đoạn 5: Hoàn thiện Tính năng & Viết tài liệu (PLAN 5)

| Jira ID | Task / Sub-task | Trạng thái | File / Ghi chú |
|---|---|:---:|---|
| **[CNPM-27]** | **Task 5.1: (BE) Xây dựng tính năng Export Báo cáo (CSV/PDF)** | ⬜ Chưa làm | — |
| **[CNPM-28]** | **Task 5.2: (FE) Tích hợp Export Báo cáo và làm mượt hiệu ứng/UI** | ⬜ Chưa làm | — |
| **[CNPM-29]** | **Task 5.3: Hoàn thiện và chuẩn hóa Tài liệu API (Swagger)** | ✅ Hoàn thành | `swagger.config.ts` |
| **[CNPM-30]** | **Task 5.4: Viết tài liệu Hướng dẫn sử dụng (User Manual) và sơ đồ** | ⬜ Chưa làm | — |
| **[CNPM-31]** | **Task 5.5: Tối ưu hóa hiệu năng (Code splitting, DB index)** | ⬜ Chưa làm | — |

---

## 🛡️ Giai đoạn 6: Kiểm thử & Triển khai (PLAN 6)

| Jira ID | Task / Sub-task | Trạng thái | File / Ghi chú |
|---|---|:---:|---|
| **[CNPM-33]** | **Task 6.1: Kiểm thử hệ thống và Kiểm thử tích hợp (E2E Testing)** | 🔄 Đang làm | `e2e/full-system.spec.ts` |
| | - Viết Automation Test với Playwright | ✅ Hoàn thành | `playwright.config.ts` |
| **[CNPM-34]** | **Task 6.2: Sửa lỗi (Fix bugs) và tinh chỉnh** | 🔄 Đang làm | — |
| **[CNPM-35]** | **Task 6.3: Đánh giá bảo mật cơ bản (SQL Injection, XSS)** | ⬜ Chưa làm | — |
| **[CNPM-36]** | **Task 6.4: Deploy Database, Backend, và Frontend lên Cloud** | ⬜ Chưa làm | `nginx/` |
| **[CNPM-37]** | **Task 6.5: Trình bày tổng kết, đóng gói tài liệu toàn bộ dự án** | ⬜ Chưa làm | — |

---

## 📄 Giai đoạn 7: Viết DOC (PLAN 7)

| Jira ID | Task / Sub-task | Trạng thái | File / Ghi chú |
|---|---|:---:|---|
| **[CNPM-39]** | **Task 3.6: Viết DOC (Quản lý dự án, checklist)** | ✅ Hoàn thành | `CHECKLIST.md`, `task.md` |
| **[CNPM-40]** | **Task 4.6: Viết DOC (Cập nhật thông tin dự án, README)** | ✅ Hoàn thành | `README.md` |

---

## 📊 Thống kê tổng quan

| Giai đoạn | Số lượng Task | Hoàn thành | Đang làm | Chưa làm | Tỷ lệ hoàn thành |
|---|:---:|:---:|:---:|:---:|:---:|
| Giai đoạn 1 (Khởi tạo) | 5 | 5 | 0 | 0 | 100% |
| Giai đoạn 2 (Backend) | 5 | 5 | 0 | 0 | 100% |
| Giai đoạn 3 (Frontend) | 5 | 5 | 0 | 0 | 100% |
| Giai đoạn 4 (Phân tích) | 5 | 0 | 3 | 2 | ~30% |
| Giai đoạn 5 (Hoàn thiện) | 5 | 1 | 0 | 4 | 20% |
| Giai đoạn 6 (Triển khai) | 5 | 0 | 2 | 3 | ~20% |
| Giai đoạn 7 (DOC) | 2 | 2 | 0 | 0 | 100% |
| **Tổng** | **32** | **18** | **5** | **9** | **~56%** |

> **Tiến độ tổng thể (Dựa trên Jira Task): ~56%** 🔄
> *(Các Task lớn Giai đoạn 1, 2, 3 đã hoàn thành 100%)*

---

*Ghi chú: ✅ = Hoàn thành | ⚠️ = Cần cải thiện | ⬜ = Chưa làm | 🔄 = Đang làm*
