import React from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App as AntApp } from "antd";
import App from "./components/App.tsx";
import RequireAuth from "../src/authentication/requireauth/requireauth.tsx";
import Authentication from "./components/Authentication.tsx";
import Login from "../src/authentication/login/login.tsx";
import Explore from "./authentication/explore/explore.tsx";
import Dashboard from "./components/Dashbaord/Dashboard.tsx";

const container = document.getElementById("root");
const root = ReactDom.createRoot(container!);

root.render(
  <React.StrictMode>
    <AntApp>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <App />
              </RequireAuth>
            }
          >
            <Route index path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="authentication" element={<Authentication />}>
            <Route path="explore" element={<Explore />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AntApp>
  </React.StrictMode>,
);
