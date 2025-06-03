"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Lightbulb,
  Lock,
  Thermometer,
  Video,
  Bell,
  Droplet,
  Flame,
  Camera,
  ToggleLeft,
  Car,
  Bike,
  Ship,
  Plane,
  Zap,
  CircuitBoard,
  Wind,
  Fan,
  Cog,
  Server,
  Monitor,
  Laptop,
  Tablet,
  Router,
  HardDrive,
  Printer,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function SidePanel({ collapsed, onToggle, onMachineSelectionChange, onViewChange }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const [viewMode, setViewMode] = useState("individual")
  const [expandedFleets, setExpandedFleets] = useState(new Set())

  // Generate UAV drone fleet
  const [uavFleet] = useState(() => {
    const drones = []
    for (let i = 1; i <= 20; i++) {
      const batteryLevel = Math.floor(Math.random() * 100)
      const height = Math.floor(Math.random() * 500) + 50 // 50-550 meters

      drones.push({
        id: `uav-${i.toString().padStart(2, "0")}`,
        name: `UAV Drone ${i.toString().padStart(2, "0")}`,
        icon: Plane,
        category: "planes",
        manufacturer: "DJI",
        fleetId: "uav-fleet-01",
        sensors: [
          {
            id: `battery-${i}`,
            name: "Battery Level",
            type: "battery",
            value: batteryLevel.toString(),
            unit: "%",
            status: batteryLevel < 10 ? "critical" : batteryLevel < 25 ? "warning" : "normal",
          },
          {
            id: `height-${i}`,
            name: "Altitude",
            type: "height",
            value: height.toString(),
            unit: "m",
            status: "normal",
          },
          {
            id: `gps-${i}`,
            name: "GPS Signal",
            type: "gps",
            value: (Math.random() * 5 + 10).toFixed(1),
            unit: "satellites",
            status: "normal",
          },
        ],
      })
    }

    return {
      id: "uav-fleet-01",
      name: "UAV Surveillance Fleet",
      type: "UAV Drones",
      machines: drones,
      category: "planes",
      description: "Fleet of 20 DJI surveillance drones for monitoring operations",
    }
  })

  const [machines, setMachines] = useState([
    // Home Automation
    { id: "lights", name: "Smart Lights", icon: Lightbulb, category: "home", manufacturer: "Philips" },
    { id: "locks", name: "Door Locks", icon: Lock, category: "home", manufacturer: "August" },
    { id: "thermostats", name: "Thermostats", icon: Thermometer, category: "home", manufacturer: "Nest" },
    { id: "cameras", name: "Security Cameras", icon: Camera, category: "home", manufacturer: "Ring" },
    { id: "alarms", name: "Alarm Systems", icon: Bell, category: "home", manufacturer: "ADT" },
    { id: "leaks", name: "Leak Sensors", icon: Droplet, category: "home", manufacturer: "Honeywell" },
    { id: "smoke", name: "Smoke Detectors", icon: Flame, category: "home", manufacturer: "First Alert" },
    { id: "motion", name: "Motion Sensors", icon: Video, category: "home", manufacturer: "Ring" },
    { id: "switches", name: "Smart Switches", icon: ToggleLeft, category: "home", manufacturer: "TP-Link" },

    // Cars
    {
      id: "rb26-engine",
      name: "RB26 Nissan Engine",
      icon: Cog,
      category: "cars",
      manufacturer: "Nissan",
      sensors: [
        { id: "temp1", name: "Coolant Temperature", type: "temperature", value: "85", unit: "°C", status: "normal" },
        { id: "temp2", name: "Oil Temperature", type: "temperature", value: "92", unit: "°C", status: "normal" },
        { id: "temp3", name: "Intake Air Temperature", type: "temperature", value: "35", unit: "°C", status: "normal" },
        { id: "fuel1", name: "Fuel Pressure", type: "fuel", value: "3.5", unit: "bar", status: "normal" },
        { id: "fuel2", name: "Fuel Level", type: "fuel", value: "75", unit: "%", status: "normal" },
        { id: "fuel3", name: "Fuel Flow Rate", type: "fuel", value: "12.5", unit: "L/h", status: "normal" },
      ],
    },
    { id: "tesla-model-s", name: "Tesla Model S", icon: Car, category: "cars", manufacturer: "Tesla" },
    { id: "bmw-m3", name: "BMW M3", icon: Car, category: "cars", manufacturer: "BMW" },

    // Motorcycles
    { id: "yamaha-r1", name: "Yamaha R1", icon: Bike, category: "motorcycles", manufacturer: "Yamaha" },
    { id: "ducati-panigale", name: "Ducati Panigale", icon: Bike, category: "motorcycles", manufacturer: "Ducati" },

    // Boats
    { id: "yacht-princess", name: "Princess Yacht", icon: Ship, category: "boats", manufacturer: "Princess" },
    { id: "speedboat", name: "Speed Boat", icon: Ship, category: "boats", manufacturer: "Sea Ray" },

    // Individual Planes (non-fleet)
    { id: "cessna-172", name: "Cessna 172", icon: Plane, category: "planes", manufacturer: "Cessna" },
    { id: "boeing-737", name: "Boeing 737", icon: Plane, category: "planes", manufacturer: "Boeing" },

    // Engines & Machinery
    { id: "generators", name: "Backup Generators", icon: Zap, category: "machinery", manufacturer: "Generac" },
    { id: "pumps", name: "Water Pumps", icon: CircuitBoard, category: "machinery", manufacturer: "Grundfos" },
    { id: "compressors", name: "Air Compressors", icon: Wind, category: "machinery", manufacturer: "Atlas Copco" },
    { id: "hvac", name: "HVAC Systems", icon: Fan, category: "machinery", manufacturer: "Carrier" },
    { id: "industrial", name: "Industrial Equipment", icon: Cog, category: "machinery", manufacturer: "Siemens" },

    // Computers & Servers
    { id: "servers", name: "Data Servers", icon: Server, category: "computers", manufacturer: "Dell" },
    { id: "workstations", name: "Workstations", icon: Monitor, category: "computers", manufacturer: "HP" },
    { id: "laptops", name: "Laptops", icon: Laptop, category: "computers", manufacturer: "Lenovo" },
    { id: "tablets", name: "Tablets", icon: Tablet, category: "computers", manufacturer: "Apple" },
    { id: "routers", name: "Network Equipment", icon: Router, category: "computers", manufacturer: "Cisco" },
    { id: "storage", name: "Storage Systems", icon: HardDrive, category: "computers", manufacturer: "NetApp" },
    { id: "printers", name: "Printers", icon: Printer, category: "computers", manufacturer: "Canon" },
  ])

  const [fleets, setFleets] = useState([uavFleet])

  const [selectedMachine, setSelectedMachine] = useState(null)

  const getFilteredMachines = (category) => {
    return machines
      .filter((machine) => machine.category === category && !machine.fleetId)
      .filter((machine) => machine.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const getFilteredFleets = (category) => {
    return fleets
      .filter((fleet) => fleet.category === category)
      .filter((fleet) => fleet.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const handleMachineClick = (machine) => {
    setSelectedMachine(machine)
    onMachineSelectionChange({
      type: "machine-detail",
      id: machine.id,
      name: machine.name,
      machines: [machine],
      machine: machine,
    })
    onViewChange("preview") // Changed from "machine-detail" to "preview"
  }

  const handleFleetClick = (fleet) => {
    const isExpanded = expandedFleets.has(fleet.id)
    if (isExpanded) {
      setExpandedFleets((prev) => {
        const newSet = new Set(prev)
        newSet.delete(fleet.id)
        return newSet
      })
    } else {
      setExpandedFleets((prev) => new Set(prev).add(fleet.id))
    }
  }

  const handleFleetManagement = () => {
    onMachineSelectionChange({
      type: "fleet-management",
      id: "fleet-management",
      name: "Fleet Management",
      machines: [],
    })
    onViewChange("fleet-management")
  }

  const toggleFleetExpansion = (fleetId) => {
    setExpandedFleets((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(fleetId)) {
        newSet.delete(fleetId)
      } else {
        newSet.add(fleetId)
      }
      return newSet
    })
  }

  const renderMachineList = (category) => (
    <div className={cn("py-2", collapsed ? "px-2" : "px-1")}>
      {viewMode === "fleet" && (
        <>
          {/* Fleet Management Button */}
          <div className="mb-4">
            <Button variant="outline" className="w-full justify-start" onClick={handleFleetManagement}>
              <Settings className="h-4 w-4 mr-2" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    Fleet Management
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>

          {/* Fleet List */}
          {getFilteredFleets(category).map((fleet) => (
            <div key={fleet.id} className="mb-2">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
                onClick={() => handleFleetClick(fleet)}
              >
                <div className="flex items-center w-full">
                  <Plane className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden whitespace-nowrap flex-1"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{fleet.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {fleet.machines.length}
                            </Badge>
                            {expandedFleets.has(fleet.id) ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground text-left">{fleet.type}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Button>

              {/* Fleet Machines */}
              {expandedFleets.has(fleet.id) && !collapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-6 mt-2 space-y-1"
                >
                  {fleet.machines.map((machine) => (
                    <Button
                      key={machine.id}
                      variant="ghost"
                      className="w-full justify-start text-sm py-1 h-auto"
                      onClick={() => handleMachineClick(machine)}
                    >
                      <machine.icon className="h-3 w-3 mr-2" />
                      <span className="truncate">{machine.name}</span>
                      {machine.sensors && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          {machine.sensors.length}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </>
      )}

      {viewMode === "individual" &&
        getFilteredMachines(category).map((machine) => (
          <div key={machine.id} className="mb-2">
            <Button
              variant="ghost"
              className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
              onClick={() => handleMachineClick(machine)}
            >
              <machine.icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {machine.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        ))}
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      <div className="flex items-center justify-between p-2 border-b border-border">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <h2 className="text-sm font-medium">Machines</h2>
                <div className="flex bg-muted rounded-md p-0.5">
                  <button
                    onClick={() => setViewMode("individual")}
                    className={cn(
                      "px-2 py-1 text-xs rounded-sm transition-colors",
                      viewMode === "individual"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Individual
                  </button>
                  <button
                    onClick={() => setViewMode("fleet")}
                    className={cn(
                      "px-2 py-1 text-xs rounded-sm transition-colors",
                      viewMode === "fleet"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Fleets
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={onToggle}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-2 space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search machines..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="view-mode">View Mode</Label>
              <Select value={viewMode} onValueChange={(value) => setViewMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual Machines</SelectItem>
                  <SelectItem value="fleet">Fleet View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid grid-cols-3 mx-2 mb-2">
                <TabsTrigger value="home" className="text-xs">
                  Home
                </TabsTrigger>
                <TabsTrigger value="vehicles" className="text-xs">
                  Vehicles
                </TabsTrigger>
                <TabsTrigger value="systems" className="text-xs">
                  Systems
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <TabsContent value="home" className="mt-0">
                  {renderMachineList("home")}
                </TabsContent>

                <TabsContent value="vehicles" className="mt-0">
                  <Tabs defaultValue="cars" orientation="vertical" className="h-full">
                    <TabsList className="grid grid-cols-4 mx-2 mb-2">
                      <TabsTrigger value="cars" className="text-xs">
                        Cars
                      </TabsTrigger>
                      <TabsTrigger value="motorcycles" className="text-xs">
                        Bikes
                      </TabsTrigger>
                      <TabsTrigger value="boats" className="text-xs">
                        Boats
                      </TabsTrigger>
                      <TabsTrigger value="planes" className="text-xs">
                        Planes
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="cars" className="mt-0">
                      {renderMachineList("cars")}
                    </TabsContent>

                    <TabsContent value="motorcycles" className="mt-0">
                      {renderMachineList("motorcycles")}
                    </TabsContent>

                    <TabsContent value="boats" className="mt-0">
                      {renderMachineList("boats")}
                    </TabsContent>

                    <TabsContent value="planes" className="mt-0">
                      {renderMachineList("planes")}
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                <TabsContent value="systems" className="mt-0">
                  <Tabs defaultValue="machinery" orientation="vertical" className="h-full">
                    <TabsList className="grid grid-cols-2 mx-2 mb-2">
                      <TabsTrigger value="machinery" className="text-xs">
                        Machinery
                      </TabsTrigger>
                      <TabsTrigger value="computers" className="text-xs">
                        Computers
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="machinery" className="mt-0">
                      {renderMachineList("machinery")}
                    </TabsContent>

                    <TabsContent value="computers" className="mt-0">
                      {renderMachineList("computers")}
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
