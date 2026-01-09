# API Structure & Response Format - Chi tiết đầy đủ

## 📁 Cấu trúc Backend

### 1. **Endpoints** (Định nghĩa routes)
- **Location**: `Features/{feature}/endpoint/*Endpoint.cs`
- **Ví dụ**: 
  - `Features/auth-service/endpoint/AuthEndpoint.cs`
  - `Features/booking_service/endpoint/ClinicEndpoint.cs`
  - `Features/booking_service/endpoint/DoctorEndpoint.cs`
  - `Features/booking_service/endpoint/BookingEndpoint.cs`

### 2. **DTOs** (Data Transfer Objects - Request/Response models)
- **Location**: `Features/{feature}/dto/*Dto.cs`
- **Ví dụ**:
  - `Features/auth-service/dto/AuthDto.cs` - Login/Register DTOs
  - `Features/booking_service/dto/PublicDtos.cs` - Common DTOs
  - `Features/booking_service/dto/ClinicDto.cs` - Clinic DTOs
  - `Features/booking_service/dto/DoctorDto.cs` - Doctor DTOs

### 3. **Services** (Business logic & Response format)
- **Location**: `Features/{feature}/service/*Service.cs`
- **Ví dụ**:
  - `Features/auth-service/service/AuthService.cs` - Auth logic
  - `Features/booking_service/service/UserService.cs` - Public APIs
  - `Features/booking_service/service/AdminService.cs` - Admin APIs

### 4. **Handlers** (Endpoint handlers)
- **Location**: `Features/{feature}/handler/*Handler.cs`
- **Ví dụ**:
  - `Features/auth-service/handler/AuthHandler.cs`
  - `Features/booking_service/handler/UserHandler.cs`
  - `Features/booking_service/handler/AdminHandler.cs`

---

## 🔑 Response Format

### Standard Response Format
Hầu hết API trả về format:
```typescript
{
  isSuccess: boolean;  // true nếu thành công, false nếu có lỗi
  message: string;     // Thông báo mô tả kết quả
  data: T | null;      // Dữ liệu trả về (có thể là object, array, hoặc null)
}
```

**TypeScript Interface:**
```typescript
interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T | null;
}
```

**Cách sử dụng:**
- Kiểm tra `isSuccess` để biết request có thành công không
- Đọc `message` để hiển thị thông báo cho user
- Lấy `data` để sử dụng trong UI (render list, form, etc.)

---

## 📋 API Endpoints - Chi tiết đầy đủ

### 🔐 Authentication APIs
**Base**: `/api/auth`

#### POST `/api/auth/login`
**Mục đích**: Đăng nhập user, lấy JWT token để authenticate các API khác

**Request:**
```json
{
  "username": "string",  // Email hoặc username của user
  "password": "string"   // Mật khẩu
}
```

**Response 200:**
```json
{
  "id": "uuid",                    // User ID (UUID) - Dùng để lưu vào localStorage với key "userId"
  "accessToken": "jwt_token"       // JWT token - Dùng để authenticate các API protected, lưu vào localStorage với key "accessToken"
}
```

**Giải thích từng field:**
- `id` (string, UUID): 
  - **Dùng để làm gì**: Lưu vào localStorage để biết user hiện tại là ai
  - **Cách dùng**: `localStorage.setItem("userId", id)`
  - **Khi nào dùng**: Khi cần lấy thông tin user, filter data theo user, etc.
  
- `accessToken` (string, JWT):
  - **Dùng để làm gì**: Gửi trong header `Authorization: Bearer <token>` cho các API cần authentication
  - **Cách dùng**: `localStorage.setItem("accessToken", token)`, sau đó tự động thêm vào header qua axios interceptor
  - **Khi nào dùng**: Mọi API call sau khi login (trừ public APIs như `/api/clinic`, `/api/services`)

**Response 400:**
- `"User is not existed"` - Username không tồn tại trong hệ thống
- `"Password is incorrect"` - Mật khẩu sai
- `"Username is missing"` hoặc `"Password is missing"` - Thiếu thông tin

**Flow sử dụng:**
1. User nhập username/password → Gọi API
2. Nếu thành công → Lưu `id` và `accessToken` vào localStorage
3. Redirect user đến trang home/dashboard
4. Các API call tiếp theo tự động thêm token vào header

**Note**: Không dùng `ApiResponse` format, trả về trực tiếp object.

---

#### POST `/api/auth/register`
**Mục đích**: Đăng ký tài khoản mới cho user

**Request:**
```json
{
  "username": "string",  // Email hoặc username (theo API spec, email map vào username field)
  "password": "string"  // Mật khẩu (phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số)
}
```

**Response 200:**
```json
{
  "isSuccess": true,              // true nếu đăng ký thành công
  "message": "Register successfully",  // Thông báo thành công
  "userId": "uuid"                // ID của user vừa tạo (UUID)
}
```

**Giải thích từng field:**
- `isSuccess` (boolean):
  - **Dùng để làm gì**: Kiểm tra xem đăng ký có thành công không
  - **Cách dùng**: `if (response.isSuccess) { /* show success message */ }`
  
- `message` (string):
  - **Dùng để làm gì**: Hiển thị thông báo cho user
  - **Cách dùng**: `toast.success(response.message)` hoặc hiển thị trong UI
  
- `userId` (string, UUID):
  - **Dùng để làm gì**: ID của user vừa được tạo (không cần lưu vào localStorage, chỉ để reference)
  - **Cách dùng**: Có thể dùng để log hoặc tracking, nhưng thường không cần thiết

**Response 400:**
- `"Missing username"` hoặc `"Missing password"` - Thiếu thông tin
- `"Username is already used"` - Username đã tồn tại, cần dùng username khác
- `"Cannot create new user {errors}"` - Password không đủ mạnh (cần uppercase, lowercase, number)

**Flow sử dụng:**
1. User nhập username/password → Validate form (password phải có chữ hoa, thường, số)
2. Gọi API register
3. Nếu thành công → Hiển thị success message → Redirect về `/login`
4. Nếu thất bại → Hiển thị error message → User sửa lại

