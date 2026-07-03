import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "antd/es/image";
import Col from "antd/es/col";
import Flex from "antd/es/flex";
import Input from "antd/es/input";
import Typography from "antd/es/typography";
import Button from "antd/es/button";
import { message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { LockOutlined, MailOutlined, SafetyOutlined } from "@ant-design/icons";
import logo from "@/public/assets/logo/orbiteye_black.png";
import background from "@/public/assets/image/Background_Login_right_side.png";
import "@/authentication/authentication.css";

const { Text, Title } = Typography;

interface AdminLoginForm {
  email: string;
  password: string;
}

const LoginAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<AdminLoginForm>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      message.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4321"}/graphql`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              mutation Login($input: LoginInput!) {
                login(input: $input) {
                  token
                  refreshToken
                  expiresIn
                  tokenType
                  user {
                    id
                    email
                    fullName
                    displayName
                    role
                    isAdmin
                    isManager
                  }
                }
              }
            `,
            variables: {
              input: {
                email: form.email,
                password: form.password,
              },
            },
          }),
        },
      );

      const data = await result.json();
      const payload = data.data?.login;

      if (payload?.token) {
        // ⚠️ Admin guard: ตรวจสอบว่า user เป็น admin จริง
        if (!payload.user?.isAdmin) {
          message.error("Access denied. This portal is for administrators only.");
          setIsLoading(false);
          return;
        }

        // เก็บ token + user info (รวม isAdmin flag)
        localStorage.setItem("token", payload.token);
        if (payload.refreshToken) {
          localStorage.setItem("refreshToken", payload.refreshToken);
        }
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...payload.user,
            // flag นี้ใช้กับ RequireAdmin guard
            isAdmin: !!payload.user.isAdmin,
          }),
        );
        // แยก flag admin ไว้เช็คเร็ว ๆ
        localStorage.setItem(
          "isAdmin",
          payload.user.isAdmin ? "true" : "false",
        );

        message.success("Welcome, Administrator!");
        navigate("/admin/dashboard");
      } else if (data.errors) {
        message.error(data.errors[0]?.message || "Login failed");
      } else {
        message.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Admin login failed:", error);
      message.error("Login failed. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Side - Login Form (60%) */}
      <Col span={14} style={{ minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
        <Flex
          justify="center"
          align="center"
          vertical
          style={{ height: "100vh", padding: "0 15%" }}
        >
          <div style={{ width: "100%", maxWidth: 440 }}>
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Image src={logo} width="60%" preview={false} />
            </div>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "rgba(220, 38, 38, 0.08)",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  marginBottom: 16,
                }}
              >
                <SafetyOutlined style={{ color: "#dc2626", fontSize: 14 }} />
                <Text
                  strong
                  style={{ color: "#dc2626", fontSize: 12, letterSpacing: 1 }}
                >
                  ADMINISTRATOR ACCESS
                </Text>
              </div>
              <Title
                level={2}
                style={{
                  margin: 0,
                  color: "#1c273b",
                  fontWeight: 600,
                }}
              >
                Admin Portal
              </Title>
              <Text style={{ color: "#64748b", fontSize: 14 }}>
                Sign in to manage customers and system
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <Text
                  strong
                  style={{
                    color: "#1c273b",
                    fontSize: 13,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Email
                </Text>
                <Input
                  size="large"
                  type="email"
                  prefix={<MailOutlined style={{ color: "#94a3b8" }} />}
                  placeholder="admin@orbiteye.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  autoComplete="username"
                  required
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 28 }}>
                <Text
                  strong
                  style={{
                    color: "#1c273b",
                    fontSize: 13,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Password
                </Text>
                <Input.Password
                  size="large"
                  prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  iconRender={(visible) =>
                    visible ? (
                      <EyeTwoTone />
                    ) : (
                      <EyeInvisibleOutlined style={{ color: "#94a3b8" }} />
                    )
                  }
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* Submit */}
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                style={{
                  width: "100%",
                  height: 48,
                  fontSize: 15,
                  fontWeight: 500,
                  backgroundColor: "#dc2626",
                  borderColor: "#dc2626",
                }}
              >
                Sign in to Admin Portal
              </Button>
            </form>

            {/* Back to user login */}
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Text style={{ color: "#64748b", fontSize: 13 }}>
                Not an administrator?{" "}
                <a
                  href="/authentication/login"
                  style={{
                    color: "#1890ff",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Go to user login
                </a>
              </Text>
            </div>

            {/* Security notice */}
            <div
              style={{
                marginTop: 32,
                padding: 12,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                fontSize: 12,
                color: "#991b1b",
                textAlign: "center",
              }}
            >
              🔒 All admin actions are logged and monitored.
            </div>
          </div>
        </Flex>
      </Col>

      {/* Right Side - Background (40%) */}
      <Col span={10} style={{ minHeight: "100vh", position: "relative" }}>
        <Image
          src={background}
          alt="Background"
          preview={false}
          style={{ width: "100%", height: "100vh", objectFit: "cover" }}
        />
      </Col>
    </div>
  );
};

export default LoginAdmin;