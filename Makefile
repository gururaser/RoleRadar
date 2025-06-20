# RoleRadar Makefile
# English Makefile for RoleRadar project

.DEFAULT_GOAL := run

.PHONY: help install run run-backend run-frontend stop stop-backend stop-frontend clean logs status

# Show help message
help:
	@echo "RoleRadar - Available commands:"
	@echo "  install       - Install and setup the system with data loading"
	@echo "  run           - Start all services (backend + frontend)"
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
	@docker compose up -d --build --force-recreate --no-deps
	@echo "⏳ Waiting 30 seconds for services to start..."
	@sleep 30
	@echo "🔍 Checking if Qdrant collection exists..."
	@until curl -s http://localhost:6333/collections/default/exists 2>/dev/null | grep -q '"exists":true'; do \
		echo "Waiting for collection to be available..."; \
		sleep 5; \
	done
	@echo "✅ Collection exists, starting data loading..."
	@echo "📊 Getting data loader configuration..."
	@RETRY_COUNT=0; \
	while [ $$RETRY_COUNT -lt 10 ]; do \
		DATA_LOADER_RESPONSE=$$(curl -s http://localhost:8080/data-loader/ 2>/dev/null); \
		if [ -n "$$DATA_LOADER_RESPONSE" ] && echo "$$DATA_LOADER_RESPONSE" | grep -q '"result"'; then \
			DATA_LOADER_NAME=$$(echo "$$DATA_LOADER_RESPONSE" | sed -n 's/.*"result":{\s*"\([^"]*\)".*/\1/p' | head -1); \
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

# Start all services (default)
run:
	@echo "🚀 Starting all RoleRadar services..."
	@docker compose up -d
	@echo "✅ All services started successfully!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🌐 Superlinked API: http://localhost:8080"
	@echo "🗄️  Qdrant API: http://localhost:6333"

# Start only backend services
run-backend:
	@echo "🚀 Starting RoleRadar backend services..."
	@docker compose up -d qdrant superlinked
	@echo "✅ Backend services started successfully!"
	@echo "🌐 Superlinked API: http://localhost:8080"
	@echo "🗄️  Qdrant API: http://localhost:6333"

# Start only frontend service
run-frontend:
	@echo "🚀 Starting RoleRadar frontend service..."
	@docker compose up -d frontend
	@echo "✅ Frontend service started successfully!"
	@echo "🌐 Frontend: http://localhost:3000"

# Stop all services
stop:
	@echo "🛑 Stopping all RoleRadar services..."
	@docker compose down
	@echo "✅ All services stopped successfully!"

# Stop only backend services
stop-backend:
	@echo "🛑 Stopping RoleRadar backend services..."
	@docker compose stop qdrant superlinked
	@echo "✅ Backend services stopped successfully!"

# Stop only frontend service
stop-frontend:
	@echo "🛑 Stopping RoleRadar frontend service..."
	@docker compose stop frontend
	@echo "✅ Frontend service stopped successfully!"

# Clean up - stop services and remove containers/volumes
clean:
	@echo "🧹 Cleaning up RoleRadar environment..."
	@docker compose down -v --remove-orphans
	@echo "🗑️  Removing unused Docker resources..."
	@docker system prune -f
	@echo "✅ Cleanup completed successfully!"

# Show logs from all services
logs:
	@echo "📋 Showing logs from all services..."
	@docker compose logs -f

# Check service status
status:
	@echo "📊 RoleRadar Service Status:"
	@echo "=============================="
	@docker compose ps
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
