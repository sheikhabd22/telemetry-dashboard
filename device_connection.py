import serial
import time

# Set up the serial connection (adjust the port and baud rate)
# Ensure you have the correct COM port for your system
# For example, on Windows, it might be "COM3"; on Linux, it might be "/dev/ttyUSB0"
arduino_port = 'COM3'  # Update this to the correct serial port for your Arduino
baud_rate = 9600       # Match the baud rate in Arduino sketch

# Open the serial port
arduino = serial.Serial(arduino_port, baud_rate, timeout=1)
time.sleep(2)  # Wait for the connection to establish

# File where we will store the sensor data
file_path = "sensor_data.txt"

# Function to store the data into a file
def store_data(data):
    with open(file_path, "a") as file:
        file.write(data + "\n")

# Function to read data from the Arduino and store it
def read_and_store_data():
    while True:
        if arduino.in_waiting > 0:
            # Read the data from Arduino
            data = arduino.readline().decode('utf-8').strip()
            
            # Store the data in the file
            store_data(data)
            print(f"Data saved: {data}")

# Start reading and storing data
try:
    read_and_store_data()
except KeyboardInterrupt:
    print("Program interrupted. Exiting...")
finally:
    arduino.close()