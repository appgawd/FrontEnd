package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"automation-platform/internal/config"
	"automation-platform/internal/database"
	"automation-platform/internal/handlers"
	"automation-platform/internal/middleware"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Check if database URL is provided
	if cfg.DatabaseURL == "" {
		log.Fatal("NEON_NEON_DATABASE_URL environment variable is required")
	}

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	// Run migrations
	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	log.Println("Database connected and migrations completed successfully")

	// Initialize Gin router
	r := gin.Default()

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{
		"http://localhost:3000",
		"https://*.vercel.app",
	}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	// Middleware
	r.Use(middleware.Logger())
	r.Use(middleware.ErrorHandler())

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"service": "automation-platform-api",
			"version": "1.0.0",
		})
	})

	// Initialize handlers
	h := handlers.New(db)

	// API routes
	api := r.Group("/api/v1")
	{
		// Machine routes
		machines := api.Group("/machines")
		{
			machines.GET("", h.GetMachines)
			machines.GET("/:id", h.GetMachine)
			machines.POST("", h.CreateMachine)
			machines.PUT("/:id", h.UpdateMachine)
			machines.DELETE("/:id", h.DeleteMachine)
			machines.GET("/:id/sensors", h.GetMachineSensors)
		}

		// Sensor routes
		sensors := api.Group("/sensors")
		{
			sensors.GET("", h.GetSensors)
			sensors.GET("/:id", h.GetSensor)
			sensors.POST("", h.CreateSensor)
			sensors.PUT("/:id", h.UpdateSensor)
			sensors.DELETE("/:id", h.DeleteSensor)
			sensors.GET("/:id/readings", h.GetSensorReadings)
			sensors.POST("/:id/readings", h.CreateSensorReading)
		}

		// Alert routes
		alerts := api.Group("/alerts")
		{
			alerts.GET("", h.GetAlerts)
			alerts.GET("/:id", h.GetAlert)
			alerts.POST("", h.CreateAlert)
			alerts.PUT("/:id", h.UpdateAlert)
			alerts.DELETE("/:id", h.DeleteAlert)
		}

		// Fleet routes
		fleets := api.Group("/fleets")
		{
			fleets.GET("", h.GetFleets)
			fleets.GET("/:id", h.GetFleet)
			fleets.POST("", h.CreateFleet)
			fleets.PUT("/:id", h.UpdateFleet)
			fleets.DELETE("/:id", h.DeleteFleet)
			fleets.GET("/:id/machines", h.GetFleetMachines)
			fleets.POST("/:id/machines", h.AddMachineToFleet)
			fleets.DELETE("/:id/machines/:machine_id", h.RemoveMachineFromFleet)
		}
	}

	// Start server
	port := cfg.Port
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)
	log.Printf("API available at http://localhost:%s/api/v1", port)
	log.Printf("Health check at http://localhost:%s/health", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
