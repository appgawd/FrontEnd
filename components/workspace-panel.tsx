"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlowChart } from "@/components/flow-chart"
import { TimelineView } from "@/components/timeline-view"
import { AlertsView } from "@/components/alerts-view"
import { MachineDetailView } from "@/components/machine-detail-view"
import { SensorManagementView } from "@/components/sensor-management-view"
import { FleetManagementView } from "@/components/fleet-management-view"

interface MachineSelection {
  type: "single" | "fleet" | "machine-detail" | "fleet-management"
  id: string
  name: string
  machines: any[]
  machine?: any
}

interface WorkspacePanelProps {
  activeTab: string
  onTabChange: (tab: string) => void
  selectedMachines: MachineSelection | null
  currentView: string
}

export function WorkspacePanel({ activeTab, onTabChange, selectedMachines, currentView }: WorkspacePanelProps) {
  const [selectedSensor, setSelectedSensor] = useState<any>(null)
  const [sensorManagementMachine, setSensorManagementMachine] = useState<any>(null)

  // Mock data for fleet management
  const [fleets, setFleets] = useState([
    {
      id: "uav-fleet-01",
      name: "UAV Surveillance Fleet",
      type: "UAV Drones",
      category: "planes",
      description: "Fleet of 20 DJI surveillance drones for monitoring operations",
      machines: [], // This would be populated with actual machines
    },
  ])

  const [machines] = useState([
    // This would be the full list of available machines
  ])

  const handleSensorClick = (sensor: any, machine: any) => {
    setSelectedSensor(sensor)
    setSensorManagementMachine(machine)
    onTabChange("sensor-management")
  }

  const handleAddSensor = (machine: any) => {
    setSelectedSensor(null)
    setSensorManagementMachine(machine)
    onTabChange("sensor-management")
  }

  const handleBackToMachine = () => {
    onTabChange("machine-detail")
  }

  const handleSensorUpdate = (sensor: any) => {
    // Update sensor logic here
    console.log("Update sensor:", sensor)
  }

  const handleSensorDelete = (sensorId: string) => {
    // Delete sensor logic here
    console.log("Delete sensor:", sensorId)
  }

  const handleSensorAdd = (sensor: any) => {
    // Add sensor logic here
    console.log("Add sensor:", sensor)
  }

  const handleFleetCreate = (fleet: any) => {
    const newFleet = { ...fleet, id: `fleet-${Date.now()}` }
    setFleets((prev) => [...prev, newFleet])
  }

  const handleFleetUpdate = (fleet: any) => {
    setFleets((prev) => prev.map((f) => (f.id === fleet.id ? fleet : f)))
  }

  const handleFleetDelete = (fleetId: string) => {
    setFleets((prev) => prev.filter((f) => f.id !== fleetId))
  }

  if (currentView === "sensor-management" && sensorManagementMachine) {
    return (
      <div className="h-full">
        <SensorManagementView
          machine={sensorManagementMachine}
          selectedSensor={selectedSensor}
          onBack={handleBackToMachine}
          onSensorUpdate={handleSensorUpdate}
          onSensorDelete={handleSensorDelete}
          onSensorAdd={handleSensorAdd}
        />
      </div>
    )
  }

  if (currentView === "fleet-management") {
    return (
      <div className="h-full">
        <FleetManagementView
          fleets={fleets}
          machines={machines}
          onFleetCreate={handleFleetCreate}
          onFleetUpdate={handleFleetUpdate}
          onFleetDelete={handleFleetDelete}
        />
      </div>
    )
  }

  // Default tabbed view
  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full">
        <div className="border-b border-border">
          <TabsList className="h-10 w-full justify-start rounded-none bg-transparent border-b border-border">
            <TabsTrigger
              value="flowchart"
              className="data-[state=active]:bg-background rounded-none border-r border-border"
            >
              Flowchart
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="data-[state=active]:bg-background rounded-none border-r border-border"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="data-[state=active]:bg-background rounded-none border-r border-border"
            >
              Alerts
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-background rounded-none border-r border-border">
              Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-background rounded-none">
              {selectedMachines?.machine ? `${selectedMachines.machine.name}` : "Preview"}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="flowchart" className="flex-1 p-0 m-0">
          <FlowChart />
        </TabsContent>

        <TabsContent value="timeline" className="flex-1 p-0 m-0">
          <TimelineView />
        </TabsContent>

        <TabsContent value="alerts" className="flex-1 p-0 m-0">
          <AlertsView selectedMachines={selectedMachines} />
        </TabsContent>

        <TabsContent value="code" className="flex-1 p-0 m-0">
          <div className="h-full flex items-center justify-center text-muted-foreground">Code Editor View</div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-0 m-0">
          {selectedMachines?.machine ? (
            <MachineDetailView
              machine={selectedMachines.machine}
              onSensorClick={handleSensorClick}
              onAddSensor={handleAddSensor}
            />
          ) : selectedMachines?.type === "fleet" ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Fleet Overview</h3>
                <p>Fleet: {selectedMachines.name}</p>
                <p>{selectedMachines.machines.length} machines</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Machine Preview</h3>
                <p>Select a machine to view its details</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
