from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from receiver import start_xbee_listener, get_telemetry_data
import threading
import asyncio

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with the frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket endpoint for real-time telemetry
@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Fetch the latest telemetry data from receiver.py
            data = get_telemetry_data()
            if data:
                await websocket.send_json(data)
            await asyncio.sleep(1)  # Send data every second
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.get("/")
def read_root():
    """
    Root endpoint for the backend.
    """
    return {"status": "Telemetry system running"}

# Start the XBee listener in a separate thread on startup
@app.on_event("startup")
def startup_event():
    threading.Thread(target=start_xbee_listener, daemon=True).start()
