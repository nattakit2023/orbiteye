import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Image from "antd/es/image";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Flex from "antd/es/flex";
import Input from "antd/es/input";
import Typography from "antd/es/typography";
import Button from "antd/es/button";
import Divider from "antd/es/divider";
import Card from "antd/es/card";
import Avatar from "antd/es/avatar";
import { message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import logo from "@/public/assets/logo/orbiteye_white.png";
import logo_google from "@/public/assets/logo/google.png";
import background from "@/public/assets/image/Login_Background.png";
import "@/authentication/authentication.css";

const { Text } = Typography;

interface LoginType {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState<Partial<LoginType>>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleCallback = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const googleId = params.get("google_id");
    const email = params.get("email");
    const firstName = params.get("first_name");

    if (googleId && email && firstName) {
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
                mutation GoogleLogin($input: GoogleLoginInput!) {
                  googleLogin(input: $input) {
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
                  google_id: googleId,
                  email: email,
                  first_name: firstName,
                },
              },
            }),
          }
        );

        const data = await result.json();

        if (data.data?.googleLogin?.token) {
          localStorage.setItem("token", data.data.googleLogin.token);
          if (data.data.googleLogin.user) {
            localStorage.setItem(
              "user",
              JSON.stringify(data.data.googleLogin.user)
            );
          }
          message.success("Google login successful!");
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          navigate("/dashboard");
        } else if (data.errors) {
          message.error(data.errors[0]?.message || "Google login failed");
        }
      } catch (error) {
        console.error("Google login failed:", error);
        message.error("Google login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [navigate]);

  useEffect(() => {
    handleGoogleCallback();
  }, [handleGoogleCallback]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login.email || !login.password) {
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
                email: login.email,
                password: login.password,
              },
            },
          }),
        }
      );

      const data = await result.json();

      if (data.data?.login?.token) {
        localStorage.setItem("token", data.data.login.token);
        if (data.data.login.user) {
          localStorage.setItem("user", JSON.stringify(data.data.login.user));
        }
        message.success("Login successful!");
        navigate("/dashboard");
      } else if (data.errors) {
        message.error(data.errors[0]?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      message.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id";
    const redirectUri = `${window.location.origin}/authentication/login`;
    const scope = encodeURIComponent("email profile");
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Side - 30% */}
      <Col span={8} style={{ height: "100vh", backgroundColor: "#1c273b" }}>
        <Flex
          justify="center"
          align="center"
          vertical
          style={{
            height: "100%",
            padding: "40px 30px",
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: "40px", textAlign: "center" }}>
            <Image src={logo} width={"60%"} preview={false} />
          </div>

          {/* Login Form */}
          <Card
            style={{
              width: "100%",
              maxWidth: "360px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "0.5px solid #333333",
              borderRadius: "10px",
              backdropFilter: "blur(10px)",
              padding: "20px",
            }}
          >
            <div className="text">
              <Flex align="center" vertical>
                <Text
                  strong
                  style={{
                    color: "#FFFFFF",
                    fontSize: "24px",
                    marginBottom: "30px",
                  }}
                >
                  Login
                </Text>
              </Flex>
            </div>

            {/* Email Field */}
            <div className="text" style={{ marginBottom: "16px" }}>
              <Text
                strong
                style={{
                  color: "#FFFFFF",
                  fontSize: "14px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Email
              </Text>
              <Input
                type="text"
                required
                value={login.email}
                onChange={(e) =>
                  setLogin({ ...login, email: e.target.value })
                }
                style={{
                  backgroundColor: "transparent",
                  height: "40px",
                  color: "white",
                }}
              />
            </div>

            {/* Password Field */}
            <div className="text" style={{ marginBottom: "16px" }}>
              <Text
                strong
                style={{
                  color: "#FFFFFF",
                  fontSize: "14px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Password
              </Text>
              <Input.Password
                value={login.password}
                onChange={(e) =>
                  setLogin({ ...login, password: e.target.value })
                }
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone />
                  ) : (
                    <div style={{ color: "#FFFFFF" }}>
                      <EyeInvisibleOutlined />
                    </div>
                  )
                }
                required
                style={{
                  backgroundColor: "transparent",
                  height: "40px",
                  color: "white",
                }}
              />
            </div>

            {/* Forgot Password */}
            <div className="text" style={{ marginBottom: "24px" }}>
              <Flex justify="end">
                <Text
                  strong
                  style={{
                    color: "#FFFFFF",
                    fontSize: "14px",
                  }}
                >
                  Forgot password?
                </Text>
              </Flex>
            </div>

            {/* Login Button */}
            <div className="text" style={{ marginBottom: "24px" }}>
              <Button
                type="primary"
                onClick={(e) => handleFormSubmit(e)}
                style={{
                  width: "100%",
                  height: "44px",
                  fontSize: "16px",
                }}
                loading={isLoading}
              >
                Login
              </Button>
            </div>

            <Divider
              size="small"
              style={{
                borderColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontSize: "12px",
                margin: "20px 0",
              }}
            >
              or
            </Divider>

            {/* Google Login Button */}
            <div className="text" style={{ marginBottom: "24px" }}>
              <Button
                type="default"
                onClick={handleGoogleLogin}
                style={{
                  width: "100%",
                  height: "44px",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
                loading={isLoading}
                icon={<Avatar src={logo_google} size={20} />}
              >
                Google
              </Button>
            </div>

            {/* Sign up Link */}
            <div className="text">
              <Flex justify="center">
                <Text
                  style={{
                    fontFamily: "FontSCdescript",
                    fontSize: "14px",
                    color: "#BBBBBB",
                  }}
                >
                  Don't have an account?{"  "}
                  <Text
                    style={{
                      fontFamily: "FontSCdescript",
                      fontSize: "14px",
                      color: "#FFFFFF",
                    }}
                  >
                    <Link to="/authentication/register">Sign up here</Link>
                  </Text>
                </Text>
              </Flex>
            </div>
          </Card>
        </Flex>
      </Col>

      {/* Right Side - 70% */}
      <Col span={16} style={{ height: "100vh", position: "relative" }}>
        <div
          className="background_image"
          style={{ position: "absolute", inset: 0 }}
        >
          <Image
            src={background}
            alt="Background"
            width="100%"
            height="100%"
            preview={false}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        />
      </Col>
    </div>
  );
};

export default Login;