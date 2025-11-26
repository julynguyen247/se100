import React from "react";

import { Link, Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "./admin.header";

const AdminLayout: React.FC = () => {
  return (
    <>
      <AdminHeader />
      <Outlet />
    </>
  );
};

export default AdminLayout;
