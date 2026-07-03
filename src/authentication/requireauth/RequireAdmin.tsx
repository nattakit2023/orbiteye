import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, message } from "antd";

interface RequireAdminProps {
  children: React.ReactNode;
}

interface JwtPayload {
  exp?: number; // expiration time (Unix timestamp in seconds)
}

const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp < Math.floor(Date.now() / 1000);
};

const isUserAdmin = (): boolean => {
  // เช็คจาก localStorage flag ที่เก็บไว้ตอน login
  const flag = localStorage.getItem("isAdmin");
  if (flag === "true") return true;

  // Fallback: เช็คจาก user object
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    return !!user.isAdmin;
  } catch {
    return false;
  }
};

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const admin = isUserAdmin();
  const expired = token ? isTokenExpired(token) : true;

  useEffect(() => {
    if (!token || expired) {
      message.warning("Please sign in to continue");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      navigate("/admin/login", { replace: true });
      return;
    }

    if (!admin) {
      message.error("Access denied. Admin privileges required.");
      // ถ้าไม่ใช่ admin ให้กลับไป user login
      navigate("/authentication/login", { replace: true });
    }
  }, [token, expired, admin, navigate, location.pathname]);

  if (!token || expired || !admin) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#0f172a",
        }}
      >
        <Spin size="large" tip="Verifying access..." />
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;