"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"

interface TimelineEvent {
  id: string
  name: string
  startTime: number
  duration: number
  color: string
  track: number
  value?: string
  unit?: string
}

interface SensorData {
  timestamp: number
  coolantTemp: number
  oilTemp: number
  intakeTemp: number
  fuelPressure: number
  fuelLevel: number
  fuelFlow: number
}

export function TimelineView() {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Generate mock sensor data for the last 30 seconds
  const [sensorData] = useState<SensorData[]>(() => {
    const data: SensorData[] = []
    const now = Date.now()

    for (let i = 0; i < 30; i++) {
      const timestamp = now - (29 - i) * 1000 // Last 30 seconds
      data.push({
        timestamp,
        coolantTemp: 85 + Math.sin(i * 0.2) * 3 + Math.random() * 2 - 1, // 82-90°C range
        oilTemp: 92 + Math.sin(i * 0.15) * 4 + Math.random() * 2 - 1, // 87-97°C range
        intakeTemp: 35 + Math.sin(i * 0.3) * 5 + Math.random() * 3 - 1.5, // 28-42°C range
        fuelPressure: 3.5 + Math.sin(i * 0.25) * 0.3 + Math.random() * 0.2 - 0.1, // 3.1-3.9 bar
        fuelLevel: 75 - i * 0.1 + Math.random() * 0.5 - 0.25, // Slowly decreasing
        fuelFlow: 12.5 + Math.sin(i * 0.4) * 2 + Math.random() * 1 - 0.5, // 10-15 L/h
      })
    }
    return data
  })

  const [events] = useState<TimelineEvent[]>(() => {
    const events: TimelineEvent[] = []

    // Generate events based on sensor data
    sensorData.forEach((data, index) => {
      const timeOffset = index

      // Temperature events
      if (data.coolantTemp > 88) {
        events.push({
          id: `coolant-high-${index}`,
          name: `Coolant High: ${data.coolantTemp.toFixed(1)}°C`,
          startTime: timeOffset,
          duration: 1,
          color: "oklch(0.4 0.2 20)",
          track: 0,
          value: data.coolantTemp.toFixed(1),
          unit: "°C",
        })
      }

      if (data.oilTemp > 95) {
        events.push({
          id: `oil-high-${index}`,
          name: `Oil Temp High: ${data.oilTemp.toFixed(1)}°C`,
          startTime: timeOffset,
          duration: 1,
          color: "oklch(0.4 0.2 20)",
          track: 1,
          value: data.oilTemp.toFixed(1),
          unit: "°C",
        })
      }

      // Fuel events
      if (data.fuelPressure < 3.2) {
        events.push({
          id: `fuel-pressure-low-${index}`,
          name: `Fuel Pressure Low: ${data.fuelPressure.toFixed(1)} bar`,
          startTime: timeOffset,
          duration: 1,
          color: "oklch(0.4 0.2 60)",
          track: 2,
          value: data.fuelPressure.toFixed(1),
          unit: "bar",
        })
      }

      if (data.fuelLevel < 25) {
        events.push({
          id: `fuel-level-low-${index}`,
          name: `Fuel Level Low: ${data.fuelLevel.toFixed(1)}%`,
          startTime: timeOffset,
          duration: 1,
          color: "oklch(0.4 0.2 60)",
          track: 3,
          value: data.fuelLevel.toFixed(1),
          unit: "%",
        })
      }

      // Normal operation events (every 5 seconds)
      if (index % 5 === 0) {
        events.push({
          id: `normal-operation-${index}`,
          name: "Normal Operation",
          startTime: timeOffset,
          duration: 1,
          color: "oklch(0.3 0.2 120)",
          track: 4,
        })
      }
    })

    return events
  })

  const totalDuration = 30 // 30 seconds
  const trackCount = 5

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false)
            return totalDuration
          }
          return prev + 0.1
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying, totalDuration])

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const resetPlayback = () => {
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const skipToEnd = () => {
    setCurrentTime(totalDuration)
    setIsPlaying(false)
  }

  const timeToPosition = (time: number) => {
    return (time / totalDuration) * 100
  }

  const getCurrentSensorData = () => {
    const index = Math.floor(currentTime)
    return sensorData[Math.min(index, sensorData.length - 1)]
  }

  const currentData = getCurrentSensorData()

  return (
    <div className="h-full flex flex-col bg-[#0c1015] p-4">
      {/* Current Sensor Values */}
      <div className="mb-4 grid grid-cols-6 gap-4 text-xs">
        <div className="bg-background/20 rounded p-2">
          <div className="text-muted-foreground">Coolant</div>
          <div className="text-white font-mono">{currentData?.coolantTemp.toFixed(1)}°C</div>
        </div>
        <div className="bg-background/20 rounded p-2">
          <div className="text-muted-foreground">Oil</div>
          <div className="text-white font-mono">{currentData?.oilTemp.toFixed(1)}°C</div>
        </div>
        <div className="bg-background/20 rounded p-2">
          <div className="text-muted-foreground">Intake</div>
          <div className="text-white font-mono">{currentData?.intakeTemp.toFixed(1)}°C</div>
        </div>
        <div className="bg-background/20 rounded p-2">
          <div className="text-muted-foreground">Fuel Press</div>
          <div className="text-white font-mono">{currentData?.fuelPressure.toFixed(1)} bar</div>
        </div>
        <div className="bg-background/20 rounded p-2">
          <div className="text-muted-foreground">Fuel Level</div>
          <div className="text-white font-mono">{currentData?.fuelLevel.toFixed(1)}%</div>
        </div>
        <div className="bg-background/20 rounded p-2">
          <div className="text-muted-foreground">Fuel Flow</div>
          <div className="text-white font-mono">{currentData?.fuelFlow.toFixed(1)} L/h</div>
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Time markers */}
        <div className="absolute top-0 left-0 right-0 h-6 flex">
          {Array.from({ length: 7 }).map((_, i) => {
            const timeValue = i * 5
            return (
              <div key={i} className="relative flex-1">
                <div className="absolute top-0 h-3 w-px bg-border"></div>
                <div className="absolute top-4 text-xs text-muted-foreground">-{30 - timeValue}s</div>
              </div>
            )
          })}
        </div>

        {/* Track Labels */}
        <div className="absolute left-0 top-8 w-32 space-y-2">
          {["Coolant Alerts", "Oil Alerts", "Fuel Press Alerts", "Fuel Level Alerts", "System Status"].map(
            (label, index) => (
              <div
                key={index}
                className="h-10 flex items-center text-xs text-muted-foreground bg-background/10 rounded px-2"
              >
                {label}
              </div>
            ),
          )}
        </div>

        {/* Timeline tracks */}
        <div className="mt-8 ml-36">
          {Array.from({ length: trackCount }).map((_, trackIndex) => (
            <div key={trackIndex} className="relative h-10 mb-2 bg-background/20 rounded">
              {events
                .filter((event) => event.track === trackIndex)
                .map((event) => (
                  <motion.div
                    key={event.id}
                    className="absolute h-full rounded flex items-center px-2 overflow-hidden text-white text-xs"
                    style={{
                      left: `${timeToPosition(event.startTime)}%`,
                      width: `${Math.max(timeToPosition(event.duration), 2)}%`,
                      backgroundColor: event.color,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: event.startTime * 0.01 }}
                    title={event.name}
                  >
                    <span className="truncate">{event.name}</span>
                  </motion.div>
                ))}
            </div>
          ))}
        </div>

        {/* Current time indicator */}
        <motion.div
          className="absolute top-8 bottom-0 w-px bg-red-500 z-10 ml-36"
          style={{ left: `${timeToPosition(currentTime)}%` }}
          animate={{ left: `${timeToPosition(currentTime)}%` }}
          transition={{ duration: 0.1 }}
        >
          <div className="w-3 h-3 rounded-full bg-red-500 -translate-x-1/2"></div>
        </motion.div>
      </div>

      <div className="h-16 flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={resetPlayback}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={togglePlayback}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={skipToEnd}>
          <SkipForward className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <Slider
            value={[currentTime]}
            min={0}
            max={totalDuration}
            step={0.1}
            onValueChange={(value) => setCurrentTime(value[0])}
          />
        </div>
        <div className="text-sm tabular-nums">
          -{(totalDuration - currentTime).toFixed(1)}s / -{totalDuration.toFixed(1)}s
        </div>
      </div>
    </div>
  )
}
