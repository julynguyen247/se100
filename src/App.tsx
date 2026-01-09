import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GuestLayout from './components/layouts/GuestLayout';
import PatientLayout from './components/layouts/PatientLayout';
import AdminLayout from './components/layouts/AdminLayout';
import DoctorLayout from './components/layouts/DoctorLayout';
import ReceptionistLayout from './components/layouts/ReceptionistLayout';

// Guest Pages
import HomePage from './pages/guest/HomePage';
import LoginPage from './pages/guest/LoginPage';
import RegisterPage from './pages/guest/RegisterPage';
import BookingPage from './pages/guest/booking';
import CancelAppointmentPage from './pages/guest/CancelAppointmentPage';
import RescheduleAppointmentPage from './pages/guest/RescheduleAppointmentPage';

// Patient Pages
import PatientDashboard from './pages/patient/dashboard';
import MyProfilePage from './pages/patient/info';
import MyAppointmentsPage from './pages/patient/appointment';
import MedicalHistoryPage from './pages/patient/medicalHistory';

// Admin Pages
import Dashboard from './pages/admin/dashboard';
import UserManagementPage from './pages/admin/users';
import AdminReportsPage from './pages/admin/report';
import AdminSettingsPage from './pages/admin/setting';
import MedicinesPage from './pages/admin/medicines';

// Doctor Pages
import DoctorDashboard from './pages/doctor/dashboard';
import DoctorQueue from './pages/doctor/queue';
import DoctorPatients from './pages/doctor/patients';
import DoctorTreatment from './pages/doctor/treatment';
import DoctorPrescription from './pages/doctor/prescription';

// Receptionist Pages
import ReceptionistDashboard from './pages/receptionist/dashboard';
import ReceptionistQueue from './pages/receptionist/queue';
import ReceptionistAppointments from './pages/receptionist/appointments';
import ReceptionistPatients from './pages/receptionist/patients';
import ReceptionistBilling from './pages/receptionist/billing';
import PaymentResult from './pages/receptionist/PaymentResult';

const router = createBrowserRouter([
    {
        path: '/',
        Component: GuestLayout,
        children: [
            { index: true, Component: HomePage },
            { path: 'login', Component: LoginPage },
            { path: 'register', Component: RegisterPage },
            { path: 'booking', Component: BookingPage },
            { path: 'cancel-appointment', Component: CancelAppointmentPage },
            {
                path: 'reschedule-appointment',
                Component: RescheduleAppointmentPage,
            },
        ],
    },
    {
        path: '/patient',
        Component: PatientLayout,
        children: [
            {
                index: true,
                element: <PatientDashboard />,
            },
            {
                path: 'appointments',
                element: <MyAppointmentsPage />,
            },
            {
                path: 'medical-history',
                element: <MedicalHistoryPage />,
            },
            {
                path: 'profile',
                element: <MyProfilePage />,
            },
        ],
    },
    {
        path: '/admin',
        Component: AdminLayout,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'users',
                element: <UserManagementPage />,
            },
            {
                path: 'reports',
                element: <AdminReportsPage />,
            },
            {
                path: 'settings',
                element: <AdminSettingsPage />,
            },
            {
                path: 'medicines',
                element: <MedicinesPage />,
            },
        ],
    },
    {
        path: '/doctor',
        Component: DoctorLayout,
        children: [
            {
                index: true,
                element: <DoctorDashboard />,
            },
            {
                path: 'queue',
                element: <DoctorQueue />,
            },
            {
                path: 'patients',
                element: <DoctorPatients />,
            },
            {
                path: 'treatment',
                element: <DoctorTreatment />,
            },
            {
                path: 'prescription',
                element: <DoctorPrescription />,
            },
            {
                path: 'medicines',
                element: <MedicinesPage />,
            },
        ],
    },
    {
        path: '/receptionist',
        Component: ReceptionistLayout,
        children: [
            {
                index: true,
                element: <ReceptionistDashboard />,
            },
            {
                path: 'queue',
                element: <ReceptionistQueue />,
            },
            {
                path: 'appointments',
                element: <ReceptionistAppointments />,
            },
            {
                path: 'patients',
                element: <ReceptionistPatients />,
            },
            {
                path: 'billing',
                element: <ReceptionistBilling />,
            },
        ],
    },
    {
        path: '/payment',
        children: [
            {
                path: 'result',
                element: <PaymentResult />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
