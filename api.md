
### 1️⃣ Lấy Thông Tin Bệnh Nhân (Tên, Profile)
**Endpoint**: `GET /api/patient/profile`  
**Authentication**: Required (Bearer Token - PatientOnly)  
**Response**: `ApiResponse<PatientProfileResponse>`
```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "fullName": "Nguyễn Văn A",
    "gender": "Male",
    "dob": "1999-01-15",
    "phone": "0909xxxx",
    "email": "a@gmail.com",
    "address": "string",
    "allergy": "string",
    "chronicDisease": "string",
    "emergencyName": "string",
    "emergencyPhone": "string",
    "bloodGroup": "string",
    "insuranceType": "string",
    "insuranceNumber": "string"
  }
}
```

**Mục đích**: 
- Hiển thị "Xin chào, {fullName}!" trong header
- Lấy `id` từ response để dùng làm patientId (nếu cần)
- Dùng cho trang cá nhân

---

### 2️⃣ Lấy Danh Sách Lịch Hẹn (Appointments)
**Endpoint**: `GET /api/patient/appointments`  
**Authentication**: Required (Bearer Token - PatientOnly)  
**Query Parameters** (Optional):
- `patientId`: string($uuid) - có thể không cần vì lấy từ token
- `phone`: string - có thể filter theo phone

**Response**: `ApiResponse<List<AppointmentListItemDto>>`
```json
{
  "isSuccess": true,
  "data": [
    {
      "id": "uuid",
      "title": "Khám định kỳ",
      "doctor": "BS. Nguyễn Văn A",
      "startAt": "2024-12-28T10:00:00",
      "status": "Confirmed",
      "note": "string"
    },
    {
      "id": "uuid",
      "title": "Tẩy trắng răng",
      "doctor": "BS. Trần Thị B",
      "startAt": "2025-01-05T14:00:00",
      "status": "Pending",
      "note": "string"
    }
  ]
}
```

**Mục đích**: 
- Lấy TẤT CẢ appointments của patient hiện tại
- **Filter trên FE** để lấy:
  - Upcoming appointments: `status === "Confirmed" || status === "Pending"` và `startAt > now()`
  - Đếm số lượng upcoming appointments cho stats card
- Format `startAt` từ ISO DateTime → "DD/MM/YYYY • HH:mm"
- Map `status`:
  - `Confirmed` → "Đã xác nhận" (green badge)
  - `Pending` → "Chờ xác nhận" (yellow badge)
  - `Completed` → "Hoàn thành" (blue badge)
  - `Cancelled` → "Đã hủy" (red badge)

---

### 3️⃣ Lấy Lịch Sử Điều Trị (Medical Records)
**Endpoint**: `GET /api/patient/medical-records`  
**Authentication**: Required (Bearer Token - PatientOnly)  
**Response**: `ApiResponse<List<MedicalRecordListItemDto>>`
```json
{
  "isSuccess": true,
  "data": [
    {
      "id": "uuid",
      "title": "Trám răng",
      "doctor": "BS. Lê Văn C",
      "date": "2024-12-10",
      "diagnosis": "string",
      "treatment": "string",
      "prescription": "string",
      "notes": "string",
      "attachments": []
    },
    {
      "id": "uuid",
      "title": "Khám tổng quát",
      "doctor": "BS. Nguyễn Văn A",
      "date": "2024-11-22",
      "diagnosis": "string",
      "treatment": "string",
      "prescription": "string",
      "notes": "string",
      "attachments": []
    }
  ]
}
```

**Mục đích**: 
- Hiển thị lịch sử điều trị (treatment history)
- **Map data**:
  - `title` → serviceName
  - `doctor` → doctorName
  - `date` → date (format: DD/MM/YYYY)
- **Đếm số lượng** completed treatments cho stats card
- **Lấy ngày gần nhất** (`date` lớn nhất) cho stats card "Lần khám gần nhất"

---

### 📊 Tính Toán Stats Cards (Từ API Data)

**KHÔNG có API `/api/patients/{patientId}/dashboard-summary`**, nên cần tính toán từ data:

#### Card 1: Lịch hẹn sắp tới
```typescript
const upcomingCount = appointments.filter(apt => {
  const aptDate = new Date(apt.startAt);
  const now = new Date();
  return (apt.status === "Confirmed" || apt.status === "Pending") && aptDate > now;
}).length;
```

#### Card 2: Điều trị hoàn thành
```typescript
const completedCount = medicalRecords.length; // Hoặc filter theo status nếu có
```

#### Card 3: Lần khám gần nhất
```typescript
const lastVisit = medicalRecords.length > 0 
  ? medicalRecords.reduce((latest, record) => {
      return new Date(record.date) > new Date(latest.date) ? record : latest;
    }).date
  : null;
```

---

## 🔄 Flow Xử Lý Data

### Step 1: Component Mount
```typescript
useEffect(() => {
  fetchDashboardData();
}, []);
```