**Lưu ý**: Register KHÔNG tự động login, user phải login sau khi register.

---

### 🏥 Public Booking APIs
**Base**: `/api/*`

#### GET `/api/clinic`
**Mục đích**: Lấy danh sách các phòng khám (clinic) để user chọn khi đặt lịch

**Query Params:**
- `nameOrCode?: string` - Tìm kiếm theo tên hoặc mã phòng khám (optional)

**Response 200:**
```json
{
  "isSuccess": true,
  "message": "OK",
  "data": [
    {
      "clinicId": "uuid",        // ID của phòng khám - Dùng để filter doctors, services, slots
      "code": "string",          // Mã phòng khám (ví dụ: "CL001") - Hiển thị trong UI
      "name": "string",          // Tên phòng khám (ví dụ: "Phòng khám Đa khoa Hà Nội") - Hiển thị trong UI
      "timeZone": "string",      // Múi giờ (ví dụ: "Asia/Ho_Chi_Minh") - Dùng để convert time khi hiển thị
      "phone": "string | null",  // Số điện thoại - Hiển thị để user liên hệ
      "email": "string | null"   // Email - Hiển thị để user liên hệ
    }
  ]
}
```

**Giải thích từng field:**
- `clinicId` (string, UUID):
  - **Dùng để làm gì**: ID để filter doctors, services, slots theo clinic
  - **Cách dùng**: Khi user chọn clinic → Lưu `clinicId` → Gọi `/api/doctors?clinicId={clinicId}` để lấy danh sách bác sĩ
  - **Ví dụ**: `GET /api/doctors?clinicId=550e8400-e29b-41d4-a716-446655440000`

- `code` (string):
  - **Dùng để làm gì**: Mã định danh ngắn gọn của clinic (ví dụ: "CL001", "CL002")
  - **Cách dùng**: Hiển thị trong dropdown/select để user dễ nhận biết
  - **Ví dụ UI**: `[CL001] Phòng khám Đa khoa Hà Nội`

- `name` (string):
  - **Dùng để làm gì**: Tên đầy đủ của phòng khám
  - **Cách dùng**: Hiển thị chính trong UI, dùng để search/filter

- `timeZone` (string):
  - **Dùng để làm gì**: Múi giờ của clinic (ví dụ: "Asia/Ho_Chi_Minh", "UTC")
  - **Cách dùng**: Convert DateTime từ UTC sang local time khi hiển thị
  - **Ví dụ**: Nếu slot trả về `"2024-01-15T09:00:00Z"` (UTC) → Convert sang `"2024-01-15 16:00:00"` (GMT+7)

- `phone` (string | null):
  - **Dùng để làm gì**: Số điện thoại liên hệ của clinic
  - **Cách dùng**: Hiển thị trong card/detail, có thể dùng để gọi điện (`tel:` link)

- `email` (string | null):
  - **Dùng để làm gì**: Email liên hệ của clinic
  - **Cách dùng**: Hiển thị trong card/detail, có thể dùng để gửi email (`mailto:` link)

**TypeScript:**
```typescript
interface ClinicDto {
  clinicId: string;
  code: string;
  name: string;
  timeZone: string;
  phone: string | null;
  email: string | null;
}
```

**Use Case Flow:**
1. User vào trang đặt lịch → Gọi `GET /api/clinic` → Hiển thị danh sách clinic
2. User chọn 1 clinic → Lưu `clinicId` → Gọi `GET /api/doctors?clinicId={clinicId}` để lấy danh sách bác sĩ
3. User chọn bác sĩ → Gọi `GET /api/slots?clinicId={clinicId}&doctorId={doctorId}` để lấy slots khả dụng

---

#### GET `/api/services`
**Mục đích**: Lấy danh sách các dịch vụ (service) của clinic để user chọn khi đặt lịch

**Query Params:**
- `clinicId?: Guid` - Filter theo clinic (optional)
- `nameOrCode?: string` - Tìm kiếm theo tên hoặc mã dịch vụ (optional)
- `isActive?: boolean` - Chỉ lấy dịch vụ đang hoạt động (optional, default: true)

**Response 200:**
```json
{
  "isSuccess": true,
  "message": "OK",
  "data": [
    {
      "serviceId": "uuid",              // ID của dịch vụ - Dùng để tạo booking
      "code": "string",                 // Mã dịch vụ (ví dụ: "SV001") - Hiển thị trong UI
      "name": "string",                 // Tên dịch vụ (ví dụ: "Khám tổng quát") - Hiển thị trong UI
      "defaultDurationMin": number | null,  // Thời gian mặc định (phút) - Dùng để tính endAt khi tạo booking
      "defaultPrice": number | null,    // Giá mặc định (VND) - Hiển thị giá trong UI
      "isActive": boolean,              // Dịch vụ có đang hoạt động không - Filter để chỉ hiển thị active
      "clinicId": "uuid"                // ID của clinic - Dùng để filter
    }
  ]
}
```

**Giải thích từng field:**
- `serviceId` (string, UUID):
  - **Dùng để làm gì**: ID để tạo booking với service này
  - **Cách dùng**: Khi user chọn service → Lưu `serviceId` → Gửi trong `CreateBookingRequest.serviceId`
  - **Lưu ý**: Service có thể null nếu user không chọn service cụ thể

- `code` (string):
  - **Dùng để làm gì**: Mã định danh ngắn gọn (ví dụ: "SV001", "SV002")
  - **Cách dùng**: Hiển thị trong dropdown/select

- `name` (string):
  - **Dùng để làm gì**: Tên dịch vụ (ví dụ: "Khám tổng quát", "Xét nghiệm máu")
  - **Cách dùng**: Hiển thị chính trong UI

