import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegionNN = ({ data, onEdit }) => {
  const [regionData, setRegionData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (showAll) {
      axios.get('http://localhost:5000/api/weather/nn/all')
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
    <div>
      <h2>Region NN</h2>
      <table>
        <thead>
          <tr>
            <th>Temperature</th>
            <th>Pressure</th>
            <th>Humidity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {regionData.map(item => (
            <tr key={item.id}>
              <td>{item.temperature_nn}</td>
              <td>{item.pressure_nn}</td>
              <td>{item.humidity_nn}</td>
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

export default RegionNN;
