"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronUp, ChevronDown, Terminal, Bug, MessageSquare, History } from "lucide-react"
import { TerminalView } from "@/components/terminal-view"
import { LogsView } from "@/components/logs-view"
import { AiAssistant } from "@/components/ai-assistant"
import { FlowChart } from "@/components/flow-chart"

export function BottomPanel({ collapsed, onToggle, activeTab, onTabChange }) {
  return (
    <div className="h-full flex flex-col bg-background border-t border-border">
      <div className="flex items-center justify-between p-2 border-b border-border">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
              <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                <TabsList className="h-8 bg-transparent">
                  <TabsTrigger value="flowchart" className="h-7 px-3 data-[state=active]:bg-background">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Flowchart
                  </TabsTrigger>
                  <TabsTrigger value="terminal" className="h-7 px-3 data-[state=active]:bg-background">
                    <Terminal className="h-4 w-4 mr-2" />
                    Terminal
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="h-7 px-3 data-[state=active]:bg-background">
                    <Bug className="h-4 w-4 mr-2" />
                    Logs
                  </TabsTrigger>
                  <TabsTrigger value="assistant" className="h-7 px-3 data-[state=active]:bg-background">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    AI Assistant
                  </TabsTrigger>
                  <TabsTrigger value="history" className="h-7 px-3 data-[state=active]:bg-background">
                    <History className="h-4 w-4 mr-2" />
                    History
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggle}>
          {collapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-1 overflow-hidden"
          >
            <div className="h-full">
              {activeTab === "flowchart" && <FlowChart />}
              {activeTab === "terminal" && <TerminalView />}
              {activeTab === "logs" && <LogsView />}
              {activeTab === "assistant" && <AiAssistant />}
              {activeTab === "history" && (
                <div className="h-full flex items-center justify-center text-muted-foreground">Automation History</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
