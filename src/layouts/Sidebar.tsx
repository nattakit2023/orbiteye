import React, { useState } from "react";
import "../components/App.module.scss";
import { Col, Flex, Image, Input, Layout, Row } from "antd";

import image_logo from "../../public/assets/logo/orbiteye_white.png";
import { LeftOutlined, SearchOutlined } from "@ant-design/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import DrawArea from "./Sidebar/DrawArea";
import Resolution from "./Sidebar/Resolution";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [sidenavType] = useState("transparent");

  return (
    <>
      <Sider
        collapsible
        breakpoint="lg"
        collapsedWidth="0"
        width={300}
        theme="dark"
        style={{
          background: sidenavType,
          padding: "15px 20px",
          margin: "10px 0px",
          height: "100vh-10px", // Full height
          display: "flex",
          flexDirection: "column", // Stack elements vertically
          borderRight: "1px solid white",
          overflow: "hidden",
          color: "white",
        }}
      >
        <Flex vertical gap={10}>
          <Row justify="center" align="middle">
            <Col span={6}></Col>
            <Col span={12}>
              <Image src={image_logo} alt="" style={{ width: "100%" }} preview={false}/>
            </Col>
            <Col span={6}>
              <Row justify="end">
                <Col>
                  <LeftOutlined />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Input
                placeholder="Search"
                style={{
                  backgroundColor: "#293653",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "18px",
                  height: "40px",
                }}
                prefix={
                  <SearchOutlined style={{ color: "rgba(255,255,255,0.5)" }} />
                }
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Tabs defaultValue="drawarea" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="drawarea">
                    Draw Area
                  </TabsTrigger>
                  <TabsTrigger value="resolution">
                    Resolution
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="drawarea" className="mt-6">
                  <DrawArea />
                </TabsContent>

                <TabsContent value="resolution" className="mt-6">
                  <Resolution />
                </TabsContent>
              </Tabs>
            </Col>
          </Row>
        </Flex>
      </Sider>
    </>
  );
};

export default Sidebar;
