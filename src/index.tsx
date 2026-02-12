import React, { lazy, Suspense } from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AntApp from "antd/es/app";
import Spin from "antd/es/spin";
import App from "./components/App.tsx";
import RequireAuth from "./authentication/requireauth/requireauth.tsx";
import Authentication from "./components/Authentication.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { OrderProvider } from "./context/OrderContext.tsx";

// Lazy load heavy routes
const Dashboard = lazy(() => import("./components/Dashbaord/Dashboard.tsx"));
const Overview = lazy(() => import("./components/Features/Overview.tsx"));
const Profile = lazy(() => import("./components/Features/Profile.tsx"));
const Favorites = lazy(() => import("./components/Features/Favorites.tsx"));
const Cart = lazy(() => import("./components/Features/Cart.tsx"));
const Order = lazy(() => import("./components/Features/Order.tsx"));
const ChangePassword = lazy(() => import("./components/Features/ChangePassword.tsx"));
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
    <OrderProvider>
      <CartProvider>
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
            
              {/* Feature Routes */}
              <Route path="/feature/overview" element={<Overview />} />
              <Route path="/feature/profile" element={<Profile />} />
              <Route path="/feature/favorites" element={<Favorites />} />
              <Route path="/feature/cart" element={<Cart />} />
              <Route path="/feature/order" element={<Order />} />
              <Route path="/feature/change-password" element={<ChangePassword />} />
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
  </CartProvider>
</OrderProvider>
  </React.StrictMode>,
);
