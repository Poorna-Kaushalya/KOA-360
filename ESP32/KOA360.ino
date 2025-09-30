#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <MPU6050_light.h>

// WiFi credentials
const char* ssid = "Dialog 4G 287";
const char* password = "181969F7";

// Backend API endpoint
String serverUrl = "http://192.168.8.102:5000/api/sensor-data";

// MPU6050 object
MPU6050 mpu(Wire);

// WiFi reconnect function
void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ WiFi failed. Restarting...");
    ESP.restart();
  }
}

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  connectWiFi();

  // Initialize MPU6050
  Wire.begin();
  byte status = mpu.begin();
  if (status != 0) {
    Serial.println("❌ MPU6050 not found, check wiring!");
    while (1) { delay(1000); }
  }
  Serial.println("✅ MPU6050 connected!");
  mpu.calcOffsets();  // Calibrate
  Serial.println("✅ Offsets calculated!");
}

void loop() {
  mpu.update();

  // Get accelerometer, gyroscope, and temperature data
  float ax = mpu.getAccX();
  float ay = mpu.getAccY();
  float az = mpu.getAccZ();

  float gx = mpu.getGyroX();
  float gy = mpu.getGyroY();
  float gz = mpu.getGyroZ();

  float temp = mpu.getTemp();

  // Print to Serial Monitor
  Serial.printf("Acc: X=%.2f Y=%.2f Z=%.2f | Gyro: X=%.2f Y=%.2f Z=%.2f | Temp: %.2f °C\n",
                ax, ay, az, gx, gy, gz, temp);

  // Send data to backend
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Build JSON payload
    String json = "{";
    json += "\"device_id\":\"KOA360-001\",";
    json += "\"ax\":" + String(ax, 2) + ",";
    json += "\"ay\":" + String(ay, 2) + ",";
    json += "\"az\":" + String(az, 2) + ",";
    json += "\"gx\":" + String(gx, 2) + ",";
    json += "\"gy\":" + String(gy, 2) + ",";
    json += "\"gz\":" + String(gz, 2) + ",";
    json += "\"temp\":" + String(temp, 2);
    json += "}";

    int code = http.POST(json);

    if (code > 0) {
      Serial.println("✅ Data sent. Response code: " + String(code));
    } else {
      Serial.println("❌ Failed to send. Error: " + http.errorToString(code));
    }

    http.end();
  } else {
    Serial.println("⚠️ WiFi disconnected. Reconnecting...");
    connectWiFi();
  }

  delay(1000); // send every 2 seconds
}
