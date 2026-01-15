@echo off
REM DevOrb Setup Script for Windows
REM ================================

echo.
echo ====================================
echo   DevOrb Setup Script (Windows)
echo ====================================
echo.

REM Check for Rust
where cargo >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Rust is installed
    cargo --version
) else (
    echo [!] Rust not found.
    echo.
    echo Please install Rust from: https://rustup.rs
    echo Download and run rustup-init.exe, then restart this script.
    echo.
    pause
    exit /b 1
)

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js is installed
    node --version
) else (
    echo [!] Node.js not found.
    echo Please install Node.js 18+ from: https://nodejs.org
    pause
    exit /b 1
)

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] npm is installed
    npm --version
) else (
    echo [!] npm not found.
    pause
    exit /b 1
)

echo.
echo Installing npm dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [!] npm install failed
    pause
    exit /b 1
)
echo [OK] npm dependencies installed

echo.
echo Verifying Tauri CLI...
call npx tauri --version
if %ERRORLEVEL% NEQ 0 (
    echo [!] Tauri CLI verification failed
    pause
    exit /b 1
)
echo [OK] Tauri CLI ready

REM Create .env if not exists
if not exist ".env" (
    echo # DevOrb Environment Variables > .env
    echo # VITE_OPENAI_API_KEY=your-api-key-here >> .env
    echo [OK] Created .env template
) else (
    echo [OK] .env file exists
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To run DevOrb:
echo   npm run tauri dev
echo.
echo To build for production:
echo   npm run tauri build
echo.
pause
