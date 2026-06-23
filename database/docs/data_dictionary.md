# Data Dictionary
## Scientific Journal Publication Trend Tracking System

### 1. Table `User`
Lưu trữ thông tin người dùng và phân quyền trong hệ thống.
- `id` (PK): UUID
- `fullName`: Tên hiển thị (String)
- `email`: Địa chỉ email đăng nhập (Unique, String)
- `password`: Mật khẩu mã hóa (String)
- `role`: Vai trò (Enum: RESEARCHER, STUDENT, ADMIN)
- `createdAt`, `updatedAt`: Timestamps

### 2. Table `Paper`
Lưu trữ thông tin chi tiết về các bài báo khoa học được thu thập.
- `id` (PK): UUID
- `title`: Tiêu đề bài báo (String)
- `abstract`: Tóm tắt nội dung (String)
- `doi`: Mã định danh (Unique, String)
- `publicationYear`: Năm xuất bản (Int)
- `citationCount`: Lượt trích dẫn (Int, Default 0)
- `sourceUrl`: Đường dẫn bài báo gốc (String)
- `sourceProvider`: Nguồn thu thập (Ví dụ: IEEE, Nature)
- `journalId` (FK): Tạp chí xuất bản
- `createdAt`, `updatedAt`: Timestamps

### 3. Table `Author`
Lưu trữ thông tin các tác giả nghiên cứu.
- `id` (PK): UUID
- `name`: Tên tác giả (String)
- `createdAt`, `updatedAt`: Timestamps

### 4. Table `Journal`
Lưu trữ thông tin Tạp chí khoa học.
- `id` (PK): UUID
- `name`: Tên tạp chí (Unique, String)
- `publisher`: Nhà xuất bản (String)
- `createdAt`, `updatedAt`: Timestamps

### 5. Table `Keyword`
Danh mục từ khóa chuyên ngành.
- `id` (PK): UUID
- `name`: Tên từ khóa (Unique, String)

### 6. Table `Bookmark`
Quản lý các bài báo được người dùng lưu lại.
- `id` (PK): UUID
- `userId` (FK): ID người dùng
- `paperId` (FK): ID bài báo

### 7. Table `Report`
Quản lý các báo cáo thống kê do người dùng tạo.
- `id` (PK): UUID
- `title`: Tiêu đề báo cáo
- `content`: Nội dung báo cáo
- `userId` (FK): ID người dùng tạo báo cáo

### 8. Relation Tables (Many-to-Many)
- `PaperAuthor`: Nối bài báo (`paperId`) và tác giả (`authorId`)
- `PaperKeyword`: Nối bài báo (`paperId`) và từ khóa (`keywordId`)

### 9. Table `SystemSetting`
Cấu hình hệ thống động (cho Admin).
- `id` (PK): UUID
- `key`: Khóa cấu hình (Unique)
- `value`: Giá trị cấu hình
- `description`: Mô tả cấu hình
