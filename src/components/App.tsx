import React from "react";
// import Navbar from "../layouts/Navbar";
// import Sidebar from "../layouts/Sidebar";
import Content from "../layouts/Content";
import Footers from "../layouts/Footer";
import styles from "./App.module.scss";
import { Layout, FloatButton } from "antd";
import { LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../service/axiosInstance/axiosInstance";

// const { Title, Text } = Typography;

// const { Sider, Header, Content, Footer } = Layout;
function App() {
  const location = useLocation();
  // Removed unnecessary state variable

  const checkauth = async () => {
    const auth = await axiosInstance.post("/api/main/check_auth");
    return auth;
  };

  const logout = async (e: React.FormEvent) => {
    e.preventDefault();
    checkauth().then(async (res) => {
      if (res.data) {
        await axiosInstance.post("/api/main/logout", {
          user_id: res.data.sub,
        });
        localStorage.removeItem("token");
        window.location.href = "/authentication/login";
      }
    });
  };

  // Removed unnecessary useEffect

  return (
    <div className={styles.App}>
      {/* Style 1 */}
      <Layout style={{ background: "#fafafa" }}>
        <Layout style={{ background: "#fafafa" }}>
          <Content data={location.pathname.slice(1)} />
          <Footers />
        </Layout>
        <FloatButton.Group
          trigger="click"
          style={{
            insetInlineEnd: 24,
          }}
          icon={<PlusOutlined />}
        >
          <FloatButton.BackTop />
          <FloatButton icon={<LogoutOutlined />} onClick={(e) => logout(e)} />
        </FloatButton.Group>
      </Layout>

      {/* Style 2 */}
      {/* <Layout>
        <Navbar />
        <Content />
        <Footers />
      </Layout> */}

      {/* Style 3 */}
      {/* <Layout style={{ minHeight: "100vh" }}>
        <Sider width={200} theme="light">
          <div
            className="logo"
            style={{ padding: "16px", textAlign: "center" }}
          >
            <Title level={3}>Muse Dashboard</Title>
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="2" icon={<TableOutlined />}>
              Tables
            </Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>
              Profile
            </Menu.Item>
            <Menu.Item key="4" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <Title level={3} style={{ margin: "16px" }}>
              Dashboard
            </Title>
          </Header>
          <Content style={{ margin: "16px" }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card title="Today's Sales" bordered={false}>
                  <Text strong>$53,000</Text>
                  <br />
                  <Text type="success">+30%</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="Today's Users" bordered={false}>
                  <Text strong>3,200</Text>
                  <br />
                  <Text type="success">+20%</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="New Clients" bordered={false}>
                  <Text strong>+1,200</Text>
                  <br />
                  <Text type="danger">-20%</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="New Orders" bordered={false}>
                  <Text strong>$13,200</Text>
                  <br />
                  <Text type="success">+10%</Text>
                </Card>
              </Col>
            </Row>
            {/* Additional rows and charts can be added here
          </Content>
        </Layout>
      </Layout> */}
    </div>
  );
}

export default App;
