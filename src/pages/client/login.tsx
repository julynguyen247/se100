import React, { useState } from "react";
import type { FormProps } from "antd";
import { App, Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";
type FieldType = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const { setIsAuthenticated, setUser } = useCurrentApp();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { username, password } = values;
    setIsSubmit(true);
    const res = await loginAPI(username, password);
    setIsSubmit(false);
    if (res?.data) {
      setIsAuthenticated(true);
      setUser(res.data.user);
      localStorage.setItem("access_token", res.data.access_token);
      message.success("Đăng nhập tài khoản thành công!");
      navigate("/");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center flex-1 h-[100vh] w-[100vw]">
      <div className="bg-gray-200 rounded-2xl p-12 w-[30vw]">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          labelCol={{ span: 24 }}
        >
          <Form.Item<FieldType>
            labelCol={{
              span: 24,
            }}
            wrapperCol={{ span: 24 }}
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            labelCol={{
              span: 24,
            }}
            wrapperCol={{ span: 24 }}
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={null}
            wrapperCol={{ span: 24 }}
            labelCol={{
              span: 24,
            }}
          >
            <Button type="primary" htmlType="submit" loading={isSubmit}>
              Login
            </Button>
          </Form.Item>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 cursor-pointer"
          >
            Sign up
          </span>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
