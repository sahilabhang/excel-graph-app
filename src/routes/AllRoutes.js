import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Upload from "../components/Upload";
import Dashboard from "../components/Dashboard";
import PrivateRoute from "./PrivateRoute";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Upload />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to={'/'} />} />
    </Routes>
  );
};

export default AllRoutes;
