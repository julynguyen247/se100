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

import { Link, Outlet, useNavigate } from "react-router-dom";
import StaffHeader from "./staff.header";

const StaffLayout: React.FC = () => {
  return (
    <>
      <StaffHeader />
      <Outlet />
    </>
  );
};

export default StaffLayout;
