const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Данные для подключения к базе данных
const dbConfig = {
  user: 'sys',
  password: '123',
  connectString: 'localhost:1521/XEPDB1',
  privilege: oracledb.SYSDBA
};

// GET запрос http://localhost:5000/api/weather?limit=10
app.get('/api/weather', async (req, res) => {
  let { limit } = req.query;
  limit = limit ? parseInt(limit, 10) : 10; // По умолчанию 10 записей
  
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
    res.status(500).send('Error fetching data');
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

// POST запрос http://localhost:5000/api/weather
app.post('/api/weather', async (req, res) => {
  const {
    temperature_nn, pressure_nn, humidity_nn,
    temperature_bh, pressure_bh, humidity_bh,
    temperature_ks, pressure_ks, humidity_ks,
    temperature_az, pressure_az, humidity_az
  } = req.body;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO weather_data (
        temperature_nn, pressure_nn, humidity_nn,
        temperature_bh, pressure_bh, humidity_bh,
        temperature_ks, pressure_ks, humidity_ks,
        temperature_az, pressure_az, humidity_az
      ) VALUES (
        :temperature_nn, :pressure_nn, :humidity_nn,
        :temperature_bh, :pressure_bh, :humidity_bh,
        :temperature_ks, :pressure_ks, :humidity_ks,
        :temperature_az, :pressure_az, :humidity_az
      ) RETURNING id INTO :id`,
      {
        temperature_nn: temperature_nn, pressure_nn: pressure_nn, humidity_nn: humidity_nn,
        temperature_bh: temperature_bh, pressure_bh: pressure_bh, humidity_bh: humidity_bh,
        temperature_ks: temperature_ks, pressure_ks: pressure_ks, humidity_ks: humidity_ks,
        temperature_az: temperature_az, pressure_az: pressure_az, humidity_az: humidity_az,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );
    res.status(201).send(`Data inserted with id: ${result.outBinds.id[0]}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data');
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

// PUT-запрос обновляет существующую запись по заданному id
app.put('/api/weather', async (req, res) => {
  const {
    temperature_nn, pressure_nn, humidity_nn,
    temperature_bh, pressure_bh, humidity_bh,
    temperature_ks, pressure_ks, humidity_ks,
    temperature_az, pressure_az, humidity_az
  } = req.body;
  let { id } = req.query;
  id = parseInt(id);

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE weather_data SET
        temperature_nn = :temperature_nn,
        pressure_nn = :pressure_nn,
        humidity_nn = :humidity_nn,
        temperature_bh = :temperature_bh,
        pressure_bh = :pressure_bh,
        humidity_bh = :humidity_bh,
        temperature_ks = :temperature_ks,
        pressure_ks = :pressure_ks,
        humidity_ks = :humidity_ks,
        temperature_az = :temperature_az,
        pressure_az = :pressure_az,
        humidity_az = :humidity_az
      WHERE id = :id`,
      {
        id: id,
        temperature_nn: temperature_nn, pressure_nn: pressure_nn, humidity_nn: humidity_nn,
        temperature_bh: temperature_bh, pressure_bh: pressure_bh, humidity_bh: humidity_bh,
        temperature_ks: temperature_ks, pressure_ks: pressure_ks, humidity_ks: humidity_ks,
        temperature_az: temperature_az, pressure_az: pressure_az, humidity_az: humidity_az
      },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send('Data not found');
    } else {
      res.status(200).send('Data updated');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating data');
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


// Добавление нового эндпоинта для очистки таблицы
app.delete('/api/weather', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`TRUNCATE TABLE weather_data`);
    res.status(200).send('Table truncated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error truncating table');
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

// HEAD запрос http://localhost:5000/api/weather
app.head('/api/weather', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT COUNT(*) AS count FROM weather_data`
    );
    const rowCount = result.rows[0][0];
    res.set('X-Total-Count', rowCount.toString());
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
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

// OPTIONS запрос http://localhost:5000/api/weather
app.options('/api/weather', cors());


// Обновление данных (добавление новой записи каждые 30 секунд)
setInterval(async () => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    // Генерация случайных данных для вставки
    const temperature_nn = (Math.random() * 40).toFixed(1);
    const pressure_nn = Math.floor(730 + Math.random() * 50);
    const humidity_nn = Math.floor(Math.random() * 100);
    const temperature_bh = (Math.random() * 40).toFixed(1);
    const pressure_bh = Math.floor(730 + Math.random() * 50);
    const humidity_bh = Math.floor(Math.random() * 100);
    const temperature_ks = (Math.random() * 40).toFixed(1);
    const pressure_ks = Math.floor(730 + Math.random() * 50);
    const humidity_ks = Math.floor(Math.random() * 100);
    const temperature_az = (Math.random() * 40).toFixed(1);
    const pressure_az = Math.floor(730 + Math.random() * 50);
    const humidity_az = Math.floor(Math.random() * 100);

    await connection.execute(
      `INSERT INTO weather_data (
        temperature_nn, pressure_nn, humidity_nn,
        temperature_bh, pressure_bh, humidity_bh,
        temperature_ks, pressure_ks, humidity_ks,
        temperature_az, pressure_az, humidity_az
      ) VALUES (
        :temperature_nn, :pressure_nn, :humidity_nn,
        :temperature_bh, :pressure_bh, :humidity_bh,
        :temperature_ks, :pressure_ks, :humidity_ks,
        :temperature_az, :pressure_az, :humidity_az
      )`,
      {
        temperature_nn: temperature_nn, pressure_nn: pressure_nn, humidity_nn: humidity_nn,
        temperature_bh: temperature_bh, pressure_bh: pressure_bh, humidity_bh: humidity_bh,
        temperature_ks: temperature_ks, pressure_ks: pressure_ks, humidity_ks: humidity_ks,
        temperature_az: temperature_az, pressure_az: pressure_az, humidity_az: humidity_az
      },
      { autoCommit: true }
    );
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}, 30000); // 30 секунд

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
