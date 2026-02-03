import React from "react";
import Content from "../layouts/Content";
import Sidebar from "../layouts/Sidebar";
import styles from "./App.module.scss";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className={styles.App}>
      {/* Style 1 */}
      <Layout style={{ background: "#030416" }}>
        <Layout style={{ background: "#030416" }}>
          <Sidebar />
          <Content data={location.pathname.slice(1)} />
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
