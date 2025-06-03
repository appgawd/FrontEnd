"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Node {
  id: string
  type: "trigger" | "condition" | "action" | "sensor"
  label: string
  position: { x: number; y: number }
  connections: string[]
  color: string
  sensorData?: {
    value: string
    unit: string
    status: "normal" | "warning" | "critical"
  }
}

export function FlowChart() {
  const [nodes, setNodes] = useState<Node[]>([
    // RB26 Engine Temperature and Fuel Monitoring System
    {
      id: "coolant-temp",
      type: "sensor",
      label: "Coolant Temperature",
      position: { x: 50, y: 100 },
      connections: ["temp-check"],
      color: "oklch(0.3 0.2 200)",
      sensorData: { value: "85", unit: "°C", status: "normal" },
    },
    {
      id: "oil-temp",
      type: "sensor",
      label: "Oil Temperature",
      position: { x: 50, y: 200 },
      connections: ["temp-check"],
      color: "oklch(0.3 0.2 200)",
      sensorData: { value: "92", unit: "°C", status: "normal" },
    },
    {
      id: "intake-temp",
      type: "sensor",
      label: "Intake Air Temp",
      position: { x: 50, y: 300 },
      connections: ["temp-check"],
      color: "oklch(0.3 0.2 200)",
      sensorData: { value: "35", unit: "°C", status: "normal" },
    },
    {
      id: "fuel-pressure",
      type: "sensor",
      label: "Fuel Pressure",
      position: { x: 50, y: 400 },
      connections: ["fuel-check"],
      color: "oklch(0.3 0.2 60)",
      sensorData: { value: "3.5", unit: "bar", status: "normal" },
    },
    {
      id: "fuel-level",
      type: "sensor",
      label: "Fuel Level",
      position: { x: 50, y: 500 },
      connections: ["fuel-check"],
      color: "oklch(0.3 0.2 60)",
      sensorData: { value: "75", unit: "%", status: "normal" },
    },
    {
      id: "temp-check",
      type: "condition",
      label: "Temperature Check",
      position: { x: 350, y: 200 },
      connections: ["cooling-fan", "warning-alert"],
      color: "oklch(0.3 0.2 270)",
    },
    {
      id: "fuel-check",
      type: "condition",
      label: "Fuel System Check",
      position: { x: 350, y: 450 },
      connections: ["fuel-pump", "low-fuel-alert"],
      color: "oklch(0.3 0.2 270)",
    },
    {
      id: "cooling-fan",
      type: "action",
      label: "Activate Cooling Fan",
      position: { x: 600, y: 150 },
      connections: ["log-action"],
      color: "oklch(0.3 0.2 180)",
    },
    {
      id: "warning-alert",
      type: "action",
      label: "Temperature Warning",
      position: { x: 600, y: 250 },
      connections: ["log-action"],
      color: "oklch(0.4 0.2 20)",
    },
    {
      id: "fuel-pump",
      type: "action",
      label: "Adjust Fuel Pump",
      position: { x: 600, y: 400 },
      connections: ["log-action"],
      color: "oklch(0.3 0.2 180)",
    },
    {
      id: "low-fuel-alert",
      type: "action",
      label: "Low Fuel Alert",
      position: { x: 600, y: 500 },
      connections: ["log-action"],
      color: "oklch(0.4 0.2 20)",
    },
    {
      id: "log-action",
      type: "action",
      label: "Log to Database",
      position: { x: 850, y: 325 },
      connections: [],
      color: "oklch(0.3 0.2 120)",
    },
  ])

  const [dragging, setDragging] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div
      ref={containerRef}
      className="h-full w-full relative overflow-hidden bg-[#0c1015]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map((node) =>
          node.connections.map((targetId) => {
            const target = nodes.find((n) => n.id === targetId)
            if (target) {
              const startX = node.position.x + 100
              const startY = node.position.y + 30
              const endX = target.position.x + 100
              const endY = target.position.y + 30

              // Calculate control points for curved lines
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

      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className={cn(
            "absolute rounded-lg p-4 w-[200px] cursor-move shadow-lg",
            dragging === node.id ? "z-10 shadow-xl" : "z-0",
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-white font-medium">{node.label}</div>
          <div className="text-white/60 text-sm">{node.type}</div>
          {node.sensorData && (
            <div className="mt-2 text-white/80 text-xs">
              <div>
                {node.sensorData.value} {node.sensorData.unit}
              </div>
              <div
                className={cn(
                  "inline-block w-2 h-2 rounded-full mt-1",
                  node.sensorData.status === "normal" && "bg-green-400",
                  node.sensorData.status === "warning" && "bg-yellow-400",
                  node.sensorData.status === "critical" && "bg-red-400",
                )}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
