import React from "react";
import { Route, Routes } from "react-router-dom";
import Upload from "../components/Upload";
import Dashboard from "../components/Dashboard";
import PrivateRoute from "./PrivateRoute";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Upload />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AllRoutes;
