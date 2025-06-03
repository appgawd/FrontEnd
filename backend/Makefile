.PHONY: help build run test clean migrate seed dev

# Default target
help:
	@echo "Available commands:"
	@echo "  dev          - Start development server with auto-migration"
	@echo "  build        - Build the Go application"
	@echo "  run          - Run the application"
	@echo "  test         - Run tests"
	@echo "  clean        - Clean build artifacts"
	@echo "  migrate      - Run database migrations"
	@echo "  seed         - Seed database with sample data"

# Development server (runs migrations automatically)
dev:
	@echo "Starting development server..."
	@go run .

# Build the application
build:
	@echo "Building application..."
	@go build -o bin/automation-platform .

# Run the application
run:
	@echo "Starting application..."
	@go run .

# Run tests
test:
	@echo "Running tests..."
	@go test ./...

# Clean build artifacts
clean:
	@echo "Cleaning..."
	@rm -rf bin/
	@go clean

# Run database migrations manually
migrate:
	@echo "Running database migrations..."
	@echo "Migrations run automatically when starting the server"

# Seed database with sample data
seed:
	@echo "Use the SQL seed script to populate the database"
	@echo "Run: psql \$$NEON_NEON_DATABASE_URL -f seed.sql"
