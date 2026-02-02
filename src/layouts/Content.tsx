import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

interface ContentsProps {
  data: string;
}

const Contents: React.FC<ContentsProps> = (props) => {

  return (
    <>
      {/* Theme 1 */}
      <Content
        style={{
          margin: "16px 24px",
          padding: "16px 24px",
        }}
      >
        <Outlet context={props.data} />
      </Content>

      {/* Theme 2 */}
      {/* <Content
        style={{
          padding: "0 48px",
        }}
      >
        <Layout
          style={{
            margin: "16px 0",
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Content
            style={{
              padding: "0 24px",
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Content> */}
    </>
  );
};

export default Contents;
