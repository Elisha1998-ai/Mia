# Use official Python runtime as a parent image
FROM python:3.10-slim

# Set work directory
WORKDIR /app

# Install system dependencies
# libpq-dev is required for psycopg2 (PostgreSQL adapter)
# gcc is often required for compiling python extensions
# curl is required for healthchecks
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --group appuser

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Change ownership of the app directory to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port 8000
EXPOSE 8000

# Run the application
# Using generic uvicorn command for production
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
