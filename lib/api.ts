const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

// Check if backend is available
async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
      method: "GET",
    })
    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    return false
  }
}

// Generic API call handler with fallback
async function handleApiCall<T>(apiCall: () => Promise<{ data: T }>): Promise<T> {
  try {
    const response = await apiCall()
    return response.data
  } catch (error) {
    // If backend is not available, throw a specific error
    if (error.code === "ECONNREFUSED" || error.message === "Network Error") {
      throw new Error("BACKEND_UNAVAILABLE")
    }
    throw error
  }
}

// Machines API
export const machinesApi = {
  getAll: async () => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/machines`)
      if (!response.ok) throw new Error("Failed to fetch machines")
      return response.json()
    })
  },

  getById: async (id: string) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/machines/${id}`)
      if (!response.ok) throw new Error("Failed to fetch machine")
      return response.json()
    })
  },

  create: async (machine: any) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/machines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(machine),
      })
      if (!response.ok) throw new Error("Failed to create machine")
      return response.json()
    })
  },

  update: async (id: string, machine: any) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/machines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(machine),
      })
      if (!response.ok) throw new Error("Failed to update machine")
      return response.json()
    })
  },

  delete: async (id: string) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/machines/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete machine")
      return response.json()
    })
  },
}

// Sensors API
export const sensorsApi = {
  getAll: async () => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/sensors`)
      if (!response.ok) throw new Error("Failed to fetch sensors")
      return response.json()
    })
  },

  getByMachineId: async (machineId: string) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/machines/${machineId}/sensors`)
      if (!response.ok) throw new Error("Failed to fetch machine sensors")
      return response.json()
    })
  },

  create: async (sensor: any) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/sensors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sensor),
      })
      if (!response.ok) throw new Error("Failed to create sensor")
      return response.json()
    })
  },

  getReadings: async (sensorId: string, limit = 100) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/sensors/${sensorId}/readings?limit=${limit}`)
      if (!response.ok) throw new Error("Failed to fetch sensor readings")
      return response.json()
    })
  },
}

// Alerts API
export const alertsApi = {
  getAll: async () => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/alerts`)
      if (!response.ok) throw new Error("Failed to fetch alerts")
      return response.json()
    })
  },

  create: async (alert: any) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alert),
      })
      if (!response.ok) throw new Error("Failed to create alert")
      return response.json()
    })
  },

  update: async (id: string, alert: any) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alert),
      })
      if (!response.ok) throw new Error("Failed to update alert")
      return response.json()
    })
  },

  delete: async (id: string) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete alert")
      return response.json()
    })
  },

  toggle: async (id: string) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/alerts/${id}/toggle`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to toggle alert")
      return response.json()
    })
  },
}

// Fleets API
export const fleetsApi = {
  getAll: async () => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/fleets`)
      if (!response.ok) throw new Error("Failed to fetch fleets")
      return response.json()
    })
  },

  create: async (fleet: any) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/fleets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fleet),
      })
      if (!response.ok) throw new Error("Failed to create fleet")
      return response.json()
    })
  },

  addMachine: async (fleetId: string, machineId: string) => {
    return handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/fleets/${fleetId}/machines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ machine_id: machineId }),
      })
      if (!response.ok) throw new Error("Failed to add machine to fleet")
      return response.json()
    })
  },
}

export { checkBackendHealth }
