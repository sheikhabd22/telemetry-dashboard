#include <ArduinoJson.h>  // Install the ArduinoJson library

// Simulated telemetry data
float flight_time = 0.0;
float last_altitude = 0.0;
float last_velocity = 0.0;

void setup() {
  Serial.begin(9600);  // Initialize the serial connection with XBee
  delay(2000);         // Allow time for the XBee to initialize
}

void loop() {
  // Generate telemetry data
  flight_time += 1;                                // Increment flight time
  last_velocity += random(10, 20) / 10.0;          // Random velocity increment
  last_altitude += last_velocity * 0.1;            // Calculate altitude
  last_velocity -= 9.81 * 0.1;                     // Apply gravity effect
  if (last_altitude < 0) {                         // Prevent negative altitude
    last_altitude = 0;
    last_velocity = 0;
  }

  // Create a JSON object
  StaticJsonDocument<256> doc;
  doc["time"] = flight_time;                       // Flight time in seconds
  doc["altitude"] = last_altitude;                 // Altitude in meters
  doc["velocity"] = last_velocity;                 // Velocity in m/s
  doc["temperature"] = random(20, 50);             // Simulated temperature
  doc["pressure"] = 1013.25 * exp(-last_altitude / 7400);  // Simulated pressure
  doc["timestamp"] = millis();                     // Timestamp in milliseconds

  // Serialize the JSON object to a string
  String jsonString;
  serializeJson(doc, jsonString);

  // Send the telemetry data via XBee
  Serial.println(jsonString);

  // Wait before sending the next telemetry packet
  delay(1000);  // Send data every second
}
