import React, { useState } from "react";
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
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LeftOutlined,
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(login);
    if (login.email === "admin@admin.com" && login.password === "admin") {
      localStorage.setItem("token", "Secret001");
      navigate("/dashboard");
    }
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
                    <Button
                      type="primary"
                      onClick={(e) => handleFormSubmit(e)}
                      style={{ padding: "20px" }}
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
                      onClick={() => ""}
                      style={{ padding: "20px" }}
                      // icon={
                      //   <Avatar
                      //     src="../../../public/assets/logo/google.png"
                      //     size="small"
                      //   />
                      // }
                    >
                      <Avatar src={logo_google} size={18} />
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
