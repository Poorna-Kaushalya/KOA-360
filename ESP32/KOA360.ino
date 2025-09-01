#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <MPU6050_light.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
String serverUrl = "http://192.168.8.102:5000/api/sensor-data";

MPU6050 mpu(Wire);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  Wire.begin();
  byte status = mpu.begin();
  while(status != 0) { delay(10); }
  mpu.calcOffsets();
  Serial.println("MPU6050 ready!");
}

void loop() {
  mpu.update();

  float ax = mpu.getAccX();
  float ay = mpu.getAccY();
  float az = mpu.getAccZ();

  Serial.printf("AccX: %.2f | AccY: %.2f | AccZ: %.2f\n", ax, ay, az);

  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String json = "{";
    json += "\"device_id\":\"KOA360-001\",";
    json += "\"ax\":" + String(ax) + ",";
    json += "\"ay\":" + String(ay) + ",";
    json += "\"az\":" + String(az);
    json += "}";

    int code = http.POST(json);
    Serial.println("Response: " + String(code));
    http.end();
  }

  delay(2000);
}