- `defaultDurationMin` (number | null):
  - **Dùng để làm gì**: Thời gian mặc định của dịch vụ (phút)
  - **Cách dùng**: Nếu user chọn service → Tự động tính `endAt = startAt + defaultDurationMin`
  - **Ví dụ**: Nếu `startAt = "2024-01-15T09:00:00Z"` và `defaultDurationMin = 30` → `endAt = "2024-01-15T09:30:00Z"`
  - **Lưu ý**: Nếu null, user phải tự chọn thời gian kết thúc

- `defaultPrice` (number | null):
  - **Dùng để làm gì**: Giá mặc định của dịch vụ (VND)
  - **Cách dùng**: Hiển thị giá trong UI để user biết trước khi đặt
  - **Ví dụ**: `defaultPrice = 500000` → Hiển thị "500,000 VND"

- `isActive` (boolean):
  - **Dùng để làm gì**: Dịch vụ có đang hoạt động không
  - **Cách dùng**: Filter để chỉ hiển thị dịch vụ active (`isActive: true`)
  - **Lưu ý**: Nếu `isActive = false`, không nên cho user chọn

- `clinicId` (string, UUID):
  - **Dùng để làm gì**: ID của clinic sở hữu dịch vụ này
  - **Cách dùng**: Filter services theo clinic: `GET /api/services?clinicId={clinicId}`

**TypeScript:**
```typescript
interface ServiceDto {
  serviceId: string;
  code: string;
  name: string;
  defaultDurationMin: number | null;
  defaultPrice: number | null;
  isActive: boolean;
  clinicId: string;
}
```

**Use Case Flow:**
1. User chọn clinic → Gọi `GET /api/services?clinicId={clinicId}&isActive=true` → Hiển thị danh sách dịch vụ
2. User chọn service → Lưu `serviceId` và `defaultDurationMin`
3. User chọn slot → Nếu có `defaultDurationMin`, tự động tính `endAt = startAt + defaultDurationMin`
4. Tạo booking với `serviceId` đã chọn

---

#### GET `/api/doctors`
**Mục đích**: Lấy danh sách các bác sĩ (doctor) để user chọn khi đặt lịch

**Query Params:**
- `clinicId?: Guid` - Filter theo clinic (optional)
- `nameOrCode?: string` - Tìm kiếm theo tên hoặc mã bác sĩ (optional)
- `specialty?: string` - Filter theo chuyên khoa (optional)
- `serviceId?: Guid` - Filter theo dịch vụ (chỉ lấy bác sĩ có thể làm dịch vụ này) (optional)
- `isActive?: boolean` - Chỉ lấy bác sĩ đang hoạt động (optional, default: true)

**Response 200:**
```json
{
  "isSuccess": true,
  "message": "OK",
  "data": [
    {
      "doctorId": "uuid",        // ID của bác sĩ - Dùng để lấy availability, slots, tạo booking
      "clinicId": "uuid",         // ID của clinic - Dùng để filter
      "code": "string",           // Mã bác sĩ (ví dụ: "BS001") - Hiển thị trong UI
      "fullName": "string",       // Tên đầy đủ bác sĩ (ví dụ: "Nguyễn Văn A") - Hiển thị trong UI
      "specialty": "string | null",  // Chuyên khoa (ví dụ: "Nội khoa", "Ngoại khoa") - Hiển thị và filter
      "phone": "string | null",   // Số điện thoại - Hiển thị để liên hệ
      "email": "string | null",   // Email - Hiển thị để liên hệ
      "isActive": boolean         // Bác sĩ có đang hoạt động không - Filter để chỉ hiển thị active
    }
  ]
}
```

**Giải thích từng field:**
- `doctorId` (string, UUID):
  - **Dùng để làm gì**: ID để lấy availability, slots, và tạo booking
  - **Cách dùng**: 
    - Lấy availability: `GET /api/doctors/{doctorId}/availability?from={date}&to={date}`
    - Lấy slots: `GET /api/slots?clinicId={clinicId}&doctorId={doctorId}&date={date}`
    - Tạo booking: Gửi trong `CreateBookingRequest.doctorId`

- `code` (string):
  - **Dùng để làm gì**: Mã định danh ngắn gọn (ví dụ: "BS001", "BS002")
  - **Cách dùng**: Hiển thị trong dropdown/select

- `fullName` (string):
  - **Dùng để làm gì**: Tên đầy đủ của bác sĩ
  - **Cách dùng**: Hiển thị chính trong UI (card, list, detail)

- `specialty` (string | null):
  - **Dùng để làm gì**: Chuyên khoa của bác sĩ (ví dụ: "Nội khoa", "Ngoại khoa", "Tim mạch")
  - **Cách dùng**: 
    - Hiển thị trong card: `Dr. Nguyễn Văn A - Nội khoa`
    - Filter: `GET /api/doctors?specialty=Nội khoa`
    - Group doctors theo specialty trong UI

- `phone`, `email` (string | null):
  - **Dùng để làm gì**: Thông tin liên hệ
  - **Cách dùng**: Hiển thị trong detail page, có thể dùng để gọi/email

- `isActive` (boolean):
  - **Dùng để làm gì**: Bác sĩ có đang hoạt động không
  - **Cách dùng**: Filter để chỉ hiển thị bác sĩ active

**TypeScript:**
```typescript
interface DoctorDto {
  doctorId: string;
  clinicId: string;
  code: string;
  fullName: string;
  specialty: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
}
```

**Use Case Flow:**
1. User chọn clinic → Gọi `GET /api/doctors?clinicId={clinicId}&isActive=true` → Hiển thị danh sách bác sĩ
2. User có thể filter theo specialty: `GET /api/doctors?clinicId={clinicId}&specialty=Nội khoa`
3. User chọn bác sĩ → Lưu `doctorId` → Gọi `GET /api/doctors/{doctorId}/availability` để xem lịch làm việc
4. User chọn ngày → Gọi `GET /api/slots?clinicId={clinicId}&doctorId={doctorId}&date={date}` để lấy slots khả dụng

---

