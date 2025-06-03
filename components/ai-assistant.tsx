"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SendHorizontal, Mic, ImageIcon, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AiAssistant() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your machine automation assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }

    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (input.toLowerCase().includes("rb26") || input.toLowerCase().includes("nissan")) {
        response =
          "RB26 Engine Status: Coolant temp 85°C, Oil temp 92°C, Fuel pressure 3.5 bar. All sensors operating normally. Would you like to adjust any parameters?"
      } else if (input.toLowerCase().includes("temperature") || input.toLowerCase().includes("temp")) {
        response =
          "Temperature sensors are monitoring: Coolant (85°C), Oil (92°C), and Intake Air (35°C). All within normal operating ranges."
      } else if (input.toLowerCase().includes("fuel")) {
        response =
          "Fuel system status: Pressure 3.5 bar, Level 75%, Flow rate 12.5 L/h. All fuel sensors reporting normal operation."
      } else if (input.toLowerCase().includes("sensor")) {
        response =
          "I can help you add, edit, or delete sensors. Currently monitoring 6 sensors on the RB26 engine. What would you like to do?"
      } else if (input.toLowerCase().includes("car") || input.toLowerCase().includes("vehicle")) {
        response =
          "Vehicle fleet status: RB26 Nissan Engine operational, Tesla Model S charging, BMW M3 in garage. Which vehicle would you like to monitor?"
      } else if (input.toLowerCase().includes("server") || input.toLowerCase().includes("computer")) {
        response =
          "All servers are online and running normally. CPU usage is at 45%, memory at 62%. Would you like detailed system metrics?"
      } else if (input.toLowerCase().includes("automation") || input.toLowerCase().includes("routine")) {
        response =
          "I can help you create or modify automation routines for your machines. Would you like to see existing routines or create a new one?"
      } else {
        response =
          "I can help you monitor and control your machines including vehicles, engines, computers, and home automation. What specific machine or system would you like to work with?"
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={cn(
                "flex items-start gap-3 max-w-[80%]",
                message.role === "assistant" ? "mr-auto" : "ml-auto flex-row-reverse",
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/abstract-ai-icon.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "rounded-lg p-3",
                  message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground",
                )}
              >
                <div className="mb-1">{message.content}</div>
                <div
                  className={cn(
                    "text-xs",
                    message.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/70",
                  )}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/simple-user-icon.png" alt="User" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Ask about your machines..."
            className="min-h-[60px] max-h-[200px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" size="icon" className="rounded-full">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" className="rounded-full">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" className="rounded-full">
              <Mic className="h-4 w-4" />
            </Button>
            <Button type="submit" size="icon" className="rounded-full">
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
