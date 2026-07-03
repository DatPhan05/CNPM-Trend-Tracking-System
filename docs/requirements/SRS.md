# Dự án Hệ thống Theo dõi Xu hướng Xuất bản Bài báo Khoa học (Trend-Tracking)

**Code name:** `Trend-Tracking`

## I. Tổng quan dự án

### Mục tiêu

Mục tiêu của dự án này là xây dựng một hệ thống phần mềm (Web Application) để thu thập, phân tích và theo dõi xu hướng xuất bản của các bài báo khoa học. Hệ thống cung cấp cho các nhà nghiên cứu, sinh viên và chuyên gia một công cụ trực quan để tìm kiếm bài báo, theo dõi sự phát triển của các lĩnh vực nghiên cứu thông qua phân tích từ khóa, tác giả, tạp chí và trích xuất các báo cáo thống kê chuyên sâu.

### Phạm vi

Phạm vi dự án bao gồm các chức năng chính:
- Thu thập dữ liệu tự động (Scraping) từ các nguồn API bài báo khoa học mở (như arXiv).
- Tìm kiếm, lọc và tra cứu thông tin chi tiết bài báo, tác giả, tạp chí, từ khóa.
- Phân tích và trực quan hóa dữ liệu xu hướng xuất bản bằng biểu đồ.
- Quản lý định danh (đăng ký, đăng nhập, phân quyền người dùng).
- Chức năng lưu trữ bài báo yêu thích (Bookmark) và tạo báo cáo cá nhân (Report) dành cho người dùng.
- Quản trị hệ thống, quản lý người dùng và thay đổi cấu hình động dành cho Admin.

### Giả định và ràng buộc

- Hệ thống phân tích và tra cứu dựa trên metadata của bài báo (tiêu đề, tóm tắt, năm xuất bản, DOI, trích dẫn, từ khóa), không lưu trữ hoặc xử lý toàn văn (full-text PDF) nhằm tối ưu hiệu năng.
- Quá trình thu thập dữ liệu (Scraping) cần có kết nối Internet liên tục để gọi API.
- Ứng dụng chạy trên kiến trúc 3-tier: Frontend (React), Backend (Express REST API) và Database (PostgreSQL).

## II. Yêu cầu chức năng

### Các tác nhân

Hệ thống Trend-Tracking bao gồm 3 tác nhân (Actor) chính: Guest (Khách), User (Người dùng đăng nhập bao gồm Researcher/Student), và Admin (Quản trị viên).

<details>
<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ tác nhân"

actor Guest
actor User
actor Admin

Guest <|-- User
User <|-- Admin

rectangle "Hệ thống Trend-Tracking" as System {
}

Guest -- System : access
User -- System : uses
Admin -- System : manages

