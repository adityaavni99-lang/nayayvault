#!/bin/bash

# NAYAYVAULT Setup Script

echo "" 
echo "╔═══════════════════════════════════════════════╗"
echo "║       NAYAYVAULT Setup & Installation        ║"
echo "║    Secure. Traceable. Trusted.               ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "✗ Node.js is not installed. Please install Node.js v16+"
    exit 1
fi
echo "✓ Node.js found: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "✗ npm is not installed"
    exit 1
fi
echo "✓ npm found: $(npm -v)"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠ PostgreSQL client not found. Make sure PostgreSQL server is running."
else
    echo "✓ PostgreSQL client found"
fi

echo ""
echo "Installing dependencies..."
echo ""

# Install root dependencies
echo "Installing backend dependencies..."
npm install

# Install client dependencies
echo ""
echo "Installing frontend dependencies..."
cd client
npm install
cd ..

echo ""
echo "✓ All dependencies installed"
echo ""

# Check .env file
if [ ! -f .env ]; then
    echo "⚠ .env file not found"
    echo ""
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env created - Please configure database credentials"
else
    echo "✓ .env file found"
fi

echo ""
echo "═══════════════════════════════════════════════"
echo "Setup Complete!"
echo "═══════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database credentials"
echo "2. Ensure PostgreSQL is running"
echo "3. Run: npm run dev (to start both backend and frontend)"
echo "   OR"
echo "   Run: npm run server (terminal 1 - backend only)"
echo "   Run: cd client && npm start (terminal 2 - frontend only)"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Demo Login Credentials:"
echo "  Investigator: INV-001 / password"
echo "  Judge:        JUD-001 / password"
echo "  Forensic:     FOR-001 / password"
echo "  Lawyer:       LAW-001 / password"
echo ""
