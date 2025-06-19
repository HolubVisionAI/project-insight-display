FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN echo "DATABASE_URL is $DATABASE_URL"


# Run the application
#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000", "--app-dir", "."]
# Listen on Render's $PORT
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]
#CMD ["sleep", "infinity"]
