# KOA360 – IoT Knee Monitoring

**KOA360** is a smart IoT device for real-time monitoring of knee osteoarthritis.  
It collects data from multiple sensors using an **ESP32**:  
- **MPU6050** – accelerometer and gyroscope  
- **MLX90614** – infrared temperature  
- **Piezo vibration sensor** – detects movement or pressure  
- **GY-87** – optional additional motion and orientation sensors  

The device sends data via **Wi-Fi** to a **Node.js backend**, stores it in **MongoDB**, and displays averaged values on a **React dashboard**.

## Features
- Real-time sensor data acquisition
- User authentication with JWT
- Automatic 5-minute average calculation
- Live web dashboard visualisation

## Project Structure
- `koa360-backend/` → Node.js server with user authentication and sensor data storage
- `koa360-frontend/` → React dashboard for live sensor data visualisation
- `ESP32_Code/` → Arduino code for ESP32 to read all sensors and send data
- `README.md` → Project overview and setup instructions

## Installation

### Backend
```bash
cd koa360-backend
npm install
node server.js
````

### Frontend

```bash
cd koa360-frontend
npm install
npm start
```

### ESP32

1. Open sensor code (`MPU6050_ESP32.ino`) in Arduino IDE
2. Set Wi-Fi SSID, password, and backend IP
3. Upload the code to the ESP32

## Technologies

* Node.js, Express, MongoDB
* React, Axios, Recharts
* ESP32, Arduino IDE, MPU6050, MLX90614, Piezo, GY-68/GY-87 sensors