### Step 2: Fetch Data Sequence
```
1. Parallel Fetch (Promise.all) - Tất cả đều dùng JWT token, không cần patientId:
   ├─ GET /api/patient/profile → Patient name + id
   ├─ GET /api/patient/appointments → Tất cả appointments
   └─ GET /api/patient/medical-records → Tất cả medical records
   ↓
2. Tính toán stats từ data:
   ├─ Upcoming appointments: Filter appointments (status + date > now)
   ├─ Completed treatments: Count medical records
   └─ Last visit: Max date từ medical records
   ↓
3. Filter và limit data cho UI:
   ├─ Upcoming appointments: Lấy 2 items đầu tiên
   └─ Treatment history: Lấy 3 items đầu tiên
   ↓
4. Map data to UI state
   ↓
5. Update component
```

---

## 📝 Code Structure

### State Management
```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [patientName, setPatientName] = useState("");
const [stats, setStats] = useState([...]);
const [upcomingAppointments, setUpcomingAppointments] = useState([]);
const [treatments, setTreatments] = useState([]);
```

### Helper Functions
```typescript
// Format ISO Date → DD/MM/YYYY
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Format ISO DateTime → DD/MM/YYYY • HH:mm
const formatDateTime = (isoDateTime: string): { date: string; time: string } => {
  const date = new Date(isoDateTime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return {
    date: `${day}/${month}/${year}`,
    time: `${hours}:${minutes}`,
  };
};

// Map API status → UI status
const mapStatus = (apiStatus: string): { label: string; className: string } => {
  const statusMap: Record<string, { label: string; className: string }> = {
    CONFIRMED: { label: "Đã xác nhận", className: "bg-emerald-100 text-emerald-700" },
    PENDING: { label: "Chờ xác nhận", className: "bg-amber-100 text-amber-700" },
    UPCOMING: { label: "Sắp tới", className: "bg-blue-100 text-blue-700" },
  };
  return statusMap[apiStatus] || { label: apiStatus, className: "bg-gray-100 text-gray-700" };
};
```

---

## 🎨 UI Mapping

### Header Section
```tsx
<h1>Xin chào, {patientName || "Bệnh nhân"}!</h1>
```

### Stats Cards
```tsx
{stats.map((stat, index) => (
  <div key={index}>
    <Icon />
    <p>{stat.label}</p>
    <p>{stat.value}</p>
  </div>
))}
```

**Data mapping**:
- Card 1: `dashboardSummary.upcomingAppointments` → value
- Card 2: `dashboardSummary.completedTreatments` → value
- Card 3: `formatDate(dashboardSummary.lastVisit)` → value

### Upcoming Appointments
```tsx
{upcomingAppointments.map((apt) => {
  const { date, time } = formatDateTime(apt.time);
  const status = mapStatus(apt.status);
  return (
    <div key={apt.id}>
      <p>{apt.serviceName}</p>
      <p>{apt.doctorName}</p>
      <p>{date} • {time}</p>
      <span className={status.className}>{status.label}</span>
    </div>
  );
})}
```

### Treatment History
```tsx
{treatments.map((treatment) => (
  <div key={treatment.id}>
    <p>{treatment.serviceName}</p>
    <p>{treatment.doctorName}</p>
    <p>{formatDate(treatment.date)}</p>
  </div>
))}
```

---

## ⚠️ Error Handling

### Loading State
```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p>Đang tải dữ liệu...</p>
    </div>
  );
}
```

### Error State
```tsx
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <p className="text-red-600">Lỗi: {error}</p>
      <button onClick={() => window.location.reload()}>
        Thử lại
      </button>
    </div>
  );
}
```

### Try-Catch trong Fetch
```typescript
try {
  // Fetch data...
} catch (err: unknown) {
  const errorMessage = err instanceof Error 
    ? err.message 
    : "Có lỗi xảy ra khi tải dữ liệu";
  setError(errorMessage);
} finally {
  setLoading(false);
}
```

---

## 🔐 Authentication

### ⚠️ QUAN TRỌNG: Không có `/api/auth/me`

**Backend KHÔNG có endpoint `/api/auth/me`** để lấy thông tin user từ token.

**Giải pháp**:
- Tất cả API `/api/patient/*` **tự động lấy patientId từ JWT token**
- Không cần truyền `patientId` vào URL hoặc query params
- Backend decode JWT token và tự động filter data theo patient hiện tại

### Cách lấy patientId (nếu thực sự cần):

**Option 1**: Decode JWT token trên FE (không khuyến khích, chỉ để debug):
```typescript
const token = localStorage.getItem('accessToken');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const patientId = payload.patientId; // hoặc payload.sub, tùy backend
}
```

**Option 2**: Lấy từ `/api/patient/profile` response:
```typescript
const profileRes = await getPatientProfile();
const patientId = profileRes.data.id; // patientId từ profile
```

