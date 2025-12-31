# Hướng dẫn cấu hình Firebase Authentication

## Firebase ID Token là gì?

Firebase ID Token là một token JWT được Firebase Authentication tạo ra sau khi người dùng xác minh số điện thoại thành công. Backend sử dụng token này để:
1. Xác minh số điện thoại đã được Firebase verify
2. Lấy thông tin số điện thoại từ token
3. Tạo tài khoản mới với số điện thoại đã xác minh

## Cách lấy Firebase ID Token

### Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **Project Settings** > **General** > **Your apps**
4. Thêm Web app (nếu chưa có)
5. Copy các thông tin cấu hình:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### Bước 2: Cấu hình Firebase trong Frontend

1. Tạo file `.env` trong thư mục `Frontend/Food-Delivery/` (copy từ `.env.example`)
2. Điền các thông tin Firebase vào file `.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Bước 3: Bật Phone Authentication trong Firebase

1. Vào Firebase Console > **Authentication** > **Sign-in method**
2. Bật **Phone** provider
3. Cấu hình reCAPTCHA (Firebase sẽ tự động xử lý)

### Bước 4: Cài đặt dependencies

```bash
cd Frontend/Food-Delivery
npm install
```

### Bước 5: Sử dụng trong ứng dụng

Form đăng ký đã được tích hợp sẵn Firebase Phone Authentication với 3 bước:

1. **Nhập số điện thoại**: Người dùng nhập số điện thoại
2. **Xác minh OTP**: Firebase gửi mã OTP, người dùng nhập mã để xác minh
3. **Hoàn tất đăng ký**: Sau khi xác minh thành công, Firebase ID Token được lấy tự động và gửi lên backend

## Luồng hoạt động

```
User nhập số điện thoại
    ↓
Firebase gửi OTP
    ↓
User nhập mã OTP
    ↓
Firebase xác minh OTP thành công
    ↓
Lấy Firebase ID Token
    ↓
Gửi ID Token + username + password lên backend
    ↓
Backend verify ID Token và tạo tài khoản
```

## Sử dụng Firebase Emulator (Development)

Nếu muốn test với Firebase Emulator:

1. Cài đặt Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Khởi động emulator:
```bash
firebase emulators:start --only auth
```

3. Cấu hình trong `.env`:
```env
VITE_USE_FIREBASE_EMULATOR=true
VITE_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
```

4. Đảm bảo backend cũng kết nối với emulator (xem `Backend/src/config/firebaseConfig.js`)

## Troubleshooting

### Lỗi: "reCAPTCHA not loaded"
- Đảm bảo đã cấu hình đúng Firebase config
- Kiểm tra console browser để xem lỗi chi tiết
- Thử reload trang

### Lỗi: "Phone number format invalid"
- Số điện thoại phải có format: `0912345678` hoặc `+84912345678`
- Hook sẽ tự động format thành `+84912345678`

### Lỗi: "OTP expired"
- Mã OTP có thời hạn (thường là vài phút)
- Yêu cầu gửi lại mã OTP

## Tài liệu tham khảo

- [Firebase Phone Authentication](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Admin SDK - Verify ID Token](https://firebase.google.com/docs/auth/admin/verify-id-tokens)

