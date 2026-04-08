# 🎯 Kế hoạch Phỏng vấn: Junior Game Developer (Cocos Creator)

**Ứng viên:** Đặng Vũ Quang Minh  
**Mức độ đánh giá:** Junior  
**Thời lượng dự kiến:** 60 phút  

---

## 👤 1. Phân Tích Hồ Sơ Ứng Viên (Từ CV)

*   **Thời gian kinh nghiệm:** ~2.5 năm (Bắt đầu từ Thực tập sinh 07/2022). Làm việc chính thức ở role Game Dev từ 02/2023. Tương đối vững ở mốc Junior, trên đà hướng lên Mid.
*   **Tech Stack Tích Lũy:** Unity, Cocos Creator, PixiJS. Javascript/Typescript, C#, C++.
*   **Điểm mạnh nổi bật:** 
    *   Có kinh nghiệm trực tiếp làm Web based games bằng **Cocos Creator** và **PixiJS** (phù hợp với mảng H5/WebGL).
    *   Liệt kê rất chi tiết kiến thức về Kiến trúc: **OOP, SOLID, State Machines, DI, Observer, Facade...** (Rất ít Junior ghi chi tiết phần này).
    *   Có kinh nghiệm xử lý mạng (RESTful, Client-Server), và fix logic bug, memory leaks, race conditions.

---

## 📋 2. Mục Tiêu Phỏng Vấn (Map với Competency Matrix)

Dựa trên chuẩn **Junior** từ file `Competency Matrix.csv`:
*   **Engine (Cocos):** Thành thạo Scene Editor, Prefab, vòng đời (Lifecycle component) và biết quản lý asset chung (Atlas).
*   **Programming (JS/TS):** Nắm vững Closure, Event/Listener, phân biệt rõ Interface/Type trong TS. Nắm vững SOLID (vượt kỳ vọng Junior).
*   **Performance:** Hiểu cơ chế giảm lag, Draw Calls cơ bản, dùng Object Pooling tránh leak.
*   **Soft Skills:** Xử lý sự cố khi trễ task, ước lượng task cơ bản.

---

## 🛠 3. Bộ Câu Hỏi Được Lựa Chọn & Tùy Biến

Dựa trên CV của ứng viên, bộ câu hỏi được trích xuất từ định dạng chuẩn của Studio nhằm xoáy sâu vào các skill ứng viên tự mô tả.

### Phần 1: Kiến thức nền tảng Engine & Component (15 phút)
*Mục đích: Đảm bảo hiểu chắc nền tảng Cocos Creator trước khi áp dụng pattern cao siêu.*
*   **[A1] Prefab:** Giải thích Prefab là gì trong Cocos Creator và khác việc tạo Node thuần bằng code. Tình huống spawn nhiều item giống nhau chọn cách nào? Vì sao?
*   **[A2] Lifecycle:** Mô tả vai trò onLoad, onEnable, start, update, onDisable, onDestroy. Đặt đăng ký input và hủy timer ở đâu?
*   **[B1] Viết Component:** Tạo component ButtonSound phát âm thanh khi click và cleanup đúng? *(Đánh giá kỹ năng cleanup event mà Junior hay mắc lỗi).*

### Phần 2: Kiến Trúc (Architecture & Patterns) (15 phút)
*Mục đích: Ứng viên nhắc đến SOLID, Observer, State Pattern trong CV ➔ Cần kiểm tra kỹ để tránh tình trạng "name-dropping".*
*   **[B9] Code Smell & Áp dụng SRP:** Nêu một code smell phổ biến (ví dụ dòng God Object / GameManager khổng lồ) và cách refactor. *(Test tư duy SOLID như trong CV)*.
*   **[C5] Observer Pattern:** Mô tả ưu và nhược điểm khi dùng Observer pattern trong event bus mà bạn đã làm ở các dự án trước. Nếu không cẩn thận khi dùng Observer trong Cocos dễ sinh ra lỗi gì? *(Đáp án kỳ vọng: Phải biết cleanup/unsubscribe ở onDisable/onDestroy để chống memory leak)*.
*   **[C7] Single Responsibility Principle (SRP):** Tình huống cho hệ thống ItemDrop (Đánh rơi vật phẩm). Bạn sẽ tách class thế nào? *(Bonus Question nếu trả lời tốt ở câu [B9])*

### Phần 3: Javascript/Typescript Core (10 phút)
*Mục đích: Check base cứng ngôn ngữ.*
*   **[A8] Typescript Core:** Interface, type alias và class trong TypeScript khác nhau thế nào? Khi nào dùng cái nào? *(Ứng viên cần phải code chắc ở dự án lớn)*.
*   **[A6] Closure:** Closure trong JS/TS là gì? Nếu dùng Closure đăng ký sự kiện thì có nguy cơ gì về Memory? 

### Phần 4: Hiệu Năng & Tối Ưu Hóa (Performance) (15 phút)
*Mục đích: Ứng viên ghi trong CV "Improved game stability, rendering, browser performance". Cần "test" độ cứng.*
*   **[A3 / B10] Draw calls & Atlas:** Bạn giảm số request và draw call trong UI Cocos Creator có nhiều hình ảnh con nhỏ như thế nào? *(Đáp án kỳ vọng: Sprite Atlas, Batching)*.
*   **[A4] Pooling:** Cơ chế Object Pooling hoạt động thế nào? Các bước triển khai cho các hiệu ứng (Coin FX) bay ra liên tục? Khi lấy ra và cất đi thì bắt buộc phải làm thao tác gì? *(Reset trạng thái).*
*   **[A11] Memory Leak H5:** Theo kinh nghiệm WebGL bạn từng làm, những nguồn gây Memory Leak phổ biến ở Cocos Web là gì? 

### Phần 5: Soft Skills (Tick-box) (5 phút)
*Mục đích: Tư duy làm việc.*
*   **[A13] Task Tracking:** Bạn đang làm tính năng nhưng phát hiện task sẽ trễ hạn tận 2 ngày. Quy trình xử lý hành động tiếp theo của bạn là gì?

---

## 💡 Góc Ý Kiến Thêm Cho Interviewer
1. **So sánh Engine Frameworks:** Minh đã làm qua Unity, Cocos và Pixi JS. Hãy tận dụng yếu tố này và hỏi một câu mở: *"Theo em, kiến trúc Component-based của Unity có điểm mạnh/nhược gì khi em chuyển sang làm Cocos Creator/PixiJS?"* Đây là câu phân loại năng lực tư duy kỹ thuật rất mạnh.
2. **Focus vào Clean-up:** Vì làm WebGL, Memory Manager cho game rất quan trọng. Cần luôn gài câu hỏi xem bạn ấy có huỷ Event Listener (trong Observer/Component) và Unload Memory đúng quy trình khi Destroy/Hide Node không.