#### GET `/api/doctors/{doctorId}/availability`
**Mục đích**: Lấy lịch làm việc (availability) của bác sĩ trong khoảng thời gian để hiển thị calendar

**Query Params:**
- `from: DateOnly` (required, format: `YYYY-MM-DD`) - Ngày bắt đầu
- `to: DateOnly` (required, format: `YYYY-MM-DD`) - Ngày kết thúc

**Response 200:**
```json
{
  "isSuccess": true,
  "message": "OK",
  "data": [
    {
      "date": "2024-01-15",        // Ngày làm việc (YYYY-MM-DD) - Dùng để hiển thị trong calendar
      "startTime": "09:00:00",     // Giờ bắt đầu (HH:mm:ss) - Dùng để hiển thị và tính slots
      "endTime": "17:00:00",       // Giờ kết thúc (HH:mm:ss) - Dùng để hiển thị và tính slots
      "slotSizeMin": 30            // Kích thước mỗi slot (phút) - Dùng để chia slots (30 phút = 1 slot)
    }
  ]
}
```

**Giải thích từng field:**
- `date` (string, DateOnly format: "YYYY-MM-DD"):
  - **Dùng để làm gì**: Ngày làm việc của bác sĩ
  - **Cách dùng**: 
    - Hiển thị trong calendar: Highlight các ngày có availability
    - Filter: Chỉ cho user chọn ngày có trong danh sách này
    - Ví dụ: `"2024-01-15"` → Bác sĩ làm việc vào ngày 15/01/2024

- `startTime` (string, TimeSpan format: "HH:mm:ss"):
  - **Dùng để làm gì**: Giờ bắt đầu làm việc trong ngày
  - **Cách dùng**: 
    - Hiển thị: "Làm việc từ 09:00 đến 17:00"
    - Tính slots: Từ `startTime` đến `endTime`, mỗi `slotSizeMin` phút = 1 slot
    - Ví dụ: `"09:00:00"` → Bắt đầu lúc 9h sáng

- `endTime` (string, TimeSpan format: "HH:mm:ss"):
  - **Dùng để làm gì**: Giờ kết thúc làm việc trong ngày
  - **Cách dùng**: 
    - Hiển thị: "Làm việc từ 09:00 đến 17:00"
    - Tính slots: Từ `startTime` đến `endTime`
    - Ví dụ: `"17:00:00"` → Kết thúc lúc 5h chiều

- `slotSizeMin` (number):
  - **Dùng để làm gì**: Kích thước mỗi slot (phút)
  - **Cách dùng**: 
    - Tính số slots: `(endTime - startTime) / slotSizeMin`
    - Ví dụ: `startTime = "09:00:00"`, `endTime = "17:00:00"`, `slotSizeMin = 30`
      - Tổng thời gian: 8 giờ = 480 phút
      - Số slots: 480 / 30 = 16 slots
      - Slots: 09:00-09:30, 09:30-10:00, 10:00-10:30, ..., 16:30-17:00

**TypeScript:**
```typescript
interface AvailabilityDto {
  date: string; // DateOnly format: "YYYY-MM-DD"
  startTime: string; // TimeSpan format: "HH:mm:ss"
  endTime: string; // TimeSpan format: "HH:mm:ss"
  slotSizeMin: number;
}
```

**Use Case Flow:**
1. User chọn bác sĩ → Gọi `GET /api/doctors/{doctorId}/availability?from=2024-01-01&to=2024-01-31` → Lấy availability tháng 1
2. Hiển thị calendar: Highlight các ngày có availability (có trong `data`)
3. User click vào ngày có availability → Gọi `GET /api/slots?clinicId={clinicId}&doctorId={doctorId}&date={date}` để lấy slots khả dụng
4. Hiển thị slots: Từ `startTime` đến `endTime`, mỗi `slotSizeMin` phút = 1 slot

**Lưu ý**: Availability chỉ cho biết bác sĩ làm việc khi nào, nhưng slots có thể bị booked hoặc time-off. Cần gọi `/api/slots` để biết slots thực sự khả dụng.

---

#### GET `/api/slots`
**Mục đích**: Lấy danh sách các slot (khung giờ) khả dụng để user chọn khi đặt lịch

**Query Params:**
- `clinicId: Guid` (required) - ID của clinic
- `doctorId: Guid` (required) - ID của bác sĩ
- `serviceId?: Guid` (optional) - ID của service (dùng để tính duration nếu service có `defaultDurationMin`)
- `date: DateOnly` (required, format: `YYYY-MM-DD`) - Ngày cần lấy slots

**Response 200:**
```json
{
  "isSuccess": true,
  "message": "OK",
  "data": [
    {
      "startAt": "2024-01-15T09:00:00Z",  // Thời gian bắt đầu slot (ISO 8601 DateTime, UTC) - Dùng để tạo booking
      "endAt": "2024-01-15T09:30:00Z"     // Thời gian kết thúc slot (ISO 8601 DateTime, UTC) - Dùng để tạo booking
    }
  ]
}
```

**Giải thích từng field:**
- `startAt` (string, ISO 8601 DateTime, UTC):
  - **Dùng để làm gì**: Thời gian bắt đầu slot (đã tính timezone, đã loại bỏ slots bị booked/time-off)
  - **Cách dùng**: 
    - Hiển thị: Convert từ UTC sang local time để hiển thị (ví dụ: "09:00" thay vì "09:00:00Z")
    - Tạo booking: Gửi trực tiếp trong `CreateBookingRequest.startAt`
    - Ví dụ: `"2024-01-15T09:00:00Z"` → Slot từ 9h sáng ngày 15/01/2024 (UTC)

- `endAt` (string, ISO 8601 DateTime, UTC):
  - **Dùng để làm gì**: Thời gian kết thúc slot
  - **Cách dùng**: 
    - Hiển thị: Convert từ UTC sang local time
    - Tạo booking: Gửi trực tiếp trong `CreateBookingRequest.endAt`
    - Ví dụ: `"2024-01-15T09:30:00Z"` → Slot đến 9h30 sáng ngày 15/01/2024 (UTC)

