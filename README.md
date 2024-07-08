# Weather dashbpoard

## Setup and Run

Follow these steps to set up and run:

### 1. Clone the repository:
### `git clone https://github.com/Kartavichh/Site_weather.git`
### `cd Site_weather`

### 2. Start the Oracle database using Docker Compose:
### `cd weather-dashboard/docker`
### `sudo docker-compose up -d --remove-orphans`

### 3. Access the Oracle database container:
### `sudo docker exec -it oracle-db bash`

### 4. Connect to the Oracle database using sqlplus:
### `sqlplus sys/123@//localhost:1521/XEPDB1 as sysdba`

### 5. Create the weather_data table and insert initial data:
### `CREATE TABLE weather_data (id NUMBER PRIMARY KEY, city VARCHAR2(100), temperature NUMBER, pressure NUMBER, humidity NUMBER, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
### `INSERT INTO weather_data (id, city, temperature, pressure, humidity) VALUES (1, 'City A', 20, 1012, 50);`
### `INSERT INTO weather_data (id, city, temperature, pressure, humidity) VALUES (2, 'City B', 25, 1015, 60);`

### 6. Navigate to the weather-backend directory:
### `cd ../weather-backend`

### 7. Start the Node.js server:
### `node server.js`

### 8. Navigate to the weather-frontend directory:
### `cd ../weather-frontend`

### 9. Start the React application:
### `npm start`


Open [http://localhost:3000](http://localhost:3000) to view it in your browser.



