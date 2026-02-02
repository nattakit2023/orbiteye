import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
// import { axiosInstance } from "../../service/axiosInstance/axiosInstance";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getItem = localStorage.getItem("token");
  
  useEffect(() => {
    if (getItem == undefined) {
      navigate("/authentication/explore");
    }
  }, [getItem, navigate, location.pathname]);

  return getItem == undefined ? <Spin /> : children;
};

export default RequireAuth;
