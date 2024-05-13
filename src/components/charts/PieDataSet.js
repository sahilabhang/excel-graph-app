import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

export default function PieDataSet({ chartData }) {
  const [selectedOption, setSelectedOption] = useState(Object.keys(chartData[0])[1]);
  const [selectedSecondaryOption, setSelectedSecondaryOption] = useState("");
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  const handleChange = (e, data = null) => {
    if(!e){
      handleSingleCheckedCheckbox(data);
      return;
    }
    if(e.target.checked){
      if(data1.length > 0){
        handleDualCheckedCheckbox(e.target.value)
      }else{
        handleSingleCheckedCheckbox(e.target.value);
      }
    }else{
      if(e.target.value == selectedSecondaryOption){
        handleSingleCheckedCheckbox(selectedOption)
      }else if(e.target.value === selectedOption && selectedSecondaryOption){
        handleSingleCheckedCheckbox(selectedSecondaryOption)
      }else{
        setSelectedOption('');
        setSelectedSecondaryOption('');
        setData1([]);
        setData2([]);
      }
    }
  };

  const handleSingleCheckedCheckbox = (data) => {
    
    let obj = {};

    for(let i = 0; i < chartData.length; i++){
      if(obj[chartData[i][data]]){
        obj[chartData[i][data]] = obj[chartData[i][data]] + chartData[i]['count']
      }else{
        obj[chartData[i][data]] = chartData[i]['count']
      }
    }

    const tempData1 =  Object.keys(obj).map(ele => {
      return { 'label': ele, 'value': obj[ele] }
    })

    setSelectedOption(data);
    setSelectedSecondaryOption('')
    setData1(tempData1);
    setData2([])
  }

  const handleDualCheckedCheckbox = (data) => {

    const primaryCheckboxSelectionArray = data1.map(ele => ele.label);

    const secondaryCheckboxSelectionArray = [];
    
    for(let i = 0; i < chartData.length; i++){
      if(!secondaryCheckboxSelectionArray.includes(chartData[i][data])){
        secondaryCheckboxSelectionArray.push(chartData[i][data]);
      }
    }

    let tempData2 = [];

    for(let i = 0; i < primaryCheckboxSelectionArray.length; i++){
      for(let j = 0; j < secondaryCheckboxSelectionArray.length; j++){
        let obj = {};
        for(let k = 0; k < chartData.length; k++){
          if(primaryCheckboxSelectionArray[i] === chartData[k][selectedOption] && secondaryCheckboxSelectionArray[j] === chartData[k][data]){
            if(obj[secondaryCheckboxSelectionArray[j]]){
              obj[secondaryCheckboxSelectionArray[j]] = obj[secondaryCheckboxSelectionArray[j]] + chartData[k]['count']
            }else{
              obj[secondaryCheckboxSelectionArray[j]] = chartData[k]['count']
            }
          }
        }
        tempData2.push({'label': Object.keys(obj)[0],  'value': Object.values(obj)[0] })
      }
    }

    setSelectedSecondaryOption(data);
    setData2(tempData2);
  }

  // Commented code for displaying % wise distribution

  const TOTAL = data1.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${params.label}\n${(percent * 100).toFixed(0)}%`;
  };

  const series = [
    {
      innerRadius: 0,
      outerRadius: data2.length > 0 ? 110 : 170,
      id: "series-1",
      data: data1,
      arcLabel: (params) => params.label ?? '',
    },
    {
      innerRadius: 120,
      outerRadius: 190,
      id: "series-2",
      data: data2,
      arcLabel: (params) => params.label ?? ''
    },
    
  ];

  useEffect(() => {
    if(selectedOption && selectedSecondaryOption){
      let checkboxHTMLCollection = document.getElementsByClassName("pie-data");
      const checkboxArray = Array.from(checkboxHTMLCollection);
      checkboxArray.forEach((ele) => {
        if (!ele.checked) {
          ele.disabled = true;
        }
      });
    }else{
      let checkboxHTMLCollection = document.getElementsByClassName("pie-data");
      const checkboxArray = Array.from(checkboxHTMLCollection);
      checkboxArray.forEach((ele) => {
        ele.disabled = false;
      });
    }
  }, [selectedOption, selectedSecondaryOption]);

  useEffect(() => {
    if(selectedOption){
      handleChange(null, selectedOption);
    }
  }, [selectedOption])


  return (
    <React.Fragment>
      <div>
        <h1>Pie Chart</h1>
      </div>
      <div class="form-check-inline">
        {Object.keys(chartData[0]).map(
          (data) =>
            data !== "count" && (
              <div class="form-check-inline">
                <label class="form-check-label">
                  <input
                    type="checkbox"
                    class="form-check-input pie-data"
                    name="values"
                    value={data}
                    onClick={(e) => handleChange(e)}
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
      <Stack sx={{ width: "100%" }}>
        <Box sx={{ flexGrow: 1 }}>
          <PieChart
            series={series}
            width={480}
            height={480}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: 'white',
                fontSize: 14,
                fontWeight: 'bold'
              },
            }}
            slotProps={{
              legend: {
                hidden: true,
                label: {
                  style: {
                    whiteSpace: 'pre-line', // Interpret '\n' as line break
                  },
                }
              },
            }}
            skipAnimation='false'
          />
        </Box>
      </Stack>
    </React.Fragment>
  );
}
