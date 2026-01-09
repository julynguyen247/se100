# Doctor Module API Specification v1.0

**Project**: Clinic Management System  
**Module**: Doctor Portal  
**Last Updated**: 2026-01-08  
**Total Endpoints**: 18

---

## Table of Contents

1. [Dashboard Statistics](#1-dashboard-statistics)
2. [Queue Management](#2-queue-management)
3. [Patient Management](#3-patient-management)
4. [Medical Record Management](#4-medical-record-management)
5. [Prescription Templates](#5-prescription-templates-optional)
6. [Common Specifications](#common-specifications)

---

## 1. Dashboard Statistics

### 1.1 Get Dashboard Stats

**Endpoint**: `GET /api/doctor/dashboard/stats`

**Authentication**: ✅ Required (JWT Bearer - Doctor role)

**Query Parameters**: None

**Response** (200 OK):

```json
{
    "IsSuccess": true,
    "Message": "Dashboard stats retrieved successfully",
    "Data": {
        "WaitingCount": 8,
        "ExaminedToday": 12,
        "AverageExamTime": "25 phút",
        "AppointmentsToday": 15,
        "WaitingQueue": [
            {
                "Id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "QueueNumber": 1,
                "PatientName": "Nguyễn Văn A",
                "Service": "Khám tổng quát",
                "Time": "08:30",
                "Status": "waiting"
            },
            {
                "Id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
                "QueueNumber": 2,
                "PatientName": "Trần Thị B",
                "Service": "Trám răng",
                "Time": "09:00",
                "Status": "checkedin"
            }
        ]
    }
}
```

**Response Schema**:

```typescript
{
    IsSuccess: boolean;
    Message: string;
    Data: {
        WaitingCount: number; // Số BN chờ khám (status: confirmed/checkedin)
        ExaminedToday: number; // Số BN đã khám (status: completed) hôm nay
        AverageExamTime: string; // Thời gian khám trung bình
        AppointmentsToday: number; // Tổng số lịch hẹn hôm nay
        WaitingQueue: Array<{
            Id: string; // Appointment ID (UUID)
            QueueNumber: number; // Số thứ tự hàng chờ
            PatientName: string;
            Service: string; // Tên dịch vụ
            Time: string; // Giờ hẹn (HH:mm format)
            Status: 'pending' | 'confirmed' | 'checkedin' | 'inprogress';
        }>;
    }
}
```

**Business Logic**:

-   Filter appointments by `DoctorId` (from JWT) + today's date
-   `WaitingCount`: Count where `Status` = Confirmed OR CheckedIn
-   `ExaminedToday`: Count where `Status` = Completed AND date = today
-   `AverageExamTime`: Calculate from `(EndAt - StartAt)` for completed appointments today
-   `WaitingQueue`: Return first 5 appointments with status Confirmed/CheckedIn, ordered by `StartAt`

**Error Responses**:

401 Unauthorized:

```json
{
    "IsSuccess": false,
    "Message": "Unauthorized. Please login as doctor.",
    "Data": null
}
```

---

## 2. Queue Management

### 2.1 Get Doctor Queue

**Endpoint**: `GET /api/doctor/queue`

**Authentication**: ✅ Required

**Query Parameters**:

| Parameter | Type   | Required | Default | Description              |
| --------- | ------ | -------- | ------- | ------------------------ |
| date      | string | No       | today   | Date filter (YYYY-MM-DD) |

**Example**: `GET /api/doctor/queue?date=2026-01-08`

**Response** (200 OK):

```json
{
    "IsSuccess": true,
    "Message": "Queue retrieved successfully",
    "Data": [
        {
            "Id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "QueueNumber": 1,
            "AppointmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "PatientId": "p1a2b3c4-d5e6-7890-abcd-ef1234567890",
            "PatientName": "Nguyễn Văn A",
            "PatientPhone": "0901234567",
            "Service": "Khám tổng quát",
            "ServiceId": "s1a2b3c4-d5e6-7890-abcd-ef1234567890",
            "ScheduledTime": "2026-01-08T08:30:00Z",
            "StartTime": null,
            "EndTime": null,
            "Status": "confirmed"
        },
        {
            "Id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
            "QueueNumber": 2,
            "AppointmentId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
            "PatientId": "p2b3c4d5-e6f7-8901-bcde-f12345678901",
            "PatientName": "Trần Thị B",
            "PatientPhone": "0912345678",
            "Service": "Trám răng",
            "ServiceId": "s2b3c4d5-e6f7-8901-bcde-f12345678901",
            "ScheduledTime": "2026-01-08T09:00:00Z",
            "StartTime": "2026-01-08T09:05:00Z",
            "EndTime": null,
            "Status": "inprogress"
        }
    ]
}
```

**Status Values** (lowercase from `AppointmentStatus` enum):

-   `pending` - Chờ xác nhận
-   `confirmed` - Đã xác nhận
-   `checkedin` - Đã check-in (sẵn sàng khám)
-   `inprogress` - Đang khám
-   `completed` - Hoàn thành
-   `cancelled` - Đã hủy
-   `noshow` - Không đến

**Business Logic**:

-   Filter by `DoctorId` (from JWT) + `date` parameter
-   Exclude `cancelled` and `noshow` appointments
-   Order by `StartAt` ascending
-   Assign sequential `QueueNumber` (1, 2, 3...)
-   `StartTime` và `EndTime` track actual examination time (different from `StartAt`/`EndAt`)

---

### 2.2 Start Examination

**Endpoint**: `PUT /api/doctor/queue/{appointmentId}/start`

**Authentication**: ✅ Required

**Path Parameters**:

| Parameter     | Type | Required | Description    |
| ------------- | ---- | -------- | -------------- |
| appointmentId | UUID | Yes      | Appointment ID |

**Request Body**: None

**Response** (200 OK):

```json
{
    "IsSuccess": true,
    "Message": "Examination started successfully",
    "Data": {
        "AppointmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "Status": "inprogress",
        "StartTime": "2026-01-08T08:32:15Z"
    }
}
```

**Business Logic**:

-   Update `Appointment.Status` to `InProgress`
-   Record actual start time (could use `UpdatedAt` or new field `ActualStartTime`)
-   Validate: appointment belongs to this doctor
-   Validate: current status is `Confirmed` or `CheckedIn`

**Error Responses**:

400 Bad Request:

```json
{
    "IsSuccess": false,
    "Message": "Cannot start examination. Current status: inprogress",
    "Data": null
}
```

404 Not Found:

```json
{
    "IsSuccess": false,
    "Message": "Appointment not found",
    "Data": null
}
```

403 Forbidden:

```json
{
    "IsSuccess": false,
    "Message": "This appointment belongs to another doctor",
    "Data": null
}
```

---

### 2.3 Complete Examination

**Endpoint**: `PUT /api/doctor/queue/{appointmentId}/complete`

**Authentication**: ✅ Required

**Path Parameters**:

| Parameter     | Type | Required | Description    |
| ------------- | ---- | -------- | -------------- |
| appointmentId | UUID | Yes      | Appointment ID |

**Request Body**: None

**Response** (200 OK):

```json
{
    "IsSuccess": true,
    "Message": "Examination completed successfully",
    "Data": {
        "AppointmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "Status": "completed",
        "EndTime": "2026-01-08T08:57:43Z",
        "Duration": "25 minutes"
    }
}
```

**Business Logic**:

-   Update `Appointment.Status` to `Completed`
-   Record actual end time
-   Calculate duration
-   Validate: current status is `InProgress`

**Error Responses**:

400 Bad Request:

```json
{
    "IsSuccess": false,
    "Message": "Examination has not been started yet",
    "Data": null
}
```

---

## 3. Patient Management

### 3.1 Get Doctor's Patients

**Endpoint**: `GET /api/doctor/patients`

**Authentication**: ✅ Required

**Query Parameters**:

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| search    | string | No       | Search by name or phone |

**Example**: `GET /api/doctor/patients?search=Nguyễn`

**Response** (200 OK):

```json
{
    "IsSuccess": true,
    "Message": "Patients retrieved successfully",
    "Data": [
        {
            "Id": "p1a2b3c4-d5e6-7890-abcd-ef1234567890",
            "Name": "Nguyễn Văn A",
            "Phone": "0901234567",
            "Email": "nguyenvana@email.com",
            "LastVisit": "2024-12-10T08:30:00Z",
            "TotalVisits": 5
        },
        {
            "Id": "p2b3c4d5-e6f7-8901-bcde-f12345678901",
            "Name": "Nguyễn Thị B",
            "Phone": "0912345678",
            "Email": null,
            "LastVisit": "2024-11-22T09:00:00Z",
            "TotalVisits": 3
        }
    ]
}
```

**Business Logic**:

-   Return patients who have had appointments with this doctor
-   `TotalVisits`: Count completed appointments with this doctor
-   `LastVisit`: Latest completed appointment date
-   Search: `LIKE %search%` on `FullName` or `PrimaryPhone`
-   Order by `LastVisit` DESC (most recent first)

---

### 3.2 Get Patient Detail

**Endpoint**: `GET /api/doctor/patients/{patientId}`

**Authentication**: ✅ Required

**Path Parameters**:

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| patientId | UUID | Yes      | Patient ID  |

**Response** (200 OK):

```json
{
    "IsSuccess": true,
    "Message": "Patient detail retrieved successfully",
    "Data": {
        "Id": "p1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "Name": "Nguyễn Văn A",
        "Phone": "0901234567",
        "Email": "nguyenvana@email.com",
        "Dob": "1990-05-15T00:00:00Z",
        "Gender": "Male",
        "Address": "123 Nguyễn Huệ, Q1, TP.HCM",
        "Allergy": "Penicillin",
        "ChronicDisease": "Cao huyết áp",
        "LastVisit": "2024-12-10T08:30:00Z",
        "TotalVisits": 5,
        "MedicalHistory": [
            {
                "Id": "m1a2b3c4-d5e6-7890-abcd-ef1234567890",
                "RecordDate": "2024-12-10T08:30:00Z",
                "Doctor": "BS. Nguyễn Văn B",
                "Service": "Khám răng",
                "Diagnosis": "Sâu răng cấp độ 2",
                "Notes": "Tái khám sau 2 tuần"
            }
        ],
        "UpcomingAppointments": [
            {
                "Id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "StartAt": "2026-01-15T09:00:00Z",
                "Service": "Tẩy trắng răng",
                "Status": "confirmed"
            }
        ]
    }
}
```

**Business Logic**:

-   Return patient basic info + medical history + upcoming appointments
-   `MedicalHistory`: Medical records where `DoctorId` = current doctor (privacy filter)
-   `UpcomingAppointments`: Future appointments with this doctor
-   Limit medical history to 10 most recent records

**Error Responses**:

404 Not Found:

```json
{
    "IsSuccess": false,
    "Message": "Patient not found",
    "Data": null
}
```

---

## 4. Medical Record Management

### 4.1 Create Medical Record

**Endpoint**: `POST /api/doctor/medical-records`

**Authentication**: ✅ Required

**Request Body**:

```json
{
    "AppointmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "PatientId": "p1a2b3c4-d5e6-7890-abcd-ef1234567890",
    "Title": "Khám răng định kỳ",
    "Diagnosis": "Sâu răng cấp độ 2 tại răng số 16",
    "Treatment": "Trám răng composite",
    "Prescription": "Paracetamol 500mg - Uống 2 lần/ngày sau ăn - 10 viên\nIbuprofen 400mg - Uống khi đau, tối đa 3 lần/ngày - 10 viên",
    "Notes": "Tái khám sau 2 tuần để kiểm tra. Tránh ăn cứng bên răng trám.\n\nTrạng thái răng:\n- Răng 16: Sâu răng\n- Răng 23: Đã trám"
}
```

**Request Schema**:

| Field         | Type   | Required | Max Length | Description                                  |
| ------------- | ------ | -------- | ---------- | -------------------------------------------- |
| AppointmentId | UUID   | Yes      | -          | Link to appointment                          |
| PatientId     | UUID   | Yes      | -          | Patient ID                                   |
| Title         | string | Yes      | 200        | Record title/summary                         |
| Diagnosis     | string | No       | 2000       | Diagnosis details                            |
| Treatment     | string | No       | 2000       | Treatment performed                          |
| Prescription  | string | No       | 5000       | Medicine list (formatted text with newlines) |
| Notes         | string | No       | 5000       | Additional notes (can include tooth status)  |

> **Note**: `ToothStatus` is not a separate field in current DB schema. Store dental chart data in `Notes` field with clear formatting, or extend DB schema to add `ToothStatusJson` TEXT/JSONB column for structured storage.

**Response** (201 Created):

```json
{
    "IsSuccess": true,
    "Message": "Medical record created successfully",
    "Data": {
        "RecordId": "r1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "CreatedAt": "2026-01-08T10:00:00Z"
    }
}
```

**Business Logic**:

-   Set `DoctorId` from JWT (authenticated doctor)
-   Set `ClinicId` from appointment or doctor's clinic
-   Set `RecordDate` to current UTC time
-   Set `CreatedAt` and `UpdatedAt` to current UTC time
-   Validate: `AppointmentId` exists and belongs to this doctor
-   Validate: `PatientId` matches appointment's patient

**Error Responses**:

400 Bad Request:

```json
{
    "IsSuccess": false,
    "Message": "Validation failed",
    "Data": {
        "Title": ["Title is required"],
        "Diagnosis": ["Diagnosis cannot exceed 2000 characters"]
    }
}
```

404 Not Found:

```json
{
    "IsSuccess": false,
    "Message": "Appointment not found or does not belong to you",
    "Data": null
}
```

---

### 4.2 Update Medical Record

**Endpoint**: `PUT /api/doctor/medical-records/{recordId}`

**Authentication**: ✅ Required

**Path Parameters**:

| Parameter | Type | Required | Description       |
| --------- | ---- | -------- | ----------------- |
| recordId  | UUID | Yes      | Medical Record ID |

**Request Body**: Same as Create (AppointmentId optional for update)

**Response** (200 OK):

```json
{
    "IsSuccess": true,
    "Message": "Medical record updated successfully",
    "Data": {
        "RecordId": "r1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "UpdatedAt": "2026-01-08T10:15:00Z"
    }
}
```

**Business Logic**:

-   Validate: record exists and `DoctorId` matches current doctor
-   Update allowed fields
-   Update `UpdatedAt` timestamp

**Error Responses**:

403 Forbidden:

```json
{
    "IsSuccess": false,
    "Message": "You can only edit your own medical records",
    "Data": null
}
```

---

### 4.3 Get Medical Record Detail

**Endpoint**: `GET /api/doctor/medical-records/{recordId}`

**Authentication**: ✅ Required

**Response** (200 OK):

```json
{
    "IsSuccess": true,
    "Message": "Medical record retrieved successfully",
    "Data": {
        "Id": "r1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "Title": "Khám răng định kỳ",
        "Doctor": "BS. Nguyễn Văn B",
        "RecordDate": "2026-01-08T10:00:00Z",
        "Diagnosis": "Sâu răng cấp độ 2 tại răng số 16",
        "Treatment": "Trám răng composite",
        "Prescription": "Paracetamol 500mg - Uống 2 lần/ngày sau ăn - 10 viên\nIbuprofen 400mg - Uống khi đau - 10 viên",
        "Notes": "Tái khám sau 2 tuần",
        "Attachments": []
    }
}
```

---

### 4.4 Save Complete Examination (Treatment Workflow)

**Endpoint**: `POST /api/doctor/examinations`

**Authentication**: ✅ Required

**Description**: Save complete examination data including diagnosis, treatment, dental chart, prescription and trigger bill creation. This is a comprehensive endpoint for the treatment workflow.

**Request Body**:

```json
{
    "AppointmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "PatientId": "p1a2b3c4-d5e6-7890-abcd-ef1234567890",
    "Reason": "Đau răng hàm dưới bên phải",
    "Diagnosis": "Sâu răng cấp độ 2 tại răng số 16, viêm nướu nhẹ",
    "Treatment": "Trám răng composite, vệ sinh răng miệng",
    "ToothStatus": {
        "16": "cavity",
        "17": "treated",
        "23": "normal"
    },
    "Prescription": {
        "Medicines": [
            {
                "Name": "Paracetamol",
                "Dosage": "500mg",
                "Quantity": "10 viên",
                "Instructions": "Uống 1-2 viên khi đau, cách 4-6 giờ"
            },
            {
                "Name": "Ibuprofen",
                "Dosage": "400mg",
                "Quantity": "10 viên",
                "Instructions": "Uống 1 viên sau ăn, 2-3 lần/ngày"
            }
        ],
        "Notes": "Uống thuốc sau khi ăn no. Không dùng quá 6 viên Paracetamol/ngày."
    },
    "Notes": "Tái khám sau 2 tuần để kiểm tra. Tránh ăn cứng bên răng trám.",
    "FollowUpDate": "2026-01-22",
    "CreateBill": true
}
```

**Request Schema**:

| Field         | Type    | Required | Description                                    |
| ------------- | ------- | -------- | ---------------------------------------------- |
| AppointmentId | UUID    | Yes      | Link to appointment                            |
| PatientId     | UUID    | Yes      | Patient ID                                     |
| Reason        | string  | No       | Reason for visit / Chief complaint             |
| Diagnosis     | string  | Yes      | Diagnosis details                              |
| Treatment     | string  | Yes      | Treatment performed                            |
| ToothStatus   | object  | No       | Dental chart (tooth number → status mapping)   |
| Prescription  | object  | No       | Prescription details (Medicines array + Notes) |
| Notes         | string  | No       | Additional notes                               |
| FollowUpDate  | string  | No       | Follow-up date (YYYY-MM-DD)                    |
| CreateBill    | boolean | No       | Trigger bill creation (default: false)         |

**Tooth Status Values**:

-   `normal` - Bình thường
-   `cavity` - Sâu răng
-   `missing` - Mất răng
-   `treated` - Đã điều trị
-   `crown` - Răng sứ
-   `nextTreatment` - Điều trị kế tiếp

**Response** (201 Created):

```json
{
    "IsSuccess": true,
    "Message": "Examination saved successfully",
    "Data": {
        "ExaminationId": "e1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "MedicalRecordId": "r1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "BillId": "b1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "CreatedAt": "2026-01-08T10:00:00Z"
    }
}
```

**Business Logic**:

-   Create `MedicalRecord` with all examination data
-   Store `ToothStatus` as JSON in `Notes` or dedicated `ToothStatusJson` field
-   Parse `Prescription.Medicines` array and format as text for `Prescription` field:

    ```
    Paracetamol 500mg - Uống 1-2 viên khi đau - 10 viên
    Ibuprofen 400mg - Uống 1 viên sau ăn - 10 viên

    Lời dặn: Uống thuốc sau khi ăn no...
    ```

-   If `CreateBill: true`, create Bill/Invoice record and link to appointment
-   Update appointment status to `Completed`
-   Set `DoctorId` from JWT
-   Set `RecordDate` to current UTC time

**Error Responses**:

400 Bad Request:

```json
{
    "IsSuccess": false,
    "Message": "Validation failed",
    "Data": {
        "Diagnosis": ["Diagnosis is required"],
        "Treatment": ["Treatment is required"]
    }
}
```

404 Not Found:

```json
{
    "IsSuccess": false,
    "Message": "Appointment not found or does not belong to you",
    "Data": null
}
```

---

## 5. Standalone Prescription Management

### 5.1 Create Prescription

**Endpoint**: `POST /api/doctor/prescriptions`

**Authentication**: ✅ Required

**Description**: Create standalone prescription (not part of examination workflow). Useful for follow-up prescriptions or prescription adjustments.

**Request Body**:

```json
{
    "PatientId": "p1a2b3c4-d5e6-7890-abcd-ef1234567890",
    "AppointmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "Medicines": [
        {
            "Name": "Amoxicillin",
            "Dosage": "500mg",
            "Quantity": "21 viên",
            "Instructions": "Uống 3 lần/ngày sau ăn"
        },
        {
            "Name": "Paracetamol",
            "Dosage": "500mg",
            "Quantity": "10 viên",
            "Instructions": "Uống khi đau, tối đa 3 lần/ngày"
        }
    ],
    "Notes": "Uống kháng sinh đủ liệu trình 7 ngày. Không súc miệng mạnh."
}
```

**Request Schema**:

| Field         | Type   | Required | Description                    |
| ------------- | ------ | -------- | ------------------------------ |
| PatientId     | UUID   | Yes      | Patient ID                     |
| AppointmentId | UUID   | No       | Optional link to appointment   |
| Medicines     | array  | Yes      | List of medicines (min 1)      |
| Notes         | string | No       | Instructions/notes for patient |

**Medicine Object**:

| Field        | Type   | Required | Description              |
| ------------ | ------ | -------- | ------------------------ |
| Name         | string | Yes      | Medicine name            |
| Dosage       | string | No       | Dosage (e.g., 500mg)     |
| Quantity     | string | No       | Quantity (e.g., 20 viên) |
| Instructions | string | No       | Usage instructions       |

**Response** (201 Created):

```json
{
    "IsSuccess": true,
    "Message": "Prescription created successfully",
    "Data": {
        "PrescriptionId": "rx1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "CreatedAt": "2026-01-08T11:30:00Z"
    }
}
```

**Business Logic**:

-   Set `DoctorId` from JWT
-   Set `CreatedAt` to current UTC time
-   Validate: At least 1 medicine required
-   Validate: PatientId exists
-   Optional: Link to AppointmentId if provided

**Error Responses**:

400 Bad Request:

```json
{
    "IsSuccess": false,
    "Message": "Validation failed",
    "Data": {
        "Medicines": ["At least one medicine is required"],
        "PatientId": ["Patient not found"]
    }
}
```

---

### 5.2 Update Prescription

**Endpoint**: `PUT /api/doctor/prescriptions/{prescriptionId}`

**Authentication**: ✅ Required

**Path Parameters**:

| Parameter      | Type | Required | Description     |
| -------------- | ---- | -------- | --------------- |
| prescriptionId | UUID | Yes      | Prescription ID |

**Request Body**: Same as Create Prescription

**Response** (200 OK):

```json
{
    "IsSuccess": true,
    "Message": "Prescription updated successfully",
    "Data": {
        "PrescriptionId": "rx1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "UpdatedAt": "2026-01-08T11:35:00Z"
    }
}
```

**Business Logic**:

-   Validate: prescription exists and belongs to this doctor
-   Update medicines list completely (replace, not merge)
-   Update `UpdatedAt` timestamp

**Error Responses**:

403 Forbidden:

```json
{
    "IsSuccess": false,
    "Message": "You can only edit your own prescriptions",
    "Data": null
}
```

404 Not Found:

```json
{
    "IsSuccess": false,
    "Message": "Prescription not found",
    "Data": null
}
```

---

### 5.3 Get Prescription Detail

**Endpoint**: `GET /api/doctor/prescriptions/{prescriptionId}`

**Authentication**: ✅ Required

**Path Parameters**:

| Parameter      | Type | Required | Description     |
| -------------- | ---- | -------- | --------------- |
| prescriptionId | UUID | Yes      | Prescription ID |

**Response** (200 OK):

```json
{
    "IsSuccess": true,
    "Message": "Prescription retrieved successfully",
    "Data": {
        "Id": "rx1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "PatientId": "p1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "PatientName": "Nguyễn Văn A",
        "DoctorName": "BS. Trần Thị B",
        "AppointmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "Medicines": [
            {
                "Name": "Amoxicillin",
                "Dosage": "500mg",
                "Quantity": "21 viên",
                "Instructions": "Uống 3 lần/ngày sau ăn"
            }
        ],
        "Notes": "Uống kháng sinh đủ liệu trình 7 ngày",
        "CreatedAt": "2026-01-08T11:30:00Z",
        "UpdatedAt": "2026-01-08T11:30:00Z"
    }
}
```

---

### 5.4 List Patient Prescriptions

**Endpoint**: `GET /api/doctor/prescriptions`

**Authentication**: ✅ Required

**Query Parameters**:

| Parameter | Type | Required | Description          |
| --------- | ---- | -------- | -------------------- |
| patientId | UUID | No       | Filter by patient ID |

**Example**: `GET /api/doctor/prescriptions?patientId=p1a2b3c4-d5e6-7890-abcd-ef1234567890`

**Response** (200 OK):

```json
{
    "IsSuccess": true,
    "Message": "Prescriptions retrieved successfully",
    "Data": [
        {
            "Id": "rx1a2b3c4-d5e6-7890-abcd-ef1234567890",
            "PatientId": "p1a2b3c4-d5e6-7890-abcd-ef1234567890",
            "PatientName": "Nguyễn Văn A",
            "CreatedAt": "2026-01-08T11:30:00Z",
            "MedicineCount": 2,
            "MedicineSummary": "Amoxicillin, Paracetamol"
        },
        {
            "Id": "rx2b3c4d5-e6f7-8901-bcde-f12345678901",
            "PatientId": "p1a2b3c4-d5e6-7890-abcd-ef1234567890",
            "PatientName": "Nguyễn Văn A",
            "CreatedAt": "2026-01-05T14:20:00Z",
            "MedicineCount": 1,
            "MedicineSummary": "Ibuprofen"
        }
    ]
}
```

**Business Logic**:

-   If `patientId` provided: return that patient's prescriptions by this doctor
-   If no `patientId`: return all prescriptions by this doctor (last 50)
-   Order by `CreatedAt` DESC (newest first)
-   `MedicineSummary`: Comma-separated list of medicine names

---

## 6. Prescription Templates (Optional)

### 6.1 Get Prescription Templates

**Endpoint**: `GET /api/doctor/prescription-templates`

**Authentication**: ✅ Required

**Query Parameters**:

| Parameter | Type   | Required | Default | Description        |
| --------- | ------ | -------- | ------- | ------------------ |
| category  | string | No       | all     | Filter by category |

**Response** (200 OK):

```json
{
    "IsSuccess": true,
    "Message": "Templates retrieved successfully",
    "Data": [
        {
            "Id": "t1a2b3c4-d5e6-7890-abcd-ef1234567890",
            "Name": "Đơn thuốc sau nhổ răng",
            "Category": "dental",
            "Medicines": [
                {
                    "Name": "Amoxicillin",
                    "Dosage": "500mg",
                    "Quantity": "21 viên",
                    "Instructions": "Uống 3 lần/ngày sau ăn"
                },
                {
                    "Name": "Ibuprofen",
                    "Dosage": "400mg",
                    "Quantity": "10 viên",
                    "Instructions": "Uống khi đau, tối đa 3 lần/ngày"
                }
            ],
            "Notes": "Súc miệng nước muối 2 lần/ngày"
        }
    ]
}
```

**Database Suggestion**:
Create `PrescriptionTemplate` table:

-   `TemplateId` (UUID, PK)
-   `DoctorId` (UUID, FK) - NULL for shared templates
-   `ClinicId` (UUID, FK) - NULL for system-wide templates
-   `Name` (string)
-   `Category` (string)
-   `MedicinesJson` (TEXT/JSONB) - Store medicines array
-   `Notes` (string)
-   `CreatedAt`, `UpdatedAt`

### 6.2 Create Prescription Template

**Endpoint**: `POST /api/doctor/prescription-templates`

**Authentication**: ✅ Required

**Request Body**:

```json
{
    "Name": "Đơn thuốc tẩy trắng răng",
    "Category": "dental",
    "Medicines": [
        {
            "Name": "Sensodyne Repair & Protect",
            "Dosage": "Kem đánh răng",
            "Quantity": "1 tuýp",
            "Instructions": "Đánh răng 2 lần/ngày"
        }
    ],
    "Notes": "Tránh thức ăn có màu trong 48h"
}
```

**Response** (201 Created):

```json
{
    "IsSuccess": true,
    "Message": "Template created successfully",
    "Data": {
        "TemplateId": "t3c4d5e6-f7a8-9012-cdef-123456789012",
        "CreatedAt": "2026-01-08T10:30:00Z"
    }
}
```

---

## Common Specifications

### Authentication

**Required for all endpoints**

**Header Format**:

```http
Authorization: Bearer <jwt_token>
```

**JWT Payload** should include:

```json
{
    "userId": "doctor-user-id",
    "role": "Doctor",
    "clinicId": "clinic-id",
    "exp": 1704744000
}
```

---

### Response Format

All endpoints follow this structure:

```typescript
{
    IsSuccess: boolean; // PascalCase!
    Message: string;
    Data: T | null;
}
```

**Success Response**: `IsSuccess: true`, `Data: <object>`  
**Error Response**: `IsSuccess: false`, `Data: null`

---

### HTTP Status Codes

| Code | Description           | When to use                         |
| ---- | --------------------- | ----------------------------------- |
| 200  | OK                    | Successful GET, PUT, DELETE         |
| 201  | Created               | Successful POST (resource created)  |
| 400  | Bad Request           | Validation error, invalid input     |
| 401  | Unauthorized          | Missing or invalid token            |
| 403  | Forbidden             | Valid token but insufficient access |
| 404  | Not Found             | Resource doesn't exist              |
| 409  | Conflict              | Duplicate resource                  |
| 500  | Internal Server Error | Unexpected server error             |

---

### Date/Time Format

**Database**: Store as `DateTime` (UTC)  
**Response JSON**: ISO 8601 format `YYYY-MM-DDTHH:mm:ssZ`  
**Request JSON**: ISO 8601 format `YYYY-MM-DDTHH:mm:ssZ`

**Examples**:

```json
{
    "RecordDate": "2026-01-08T10:30:00Z",
    "StartAt": "2026-01-08T08:30:00Z",
    "Dob": "1990-05-15T00:00:00Z"
}
```

---

### Pagination (Future Enhancement)

For list endpoints, consider adding:

**Query Parameters**:

-   `page` (default: 1)
-   `pageSize` (default: 20, max: 100)

**Response**:

```json
{
  "IsSuccess": true,
  "Message": "OK",
  "Data": {
    "Items": [...],
    "TotalCount": 150,
    "Page": 1,
    "PageSize": 20,
    "TotalPages": 8
  }
}
```

---

### Rate Limiting

| Endpoint Pattern       | Limit               |
| ---------------------- | ------------------- |
| `GET /api/doctor/*`    | 100 requests/minute |
| `POST /api/doctor/*`   | 30 requests/minute  |
| `PUT /api/doctor/*`    | 30 requests/minute  |
| `DELETE /api/doctor/*` | 10 requests/minute  |

---

## Database Schema Notes

### Required Tables

1. **Appointment** ✅ (Exists)

    - Add tracking fields for actual exam time if needed

2. **MedicalRecord** ✅ (Exists)

    - **Enhancement**: Add `ToothStatusJson` TEXT/JSONB column for structured dental chart storage

3. **PrescriptionTemplate** ❌ (New)
    - See section 5.1 for schema

### Recommended Indexes

```sql
-- For queue queries
CREATE INDEX idx_appointments_doctor_date
ON Appointment(DoctorId, StartAt, Status);

-- For patient search
CREATE INDEX idx_patients_doctor_visits
ON (SELECT PatientId, DoctorId FROM Appointment WHERE Status = 4);

-- For medical records
CREATE INDEX idx_medical_records_patient_doctor
ON MedicalRecord(PatientId, DoctorId, RecordDate DESC);
```

---

## Implementation Priority

### Phase 1: MVP (Must Have) - Core Queue & Examination

1. ✅ **Dashboard Stats** - `GET /api/doctor/dashboard/stats`
2. ✅ **Queue List** - `GET /api/doctor/queue`
3. ✅ **Start Exam** - `PUT /api/doctor/queue/{id}/start`
4. ✅ **Complete Exam** - `PUT /api/doctor/queue/{id}/complete`
5. ✅ **Save Complete Examination** - `POST /api/doctor/examinations`

### Phase 2: Core Features - Records, Patient & Prescription Management

6. ✅ **Patient List** - `GET /api/doctor/patients`
7. ✅ **Patient Detail** - `GET /api/doctor/patients/{id}`
8. ✅ **Create Medical Record** - `POST /api/doctor/medical-records`
9. ✅ **Update Medical Record** - `PUT /api/doctor/medical-records/{id}`
10. ✅ **Get Record Detail** - `GET /api/doctor/medical-records/{id}`
11. ✅ **Create Prescription** - `POST /api/doctor/prescriptions` ⚡ **NEW**
12. ✅ **Update Prescription** - `PUT /api/doctor/prescriptions/{id}` ⚡ **NEW**
13. ✅ **Get Prescription Detail** - `GET /api/doctor/prescriptions/{id}` ⚡ **NEW**
14. ✅ **List Prescriptions** - `GET /api/doctor/prescriptions` ⚡ **NEW**

### Phase 3: Enhancements - Templates & Advanced Features

15. ⚠️ **Get Prescription Templates** - `GET /api/doctor/prescription-templates`
16. ⚠️ **Create Prescription Template** - `POST /api/doctor/prescription-templates`
17. ⚠️ **Add ToothStatusJson field** to MedicalRecord schema
18. ⚠️ **Pagination** for list endpoints
19. ⚠️ **Advanced search/filters**

**Total Endpoints**: 18 (14 core + 4 optional enhancements)

---

## Frontend Integration Example

```typescript
// /src/services/apiDoctor.ts

import axios from '@/services/api.customize';

// Dashboard
export const getDoctorDashboardStats = () => {
    return axios.get<IBackendRes<DashboardStatsDto>>(
        '/api/doctor/dashboard/stats'
    );
};

// Queue
export const getDoctorQueue = (date?: string) => {
    const url = date ? `/api/doctor/queue?date=${date}` : '/api/doctor/queue';
    return axios.get<IBackendRes<QueueItemDto[]>>(url);
};

export const startExamination = (appointmentId: string) => {
    return axios.put(`/api/doctor/queue/${appointmentId}/start`);
};

export const completeExamination = (appointmentId: string) => {
    return axios.put(`/api/doctor/queue/${appointmentId}/complete`);
};

// Medical Records
export const createMedicalRecord = (data: CreateMedicalRecordRequest) => {
    return axios.post('/api/doctor/medical-records', data);
};

// Patients
export const getDoctorPatients = (search?: string) => {
    const url = search
        ? `/api/doctor/patients?search=${encodeURIComponent(search)}`
        : '/api/doctor/patients';
    return axios.get<IBackendRes<DoctorPatientDto[]>>(url);
};

export const getPatientDetail = (patientId: string) => {
    return axios.get<IBackendRes<PatientDetailDto>>(
        `/api/doctor/patients/${patientId}`
    );
};
```

---

**Document Version**: 1.0  
**Status**: Ready for Implementation  
**Last Review**: 2026-01-08
