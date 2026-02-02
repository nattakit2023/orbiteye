import React from "react";
import { Breadcrumb, Typography, Flex, Col } from "antd";
const { Title } = Typography;

const Header: React.FC = (props: any) => {
  return (
    <Flex align="center" justify="space-between">
      <Col>
        <Title level={1}>{props.title}</Title>
        <Breadcrumb>
          <Breadcrumb.Item href="/dashboard">Home</Breadcrumb.Item>
          {props.item.length != 1 &&
            props.item.map((item: any, index: number) => (
              <Breadcrumb.Item
                href={
                  props.item.length != index + 1
                    ? `/${props.item.slice(0, index + 1).join("/")}`
                    : ""
                }
              >
                {item.split("_").length == 2
                  ? item.split("_")[0].charAt(0).toUpperCase() +
                    "" +
                    item.split("_")[0].slice(1) +
                    " " +
                    item.split("_")[1].charAt(0).toUpperCase() +
                    "" +
                    item.split("_")[1].slice(1)
                  : item.split("_")[0].charAt(0).toUpperCase() +
                    "" +
                    item.split("_")[0].slice(1)}
              </Breadcrumb.Item>
            ))}
        </Breadcrumb>
      </Col>
      <Col></Col>
    </Flex>
  );
};

export default Header;
