# 📚 Scientific Journal Publication Trend Tracking System

> Hệ thống thu thập, phân tích và theo dõi xu hướng xuất bản bài báo khoa học.
> Kiến trúc 3-tier hiện đại: React (SPA) + Express (RESTful API) + PostgreSQL (Database).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts (vẽ biểu đồ), Lucide Icons, Axios.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, Swagger OpenAPI.
- **Cơ sở dữ liệu**: PostgreSQL.
- **DevOps/Hạ tầng**: Docker, Docker Compose, NGINX, Jenkins CI/CD Pipeline.

---

## 📁 Cấu trúc thư mục (Project Structure)

Dưới đây là cấu trúc thư mục tổng quan của dự án, được tổ chức theo mô hình Monorepo chứa cả Backend, Frontend và cấu hình DevOps:

```text
├── .env
├── .env.example
├── .gitignore
│
├── backend/                   # 🚀 Backend Node.js/Express
│   ├── __tests__/             # Các file Unit Test (Jest)
│   ├── config/                # Cấu hình hệ thống (Swagger, v.v)
│   ├── controllers/           # Xử lý logic Request/Response
│   ├── lib/                   # Các thư viện dùng chung (Prisma client)
│   ├── middlewares/           # Auth & Phân quyền
│   ├── routes/                # Định tuyến API endpoints
│   ├── services/              # Xử lý logic gọi API ngoài (OpenAlex)
│   ├── app.ts                 # Khởi tạo Express app
│   ├── server.ts              # Entry point của Backend
│   ├── Dockerfile             
│   └── swagger.config.ts      
│
├── frontend/                  # 🎨 Frontend React/Vite
│   ├── src/                   
│   │   ├── assets/            
│   │   ├── components/        # Các UI Components dùng chung (Layout, Navbar)
│   │   ├── pages/             # Các trang chính (Home, Search, Admin, v.v)
│   │   ├── services/          # Gọi API tới Backend (Axios)
│   │   ├── styles/            # CSS toàn cục (Tailwind)
│   │   ├── types/             # Khai báo TypeScript types/interfaces
│   │   ├── utils/             # Các hàm tiện ích
│   │   ├── App.tsx            # Main router
│   │   └── main.tsx           # Entry point của Frontend
│   ├── package.json
│   ├── tailwind.config.js     # Cấu hình Tailwind CSS
│   └── vite.config.ts         # Cấu hình Vite bundler
│
├── nginx/                     # 🌐 NGINX Proxy
│   ├── app.conf               # Cấu hình Reverse Proxy & Web Server
│   ├── Dockerfile             
│   └── nginx.conf             
│
├── prisma/                    # 🗄️ ORM & Database Migration
│   ├── migrations/            # Các bản ghi thay đổi DB
│   ├── schema.prisma          # Định nghĩa cấu trúc bảng (Schema)
│   └── seed.ts                # Dữ liệu khởi tạo mẫu
│
├── docker-compose.yml         # 🐳 Triển khai Docker toàn bộ hệ thống
├── Jenkinsfile                # ⚙️ Cấu hình CI/CD Pipeline
├── CHECKLIST.md               # Tiến độ các công việc của dự án
├── DESIGN.md                  # Tài liệu thiết kế hệ thống
└── README.md                  # Tài liệu dự án (File hiện tại)
```

---

## 🚀 Hướng dẫn chạy thử nghiệm local (Local Setup)

### 1. Cấu hình biến môi trường
Sao chép file `.env.example` thành `.env` ở thư mục gốc và cấu hình các giá trị cần thiết:
```bash
cp .env.example .env
```
*Lưu ý: Mặc định hệ thống kết nối tới PostgreSQL qua cổng `5434` của Docker. Nếu muốn kết nối tới cơ sở dữ liệu local trên máy, hãy sửa cổng thành `5432`.*

### 2. Cài đặt các gói phụ thuộc (Dependencies)
Cài đặt tất cả package cho cả backend và frontend từ thư mục gốc:
```bash
npm install
npm install --prefix frontend
```

### 3. Đồng bộ Database & Sinh dữ liệu mẫu (Seeding)
Chạy các lệnh Prisma để đồng bộ database và tạo dữ liệu bài báo mẫu:
```bash
# Tạo client Prisma
npm run db:generate

# Chạy seed dữ liệu mẫu vào DB
npm run db:seed
```

