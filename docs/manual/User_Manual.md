# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG THEO DÕI XU HƯỚNG CÔNG BỞ KHOA HỌC

## Giới thiệu

Hệ thống Theo dõi Xu hướng Công bố Khoa học là một nền tảng hiện đại giúp nhà nghiên cứu, sinh viên và các chuyên gia tìm kiếm, phân tích và theo dõi xu hướng phát hành các bài báo khoa học. Hệ thống tích hợp dữ liệu từ nguồn arXiv và cung cấp các công cụ trực quan để phân tích xu hướng theo thời gian, lĩnh vực và tác giả.

Hệ thống bao gồm:
- Tìm kiếm và lọc bài báo khoa học
- Xem và phân tích biểu đồ xu hướng
- Lưu trữ và quản lý bài báo yêu thích
- Quản lý tài khoản cá nhân

## Yêu cầu hệ thống

Để sử dụng hệ thống, bạn cần:
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge phiên bản mới nhất)
- Kết nối internet
- Tài khoản người dùng (đăng ký miễn phí)

## Truy cập hệ thống

Hệ thống có thể truy cập qua địa chỉ: `http://localhost:5173` khi chạy ở môi trường phát triển local
hoặc địa chỉ triển khai cụ thể được cung cấp bởi quản trị hệ thống.

## Đăng ký tài khoản

### Bước 1: Truy cập trang đăng ký
- Truy cập vào `http://localhost:5173/register` hoặc nhấn nút "Đăng ký" trên trang chủ

### Bước 2: Điền thông tin
- Nhập địa chỉ email hợp lệ
- Nhập mật khẩu (tối thiểu 8 ký tự)
- Nhập lại mật khẩu để xác nhận
- Nhập họ và tên đầy đủ

### Bước 3: Hoàn thành đăng ký
- Nhấn nút "Đăng ký"
- Kiểm tra email để xác thực tài khoản (nếu có)
- Đăng nhập vào hệ thống

## Đăng nhập

### Bước 1: Truy cập trang đăng nhập
- Truy cập vào `http://localhost:5173/login` hoặc nhấn nút "Đăng nhập" trên trang chủ

### Bước 2: Điền thông tin đăng nhập
- Nhập địa chỉ email đã đăng ký
- Nhập mật khẩu
- (Tùy chọn) Đánh dấu "Ghi nhớ tôi" để duy trì phiên đăng nhập

### Bước 3: Truy cập hệ thống
- Nhấn nút "Đăng nhập"
- Nếu thông tin chính xác, bạn sẽ được chuyển hướng tới trang chủ

## Quên mật khẩu

Nếu quên mật khẩu:
1. Nhấn liên kết "Quên mật khẩu?" trên trang đăng nhập
2. Nhập địa chỉ email đã đăng ký
3. Kiểm tra email để nhận liên kết đặt lại mật khẩu
4. Theo dõi hướng dẫn trong email để đặt lại mật khẩu

## Giao diện người dùng

Sau khi đăng nhập, giao diện bao gồm:

### Thanh điều hướng trên cùng (Navbar)
- Logo hệ thống
- Menu đơn giản (trên thiết bị di động)
- Avatar người dùng với menu dropdown chứa:
  - Hồ sơ cá nhân
  - Cài đặt
  - Đăng xuất

### Thanh điều hướng bên (Sidebar)
- Trang chủ
- Tìm kiếm bài báo
- Xu hướng & Biểu đồ
- Bài báo đã lưu
- Quản trị (chỉ dành cho admin)

### Khu vực nội dung chính
Hiển thị nội dung của trang hiện tại

## Tìm kiếm bài báo

### Truy cập tính năng tìm kiếm
- Nhấn vào "Tìm kiếm bài báo" trên thanh điều hướng bên
- Hoặc truy cập trực tiếp `http://localhost:5173/search`

### Thực hiện tìm kiếm cơ bản
1. Nhập từ khóa tìm kiếm vào ô tìm kiếm (ví dụ: "machine learning", "neural networks")
2. Nhấn Enter hoặc nhấn nút "Tìm kiếm"
3. Hệ thống sẽ hiển thị danh sách kết quả phù hợp