@enduml
```

</details>

![Biểu đồ tác nhân.svg](docs/diagrams/Bieu_do_tac_nhan.png)

### Các chức năng chính

**Guest (Khách truy cập):**

* **Tìm kiếm bài báo:** Tìm kiếm dữ liệu theo tiêu đề, tác giả, từ khóa, DOI, hoặc năm xuất bản.
* **Xem chi tiết bài báo:** Xem tóm tắt (abstract), năm, lượt trích dẫn, nguồn (provider), và link gốc.
* **Xem xu hướng (Trends):** Xem các biểu đồ trực quan về sự phát triển của bài báo khoa học theo thời gian, theo chuyên ngành hoặc từ khóa thịnh hành.
* **Đăng nhập:** Truy cập vào tài khoản đã đăng ký.
* **Đăng ký:** Tạo tài khoản mới trong hệ thống.

**User (Researcher / Student):**

* **Quản lý Bookmark:** Lưu lại (bookmark) các bài báo quan tâm để đọc sau, xem danh sách đã lưu, xóa bookmark.
* **Quản lý Báo cáo (Report):** Tạo các báo cáo thống kê, phân tích cá nhân. Xem, sửa, và xóa báo cáo đã tạo.
* **Quản lý thông tin tài khoản:** Cập nhật thông tin hiển thị cá nhân (Họ tên) và thay đổi mật khẩu.

**Admin:**

* **Quản lý người dùng:** Xem danh sách toàn bộ người dùng, phân quyền (Role: RESEARCHER, STUDENT, ADMIN), khóa hoặc xóa tài khoản.
* **Quản lý dữ liệu nền tảng:** Xem danh sách, cập nhật các bài báo, tạp chí (Journal), tác giả (Author), từ khóa (Keyword) trong hệ thống.
* **Quản lý thu thập dữ liệu:** Chủ động kích hoạt tác vụ cào dữ liệu (Scraping) từ API bên ngoài.
* **Quản lý cấu hình hệ thống:** Chỉnh sửa, cập nhật các thiết lập cấu hình chung (SystemSetting).

### Biểu đồ Use Case

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ Use Case tổng quan"

skinparam usecase {
BackgroundColor BUSINESS
}

left to right direction

actor Guest
actor User
actor Admin

Guest <|-- User
User <|-- Admin

rectangle "Hệ thống Trend-Tracking" {
    together {
        rectangle "Chức năng Guest" as A {
            usecase "Tìm kiếm bài báo" as SearchPaper
            usecase "Xem chi tiết bài báo" as ViewPaper
            usecase "Xem xu hướng" as ViewTrends
            usecase "Đăng nhập" as Login
            usecase "Đăng ký" as Register
        }

        rectangle "Chức năng User" as B {
            usecase "Quản lý Bookmark" as ManageBookmarks
            usecase "Quản lý Báo cáo (Report)" as ManageReports
            usecase "Quản lý tài khoản" as ManageAccount
        }
    }

    rectangle "Chức năng Admin" as C {
        usecase "Quản lý người dùng" as ManageUsers
        usecase "Quản lý dữ liệu CSDL" as ManageData
        usecase "Kích hoạt Scraping" as TriggerScraping
        usecase "Quản lý cấu hình (SystemSetting)" as ManageSettings
    }
}

Guest -- SearchPaper
Guest -- ViewPaper
Guest -- ViewTrends
Guest -- Login
Guest -- Register

User -- ManageBookmarks
User -- ManageReports
User -- ManageAccount

Admin -u- ManageUsers
Admin -u- ManageData
Admin -u- TriggerScraping
Admin -u- ManageSettings

@enduml

```

</details>

![Biểu đồ Use Case tổng quan.svg](docs/diagrams/Bieu_do_Use_Case_tong_quan.png)

### Biểu đồ Use Case chi tiết

#### Chức năng Guest

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ Use Case chức năng Guest"
left to right direction
actor Guest

rectangle "Hệ thống" {
    usecase "Tìm kiếm bài báo" as SearchPaper
    usecase "Xem chi tiết bài báo" as ViewPaper
    usecase "Xem biểu đồ xu hướng" as ViewTrends
    usecase "Đăng nhập" as Login
    usecase "Đăng ký tài khoản" as Register
}

Guest -- SearchPaper
Guest -- ViewPaper
Guest -- ViewTrends
Guest -- Login
Guest -- Register
@enduml
```

</details>

![Biểu đồ Use Case chức năng Guest.svg](docs/diagrams/Bieu_do_Use_Case_chuc_nang_Guest.png)

#### Chức năng User

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ Use Case chức năng User"
left to right direction
actor User

rectangle "Hệ thống" {
    usecase "Quản lý Bookmark" as ManageBookmarks
    usecase "Thêm Bookmark" as AddBookmark
    usecase "Xóa Bookmark" as RemoveBookmark
    
    usecase "Quản lý Báo cáo" as ManageReports
    usecase "Tạo báo cáo mới" as CreateReport
    
    usecase "Quản lý tài khoản" as ManageAccount
    usecase "Đổi mật khẩu" as ChangePassword
}

User -- ManageBookmarks
ManageBookmarks <.. AddBookmark : <<extend>>
ManageBookmarks <.. RemoveBookmark : <<extend>>

User -- ManageReports
ManageReports <.. CreateReport : <<extend>>

User -- ManageAccount
ManageAccount <.. ChangePassword : <<extend>>
@enduml
```

