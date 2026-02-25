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

# Start script: Run migrations, then population (idempotent), then start server
CMD ["sh", "-c", "python manage.py makemigrations --noinput && python manage.py migrate --noinput && python populate_all.py || echo 'Setup failed but continuing...'; gunicorn jdpc_bauchi_api.wsgi:application --bind 0.0.0.0:8000"]
