import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import DataTable from './DataTable';
import RegionNN from './RegionNN';
import RegionBH from './RegionBH';
import RegionKS from './RegionKS';
import RegionAZ from './RegionAZ';

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
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/region-nn">Region NN</Link></li>
            <li><Link to="/region-bh">Region BH</Link></li>
            <li><Link to="/region-ks">Region KS</Link></li>
            <li><Link to="/region-az">Region AZ</Link></li>
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
                <label>Temperature</label>
                <input
                  name="temperature"
                  value={editingData.temperature}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Pressure</label>
                <input
                  name="pressure"
                  value={editingData.pressure}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Humidity</label>
                <input
                  name="humidity"
                  value={editingData.humidity}
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
