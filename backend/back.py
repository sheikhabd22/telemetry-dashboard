from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random
import json
from datetime import datetime

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TelemetryGenerator:
    def __init__(self):
        self.flight_time = 0
        self.last_altitude = 0  # Start at ground level
        self.last_velocity = 0  # Start at rest
        self.thrust_phase = True  # Add thrust phase flag
        self.thrust_duration = 30  # Thrust for first 30 seconds
        
    def generate_data_point(self):
        # Simulate rocket thrust during initial phase
        if self.flight_time < self.thrust_duration:
            thrust_acceleration = 20  # m/s²
            self.last_velocity += thrust_acceleration * 0.1
        
        # Add some realistic variations
        self.last_altitude += self.last_velocity * 0.1
        
        # Simulate gravity and air resistance
        self.last_velocity -= 9.81 * 0.1  # Gravity effect
        self.last_velocity *= 0.99  # Air resistance
        
        # Prevent unrealistic ground penetration
        if self.last_altitude <= 0:
            self.last_altitude = 0
            self.last_velocity = 0
        
        self.flight_time += 1
        
        return {
            "time": self.flight_time,
            "altitude": max(0, self.last_altitude),
            "velocity": self.last_velocity,
            "temperature": random.uniform(20, 50),
            "pressure": 1013.25 * pow(2.718, (-self.last_altitude / 7400)),
            "timestamp": datetime.now().isoformat()
        }

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    telemetry = TelemetryGenerator()
    
    try:
        while True:
            data = telemetry.generate_data_point()
            await websocket.send_json(data)
            await asyncio.sleep(1)  # Send data every second
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.get("/")
def read_root():
    return {"status": "Rocket Telemetry Backend Running"}
