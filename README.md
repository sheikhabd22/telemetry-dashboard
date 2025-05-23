# ASTRA Mission Control Dashboard 🚀 
A real-time rocket telemetry visualization dashboard that simulates and displays live rocket flight data. Built with Next.js for the frontend and FastAPI for the backend, featuring WebSocket communication for real-time data streaming.
 
 ![ASTRA Mission Control Dashboard](dashboard-preview.png) 
 ## Features 🌟 
 ### Real-time Monitoring 
 - Live altitude tracking with dynamic graph visualization 
 - Real-time velocity measurements 
 - Temperature monitoring 
 - Atmospheric pressure readings 
 - Flight stage indicators 
 - Recovery system status 
 - Signal strength visualization 
 - Live data packet logging 
 ### Technical Features 
 - WebSocket-based real-time data streaming 
 - Responsive design with dark theme 
 - Interactive data visualizations 
 - Simulated rocket flight physics 
 - Automatic data cleanup for optimal performance 
 ## Tech Stack 💻 
 ### Frontend 
 - **Next.js** - React framework for the web application 
 - **TypeScript** - For type-safe code 
 - **Recharts** - For data visualization 
 - **Tailwind CSS** - For styling 
 - **Lucide React** - For icons 
 - **WebSocket** - For real-time communication 
 ### Backend 
 - **FastAPI** - Modern Python web framework 
 - **WebSocket** - For bi-directional communication 
 -**Python** - For backend logic and simulation 
  - **CORS Middleware** - For secure cross-origin requests 
  ## Getting Started 🚀 
  ### Prerequisites 
  - Node.js (v16 or higher) 
  - Python (v3.8 or higher) 
  - npm or yarn 
  - pip (Python package manager) 
  ### Installation 
  1. Clone the repository: ```bash git clone https://github.com/yourusername/astra-mission-control.git cd astra-mission-control ``` 
  2. Set up the backend: ```bash cd backend pip install fastapi uvicorn ``` 
  3. Set up the frontend: ```bash cd my-app npm install # or yarn install ``` 
  ### Running the Application 
  1. Start the backend server: ```bash cd backend uvicorn back:app --reload uvicorn back:app --host 0.0.0.0 --port 8000 // for esp to send data ``` The backend will be available at `http://localhost:8000` 
  2. In a new terminal, start the frontend: ```bash cd my-app npm run dev # or yarn dev ``` The frontend will be available at `http://localhost:3000` 
  ## Project Structure 📁 
  ``` astra-mission-control/ ├── backend/ │ └── back.py # FastAPI backend with telemetry simulation └── my-app/ └── components/ └── rocket-telemetry.tsx # Main dashboard component ```
   ## Features Explanation 📊 
  ### Telemetry Generator The backend simulates rocket flight with realistic physics: 
  - Thrust phase simulation - Gravity effects 
  - Air resistance 
  - Ground collision detection ### Dashboard Components 
  - **Altitude Profile**: Main graph showing altitude over time 
  - **Velocity Graph**: Real-time velocity tracking 
  - **Temperature Monitor**: Temperature variations during flight 
  - **Pressure Readings**: Atmospheric pressure changes with altitude 
  - **Flight Statistics**: - Maximum altitude reached - Maximum velocity achieved - Current altitude and velocity 
  - Flight duration 
  - **Mission Status**: 
  - Flight stage indicator 
  - Recovery system status 
  - Signal strength visualization 
  - **Data Packets**: Live telemetry data stream 
  ## Development 🛠 
  ### Backend Development The backend uses FastAPI and implements: 
  - WebSocket endpoint for real-time data streaming 
  - CORS middleware for security 
  - Telemetry simulation with physics calculations 
  - Error handling and connection management 
  ### Frontend Development The frontend is built with Next.js and features: 
  - Real-time data processing 
  - Dynamic chart updates 
  - Responsive layout 
  - Dark theme design 
  - WebSocket connection management 
  ## Contributing 🤝 
  1. Fork the repository 
  2. Create your feature branch (`git checkout -b feature/AmazingFeature`) 
  3. Commit your changes (`git commit -m 'Add some AmazingFeature'`) 
  4. Push to the branch (`git push origin feature/AmazingFeature`) 
  5. Open a Pull Request 
## License 📝 
  This project is licensed under the MIT License 
  - see the [LICENSE](LICENSE) file for details.
   ## Acknowledgments 🙏 
   - Inspired by real mission control systems 
   - Built with modern web technologies 
   - Designed for educational purposes 
  ## Contact 📧 Project Link: [https://github.com/yourusername/astra-mission-control](https://github.com/yourusername/astra-mission-control) 
  # telemetry-dashboard
