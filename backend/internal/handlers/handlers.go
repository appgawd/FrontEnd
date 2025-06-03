package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"automation-platform/internal/models"
)

type Handler struct {
	db *sql.DB
}

func New(db *sql.DB) *Handler {
	return &Handler{db: db}
}

// Machine handlers
func (h *Handler) GetMachines(c *gin.Context) {
	rows, err := h.db.Query(`
		SELECT id, name, category, manufacturer, model, status, metadata, created_at, updated_at 
		FROM machines ORDER BY created_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var machines []models.Machine
	for rows.Next() {
		var m models.Machine
		err := rows.Scan(&m.ID, &m.Name, &m.Category, &m.Manufacturer, &m.Model, &m.Status, &m.Metadata, &m.CreatedAt, &m.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		machines = append(machines, m)
	}

	c.JSON(http.StatusOK, gin.H{"data": machines})
}

func (h *Handler) GetMachine(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid machine ID"})
		return
	}

	var m models.Machine
	err = h.db.QueryRow(`
		SELECT id, name, category, manufacturer, model, status, metadata, created_at, updated_at 
		FROM machines WHERE id = $1
	`, id).Scan(&m.ID, &m.Name, &m.Category, &m.Manufacturer, &m.Model, &m.Status, &m.Metadata, &m.CreatedAt, &m.UpdatedAt)
	
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Machine not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": m})
}

func (h *Handler) CreateMachine(c *gin.Context) {
	var m models.Machine
	if err := c.ShouldBindJSON(&m); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.db.QueryRow(`
		INSERT INTO machines (name, category, manufacturer, model, status, metadata) 
		VALUES ($1, $2, $3, $4, $5, $6) 
		RETURNING id, created_at, updated_at
	`, m.Name, m.Category, m.Manufacturer, m.Model, m.Status, m.Metadata).Scan(&m.ID, &m.CreatedAt, &m.UpdatedAt)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": m})
}

func (h *Handler) UpdateMachine(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid machine ID"})
		return
	}

	var m models.Machine
	if err := c.ShouldBindJSON(&m); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = h.db.QueryRow(`
		UPDATE machines 
		SET name = $1, category = $2, manufacturer = $3, model = $4, status = $5, metadata = $6, updated_at = NOW()
		WHERE id = $7
		RETURNING id, name, category, manufacturer, model, status, metadata, created_at, updated_at
	`, m.Name, m.Category, m.Manufacturer, m.Model, m.Status, m.Metadata, id).Scan(
		&m.ID, &m.Name, &m.Category, &m.Manufacturer, &m.Model, &m.Status, &m.Metadata, &m.CreatedAt, &m.UpdatedAt)
	
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Machine not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": m})
}

func (h *Handler) DeleteMachine(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid machine ID"})
		return
	}

	result, err := h.db.Exec("DELETE FROM machines WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Machine not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Machine deleted successfully"})
}

// Sensor handlers
func (h *Handler) GetSensors(c *gin.Context) {
	rows, err := h.db.Query(`
		SELECT id, machine_id, name, type, unit, status, metadata, created_at, updated_at 
		FROM sensors ORDER BY created_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var sensors []models.Sensor
	for rows.Next() {
		var s models.Sensor
		err := rows.Scan(&s.ID, &s.MachineID, &s.Name, &s.Type, &s.Unit, &s.Status, &s.Metadata, &s.CreatedAt, &s.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		sensors = append(sensors, s)
	}

	c.JSON(http.StatusOK, gin.H{"data": sensors})
}

func (h *Handler) GetSensor(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sensor ID"})
		return
	}

	var s models.Sensor
	err = h.db.QueryRow(`
		SELECT id, machine_id, name, type, unit, status, metadata, created_at, updated_at 
		FROM sensors WHERE id = $1
	`, id).Scan(&s.ID, &s.MachineID, &s.Name, &s.Type, &s.Unit, &s.Status, &s.Metadata, &s.CreatedAt, &s.UpdatedAt)
	
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sensor not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": s})
}

func (h *Handler) GetMachineSensors(c *gin.Context) {
	machineID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid machine ID"})
		return
	}

	rows, err := h.db.Query(`
		SELECT id, machine_id, name, type, unit, status, metadata, created_at, updated_at 
		FROM sensors WHERE machine_id = $1 ORDER BY created_at DESC
	`, machineID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var sensors []models.Sensor
	for rows.Next() {
		var s models.Sensor
		err := rows.Scan(&s.ID, &s.MachineID, &s.Name, &s.Type, &s.Unit, &s.Status, &s.Metadata, &s.CreatedAt, &s.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		sensors = append(sensors, s)
	}

	c.JSON(http.StatusOK, gin.H{"data": sensors})
}

func (h *Handler) CreateSensor(c *gin.Context) {
	var s models.Sensor
	if err := c.ShouldBindJSON(&s); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.db.QueryRow(`
		INSERT INTO sensors (machine_id, name, type, unit, status, metadata) 
		VALUES ($1, $2, $3, $4, $5, $6) 
		RETURNING id, created_at, updated_at
	`, s.MachineID, s.Name, s.Type, s.Unit, s.Status, s.Metadata).Scan(&s.ID, &s.CreatedAt, &s.UpdatedAt)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": s})
}

func (h *Handler) UpdateSensor(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sensor ID"})
		return
	}

	var s models.Sensor
	if err := c.ShouldBindJSON(&s); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = h.db.QueryRow(`
		UPDATE sensors 
		SET machine_id = $1, name = $2, type = $3, unit = $4, status = $5, metadata = $6, updated_at = NOW()
		WHERE id = $7
		RETURNING id, machine_id, name, type, unit, status, metadata, created_at, updated_at
	`, s.MachineID, s.Name, s.Type, s.Unit, s.Status, s.Metadata, id).Scan(
		&s.ID, &s.MachineID, &s.Name, &s.Type, &s.Unit, &s.Status, &s.Metadata, &s.CreatedAt, &s.UpdatedAt)
	
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sensor not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": s})
}

func (h *Handler) DeleteSensor(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sensor ID"})
		return
	}

	result, err := h.db.Exec("DELETE FROM sensors WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sensor not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Sensor deleted successfully"})
}

