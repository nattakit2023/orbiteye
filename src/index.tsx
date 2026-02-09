import React, { lazy, Suspense } from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AntApp from "antd/es/app";
import Spin from "antd/es/spin";
import App from "./components/App.tsx";
import RequireAuth from "./authentication/requireauth/requireauth.tsx";
import Authentication from "./components/Authentication.tsx";

// Lazy load heavy routes
const Dashboard = lazy(() => import("./components/Dashbaord/Dashboard.tsx"));
// const Explore = lazy(() => import("./authentication/explore/explore.tsx"));
const Login = lazy(() => import("./authentication/login/login.tsx"));

const container = document.getElementById("root");
const root = ReactDom.createRoot(container!);

// Loading fallback component
const LoadingFallback = () => (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
    }}
  >
    <Spin size="large" />
    <p style={{ color: "#999" }}>Loading...</p>
  </div>
);

root.render(
  <React.StrictMode>
    <AntApp>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Main authenticated layout with App wrapping all routes */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <App />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Authentication routes */}
            <Route path="authentication" element={<Authentication />}>
              {/*<Route path="explore" element={<Explore />} />*/}
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AntApp>
  </React.StrictMode>,
);
