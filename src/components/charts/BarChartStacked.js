import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";


export default function BarChartStacked({ chartData }) {
  const [selectedOption, setSelectedOption] = useState(
    Object.keys(chartData[0])[1]
  );
  const [selectedSecondaryOption, setSelectedSecondaryOption] = useState("");
  const [xLabelsArray, setXLabelsArray] = useState([]);
  const [seriesArray, setSeriesArray] = useState([]);

  const handleChange = (e, data) => {
    if (!e) {
      handleSingleCheckedCheckbox(data);
      return;
    }

    if (e.target.checked) {
      if (xLabelsArray.length > 0) {
        handleDualCheckedCheckbox(data);
      } else {
        handleSingleCheckedCheckbox(data);
      }
    } else {
      if (selectedOption && e.target.value === selectedSecondaryOption) {
        handleSingleCheckedCheckbox(selectedOption);
      } else if (e.target.value === selectedOption && selectedSecondaryOption) {
        handleSingleCheckedCheckbox(selectedSecondaryOption);
      } else {
        setSelectedOption("");
        setXLabelsArray([]);
        setSeriesArray([]);
      }
    }
  };

  const handleSingleCheckedCheckbox = (e) => {
    let obj = {};
    for (let i = 0; i < chartData.length; i++) {
      if (obj[chartData[i][e]]) {
        obj[chartData[i][e]] = obj[chartData[i][e]] + chartData[i]["count"];
      } else {
        obj[chartData[i][e]] = chartData[i]["count"];
      }
    }

    let xLabels = [];
    let tempSeriesArray = {};

    for (let i = 0; i < Object.keys(obj).length; i++) {
      xLabels.push(Object.keys(obj)[i]);
    }

    tempSeriesArray["count"] = Object.values(obj);

    tempSeriesArray = Object.keys(tempSeriesArray).map((key) => {
      return {
        data: tempSeriesArray[key],
        label: key,
        id: key,
        stack: "total",
      };
    });

    setSelectedOption(e);
    setSelectedSecondaryOption("");
    setXLabelsArray(xLabels);
    setSeriesArray(tempSeriesArray);
  };

  const handleDualCheckedCheckbox = (e) => {
    let uniqueValues = [];

    for (let i = 0; i < chartData.length; i++) {
      if (!uniqueValues.includes(chartData[i][e])) {
        uniqueValues.push(chartData[i][e]);
      }
    }

    const labelValues = [...xLabelsArray];

    let tempSeriesArray = {};

    for (let i = 0; i < uniqueValues.length; i++) {
      let arr = [0, 0];
      for (let j = 0; j < labelValues.length; j++) {
        for (let k = 0; k < chartData.length; k++) {
          if (
            chartData[k][e] === uniqueValues[i] &&
            labelValues[j] == chartData[k][selectedOption]
          ) {
            arr[j] = chartData[k]["count"];
          }
        }
      }
      tempSeriesArray[uniqueValues[i]] = arr;
    }

    tempSeriesArray = Object.keys(tempSeriesArray).map((key) => {
      return {
        data: tempSeriesArray[key],
        label: key,
        id: key,
        stack: "total",
      };
    });

    setSeriesArray(tempSeriesArray);
    setSelectedSecondaryOption(e);
  };

  useEffect(() => {
    if (selectedOption) {
      handleSingleCheckedCheckbox(selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selectedOption && selectedSecondaryOption) {
      let checkboxHTMLCollection = document.getElementsByClassName("bar-data");
      const checkboxArray = Array.from(checkboxHTMLCollection);
      checkboxArray.forEach((ele) => {
        if (!ele.checked) {
          ele.disabled = true;
        }
      });
    } else {
      let checkboxHTMLCollection = document.getElementsByClassName("bar-data");
      const checkboxArray = Array.from(checkboxHTMLCollection);
      checkboxArray.forEach((ele) => {
        ele.disabled = false;
      });
    }
  }, [selectedOption, selectedSecondaryOption]);

  useEffect(() => {
    handleChange(null, Object.keys(chartData[0])[1])
  },[chartData])

  return (
    <React.Fragment>
      <div>
        <h1>Bar Chart</h1>
      </div>
      <div class="form-check-inline">
        {Object.keys(chartData[0]).map(
          (data, index) =>
            data !== "count" && (
              <div class="form-check-inline">
                <label class="form-check-label">
                  <input
                    type="checkbox"
                    class="form-check-input bar-data"
                    name="values"
                    value={data}
                    onClick={(e) => handleChange(e, data)}
                    checked={
                      selectedOption === data ||
                      selectedSecondaryOption === data
                    }
                  />
                  {data}
                </label>
              </div>
            )
        )}
      </div>
      <BarChart
        width={700}
        height={500}
        series={seriesArray}
        xAxis={[{ data: xLabelsArray, scaleType: "band" }]}
      />
    </React.Fragment>
  );
}
