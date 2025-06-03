"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PropertiesPanelProps {
  collapsed: boolean
  onToggle: () => void
}

export function PropertiesPanel({ collapsed, onToggle }: PropertiesPanelProps) {
  return (
    <div className="h-full flex flex-col bg-background border-l border-border">
      <div className="flex items-center justify-between p-2 border-b border-border">
        <Button variant="ghost" size="icon" className="h-6 w-6 mr-auto" onClick={onToggle}>
          {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h2 className="text-sm font-medium">Properties</h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
            <Tabs defaultValue="properties" className="h-full flex flex-col">
              <TabsList className="grid grid-cols-2 mx-2 mt-2">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="styles">Styles</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 p-4">
                <TabsContent value="properties" className="mt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="node-name">Node Name</Label>
                    <Input id="node-name" defaultValue="Motion Detected" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="node-type">Node Type</Label>
                    <Input id="node-type" defaultValue="Trigger" readOnly />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enabled">Enabled</Label>
                      <Switch id="enabled" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="device">Device</Label>
                    <Input id="device" defaultValue="Hallway Camera" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sensitivity">Sensitivity</Label>
                    <Input id="sensitivity" type="number" defaultValue="75" />
                  </div>
                </TabsContent>

                <TabsContent value="styles" className="mt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="node-color">Node Color</Label>
                    <Input id="node-color" type="color" defaultValue="#4338ca" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="border-radius">Border Radius</Label>
                    <Input id="border-radius" type="number" defaultValue="8" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-icon">Show Icon</Label>
                      <Switch id="show-icon" defaultChecked />
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
