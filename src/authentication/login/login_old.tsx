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
  LeftOutlined,
} from "@ant-design/icons";
import logo from "@/public/assets/logo/orbiteye_white.png";
import logo_google from "@/public/assets/logo/google.png";
import background from "@/public/assets/image/Login_Background.png";
// Removed useGoogleLogin import - using direct fetch instead
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Google login handled via direct fetch in handleGoogleCallback

  // Handle Google OAuth callback
  const handleGoogleCallback = useCallback(async () => {
    // Check for Google OAuth callback params in URL
    const params = new URLSearchParams(window.location.search);
    const googleId = params.get("google_id");
    const email = params.get("email");
    const firstName = params.get("first_name");

    if (googleId && email && firstName) {
      setIsGoogleLoading(true);
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
          },
        );

        const data = await result.json();

        if (data.data?.googleLogin?.token) {
          localStorage.setItem("token", data.data.googleLogin.token);
          if (data.data.googleLogin.user) {
            localStorage.setItem(
              "user",
              JSON.stringify(data.data.googleLogin.user),
            );
          }
          message.success("Google login successful!");
          // Clear URL params
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
          navigate("/dashboard");
        } else if (data.errors) {
          message.error(data.errors[0]?.message || "Google login failed");
        }
      } catch (error) {
        console.error("Google login failed:", error);
        message.error("Google login failed. Please try again.");
      } finally {
        setIsGoogleLoading(false);
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
        },
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
    }
  };

  const handleGoogleLogin = () => {
    // Build Google OAuth URL
    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id";
    const redirectUri = `${window.location.origin}/authentication/login`;
    const scope = encodeURIComponent("email profile");
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    // Open Google OAuth in popup or redirect
    window.location.href = googleAuthUrl;
  };

  return (
    <div>
      <div className="background_image">
        {/*<div id="grad1"></div>*/}
        <Image
          src={background}
          alt="Background"
          width="100%"
          height="100%"
          preview={false}
        />
      </div>
      <div>
        <Row className="front_background_100">
          <Col span={24}>
            <Flex
              className="login_right"
              justify="center"
              align="center"
              vertical
            >
              <Card
                style={{
                  width: "500px",
                  backgroundColor: "#1c273b",
                  border: "0.5px solid #333333",
                  borderRadius: "10px",
                  backdropFilter: "blur(10px)",
                  padding: "0px 20px 30px 20px",
                }}
              >
                <div className="text">
                  <Row align="middle">
                    <Col span={2}>
                      <Row justify="start">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<LeftOutlined />}
                          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                        />
                      </Row>
                    </Col>
                    <Col span={20}>
                      <Row justify="center">
                        <Image src={logo} width={"50%"} preview={false} />
                      </Row>
                    </Col>
                  </Row>
                </div>
                <div className="text">
                  <Flex align="center" vertical>
                    <Text
                      strong
                      style={{
                        color: "#FFFFFF",
                        marginTop: "10px",
                        fontSize: "18px",
                      }}
                    >
                      Login
                    </Text>
                  </Flex>
                </div>
                <div className="text">
                  <Row justify="center" align="middle" gutter={[16, 6]}>
                    <Col span={24}>
                      <Text
                        strong
                        style={{
                          color: "#FFFFFF",
                          fontSize: "16px",
                        }}
                      >
                        Email
                      </Text>
                    </Col>
                    <Col span={24}>
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
                    </Col>
                  </Row>
                </div>
                <div className="text">
                  <Row justify="center" align="middle">
                    <Col span={24}>
                      <Text
                        strong
                        style={{
                          color: "#FFFFFF",
                          fontSize: "16px",
                        }}
                      >
                        Password
                      </Text>
                    </Col>
                    <Col span={24}>
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
                      ></Input.Password>
                    </Col>
                  </Row>
                </div>
                <div className="text">
                  <Flex justify="end">
                    <Text
                      strong
                      style={{
                        color: "#FFFFFF",
                        fontSize: "16px",
                      }}
                    >
                      Forgot password?
                    </Text>
                  </Flex>
                </div>
                <div className="text">
                  <Flex justify="end">
                    <Button
                      type="primary"
                      onClick={(e) => handleFormSubmit(e)}
                      style={{ padding: "20px" }}
                      loading={isGoogleLoading}
                    >
                      Login
                    </Button>
                  </Flex>
                </div>
                <Divider
                  size="large"
                  style={{
                    borderColor: "#FFFFFF",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  {" "}
                  or{" "}
                </Divider>
                <div className="text">
                  <Flex justify="end">
                    <Button
                      type="default"
                      onClick={handleGoogleLogin}
                      style={{ padding: "20px" }}
                      loading={isGoogleLoading}
                      icon={<Avatar src={logo_google} size={18} />}
                    >
                      Google
                    </Button>
                  </Flex>
                </div>
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
        </Row>
      </div>
    </div>
  );
};

export default Login;
