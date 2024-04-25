import { useContext, useState } from "react";
import * as XLSX from "xlsx";
import { ExcelContext } from "../context/excel-context";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

function Upload() {
  const [file, setFile] = useState();
  const { setExcelData } = useContext(ExcelContext);
  const navigate = useNavigate();

  const fileUploadHandler = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        dateNF: "yyyy-mm-dd",
        raw: false,
      });
      setExcelData(parsedData);
      navigate("/dashboard");
    };
  };

  return (
    <div className="App">
      <div>Hey there, let's <a ><label htmlFor="file-upload" >
         upload
      </label></a> the file here. I accept only .xlsx, .xls formats.</div>
      <div>
      <input
        id="file-upload"
        type="file"
        accept=".xlsx, .xls"
        onChange={fileUploadHandler}
      />
      </div>
    </div>
  );
}

export default Upload;
