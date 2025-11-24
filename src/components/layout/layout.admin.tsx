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

const AdminLayout: React.FC = () => {
  const { Header, Sider, Content, Footer } = Layout;
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res) {
      localStorage.removeItem("access_token");
      message.success("Đã đăng xuất thành công!");
      navigate("/login");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const userMenu = {
    items: [
      {
        key: "home",
        label: (
          <div onClick={handleGoHome} className="flex items-center gap-2">
            <HomeOutlined />
            Về trang Home
          </div>
        ),
      },
      {
        key: "info",
        label: (
          <Link to="/info" className="flex items-center gap-2">
            <UserOutlined />
            Cập nhật thông tin
          </Link>
        ),
      },
      {
        key: "logout",
        label: (
          <div onClick={handleLogout} className="flex items-center gap-2">
            <LogoutOutlined />
            Đăng xuất
          </div>
        ),
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="text-white text-2xl font-bold text-center my-6">
          Admin Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: <Link to="/admin">Dashboard</Link>,
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: <Link to="/admin/users">Users</Link>,
            },
            {
              key: "3",
              icon: <ExceptionOutlined />,
              label: <Link to="/admin/shoes">Shoes</Link>,
            },
            {
              key: "4",
              icon: <DollarCircleOutlined />,
              label: <Link to="/admin/orders">Orders</Link>,
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
            boxShadow: "0 2px 8px #f0f1f2",
          }}
        >
          <div className="text-xl font-semibold text-gray-800">
            Trang Quản Lý
          </div>

          <Dropdown menu={userMenu}>
            <Space className="cursor-pointer">
              <FaUserCircle size={24} />
              <span className="text-gray-700 font-medium">Admin</span>
              <DownOutlined />
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: 8,
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Jushoes Admin ©{new Date().getFullYear()} Created by You 😎
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
