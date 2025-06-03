"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function TerminalView() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [output, setOutput] = useState<{ text: string; type: "input" | "output" | "error" }[]>([
    { text: "Machine Automation Terminal v1.0.0", type: "output" },
    { text: 'Type "help" for available commands', type: "output" },
  ])

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [output])

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const newOutput = [...output, { text: `> ${input}`, type: "input" }]

    // Process command
    switch (input.toLowerCase()) {
      case "help":
        newOutput.push({
          text: "Available commands:\n  help - Show this help\n  clear - Clear terminal\n  status - Show system status\n  machines - List connected machines\n  sensors - Show sensor data\n  run <automation> - Run automation",
          type: "output",
        })
        break
      case "clear":
        setOutput([
          { text: "Machine Automation Terminal v1.0.0", type: "output" },
          { text: 'Type "help" for available commands', type: "output" },
        ])
        setInput("")
        return
      case "status":
        newOutput.push({
          text: "System Status: Online\nConnected Machines: 24\nActive Automations: 3\nLast Event: RB26 Temperature Check - 30 seconds ago",
          type: "output",
        })
        break
      case "machines":
        newOutput.push({
          text: "Connected Machines:\n  Vehicles:\n    - RB26 Nissan Engine (6 sensors)\n    - Tesla Model S\n    - BMW M3\n    - Yamaha R1\n  Home Automation:\n    - Smart Lights (12)\n    - Security Cameras (4)\n    - Sensors (6)\n  Systems:\n    - Data Servers (3)\n    - Network Equipment (8)",
          type: "output",
        })
        break
      case "sensors":
        newOutput.push({
          text: "RB26 Engine Sensors:\n  - Coolant Temperature: 85°C [NORMAL]\n  - Oil Temperature: 92°C [NORMAL]\n  - Intake Air Temperature: 35°C [NORMAL]\n  - Fuel Pressure: 3.5 bar [NORMAL]\n  - Fuel Level: 75% [NORMAL]\n  - Fuel Flow Rate: 12.5 L/h [NORMAL]",
          type: "output",
        })
        break
      default:
        if (input.toLowerCase().startsWith("run ")) {
          const automation = input.substring(4)
          newOutput.push({
            text: `Running automation: ${automation}...`,
            type: "output",
          })
        } else {
          newOutput.push({
            text: `Command not found: ${input}`,
            type: "error",
          })
        }
    }

    setOutput(newOutput)
    setHistory((prev) => [...prev, input])
    setInput("")
  }

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono text-sm p-2">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-2 space-y-1">
          {output.map((line, i) => (
            <div
              key={i}
              className={cn(
                "whitespace-pre-wrap break-all",
                line.type === "input" && "text-blue-400",
                line.type === "error" && "text-red-400",
              )}
            >
              {line.text}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleCommand} className="mt-2 flex items-center">
        <span className="mr-2">{">"}</span>
        <Input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none text-green-400 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          autoComplete="off"
        />
      </form>
    </div>
  )
}
