import React, { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import "chart.js/auto";

const CustomChart = ({ chartData, ChartType }) => {
  const [chartOption, setChartOption] = useState("");
  const [selectedOption, setSelectedOption] = useState(Object.keys(chartData[0])[0]);

  const handleChange = (e) => {
    const data = e;
    const ageCounts = chartData.reduce((acc, curr) => {
      const key = curr[data];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    setChartOption(ageCounts);
    setSelectedOption(e);
  };

  useEffect(() => {
    handleChange(Object.keys(chartData[0])[0]);
  }, []);

  const chartDataValue = {
    labels: Object.keys(chartOption).map((age) => `${age}`),
    datasets: [
      {
        label: "Distribution",
        data: Object.values(chartOption),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF8C00",
          "#9966CC",
          "#00CED1",
          "#32CD32",
          "#BDB76B",
          "#FF69B4",
          "#7B68EE",
        ],
      },
    ],
  };

  return (
    <div>
      <h1>{ChartType} Chart</h1>
      <div class="form-check-inline">
        {Object.keys(chartData[0]).map((data, index) => (
          <div class="form-check-inline">
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input"
                name={`${ChartType}-optradio`}
                value={data}
                onChange={() => handleChange(data)} 
                checked={(index === 0 && !selectedOption) || selectedOption === data}
              />
              {data}
            </label>
          </div>
        ))}
      </div>

      {ChartType === "Pie" && (
        <Pie data={chartDataValue} />
      )}
      {ChartType === "Line" && (
        <Line data={chartDataValue} />
      )}
      {ChartType === "Bar" && (
        <Bar data={chartDataValue} />
      )}
    </div>
  );
};

export default CustomChart;
