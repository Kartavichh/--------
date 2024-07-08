#!/bin/bash

cd weather-dashboard/docker
chmod +x database-run.sh
./database-run.sh

cd ../weather-backend
chmod +x backend-run.sh
./backend-run.sh