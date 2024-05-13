import React, { useContext, useEffect, useState } from "react";
import { ExcelContext } from "../context/excel-context";
import { MultiSelect } from "react-multi-select-component";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import PieDataSet from "./charts/PieDataSet";
import BarChartStacked from "./charts/BarChartStacked";

const Dashboard = () => {
  const { excelData } = useContext(ExcelContext);
  const navigate = useNavigate();
  const [compareList, setCompareList] = useState({});
  const [filteredExcelData, setFilteredExcelData] = useState([]);
  const [arrayToDisplay, setArrayToDisplay] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState([]);
  const [sortSelection, setSortSelection] = useState({
    sortValue: "",
    sortDirection: "asc",
  });

  const navigateToUpload = () => {
    navigate("/");
  };

  const clearCheckbox = () => {
    let checkboxHTMLCollection = document.getElementsByClassName(
      "custom-control-input"
    );
    const checkboxArray = Array.from(checkboxHTMLCollection);
    checkboxArray.forEach((ele) => (ele.checked = false));

    // clear respective states
    setCompareList([]);
    setSelectedTitle([]);
    setFilteredExcelData([]);
    setArrayToDisplay([]);

    // reset sorting
    setSortSelection({ sortValue: "", sortDirection: "asc" });
  };

  const checkHandler = (e) => {
    let nameData = e.target.name;
    if (e.target.checked) {
      setSelectedTitle([...selectedTitle, e.target.name]);
      console.log(e.target.name);
      const tempArray = JSON.parse(JSON.stringify(excelData));
      const updatedTempArray = [];

      const updatedDropdownArraySet = new Set();

      for (let i = 0; i < tempArray.length; i++) {
        let currentvalue = tempArray[i][nameData];

        if (updatedDropdownArraySet.has(currentvalue)) {
          delete tempArray[i][nameData];
        } else {
          updatedDropdownArraySet.add(tempArray[i][nameData]);
        }

        if (tempArray[i][nameData]) {
          updatedTempArray.push({
            ...filteredExcelData[i],
            [nameData]: tempArray[i][nameData],
          });
        } else {
          updatedTempArray.push({
            ...filteredExcelData[i],
          });
        }
      }

      setFilteredExcelData(updatedTempArray);
    } else {
      let updatedSelectedTitleArray = [...selectedTitle];
      let updatedCompareList = { ...compareList };

      updatedSelectedTitleArray = updatedSelectedTitleArray.filter(
        (name) => name !== nameData
      );
      setSelectedTitle(updatedSelectedTitleArray);

      let tempArray = JSON.parse(JSON.stringify(filteredExcelData));

      for (let i = 0; i < tempArray.length; i++) {
        delete tempArray[i][nameData];
      }
      if (Object.keys(tempArray[0]).length === 0) {
        tempArray = [];
      }
      for (let i = 0; i < arrayToDisplay.length; i++) {
        delete arrayToDisplay[i][nameData];
      }
      delete updatedCompareList[nameData];

      if (updatedCompareList) {
        setArrayToDisplay([]);
      }
      setCompareList(updatedCompareList);
      setFilteredExcelData(tempArray);
    }
  };

  const generateCheckedList = (e, data) => {
    const arrayToCompare = { ...compareList };
    if (e.length > 0) {

      const values = e.map((val) => val.value);
      if (arrayToCompare.hasOwnProperty(data)) {
        e.forEach((val) => {
          if (!arrayToCompare[data].includes(val.value)) {
            arrayToCompare[data].push(val.value);
          }
        });
      } else {
        arrayToCompare[data] = values.filter(
          (val, index) => values.indexOf(val) === index
        );
      }

    } else {
      delete arrayToCompare[data];
      if (Object.keys(arrayToCompare).length === 0) {
        setArrayToDisplay([]);
      }
    }
    setCompareList(arrayToCompare);
  };

  const generateTable = () => {
    const updatedArray = JSON.parse(JSON.stringify(excelData));

    const filteredArray = updatedArray.filter((obj) => {
      return Object.keys(compareList).every((key) => {
        return compareList[key].includes(obj[key]);
      });
    });

    const titleData = [...selectedTitle];
    const updatedArrayToDisplay = [];

    for (let i = 0; i < filteredArray.length; i++) {
      const tempArray = {};
      for (let j = 0; j < titleData.length; j++) {
        tempArray[titleData[j]] = filteredArray[i][titleData[j]];
      }
      updatedArrayToDisplay.push(tempArray);
    }

    if(updatedArrayToDisplay.length === 0){
      setArrayToDisplay([]);
      return;
    }
    const tempChartArrayData = [];

    Object.keys(updatedArrayToDisplay[0]).forEach((key) => {
      for (let i = 0; i < updatedArrayToDisplay.length; i++) {
        if (tempChartArrayData.hasOwnProperty(key)) {
          tempChartArrayData[key].push(updatedArrayToDisplay[i][key]);
        } else {
          tempChartArrayData[key] = [];
          tempChartArrayData[key].push(updatedArrayToDisplay[i][key]);
        }
      }
    });

    if (Object.keys(compareList).length > 0) {
      const arr = combineAndCount(updatedArrayToDisplay);
      setArrayToDisplay(arr);
    }
  };

  function combineAndCount(data) {
    const combinedData = {};

    data.forEach((obj) => {
      const key = `${JSON.stringify(obj)}`;
      if (combinedData[key]) {
        combinedData[key].count++;
      } else {
        combinedData[key] = { count: 1, ...obj };
      }
    });

    return Object.values(combinedData);
  }

  useEffect(() => {
    generateTable();
  }, [compareList, selectedTitle]);

  const sortData = (value, sortType) => {
    const updatedArray = JSON.parse(JSON.stringify(arrayToDisplay));
    if (value !== sortSelection.sortValue) {
      sortType = "asc";
    }
    updatedArray.sort((a, b) => {
      if (sortType === "asc") {
        if (!isNaN(a[value]) && !isNaN(b[value])) {
          return parseFloat(a[value]) - parseFloat(b[value]);
        } else if (isValidDate(a[value]) && isValidDate(b[value])) {
          return new Date(a[value]) - new Date(b[value]);
        } else if (
          typeof a[value] === "string" &&
          typeof b[value] === "string"
        ) {
          return a[value].localeCompare(b[value]);
        } else {
          return 0;
        }
      } else {
        if (!isNaN(a[value]) && !isNaN(b[value])) {
          return parseFloat(b[value]) - parseFloat(a[value]);
        } else if (isValidDate(a[value]) && isValidDate(b[value])) {
          return new Date(b[value]) - new Date(a[value]);
        } else if (
          typeof a[value] === "string" &&
          typeof b[value] === "string"
        ) {
          return b[value].localeCompare(a[value]);
        } else {
          return 0;
        }
      }
    });

    function isValidDate(value) {
      return !isNaN(new Date(value).getTime());
    }

    console.log(updatedArray);
    setArrayToDisplay(updatedArray);

    setSortSelection({
      ...sortSelection,
      sortValue: value,
      sortDirection: sortType,
    });
  };

  return (
    <div className="container-fluid">
      <main class="content-wrapper row">
        <aside class="col-md-2">
          <div class="sideNav">
            <div className="d-flex flex-row align-items-center">
              {" "}
              <div onClick={navigateToUpload}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-arrow-left-circle"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"
                  />
                </svg>
              </div>
              &nbsp;&nbsp;&nbsp;
              <div>
                <h2>Titles</h2>
              </div>
            </div>
            <div
              style={{
                visibility: selectedTitle.length > 0 ? "visible" : "hidden",
                marginTop: "-15px",
                marginBottom: "5px",
              }}
            >
              <span
                className="badge badge-pill badge-success"
                onClick={clearCheckbox}
              >
                clear checkbox
              </span>
            </div>
            {Object.keys(excelData[0]).map((data) => (
              <div key={data} class="custom-control custom-checkbox mb-3">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  onChange={checkHandler}
                  id={data}
                  name={data}
                  value={data}
                />
                &nbsp;
                <label className="custom-control-label" htmlFor={data}>
                  {data}
                </label>
              </div>
            ))}
          </div>
        </aside>

        <div class="container-fluid col-md-10">
          <div
            className="col-sm-12"
            style={{
              // backgroundColor: "lightblue",
              borderRadius: "20px",
              padding: "10px",
            }}
          >
            <div>
              <h1 class="mt-1 displayInline">Table</h1>

              {arrayToDisplay.length > 0 && (
                <p class="naturalLanguageText displayInline">
                  I want to see this in{" "}
                  <a>
                    <label htmlFor="generateChart">Chart</label>
                  </a>
                </p>
              )}

              <button
                id="generateChart"
                type="button"
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#exampleModalCenter"
                x
              >
                Generate chart
              </button>
            </div>
            {filteredExcelData.length === 0 && (
                <span className="d-flex justify-content-center align-items-center" style={{minHeight: "80vh"}}>
                  <h2 style={{ color: "grey"}}>No Data Found. Start selecting checkboxes and filter the rows.</h2>
                </span>   
              )}
            <div class="tableDiv">
              <table
                class="table table-responsive table-hover"
                style={{ minHeight: "500px", marginBottom: '50px'}}
              >
                <thead>
                  <tr>
                    {filteredExcelData.length > 0 && (
                      <td onClick={() =>
                        sortData(
                          'count',
                          sortSelection.sortDirection === "asc"
                            ? "desc"
                            : "asc"
                        )
                      }>
                        <strong>
                          Count{" "}
                          {sortSelection.sortValue === 'count' &&
                          sortSelection.sortDirection === "asc"
                            ? "▲"
                            : ""}
                          {sortSelection.sortValue === 'count' &&
                          sortSelection.sortDirection === "desc"
                            ? "▼"
                            : ""}
                        </strong>
                      </td>
                    )}
                    {filteredExcelData.length > 0 &&
                      Object.keys(filteredExcelData[0]).map((data) => (
                        <th key={data}>
                          <div>
                            <div
                              onClick={() =>
                                sortData(
                                  data,
                                  sortSelection.sortDirection === "asc"
                                    ? "desc"
                                    : "asc"
                                )
                              }
                            >
                              <strong>
                                {data}
                                {sortSelection.sortValue === data &&
                                sortSelection.sortDirection === "asc"
                                  ? "▲"
                                  : ""}
                                {sortSelection.sortValue === data &&
                                sortSelection.sortDirection === "desc"
                                  ? "▼"
                                  : ""}
                              </strong>
                            </div>
                            {filteredExcelData.length > 0 && (
                              <MultiSelect
                                options={filteredExcelData
                                  .filter((ele) => ele[data] !== undefined)
                                  .map((ele) => {
                                    return {
                                      label: ele[data],
                                      value: ele[data],
                                    };
                                  })
                                  .sort((a, b) => {
                                    if (!isNaN(a.value)) {
                                      return a.value - b.value;
                                    }
                                  })}
                                value={
                                  compareList[data]
                                    ? compareList[data].map((val) => ({
                                        label: val,
                                        value: val,
                                      }))
                                    : []
                                }
                                onChange={(e) => generateCheckedList(e, data)}
                                labelledBy="Select"
                              />
                            )}
                          </div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {arrayToDisplay.map((row) => (
                    <tr>
                      {Object.values(row).map((data, index) => (
                        <>
                          {index === 0 ? (
                            <td key={index}>
                              <span className="badge badge-pill badge-info">
                                {data}
                              </span>
                            </td>
                          ) : (
                            <td key={index}>{data}</td>
                          )}
                        </>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* modal */}

      <div
        class="modal fade"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-dialog-centered mw-100 w-90 modal-dialog-scrollable"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">
                Charts
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-6">
                    {arrayToDisplay.length > 0 && (
                      <BarChartStacked chartData={arrayToDisplay} />
                    )}
                  </div>
                  <div class="col-md-6 ">
                    {arrayToDisplay.length > 0 && (
                      <PieDataSet chartData={arrayToDisplay} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
