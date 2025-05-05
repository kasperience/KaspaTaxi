#!/bin/bash
# Deployment script for KaspaTaxi on Ubuntu server

echo "Pulling latest changes from the server branch..."
git pull origin server

echo "Setting proper permissions..."
chmod -R 755 .

echo "Removing old ecosystem config if it exists..."
rm -f ecosystem.config.js

echo "Cleaning up any existing PM2 processes..."
pm2 delete kaspataxi-4324 2>/dev/null || true
pm2 delete kaspataxi-server 2>/dev/null || true

echo "Installing dependencies..."
npm install
cd server && npm install && cd ..

echo "Building both client and server..."
npm run build:all

echo "Copying built files to web server directory..."
# Make sure this runs with appropriate permissions
sudo cp -r dist/* /var/www/html3/

echo "Fixing image paths in Markdown files..."
sudo sed -i 's|src="src/assets/taxi-icon.png"|src="assets/taxi-icon.png"|g' /var/www/html3/README.md
sudo sed -i 's|src="src/assets/qr-code.png"|src="assets/qr-code.png"|g' /var/www/html3/README.md
sudo sed -i 's|src="src/assets/|src="assets/|g' /var/www/html3/*.md

echo "Starting or restarting the application with PM2..."
# Try the ecosystem config first
pm2 start ecosystem.config.cjs || {
  echo "Ecosystem config failed, starting processes individually..."
  # Start the server directly
  cd server && pm2 start dist/index.js --name kaspataxi-server || echo "Failed to start server"
  cd ..

  # Start the client (not needed if using web server for static files)
  # pm2 start npm --name kaspataxi-client -- run start
}

echo "Saving the PM2 configuration..."
pm2 save

echo "Deployment complete! KaspaTaxi is now running."
