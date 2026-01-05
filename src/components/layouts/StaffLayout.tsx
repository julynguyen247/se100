import React from "react";
import { Outlet } from "react-router-dom";
import StaffHeader from "./StaffHeader";

const StaffLayout: React.FC = () => {
  return (
    <>
      <StaffHeader />
      <Outlet />
    </>
  );
};

export default StaffLayout;
