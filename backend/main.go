package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"automation-platform/internal/config"
	"automation-platform/internal/database"
	"automation-platform/internal/handlers"
	"automation-platform/internal/middleware"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Run migrations
	if err := database.RunMigrations(db); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Initialize Gin router
	r := gin.Default()

	// Add CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://*.vercel.app"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Add logging middleware
	r.Use(middleware.Logger())

	// Initialize handlers
	h := handlers.New(db)

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "automation-platform-api"})
	})

	// API routes
	api := r.Group("/api/v1")
	{
		// Machine routes
		api.GET("/machines", h.GetMachines)
		api.GET("/machines/:id", h.GetMachine)
		api.POST("/machines", h.CreateMachine)
		api.PUT("/machines/:id", h.UpdateMachine)
		api.DELETE("/machines/:id", h.DeleteMachine)

		// Sensor routes
		api.GET("/sensors", h.GetSensors)
		api.GET("/sensors/:id", h.GetSensor)
		api.GET("/machines/:id/sensors", h.GetMachineSensors)
		api.POST("/sensors", h.CreateSensor)
		api.PUT("/sensors/:id", h.UpdateSensor)
		api.DELETE("/sensors/:id", h.DeleteSensor)

		// Sensor readings routes
		api.GET("/sensors/:id/readings", h.GetSensorReadings)
		api.POST("/sensors/:id/readings", h.CreateSensorReading)

		// Alert routes
		api.GET("/alerts", h.GetAlerts)
		api.GET("/alerts/:id", h.GetAlert)
		api.POST("/alerts", h.CreateAlert)
		api.PUT("/alerts/:id", h.UpdateAlert)
		api.DELETE("/alerts/:id", h.DeleteAlert)

		// Fleet routes
		api.GET("/fleets", h.GetFleets)
		api.GET("/fleets/:id", h.GetFleet)
		api.POST("/fleets", h.CreateFleet)
		api.PUT("/fleets/:id", h.UpdateFleet)
		api.DELETE("/fleets/:id", h.DeleteFleet)
		api.GET("/fleets/:id/machines", h.GetFleetMachines)
		api.POST("/fleets/:id/machines/:machine_id", h.AddMachineToFleet)
		api.DELETE("/fleets/:id/machines/:machine_id", h.RemoveMachineFromFleet)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
