"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Activity,
  Battery,
  Thermometer,
  Fuel,
  Gauge,
  Satellite,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function MachineDetailView({ machine, onSensorClick, onAddSensor }) {
  const [selectedSensor, setSelectedSensor] = useState(null)

  const getSensorIcon = (type) => {
    switch (type.toLowerCase()) {
      case "battery":
        return Battery
      case "temperature":
        return Thermometer
      case "fuel":
        return Fuel
      case "height":
      case "altitude":
        return Gauge
      case "gps":
        return Satellite
      default:
        return Activity
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "normal":
        return CheckCircle
      case "warning":
        return AlertTriangle
      case "critical":
        return XCircle
      default:
        return CheckCircle
    }
  }

  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor)
    onSensorClick(sensor, machine)
  }

  const IconComponent = machine.icon

  return (
    <div className="h-full flex flex-col bg-background p-6">
      {/* Machine Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <IconComponent className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{machine.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{machine.category}</Badge>
              {machine.manufacturer && <Badge variant="secondary">{machine.manufacturer}</Badge>}
              {machine.fleetId && <Badge variant="default">Fleet Member</Badge>}
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <Separator />
      </motion.div>

      {/* Machine Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sensors</p>
                <p className="text-2xl font-bold">{machine.sensors?.length || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Sensors</p>
                <p className="text-2xl font-bold text-green-500">
                  {machine.sensors?.filter((s) => s.status === "normal").length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alerts</p>
                <p className="text-2xl font-bold text-red-500">
                  {machine.sensors?.filter((s) => s.status === "critical" || s.status === "warning").length || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sensors Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1"
      >
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sensors</CardTitle>
                <CardDescription>Monitor and manage all sensors for {machine.name}</CardDescription>
              </div>
              <Button onClick={() => onAddSensor(machine)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sensor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {machine.sensors && machine.sensors.length > 0 ? (
                <div className="space-y-3">
                  {machine.sensors.map((sensor) => {
                    const SensorIcon = getSensorIcon(sensor.type)
                    const StatusIcon = getStatusIcon(sensor.status)

                    return (
                      <motion.div
                        key={sensor.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                          selectedSensor?.id === sensor.id ? "ring-2 ring-primary border-primary" : "",
                        )}
                        onClick={() => handleSensorClick(sensor)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-lg">
                              <SensorIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-medium">{sensor.name}</h4>
                              <p className="text-sm text-muted-foreground capitalize">{sensor.type} sensor</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-mono text-lg">
                                {sensor.value} {sensor.unit}
                              </p>
                              <div className="flex items-center gap-1 justify-end">
                                <StatusIcon className={cn("h-3 w-3", getStatusColor(sensor.status))} />
                                <span className={cn("text-xs capitalize", getStatusColor(sensor.status))}>
                                  {sensor.status}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Sensors Found</h3>
                  <p className="text-muted-foreground mb-4">This machine doesn't have any sensors configured yet.</p>
                  <Button onClick={() => onAddSensor(machine)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Sensor
                  </Button>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
