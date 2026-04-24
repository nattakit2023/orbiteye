import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Image from "antd/es/image";
import Col from "antd/es/col";
import Flex from "antd/es/flex";
import Input from "antd/es/input";
import Typography from "antd/es/typography";
import Button from "antd/es/button";
import Divider from "antd/es/divider";
import Avatar from "antd/es/avatar";
import { message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import logo from "@/public/assets/logo/orbiteye_black.png";
import logo_google from "@/public/assets/logo/google.png";
import background from "@/public/assets/image/Background_Login_right_side.png";
import "@/authentication/authentication.css";

const { Text } = Typography;

interface LoginType {
  email: string;
  password: string;
  fullName?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [login, setLogin] = useState<Partial<LoginType>>({
    email: "",
    password: "",
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setLogin({ email: "", password: "", fullName: "" });
  };

  const handleGoogleCallback = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const googleSuccess = params.get("google_success");
    const stateData = params.get("state");
    const error = params.get("error");

    // Handle error from backend
    if (error) {
      message.error(`Google login failed: ${error}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Parse the state data: format is "google_id|email|name|access_token"
    if (googleSuccess === "true" && stateData) {
      const parts = stateData.split("|");
      if (parts.length >= 4) {
        const [googleId, email, name, jwtToken] = parts;

        // Store the JWT token and user data
        localStorage.setItem("token", jwtToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            google_id: googleId,
            email: email,
            fullName: name,
            displayName: name,
          }),
        );

        message.success("Google login successful!");
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        navigate("/dashboard");
        return;
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
      const mutation = isLoginMode ? "Login" : "Register";
      const result = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4321"}/graphql`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              mutation ${mutation}($input: ${mutation}Input!) {
                ${mutation.toLowerCase()}(input: $input) {
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
                ...(login.fullName ? { fullName: login.fullName } : {}),
              },
            },
          }),
        },
      );

      const data = await result.json();

      const responseKey = mutation.toLowerCase();
      if (data.data?.[responseKey]?.token) {
        localStorage.setItem("token", data.data[responseKey].token);
        if (data.data[responseKey].user) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.data[responseKey].user),
          );
        }
        message.success(`${isLoginMode ? "Login" : "Sign Up"} successful!`);
        navigate("/dashboard");
      } else if (data.errors) {
        message.error(
          data.errors[0]?.message ||
            `${isLoginMode ? "Login" : "Sign Up"} failed`,
        );
      }
    } catch (error) {
      console.error(`${isLoginMode ? "Login" : "Sign Up"} failed:`, error);
      message.error(
        `${isLoginMode ? "Login" : "Sign Up"} failed. Please check your credentials.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id";
    // Redirect URI is the backend's Google OAuth callback
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4321";
    const redirectUri = `${backendUrl}/auth/google/callback`;
    const scope = encodeURIComponent("email profile");
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Side - 40% */}
      <Col span={10} style={{ minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
        <Flex
          justify="center"
          vertical
          style={{
            height: "100vh",
            padding: "0 25%",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center" }}>
            <Image src={logo} width={"60%"} preview={false} />
          </div>

          <Text
            strong
            style={{
              fontSize: "14px",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            Transform Satellite Data into Smart Decisions
          </Text>

          {/* Toggle Login/SignUp Tab Button - Centered */}
          <Flex
            justify="center"
            style={{ marginBottom: "30px", marginTop: "10px" }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
                padding: "4px",
                borderRadius: "10px",
                border: "1px solid #0f172a",
              }}
            >
              <Button
                onClick={() => !isLoginMode && toggleMode()}
                style={{
                  width: "100px",
                  height: "36px",
                  fontSize: "14px",
                  backgroundColor: isLoginMode ? "#0f172a" : "transparent",
                  borderColor: "transparent",
                  color: isLoginMode ? "#FFFFFF" : "#0f172a",
                  borderRadius: "10px",
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => isLoginMode && toggleMode()}
                style={{
                  width: "100px",
                  height: "36px",
                  fontSize: "14px",
                  backgroundColor: !isLoginMode ? "#0f172a" : "transparent",
                  borderColor: "transparent",
                  color: !isLoginMode ? "#FFFFFF" : "#0f172a",
                  borderRadius: "10px",
                }}
              >
                Sign Up
              </Button>
            </div>
          </Flex>

          {/* Full Name Field (SignUp only) */}
          {!isLoginMode && (
            <div className="text" style={{ marginBottom: "16px" }}>
              <Text
                strong
                style={{
                  color: "#1c273b",
                  fontSize: "14px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Full Name
              </Text>
              <Input
                type="text"
                required
                value={login.fullName}
                onChange={(e) =>
                  setLogin({ ...login, fullName: e.target.value })
                }
                style={{
                  backgroundColor: "transparent",
                  height: "40px",
                  color: "#1c273b",
                }}
              />
            </div>
          )}

          {/* Email Field */}
          <div className="text" style={{ marginBottom: "16px" }}>
            <Text
              strong
              style={{
                color: "#1c273b",
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
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
              style={{
                backgroundColor: "transparent",
                height: "40px",
                color: "#1c273b",
              }}
            />
          </div>

          {/* Password Field */}
          <div className="text" style={{ marginBottom: "16px" }}>
            <Text
              strong
              style={{
                color: "#1c273b",
                fontSize: "14px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Password
            </Text>
            <Input.Password
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone />
                ) : (
                  <div style={{ color: "#666666" }}>
                    <EyeInvisibleOutlined />
                  </div>
                )
              }
              required
              style={{
                backgroundColor: "transparent",
                height: "40px",
                color: "#1c273b",
              }}
            />
          </div>

          {/* Forgot Password (Login only) */}
          {isLoginMode && (
            <div className="text" style={{ marginBottom: "24px" }}>
              <Flex justify="center">
                <Text
                  strong
                  style={{
                    color: "#4096ff",
                    fontSize: "16px",
                  }}
                >
                  Forgot password?
                </Text>
              </Flex>
            </div>
          )}

          {/* Login/SignUp Button */}
          <div className="text">
            <Button
              type="primary"
              onClick={(e) => handleFormSubmit(e)}
              style={{
                width: "100%",
                height: "44px",
                fontSize: "16px",
                backgroundColor: "#0f172a",
                borderColor: "#1c56b8",
              }}
              loading={isLoading}
            >
              {isLoginMode ? "Login" : "Sign Up"}
            </Button>
          </div>

          <Divider
            size="small"
            style={{
              borderColor: "#E0E0E0",
              color: "#666666",
              fontSize: "12px",
              margin: "20px 0",
            }}
          >
            or
          </Divider>

          {/* Google Login Button */}
          <div className="text">
            <Button
              type="primary"
              onClick={handleGoogleLogin}
              style={{
                width: "100%",
                height: "44px",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                backgroundColor: "#0f172a",
                borderColor: "#1c56b8",
              }}
              loading={isLoading}
              icon={<Avatar src={logo_google} size={20} />}
            >
              Google
            </Button>
          </div>
        </Flex>
      </Col>

      {/* Right Side - 60% */}
      <Col span={14} style={{ minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
        <div>
          <Image src={background} alt="Background" preview={false} />
        </div>
        {/*<div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        />*/}
      </Col>
    </div>
  );
};

export default Login;