**TypeScript:**
```typescript
interface SlotDto {
  startAt: string; // ISO 8601 DateTime (UTC)
  endAt: string; // ISO 8601 DateTime (UTC)
}
```

**Use Case Flow:**
1. User chọn clinic, doctor, và ngày → Gọi `GET /api/slots?clinicId={clinicId}&doctorId={doctorId}&date=2024-01-15`
2. Backend tính toán:
   - Lấy availability của doctor trong ngày đó
   - Loại bỏ slots đã bị booked (có appointment hoặc booking pending/confirmed)
   - Loại bỏ slots trong thời gian time-off của doctor
   - Chia thành các slots theo `slotSizeMin`
3. Trả về danh sách slots khả dụng
4. Frontend hiển thị: Convert UTC sang local time → Hiển thị buttons/cards cho user chọn
5. User chọn slot → Lưu `startAt` và `endAt` → Dùng để tạo booking

**Lưu ý quan trọng:**
- Slots đã được filter, chỉ trả về slots thực sự khả dụng (chưa bị booked, không trong time-off)
- DateTime là UTC, cần convert sang local time khi hiển thị
- Nếu user chọn service có `defaultDurationMin`, có thể không cần gọi API này (tự tính slots), nhưng vẫn nên gọi để đảm bảo slot khả dụng

---

#### POST `/api/bookings`
**Mục đích**: Tạo booking (đặt lịch) mới

**Request:**
```json
{
  "clinicId": "uuid",              // ID của clinic - Required
  "doctorId": "uuid",              // ID của bác sĩ - Required
  "serviceId": "uuid | null",      // ID của service (optional) - Có thể null nếu không chọn service cụ thể
  "startAt": "2024-01-15T09:00:00Z",  // Thời gian bắt đầu (ISO 8601 DateTime, UTC) - Required, lấy từ slot đã chọn
  "endAt": "2024-01-15T09:30:00Z",    // Thời gian kết thúc (ISO 8601 DateTime, UTC) - Required, lấy từ slot đã chọn
  "fullName": "string",           // Tên đầy đủ người đặt lịch - Required
  "phone": "string",               // Số điện thoại - Required
  "email": "string | null",        // Email (optional) - Có thể null
  "notes": "string | null",        // Ghi chú (optional) - Có thể null
  "channel": "Web | App | Hotline | FrontDesk | null"  // Nguồn đặt lịch (optional, default: "Web")
}
```

**Giải thích từng field request:**
- `clinicId`, `doctorId`: Required, lấy từ user đã chọn
- `serviceId`: Optional, lấy từ service user chọn (có thể null)
- `startAt`, `endAt`: Required, lấy từ slot user đã chọn (từ `/api/slots`)
- `fullName`, `phone`: Required, lấy từ form user điền
- `email`, `notes`: Optional, lấy từ form
- `channel`: Optional, mặc định là "Web" nếu không gửi

**Response 201 (Created):**
```json
{
  "isSuccess": true,
  "message": "Created",
  "data": {
    "bookingId": "uuid",           // ID của booking vừa tạo - Dùng để confirm, cancel, reschedule
    "status": "Pending",            // Trạng thái booking - "Pending" = chờ xác nhận
    "cancelToken": "string",       // Token để cancel booking - Dùng trong API cancel
    "rescheduleToken": null        // Token để reschedule (chỉ có sau khi confirm) - Dùng trong API reschedule
  }
}
```

**Giải thích từng field response:**
- `bookingId` (string, UUID):
  - **Dùng để làm gì**: ID của booking vừa tạo
  - **Cách dùng**: 
    - Lưu để hiển thị thông tin booking: `GET /api/bookings/{bookingId}`
    - Confirm booking: `POST /api/bookings/{bookingId}/confirm`
    - Reference trong UI: "Booking ID: {bookingId}"

- `status` (string, enum: "Pending" | "Confirmed" | "Cancelled"):
  - **Dùng để làm gì**: Trạng thái hiện tại của booking
  - **Cách dùng**: 
    - "Pending": Booking mới tạo, chưa được confirm → Hiển thị "Chờ xác nhận"
    - "Confirmed": Đã confirm → Hiển thị "Đã xác nhận"
    - "Cancelled": Đã hủy → Hiển thị "Đã hủy"
  - **Flow**: Pending → (confirm) → Confirmed → (có appointment)

- `cancelToken` (string):
  - **Dùng để làm gì**: Token để cancel booking (bảo mật, không thể cancel nếu không có token)
  - **Cách dùng**: 
    - Lưu vào localStorage hoặc state
    - Khi user muốn cancel → Gọi `POST /api/bookings/{bookingId}/cancel` với `token: cancelToken`
  - **Lưu ý**: Token có thể expire (expires tại `startAt` của booking)

- `rescheduleToken` (string | null):
  - **Dùng để làm gì**: Token để reschedule booking (chỉ có sau khi confirm)
  - **Cách dùng**: 
    - Ban đầu là `null` (chưa confirm)
    - Sau khi confirm → Lấy từ `GET /api/bookings/{bookingId}` → Có `rescheduleToken`
    - Khi user muốn reschedule → Gọi `POST /api/bookings/{bookingId}/reschedule` với `token: rescheduleToken`

**Response 400:**
```json
{
  "isSuccess": false,
  "message": "Clinic not found" | "Doctor not found" | "Service not found" | "Doctor does not offer this service",
  "data": null
}
```

**Response 409 (Conflict):**
```json
{
  "isSuccess": false,
  "message": "Doctor is on time off during the selected period." | "Slot already taken",
  "data": null
}
```
- "Doctor is on time off": Bác sĩ nghỉ trong khoảng thời gian này
- "Slot already taken": Slot đã bị người khác đặt (race condition)

**Response 422 (Unprocessable Entity):**
```json
{
  "isSuccess": false,
  "message": "Selected time is outside availability",
  "data": null
}
```
- Slot không nằm trong availability của bác sĩ

