# 🎮 Ứng dụng Phỏng vấn Junior Game Developer

Ứng dụng web để phỏng vấn trực tiếp ứng viên Junior Game Developer sử dụng Cocos Creator, với hệ thống chấm điểm tự động và thống kê kết quả. Sử dụng bộ câu hỏi đã được tinh chỉnh và cải thiện.

## ✨ Tính năng

- **Linh hoạt số câu hỏi**: Chọn 5/10/15 câu hỏi tùy theo thời gian
- **Session Management**: Lưu và tiếp tục phỏng vấn với localStorage
- **Random câu hỏi**: Tự động chọn câu hỏi ngẫu nhiên từ bộ câu hỏi có sẵn
- **Navigation**: Điều hướng qua lại giữa các câu hỏi
- **Hệ thống chấm điểm**: Chấm điểm từ 0-3 cho mỗi câu hỏi theo rubric chuẩn
- **Thống kê kết quả**: Phân tích điểm mạnh, điểm cần cải thiện
- **Đánh giá tổng thể**: Đưa ra khuyến nghị pass/fail dựa trên tiêu chí
- **Export đa dạng**: Xuất JSON và PDF kết quả phỏng vấn
- **Responsive Design**: Tối ưu cho desktop và mobile

## 🚀 Cách sử dụng

### 1. Chuẩn bị
- Đảm bảo file `data/Interview_Questions_Refined.json` có sẵn trong thư mục `data/`
- Mở file `interview-app.html` trong trình duyệt web

### 2. Bắt đầu phỏng vấn
- **Nhập tên ứng viên** và chọn số câu hỏi (5/10/15)
- **Chọn loại câu hỏi**: Core Set (cơ bản) hoặc Full Set (bao gồm nâng cao)
- **Bắt đầu mới** hoặc **tiếp tục** phỏng vấn đã lưu
- Đọc câu hỏi và đánh giá câu trả lời của ứng viên
- **Điều hướng**: Sử dụng nút "Câu trước" và "Tiếp theo"
- Chọn điểm từ 0-3 dựa trên rubric:
  - **0 điểm**: Sai / Không chạm ý chính
  - **1 điểm**: Đúng 1 phần nhỏ, thiếu cấu trúc
  - **2 điểm**: Đủ ý cốt lõi cấp Junior
  - **3 điểm**: Đầy đủ + best practice / cảnh báo / ví dụ

### 3. Kết thúc và xem kết quả
- Nhấn "🏁 Kết thúc" (có confirm dialog)
- Xem thống kê điểm số theo nhóm (Engine, Programming, Performance, Feature)
- Đọc đánh giá tổng thể và khuyến nghị
- **Export kết quả**: JSON hoặc PDF

## 📁 Cấu trúc file

```
├── interview-app.html    # File HTML chính
├── styles.css           # CSS styling
├── app.js              # Logic ứng dụng chính
├── questions.js        # Xử lý dữ liệu câu hỏi
├── data/
│   └── Interview_Questions_Refined.json   # Dữ liệu câu hỏi đã tinh chỉnh
└── README.md          # Hướng dẫn sử dụng
```

## 🎯 Tiêu chí đánh giá

### Quy tắc Pass (Cấu trúc mới)
- **Tổng điểm**: ≥ 67% số câu hỏi
- **Engine + Programming**: ≥ 40% tổng điểm
- **Engine**: Trung bình ≥ 2.0 điểm
- **Programming**: Trung bình ≥ 2.0 điểm

### Quy tắc Strong Pass
- **Tổng điểm**: ≥ 80% số câu hỏi và đạt tất cả tiêu chí pass

## 🔧 Tùy chỉnh

### Thay đổi số câu hỏi mặc định
Trong file `app.js`, dòng 12:
```javascript
this.questionCount = 10; // Thay đổi số câu hỏi mặc định
```

### Thay đổi bộ câu hỏi mặc định
Trong file `app.js`, dòng 11:
```javascript
this.interviewType = 'core'; // 'core' hoặc 'full'
```

