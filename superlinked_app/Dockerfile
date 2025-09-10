# Use Python 3.10 slim base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Update system dependencies and install required packages
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . ./superlinked_app

# Set Python path and application module path environment variables
ENV PYTHONPATH=/app
ENV APP_MODULE_PATH=superlinked_app
ENV WORKER_COUNT=4

# Expose port 8080 for Superlinked server
EXPOSE 8080

# Start Superlinked server
CMD ["python", "-m", "superlinked.server"]