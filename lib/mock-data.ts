import {
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
} from "lucide-react"

// Mock machines data
export const mockMachines = [
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
]

// Generate UAV drone fleet
export const generateUAVFleet = () => {
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
}

// Mock alerts data
export const mockAlerts = [
  {
    id: "1",
    name: "Coolant Overheating",
    sensor_id: 1,
    condition: "above",
    threshold_value: 88,
    enabled: true,
    triggered: false,
  },
  {
    id: "2",
    name: "Oil Temperature High",
    sensor_id: 2,
    condition: "above",
    threshold_value: 95,
    enabled: true,
    triggered: false,
  },
  {
    id: "3",
    name: "Low Fuel Pressure",
    sensor_id: 4,
    condition: "below",
    threshold_value: 3.2,
    enabled: true,
    triggered: false,
  },
  {
    id: "4",
    name: "Low Fuel Level",
    sensor_id: 5,
    condition: "below",
    threshold_value: 25,
    enabled: true,
    triggered: false,
  },
  {
    id: "5",
    name: "UAV Low Battery Alert",
    sensor_id: 11,
    condition: "below",
    threshold_value: 10,
    enabled: true,
    triggered: false,
  },
]

// Mock fleets data
export const mockFleets = [
  {
    id: "uav-fleet-01",
    name: "UAV Surveillance Fleet",
    type: "UAV Drones",
    category: "planes",
    description: "Fleet of 20 DJI surveillance drones for monitoring operations",
  },
]
