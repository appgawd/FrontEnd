"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warning" | "error" | "debug"
  source: string
  message: string
}

export function LogsView() {
  const [filter, setFilter] = useState("")
  const [logs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "11:14",
      level: "info",
      source: "Motion Detected",
      message: "Motion Detected - Hallway Camera",
    },
    { id: "2", timestamp: "11:14", level: "debug", source: "camera_snapshot", message: "saved" },
    { id: "3", timestamp: "11:15", level: "info", source: "lights_on", message: "set to true" },
    { id: "4", timestamp: "11:15", level: "info", source: "lights_on", message: "succed" },
    { id: "5", timestamp: "11:15", level: "debug", source: "analyzed_person", message: "- false" },
    { id: "6", timestamp: "11:15", level: "debug", source: "console_stapthot", message: "" },
    { id: "7", timestamp: "11:21", level: "info", source: "update", message: "success" },
    { id: "8", timestamp: "11:21", level: "info", source: "lights_on", message: "set true" },
    { id: "9", timestamp: "11:21", level: "info", source: "turn on", message: "hallway" },
    { id: "10", timestamp: "11:15", level: "info", source: "lights_on", message: "success" },
    { id: "11", timestamp: "11:15", level: "debug", source: "analyzed_person", message: "- true" },
    { id: "12", timestamp: "11:15", level: "info", source: "lights_on_set", message: "true" },
  ])

  const filteredLogs = logs.filter(
    (log) =>
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      log.source.toLowerCase().includes(filter.toLowerCase()),
  )

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-500"
      case "warning":
        return "text-yellow-500"
      case "info":
        return "text-blue-500"
      case "debug":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="h-full flex flex-col bg-background p-2">
      <div className="flex items-center space-x-2 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter logs..."
            className="pl-8"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start py-1 px-2 hover:bg-muted/50 rounded text-sm">
              <div className="w-12 text-muted-foreground tabular-nums">{log.timestamp}</div>
              <div className={cn("w-16 font-medium", getLevelColor(log.level))}>{log.level.toUpperCase()}</div>
              <div className="w-32 text-muted-foreground truncate">{log.source}</div>
              <div className="flex-1">{log.message}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
