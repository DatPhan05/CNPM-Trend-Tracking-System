# 📋 Danh sách Task & Tiến độ dự án (Jira)

Dưới đây là tiến độ cập nhật các Task từ file Jira của dự án **Scientific Journal Publication Trend Tracking System**.

---

## 🚀 Giai đoạn 1: Khởi tạo và cấu hình dự án (PLAN 1)
*Trạng thái:* **IN PROGRESS**
- [x] **CNPM-3** | Task 1.1: Viết tài liệu đặc tả yêu cầu (SRS) và xác định phạm vi hệ thống
- [x] **CNPM-4** | Task 1.2: Vẽ các sơ đồ UML cơ bản (Use Case, ERD, Architecture, Sequence)
- [x] **CNPM-6** | Task 1.3: Thiết kế giao diện cơ bản (Wireframe/UI Design) cho Frontend
- [x] **CNPM-5** | Task 1.4: Khởi tạo source code cho Frontend (React) và Backend (Node.js)
- [x] **CNPM-7** | Task 1.5: Thiết lập quy trình CI/CD cơ bản và môi trường Database local

---

## 💻 Giai đoạn 2: Xây dựng Backend và các API (PLAN 2)
*Trạng thái:* **DONE** ✅
- [x] **CNPM-9** | Task 2.1: Khởi tạo Schema/Models Database và thực hiện kết nối ORM
- [x] **CNPM-10** | Task 2.2: Xây dựng API Authentication (Login, Register) và phân quyền (RBAC)
- [x] **CNPM-11** | Task 2.3: Xây dựng các API CRUD cho Quản lý User và Cấu hình hệ thống
- [x] **CNPM-12** | Task 2.4: Phát triển module Crawler/Scraper để thu thập dữ liệu bài báo
- [x] **CNPM-13** | Task 2.5: Viết Unit Test cho các API và tích hợp Swagger

---

## 🎨 Giai đoạn 3: Phát triển Frontend & Tích hợp User (PLAN 3)
*Trạng thái:* **DONE** ✅
- [x] **CNPM-15** | Task 3.1: Thiết lập Layout chính (Navbar, Sidebar, Footer, Routing) *(Đã hoàn thành)* 🎉
- [x] **CNPM-16** | Task 3.2: Xây dựng và tích hợp trang Authentication (Login, Đăng ký, Quên mật khẩu) *(Đã hoàn thành)* 🎉
- [x] **CNPM-17** | Task 3.3: Xây dựng giao diện Admin Dashboard và tích hợp API Quản lý User *(Đã hoàn thành)* 🎉
- [x] **CNPM-18** | Task 3.4: Xây dựng trang Profile cá nhân cho User *(Đã hoàn thành & kiểm thử thành công)* 🎉
- [x] **CNPM-19** | Task 3.5: Thiết lập Global State Management để quản lý phiên đăng nhập và thông báo *(Đã hoàn thành)* 🎉

---

## 📈 Giai đoạn 4: Xử lý dữ liệu & Phân tích Xu hướng (PLAN 4)
*Trạng thái:* **TO DO**
- [x] **CNPM-21** | Task 4.1: (BE) Xây dựng logic phân tích dữ liệu, tính toán thống kê
- [x] **CNPM-22** | Task 4.2: (BE) Xây dựng API trả về dữ liệu phục vụ biểu đồ
- [x] **CNPM-23** | Task 4.3: (FE) Tích hợp thư viện biểu đồ (Recharts, Chart.js) và xây dựng UI
- [x] **CNPM-24** | Task 4.4: (FE) Tích hợp API và hoàn thiện giao diện Dashboard
- [x] **CNPM-25** | Task 4.5: (FE/BE) Hoàn thiện tính năng Lọc (Filter) và Tìm kiếm nâng cao

---

## 📝 Giai đoạn 5: Hoàn thiện Tính năng & Viết tài liệu (PLAN 5)
*Trạng thái:* **TO DO**
- [ ] **CNPM-27** | Task 5.1: (BE) Xây dựng tính năng Export Báo cáo (CSV/PDF)
- [ ] **CNPM-28** | Task 5.2: (FE) Tích hợp Export Báo cáo và làm mượt hiệu ứng/UI
- [ ] **CNPM-29** | Task 5.3: Hoàn thiện và chuẩn hóa Tài liệu API (Swagger)
- [ ] **CNPM-30** | Task 5.4: Viết tài liệu Hướng dẫn sử dụng (User Manual) và sơ đồ
- [ ] **CNPM-31** | Task 5.5: Tối ưu hóa hiệu năng (Code splitting/Lazy loading, DB index)

---

## 🛡️ Giai đoạn 6: Kiểm thử & Triển khai (PLAN 6)
*Trạng thái:* **TO DO**
- [ ] **CNPM-33** | Task 6.1: Kiểm thử hệ thống (System Testing) và Kiểm thử tích hợp (E2E Testing)
- [ ] **CNPM-34** | Task 6.2: Sửa lỗi (Fix bugs) và tinh chỉnh dựa trên kết quả kiểm thử
- [ ] **CNPM-35** | Task 6.3: Đánh giá bảo mật cơ bản (SQL Injection, XSS, Rate Limiting)
- [ ] **CNPM-36** | Task 6.4: Deploy Database, Backend, và Frontend lên Cloud
- [ ] **CNPM-37** | Task 6.5: Trình bày tổng kết, đóng gói tài liệu toàn bộ dự án

---

## 📄 Giai đoạn 7: Viết DOC (PLAN 7)
*Trạng thái:* **TO DO**
- [ ] **CNPM-39** | Task 3.6: Viết DOC
- [ ] **CNPM-40** | Task 4.6: Viết DOC

---

## 🔍 Giai đoạn 8: Nâng cấp Engine Tìm kiếm & Crawler (PLAN 8)
*Trạng thái:* **IN PROGRESS**
- [x] **CNPM-41** | Task 8.1: Cấu hình Elasticsearch và Redis trong `docker-compose.yml`
- [x] **CNPM-42** | Task 8.2: Xây dựng service `elasticsearch.service.ts` để đồng bộ dữ liệu PostgreSQL sang Elasticsearch
- [x] **CNPM-43** | Task 8.3: Cập nhật API tìm kiếm bài báo để ưu tiên dùng Elasticsearch (Fuzzy Search)
- [x] **CNPM-44** | Task 8.4: Thiết lập BullMQ Worker để xử lý Crawler dưới dạng Background Job
- [ ] **CNPM-45** | Task 8.5: Kiểm thử thực tế hệ thống Queue ngầm và tìm kiếm Elasticsearch
