"use client"

import { useState, useEffect } from "react"
import { alertsApi } from "@/lib/api"
import { mockAlerts } from "@/lib/mock-data"

export function useAlerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        const data = await alertsApi.getAll()
        setAlerts(data)
        setIsDemo(false)
      } catch (err) {
        if (err.message === "BACKEND_UNAVAILABLE") {
          // Use mock data when backend is not available
          setAlerts(mockAlerts)
          setIsDemo(true)
          setError(null)
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  const createAlert = async (alert) => {
    if (isDemo) {
      alert("Demo Mode: Alert creation is not available without backend")
      return
    }

    try {
      const newAlert = await alertsApi.create(alert)
      setAlerts((prev) => [...prev, newAlert])
      return newAlert
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteAlert = async (id) => {
    if (isDemo) {
      alert("Demo Mode: Alert deletion is not available without backend")
      return
    }

    try {
      await alertsApi.delete(id)
      setAlerts((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const toggleAlert = async (id) => {
    if (isDemo) {
      alert("Demo Mode: Alert toggle is not available without backend")
      return
    }

    try {
      await alertsApi.toggle(id)
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    alerts,
    loading,
    error,
    isDemo,
    createAlert,
    deleteAlert,
    toggleAlert,
  }
}
