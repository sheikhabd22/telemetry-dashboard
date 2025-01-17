from flask import Flask
from flask_socketio import SocketIO, emit
import serial
import threading

app = Flask(__name__)
socketio = SocketIO(app)

# Setup serial connection to Arduino (use correct port for your system)
ser = serial.Serial('COM3', 9600)  # Replace with your Arduino's port

# Function to read data from Arduino and emit it to the frontend
def read_from_arduino():
    while True:
        if ser.in_waiting > 0:
            sensor_value = ser.readline().decode('utf-8').strip()
            socketio.emit('sensor_data', {'sensor_data': sensor_value})

# Route to start reading from Arduino
@app.route('/')
def index():
    return 'Flask-SocketIO Arduino Data Stream'

# Run the background thread that reads from Arduino and emits the data
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    thread = threading.Thread(target=read_from_arduino)
    thread.daemon = True
    thread.start()

if __name__ == '__main__':
    socketio.run(app, debug=True)