</details>

![Biểu đồ Use Case chức năng User.svg](docs/diagrams/Bieu_do_Use_Case_chuc_nang_User.png)

#### Chức năng Admin

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ Use Case chức năng Admin"
left to right direction
actor Admin

rectangle "Hệ thống" {
    usecase "Quản lý người dùng" as ManageUsers
    usecase "Cấp quyền/Vai trò" as AssignRole
    
    usecase "Quản lý dữ liệu hệ thống" as ManageData
    
    usecase "Quản lý Scraping (Thu thập)" as TriggerScraping
    
    usecase "Quản lý Cấu hình" as ManageSettings
}

Admin -- ManageUsers
ManageUsers <.. AssignRole : <<extend>>
Admin -- ManageData
Admin -- TriggerScraping
Admin -- ManageSettings
@enduml
```

</details>

![Biểu đồ Use Case chức năng Admin.svg](docs/diagrams/Bieu_do_Use_Case_chuc_nang_Admin.png)

### Quy trình hoạt động

#### Quy trình thu thập dữ liệu (Scraping)

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Quy trình thu thập dữ liệu"
skinparam activity {
    BackgroundColor LightYellow
}

|Admin|
start
:Nhấn nút "Chạy Scraping";
|#palegreen|Hệ thống (Backend)|
:Gọi REST API tới nguồn (ví dụ: arXiv);
if (Có dữ liệu trả về?) then (Có)
    :Phân tích dữ liệu JSON/XML;
    :Trích xuất metadata (Tiêu đề, Tác giả, Từ khóa);
    :Thực thi Transaction lưu vào Database;
    :Cập nhật trạng thái Job thành công;
else (Không / Lỗi)
    :Ghi nhận Log lỗi hệ thống;
endif
|Admin|
:Nhận thông báo trạng thái thu thập;
stop
@enduml
```

</details>

![Quy trình thu thập dữ liệu.svg](docs/diagrams/Quy_trinh_thu_thap_du_lieu.png)

### Luồng xử lý

#### Luồng xử lý tạo Báo cáo (Report)

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ trình tự tạo Báo cáo"
actor "User" as user
participant "Giao diện (React)" as ui
participant "API (Express)" as system
database "PostgreSQL" as db

user -> ui: 1. Click "Lưu Báo cáo" trên Dashboard
activate ui
ui -> system: 2. Gửi request lấy dữ liệu phân tích (chart data)
activate system
system -> db: 3. Query dữ liệu thống kê bài báo
activate db
db --> system: 4. Trả về Dataset
deactivate db
system --> ui: 5. Trả về dữ liệu JSON
deactivate system

