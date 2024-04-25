# Excel-graph app

This app enables you to upload an Excel sheet and visualize it in tabular format, filtered and sorted based on your chosen titles. Additionally, you can apply sorting and filtering options to refine your data further. Once customized, the app generates various charts based on your selected data, offering deeper insights at a glance.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Packages Used](#packages-used)

## Installation
To install the app, follow these steps:
1. Clone the app repository.
2. To the root level of the project, run the command `npm install` to download all required packages.
3. Start the application by running `npm start`.

## Usage
Follow these steps to use the application:
1. Start on the home page and click the "Upload" link to upload an Excel sheet.
2. Upon reaching the dashboard page, you'll find it divided into two sections:
   - The left side displays checkboxes containing all titles from the uploaded Excel sheet.
   - The right side features a table with dynamically changing headers and multi-select dropdowns based on the selected checkboxes.
3. Once you've selected the desired values from the header multi-select dropdowns, you will see the filtered table, and a "Chart" link will appear at the top. Clicking this link will reveal various charts.

## Packages Used
The following packages were used in the project:
1. 'chart.js' and 'react-chartjs-2': These packages are used for creating and displaying interactive charts.
2. 'react-multi-select-component': This package provides functionality for creating dropdowns with multiple selection support.
3. 'xlsx': This package is used for reading data from Excel sheets.
4. 'react-router-dom': This package is utilized for handling routing within the application.
