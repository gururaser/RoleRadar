# RoleRadar Makefile
# English Makefile for RoleRadar project

.DEFAULT_GOAL := run

.PHONY: help install run run-cpu run-gpu run-backend run-frontend stop stop-backend stop-frontend clean logs status

# Show help message
help:
	@echo "RoleRadar - Available commands:"
	@echo "  install       - Interactive installation with CPU/GPU selection"
	@echo "  run           - Start all services (interactive mode selection if no active config)"
	@echo "  run-cpu       - Start all services with CPU mode"
	@echo "  run-gpu       - Start all services with GPU mode"
	@echo "  run-backend   - Start only backend services (superlinked + qdrant)"
	@echo "  run-frontend  - Start only frontend service"
	@echo "  stop          - Stop all services"
	@echo "  stop-backend  - Stop only backend services (superlinked + qdrant)"
	@echo "  stop-frontend - Stop only frontend service"
	@echo "  clean         - Stop services and remove containers/volumes"
	@echo "  logs          - Show logs from all services"
	@echo "  status        - Check service status"
	@echo "  help          - Show this help message"

# Install and setup the system with data loading
install:
	@echo "🚀 Starting RoleRadar installation..."
	@echo "🖥️  Please select processing mode:"
	@echo "  1) CPU mode (recommended for most systems)"
	@echo "  2) GPU mode (requires NVIDIA GPU and drivers)"
	@printf "Enter your choice (1 or 2): "; \
	read choice; \
	if [ "$$choice" = "2" ]; then \
		echo "🚀 Setting up GPU mode..."; \
		COMPOSE_FILE="docker-compose.gpu.yml"; \
	else \
		echo "🚀 Setting up CPU mode..."; \
		COMPOSE_FILE="docker-compose.cpu.yml"; \
	fi; \
	docker compose -f $$COMPOSE_FILE up -d --build --force-recreate --no-deps
	@echo "⏳ Waiting 30 seconds for services to start..."
	@sleep 30
	@echo "🔍 Checking if Qdrant collection exists..."
	@until curl -s http://localhost:6333/collections/default/exists 2>/dev/null | jq -e '.result.exists == true' >/dev/null 2>&1; do \
		echo "Waiting for collection to be available..."; \
		sleep 5; \
	done
	@echo "✅ Collection exists, starting data loading..."
	@echo "📊 Getting data loader configuration..."
	@RETRY_COUNT=0; \
	while [ $$RETRY_COUNT -lt 10 ]; do \
		DATA_LOADER_RESPONSE=$$(curl -s http://localhost:8080/data-loader/ 2>/dev/null); \
		if [ -n "$$DATA_LOADER_RESPONSE" ] && echo "$$DATA_LOADER_RESPONSE" | jq -e '.result' >/dev/null 2>&1; then \
			DATA_LOADER_NAME=$$(echo "$$DATA_LOADER_RESPONSE" | jq -r '.result | keys[0]'); \
			if [ -n "$$DATA_LOADER_NAME" ] && [ "$$DATA_LOADER_NAME" != "null" ]; then \
				echo "📝 Found data loader name: $$DATA_LOADER_NAME"; \
				break; \
			fi; \
		fi; \
		RETRY_COUNT=$$((RETRY_COUNT + 1)); \
		echo "Retry $$RETRY_COUNT/10: Getting data loader configuration..."; \
		sleep 3; \
	done; \
	if [ $$RETRY_COUNT -eq 10 ]; then \
		echo "❌ Failed to get data loader configuration after 10 attempts"; \
		exit 1; \
	fi; \
	echo "🔄 Starting data loading process..."; \
	RETRY_COUNT=0; \
	while [ $$RETRY_COUNT -lt 10 ]; do \
		LOAD_RESULT=$$(curl -s -X POST http://localhost:8080/data-loader/$$DATA_LOADER_NAME/run 2>/dev/null); \
		if [ -n "$$LOAD_RESULT" ] && ! echo "$$LOAD_RESULT" | grep -q "Not Found"; then \
			echo "✅ Data loading started successfully"; \
			break; \
		fi; \
		RETRY_COUNT=$$((RETRY_COUNT + 1)); \
		echo "Retry $$RETRY_COUNT/10: Starting data loading..."; \
		sleep 3; \
	done; \
	if [ $$RETRY_COUNT -eq 10 ]; then \
		echo "❌ Failed to start data loading after 10 attempts"; \
		exit 1; \
	fi
	@echo ""
	@echo "🎉 Installation completed successfully!"
	@echo "📊 System is ready to use."
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🌐 Superlinked API: http://localhost:8080"
	@echo "🗄️  Qdrant API: http://localhost:6333"

# Start all services with CPU mode
run-cpu:
	@echo "🚀 Starting RoleRadar with CPU mode..."
	@docker compose -f docker-compose.cpu.yml up -d
	@echo "✅ All services started successfully with CPU mode!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🌐 Superlinked API: http://localhost:8080"
	@echo "🗄️  Qdrant API: http://localhost:6333"

# Start all services with GPU mode
run-gpu:
	@echo "🚀 Starting RoleRadar with GPU mode..."
	@docker compose -f docker-compose.gpu.yml up -d
	@echo "✅ All services started successfully with GPU mode!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🌐 Superlinked API: http://localhost:8080"
	@echo "🗄️  Qdrant API: http://localhost:6333"

# Start all services (default)
run:
	@echo "🚀 Starting RoleRadar services..."
	@if [ -f "docker-compose.cpu.yml" ] && docker compose -f docker-compose.cpu.yml ps superlinked >/dev/null 2>&1; then \
		echo "Found running CPU configuration. Starting with CPU mode..."; \
		docker compose -f docker-compose.cpu.yml up -d; \
	elif [ -f "docker-compose.gpu.yml" ] && docker compose -f docker-compose.gpu.yml ps superlinked >/dev/null 2>&1; then \
		echo "Found running GPU configuration. Starting with GPU mode..."; \
		docker compose -f docker-compose.gpu.yml up -d; \
	else \
		echo "No active configuration found. Please select mode:"; \
		echo "  1) CPU mode (recommended for most systems)"; \
		echo "  2) GPU mode (requires NVIDIA GPU and drivers)"; \
		printf "Enter your choice (1 or 2): "; \
		read choice; \
		if [ "$$choice" = "2" ]; then \
			echo "🚀 Starting with GPU mode..."; \
			docker compose -f docker-compose.gpu.yml up -d; \
		else \
			echo "🚀 Starting with CPU mode..."; \
			docker compose -f docker-compose.cpu.yml up -d; \
		fi; \
	fi
	@echo "✅ All services started successfully!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🌐 Superlinked API: http://localhost:8080"
	@echo "🗄️  Qdrant API: http://localhost:6333"

# Start only backend services
run-backend:
	@echo "🚀 Starting RoleRadar backend services..."
	@if [ -f "docker-compose.cpu.yml" ] && docker compose -f docker-compose.cpu.yml ps superlinked >/dev/null 2>&1; then \
		echo "Using CPU configuration..."; \
		docker compose -f docker-compose.cpu.yml up -d qdrant superlinked; \
	elif [ -f "docker-compose.gpu.yml" ] && docker compose -f docker-compose.gpu.yml ps superlinked >/dev/null 2>&1; then \
		echo "Using GPU configuration..."; \
		docker compose -f docker-compose.gpu.yml up -d qdrant superlinked; \
	else \
		echo "❌ No active configuration found. Please run 'make install' first."; \
		exit 1; \
	fi
	@echo "✅ Backend services started successfully!"
	@echo "🌐 Superlinked API: http://localhost:8080"
	@echo "🗄️  Qdrant API: http://localhost:6333"

# Start only frontend service
run-frontend:
	@echo "🚀 Starting RoleRadar frontend service..."
	@if [ -f "docker-compose.cpu.yml" ] && docker compose -f docker-compose.cpu.yml ps frontend >/dev/null 2>&1; then \
		echo "Using CPU configuration..."; \
		docker compose -f docker-compose.cpu.yml up -d frontend; \
	elif [ -f "docker-compose.gpu.yml" ] && docker compose -f docker-compose.gpu.yml ps frontend >/dev/null 2>&1; then \
		echo "Using GPU configuration..."; \
		docker compose -f docker-compose.gpu.yml up -d frontend; \
	else \
		echo "❌ No active configuration found. Please run 'make install' first."; \
		exit 1; \
	fi
	@echo "✅ Frontend service started successfully!"
	@echo "🌐 Frontend: http://localhost:3000"

# Stop all services
stop:
	@echo "🛑 Stopping all RoleRadar services..."
	@docker compose -f docker-compose.cpu.yml down 2>/dev/null || true
	@docker compose -f docker-compose.gpu.yml down 2>/dev/null || true
	@echo "✅ All services stopped successfully!"

# Stop only backend services
stop-backend:
	@echo "🛑 Stopping RoleRadar backend services..."
	@docker compose -f docker-compose.cpu.yml stop qdrant superlinked 2>/dev/null || true
	@docker compose -f docker-compose.gpu.yml stop qdrant superlinked 2>/dev/null || true
	@echo "✅ Backend services stopped successfully!"

# Stop only frontend service
stop-frontend:
	@echo "🛑 Stopping RoleRadar frontend service..."
	@docker compose -f docker-compose.cpu.yml stop frontend 2>/dev/null || true
	@docker compose -f docker-compose.gpu.yml stop frontend 2>/dev/null || true
	@echo "✅ Frontend service stopped successfully!"

# Clean up - stop services and remove containers/volumes
clean:
	@echo "🧹 Cleaning up RoleRadar environment..."
	@docker compose -f docker-compose.cpu.yml down -v --remove-orphans --rmi local 2>/dev/null || true
	@docker compose -f docker-compose.gpu.yml down -v --remove-orphans --rmi local 2>/dev/null || true
	@echo "✅ Cleanup completed successfully!"

# Show logs from all services
logs:
	@echo "📋 Showing logs from all services..."
	@if docker compose -f docker-compose.cpu.yml ps >/dev/null 2>&1; then \
		docker compose -f docker-compose.cpu.yml logs -f; \
	elif docker compose -f docker-compose.gpu.yml ps >/dev/null 2>&1; then \
		docker compose -f docker-compose.gpu.yml logs -f; \
	else \
		echo "❌ No active services found. Please run 'make install' first."; \
	fi

# Check service status
status:
	@echo "📊 RoleRadar Service Status:"
	@echo "=============================="
	@if docker compose -f docker-compose.cpu.yml ps >/dev/null 2>&1; then \
		echo "Using CPU configuration:"; \
		docker compose -f docker-compose.cpu.yml ps; \
	elif docker compose -f docker-compose.gpu.yml ps >/dev/null 2>&1; then \
		echo "Using GPU configuration:"; \
		docker compose -f docker-compose.gpu.yml ps; \
	else \
		echo "❌ No active configuration found. Please run 'make install' first."; \
		exit 1; \
	fi
	@echo ""
	@echo "🔍 Health Check Results:"
	@echo "------------------------"
	@if curl -s http://localhost:3000 >/dev/null 2>&1; then \
		echo "✅ Frontend: HEALTHY (http://localhost:3000)"; \
	else \
		echo "❌ Frontend: UNAVAILABLE"; \
	fi
	@if curl -s http://localhost:8080/health >/dev/null 2>&1; then \
		echo "✅ Superlinked API: HEALTHY (http://localhost:8080)"; \
	else \
		echo "❌ Superlinked API: UNAVAILABLE"; \
	fi
	@if curl -s http://localhost:6333/collections >/dev/null 2>&1; then \
		echo "✅ Qdrant API: HEALTHY (http://localhost:6333)"; \
	else \
		echo "❌ Qdrant API: UNAVAILABLE"; \
	fi