user -> ui: 6. Nhập Tiêu đề và Nội dung báo cáo
ui -> system: 7. Gửi thông tin (POST /api/reports)
activate system
system -> db: 8. Insert dữ liệu vào bảng Report
activate db
db --> system: 9. Xác nhận Record Created
deactivate db
system --> ui: 10. Trả HTTP 201 Created
deactivate system
ui --> user: 11. Hiển thị thông báo Toast "Lưu thành công"
deactivate ui
@enduml
```

</details>

![Biểu đồ trình tự tạo Báo cáo.svg](docs/diagrams/Bieu_do_trinh_tu_tao_Bao_cao.png)

### Luồng dữ liệu

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "DFD cấp 2 - Hệ thống Trend-Tracking"

!define PROCESS circle
!define EXTERNAL_ENTITY rectangle
!define DATA_STORE database

EXTERNAL_ENTITY "Guest" as guest
EXTERNAL_ENTITY "User" as user 
EXTERNAL_ENTITY "Admin" as admin
EXTERNAL_ENTITY "External API (arXiv/OpenAlex)" as external_api

PROCESS "1.0\nQuản lý\nTài khoản" as acc_mgmt
PROCESS "2.0\nTìm kiếm &\nPhân tích Xu hướng" as search_mgmt  
PROCESS "3.0\nQuản lý\nBookmark & Báo cáo" as user_data_mgmt
PROCESS "4.0\nThu thập\nDữ liệu (Scraping)" as scraping_mgmt

DATA_STORE "D1 Users" as users
DATA_STORE "D2 Papers, Authors\nJournals, Keywords" as papers
DATA_STORE "D3 Bookmarks, Reports" as user_data
DATA_STORE "D4 SystemSettings" as settings

guest --> acc_mgmt : Request Đăng ký/Đăng nhập
guest --> search_mgmt : Query Tìm kiếm/Xem biểu đồ

user --> user_data_mgmt : Yêu cầu Thêm Bookmark/Lưu Báo cáo
user --> acc_mgmt : Cập nhật thông tin hồ sơ

admin --> acc_mgmt : Quản lý User (Cấp quyền)
admin --> scraping_mgmt : Kích hoạt Job Scraping

scraping_mgmt <-- external_api : Nhận Response (Metadata bài báo)
scraping_mgmt --> papers : Cập nhật dữ liệu mới (Insert/Update)

search_mgmt <--> papers : Đọc dữ liệu bài báo/thống kê
user_data_mgmt <--> user_data : Đọc/Ghi Bookmark/Báo cáo
user_data_mgmt --> papers : Liên kết ID bài báo (FK)
acc_mgmt <--> users : Đọc/Ghi User
@enduml
```

</details>

![DFD cấp 2 - Hệ thống Trend-Tracking.svg](docs/diagrams/DFD_cap_2_He_thong_Trend_Tracking.png)

### 3.3. Các trạng thái thực thể trong hệ thống

Phần này mô tả các vòng đời và sự chuyển đổi trạng thái (State Machine Diagram) của các thực thể quan trọng trong hệ thống.

#### 1. Trạng thái Tài khoản Người dùng (User Account)

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ trạng thái - User"
[*] --> ChoXacNhan : Đăng ký mới

ChoXacNhan --> DangHoatDong : Xác nhận Email thành công
ChoXacNhan --> [*] : Hết hạn xác nhận (Hệ thống xóa)

DangHoatDong --> BiKhoa : Vi phạm chính sách (Admin khóa)
BiKhoa --> DangHoatDong : Admin mở khóa

DangHoatDong --> [*] : Yêu cầu xóa tài khoản
BiKhoa --> [*] : Admin xóa tài khoản
@enduml
```

</details>

![Biểu đồ trạng thái - User.svg](docs/diagrams/Bieu_do_trang_thai_User.png)

#### 2. Trạng thái Tiến trình Thu thập dữ liệu (Scraping Job)

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ trạng thái - Scraping Job"
[*] --> ChoXuLy : Admin tạo Job / Hẹn giờ kích hoạt

ChoXuLy --> DangChay : Bắt đầu tiến trình (Worker nhận Job)
ChoXuLy --> DaHuy : Admin hủy Job trước khi chạy

DangChay --> TamDung : Lỗi mạng tạm thời / Rate Limit
TamDung --> DangChay : Thử lại thành công (Retry)

DangChay --> ThanhCong : Hoàn thành thu thập & Lưu DB
DangChay --> ThatBai : Lỗi nghiêm trọng / Hết số lần thử
DangChay --> DaHuy : Admin can thiệp dừng

ThanhCong --> [*]
ThatBai --> [*]
DaHuy --> [*]
@enduml
```

</details>

![Biểu đồ trạng thái - Scraping Job.svg](docs/diagrams/Bieu_do_trang_thai_Scraping_Job.png)
