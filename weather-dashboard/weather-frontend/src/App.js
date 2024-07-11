import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import DataTable from './DataTable';
import RegionNN from './RegionNN';
import RegionBH from './RegionBH';
import RegionKS from './RegionKS';
import RegionAZ from './RegionAZ';
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/weather')
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

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
        console.error('Error saving data: ', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <ul className="nav-list">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/region-nn">Region NN</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/region-bh">Region BH</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/region-ks">Region KS</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/region-az">Region AZ</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<DataTable data={weatherData} onEdit={handleEdit} />} />
          <Route path="/region-nn" element={<RegionNN data={weatherData} onEdit={handleEdit} />} />
          <Route path="/region-bh" element={<RegionBH data={weatherData} onEdit={handleEdit} />} />
          <Route path="/region-ks" element={<RegionKS data={weatherData} onEdit={handleEdit} />} />
          <Route path="/region-az" element={<RegionAZ data={weatherData} onEdit={handleEdit} />} />
        </Routes>

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
    </Router>
  );
};

export default App;
