import React, { useContext } from "react";
import { ExcelContext } from "../context/excel-context";
import { Navigate } from "react-router-dom";
import Upload from "../components/Upload";

const PrivateRoute = ({ children }) => {
  const { excelData } = useContext(ExcelContext);

  if (!excelData) {
    return <Upload />;
  }
  return children;
};

export default PrivateRoute;
