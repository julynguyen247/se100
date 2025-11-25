import React from "react";
import {
  DashboardOutlined,
  UserOutlined,
  DollarCircleOutlined,
  ExceptionOutlined,
  DownOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, Menu, Space, message } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { logoutAPI } from "@/services/api";
import { Footer } from "antd/es/layout/layout";

const StaffLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default StaffLayout;
