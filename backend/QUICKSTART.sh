#!/bin/bash

# Quick Start Guide for LeetCode Integration
# This script helps you set up and test the LeetCode integration

echo "🚀 DSA Tracker - LeetCode Integration Setup"
echo "==========================================="
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 2: Check environment
echo "🔍 Step 2: Checking environment..."
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "Please create .env with DATABASE_URL"
    exit 1
fi
echo "✅ .env file found"
echo ""

# Step 3: Test database connection
echo "🗄️  Step 3: Testing database connection..."
npm run dev &
SERVER_PID=$!
sleep 3
if curl -s http://localhost:5000/ | grep -q "DSA Tracker API"; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    kill $SERVER_PID
    exit 1
fi
kill $SERVER_PID
echo ""

# Step 4: Import choice
echo "📥 Step 4: Choose import option"
echo "1. Import all problems (15-30 mins) - RECOMMENDED FOR FIRST TIME"
echo "2. Import Easy problems only (2-5 mins)"
echo "3. Import Medium problems only (5-10 mins)"
echo "4. Import Hard problems only (3-8 mins)"
echo "5. Skip import (problems can be imported later)"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "⏳ Starting full import..."
        echo "⏳ This will take 15-30 minutes. You can stop with Ctrl+C"
        echo ""
        node migrate-problems.js all
        ;;
    2)
        echo ""
        echo "⏳ Importing Easy problems..."
        node migrate-problems.js easy
        ;;
    3)
        echo ""
        echo "⏳ Importing Medium problems..."
        node migrate-problems.js medium
        ;;
    4)
        echo ""
        echo "⏳ Importing Hard problems..."
        node migrate-problems.js hard
        ;;
    5)
        echo "Skipping import..."
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Check statistics with:"
echo "   node migrate-problems.js stats"
echo ""
echo "🚀 Start the server with:"
echo "   npm run dev"
echo ""