**TypeScript:**
```typescript
interface CreateBookingRequest {
  clinicId: string;
  doctorId: string;
  serviceId: string | null;
  startAt: string; // ISO 8601 DateTime (UTC)
  endAt: string; // ISO 8601 DateTime (UTC)
  fullName: string;
  phone: string;
  email: string | null;
  notes: string | null;
  channel?: "Web" | "App" | "Hotline" | "FrontDesk" | null;
}

interface BookingResponse {
  bookingId: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  cancelToken: string | null;
  rescheduleToken: string | null;
}
```

**Use Case Flow:**
1. User điền form đặt lịch (chọn clinic, doctor, service, slot, thông tin cá nhân)
2. Gọi `POST /api/bookings` với thông tin đã điền
3. Nếu thành công:
   - Lưu `bookingId`, `cancelToken` vào state/localStorage
   - Hiển thị success message: "Đặt lịch thành công! Booking ID: {bookingId}"
   - Redirect đến trang xác nhận booking hoặc trang chi tiết booking
4. Nếu thất bại:
   - Hiển thị error message
   - Nếu "Slot already taken" → Refresh slots và cho user chọn lại

---

#### GET `/api/bookings/{bookingId}`
**Mục đích**: Lấy thông tin chi tiết của booking

**Response 200:**
```json
{
  "isSuccess": true,
  "message": "OK",
  "data": {
    "bookingId": "uuid",           // ID của booking
    "status": "Pending",            // Trạng thái hiện tại
    "cancelToken": "string | null", // Token để cancel (có thể null nếu đã expire)
    "rescheduleToken": "string | null"  // Token để reschedule (chỉ có sau khi confirm)
  }
}
```

**Giải thích từng field:**
- Tương tự như response của `POST /api/bookings`, nhưng có thể lấy lại tokens nếu cần

**Response 404:**
```json
{
  "isSuccess": false,
  "message": "Not found",
  "data": null
}
```

**Use Case Flow:**
1. User vào trang chi tiết booking (có `bookingId` từ URL hoặc state)
2. Gọi `GET /api/bookings/{bookingId}` → Lấy thông tin booking
3. Hiển thị:
   - Booking ID
   - Status (Pending/Confirmed/Cancelled)
   - Nút "Cancel" nếu có `cancelToken` và status = "Pending"
   - Nút "Reschedule" nếu có `rescheduleToken` và status = "Confirmed"

---

#### POST `/api/bookings/{bookingId}/confirm`
**Mục đích**: Xác nhận booking (chuyển từ Pending → Confirmed, tạo Appointment)

**Response 201:**
```json
{
  "isSuccess": true,
  "message": "Created",
  "data": {
    "appointmentId": "uuid",       // ID của appointment vừa tạo - Dùng để track appointment
    "status": "Confirmed"         // Trạng thái appointment - "Confirmed" = đã xác nhận
  }
}
```

**Giải thích từng field:**
- `appointmentId` (string, UUID):
  - **Dùng để làm gì**: ID của appointment (lịch hẹn chính thức) vừa được tạo
  - **Cách dùng**: 
    - Lưu để reference: "Appointment ID: {appointmentId}"
    - Track appointment trong hệ thống
    - Có thể dùng để query appointment details (nếu có API)

- `status` (string, enum: "Confirmed" | "Cancelled" | "NoShow" | "Rescheduling"):
  - **Dùng để làm gì**: Trạng thái của appointment
  - **Các giá trị**:
    - "Confirmed": Đã xác nhận, chờ đến khám
    - "Cancelled": Đã hủy
    - "NoShow": Không đến khám
    - "Rescheduling": Đang đổi lịch

**Response 400:**
```json
{
  "isSuccess": false,
  "message": "Booking is not pending",
  "data": null
}
```
- Booking đã được confirm hoặc cancelled rồi

**Response 409:**
```json
{
  "isSuccess": false,
  "message": "Slot already taken",
  "data": null
}
```
- Slot đã bị người khác đặt (race condition)

**TypeScript:**
```typescript
interface AppointmentResponse {
  appointmentId: string;
  status: "Confirmed" | "Cancelled" | "NoShow" | "Rescheduling";
}
```

**Use Case Flow:**
1. User có booking với status = "Pending"
2. User click nút "Xác nhận" hoặc admin confirm
3. Gọi `POST /api/bookings/{bookingId}/confirm`
4. Nếu thành công:
   - Booking status chuyển thành "Confirmed"
   - Tạo Appointment mới với status = "Confirmed"
   - Hiển thị success: "Đã xác nhận! Appointment ID: {appointmentId}"
   - Có thể lấy `rescheduleToken` từ `GET /api/bookings/{bookingId}` để cho phép reschedule

---

#### POST `/api/bookings/{bookingId}/cancel`
**Mục đích**: Hủy booking/appointment

**Request Body:**
```json
{
  "token": "string"  // cancelToken từ booking response - Required để bảo mật
}
```

**Response 200:**
```json
{
  "bookingId": "uuid",        // ID của booking đã hủy
  "appointmentId": "uuid",    // ID của appointment đã hủy (nếu đã confirm)
  "status": "Cancelled"        // Trạng thái mới = "Cancelled"
}
```

**Giải thích từng field:**
- `bookingId`: ID của booking đã hủy
- `appointmentId`: ID của appointment đã hủy (chỉ có nếu booking đã được confirm)
- `status`: Luôn là "Cancelled"

**Response 409:**
- `"Cannot cancel cancelled appointment"` - Đã hủy rồi, không thể hủy lại
- `"Cannot cancel appointment within 2 hours"` - Không thể hủy trong vòng 2 giờ trước giờ hẹn

**Use Case Flow:**
1. User muốn hủy booking → Click nút "Hủy"
2. Lấy `cancelToken` từ state/localStorage (đã lưu khi tạo booking)
3. Gọi `POST /api/bookings/{bookingId}/cancel` với `token: cancelToken`
4. Nếu thành công:
   - Booking/appointment status = "Cancelled"
   - Hiển thị success: "Đã hủy booking thành công"
   - Có thể cho phép user đặt lịch mới
