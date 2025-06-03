"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Plus, Trash2, AlertTriangle, CheckCircle, XCircle, TrendingUp, Workflow, Plane, Battery } from "lucide-react"
import { cn } from "@/lib/utils"
import { AlertFlowChart } from "@/components/alert-flow-chart"

interface MachineSelection {
  type: "single" | "fleet"
  id: string
  name: string
  machines: any[]
}

interface Alert {
  id: string
  name: string
  sensor: string
  condition: "above" | "below"
  value: number
  unit: string
  enabled: boolean
  triggered: boolean
  lastTriggered?: Date
  machineIds: string[]
  fleetId?: string
}

interface AlertEvent {
  id: string
  alertId: string
  timestamp: Date
  value: number
  severity: "warning" | "critical"
  machineId: string
  machineName: string
}

interface AlertsViewProps {
  selectedMachines: MachineSelection | null
}

export function AlertsView({ selectedMachines }: AlertsViewProps) {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      name: "Coolant Overheating",
      sensor: "coolantTemp",
      condition: "above",
      value: 88,
      unit: "°C",
      enabled: true,
      triggered: false,
      machineIds: ["rb26-engine"],
    },
    {
      id: "2",
      name: "Oil Temperature High",
      sensor: "oilTemp",
      condition: "above",
      value: 95,
      unit: "°C",
      enabled: true,
      triggered: false,
      machineIds: ["rb26-engine"],
    },
    {
      id: "3",
      name: "Low Fuel Pressure",
      sensor: "fuelPressure",
      condition: "below",
      value: 3.2,
      unit: "bar",
      enabled: true,
      triggered: false,
      machineIds: ["rb26-engine"],
    },
    {
      id: "4",
      name: "Low Fuel Level",
      sensor: "fuelLevel",
      condition: "below",
      value: 25,
      unit: "%",
      enabled: true,
      triggered: false,
      machineIds: ["rb26-engine"],
    },
    {
      id: "5",
      name: "UAV Low Battery Alert",
      sensor: "battery",
      condition: "below",
      value: 10,
      unit: "%",
      enabled: true,
      triggered: false,
      machineIds: [], // Will be populated with all UAV drone IDs
      fleetId: "uav-fleet-01",
    },
  ])

  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>([])
  const [selectedSensor, setSelectedSensor] = useState("coolantTemp")
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(alerts[0])

  const [newAlert, setNewAlert] = useState({
    name: "",
    sensor: "coolantTemp",
    condition: "above" as "above" | "below",
    value: 0,
  })

  const sensorOptions = [
    { value: "coolantTemp", label: "Coolant Temperature", unit: "°C" },
    { value: "oilTemp", label: "Oil Temperature", unit: "°C" },
    { value: "intakeTemp", label: "Intake Air Temperature", unit: "°C" },
    { value: "fuelPressure", label: "Fuel Pressure", unit: "bar" },
    { value: "fuelLevel", label: "Fuel Level", unit: "%" },
    { value: "fuelFlow", label: "Fuel Flow Rate", unit: "L/h" },
    { value: "battery", label: "Battery Level", unit: "%" },
    { value: "height", label: "Altitude", unit: "m" },
    { value: "gps", label: "GPS Signal", unit: "satellites" },
  ]

  // Update UAV fleet alert with all drone IDs when selectedMachines changes
  useEffect(() => {
    if (selectedMachines?.type === "fleet" && selectedMachines.id === "uav-fleet-01") {
      const droneIds = selectedMachines.machines.map((machine) => machine.id)
      setAlerts((prev) =>
        prev.map((alert) => {
          if (alert.id === "5") {
            return { ...alert, machineIds: droneIds }
          }
          return alert
        }),
      )
    }
  }, [selectedMachines])

  // Generate mock sensor data for battery monitoring
  const generateBatteryData = () => {
    if (!selectedMachines?.machines) return []

    const data = []
    for (let i = 0; i < 30; i++) {
      const timestamp = Date.now() - (29 - i) * 1000
      const dataPoint: any = { timestamp, time: i }

      selectedMachines.machines.forEach((machine) => {
        if (machine.sensors) {
          machine.sensors.forEach((sensor: any) => {
            if (sensor.type === "battery") {
              // Simulate battery drain over time with some fluctuation
              const baseValue = Number.parseFloat(sensor.value)
              const timeDecay = i * 0.1 // Slight decrease over time
              const fluctuation = Math.random() * 2 - 1 // ±1% fluctuation
              dataPoint[`${machine.id}_battery`] = Math.max(0, baseValue - timeDecay + fluctuation)
            }
          })
        }
      })

      data.push(dataPoint)
    }
    return data
  }

  const [sensorData] = useState(() => generateBatteryData())

  // Check for alert triggers
  useEffect(() => {
    const checkAlerts = () => {
      if (!selectedMachines?.machines) return

      alerts.forEach((alert) => {
        if (!alert.enabled) return

        const triggeredMachines: string[] = []

        selectedMachines.machines.forEach((machine) => {
          if (alert.machineIds.includes(machine.id) && machine.sensors) {
            machine.sensors.forEach((sensor: any) => {
              if (sensor.type === alert.sensor.replace(/([A-Z])/g, "").toLowerCase()) {
                const sensorValue = Number.parseFloat(sensor.value)
                const shouldTrigger =
                  (alert.condition === "above" && sensorValue > alert.value) ||
                  (alert.condition === "below" && sensorValue < alert.value)

                if (shouldTrigger) {
                  triggeredMachines.push(machine.id)

                  // Add alert event
                  const newEvent: AlertEvent = {
                    id: `event-${Date.now()}-${alert.id}-${machine.id}`,
                    alertId: alert.id,
                    timestamp: new Date(),
                    value: sensorValue,
                    severity: Math.abs(sensorValue - alert.value) > alert.value * 0.1 ? "critical" : "warning",
                    machineId: machine.id,
                    machineName: machine.name,
                  }

                  setAlertEvents((prev) => {
                    const exists = prev.some(
                      (e) =>
                        e.alertId === alert.id &&
                        e.machineId === machine.id &&
                        Math.abs(e.timestamp.getTime() - newEvent.timestamp.getTime()) < 5000,
                    )
                    if (!exists) {
                      return [newEvent, ...prev].slice(0, 100)
                    }
                    return prev
                  })
                }
              }
            })
          }
        })

        // Update alert triggered status
        const wasTriggered = alert.triggered
        const isTriggered = triggeredMachines.length > 0

        if (isTriggered !== wasTriggered) {
          setAlerts((prev) =>
            prev.map((a) =>
              a.id === alert.id
                ? { ...a, triggered: isTriggered, lastTriggered: isTriggered ? new Date() : a.lastTriggered }
                : a,
            ),
          )
        }
      })
    }

    const interval = setInterval(checkAlerts, 2000)
    return () => clearInterval(interval)
  }, [alerts, selectedMachines])

  const addAlert = () => {
    if (!newAlert.name || !newAlert.value || !selectedMachines) return

    const sensorOption = sensorOptions.find((s) => s.value === newAlert.sensor)
    if (!sensorOption) return

    const machineIds =
      selectedMachines.type === "fleet" ? selectedMachines.machines.map((m) => m.id) : [selectedMachines.id]

    const alert: Alert = {
      id: Date.now().toString(),
      name: newAlert.name,
      sensor: newAlert.sensor,
      condition: newAlert.condition,
      value: newAlert.value,
      unit: sensorOption.unit,
      enabled: true,
      triggered: false,
      machineIds,
      fleetId: selectedMachines.type === "fleet" ? selectedMachines.id : undefined,
    }

    setAlerts((prev) => [...prev, alert])
    setNewAlert({ name: "", sensor: "coolantTemp", condition: "above", value: 0 })
  }

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    setAlertEvents((prev) => prev.filter((e) => e.alertId !== id))
    if (selectedAlert?.id === id) {
      setSelectedAlert(alerts.find((a) => a.id !== id) || null)
    }
  }

  const toggleAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)))
  }

  const getChartData = () => {
    return sensorData.map((reading, index) => ({
      time: index,
      value: reading[`${selectedMachines?.machines[0]?.id}_battery`] || 0,
      timestamp: new Date(reading.timestamp).toLocaleTimeString(),
    }))
  }

  const getAlertLinesForSensor = () => {
    return alerts.filter((alert) => alert.sensor === selectedSensor && alert.enabled)
  }

  const getSensorUnit = () => {
    return sensorOptions.find((s) => s.value === selectedSensor)?.unit || ""
  }

  const getSensorLabel = () => {
    return sensorOptions.find((s) => s.value === selectedSensor)?.label || ""
  }

  return (
    <div className="h-full flex flex-col bg-background p-4">
      {/* Selected Machines Info */}
      {selectedMachines && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            {selectedMachines.type === "fleet" ? <Plane className="h-4 w-4" /> : <Battery className="h-4 w-4" />}
            <span className="font-medium">{selectedMachines.name}</span>
            <Badge variant="secondary">
              {selectedMachines.type === "fleet" ? `${selectedMachines.machines.length} machines` : "Single machine"}
            </Badge>
          </div>
          {selectedMachines.type === "fleet" && (
            <div className="text-sm text-muted-foreground mt-1">
              Fleet monitoring enabled for all {selectedMachines.machines.length} units
            </div>
          )}
        </div>
      )}

      <Tabs defaultValue="alerts" className="h-full flex flex-col">
        <TabsList className="grid grid-cols-4 w-fit">
          <TabsTrigger value="alerts">Alert Rules</TabsTrigger>
          <TabsTrigger value="flowchart">Alert Flow</TabsTrigger>
          <TabsTrigger value="events">Alert Events</TabsTrigger>
          <TabsTrigger value="charts">Sensor Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="flex-1 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* Add New Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Alert
                </CardTitle>
                <CardDescription>
                  Create a new alert rule for {selectedMachines ? selectedMachines.name : "selected machines"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="alert-name">Alert Name</Label>
                  <Input
                    id="alert-name"
                    placeholder="Enter alert name"
                    value={newAlert.name}
                    onChange={(e) => setNewAlert((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="sensor-select">Sensor</Label>
                  <Select
                    value={newAlert.sensor}
                    onValueChange={(value) => setNewAlert((prev) => ({ ...prev, sensor: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sensorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="condition-select">Condition</Label>
                    <Select
                      value={newAlert.condition}
                      onValueChange={(value: "above" | "below") =>
                        setNewAlert((prev) => ({ ...prev, condition: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Above</SelectItem>
                        <SelectItem value="below">Below</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="alert-value">Value</Label>
                    <Input
                      id="alert-value"
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={newAlert.value || ""}
                      onChange={(e) =>
                        setNewAlert((prev) => ({ ...prev, value: Number.parseFloat(e.target.value) || 0 }))
                      }
                    />
                  </div>
                </div>

                <Button onClick={addAlert} className="w-full" disabled={!selectedMachines}>
                  Add Alert
                </Button>
              </CardContent>
            </Card>

            {/* Alert Rules List */}
            <Card>
              <CardHeader>
                <CardTitle>Active Alert Rules</CardTitle>
                <CardDescription>Manage your sensor alert rules</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer",
                          alert.triggered ? "border-red-500 bg-red-500/10" : "border-border",
                          selectedAlert?.id === alert.id ? "ring-2 ring-primary" : "",
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{alert.name}</h4>
                              {alert.triggered && <AlertTriangle className="h-4 w-4 text-red-500" />}
                              {alert.enabled && !alert.triggered && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {!alert.enabled && <XCircle className="h-4 w-4 text-gray-500" />}
                              {alert.fleetId && (
                                <Badge variant="outline" className="text-xs">
                                  Fleet
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {sensorOptions.find((s) => s.value === alert.sensor)?.label} {alert.condition}{" "}
                              {alert.value} {alert.unit}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Monitoring {alert.machineIds.length} machine{alert.machineIds.length !== 1 ? "s" : ""}
                            </div>
                            {alert.lastTriggered && (
                              <div className="text-xs text-muted-foreground">
                                Last triggered: {alert.lastTriggered.toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={alert.enabled ? "default" : "secondary"}>
                              {alert.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleAlert(alert.id)
                              }}
                            >
                              {alert.enabled ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteAlert(alert.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="flowchart" className="flex-1 mt-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Alert Flow Designer
              </CardTitle>
              <CardDescription>
                Design the automation flow for: {selectedAlert?.name || "Select an alert"}
              </CardDescription>
              {selectedAlert && (
                <div className="flex items-center gap-2">
                  <Label>Selected Alert:</Label>
                  <Select
                    value={selectedAlert.id}
                    onValueChange={(value) => setSelectedAlert(alerts.find((a) => a.id === value) || null)}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {alerts.map((alert) => (
                        <SelectItem key={alert.id} value={alert.id}>
                          {alert.name} {alert.fleetId && "(Fleet)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)]">
              {selectedAlert ? (
                <AlertFlowChart alert={selectedAlert} selectedMachines={selectedMachines} />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select an alert from the Alert Rules tab to design its automation flow
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="flex-1 mt-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Alert Events History</CardTitle>
              <CardDescription>Recent alert triggers and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {alertEvents.map((event) => {
                    const alert = alerts.find((a) => a.id === event.alertId)
                    if (!alert) return null

                    return (
                      <motion.div
                        key={event.id}
                        className={cn(
                          "p-3 rounded-lg border-l-4",
                          event.severity === "critical"
                            ? "border-l-red-500 bg-red-500/10"
                            : "border-l-yellow-500 bg-yellow-500/10",
                        )}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{alert.name}</h4>
                            <div className="text-sm text-muted-foreground">
                              Machine: {event.machineName} | Value: {event.value.toFixed(2)} {alert.unit} | Threshold:{" "}
                              {alert.value} {alert.unit}
                            </div>
                            <div className="text-xs text-muted-foreground">{event.timestamp.toLocaleString()}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {alert.fleetId && (
                              <Badge variant="outline" className="text-xs">
                                Fleet
                              </Badge>
                            )}
                            <Badge variant={event.severity === "critical" ? "destructive" : "secondary"}>
                              {event.severity}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                  {alertEvents.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">No alert events recorded yet</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="flex-1 mt-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sensor Data with Alert Thresholds
              </CardTitle>
              <CardDescription>Real-time sensor readings with configured alert levels</CardDescription>
              <div className="flex items-center gap-2">
                <Label htmlFor="sensor-chart-select">Sensor:</Label>
                <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sensorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tickFormatter={(value) => `-${30 - value}s`} />
                    <YAxis
                      label={{ value: `${getSensorLabel()} (${getSensorUnit()})`, angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      labelFormatter={(value) => `Time: -${30 - value}s`}
                      formatter={(value: number) => [`${value.toFixed(2)} ${getSensorUnit()}`, getSensorLabel()]}
                    />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    {getAlertLinesForSensor().map((alert) => (
                      <ReferenceLine
                        key={alert.id}
                        y={alert.value}
                        stroke={alert.condition === "above" ? "#ef4444" : "#f59e0b"}
                        strokeDasharray="5 5"
                        label={{
                          value: `${alert.name}: ${alert.value} ${alert.unit}`,
                          position: "topRight",
                        }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
