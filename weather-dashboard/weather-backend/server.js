const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
  user: 'sys',
  password: '123',
  connectString: 'localhost:1521/XEPDB1',
  privilege: oracledb.SYSDBA
};

// Общий GET запрос для ограниченных данных
app.get('/api/weather', async (req, res) => {
  let { limit } = req.query;
  limit = limit ? parseInt(limit, 10) : 10;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM (SELECT * FROM weather_data ORDER BY id DESC) WHERE ROWNUM <= :limit`,
      [limit]
    );
    const data = result.rows.map(row => ({
      id: row[0],
      timestamp: row[1],
      temperature_nn: row[2],
      pressure_nn: row[3],
      humidity_nn: row[4],
      temperature_bh: row[5],
      pressure_bh: row[6],
      humidity_bh: row[7],
      temperature_ks: row[8],
      pressure_ks: row[9],
      humidity_ks: row[10],
      temperature_az: row[11],
      pressure_az: row[12],
      humidity_az: row[13]
    }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при получении данных');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Маршруты для конкретных регионов
app.get('/api/weather/nn/all', async (req, res) => {
  await getAllDataForRegion(req, res, 'nn');
});

app.get('/api/weather/bh/all', async (req, res) => {
  await getAllDataForRegion(req, res, 'bh');
});

app.get('/api/weather/ks/all', async (req, res) => {
  await getAllDataForRegion(req, res, 'ks');
});

app.get('/api/weather/az/all', async (req, res) => {
  await getAllDataForRegion(req, res, 'az');
});

async function getAllDataForRegion(req, res, region) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM weather_data ORDER BY id DESC`
    );
    const data = result.rows.map(row => ({
      id: row[0],
      timestamp: row[1],
      temperature_nn: row[2],
      pressure_nn: row[3],
      humidity_nn: row[4],
      temperature_bh: row[5],
      pressure_bh: row[6],
      humidity_bh: row[7],
      temperature_ks: row[8],
      pressure_ks: row[9],
      humidity_ks: row[10],
      temperature_az: row[11],
      pressure_az: row[12],
      humidity_az: row[13]
    }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при получении данных');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

// Другие маршруты (POST, PUT, DELETE) остаются без изменений

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
