from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from datetime import datetime
from typing import List, Dict, Any
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store the latest telemetry data
latest_telemetry: Dict[str, Any] = {}

# WebSocket connections
active_connections: List[WebSocket] = []

class Vec3(BaseModel):
    x: float
    y: float
    z: float

class TelemetryData(BaseModel):
    altitude: float
    pressure: float
    temp_baro: float
    accel: Vec3
    gyro: Vec3
    mag: Vec3
    temp_imu: float

@app.post("/telemetry")
async def receive_telemetry(data: TelemetryData):
    global latest_telemetry
    latest_telemetry = data.dict()
    latest_telemetry["timestamp"] = datetime.now().isoformat()
    latest_telemetry["time"] = datetime.now().timestamp()
    
    # Broadcast to all connected WebSocket clients
    for connection in active_connections:
        try:
            await connection.send_json(latest_telemetry)
        except:
            active_connections.remove(connection)
    
    return {"status": "success"}

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        while True:
            await websocket.send_json(latest_telemetry)
            await asyncio.sleep(1)  # Send data every second
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)
        await websocket.close()

@app.get("/")
def read_root():
    return {"status": "Rocket Telemetry Backend Running"}
