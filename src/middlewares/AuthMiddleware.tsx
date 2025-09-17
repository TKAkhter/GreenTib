import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

export const AuthMiddleware: React.FC = () => {
  const authToken = useSelector((state: RootState) => state.auth.token);

  return authToken ? <Outlet /> : <Navigate to="/login" replace />;
};
