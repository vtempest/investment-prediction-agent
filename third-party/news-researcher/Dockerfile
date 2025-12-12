FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt requirements-api.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir -r requirements-api.txt

# Copy application code
COPY . .

# Create output directory
RUN mkdir -p output/csv output/backtests

# Expose port
EXPOSE 8002

# Set environment variable
ENV PORT=8002

# Run the API server
CMD ["python", "api_server.py"]
