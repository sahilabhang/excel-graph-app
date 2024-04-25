import { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return <AllRoutes />;
}

export default App;

const arrToDisplay = [
  {
    userId: 1,
    id: 1,
    title:
      "sunt aut facere repellat proidnt occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  },
  {
    userId: 1,
    id: 2,
    title: "qui est esse",
    body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
  },
  {
    userId: 1,
    id: 3,
    title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
  },
];
{
  /* {excelData.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(excelData[0]).map((data) => (
                <th key={data}>{data}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {excelData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((data, index) => (
                  <td key={index}>{data}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )} */
}
