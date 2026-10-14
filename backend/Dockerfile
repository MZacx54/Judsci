FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Fast production start: Run fast schema migrations and start Gunicorn with concurrency
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn jdpc_bauchi_api.wsgi:application --bind 0.0.0.0:8000 --workers 2 --threads 2 --timeout 120"]
