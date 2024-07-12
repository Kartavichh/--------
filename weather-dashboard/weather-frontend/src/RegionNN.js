import React, { useState } from 'react';
import axios from 'axios';

const RegionNN = ({ data, onEdit }) => {
  const [allData, setAllData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const fetchAllData = () => {
    axios.get('http://localhost:5000/api/weather/nn/all')
      .then(response => {
        setAllData(response.data);
        setShowAll(true);
      })
      .catch(error => {
        console.error('Error fetching all data: ', error);
      });
  };

  return (
    <div>
      <h2>Region NN</h2>
      <button onClick={fetchAllData}>Show All</button>
      <table className="data-table">
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
          {(showAll ? allData : data.slice(0, 10)).map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.timestamp}</td>
              <td>{item.temperature_nn}</td>
              <td>{item.pressure_nn}</td>
              <td>{item.humidity_nn}</td>
              <td>
                <button onClick={() => onEdit(item)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegionNN;