5. Nếu thất bại:
   - Hiển thị error: "Không thể hủy trong vòng 2 giờ trước giờ hẹn"

---

#### POST `/api/bookings/{bookingId}/reschedule`
**Mục đích**: Đổi lịch booking/appointment

**Request Body:**
```json
{
  "token": "string",           // rescheduleToken từ booking response - Required
  "start": "2024-01-15T11:00:00Z",  // Thời gian bắt đầu mới (ISO 8601 DateTime, UTC)
  "end": "2024-01-15T11:30:00Z"     // Thời gian kết thúc mới (ISO 8601 DateTime, UTC)
}
```

**Response 200:**
```json
{
  "isSuccess": true,
  "message": "Update successfully"
}
```

**Response 409:**
- `"Cannot rescheduling appointment"` - Appointment đã cancelled hoặc NoShow
- `"Appointment is conflicted"` - Slot mới đã bị đặt

**Use Case Flow:**
1. User muốn đổi lịch → Click nút "Đổi lịch"
2. Lấy `rescheduleToken` từ `GET /api/bookings/{bookingId}` (chỉ có sau khi confirm)
3. User chọn slot mới → Lấy `startAt` và `endAt` từ slot
4. Gọi `POST /api/bookings/{bookingId}/reschedule` với token và thời gian mới
5. Nếu thành công:
   - Appointment được cập nhật với thời gian mới
   - Status có thể chuyển thành "Rescheduling"
   - Hiển thị success: "Đã đổi lịch thành công"

---

### 📊 Enum APIs
**Base**: `/api/enums`

**Mục đích**: Lấy danh sách các enum values để populate dropdowns, filters, displays

#### GET `/api/enums/genders`
**Mục đích**: Lấy danh sách giới tính để hiển thị trong form (đăng ký, tạo patient, etc.)

**Response 200:**
```json
[
  { "value": 0, "name": "MALE" },
  { "value": 1, "name": "FEMALE" },
  { "value": 2, "name": "X" }
]
```

**Giải thích:**
- `value` (number): Giá trị enum (0, 1, 2) - Dùng để gửi lên server
- `name` (string): Tên enum ("MALE", "FEMALE", "X") - Dùng để hiển thị trong UI

**Cách dùng:**
- Populate dropdown: `<option value={item.value}>{item.name}</option>`
- Filter: `GET /api/patients?gender=0` (filter patients theo giới tính)
- Display: "Giới tính: {genderName}"

---

#### GET `/api/enums/booking-statuses`
**Mục đích**: Lấy danh sách trạng thái booking để hiển thị và filter

**Response 200:**
```json
[
  { "value": 0, "name": "Pending" },
  { "value": 1, "name": "Confirmed" },
  { "value": 2, "name": "Cancelled" },
  { "value": 3, "name": "Expired" }
]
```

**Cách dùng:**
- Hiển thị status badge: "Pending" → Badge màu vàng, "Confirmed" → Badge màu xanh
- Filter bookings: `GET /api/bookings?status=0` (chỉ lấy pending bookings)
- Statistics: Đếm số bookings theo từng status

---

#### GET `/api/enums/appointment-statuses`
**Mục đích**: Lấy danh sách trạng thái appointment để hiển thị và filter

**Response 200:**
```json
[
  { "value": 1, "name": "Booked" },
  { "value": 2, "name": "Confirmed" },
  { "value": 3, "name": "CheckedIn" },
  { "value": 4, "name": "InProgress" },
  { "value": 5, "name": "Completed" },
  { "value": 6, "name": "Cancelled" },
  { "value": 7, "name": "NoShow" },
  { "value": 8, "name": "Rescheduling" }
]
```

**Cách dùng:**
- Hiển thị status với màu sắc khác nhau:
  - "Booked", "Confirmed" → Màu xanh (chờ đến)
  - "CheckedIn", "InProgress" → Màu vàng (đang khám)
  - "Completed" → Màu xanh đậm (hoàn thành)
  - "Cancelled", "NoShow" → Màu đỏ (hủy/không đến)
- Filter appointments theo status
- Workflow: Booked → Confirmed → CheckedIn → InProgress → Completed

---

#### GET `/api/enums/appointment-sources`
**Mục đích**: Lấy danh sách nguồn đặt lịch (channel) để hiển thị và thống kê

**Response 200:**
```json
[
  { "value": 1, "name": "Web" },
  { "value": 2, "name": "App" },
  { "value": 3, "name": "Hotline" },
  { "value": 4, "name": "FrontDesk" }
]
```

**Cách dùng:**
- Hiển thị trong booking detail: "Nguồn: Web"
- Statistics: Thống kê số bookings theo channel (Web: 100, App: 50, Hotline: 30)
- Filter: `GET /api/bookings?channel=1` (chỉ lấy bookings từ Web)

---

#### GET `/api/enums/staff-roles`
**Mục đích**: Lấy danh sách vai trò nhân viên để hiển thị và phân quyền

**Response 200:**
```json
[
  { "value": 1, "name": "Receptionist" },
  { "value": 2, "name": "Doctor" },
  { "value": 3, "name": "Admin" }
]
```

**Cách dùng:**
- Hiển thị role của staff: "Nhân viên: Receptionist"
- Phân quyền: Admin có thể quản lý tất cả, Receptionist chỉ xem bookings, Doctor chỉ xem appointments
- Filter staff: `GET /api/admin/staff-user?role=1` (chỉ lấy Receptionist)

**TypeScript:**
```typescript
interface EnumDto {
  value: number;
  name: string;
}
```

---

### 👨‍⚕️ Admin APIs (Cần Authentication)
**Base**: `/api/admin/*`

**Lưu ý**: Tất cả Admin APIs cần JWT token trong header:
```
Authorization: Bearer <accessToken>
```

