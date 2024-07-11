import React from 'react';

const RegionNN = ({ data, onEdit }) => {
  return (
    <div>
      <h2>Region NN</h2>
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
          {data.map((item) => (
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
