import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import './DataTable.css';
import RegionNN from './RegionNN';
import RegionBH from './RegionBH';
import RegionKS from './RegionKS';
import RegionAZ from './RegionAZ';

const DataTable = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);

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

  const handleEdit = (data) => {
    setEditingData(data);
  };

  const handleSave = () => {
    axios.put(`http://localhost:5000/api/weather?id=${editingData.id}`, editingData)
      .then(response => {
        setWeatherData(weatherData.map(item => item.id === editingData.id ? editingData : item));
        setEditingData(null);
      })
      .catch(error => {
        setError(error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Weather Data</h1>
      <button onClick={exportToExcel}>Export to Excel</button>
      <RegionNN data={weatherData} onEdit={handleEdit} />
      <RegionBH data={weatherData} onEdit={handleEdit} />
      <RegionKS data={weatherData} onEdit={handleEdit} />
      <RegionAZ data={weatherData} onEdit={handleEdit} />
      {editingData && (
        <div className="modal">
          <h2>Edit Weather Data</h2>
          <form>
            <div>
              <label>Temperature (NN)</label>
              <input
                name="temperature_nn"
                value={editingData.temperature_nn}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Pressure (NN)</label>
              <input
                name="pressure_nn"
                value={editingData.pressure_nn}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Humidity (NN)</label>
              <input
                name="humidity_nn"
                value={editingData.humidity_nn}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Temperature (BH)</label>
              <input
                name="temperature_bh"
                value={editingData.temperature_bh}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Pressure (BH)</label>
              <input
                name="pressure_bh"
                value={editingData.pressure_bh}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Humidity (BH)</label>
              <input
                name="humidity_bh"
                value={editingData.humidity_bh}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Temperature (KS)</label>
              <input
                name="temperature_ks"
                value={editingData.temperature_ks}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Pressure (KS)</label>
              <input
                name="pressure_ks"
                value={editingData.pressure_ks}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Humidity (KS)</label>
              <input
                name="humidity_ks"
                value={editingData.humidity_ks}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Temperature (AZ)</label>
              <input
                name="temperature_az"
                value={editingData.temperature_az}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Pressure (AZ)</label>
              <input
                name="pressure_az"
                value={editingData.pressure_az}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Humidity (AZ)</label>
              <input
                name="humidity_az"
                value={editingData.humidity_az}
                onChange={handleChange}
              />
            </div>
          </form>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditingData(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
