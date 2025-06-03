"use client"

import { useState, useEffect } from "react"
import { machinesApi } from "@/lib/api"
import { mockMachines, generateUAVFleet } from "@/lib/mock-data"

export function useMachines() {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true)
        const data = await machinesApi.getAll()
        setMachines(data)
        setIsDemo(false)
      } catch (err) {
        if (err.message === "BACKEND_UNAVAILABLE") {
          // Use mock data when backend is not available
          const uavFleet = generateUAVFleet()
          const allMachines = [...mockMachines, ...uavFleet.machines]
          setMachines(allMachines)
          setIsDemo(true)
          setError(null)
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMachines()
  }, [])

  const createMachine = async (machine) => {
    if (isDemo) {
      // Demo mode - show notification but don't actually create
      alert("Demo Mode: Machine creation is not available without backend")
      return
    }

    try {
      const newMachine = await machinesApi.create(machine)
      setMachines((prev) => [...prev, newMachine])
      return newMachine
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateMachine = async (id, machine) => {
    if (isDemo) {
      alert("Demo Mode: Machine updates are not available without backend")
      return
    }

    try {
      const updatedMachine = await machinesApi.update(id, machine)
      setMachines((prev) => prev.map((m) => (m.id === id ? updatedMachine : m)))
      return updatedMachine
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteMachine = async (id) => {
    if (isDemo) {
      alert("Demo Mode: Machine deletion is not available without backend")
      return
    }

    try {
      await machinesApi.delete(id)
      setMachines((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    machines,
    loading,
    error,
    isDemo,
    createMachine,
    updateMachine,
    deleteMachine,
  }
}
