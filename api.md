🟢 A. Doanh thu (Revenue)

Trong tài liệu có module:

Billing – Statistics
GET /api/receptionist/billing/stats


Query:
GET
/api/receptionist/billing/stats


Parameters

date
clinicId

clinicId?

date (YYYY-MM)

Trả về:

{
  "totalRevenue": number,
  "paidBills": number,
  "unpaidBills": number
}


➡ UI mapping:

UI	API
450,000,000 VND	totalRevenue
% so với tháng trước	FE tự tính:
thisMonth - lastMonth / lastMonth × 100	

➡ FE phải gọi:

GET /billing/stats?date=2026-01
GET /billing/stats?date=2025-12

🟢 B. Lượt khám (Visits)

Trong tài liệu:

GET /api/receptionist/appointments


Query:

fromDate

toDate

status=completed

clinicId

➡ Đếm số appointment đã hoàn thành trong tháng

FE gọi:

/appointments?fromDate=2026-01-01&toDate=2026-01-31&status=completed


→ totalVisits = data.length

➡ % tăng so với tháng trước:
So sánh với /appointments?fromDate=2025-12-01&toDate=2025-12-31&status=completed

🟢 C. Bệnh nhân mới

Trong tài liệu:

GET /api/patient


Patient có createdAt

FE:

lọc patient có createdAt trong tháng này

count

So sánh với tháng trước để ra %

2️⃣ Nút “Xuất báo cáo” trên từng card

FE không cần API mới.
FE dùng API đã có và:

generate file Excel / CSV / PDF client-side
hoặc

gọi backend nếu có:

GET /api/admin/reports/export?type=revenue&month=2026-01


(backend chưa có → FE export)

3️⃣ “Báo cáo chi tiết” bên dưới
A. Báo cáo doanh thu theo dịch vụ

UI: “Báo cáo doanh thu tháng 12/2024 – theo dịch vụ”

Trong tài liệu:

GET /api/receptionist/bills


Bills có:

serviceName

amount

paidAt

FE:

gọi /bills?fromDate&toDate

group by serviceName

sum amount

B. Báo cáo hoạt động bác sĩ

Dùng:

GET /api/receptionist/appointments?fromDate&toDate&status=completed


Group by:

doctorId

count số lượt

C. Báo cáo bệnh nhân

Dùng:

GET /api/patient


Group:

patient.createdAt → new

appointment count → returning

4️⃣ API call plan cho màn hình Report

FE nên gọi song song:

Mục	API
Doanh thu	/billing/stats?date=thisMonth
Doanh thu tháng trước	/billing/stats?date=lastMonth
Lượt khám	/appointments?from&to&status=completed
Bệnh nhân	/patient

Dùng React Query:

["billingStats", month]
["appointments", month]
["patients"]

5️⃣ Kết luận

Màn hình Báo cáo của bạn có thể được build 100% từ API hiện tại nếu FE:

biết lọc theo ngày

biết group + aggregate ở FE

Bạn chưa cần backend viết thêm report API.