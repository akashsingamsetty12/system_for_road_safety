#!/bin/bash
cd "$(dirname "$0")"
echo ""
echo "===================================="
echo " Road Detection Mobile (Expo) Setup"
echo "===================================="
echo ""

cd frontend-mobile

echo "Installing dependencies..."
npm install

echo ""
echo "===================================="
echo " Setup Complete!"
echo "===================================="
echo ""
echo "To start the Expo app, run:"
echo "  npm start"
echo ""
echo "Then:"
echo "1. Scan QR code with Expo Go app"
echo "2. Or open the exp:// link in browser"
echo ""
echo "IMPORTANT: Update API URL in src/services/api.js"
echo "Replace 192.168.1.100 with your computer's IP address"
echo ""
echo "Find IP address:"
echo "  Mac/Linux: ifconfig | grep inet"
echo ""
