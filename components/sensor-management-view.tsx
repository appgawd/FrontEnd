"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Activity,
  Battery,
  Thermometer,
  Fuel,
  Gauge,
  Satellite,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Machine {
  id: string
  name: string
  icon: any
  category: string
  manufacturer?: string
  sensors?: Sensor[]
  fleetId?: string
}

interface Sensor {
  id: string
  name: string
  type: string
  value: string
  unit: string
  status: "normal" | "warning" | "critical"
}

interface SensorManagementViewProps {
  machine: Machine
  selectedSensor?: Sensor | null
  onBack: () => void
  onSensorUpdate: (sensor: Sensor) => void
  onSensorDelete: (sensorId: string) => void
  onSensorAdd: (sensor: Omit<Sensor, "id">) => void
}

export function SensorManagementView({
  machine,
  selectedSensor,
  onBack,
  onSensorUpdate,
  onSensorDelete,
  onSensorAdd,
}: SensorManagementViewProps) {
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(selectedSensor || null)
  const [isAddingNew, setIsAddingNew] = useState(!selectedSensor)
  const [newSensor, setNewSensor] = useState({
    name: "",
    type: "temperature",
    value: "0",
    unit: "°C",
    status: "normal" as const,
  })

  const sensorTypes = [
    { value: "temperature", label: "Temperature", unit: "°C", icon: Thermometer },
    { value: "battery", label: "Battery", unit: "%", icon: Battery },
    { value: "fuel", label: "Fuel", unit: "%", icon: Fuel },
    { value: "pressure", label: "Pressure", unit: "bar", icon: Gauge },
    { value: "height", label: "Height/Altitude", unit: "m", icon: Gauge },
    { value: "gps", label: "GPS Signal", unit: "satellites", icon: Satellite },
    { value: "speed", label: "Speed", unit: "km/h", icon: Activity },
    { value: "voltage", label: "Voltage", unit: "V", icon: Activity },
    { value: "current", label: "Current", unit: "A", icon: Activity },
    { value: "flow", label: "Flow Rate", unit: "L/h", icon: Activity },
  ]

  const statusOptions = [
    { value: "normal", label: "Normal", color: "text-green-500", icon: CheckCircle },
    { value: "warning", label: "Warning", color: "text-yellow-500", icon: AlertTriangle },
    { value: "critical", label: "Critical", color: "text-red-500", icon: XCircle },
  ]

  const handleSensorTypeChange = (type: string) => {
    const sensorType = sensorTypes.find((t) => t.value === type)
    if (sensorType) {
      if (isAddingNew) {
        setNewSensor((prev) => ({ ...prev, type, unit: sensorType.unit }))
      } else if (editingSensor) {
        setEditingSensor((prev) => (prev ? { ...prev, type, unit: sensorType.unit } : null))
      }
    }
  }

  const handleSave = () => {
    if (isAddingNew) {
      if (newSensor.name && newSensor.value) {
        onSensorAdd(newSensor)
        setNewSensor({
          name: "",
          type: "temperature",
          value: "0",
          unit: "°C",
          status: "normal",
        })
        setIsAddingNew(false)
      }
    } else if (editingSensor) {
      onSensorUpdate(editingSensor)
      setEditingSensor(null)
    }
  }

  const handleDelete = () => {
    if (editingSensor) {
      onSensorDelete(editingSensor.id)
      setEditingSensor(null)
    }
  }

  const handleAddNew = () => {
    setIsAddingNew(true)
    setEditingSensor(null)
  }

  const handleEditExisting = (sensor: Sensor) => {
    setEditingSensor(sensor)
    setIsAddingNew(false)
  }

  const IconComponent = machine.icon

  return (
    <div className="h-full flex flex-col bg-background p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="p-2 bg-primary/10 rounded-lg">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Sensor Management</h1>
            <p className="text-muted-foreground">{machine.name}</p>
          </div>
        </div>
        <Separator />
      </motion.div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensor List */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Existing Sensors</CardTitle>
                  <CardDescription>{machine.sensors?.length || 0} sensors configured</CardDescription>
                </div>
                <Button onClick={handleAddNew} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {machine.sensors && machine.sensors.length > 0 ? (
                  <div className="space-y-2">
                    {machine.sensors.map((sensor) => {
                      const sensorType = sensorTypes.find((t) => t.value === sensor.type)
                      const SensorIcon = sensorType?.icon || Activity
                      const statusOption = statusOptions.find((s) => s.value === sensor.status)
                      const StatusIcon = statusOption?.icon || CheckCircle

                      return (
                        <div
                          key={sensor.id}
                          className={cn(
                            "p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm",
                            editingSensor?.id === sensor.id ? "ring-2 ring-primary border-primary" : "",
                          )}
                          onClick={() => handleEditExisting(sensor)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <SensorIcon className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">{sensor.name}</p>
                                <p className="text-xs text-muted-foreground">{sensorType?.label}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">
                                {sensor.value} {sensor.unit}
                              </span>
                              <StatusIcon className={cn("h-3 w-3", statusOption?.color)} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No Sensors</h3>
                    <p className="text-sm text-muted-foreground mb-4">Add your first sensor to get started</p>
                    <Button onClick={handleAddNew} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Sensor
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sensor Editor */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{isAddingNew ? "Add New Sensor" : "Edit Sensor"}</CardTitle>
              <CardDescription>
                {isAddingNew ? "Configure a new sensor for this machine" : "Modify sensor settings"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAddingNew || editingSensor ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sensor-name">Sensor Name</Label>
                    <Input
                      id="sensor-name"
                      placeholder="Enter sensor name"
                      value={isAddingNew ? newSensor.name : editingSensor?.name || ""}
                      onChange={(e) => {
                        if (isAddingNew) {
                          setNewSensor((prev) => ({ ...prev, name: e.target.value }))
                        } else if (editingSensor) {
                          setEditingSensor((prev) => (prev ? { ...prev, name: e.target.value } : null))
                        }
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="sensor-type">Sensor Type</Label>
                    <Select
                      value={isAddingNew ? newSensor.type : editingSensor?.type || ""}
                      onValueChange={handleSensorTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sensorTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sensor-value">Current Value</Label>
                      <Input
                        id="sensor-value"
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={isAddingNew ? newSensor.value : editingSensor?.value || ""}
                        onChange={(e) => {
                          if (isAddingNew) {
                            setNewSensor((prev) => ({ ...prev, value: e.target.value }))
                          } else if (editingSensor) {
                            setEditingSensor((prev) => (prev ? { ...prev, value: e.target.value } : null))
                          }
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sensor-unit">Unit</Label>
                      <Input
                        id="sensor-unit"
                        placeholder="Unit"
                        value={isAddingNew ? newSensor.unit : editingSensor?.unit || ""}
                        onChange={(e) => {
                          if (isAddingNew) {
                            setNewSensor((prev) => ({ ...prev, unit: e.target.value }))
                          } else if (editingSensor) {
                            setEditingSensor((prev) => (prev ? { ...prev, unit: e.target.value } : null))
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sensor-status">Status</Label>
                    <Select
                      value={isAddingNew ? newSensor.status : editingSensor?.status || ""}
                      onValueChange={(value: "normal" | "warning" | "critical") => {
                        if (isAddingNew) {
                          setNewSensor((prev) => ({ ...prev, status: value }))
                        } else if (editingSensor) {
                          setEditingSensor((prev) => (prev ? { ...prev, status: value } : null))
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              <status.icon className={cn("h-4 w-4", status.color)} />
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      {isAddingNew ? "Add Sensor" : "Save Changes"}
                    </Button>
                    {!isAddingNew && editingSensor && (
                      <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Select a Sensor</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose a sensor from the list to edit, or add a new one
                  </p>
                  <Button onClick={handleAddNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Sensor
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
