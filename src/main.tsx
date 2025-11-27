import { createBrowserRouter, RouterProvider } from "react-router";
import "./styles/global.css";
import ReactDOM from "react-dom/client";
import Layout from "./layout";
import LoginPage from "./pages/patient/login";
import HomePage from "./pages/patient/home";
import RegisterPage from "./pages/patient/register";
import { App, ConfigProvider } from "antd";
import AdminLayout from "./components/layout/layout.admin";
import Dashboard from "./pages/admin/dashboard";
import Users from "./pages/admin/users";
import enUS from "antd/es/locale/en_US";
import { AppProvider } from "./components/context/app.context";
import Protected from "./components/auth";
import StaffLayout from "./components/layout/layout.staff";

import BookAppointmentPage from "./pages/patient/booking";
import PatientDashboard from "./pages/patient/dashboard";
import MyProfilePage from "./pages/patient/info";
import MyAppointmentsPage from "./pages/patient/appointment";
import MedicalHistoryPage from "./pages/patient/medicalHistory";
import AdminReportsPage from "./pages/admin/report";
import AdminSettingsPage from "./pages/admin/setting";
import UserManagementPage from "./pages/admin/users";
import StaffHomePage from "./pages/staff/home";
import StaffQueuePage from "./pages/staff/queue";
import StaffPatientRecordsPage from "./pages/staff/report";
import StaffExaminationPage from "./pages/staff/examination";
import StaffMedicinePage from "./pages/staff/medicine";
import StaffAppointmentPage from "./pages/staff/appointment";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [{ index: true, Component: HomePage }],
  },
  {
    path: "/patient",
    Component: Layout,
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
    path: "/staff",
    Component: StaffLayout,
    children: [
      {
        index: true,
        element: <StaffHomePage />,
      },

      {
        path: "waiting",
        element: <StaffQueuePage />,
      },

      {
        path: "patients",
        element: <StaffPatientRecordsPage />,
      },

      {
        path: "examination",
        element: <StaffExaminationPage />,
      },

      {
        path: "medicine",
        element: <StaffMedicinePage />,
      },

      {
        path: "appointments",
        element: <StaffAppointmentPage />,
      },
    ],
  },

  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <App>
    <AppProvider>
      <ConfigProvider locale={enUS}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </AppProvider>
  </App>
);