### 4. Chạy hệ thống ở chế độ Development
Chạy cả backend và frontend đồng thời:
```bash
# Chạy backend dev server (cổng 8000)
npm run dev

# Chạy frontend dev server (cổng 5173) ở tab terminal khác
npm run frontend:dev
```
Truy cập ứng dụng tại địa chỉ: [http://localhost:5173](http://localhost:5173).

---

## 🧪 Chạy Kiểm thử (Unit Testing)

Hệ thống sử dụng Jest kết hợp Supertest để viết các bài test tích hợp endpoint của Express controller. 
Đặc biệt, cơ sở dữ liệu trong môi trường test được mock hoàn toàn trong bộ nhớ bằng in-memory mock client, giúp chạy test nhanh và không phụ thuộc vào trạng thái database vật lý.

Chạy toàn bộ unit test với lệnh:
```bash
npm test
```

---

## 🕷️ Thu thập dữ liệu từ arXiv API

Hệ thống tích hợp công cụ cào dữ liệu tự động từ arXiv API. Công cụ này sẽ tải các bài báo mới nhất và lưu trữ vào database để phục vụ phân tích xu hướng:
```bash
npm run scrape
```

---

## 🐳 Triển khai bằng Docker Compose (Kiến trúc 3-tier)

Để đóng gói và chạy toàn bộ hệ thống bằng Docker Compose (phục vụ môi trường Staging/Production):

```bash
# Khởi chạy dịch vụ (Postgres, Backend, NGINX + Frontend)
docker compose up -d --build

# Kiểm tra trạng thái container
docker compose ps
```

Các dịch vụ sẽ chạy tại các cổng:
- **Web App Frontend (qua NGINX)**: [http://localhost](http://localhost) (cổng 80)
- **RESTful API Backend**: [http://localhost:8000/api](http://localhost:8000/api)
- **Tài liệu Swagger API**: [http://localhost:8000/api-docs](http://localhost:8000/api-docs)
- **Database PostgreSQL**: `localhost:5434`
- **pgAdmin (Quản lý Database)**: [http://localhost:5050](http://localhost:5050) (Email: `admin@example.com`, Pass: `admin123`)

---

## ⚙️ Cấu hình CI/CD Jenkins Pipeline

Dự án đi kèm file `Jenkinsfile` chứa pipeline tự động hóa gồm 7 Stages:
1. **Checkout**: Tải mã nguồn từ Github/Gitlab.
2. **Install Dependencies**: Cài đặt node_modules.
3. **Lint**: Kiểm tra lỗi cú pháp mã nguồn song song (`tsc --noEmit` và ESLint).
4. **Test**: Chạy Jest unit tests.
5. **Build Docker**: Build image với tag `${BUILD_NUMBER}`.
6. **Deploy**: Restart services bằng docker compose.
7. **Health Check**: Ping cổng `80` đảm bảo NGINX hoạt động tốt.

### 📧 Hướng dẫn cấu hình gửi email thông báo từ Jenkins (SMTP)
Khi build thành công hoặc thất bại, Jenkins pipeline sẽ tự động gửi email thông báo. Để tính năng này hoạt động, quản trị viên cần cấu hình SMTP Server trên Jenkins như sau:

1. Truy cập trang quản trị Jenkins: **Jenkins Dashboard** → **Manage Jenkins** → **System** (hoặc **Configure System** trên phiên bản cũ).
2. Cuộn xuống phần **E-mail Notification** (ở cuối trang):
   - **SMTP server**: Nhập SMTP server của dịch vụ email (ví dụ: `smtp.gmail.com`).
   - **Default user e-mail suffix**: Đuôi email mặc định (ví dụ: `@gmail.com`).
   - Click vào **Advanced...** để cấu hình thêm:
     - Tích chọn **Use SMTP Authentication**.
     - **User Name**: Địa chỉ email gửi (ví dụ: `your-email@gmail.com`).
     - **Password**: Mật khẩu ứng dụng (App Password) sinh ra từ tài khoản email của bạn.
     - Tích chọn **Use SSL** (nếu dùng cổng 465) hoặc TLS.
     - **SMTP Port**: Cổng SMTP (ví dụ: `465` hoặc `587`).
3. Cuộn tiếp xuống phần **Extended E-mail Notification** (đối với plugin Email Extension - khuyên dùng trong Jenkinsfile):
   - Cấu hình tương tự các thông tin SMTP server, Port, Credentials như trên.
4. Nhấn **Save** để lưu cấu hình.

---

## 📄 Tài liệu Dự án khác
- [checklist.md](./CHECKLIST.md): Danh sách đầy đủ các task và trạng thái chi tiết của dự án.
- [task.md](./task.md) (nằm trong thư mục dữ liệu app): Theo dõi tiến độ theo từng giai đoạn phát triển.
- [SRS.md](https://datphhan.atlassian.net/wiki/x/YAASAQ): Đặc tả yêu cầu phần mềm.
