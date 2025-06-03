"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { checkBackendHealth } from "@/lib/api"
import { Wifi, WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true)
      const connected = await checkBackendHealth()
      setIsConnected(connected)
      setIsChecking(false)
    }

    checkConnection()

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isChecking) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Wifi className="h-3 w-3" />
        Checking...
      </Badge>
    )
  }

  return (
    <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          Connected
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Demo Mode
        </>
      )}
    </Badge>
  )
}
