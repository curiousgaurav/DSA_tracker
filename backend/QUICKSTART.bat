@echo off
REM Quick Start Guide for LeetCode Integration (Windows)
REM This script helps you set up and test the LeetCode integration

echo.
echo 🚀 DSA Tracker - LeetCode Integration Setup
echo ==========================================
echo.

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the backend directory
    exit /b 1
)

REM Step 1: Install dependencies
echo 📦 Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    exit /b 1
)
echo ✅ Dependencies installed
echo.

REM Step 2: Check environment
echo 🔍 Step 2: Checking environment...
if not exist ".env" (
    echo ❌ Error: .env file not found
    echo Please create .env with DATABASE_URL
    exit /b 1
)
echo ✅ .env file found
echo.

REM Step 3: Display options
echo 📥 Step 3: Choose import option
echo 1. Import all problems (15-30 mins) - RECOMMENDED FOR FIRST TIME
echo 2. Import Easy problems only (2-5 mins)
echo 3. Import Medium problems only (5-10 mins)
echo 4. Import Hard problems only (3-8 mins)
echo 5. Check statistics
echo 6. Skip and start server
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo.
    echo ⏳ Starting full import...
    echo ⏳ This will take 15-30 minutes. Press Ctrl+C to stop.
    echo.
    node migrate-problems.js all
    goto end
)

if "%choice%"=="2" (
    echo.
    echo ⏳ Importing Easy problems...
    node migrate-problems.js easy
    goto end
)

if "%choice%"=="3" (
    echo.
    echo ⏳ Importing Medium problems...
    node migrate-problems.js medium
    goto end
)

if "%choice%"=="4" (
    echo.
    echo ⏳ Importing Hard problems...
    node migrate-problems.js hard
    goto end
)

if "%choice%"=="5" (
    echo.
    echo 📊 Fetching statistics...
    node migrate-problems.js stats
    goto end
)

if "%choice%"=="6" (
    echo Skipping import and starting server...
    goto end
)

echo Invalid choice
exit /b 1

:end
echo.
echo ✅ Setup complete!
echo.
echo 📊 Additional commands:
echo    node migrate-problems.js stats    - View statistics
echo    node migrate-problems.js all      - Import all problems
echo    node migrate-problems.js easy     - Import Easy problems
echo    node migrate-problems.js medium   - Import Medium problems
echo    node migrate-problems.js hard     - Import Hard problems
echo.
echo 🚀 Start the server with:
echo    npm run dev
echo.
pause
