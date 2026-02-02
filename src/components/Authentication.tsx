import React from "react";
import { Outlet } from "react-router-dom";

const Authentication: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default Authentication;
