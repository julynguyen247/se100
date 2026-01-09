GET /api/receptionist/appointments/today
Query parameters

Tên	Kiểu	Mô tả
clinicId	guid?	Lọc theo phòng khám
limit	int	Số lượng kết quả trả về (mặc định 5)
Response trả về
[
  {
    "id": "guid",
    "patientName": "string",
    "phone": "string",
    "service": "string",
    "doctor": "string",
    "date": "2026-01-07",
    "time": "08:00",
    "duration": 30,
    "status": "confirmed | pending | checked-in | cancelled",
    "notes": "string?"
  }
]