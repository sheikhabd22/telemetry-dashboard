"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Rocket, Gauge, Wind, Thermometer, Compass, Timer, Radio } from "lucide-react"
import Image from "next/image"

export function RocketTelemetry() {
  const [data, setData] = useState<any[]>([])
  const [packets, setPackets] = useState<string[]>([])
  const [flightTime, setFlightTime] = useState(0)
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws/telemetry')
    
    ws.onmessage = (event) => {
      const newDataPoint = JSON.parse(event.data)
      setData(prevData => {
        const newData = [...prevData, newDataPoint]
        // Keep only last 100 data points
        return newData.length > 100 ? newData.slice(-100) : newData
      })
      setPackets(prevPackets => [
        JSON.stringify(newDataPoint),
        ...prevPackets.slice(0, 9)
      ])
      setFlightTime(newDataPoint.time)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    setSocket(ws)

    // Cleanup on unmount
    return () => {
      ws.close()
    }
  }, [])

  const latestData = data.length > 0 ? data[data.length - 1] : null;
  const maxAltitude = data.length > 0 
    ? Math.max(...data.map(d => Number(d.altitude) || 0))
    : 0;
  const maxVelocity = data.length > 0 
    ? Math.max(...data.map(d => Number(d.velocity) || 0))
    : 0;
  const currentAltitude = latestData ? Number(latestData.altitude) : 0;
  const currentVelocity = latestData ? Number(latestData.velocity) : 0;

  const getFlightStage = (altitude: number, velocity: number) => {
    if (altitude < 10 && velocity < 10) return "Pre-launch"
    if (velocity > 0 && altitude < maxAltitude) return "Ascent"
    if (velocity < 0) return "Descent"
    return "Apogee"
  }

  const flightStage = getFlightStage(currentAltitude, currentVelocity)

  const getRecoveryStatus = (altitude: number, velocity: number) => {
    if (altitude > 100) return "Armed"
    if (altitude <= 100 && velocity < 0) return "Deployed"
    return "Safed"
  }

  const recoveryStatus = getRecoveryStatus(currentAltitude, currentVelocity)

  const getSignalStrength = () => {
    // Simulated signal strength based on current altitude
    const strength = Math.max(1, Math.min(4, Math.floor(currentAltitude / 250)))
    return Array.from({ length: 4 }, (_, i) => i < strength)
  }

  const signalStrength = getSignalStrength()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-800 p-2 rounded-md shadow-md">
          <p className="text-gray-300">Time: {label}</p>
          {payload.map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.color }}>
              {pld.dataKey}: {pld.value.toFixed(2)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black">Loading telemetry data...</h1>
            <p className="text-gray-600">Connecting to rocket systems...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/astra-logo.png"
            alt="ASTRA Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-black">ASTRA Mission Control</h1>
            <p className="text-gray-600">Real-time flight data monitoring</p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1 border-green-500">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
          <span className="text-green-500">Live Data</span>
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Rocket className="h-5 w-5 text-blue-400" />
              Altitude Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="altitude" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Gauge className="h-5 w-5 text-green-400" />
              Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="velocity" stroke="#16a34a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Thermometer className="h-5 w-5 text-red-400" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="temperature" stroke="#dc2626" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Compass className="h-5 w-5 text-yellow-400" />
              Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="pressure" stroke="#9333ea" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Wind className="h-5 w-5 text-cyan-400" />
              Flight Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Max Altitude</span>
                <span className="font-mono">{maxAltitude.toFixed(2)} m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Max Velocity</span>
                <span className="font-mono">{maxVelocity.toFixed(2)} m/s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Altitude</span>
                <span className="font-mono">{currentAltitude.toFixed(2)} m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Velocity</span>
                <span className="font-mono">{currentVelocity.toFixed(2)} m/s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Flight Time</span>
                <span className="font-mono">
                  {Math.floor(flightTime / 60).toString().padStart(2, '0')}:
                  {(flightTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Timer className="h-5 w-5 text-pink-400" />
              Mission Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stage</span>
                <Badge>{flightStage}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Recovery System</span>
                <Badge variant="secondary">{recoveryStatus}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Signal Strength</span>
                <div className="flex gap-1">
                  {signalStrength.map((active, i) => (
                    <div
                      key={i}
                      className={`h-4 w-1 rounded-full ${active ? "bg-primary" : "bg-muted"}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Radio className="h-5 w-5 text-purple-400" />
              Incoming Data Packets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {packets.map((packet, index) => (
                <div key={index} className="mb-2 rounded bg-muted p-2 font-mono text-sm">
                  {packet}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}