#### Clinics Management
- `POST /api/admin/clinic` - Tạo clinic mới
- `PUT /api/admin/clinic/{clinicId}` - Cập nhật thông tin clinic
- `DELETE /api/admin/clinic/{clinicId}` - Xóa clinic
- `GET /api/admin/clinic` - Lấy danh sách tất cả clinics

#### Doctors Management
- `POST /api/admin/doctor` - Tạo doctor mới
- `PUT /api/admin/doctor/{doctorId}` - Cập nhật thông tin doctor
- `DELETE /api/admin/doctor/{doctorId}` - Xóa doctor
- `GET /api/admin/doctor` - Lấy danh sách tất cả doctors
- `POST /api/admin/doctor/time-off` - Thêm thời gian nghỉ của doctor
- `PUT /api/admin/doctor/{timeOffId}/time-offs` - Cập nhật time off
- `GET /api/admin/doctor/time-offs/{doctorId}` - Lấy danh sách time offs của doctor
- `DELETE /api/admin/doctor/time-off/{timeOffId}` - Xóa time off

#### Services Management
- `POST /api/admin/service` - Tạo service mới
- `PUT /api/admin/service/{serviceId}` - Cập nhật service
- `DELETE /api/admin/service/{serviceId}` - Xóa service
- `GET /api/admin/service` - Lấy danh sách tất cả services

#### Staff Users Management
- `POST /api/admin/staff-user` - Tạo staff user mới
- `PUT /api/admin/staff-user/{userId}` - Cập nhật staff user
- `DELETE /api/admin/staff-user/{userId}` - Xóa staff user
- `GET /api/admin/staff-user` - Lấy danh sách tất cả staff users

#### Patients Management
- `POST /api/patient` - Tạo patient mới
- `PUT /api/patient/{patientId}` - Cập nhật patient
- `DELETE /api/patient/{patientId}` - Xóa patient
- `GET /api/patient` - Lấy danh sách tất cả patients

---

## 🔍 Cách tìm API trong Backend

### 1. Tìm Endpoint (Route)
- Mở `Program.cs` → Xem các `app.Map...Endpoint()` để biết routes được đăng ký
- Hoặc tìm trong `Features/{feature}/endpoint/*Endpoint.cs`

### 2. Tìm Request/Response Format
- Xem DTOs trong `Features/{feature}/dto/*Dto.cs`
- Xem Service implementation trong `Features/{feature}/service/*Service.cs` để biết response format

### 3. Tìm Business Logic
- Xem Service files: `Features/{feature}/service/*Service.cs`
- Xem Handler files: `Features/{feature}/handler/*Handler.cs`

---

## 📝 Notes

1. **Authentication**: Hầu hết Admin APIs cần JWT token trong header:
   ```
   Authorization: Bearer <accessToken>
   ```

2. **Error Format**: 
   - Auth APIs: Trả về string message trực tiếp (400 BadRequest)
   - Other APIs: Trả về `ApiResponse<T>` format với `isSuccess: false`

3. **Date/Time Format**:
   - `DateOnly`: `"YYYY-MM-DD"` (ví dụ: `"2024-01-15"`)
   - `TimeSpan`: `"HH:mm:ss"` (ví dụ: `"09:00:00"`)
   - `DateTime`: ISO 8601 format (ví dụ: `"2024-01-15T09:00:00Z"`)

4. **Guid Format**: UUID string (ví dụ: `"550e8400-e29b-41d4-a716-446655440000"`)

5. **Timezone**: 
   - Backend trả về DateTime ở UTC
   - Frontend cần convert sang local time khi hiển thị
   - Dùng `clinic.timeZone` để convert đúng timezone của clinic

---

## 🚀 Quick Start for FE

1. **Tạo TypeScript interfaces** từ DTOs trong `PublicDtos.cs`
2. **Tạo service functions** cho mỗi endpoint
3. **Sử dụng `ApiResponse<T>` wrapper** cho hầu hết APIs
4. **Xử lý errors** theo format `ApiResponse` hoặc string message
5. **Convert timezone** từ UTC sang local time khi hiển thị
6. **Lưu tokens** (accessToken, cancelToken, rescheduleToken) vào localStorage hoặc state

---

## 📖 Flow Đặt Lịch Hoàn Chỉnh

1. **User chọn Clinic**:
   - Gọi `GET /api/clinic` → Hiển thị danh sách clinics
   - User chọn → Lưu `clinicId`

2. **User chọn Doctor**:
   - Gọi `GET /api/doctors?clinicId={clinicId}&isActive=true` → Hiển thị danh sách doctors
   - User chọn → Lưu `doctorId`

3. **User chọn Service (optional)**:
   - Gọi `GET /api/services?clinicId={clinicId}&isActive=true` → Hiển thị danh sách services
   - User chọn → Lưu `serviceId` và `defaultDurationMin`

4. **User xem Availability**:
   - Gọi `GET /api/doctors/{doctorId}/availability?from={startDate}&to={endDate}` → Hiển thị calendar
   - Highlight các ngày có availability

5. **User chọn Ngày và Slot**:
   - User click vào ngày có availability
   - Gọi `GET /api/slots?clinicId={clinicId}&doctorId={doctorId}&date={date}&serviceId={serviceId}` → Hiển thị slots
   - User chọn slot → Lưu `startAt` và `endAt`

6. **User điền thông tin và tạo Booking**:
   - User điền form (fullName, phone, email, notes)
   - Gọi `POST /api/bookings` với tất cả thông tin
   - Lưu `bookingId` và `cancelToken`

7. **User xác nhận Booking**:
   - Gọi `POST /api/bookings/{bookingId}/confirm`
   - Lấy `appointmentId` và `rescheduleToken`

8. **User có thể Cancel hoặc Reschedule**:
   - Cancel: `POST /api/bookings/{bookingId}/cancel` với `cancelToken`
   - Reschedule: `POST /api/bookings/{bookingId}/reschedule` với `rescheduleToken` và thời gian mới
