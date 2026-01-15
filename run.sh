#!/bin/bash

# DevOrb Run Script
# ==================

set -e

echo "🔮 Starting DevOrb..."
echo ""

# Source Rust environment
if [ -f "$HOME/.cargo/env" ]; then
    source "$HOME/.cargo/env"
fi

# Check if dependencies are installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust not found. Please run ./setup.sh first."
    exit 1
fi

if ! [ -d "node_modules" ]; then
    echo "❌ Dependencies not installed. Please run ./setup.sh first."
    exit 1
fi

# Check if port 5173 is already in use
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 5173 is already in use."
    echo -n "Kill existing process? (y/n): "
    read -r answer
    if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
        echo "Stopping existing process..."
        kill $(lsof -t -i:5173) 2>/dev/null || true
        sleep 1
    else
        echo "Please stop the existing process manually and try again."
        exit 1
    fi
fi

# Run mode: dev or build
MODE="${1:-dev}"

if [ "$MODE" = "build" ]; then
    echo "📦 Building production version..."
    npm run tauri build
    
    echo ""
    echo "✅ Build complete!"
    echo "📁 Output: src-tauri/target/release/bundle/"
else
    echo "🚀 Running in development mode..."
    npm run tauri dev
fi
