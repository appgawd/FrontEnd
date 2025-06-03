"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Trash2,
  Settings,
  AlertTriangle,
  Bell,
  Fan,
  Database,
  Mail,
  Phone,
  Zap,
  Plane,
  Battery,
} from "lucide-react"
import { cn } from "@/lib/utils"

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

interface MachineSelection {
  type: "single" | "fleet"
  id: string
  name: string
  machines: any[]
}

interface FlowNode {
  id: string
  type: "trigger" | "condition" | "action"
  label: string
  position: { x: number; y: number }
  connections: string[]
  color: string
  icon: any
  config?: {
    actionType?: string
    message?: string
    recipient?: string
    value?: string
    machineFilter?: string
  }
}

interface AlertFlowChartProps {
  alert: Alert
  selectedMachines: MachineSelection | null
}

export function AlertFlowChart({ alert, selectedMachines }: AlertFlowChartProps) {
  const [nodes, setNodes] = useState<FlowNode[]>([
    {
      id: "trigger",
      type: "trigger",
      label: `${alert.name} Triggered`,
      position: { x: 50, y: 200 },
      connections: ["condition-check"],
      color: "oklch(0.3 0.2 270)",
      icon: AlertTriangle,
    },
    {
      id: "condition-check",
      type: "condition",
      label: alert.fleetId ? "Fleet Severity Check" : "Severity Check",
      position: { x: 350, y: 200 },
      connections: ["immediate-action", "log-event"],
      color: "oklch(0.3 0.2 200)",
      icon: Settings,
    },
    {
      id: "immediate-action",
      type: "action",
      label: alert.fleetId ? "Send Fleet Alert" : "Send Alert Notification",
      position: { x: 650, y: 150 },
      connections: ["log-event"],
      color: "oklch(0.4 0.2 20)",
      icon: Bell,
      config: {
        actionType: "notification",
        message: alert.fleetId
          ? `Fleet Alert: ${alert.name} triggered on multiple units!`
          : `${alert.name} alert triggered!`,
        recipient: "admin@example.com",
      },
    },
    {
      id: "log-event",
      type: "action",
      label: "Log to Database",
      position: { x: 650, y: 300 },
      connections: [],
      color: "oklch(0.3 0.2 120)",
      icon: Database,
    },
  ])

  // Add fleet-specific nodes if this is a fleet alert
  const fleetNodes: FlowNode[] = []
  if (alert.fleetId && selectedMachines?.type === "fleet") {
    fleetNodes.push(
      {
        id: "fleet-status",
        type: "condition",
        label: "Check Fleet Status",
        position: { x: 350, y: 350 },
        connections: ["emergency-landing"],
        color: "oklch(0.3 0.2 180)",
        icon: Plane,
      },
      {
        id: "emergency-landing",
        type: "action",
        label: "Initiate Emergency Landing",
        position: { x: 650, y: 400 },
        connections: [],
        color: "oklch(0.5 0.2 0)",
        icon: Zap,
        config: {
          actionType: "emergency",
          message: "Emergency landing protocol activated for low battery drones",
          machineFilter: "battery < 5%",
        },
      },
    )
  }

  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [showAddNode, setShowAddNode] = useState(false)
  const [newNodeType, setNewNodeType] = useState<"condition" | "action">("action")
  const [newNodeLabel, setNewNodeLabel] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const actionTypes = [
    { value: "notification", label: "Send Notification", icon: Bell, color: "oklch(0.4 0.2 20)" },
    { value: "email", label: "Send Email", icon: Mail, color: "oklch(0.4 0.2 60)" },
    { value: "sms", label: "Send SMS", icon: Phone, color: "oklch(0.4 0.2 100)" },
    { value: "cooling", label: "Activate Cooling", icon: Fan, color: "oklch(0.3 0.2 180)" },
    { value: "emergency", label: "Emergency Protocol", icon: Zap, color: "oklch(0.5 0.2 0)" },
    { value: "log", label: "Log Event", icon: Database, color: "oklch(0.3 0.2 120)" },
    { value: "landing", label: "Emergency Landing", icon: Plane, color: "oklch(0.4 0.2 300)" },
  ]

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const node = nodes.find((n) => n.id === id)
      if (node) {
        setOffset({
          x: e.clientX - rect.left - node.position.x,
          y: e.clientY - rect.top - node.position.y,
        })
        setDragging(id)
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === dragging) {
            return {
              ...node,
              position: {
                x: e.clientX - rect.left - offset.x,
                y: e.clientY - rect.top - offset.y,
              },
            }
          }
          return node
        }),
      )
    }
  }

  const handleMouseUp = () => {
    setDragging(null)
  }

  const addNode = () => {
    if (!newNodeLabel) return

    const actionType = actionTypes.find((t) => t.value === "notification")
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      type: newNodeType,
      label: newNodeLabel,
      position: { x: 400, y: 500 },
      connections: [],
      color: actionType?.color || "oklch(0.3 0.2 180)",
      icon: actionType?.icon || Bell,
      config: newNodeType === "action" ? { actionType: "notification" } : undefined,
    }

    setNodes((prev) => [...prev, newNode])
    setNewNodeLabel("")
    setShowAddNode(false)
  }

  const deleteNode = (id: string) => {
    if (id === "trigger") return // Don't allow deleting the trigger node

    setNodes((prev) => {
      // Remove the node and any connections to it
      const filteredNodes = prev.filter((node) => node.id !== id)
      return filteredNodes.map((node) => ({
        ...node,
        connections: node.connections.filter((connId) => connId !== id),
      }))
    })

    if (selectedNode?.id === id) {
      setSelectedNode(null)
    }
  }

  const updateNodeConfig = (nodeId: string, config: any) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === nodeId) {
          const actionType = actionTypes.find((t) => t.value === config.actionType)
          return {
            ...node,
            config: { ...node.config, ...config },
            color: actionType?.color || node.color,
            icon: actionType?.icon || node.icon,
            label: actionType?.label || node.label,
          }
        }
        return node
      }),
    )
  }

  const connectNodes = (fromId: string, toId: string) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === fromId && !node.connections.includes(toId)) {
          return {
            ...node,
            connections: [...node.connections, toId],
          }
        }
        return node
      }),
    )
  }

  return (
    <div className="h-full flex">
      {/* Flow Chart Area */}
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          className="h-full w-full relative overflow-hidden bg-[#0c1015] rounded-lg"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Fleet Info Banner */}
          {alert.fleetId && selectedMachines && (
            <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur border rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                <span className="font-medium">Fleet Alert Flow</span>
                <Badge variant="secondary">{selectedMachines.machines.length} UAVs</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Monitoring battery levels across entire fleet</div>
            </div>
          )}

          {/* Add Node Button */}
          <div className="absolute top-4 right-4 z-20">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddNode(!showAddNode)}
              className="bg-background/80 backdrop-blur"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Node
            </Button>
          </div>

          {/* Add Node Form */}
          {showAddNode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-16 right-4 z-20 bg-background border rounded-lg p-4 shadow-lg w-64"
            >
              <div className="space-y-3">
                <div>
                  <Label htmlFor="node-type">Node Type</Label>
                  <Select value={newNodeType} onValueChange={(value: "condition" | "action") => setNewNodeType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="condition">Condition</SelectItem>
                      <SelectItem value="action">Action</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="node-label">Label</Label>
                  <Input
                    id="node-label"
                    placeholder="Enter node label"
                    value={newNodeLabel}
                    onChange={(e) => setNewNodeLabel(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addNode} size="sm" className="flex-1">
                    Add
                  </Button>
                  <Button onClick={() => setShowAddNode(false)} variant="outline" size="sm" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map((node) =>
              node.connections.map((targetId) => {
                const target = nodes.find((n) => n.id === targetId)
                if (target) {
                  const startX = node.position.x + 100
                  const startY = node.position.y + 30
                  const endX = target.position.x + 100
                  const endY = target.position.y + 30

                  const midY = (startY + endY) / 2

                  return (
                    <motion.path
                      key={`${node.id}-${targetId}`}
                      d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )
                }
                return null
              }),
            )}
          </svg>

          {/* Flow Nodes */}
          {nodes.map((node) => {
            const IconComponent = node.icon
            return (
              <motion.div
                key={node.id}
                className={cn(
                  "absolute rounded-lg p-4 w-[200px] cursor-move shadow-lg group",
                  dragging === node.id ? "z-10 shadow-xl" : "z-0",
                  selectedNode?.id === node.id ? "ring-2 ring-primary" : "",
                )}
                style={{
                  backgroundColor: node.color,
                  left: node.position.x,
                  top: node.position.y,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onClick={() => setSelectedNode(node)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-white" />
                    <div className="text-white font-medium text-sm">{node.label}</div>
                  </div>
                  {node.id !== "trigger" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNode(node.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </Button>
                  )}
                </div>
                <div className="text-white/60 text-xs mt-1">{node.type}</div>
                {node.config?.message && (
                  <div className="text-white/80 text-xs mt-1 truncate">{node.config.message}</div>
                )}
                {node.config?.machineFilter && (
                  <div className="text-white/70 text-xs mt-1">Filter: {node.config.machineFilter}</div>
                )}
              </motion.div>
            )
          })}
          {fleetNodes.map((node) => {
            const IconComponent = node.icon
            return (
              <motion.div
                key={node.id}
                className={cn(
                  "absolute rounded-lg p-4 w-[200px] cursor-move shadow-lg group",
                  dragging === node.id ? "z-10 shadow-xl" : "z-0",
                  selectedNode?.id === node.id ? "ring-2 ring-primary" : "",
                )}
                style={{
                  backgroundColor: node.color,
                  left: node.position.x,
                  top: node.position.y,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onClick={() => setSelectedNode(node)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-white" />
                    <div className="text-white font-medium text-sm">{node.label}</div>
                  </div>
                  {node.id !== "trigger" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNode(node.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </Button>
                  )}
                </div>
                <div className="text-white/60 text-xs mt-1">{node.type}</div>
                {node.config?.message && (
                  <div className="text-white/80 text-xs mt-1 truncate">{node.config.message}</div>
                )}
                {node.config?.machineFilter && (
                  <div className="text-white/70 text-xs mt-1">Filter: {node.config.machineFilter}</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Node Configuration Panel */}
      <div className="w-80 border-l border-border bg-background">
        <Card className="h-full rounded-none border-0">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedNode ? `Configure ${selectedNode.label}` : "Select a Node"}
            </CardTitle>
            {alert.fleetId && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Battery className="h-4 w-4" />
                Fleet Alert Configuration
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <Label>Node Type</Label>
                    <div className="text-sm text-muted-foreground capitalize">{selectedNode.type}</div>
                  </div>

                  <div>
                    <Label htmlFor="node-label-edit">Label</Label>
                    <Input
                      id="node-label-edit"
                      value={selectedNode.label}
                      onChange={(e) => {
                        setNodes((prev) =>
                          prev.map((node) => (node.id === selectedNode.id ? { ...node, label: e.target.value } : node)),
                        )
                        setSelectedNode({ ...selectedNode, label: e.target.value })
                      }}
                    />
                  </div>

                  {selectedNode.type === "action" && (
                    <>
                      <div>
                        <Label>Action Type</Label>
                        <Select
                          value={selectedNode.config?.actionType || "notification"}
                          onValueChange={(value) => updateNodeConfig(selectedNode.id, { actionType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {actionTypes.map((type) => (
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

                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Input
                          id="message"
                          placeholder="Enter message"
                          value={selectedNode.config?.message || ""}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { message: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="recipient">Recipient</Label>
                        <Input
                          id="recipient"
                          placeholder="Enter recipient"
                          value={selectedNode.config?.recipient || ""}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { recipient: e.target.value })}
                        />
                      </div>

                      {alert.fleetId && (
                        <div>
                          <Label htmlFor="machine-filter">Machine Filter</Label>
                          <Input
                            id="machine-filter"
                            placeholder="e.g., battery < 5%"
                            value={selectedNode.config?.machineFilter || ""}
                            onChange={(e) => updateNodeConfig(selectedNode.id, { machineFilter: e.target.value })}
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            Filter which machines trigger this action
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {alert.fleetId && selectedMachines && (
                    <div className="border-t pt-4">
                      <Label>Fleet Information</Label>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total UAVs:</span>
                          <Badge variant="secondary">{selectedMachines.machines.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Low Battery:</span>
                          <Badge variant="destructive">
                            {
                              selectedMachines.machines.filter((m: any) =>
                                m.sensors?.some((s: any) => s.type === "battery" && Number.parseFloat(s.value) < 10),
                              ).length
                            }
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Critical Battery:</span>
                          <Badge variant="destructive">
                            {
                              selectedMachines.machines.filter((m: any) =>
                                m.sensors?.some((s: any) => s.type === "battery" && Number.parseFloat(s.value) < 5),
                              ).length
                            }
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Connections</Label>
                    <div className="text-sm text-muted-foreground">
                      {selectedNode.connections.length > 0
                        ? `Connected to: ${selectedNode.connections.join(", ")}`
                        : "No connections"}
                    </div>
                  </div>

                  <div>
                    <Label>Connect to Node</Label>
                    <Select onValueChange={(value) => connectNodes(selectedNode.id, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select node to connect" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes
                          .filter((node) => node.id !== selectedNode.id && !selectedNode.connections.includes(node.id))
                          .map((node) => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Click on a node in the flowchart to configure its properties and connections.
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
