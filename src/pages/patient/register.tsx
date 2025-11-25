import React, { useState } from "react";
import type { FormProps } from "antd";
import { App, Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "@/services/api";
type FieldType = {
  email: string;
  password: string;
  fullName: string;
};

const RegisterPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const { message } = App.useApp();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    const { email, fullName, password } = values;

    const res = await registerAPI(email, password, fullName);
    if (res.data) {
      //success
      message.success("Đăng ký user thành công.");
      navigate("/login");
    } else {
      //error
      message.error(res.message);
    }
    setIsSubmit(false);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
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
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
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
            labelCol={{
              span: 24,
            }}
            wrapperCol={{ span: 24 }}
            label="FullName"
            name="fullName"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={null}
            wrapperCol={{ span: 24 }}
            labelCol={{
              span: 24,
            }}
          >
            <Button type="primary" htmlType="submit" loading={isSubmit}>
              Sign up
            </Button>
          </Form.Item>
          Had an acoount?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer"
          >
            Login
          </span>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