### Session Management
- **Tự động lưu**: Session được lưu vào localStorage sau mỗi câu hỏi
- **Resume**: Có thể tiếp tục phỏng vấn đã lưu
- **Unique names**: Tên trùng sẽ được thêm timestamp

### Cập nhật câu hỏi
Chỉnh sửa file `data/Interview_Questions_Refined.json` theo cấu trúc có sẵn. Ứng dụng sẽ tự động tải dữ liệu mới.

## 📊 Phân loại câu hỏi

### Core Set (Câu hỏi cơ bản)
- **Engine**: Prefab, Lifecycle, UI optimization, Audio, Spine, Physics
- **Programming**: Closure, Promise, TypeScript, Prototype, Event loop, Generic types
- **Performance**: Draw calls, Memory leaks, FPS analysis, Pooling
- **Feature**: Browser compatibility, Input handling, Resource loading
- **Soft Skills**: Task management, Bug handling, Planning

### Bonus Set (Câu hỏi nâng cao)
- **Advanced Programming**: ES Modules, Tree-shaking, Advanced TypeScript
- **Advanced Features**: Resource loading strategies, Performance optimization

## 🎨 Giao diện

- **Responsive design**: Hoạt động tốt trên desktop và mobile
- **Modern UI**: Gradient background, card-based layout
- **Progress tracking**: Thanh tiến độ hiển thị số câu đã làm
- **Navigation**: Nút điều hướng trước/sau và quay về màn hình chính
- **Color coding**: Màu sắc phân biệt các nhóm câu hỏi
- **Mobile optimized**: Layout tối ưu cho điện thoại

## 🔄 Cập nhật dữ liệu

Để cập nhật câu hỏi mới:
1. Chỉnh sửa file `data/Interview_Questions_Refined.json`
2. Refresh trang web
3. Dữ liệu mới sẽ được tải tự động

### Cấu trúc dữ liệu mới
- **modelAnswer**: Đáp án chi tiết với format cải thiện
- **followUps**: Câu hỏi phụ để đào sâu
- **redFlags**: Các dấu hiệu cảnh báo
- **tags**: Thẻ phân loại câu hỏi
- **sets**: Phân chia core/bonus để linh hoạt chọn câu hỏi

## 📝 Lưu ý

- Ứng dụng sử dụng Fetch API để tải dữ liệu JSON
- Cần chạy trên web server (không thể mở trực tiếp file HTML)
- **Session Management**: Sử dụng localStorage để lưu trữ
- **Export**: Hỗ trợ xuất JSON và PDF
- **Confirm Dialog**: Có xác nhận trước khi kết thúc phỏng vấn
- **Unique Names**: Tên ứng viên trùng sẽ được thêm timestamp

## 🐛 Xử lý lỗi

Nếu không tải được file `Interview_Questions_Refined.json`, ứng dụng sẽ sử dụng dữ liệu fallback với 1 câu hỏi mẫu để đảm bảo hoạt động.

## 🆕 Cải tiến mới

### Bộ câu hỏi đã được tinh chỉnh:
- **Loại bỏ** các câu hỏi chuyên sâu về gameplay cụ thể (jackpot, scroll, etc.)
- **Tăng cường** câu hỏi cơ bản về Cocos Creator và lập trình
- **Thêm** câu hỏi về TypeScript, Memory management, Browser compatibility
- **Cải thiện** đáp án với format chi tiết hơn
- **Phân chia** core/bonus set để linh hoạt chọn câu hỏi

### Tính năng mới:
- **Session Management**: Lưu và tiếp tục phỏng vấn
- **Flexible Question Count**: Chọn 5/10/15 câu hỏi
- **Navigation**: Điều hướng qua lại giữa các câu hỏi
- **Export PDF**: Xuất kết quả dưới dạng PDF
- **Confirm Dialog**: Xác nhận trước khi kết thúc
- **Mobile Optimization**: Tối ưu giao diện cho mobile
- **Unique Names**: Tự động thêm timestamp cho tên trùng
