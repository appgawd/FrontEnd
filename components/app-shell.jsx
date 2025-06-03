"use client"

import { useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Toolbar } from "@/components/toolbar"
import { SidePanel } from "@/components/side-panel"
import { WorkspacePanel } from "@/components/workspace-panel"
import { PropertiesPanel } from "@/components/properties-panel"
import { BottomPanel } from "@/components/bottom-panel"
import { StatusBar } from "@/components/status-bar"
import { cn } from "@/lib/utils"

export function AppShell() {
  const [collapsed, setCollapsed] = useState({
    left: false,
    right: false,
    bottom: false,
  })

  const [activeTab, setActiveTab] = useState({
    workspace: "flowchart",
    bottom: "terminal",
  })

  const [selectedMachines, setSelectedMachines] = useState(null)
  const [currentView, setCurrentView] = useState("flowchart")

  const togglePanel = (panel) => {
    setCollapsed((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }))
  }

  const handleMachineSelectionChange = (selection) => {
    setSelectedMachines(selection)
  }

  const handleViewChange = (view) => {
    setCurrentView(view)
    setActiveTab((prev) => ({ ...prev, workspace: view }))
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <Toolbar />

      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={80} minSize={30}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              defaultSize={20}
              minSize={15}
              maxSize={30}
              className={cn("transition-all duration-300", collapsed.left && "min-w-[50px] max-w-[50px]")}
            >
              <SidePanel
                collapsed={collapsed.left}
                onToggle={() => togglePanel("left")}
                onMachineSelectionChange={handleMachineSelectionChange}
                onViewChange={handleViewChange}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={60}>
              <WorkspacePanel
                activeTab={activeTab.workspace}
                onTabChange={(tab) => setActiveTab((prev) => ({ ...prev, workspace: tab }))}
                selectedMachines={selectedMachines}
                currentView={currentView}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel
              defaultSize={20}
              minSize={15}
              maxSize={30}
              className={cn("transition-all duration-300", collapsed.right && "min-w-[50px] max-w-[50px]")}
            >
              <PropertiesPanel collapsed={collapsed.right} onToggle={() => togglePanel("right")} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={20}
          minSize={10}
          className={cn("transition-all duration-300", collapsed.bottom && "min-h-[40px] max-h-[40px]")}
        >
          <BottomPanel
            collapsed={collapsed.bottom}
            onToggle={() => togglePanel("bottom")}
            activeTab={activeTab.bottom}
            onTabChange={(tab) => setActiveTab((prev) => ({ ...prev, bottom: tab }))}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <StatusBar />
    </div>
  )
}
