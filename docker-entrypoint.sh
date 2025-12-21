#!/bin/sh
set -e

echo "Starting application..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set"
  exit 1
fi

echo "DATABASE_URL is set: yes"

# Run Prisma migrations - use --schema to bypass config file
echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Start the application
echo "Starting Node.js server..."
exec node dist/src/index.js
