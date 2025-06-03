"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Save, Ship, Plane, Car, Bike, Server, Cog, Users, Filter, Search } from "lucide-react"
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

interface Fleet {
  id: string
  name: string
  type: string
  machines: Machine[]
  category: string
  description?: string
}

interface Sensor {
  id: string
  name: string
  type: string
  value: string
  unit: string
  status: "normal" | "warning" | "critical"
}

interface FleetManagementViewProps {
  fleets: Fleet[]
  machines: Machine[]
  onFleetCreate: (fleet: Omit<Fleet, "id">) => void
  onFleetUpdate: (fleet: Fleet) => void
  onFleetDelete: (fleetId: string) => void
}

export function FleetManagementView({
  fleets,
  machines,
  onFleetCreate,
  onFleetUpdate,
  onFleetDelete,
}: FleetManagementViewProps) {
  const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null)
  const [isCreatingFleet, setIsCreatingFleet] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterSensorType, setFilterSensorType] = useState<string>("all")

  const [newFleet, setNewFleet] = useState({
    name: "",
    type: "",
    category: "planes",
    description: "",
    selectedMachines: [] as string[],
  })

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "home", label: "Home Automation" },
    { value: "cars", label: "Cars" },
    { value: "motorcycles", label: "Motorcycles" },
    { value: "boats", label: "Boats" },
    { value: "planes", label: "Planes" },
    { value: "machinery", label: "Machinery" },
    { value: "computers", label: "Computers" },
  ]

  const sensorTypes = [
    { value: "all", label: "All Sensor Types" },
    { value: "temperature", label: "Temperature" },
    { value: "battery", label: "Battery" },
    { value: "fuel", label: "Fuel" },
    { value: "pressure", label: "Pressure" },
    { value: "height", label: "Height/Altitude" },
    { value: "gps", label: "GPS" },
  ]

  const getFilteredMachines = () => {
    return machines.filter((machine) => {
      // Filter out machines already in fleets
      if (machine.fleetId) return false

      // Search filter
      if (searchQuery && !machine.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Category filter
      if (filterCategory !== "all" && machine.category !== filterCategory) {
        return false
      }

      // Sensor type filter
      if (filterSensorType !== "all") {
        const hasSensorType = machine.sensors?.some((sensor) => sensor.type === filterSensorType)
        if (!hasSensorType) return false
      }

      return true
    })
  }

  const getCompatibleMachines = () => {
    if (newFleet.selectedMachines.length === 0) return getFilteredMachines()

    // Get sensor types from first selected machine
    const firstMachine = machines.find((m) => m.id === newFleet.selectedMachines[0])
    if (!firstMachine?.sensors) return getFilteredMachines()

    const requiredSensorTypes = firstMachine.sensors.map((s) => s.type)

    return getFilteredMachines().filter((machine) => {
      if (!machine.sensors) return false

      const machineSensorTypes = machine.sensors.map((s) => s.type)
      return requiredSensorTypes.every((type) => machineSensorTypes.includes(type))
    })
  }

  const handleMachineToggle = (machineId: string) => {
    setNewFleet((prev) => ({
      ...prev,
      selectedMachines: prev.selectedMachines.includes(machineId)
        ? prev.selectedMachines.filter((id) => id !== machineId)
        : [...prev.selectedMachines, machineId],
    }))
  }

  const handleCreateFleet = () => {
    if (!newFleet.name || !newFleet.type || newFleet.selectedMachines.length === 0) return

    const selectedMachineObjects = machines.filter((m) => newFleet.selectedMachines.includes(m.id))

    onFleetCreate({
      name: newFleet.name,
      type: newFleet.type,
      category: newFleet.category,
      description: newFleet.description,
      machines: selectedMachineObjects,
    })

    setNewFleet({
      name: "",
      type: "",
      category: "planes",
      description: "",
      selectedMachines: [],
    })
    setIsCreatingFleet(false)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cars":
        return Car
      case "motorcycles":
        return Bike
      case "boats":
        return Ship
      case "planes":
        return Plane
      case "machinery":
        return Cog
      case "computers":
        return Server
      default:
        return Users
    }
  }

  return (
    <div className="h-full flex flex-col bg-background p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Fleet Management</h1>
            <p className="text-muted-foreground">Create and manage machine fleets</p>
          </div>
          <Button onClick={() => setIsCreatingFleet(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Fleet
          </Button>
        </div>
        <Separator />
      </motion.div>

      <Tabs defaultValue="fleets" className="flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fleets">Existing Fleets</TabsTrigger>
          <TabsTrigger value="create">Create Fleet</TabsTrigger>
        </TabsList>

        <TabsContent value="fleets" className="flex-1 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Fleet List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Fleets ({fleets.length})</CardTitle>
                <CardDescription>Manage your existing fleets</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {fleets.map((fleet) => {
                      const CategoryIcon = getCategoryIcon(fleet.category)

                      return (
                        <div
                          key={fleet.id}
                          className={cn(
                            "p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm",
                            selectedFleet?.id === fleet.id ? "ring-2 ring-primary border-primary" : "",
                          )}
                          onClick={() => setSelectedFleet(fleet)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">{fleet.name}</p>
                                <p className="text-xs text-muted-foreground">{fleet.type}</p>
                              </div>
                            </div>
                            <Badge variant="secondary">{fleet.machines.length}</Badge>
                          </div>
                        </div>
                      )
                    })}

                    {fleets.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No fleets created yet</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Fleet Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{selectedFleet ? selectedFleet.name : "Select a Fleet"}</CardTitle>
                <CardDescription>
                  {selectedFleet ? "Fleet details and machine list" : "Choose a fleet to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedFleet ? (
                  <div className="space-y-6">
                    {/* Fleet Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Fleet Type</Label>
                        <p className="text-sm">{selectedFleet.type}</p>
                      </div>
                      <div>
                        <Label>Category</Label>
                        <p className="text-sm capitalize">{selectedFleet.category}</p>
                      </div>
                    </div>

                    {selectedFleet.description && (
                      <div>
                        <Label>Description</Label>
                        <p className="text-sm text-muted-foreground">{selectedFleet.description}</p>
                      </div>
                    )}

                    {/* Machines */}
                    <div>
                      <Label>Machines ({selectedFleet.machines.length})</Label>
                      <ScrollArea className="h-[300px] mt-2">
                        <div className="space-y-2">
                          {selectedFleet.machines.map((machine) => {
                            const MachineIcon = machine.icon

                            return (
                              <div key={machine.id} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <MachineIcon className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium text-sm">{machine.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {machine.manufacturer} • {machine.sensors?.length || 0} sensors
                                      </p>
                                    </div>
                                  </div>
                                  <Badge variant="outline">{machine.category}</Badge>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Edit Fleet
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          onFleetDelete(selectedFleet.id)
                          setSelectedFleet(null)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No Fleet Selected</h3>
                    <p className="text-sm text-muted-foreground">Select a fleet from the list to view its details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create" className="flex-1 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Fleet Creation Form */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Fleet</CardTitle>
                <CardDescription>Group machines with similar sensors into a fleet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fleet-name">Fleet Name</Label>
                  <Input
                    id="fleet-name"
                    placeholder="Enter fleet name"
                    value={newFleet.name}
                    onChange={(e) => setNewFleet((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="fleet-type">Fleet Type</Label>
                  <Input
                    id="fleet-type"
                    placeholder="e.g., Surveillance Drones, Racing Cars"
                    value={newFleet.type}
                    onChange={(e) => setNewFleet((prev) => ({ ...prev, type: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="fleet-category">Category</Label>
                  <Select
                    value={newFleet.category}
                    onValueChange={(value) => setNewFleet((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c.value !== "all")
                        .map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fleet-description">Description (Optional)</Label>
                  <Textarea
                    id="fleet-description"
                    placeholder="Describe the fleet purpose and capabilities"
                    value={newFleet.description}
                    onChange={(e) => setNewFleet((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleCreateFleet}
                    className="w-full"
                    disabled={!newFleet.name || !newFleet.type || newFleet.selectedMachines.length === 0}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Create Fleet ({newFleet.selectedMachines.length} machines)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Machine Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Machines</CardTitle>
                <CardDescription>
                  Choose machines with compatible sensors
                  {newFleet.selectedMachines.length > 0 && " (showing compatible machines)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search machines..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterSensorType} onValueChange={setFilterSensorType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sensorTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {getCompatibleMachines().map((machine) => {
                      const MachineIcon = machine.icon
                      const isSelected = newFleet.selectedMachines.includes(machine.id)

                      return (
                        <div
                          key={machine.id}
                          className={cn(
                            "p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm",
                            isSelected ? "ring-2 ring-primary border-primary bg-primary/5" : "",
                          )}
                          onClick={() => handleMachineToggle(machine.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Checkbox checked={isSelected} />
                              <MachineIcon className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">{machine.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {machine.manufacturer} • {machine.sensors?.length || 0} sensors
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{machine.category}</Badge>
                              {machine.sensors && machine.sensors.length > 0 && (
                                <div className="flex gap-1">
                                  {machine.sensors.slice(0, 3).map((sensor) => (
                                    <Badge key={sensor.id} variant="secondary" className="text-xs">
                                      {sensor.type}
                                    </Badge>
                                  ))}
                                  {machine.sensors.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{machine.sensors.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {getCompatibleMachines().length === 0 && (
                      <div className="text-center py-8">
                        <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {newFleet.selectedMachines.length > 0
                            ? "No compatible machines found"
                            : "No machines available"}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
