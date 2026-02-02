import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../authentication.css";
import {
  Image,
  Row,
  Col,
  Flex,
  Input,
  Typography,
  Button,
  Divider,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const { Text } = Typography;

interface LoginType {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState<Partial<LoginType>>({
    username: "",
    password: "",
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(login);
    if (login.username === "admin" && login.password === "admin") {
      localStorage.setItem("token", "Secret001");
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <div className="background_image">
        {/*<div id="grad1"></div>*/}
        <Image
          src="../../../public/assets/image/Login_Background.png"
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
              <div
                style={{
                  width:"400px",
                  backgroundColor: "#1c273b",
                  border: "0.5px solid #333333",
                  borderRadius: "10px",
                  backdropFilter: "blur(10px)",
                  padding: "20px 30px",
                }}
              >
                <div className="text">
                  <Flex align="center" vertical>
                    <Image
                      src="../../../public/assets/logo/orbiteye_white.png"
                      width={150}
                    ></Image>
                  </Flex>
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
                    <Button type="primary" onClick={(e) => handleFormSubmit(e)}>
                      Login
                    </Button>
                  </Flex>
                </div>
                <Divider size="large" />
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
              </div>
            </Flex>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
