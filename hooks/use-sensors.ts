"use client"

import { useState, useEffect } from "react"
import { sensorsApi } from "@/lib/api"

export function useSensors(machineId?: string) {
  const [sensors, setSensors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        setLoading(true)
        let data
        if (machineId) {
          data = await sensorsApi.getByMachineId(machineId)
        } else {
          data = await sensorsApi.getAll()
        }
        setSensors(data)
        setIsDemo(false)
      } catch (err) {
        if (err.message === "BACKEND_UNAVAILABLE") {
          // Use empty array for demo mode
          setSensors([])
          setIsDemo(true)
          setError(null)
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSensors()
  }, [machineId])

  const createSensor = async (sensor) => {
    if (isDemo) {
      alert("Demo Mode: Sensor creation is not available without backend")
      return
    }

    try {
      const newSensor = await sensorsApi.create(sensor)
      setSensors((prev) => [...prev, newSensor])
      return newSensor
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    sensors,
    loading,
    error,
    isDemo,
    createSensor,
  }
}
