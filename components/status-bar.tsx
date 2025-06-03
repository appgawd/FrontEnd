"use client"

import { motion } from "framer-motion"
import { Thermometer, Lock, Wifi, Clock, Server, Car, Plane, Battery } from "lucide-react"

export function StatusBar() {
  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <motion.div
      className="h-6 bg-background border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Thermometer className="h-3 w-3 mr-1" />
          <span>72.5°F</span>
        </div>
        <div className="flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          <span>Locked</span>
        </div>
        <div className="flex items-center">
          <Wifi className="h-3 w-3 mr-1" />
          <span>Connected</span>
        </div>
        <div className="flex items-center">
          <Server className="h-3 w-3 mr-1" />
          <span>3 Servers</span>
        </div>
        <div className="flex items-center">
          <Car className="h-3 w-3 mr-1" />
          <span>3 Vehicles</span>
        </div>
        <div className="flex items-center">
          <Plane className="h-3 w-3 mr-1" />
          <span>20 UAVs</span>
        </div>
        <div className="flex items-center">
          <Battery className="h-3 w-3 mr-1" />
          <span>Fleet OK</span>
        </div>
      </div>

      <div className="flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        <span>{currentTime}</span>
      </div>
    </motion.div>
  )
}
