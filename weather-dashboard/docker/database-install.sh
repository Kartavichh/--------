#!/bin/bash

# Step 1: Start Docker containers using docker-compose
sudo docker-compose up -d --remove-orphans

# Step 2: Execute a bash shell in the oracle-db container
sudo docker exec -it oracle-db bash << 'EOF'
# Step 3: Connect to the Oracle database using sqlplus
sqlplus sys/123@//localhost:1521/XEPDB1 as sysdba << 'SQL'
    -- Step 4: Create the weather_data table
    CREATE TABLE weather_data (
        id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        temperature_nn NUMBER,
        pressure_nn NUMBER,
        humidity_nn NUMBER,
        temperature_bh NUMBER,
        pressure_bh NUMBER,
        humidity_bh NUMBER,
        temperature_ks NUMBER,
        pressure_ks NUMBER,
        humidity_ks NUMBER,
        temperature_az NUMBER,
        pressure_az NUMBER,
        humidity_az NUMBER
    );

    -- Step 5: Insert data into the weather_data table
    INSERT INTO weather_data (
        temperature_nn, pressure_nn, humidity_nn,
        temperature_bh, pressure_bh, humidity_bh,
        temperature_ks, pressure_ks, humidity_ks,
        temperature_az, pressure_az, humidity_az
    ) VALUES (
        22.5, 1013, 60,
        25.0, 1012, 55,
        20.0, 1015, 65,
        30.0, 1010, 50
    );

    -- Step 6: Exit sqlplus
    EXIT;
SQL

# Step 7: Exit the oracle-db container bash shell
exit
EOF
