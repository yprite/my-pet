@echo off
REM DevOrb Run Script for Windows
REM ==============================

echo.
echo Starting DevOrb...
echo.

REM Check for cargo
where cargo >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Rust not found. Please run setup.bat first.
    pause
    exit /b 1
)

REM Check for node_modules
if not exist "node_modules" (
    echo [ERROR] Dependencies not installed. Please run setup.bat first.
    pause
    exit /b 1
)

REM Check mode argument
set MODE=%1
if "%MODE%"=="" set MODE=dev

if "%MODE%"=="build" (
    echo Building production version...
    call npm run tauri build
    echo.
    echo Build complete!
    echo Output: src-tauri\target\release\bundle\
) else (
    echo Running in development mode...
    call npm run tauri dev
)

pause
