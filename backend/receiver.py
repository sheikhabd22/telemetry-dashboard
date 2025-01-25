import serial
import json
from datetime import datetime

# Configure the serial port
SERIAL_PORT = "COM3"  # Replace with your XBee's port
BAUD_RATE = 9600      # Match the XBee baud rate

# Global variable to store the latest telemetry data
telemetry_data = {}

def start_xbee_listener():
    """
    Listens to the XBee serial port for incoming telemetry data.
    Updates the global `telemetry_data` dictionary with parsed JSON.
    """
    global telemetry_data
    try:
        # Open serial connection to XBee
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print(f"Listening on {SERIAL_PORT} at {BAUD_RATE} baud...")
        
        while True:
            # Read a line of data from XBee
            raw_data = ser.readline().decode('utf-8').strip()
            try:
                # Parse the data as JSON
                telemetry_data = json.loads(raw_data)
                telemetry_data["server_timestamp"] = datetime.now().isoformat()
            except json.JSONDecodeError:
                # Ignore invalid JSON data
                continue
    except Exception as e:
        print(f"Error reading XBee data: {e}")

def get_telemetry_data():
    """
    Returns the latest telemetry data.
    """
    return telemetry_data
