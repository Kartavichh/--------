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
  const [region, setRegion] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/weather')
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        setError(error);
      });
  }, []);

  const exportToExcel = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/weather/nn/all');
      const data = response.data;

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Region NN Data');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blobData = new Blob([excelBuffer], { type: 'application/octet-stream' });

      saveAs(blobData, 'Regions_Data.xlsx');
    } catch (error) {
      console.error('Error exporting data: ', error);
    }
  };

  const handleEdit = (data, region) => {
    setEditingData(data);
    setRegion(region);
  };

  const handleSave = () => {
    axios.put(`http://localhost:5000/api/weather?id=${editingData.id}`, editingData)
      .then(response => {
        setWeatherData(weatherData.map(item => item.id === editingData.id ? editingData : item));
        setEditingData(null);
        setRegion('');
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
      <button className="export-button" onClick={exportToExcel}>Export to Excel</button>
      <RegionNN data={weatherData} onEdit={(data) => handleEdit(data, 'NN')} />
      <RegionBH data={weatherData} onEdit={(data) => handleEdit(data, 'BH')} />
      <RegionKS data={weatherData} onEdit={(data) => handleEdit(data, 'KS')} />
      <RegionAZ data={weatherData} onEdit={(data) => handleEdit(data, 'AZ')} />
      {editingData && (
        <div className="modal">
          <h2>Edit Weather Data</h2>
          <form>
            {region === 'NN' && (
              <>
                <div>
                  <label>Temperature</label>
                  <input
                    name="temperature_nn"
                    value={editingData.temperature_nn}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Pressure</label>
                  <input
                    name="pressure_nn"
                    value={editingData.pressure_nn}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Humidity</label>
                  <input
                    name="humidity_nn"
                    value={editingData.humidity_nn}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            {region === 'BH' && (
              <>
                <div>
                  <label>Temperature</label>
                  <input
                    name="temperature_bh"
                    value={editingData.temperature_bh}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Pressure</label>
                  <input
                    name="pressure_bh"
                    value={editingData.pressure_bh}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Humidity</label>
                  <input
                    name="humidity_bh"
                    value={editingData.humidity_bh}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            {region === 'KS' && (
              <>
                <div>
                  <label>Temperature</label>
                  <input
                    name="temperature_ks"
                    value={editingData.temperature_ks}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Pressure</label>
                  <input
                    name="pressure_ks"
                    value={editingData.pressure_ks}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Humidity</label>
                  <input
                    name="humidity_ks"
                    value={editingData.humidity_ks}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            {region === 'AZ' && (
              <>
                <div>
                  <label>Temperature</label>
                  <input
                    name="temperature_az"
                    value={editingData.temperature_az}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Pressure</label>
                  <input
                    name="pressure_az"
                    value={editingData.pressure_az}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Humidity</label>
                  <input
                    name="humidity_az"
                    value={editingData.humidity_az}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </form>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => { setEditingData(null); setRegion(''); }}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
