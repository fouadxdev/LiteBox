#!/bin/bash

cleanup() {
    echo ""
    echo "🛑 Stopping Lite Box..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

ROOT_DIR=$(pwd)

echo "🔍 Checking Database Connection..."

# This command tries to connect to the DB via Prisma. 
# If it fails, the script stops here.

if ! cd "$ROOT_DIR/server" && npx prisma db pull --print > /dev/null 2>&1; then
    echo "❌ Error: Could not connect to the database."
    echo "Check if your Postgres service is running and your .env is correct."
    exit 1
fi

echo "✅ Database is online!"

echo "🚀 Starting Server..."
cd "$ROOT_DIR/server" && npm run dev &

sleep 2

echo "📦 Starting Client..."
cd "$ROOT_DIR/client" && npm run dev &

wait