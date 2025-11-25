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

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [{ index: true, Component: HomePage }],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      {
        index: true,
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: "users",
        element: (
          <Protected>
            <Users />
          </Protected>
        ),
      },
    ],
  },
  {
    path: "/staff",
    Component: StaffLayout,
    children: [
      {
        index: true,
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: "users",
        element: (
          <Protected>
            <Users />
          </Protected>
        ),
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