**Option 3**: Không cần patientId - dùng trực tiếp các API `/api/patient/*`

### Authorization Header

Tất cả API calls cần có **Authorization header**:
```typescript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  'Content-Type': 'application/json'
}
```

Hoặc dùng axios instance đã config sẵn interceptor (như trong `api.customize.ts`).

---

## ✅ Checklist Implementation

- [ ] Tạo/cập nhật API service functions trong `apiPatient.ts`:
  - [ ] `getPatientProfile()` - GET /api/patient/profile
  - [ ] `getPatientAppointments()` - GET /api/patient/appointments  
  - [ ] `getMedicalRecords()` - GET /api/patient/medical-records
- [ ] Implement `useEffect` để fetch data khi component mount
- [ ] **Tính toán stats từ data** (không có API dashboard-summary):
  - [ ] Filter upcoming appointments từ appointments list
  - [ ] Đếm completed treatments từ medical records
  - [ ] Tìm last visit từ medical records
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Format dates (ISO → DD/MM/YYYY)
- [ ] Format datetimes (ISO → DD/MM/YYYY • HH:mm)
- [ ] Map API status → UI status labels
- [ ] Filter và limit data cho UI (2 appointments, 3 treatments)
- [ ] Update UI với real data từ API
- [ ] Test với real backend
- [ ] Handle empty states (no appointments, no treatments)

---

## 📚 File References

- **API Service**: `src/services/apiPatient.ts`
- **Dashboard Component**: `src/pages/patient/dashboard.tsx`
- **API Config**: `src/services/api.customize.ts` (axios instance với interceptors)

---

## 🚀 Quick Start Code Template

```typescript
import { useEffect, useState } from 'react';
import {
  getPatientProfile,
  getPatientAppointments,
  getMedicalRecords,
} from '../../services/apiPatient';

const PatientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [stats, setStats] = useState([
    { icon: FiCalendar, label: "Lịch hẹn sắp tới", value: "0", color: "text-[#2563EB]", bg: "bg-blue-50" },
    { icon: FiClipboard, label: "Điều trị hoàn thành", value: "0", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: FiClock, label: "Lần khám gần nhất", value: "N/A", color: "text-purple-600", bg: "bg-purple-50" },
  ]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Step 1: Fetch all data in parallel (không cần patientId, lấy từ token)
        const [profileRes, appointmentsRes, medicalRecordsRes] = 
          await Promise.all([
            getPatientProfile(),
            getPatientAppointments(),
            getMedicalRecords(),
          ]);
        
        // Step 2: Update patient name
        if (profileRes?.isSuccess && profileRes.data) {
          setPatientName(profileRes.data.fullName);
        }
        
        // Step 3: Calculate stats from appointments
        if (appointmentsRes?.isSuccess && appointmentsRes.data) {
          const now = new Date();
          const upcoming = appointmentsRes.data.filter((apt: any) => {
            const aptDate = new Date(apt.startAt);
            return (apt.status === "Confirmed" || apt.status === "Pending") && aptDate > now;
          });
          
          // Step 4: Calculate stats from medical records
          const completedCount = medicalRecordsRes?.isSuccess && medicalRecordsRes.data 
            ? medicalRecordsRes.data.length 
            : 0;
          
          const lastVisit = medicalRecordsRes?.isSuccess && medicalRecordsRes.data && medicalRecordsRes.data.length > 0
            ? medicalRecordsRes.data.reduce((latest: any, record: any) => {
                return new Date(record.date) > new Date(latest.date) ? record : latest;
              }).date
            : null;
          
          // Step 5: Update stats
          setStats([
            { icon: FiCalendar, label: "Lịch hẹn sắp tới", value: String(upcoming.length), color: "text-[#2563EB]", bg: "bg-blue-50" },
            { icon: FiClipboard, label: "Điều trị hoàn thành", value: String(completedCount), color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: FiClock, label: "Lần khám gần nhất", value: lastVisit ? formatDate(lastVisit) : "N/A", color: "text-purple-600", bg: "bg-purple-50" },
          ]);
          
          // Step 6: Filter và limit upcoming appointments (lấy 2 items đầu)
          setUpcomingAppointments(upcoming.slice(0, 2).map((apt: any) => {
            const { date, time } = formatDateTime(apt.startAt);
            return {
              id: apt.id,
              title: apt.title,
              doctor: apt.doctor,
              date,
              time,
              status: apt.status.toLowerCase(),
            };
          }));
        }
        
        // Step 7: Map medical records to treatments (lấy 3 items đầu)
        if (medicalRecordsRes?.isSuccess && medicalRecordsRes.data) {
          setTreatments(medicalRecordsRes.data.slice(0, 3).map((record: any) => ({
            id: record.id,
            title: record.title,
            doctor: record.doctor,
            date: formatDate(record.date),
          })));
        }
        
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Render UI...
};
```

---

**Happy Coding! 🎉**
