.PHONY: help dev-setup build run test clean docker-up docker-down migrate seed

# Default target
help:
	@echo "Available commands:"
	@echo "  dev-setup    - Set up development environment"
	@echo "  build        - Build the Go application"
	@echo "  run          - Run the application"
	@echo "  test         - Run tests"
	@echo "  clean        - Clean build artifacts"
	@echo "  docker-up    - Start Docker services"
	@echo "  docker-down  - Stop Docker services"
	@echo "  migrate      - Run database migrations"
	@echo "  seed         - Seed database with sample data"

# Development setup
dev-setup:
	@echo "Setting up development environment..."
	@cp .env.example .env
	@go mod tidy
	@docker-compose up -d postgres
	@sleep 5
	@make migrate
	@echo "Development environment ready!"

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

# Start Docker services
docker-up:
	@echo "Starting Docker services..."
	@docker-compose up -d

# Stop Docker services
docker-down:
	@echo "Stopping Docker services..."
	@docker-compose down

# Run database migrations
migrate:
	@echo "Running database migrations..."
	@docker-compose exec -T postgres psql -U postgres -d automation_platform -f /docker-entrypoint-initdb.d/001_initial_schema.sql || true

# Seed database with sample data
seed:
	@echo "Seeding database..."
	@echo "Please run the SQL seed script manually or implement seed command"
