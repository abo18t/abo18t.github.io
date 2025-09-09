# 🚀 Hướng dẫn Deploy Ứng dụng Phỏng vấn

## 📋 Checklist trước khi deploy

### ✅ Kiểm tra file cần thiết
- [ ] `interview-app.html` - File HTML chính
- [ ] `styles.css` - CSS styling
- [ ] `app.js` - Logic ứng dụng
- [ ] `questions.js` - Xử lý dữ liệu câu hỏi
- [ ] `data/Interview_Questions_Refined.json` - Dữ liệu câu hỏi
- [ ] `README.md` - Hướng dẫn sử dụng

### ✅ Kiểm tra tính năng
- [ ] Start panel hoạt động (nhập tên, chọn số câu)
- [ ] Session management (lưu/resume)
- [ ] Navigation (trước/sau câu hỏi)
- [ ] Scoring system (0-3 điểm)
- [ ] Results panel hiển thị đúng
- [ ] Export JSON/PDF hoạt động
- [ ] Responsive design trên mobile

### ✅ Kiểm tra lỗi
- [ ] Không có lỗi JavaScript console
- [ ] Không có lỗi CSS
- [ ] Dữ liệu JSON load thành công
- [ ] localStorage hoạt động

## 🌐 Các phương thức Deploy

### 1. GitHub Pages (Miễn phí)
```bash
# 1. Tạo repository trên GitHub
# 2. Upload tất cả file vào repository
# 3. Vào Settings > Pages
# 4. Chọn Source: Deploy from a branch
# 5. Chọn branch: main
# 6. Save
# 7. Truy cập: https://username.github.io/repository-name
```

### 2. Netlify (Miễn phí)
```bash
# 1. Truy cập netlify.com
# 2. Drag & drop thư mục chứa file
# 3. Hoặc connect với GitHub repository
# 4. Deploy tự động
# 5. Truy cập URL được cung cấp
```

### 3. Vercel (Miễn phí)
```bash
# 1. Truy cập vercel.com
# 2. Import project từ GitHub
# 3. Deploy tự động
# 4. Truy cập URL được cung cấp
```

### 4. Local Server (Development)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## 🔧 Cấu hình Production

### 1. Tối ưu hóa
- **Minify CSS/JS**: Sử dụng tools như UglifyJS, CSS Minifier
- **Compress images**: Nếu có hình ảnh
- **Enable gzip**: Trên server

### 2. Security
- **HTTPS**: Đảm bảo sử dụng HTTPS
- **CORS**: Cấu hình CORS nếu cần
- **Content Security Policy**: Thêm CSP headers

### 3. Performance
- **CDN**: Sử dụng CDN cho static files
- **Caching**: Cấu hình cache headers
- **Compression**: Enable gzip/brotli

## 📱 Testing

### Desktop Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Testing
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive design
- [ ] Touch interactions

### Feature Testing
- [ ] Session management
- [ ] Export functionality
- [ ] Navigation
- [ ] Scoring system
- [ ] Results display

## 🐛 Troubleshooting

### Lỗi thường gặp

#### 1. "Cannot load JSON file"
```javascript
// Kiểm tra đường dẫn file
const response = await fetch('data/Interview_Questions_Refined.json');
// Đảm bảo file tồn tại và có quyền đọc
```

#### 2. "localStorage not working"
```javascript
// Kiểm tra browser support
if (typeof(Storage) !== "undefined") {
    // localStorage supported
} else {
    // localStorage not supported
}
```

#### 3. "Export not working"
```javascript
// Kiểm tra browser support cho download
const link = document.createElement('a');
link.download = 'filename.json';
// Một số browser có thể block download
```

### Debug Tips
1. **Console Logs**: Thêm console.log để debug
2. **Network Tab**: Kiểm tra requests trong DevTools
3. **Application Tab**: Kiểm tra localStorage trong DevTools
4. **Mobile Testing**: Sử dụng DevTools mobile emulation

## 📊 Monitoring

### Analytics (Optional)
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking (Optional)
```javascript
// Sentry hoặc tương tự
window.addEventListener('error', function(e) {
    // Log error to service
});
```

## 🔄 Updates

### Cập nhật câu hỏi
1. Chỉnh sửa `data/Interview_Questions_Refined.json`
2. Commit và push lên repository
3. Deploy tự động (nếu dùng GitHub Pages/Netlify/Vercel)

### Cập nhật code
1. Chỉnh sửa file HTML/CSS/JS
2. Test locally
3. Commit và push
4. Deploy

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console errors
2. Kiểm tra network requests
3. Test trên browser khác
4. Kiểm tra file permissions
5. Xem README.md để biết thêm chi tiết

---

**Lưu ý**: Ứng dụng cần chạy trên web server, không thể mở trực tiếp file HTML.
