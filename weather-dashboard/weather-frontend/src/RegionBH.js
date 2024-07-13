import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Region.css'; // Подключение CSS файла

const RegionBH = ({ data, onEdit }) => {
  const [regionData, setRegionData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (showAll) {
      axios.get('http://localhost:5000/api/weather/bh/all')
        .then(response => {
          setRegionData(response.data);
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
        });
    } else {
      setRegionData(data);
    }
  }, [showAll, data]);

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleHideAll = () => {
    setShowAll(false);
  };

  return (
    <div className="region-container">
      <h2>Region BH</h2>
      <table className="region-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Temperature</th>
            <th>Pressure</th>
            <th>Humidity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {regionData.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.timestamp}</td>
              <td>{item.temperature_bh}</td>
              <td>{item.pressure_bh}</td>
              <td>{item.humidity_bh}</td>
              <td><button onClick={() => onEdit(item)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {!showAll ? (
        <button onClick={handleShowAll}>Show All</button>
      ) : (
        <button onClick={handleHideAll}>Hide</button>
      )}
    </div>
  );
};

export default RegionBH;
