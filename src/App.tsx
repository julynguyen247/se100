import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuestLayout from "./components/layouts/GuestLayout";
import PatientLayout from "./components/layouts/PatientLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import DoctorLayout from "./components/layouts/DoctorLayout";
import ReceptionistLayout from "./components/layouts/ReceptionistLayout";

// Guest Pages
import HomePage from "./components/pages/guest/HomePage";
import LoginPage from "./components/pages/guest/LoginPage";
import RegisterPage from "./components/pages/guest/RegisterPage";
import BookingPage from "./components/pages/patient/booking";

// Patient Pages
import PatientDashboard from "./components/pages/patient/dashboard";
import MyProfilePage from "./components/pages/patient/info";
import MyAppointmentsPage from "./components/pages/patient/appointment";
import MedicalHistoryPage from "./components/pages/patient/medicalHistory";

// Admin Pages
import Dashboard from "./components/pages/admin/dashboard";
import UserManagementPage from "./components/pages/admin/users";
import AdminReportsPage from "./components/pages/admin/report";
import AdminSettingsPage from "./components/pages/admin/setting";

// Doctor Pages
import DoctorDashboard from "./components/pages/doctor/dashboard";
import DoctorQueue from "./components/pages/doctor/queue";
import DoctorPatients from "./components/pages/doctor/patients";
import DoctorTreatment from "./components/pages/doctor/treatment";
import DoctorPrescription from "./components/pages/doctor/prescription";

// Receptionist Pages
import ReceptionistDashboard from "./components/pages/receptionist/dashboard";
import ReceptionistQueue from "./components/pages/receptionist/queue";
import ReceptionistAppointments from "./components/pages/receptionist/appointments";
import ReceptionistPatients from "./components/pages/receptionist/patients";
import ReceptionistBilling from "./components/pages/receptionist/billing";

const router = createBrowserRouter([
    {
        path: "/",
        Component: GuestLayout,
        children: [
            { index: true, Component: HomePage },
            { path: "login", Component: LoginPage },
            { path: "register", Component: RegisterPage },
            { path: "booking", Component: BookingPage },
        ],
    },
    {
        path: "/patient",
        Component: PatientLayout,
        children: [
            {
                index: true,
                path: "dashboard",
                element: <PatientDashboard />,
            },
            {
                path: "appointments",
                element: <MyAppointmentsPage />,
            },
            {
                path: "medical-history",
                element: <MedicalHistoryPage />,
            },
            {
                path: "profile",
                element: <MyProfilePage />,
            },
        ],
    },
    {
        path: "/admin",
        Component: AdminLayout,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "users",
                element: <UserManagementPage />,
            },
            {
                path: "reports",
                element: <AdminReportsPage />,
            },
            {
                path: "settings",
                element: <AdminSettingsPage />,
            },
        ],
    },
    {
        path: "/doctor",
        Component: DoctorLayout,
        children: [
            {
                index: true,
                element: <DoctorDashboard />,
            },
            {
                path: "queue",
                element: <DoctorQueue />,
            },
            {
                path: "patients",
                element: <DoctorPatients />,
            },
            {
                path: "treatment",
                element: <DoctorTreatment />,
            },
            {
                path: "prescription",
                element: <DoctorPrescription />,
            },
        ],
    },
    {
        path: "/receptionist",
        Component: ReceptionistLayout,
        children: [
            {
                index: true,
                element: <ReceptionistDashboard />,
            },
            {
                path: "queue",
                element: <ReceptionistQueue />,
            },
            {
                path: "appointments",
                element: <ReceptionistAppointments />,
            },
            {
                path: "patients",
                element: <ReceptionistPatients />,
            },
            {
                path: "billing",
                element: <ReceptionistBilling />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
