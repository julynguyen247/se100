import { Dropdown, Input, MenuProps, Popover, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { FcDislike } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useCurrentApp } from "../context/app.context";
import { logoutAPI } from "@/services/api";

const AppHeader = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, isAuthenticated } = useCurrentApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res) {
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  };

  const userMenu: MenuProps["items"] = isAuthenticated
    ? [
        ...(user?.role === "ADMIN"
          ? [{ key: "admin", label: <Link to="/admin">Admin</Link> }]
          : []),
        { key: "info", label: <Link to="/info">Change Info</Link> },
        { key: "logout", label: <span onClick={handleLogout}>Logout</span> },
      ]
    : [
        { key: "login", label: <Link to="/login">Login</Link> },
        { key: "signup", label: <Link to="/register">Signup</Link> },
      ];

  const cartContent = (
    <div className="text-center">
      <p>Chưa có sản phẩm</p>
    </div>
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowHeader(currentScrollY <= lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex flex-row h-[10vh] shadow-md bg-[#001A2D] items-center px-10">
        <div className="flex-1 flex items-center gap-2">
          <FcDislike size={36} />
          <Link to="/" className="text-2xl font-bold text-white">
            Jushoes Shop
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            style={{ width: 400 }}
          />
        </div>

        <div className="flex-1 flex items-center justify-end gap-8 text-white">
          <Popover content={cartContent} title="Giỏ hàng">
            <div className="relative cursor-pointer">
              <FaShoppingCart size={24} />
              <div className="absolute -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                0
              </div>
            </div>
          </Popover>

          <Dropdown menu={{ items: userMenu }}>
            <Space className="cursor-pointer">
              <FaUser size={24} />
              <span>{isAuthenticated ? user?.fullName : "Tài khoản"}</span>
              <DownOutlined />
            </Space>
          </Dropdown>
        </div>
      </div>

      <div className="flex flex-row h-[6vh] bg-white shadow-sm items-center justify-center gap-10 text-black font-semibold">
        {["Adidas", "Nike", "Puma", "Bitis", "Jordan", "Converse"].map(
          (brand) => (
            <div
              key={brand}
              className="hover:text-blue-500 cursor-pointer transition-colors"
            >
              {brand}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AppHeader;