### Lọc kết quả tìm kiếm
Sau khi có kết quả tìm kiếm, bạn có thể lọc theo:
- **Khoảng thời gian**: Chọn ngày bắt đầu và kết thúc
- **Lĩnh vực**: Chọn một hoặc nhiều chủ đề từ danh sách
- **Loại bài báo**: Lọc theo các loại specific (nếu có)
- **Sắp xếp**: Sắp xếp theo liên quan, ngày mới nhất, hoặc số lượng trích dẫn

### Xem chi tiết bài báo
- Nhấn vào tiêu đề bài báo trong kết quả tìm kiếm
- Hệ thống sẽ hiển thị trang chi tiết với:
  - Tiêu đề, tác giả, ngày đăng
  - Tóm tắt (abstract)
  - Liên kết tới nguồn gốc
  - Các từ khóa
  - Nút "Lưu bài báo" để thêm vào danh sách yêu thích

## Xu hướng & Biểu đồ

### Truy cập trang xu hướng
- Nhấn vào "Xu hướng & Biểu đồ" trên thanh điều hướng bên
- Hoặc truy cập trực tiếp `http://localhost:5173/trends`

### Các loại biểu đồ có sẵn
Hệ thống cung cấp nhiều loại biểu đồ để phân tích xu hướng:

#### Biểu đồ xu hướng theo thời gian
- Hiển thị số lượng bài báo theo thời gian (theo tháng/quý/năm)
- Cho phép chọn khoảng thời gian cụ thể
- Hỗ trợ so sánh nhiều từ khóa hoặc lĩnh vực

#### Biểu đồ phân phối theo lĩnh vực
- Hiển thị tỷ lệ phần trăm bài báo theo các lĩnh vực khác nhau
- Biểu đồ tròn hoặc biểu đồ cột
- Cho phép xem chi tiết từng lĩnh vực

#### Biểu đồ top tác giả/cơ quan
- Xếp hạng các tác giả hoặc cơ quan có số lượng bài báo cao nhất
- Hiển thị theo thời gian tùy chọn

### Tương tác với biểu đồ
- Di chuột qua biểu đồ để xem giá trị cụ thể
- Nhấn vào legend để ẩn/hiện các série dữ liệu
- Tải xuống biểu đồ dưới dạng PNG hoặc SVG
- Chia sẻ liên kết tới view biểu đồ hiện tại

## Quản lý bài báo đã lưu

### Truy cập trang bài báo đã lưu
- Nhấn vào "Bài báo đã lưu" trên thanh điều hướng bên
- Hoặc truy cập trực tiếp `http://localhost:5173/saved`

### Lưu bài báo
Khi xem kết quả tìm kiếm hoặc chi tiết bài báo:
- Nhấn nút "Lưu bài báo" ( biểu tượng bookmark)
- Bài báo sẽ được thêm vào danh sách yêu thích của bạn
- Biểu tượng sẽ đổi màu để indicar đã lưu

### Xem danh sách đã lưu
Trang "Bài báo đã lưu" hiển thị:
- Danh sách tất cả bài báo bạn đã lưu
- Thông tin cơ bản về mỗi bài báo (tiêu đề, tác giả, ngày)
- Ngày bạn lưu bài báo
- Nút "Xóa" để bỏ bài báo khỏi danh sách

### Tìm kiếm trong bài báo đã lưu
- Sử dụng ô tìm kiếm ở đầu trang để lọc bài báo đã lưu
- Tìm kiếm theo tiêu đề, tác giả hoặc từ khóa trong tóm tắt

### Sắp xếp bài báo đã lưu
- Sắp xếp theo ngày lưu (mới nhất/cũ nhất)
- Sắp xếp theo tiêu đề (A-Z/Z-A)
- Sắp xếp theo tác giả

## Hồ sơ cá nhân

### Truy cập trang hồ sơ
- Nhấn vào avatar của bạn trên thanh navigation trên cùng
- Chọn "Hồ sơ cá nhân"
- Hoặc truy cập trực tiếp `http://localhost:5173/profile`

### Thông tin cá nhân
Trang hồ sơ hiển thị và cho phép chỉnh sửa:
- Họ và tên
- Địa chỉ email (không thể thay đổi)
- Ngày tham gia
- Thống kê sử dụng:
  - Số lượng bài báo đã tìm kiếm
  - Số lượng bài báo đã lưu
  - Số lần xem biểu đồ

