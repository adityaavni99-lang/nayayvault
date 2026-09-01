@echo off
REM NAYAYVAULT Setup Script for Windows

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║       NAYAYVAULT Setup ^& Installation        ║
echo ║    Secure. Traceable. Trusted.               ║
echo ╚═══════════════════════════════════════════════╝
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Node.js is not installed. Please install Node.js v16+
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js found: %NODE_VERSION%

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ npm is not installed
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✓ npm found: %NPM_VERSION%

echo.
echo Installing dependencies...
echo.

REM Install root dependencies
echo Installing backend dependencies...
call npm install

REM Install client dependencies
echo.
echo Installing frontend dependencies...
cd client
call npm install
cd ..

echo.
echo ✓ All dependencies installed
echo.

REM Check .env file
if not exist .env (
    echo ⚠ .env file not found
    echo.
    echo Creating .env file from template...
    copy .env.example .env
    echo ✓ .env created - Please configure database credentials
) else (
    echo ✓ .env file found
)

echo.
echo ═══════════════════════════════════════════════
echo Setup Complete!
echo ═══════════════════════════════════════════════
echo.
echo Next steps:
echo 1. Edit .env file with your database credentials
echo 2. Ensure PostgreSQL is running
echo 3. Run: npm run dev (to start both backend and frontend)
echo    OR
echo    Run: npm run server (terminal 1 - backend only)
echo    Run: cd client ^&^& npm start (terminal 2 - frontend only)
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Demo Login Credentials:
echo   Investigator: INV-001 / password
echo   Judge:        JUD-001 / password
echo   Forensic:     FOR-001 / password
echo   Lawyer:       LAW-001 / password
echo.
pause
