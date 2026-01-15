#!/bin/bash

# DevOrb Setup Script
# ====================
# Automated installation for DevOrb desktop companion

set -e

echo "🔮 DevOrb Setup Script"
echo "======================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=macOS;;
    MINGW*|MSYS*|CYGWIN*)     MACHINE=Windows;;
    *)          MACHINE="UNKNOWN"
esac

echo "Detected OS: $MACHINE"
echo ""

# 1. Check/Install Rust
print_step "Checking Rust installation..."

if command -v cargo &> /dev/null; then
    RUST_VERSION=$(rustc --version)
    print_success "Rust is installed: $RUST_VERSION"
else
    print_warning "Rust not found. Installing..."
    
    if [ "$MACHINE" = "Windows" ]; then
        print_error "On Windows, please install Rust manually from: https://rustup.rs"
        print_error "After installation, restart this script."
        exit 1
    else
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source "$HOME/.cargo/env"
        print_success "Rust installed successfully!"
    fi
fi

# 2. Check/Install Node.js
print_step "Checking Node.js installation..."

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+ from: https://nodejs.org"
    exit 1
fi

# 3. Check npm
print_step "Checking npm installation..."

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
else
    print_error "npm not found. Please install Node.js with npm."
    exit 1
fi

# 4. Install system dependencies (macOS/Linux)
print_step "Checking system dependencies..."

if [ "$MACHINE" = "macOS" ]; then
    # macOS - check for Xcode Command Line Tools
    if xcode-select -p &> /dev/null; then
        print_success "Xcode Command Line Tools installed"
    else
        print_warning "Installing Xcode Command Line Tools..."
        xcode-select --install
        echo "Please complete the Xcode installation and re-run this script."
        exit 1
    fi
elif [ "$MACHINE" = "Linux" ]; then
    # Linux - check for required libraries
    print_warning "Please ensure you have the following packages installed:"
    echo "  - libwebkit2gtk-4.1-dev (or libwebkit2gtk-4.0-dev)"
    echo "  - libappindicator3-dev"
    echo "  - librsvg2-dev"
    echo "  - patchelf"
    echo ""
    echo "On Ubuntu/Debian: sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf"
    echo "On Fedora: sudo dnf install webkit2gtk4.1-devel libappindicator-gtk3-devel librsvg2-devel"
    echo ""
fi

# 5. Install npm dependencies
print_step "Installing npm dependencies..."
npm install
print_success "npm dependencies installed"

# 6. Verify Tauri CLI
print_step "Verifying Tauri CLI..."
if npx tauri --version &> /dev/null; then
    TAURI_VERSION=$(npx tauri --version)
    print_success "Tauri CLI ready: $TAURI_VERSION"
else
    print_error "Tauri CLI verification failed"
    exit 1
fi

# 7. Create .env template if not exists
print_step "Setting up environment..."
if [ ! -f ".env" ]; then
    echo "# DevOrb Environment Variables" > .env
    echo "# Uncomment and add your OpenAI API key for LLM features" >> .env
    echo "# VITE_OPENAI_API_KEY=your-api-key-here" >> .env
    print_success "Created .env template"
else
    print_success ".env file already exists"
fi

echo ""
echo "========================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "========================================"
echo ""
echo "To run DevOrb in development mode:"
echo -e "  ${BLUE}npm run tauri dev${NC}"
echo ""
echo "To build for production:"
echo -e "  ${BLUE}npm run tauri build${NC}"
echo ""
echo "Optional: Add your OpenAI API key to .env for AI comments"
echo ""
