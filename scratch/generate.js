const plantumlEncoder = require('plantuml-encoder');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const diagrams = [
  {
    name: 'Bieu_do_trang_thai_User',
    code: `@startuml "Biểu đồ trạng thái - User"\n[*] --> ChoXacNhan : Đăng ký mới\nChoXacNhan --> DangHoatDong : Xác nhận Email thành công\nChoXacNhan --> [*] : Hết hạn xác nhận (Hệ thống xóa)\nDangHoatDong --> BiKhoa : Vi phạm chính sách (Admin khóa)\nBiKhoa --> DangHoatDong : Admin mở khóa\nDangHoatDong --> [*] : Yêu cầu xóa tài khoản\nBiKhoa --> [*] : Admin xóa tài khoản\n@enduml`
  },
  {
    name: 'Bieu_do_trang_thai_Scraping_Job',
    code: `@startuml "Biểu đồ trạng thái - Scraping Job"\n[*] --> ChoXuLy : Admin tạo Job / Hẹn giờ kích hoạt\nChoXuLy --> DangChay : Bắt đầu tiến trình (Worker nhận Job)\nChoXuLy --> DaHuy : Admin hủy Job trước khi chạy\nDangChay --> TamDung : Lỗi mạng tạm thời / Rate Limit\nTamDung --> DangChay : Thử lại thành công (Retry)\nDangChay --> ThanhCong : Hoàn thành thu thập & Lưu DB\nDangChay --> ThatBai : Lỗi nghiêm trọng / Hết số lần thử\nDangChay --> DaHuy : Admin can thiệp dừng\nThanhCong --> [*]\nThatBai --> [*]\nDaHuy --> [*]\n@enduml`
  }
];

async function generate() {
  for (const d of diagrams) {
    const encoded = plantumlEncoder.encode(d.code);
    const pngUrl = `http://www.plantuml.com/plantuml/png/${encoded}`;
    const svgUrl = `http://www.plantuml.com/plantuml/svg/${encoded}`;
    
    // Download PNG
    const pngRes = await axios.get(pngUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(path.join(__dirname, '../docs/diagrams', `${d.name}.png`), pngRes.data);
    
    // Download SVG
    const svgRes = await axios.get(svgUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(path.join(__dirname, '../docs/diagrams', `${d.name}.svg`), svgRes.data);
    
    console.log(`Generated ${d.name}`);
  }
}

generate().catch(console.error);
