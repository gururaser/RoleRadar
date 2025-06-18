# RoleRadar Makefile
# English Makefile for RoleRadar project

.PHONY: help install run stop clean logs status

# Default target
help:
	@echo "RoleRadar - Available commands:"
	@echo "  install    - Install and setup the entire system"
	@echo "  run        - Start all services"
	@echo "  stop       - Stop all services"
	@echo "  clean      - Stop services and remove containers/volumes"
	@echo "  logs       - Show logs from all services"
	@echo "  status     - Check service status"
	@echo "  help       - Show this help message"

# Install and setup the system
install:
	@echo "🚀 Starting RoleRadar installation..."
	@cd superlinked_app && docker-compose up -d --build --force-recreate --no-deps
	@echo "⏳ Waiting 30 seconds for services to start..."
	@sleep 30
	@echo "🔍 Checking if Qdrant collection exists..."
	@echo "Debug: Testing Qdrant connection..."
	@curl -s http://localhost:6333/collections/default/exists || echo "Connection failed"
	@echo ""
	@echo "Debug: Raw response from Qdrant:"
	@curl -s http://localhost:6333/collections/default/exists | cat -v
	@echo ""
	@until curl -s http://localhost:6333/collections/default/exists 2>/dev/null | jq -e '.result.exists == true' >/dev/null 2>&1; do \
		echo "Waiting for collection to be available..."; \
		echo "Current response: $$(curl -s http://localhost:6333/collections/default/exists 2>/dev/null)"; \
		sleep 5; \
	done
	@echo "✅ Collection exists, getting vector configuration..."
	@RETRY_COUNT=0; \
	while [ $$RETRY_COUNT -lt 10 ]; do \
		VECTOR_NAME=$$(curl -s http://localhost:6333/collections/default 2>/dev/null | jq -r '.result.config.params.vectors | keys[0]' 2>/dev/null); \
		if [ -n "$$VECTOR_NAME" ] && [ "$$VECTOR_NAME" != "null" ]; then \
			echo "📝 Found vector name: $$VECTOR_NAME"; \
			break; \
		fi; \
		RETRY_COUNT=$$((RETRY_COUNT + 1)); \
		echo "Retry $$RETRY_COUNT/10: Getting vector configuration..."; \
		sleep 3; \
	done; \
	if [ $$RETRY_COUNT -eq 10 ]; then \
		echo "❌ Failed to get vector configuration after 10 attempts"; \
		exit 1; \
	fi; \
	echo "🔧 Optimizing collection configuration..."; \
	RETRY_COUNT=0; \
	while [ $$RETRY_COUNT -lt 10 ]; do \
		PATCH_RESULT=$$(curl -s -X PATCH http://localhost:6333/collections/default \
			-H "Content-Type: application/json" \
			-d "{ \
				\"on_disk_payload\": true, \
				\"vectors\": { \
					\"$$VECTOR_NAME\": { \
						\"on_disk\": true, \
						\"datatype\": \"float16\" \
					} \
				}, \
				\"quantization_config\": { \
					\"binary\": { \
						\"always_ram\": true \
					} \
				}, \
				\"hnsw_config\": { \
					\"on_disk\": false \
				} \
			}" 2>/dev/null); \
		if echo "$$PATCH_RESULT" | jq -e '.result == true' >/dev/null 2>&1; then \
			echo "✅ Configuration updated successfully"; \
			break; \
		fi; \
		RETRY_COUNT=$$((RETRY_COUNT + 1)); \
		echo "Retry $$RETRY_COUNT/10: Updating configuration..."; \
		sleep 3; \
	done; \
	if [ $$RETRY_COUNT -eq 10 ]; then \
		echo "❌ Failed to update configuration after 10 attempts"; \
		exit 1; \
	fi
	@echo ""
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

# Start all services
run:
	@echo "🚀 Starting RoleRadar services..."
	@cd superlinked_app && docker-compose up -d
	@echo "✅ All services started successfully!"
	@echo "🌐 Superlinked API: http://localhost:8080"
	@echo "🗄️  Qdrant API: http://localhost:6333"

# Stop all services
stop:
	@echo "🛑 Stopping RoleRadar services..."
	@cd superlinked_app && docker-compose down
	@echo "✅ All services stopped successfully!"

# Clean up - stop services and remove containers/volumes
clean:
	@echo "🧹 Cleaning up RoleRadar environment..."
	@cd superlinked_app && docker-compose down -v --remove-orphans
	@echo "🗑️  Removing unused Docker resources..."
	@docker system prune -f
	@echo "✅ Cleanup completed successfully!"

# Show logs from all services
logs:
	@echo "📋 Showing logs from all services..."
	@cd superlinked_app && docker-compose logs -f

# Check service status
status:
	@echo "📊 RoleRadar Service Status:"
	@echo "=============================="
	@cd superlinked_app && docker-compose ps
	@echo ""
	@echo "🔍 Health Check Results:"
	@echo "------------------------"
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
