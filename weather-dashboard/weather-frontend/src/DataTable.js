// src/DataTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import './DataTable.css';

const DataTable = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/weather')
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        setError(error);
      });
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(weatherData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Weather Data');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(data, 'weather_data.xlsx');
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Weather Data</h1>
      <button onClick={exportToExcel}>Export to Excel</button>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Temperature (NN)</th>
            <th>Pressure (NN)</th>
            <th>Humidity (NN)</th>
            <th>Temperature (BH)</th>
            <th>Pressure (BH)</th>
            <th>Humidity (BH)</th>
            <th>Temperature (KS)</th>
            <th>Pressure (KS)</th>
            <th>Humidity (KS)</th>
            <th>Temperature (AZ)</th>
            <th>Pressure (AZ)</th>
            <th>Humidity (AZ)</th>
          </tr>
        </thead>
        <tbody>
          {weatherData.map(data => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.timestamp}</td>
              <td>{data.temperature_nn}</td>
              <td>{data.pressure_nn}</td>
              <td>{data.humidity_nn}</td>
              <td>{data.temperature_bh}</td>
              <td>{data.pressure_bh}</td>
              <td>{data.humidity_bh}</td>
              <td>{data.temperature_ks}</td>
              <td>{data.pressure_ks}</td>
              <td>{data.humidity_ks}</td>
              <td>{data.temperature_az}</td>
              <td>{data.pressure_az}</td>
              <td>{data.humidity_az}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