// Sensor reading handlers
func (h *Handler) GetSensorReadings(c *gin.Context) {
	sensorID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sensor ID"})
		return
	}

	limit := c.DefaultQuery("limit", "100")
	
	rows, err := h.db.Query(`
		SELECT id, sensor_id, value, metadata, created_at 
		FROM sensor_readings 
		WHERE sensor_id = $1 
		ORDER BY created_at DESC 
		LIMIT $2
	`, sensorID, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var readings []models.SensorReading
	for rows.Next() {
		var r models.SensorReading
		err := rows.Scan(&r.ID, &r.SensorID, &r.Value, &r.Metadata, &r.CreatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		readings = append(readings, r)
	}

	c.JSON(http.StatusOK, gin.H{"data": readings})
}

func (h *Handler) CreateSensorReading(c *gin.Context) {
	sensorID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sensor ID"})
		return
	}

	var r models.SensorReading
	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	r.SensorID = sensorID

	err = h.db.QueryRow(`
		INSERT INTO sensor_readings (sensor_id, value, metadata) 
		VALUES ($1, $2, $3) 
		RETURNING id, created_at
	`, r.SensorID, r.Value, r.Metadata).Scan(&r.ID, &r.CreatedAt)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": r})
}

// Alert handlers
func (h *Handler) GetAlerts(c *gin.Context) {
	rows, err := h.db.Query(`
		SELECT id, name, sensor_id, condition, threshold_value, enabled, triggered, metadata, created_at, updated_at 
		FROM alerts ORDER BY created_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var alerts []models.Alert
	for rows.Next() {
		var a models.Alert
		err := rows.Scan(&a.ID, &a.Name, &a.SensorID, &a.Condition, &a.ThresholdValue, &a.Enabled, &a.Triggered, &a.Metadata, &a.CreatedAt, &a.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		alerts = append(alerts, a)
	}

	c.JSON(http.StatusOK, gin.H{"data": alerts})
}

func (h *Handler) GetAlert(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid alert ID"})
		return
	}

	var a models.Alert
	err = h.db.QueryRow(`
		SELECT id, name, sensor_id, condition, threshold_value, enabled, triggered, metadata, created_at, updated_at 
		FROM alerts WHERE id = $1
	`, id).Scan(&a.ID, &a.Name, &a.SensorID, &a.Condition, &a.ThresholdValue, &a.Enabled, &a.Triggered, &a.Metadata, &a.CreatedAt, &a.UpdatedAt)
	
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Alert not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": a})
}

func (h *Handler) CreateAlert(c *gin.Context) {
	var a models.Alert
	if err := c.ShouldBindJSON(&a); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.db.QueryRow(`
		INSERT INTO alerts (name, sensor_id, condition, threshold_value, enabled, triggered, metadata) 
		VALUES ($1, $2, $3, $4, $5, $6, $7) 
		RETURNING id, created_at, updated_at
	`, a.Name, a.SensorID, a.Condition, a.ThresholdValue, a.Enabled, a.Triggered, a.Metadata).Scan(&a.ID, &a.CreatedAt, &a.UpdatedAt)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": a})
}

func (h *Handler) UpdateAlert(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid alert ID"})
		return
	}

	var a models.Alert
	if err := c.ShouldBindJSON(&a); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = h.db.QueryRow(`
		UPDATE alerts 
		SET name = $1, sensor_id = $2, condition = $3, threshold_value = $4, enabled = $5, triggered = $6, metadata = $7, updated_at = NOW()
		WHERE id = $8
		RETURNING id, name, sensor_id, condition, threshold_value, enabled, triggered, metadata, created_at, updated_at
	`, a.Name, a.SensorID, a.Condition, a.ThresholdValue, a.Enabled, a.Triggered, a.Metadata, id).Scan(
		&a.ID, &a.Name, &a.SensorID, &a.Condition, &a.ThresholdValue, &a.Enabled, &a.Triggered, &a.Metadata, &a.CreatedAt, &a.UpdatedAt)
	
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Alert not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": a})
}

func (h *Handler) DeleteAlert(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid alert ID"})
		return
	}

	result, err := h.db.Exec("DELETE FROM alerts WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Alert not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Alert deleted successfully"})
}

// Fleet handlers
func (h *Handler) GetFleets(c *gin.Context) {
	rows, err := h.db.Query(`
		SELECT id, name, type, category, description, metadata, created_at, updated_at 
		FROM fleets ORDER BY created_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var fleets []models.Fleet
	for rows.Next() {
		var f models.Fleet
		err := rows.Scan(&f.ID, &f.Name, &f.Type, &f.Category, &f.Description, &f.Metadata, &f.CreatedAt, &f.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		fleets = append(fleets, f)
	}

	c.JSON(http.StatusOK, gin.H{"data": fleets})
}

func (h *Handler) GetFleet(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid fleet ID"})
		return
	}

	var f models.Fleet
	err = h.db.QueryRow(`
		SELECT id, name, type, category, description, metadata, created_at, updated_at 
		FROM fleets WHERE id = $1
	`, id).Scan(&f.ID, &f.Name, &f.Type, &f.Category, &f.Description, &f.Metadata, &f.CreatedAt, &f.UpdatedAt)
	
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Fleet not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": f})
}

func (h *Handler) CreateFleet(c *gin.Context) {
	var f models.Fleet
	if err := c.ShouldBindJSON(&f); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.db.QueryRow(`
		INSERT INTO fleets (name, type, category, description, metadata) 
		VALUES ($1, $2, $3, $4, $5) 
		RETURNING id, created_at, updated_at
	`, f.Name, f.Type, f.Category, f.Description, f.Metadata).Scan(&f.ID, &f.CreatedAt, &f.UpdatedAt)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": f})
}

func (h *Handler) UpdateFleet(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid fleet ID"})
		return
	}

	var f models.Fleet
	if err := c.ShouldBindJSON(&f); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = h.db.QueryRow(`
		UPDATE fleets 
		SET name = $1, type = $2, category = $3, description = $4, metadata = $5, updated_at = NOW()
		WHERE id = $6
		RETURNING id, name, type, category, description, metadata, created_at, updated_at
	`, f.Name, f.Type, f.Category, f.Description, f.Metadata, id).Scan(
		&f.ID, &f.Name, &f.Type, &f.Category, &f.Description, &f.Metadata, &f.CreatedAt, &f.UpdatedAt)
	
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Fleet not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": f})
}

