#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <MPU6050_light.h>
#include <math.h>

// WiFi credentials
const char* ssid = "Dialog 4G 287";
const char* password = "181969F7";

// Backend API
String serverUrl = "http://192.168.8.102:5000/api/sensor-data";

// MPU6050
MPU6050 mpuUpper(Wire);
MPU6050 mpuLower(Wire);

unsigned long timer = 0;

float calculateKneeAngle(float ax1, float ay1, float az1, float ax2, float ay2, float az2) {
  float mag1 = sqrt(ax1*ax1 + ay1*ay1 + az1*az1);
  float mag2 = sqrt(ax2*ax2 + ay2*ay2 + az2*az2);
  ax1 /= mag1; ay1 /= mag1; az1 /= mag1;
  ax2 /= mag2; ay2 /= mag2; az2 /= mag2;
  float dot = ax1*ax2 + ay1*ay2 + az1*az2;
  if(dot > 1) dot = 1;
  if(dot < -1) dot = -1;
  return acos(dot) * 180.0 / PI;
}

void connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected!");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  Wire.begin();
  
  connectWiFi();

  mpuUpper.begin();
  mpuLower.begin();
  Serial.println("✅ MPU6050 sensors initialized");
  
  // Calibrate sensors (optional)
  mpuUpper.calcOffsets(true, true);
  mpuLower.calcOffsets(true, true);
}

void loop() {
  mpuUpper.update();
  mpuLower.update();

  float ax1 = mpuUpper.getAccX();
  float ay1 = mpuUpper.getAccY();
  float az1 = mpuUpper.getAccZ();
  
  float ax2 = mpuLower.getAccX();
  float ay2 = mpuLower.getAccY();
  float az2 = mpuLower.getAccZ();

  float kneeAngle = calculateKneeAngle(ax1, ay1, az1, ax2, ay2, az2);

  // Prepare JSON
  String json = "{";
  json += "\"device_id\":\"KOA360-001\",";
  json += "\"upper\":{";
  json += "\"ax\":" + String(ax1, 2) + ",";
  json += "\"ay\":" + String(ay1, 2) + ",";
  json += "\"az\":" + String(az1, 2) + ",";
  json += "\"gx\":" + String(mpuUpper.getGyroX()) + ",";
  json += "\"gy\":" + String(mpuUpper.getGyroY()) + ",";
  json += "\"gz\":" + String(mpuUpper.getGyroZ());
  json += "},";
  json += "\"lower\":{";
  json += "\"ax\":" + String(ax2, 2) + ",";
  json += "\"ay\":" + String(ay2, 2) + ",";
  json += "\"az\":" + String(az2, 2) + ",";
  json += "\"gx\":" + String(mpuLower.getGyroX()) + ",";
  json += "\"gy\":" + String(mpuLower.getGyroY()) + ",";
  json += "\"gz\":" + String(mpuLower.getGyroZ());
  json += "},";
  json += "\"knee_angle\":" + String(kneeAngle, 2);
  json += "}";

  Serial.println(json);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    int code = http.POST(json);
    if (code > 0) Serial.println("✅ Sent");
    else Serial.println("❌ Failed");
    http.end();
  }

  delay(1000);
}
