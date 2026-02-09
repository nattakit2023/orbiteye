import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const Footers: React.FC = () => {
  return (
    <>
      <Footer
        style={{
          background: "#fafafa",
          textAlign: "center",
        }}
      >
        Shipexpert Management © {new Date().getFullYear()} Design By Shipexpert
      </Footer>
    </>
  );
};

export default Footers;
