import { createContext, useState } from "react";

export const ExcelContext = createContext({
  excelData: [],
  setExcelData: () => {}
});

const ExcelContextProvider = ({ children }) => {
  const [excelData, setExcelData] = useState([]);

  const setExcelHandler = (excelData) => {
    setExcelData(excelData);
  };

  return (
    <ExcelContext.Provider
      value={{
        excelData: excelData,
        setExcelData: setExcelHandler,
      }}
    >
      {children}
    </ExcelContext.Provider>
  );
};

export default ExcelContextProvider;