func (h *Handler) DeleteFleet(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid fleet ID"})
		return
	}

	result, err := h.db.Exec("DELETE FROM fleets WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Fleet not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Fleet deleted successfully"})
}

func (h *Handler) GetFleetMachines(c *gin.Context) {
	fleetID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid fleet ID"})
		return
	}

	rows, err := h.db.Query(`
		SELECT m.id, m.name, m.category, m.manufacturer, m.model, m.status, m.metadata, m.created_at, m.updated_at 
		FROM machines m
		JOIN fleet_machines fm ON m.id = fm.machine_id
		WHERE fm.fleet_id = $1
		ORDER BY m.created_at DESC
	`, fleetID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var machines []models.Machine
	for rows.Next() {
		var m models.Machine
		err := rows.Scan(&m.ID, &m.Name, &m.Category, &m.Manufacturer, &m.Model, &m.Status, &m.Metadata, &m.CreatedAt, &m.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		machines = append(machines, m)
	}

	c.JSON(http.StatusOK, gin.H{"data": machines})
}

func (h *Handler) AddMachineToFleet(c *gin.Context) {
	fleetID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid fleet ID"})
		return
	}

	machineID, err := strconv.Atoi(c.Param("machine_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid machine ID"})
		return
	}

	_, err = h.db.Exec(`
		INSERT INTO fleet_machines (fleet_id, machine_id) 
		VALUES ($1, $2)
		ON CONFLICT (fleet_id, machine_id) DO NOTHING
	`, fleetID, machineID)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Machine added to fleet successfully"})
}

func (h *Handler) RemoveMachineFromFleet(c *gin.Context) {
	fleetID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid fleet ID"})
		return
	}

	machineID, err := strconv.Atoi(c.Param("machine_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid machine ID"})
		return
	}

	result, err := h.db.Exec("DELETE FROM fleet_machines WHERE fleet_id = $1 AND machine_id = $2", fleetID, machineID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Machine not found in fleet"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Machine removed from fleet successfully"})
}
