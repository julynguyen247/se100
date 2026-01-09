# 🔧 TROUBLESHOOTING - Xử lý lỗi Network Error

## ❌ Lỗi: "Network Error" khi đăng ký/đăng nhập

### Nguyên nhân phổ biến:

1. **Backend chưa chạy**
2. **BaseURL chưa được cấu hình**
3. **CORS issue**
4. **Port không đúng**

---

## ✅ CÁCH KHẮC PHỤC

### Bước 1: Kiểm tra Backend đang chạy

Backend phải chạy tại: `http://localhost:5000`

**Kiểm tra:**
```bash
# Mở browser và truy cập:
http://localhost:5000/swagger

# Hoặc test API:
curl http://localhost:5000/api/auth/register
```

**Nếu backend chưa chạy:**
```bash
# Vào thư mục backend
cd C:\Users\lolvl\source\repos\HocKi1_2025\BE_SE100\SE100

# Chạy Docker
docker compose up -d

# Kiểm tra containers
docker compose ps
```

---

### Bước 2: Cấu hình BaseURL

**Tạo file `.env` trong thư mục root của project:**

```bash
# .env
VITE_BACKEND_URL=http://localhost:5000
```

**Lưu ý:**
- File `.env` phải ở cùng cấp với `package.json`
- Sau khi tạo/sửa `.env`, cần **restart dev server**

**Restart dev server:**
```bash
# Dừng server (Ctrl + C)
# Chạy lại
npm run dev
```

---

### Bước 3: Kiểm tra Console Logs

Mở **Browser DevTools** (F12) → Tab **Console**

Khi chạy app, bạn sẽ thấy:
```
🔗 API Base URL: http://localhost:5000
```

Nếu không thấy log này hoặc baseURL sai → Kiểm tra lại `.env`

Khi gọi API register, bạn sẽ thấy:
```
📤 Register request: { url: "/api/auth/register", username: "..." }
```

Nếu có lỗi:
```
❌ Register error: ...
Error details: { message: "...", code: "...", ... }
```

---

### Bước 4: Kiểm tra Network Tab

Mở **Browser DevTools** (F12) → Tab **Network**

1. Click "Đăng ký"
2. Tìm request `register` trong danh sách
3. Click vào request để xem chi tiết:

**Request URL phải là:**
```
http://localhost:5000/api/auth/register
```

**Request Method:** `POST`

**Request Headers:**
```
Content-Type: application/json
```

**Request Payload:**
```json
{
  "username": "email@example.com",
  "password": "password123"
}
```

**Nếu request bị failed (màu đỏ):**
- Click vào request → Tab **Headers** → Xem **General**
- Kiểm tra **Status Code** và **Error message**

---

### Bước 5: Kiểm tra CORS

Nếu backend trả về CORS error:

**Backend cần cấu hình CORS:**
```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Port của frontend
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

app.UseCors("AllowFrontend");
```

---

### Bước 6: Kiểm tra Port

**Frontend port:** Mặc định `3000` (theo vite.config.ts)

**Backend port:** Phải là `5000` (theo api.md)

**Nếu backend chạy port khác:**
- Sửa `.env`: `VITE_BACKEND_URL=http://localhost:<port>`
- Restart dev server

---

## 🐛 DEBUG CHECKLIST

- [ ] Backend đang chạy tại `http://localhost:5000`
- [ ] File `.env` tồn tại và có `VITE_BACKEND_URL=http://localhost:5000`
- [ ] Đã restart dev server sau khi tạo/sửa `.env`
- [ ] Console log hiển thị đúng baseURL
- [ ] Network tab không có request failed
- [ ] CORS đã được cấu hình đúng
- [ ] Port frontend và backend không conflict

---

## 📝 LOGS ĐỂ DEBUG

Khi chạy app, mở Console và tìm:

**✅ Success:**
```
🔗 API Base URL: http://localhost:5000
📤 Register request: { url: "/api/auth/register", username: "..." }
✅ Register response: { isSuccess: true, message: "...", userId: "..." }
```

**❌ Error:**
```
🔗 API Base URL: http://localhost:5000
📤 Register request: { url: "/api/auth/register", username: "..." }
❌ Register error: Network Error
Error details: { message: "Network Error", code: "ERR_NETWORK", ... }
```

---

## 🔍 TEST API THỦ CÔNG

**Test bằng curl:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"password123"}'
```

**Test bằng Postman/Thunder Client:**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "username": "test@example.com",
  "password": "password123"
}
```

Nếu test thủ công thành công → Vấn đề ở Frontend
Nếu test thủ công thất bại → Vấn đề ở Backend

---

## 💡 QUICK FIX

**Nếu vẫn không được, thử:**

1. **Clear browser cache và localStorage:**
```javascript
// Mở Console và chạy:
localStorage.clear();
location.reload();
```

2. **Kiểm tra firewall/antivirus** có chặn localhost không

3. **Thử dùng IP thay vì localhost:**
```bash
# .env
VITE_BACKEND_URL=http://127.0.0.1:5000
```

4. **Kiểm tra backend logs:**
```bash
docker compose logs clinic-api
```

---

**Nếu vẫn không được, kiểm tra lại:**
- Backend có đang chạy không?
- Port có đúng không?
- CORS có được cấu hình không?
- `.env` có đúng format không?










