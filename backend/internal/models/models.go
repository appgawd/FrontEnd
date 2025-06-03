package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"
)

// JSONB type for PostgreSQL JSONB fields
type JSONB map[string]interface{}

func (j JSONB) Value() (driver.Value, error) {
	return json.Marshal(j)
}

func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = make(JSONB)
		return nil
	}
	
	bytes, ok := value.([]byte)
	if !ok {
		return nil
	}
	
	return json.Unmarshal(bytes, j)
}

// Machine represents a machine/device in the system
type Machine struct {
	ID           int       `json:"id" db:"id"`
	Name         string    `json:"name" db:"name"`
	Category     string    `json:"category" db:"category"`
	Manufacturer string    `json:"manufacturer" db:"manufacturer"`
	Model        string    `json:"model" db:"model"`
	Status       string    `json:"status" db:"status"`
	Metadata     JSONB     `json:"metadata" db:"metadata"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

// Sensor represents a sensor attached to a machine
type Sensor struct {
	ID        int       `json:"id" db:"id"`
	MachineID int       `json:"machine_id" db:"machine_id"`
	Name      string    `json:"name" db:"name"`
	Type      string    `json:"type" db:"type"`
	Unit      string    `json:"unit" db:"unit"`
	Status    string    `json:"status" db:"status"`
	Metadata  JSONB     `json:"metadata" db:"metadata"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// SensorReading represents a reading from a sensor
type SensorReading struct {
	ID        int       `json:"id" db:"id"`
	SensorID  int       `json:"sensor_id" db:"sensor_id"`
	Value     float64   `json:"value" db:"value"`
	Metadata  JSONB     `json:"metadata" db:"metadata"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// Alert represents an alert rule
type Alert struct {
	ID             int       `json:"id" db:"id"`
	Name           string    `json:"name" db:"name"`
	SensorID       int       `json:"sensor_id" db:"sensor_id"`
	Condition      string    `json:"condition" db:"condition"`
	ThresholdValue float64   `json:"threshold_value" db:"threshold_value"`
	Enabled        bool      `json:"enabled" db:"enabled"`
	Triggered      bool      `json:"triggered" db:"triggered"`
	Metadata       JSONB     `json:"metadata" db:"metadata"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
}

// Fleet represents a collection of machines
type Fleet struct {
	ID          int       `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Type        string    `json:"type" db:"type"`
	Category    string    `json:"category" db:"category"`
	Description string    `json:"description" db:"description"`
	Metadata    JSONB     `json:"metadata" db:"metadata"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// FleetMachine represents the many-to-many relationship between fleets and machines
type FleetMachine struct {
	FleetID   int       `json:"fleet_id" db:"fleet_id"`
	MachineID int       `json:"machine_id" db:"machine_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
