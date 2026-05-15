import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
// import { axiosInstance } from "../../service/axiosInstance/axiosInstance";

interface RequireAuthProps {
  children: React.ReactNode;
}

interface JwtPayload {
  exp?: number;  // expiration time (Unix timestamp in seconds)
  iat?: number;  // issued at
  // add other claims as needed
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
        .join("")
    );
    
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;  // treat missing exp as expired
  
  const currentTime = Math.floor(Date.now() / 1000);  // current time in seconds
  return decoded.exp < currentTime;
};

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getItem = localStorage.getItem("token");

  useEffect(() => {
    if (!getItem || getItem === "" || isTokenExpired(getItem)) {
      localStorage.removeItem("token");  // clean up expired token
      navigate("/authentication/login");
    }
  }, [getItem, navigate, location.pathname]);

  return !getItem || getItem === "" || isTokenExpired(getItem) ? <Spin /> : children;
};

export default RequireAuth;