### Chỉnh sửa hồ sơ
1. Nhấn nút "Chỉnh sửa hồ sơ"
2. Thay đổi họ và tên
3. (Tùy chọn) Thay đổi mật khẩu
4. Nhấn "Lưu thay đổi" để cập nhật

### Cài đặt
Trong phần cài đặt của hồ sơ, bạn có thể:
- Thay đổi chủ đề giao diện (sáng/tối)
- Đặt tùy chọn thông báo
- Cài đặt mặc định cho tìm kiếm (khoảng thời gian, sắp xếp)
- Quản lý kết nối mạng xã hội (nếu có)

## Đăng xuất

Để đăng xuất khỏi hệ thống:
1. Nhấn vào avatar của bạn trên thanh navigation trên cùng
2. Chọn "Đăng xuất" từ menu dropdown
3. Bạn sẽ được chuyển hướng tới trang đăng nhập

## Mẹo sử dụng hiệu quả

### Tìm kiếm hiệu quả
- Sử dụng dấu ngoặc kép để tìm kiếm cụm từExact: `"deep learning"`
- Sử dụng dấu trừ để loại trừ từ: `machine learning -deep`
- Kết hợp từ khóa với toán tử AND/OR: `AI AND healthcare`

### Phân tích xu hướng
- So sánh nhiều lĩnh vực cùng một lúc để thấy sự thay đổi 상대적
- Xem xu hướng theo năm để phát hiện các chu kỳComent
- Lưu các view biểu đồ bạn thường xuyên sử dụng

### Quản lý thư viện cá nhân
- Định kỳ xem lại bài báo đã lưu để loại bỏ quelli không còn liên quan
- Sử dụng tìm kiếm trong bài báo đã lưu để truy xuất nhanh
- Sao lưu định kỳ bằng việc xuất danh sách (nếu có tính năng này)

## Khắc phục sự cố phổ biến

### Vấn đề đăng nhập
- **Sai mật khẩu**: Nhấn "Quên mật khẩu?" để đặt lại
- **Tài khoản chưa xác thực**: Kiểm tra hộp thư đến để xem email xác thực
- **Tài khoản bị khóa**: Liên hệ quản trị hệ thống sau nhiều lần đăng nhập thất bại

### Vấn đề hiển thị
- **Trang không tải đúng**: Làm mới trang (Ctrl+F5 hoặc Cmd+Shift+R)
- **Giao diện lỗi**: Xóa cache và cookie của trình duyệt
- **Chức năng không phản hồi**: Kiểm tra kết nối internet và thử lại sau vài giây

### Vấn đề tìm kiếm
- **Không có kết quả**: Thử từ khóa chung hơn hoặc kiểm tra chính tả
- **Kết quả không liên quan**: Sử dụng bộ lọc để giảm nh olduğng external links
- **Tìm kiếm chậm**: Hạn chế số lượng bộ lọc hoạt động cùng lúc

### Vấn đề lưu trữ
- **Không thể lưu bài báo**: Đảm bảo bạn đã đăng nhập
- **Bài báo mất**: Kiểm tra lại bộ lọc trên trang "Bài báo đã lưu"
- **Không thể xóa**: Làm mới trang và thử lại

## Liên hệ hỗ trợ

Nếu gặp vấn đề không thể giải quyết qua hướng dẫn trên, vui lòng liên hệ:
- Email hỗ trợ: support@trendtracking.example.com
- Trang trợ giúp: `http://localhost:5173/help`
- Diễn đàn cộng đồng: `http://localhost:5173/forum`

## Cập nhật tài liệu

Tài liệu hướng dẫn sử dụng sẽ được cập nhật định kỳ để phản ánh các tính năng mới và cải tiến. Vui lòng kiểm tra phiên bản mới nhất tại:
- Trang chính: `http://localhost:5173`
- Footer của ứng dụng: Thông tin phiên bản và ngày cập nhật

---

*Phiên bản tài liệu: 1.0*
*Ngày cập nhật: 2026-07-03*
*© 2026 Hệ thống Theo dõi Xu hướng Công bố Khoa học. Bảo lưu mọi quyền.*