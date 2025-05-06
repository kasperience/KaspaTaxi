#!/bin/bash
# Improved deployment script for KaspaTaxi

echo "Pulling latest changes from the server branch..."
git pull origin server

echo "Installing dependencies..."
npm install
cd server && npm install && cd ..

echo "Building both client and server..."
npm run build:all

echo "Cleaning up any existing PM2 processes..."
pm2 delete kaspataxi-server 2>/dev/null || true

echo "Preparing server directory..."
# Remove old server directory if it exists
sudo rm -rf /var/www/html3/server

# Create fresh server directory
sudo mkdir -p /var/www/html3/server/routes

# Copy server files
sudo cp -r server/dist/* /var/www/html3/server/
sudo cp -r server/src/routes/* /var/www/html3/server/routes/
sudo cp server/package.json /var/www/html3/server/
sudo cp server/.env /var/www/html3/server/

# Set proper permissions
sudo chmod -R 755 /var/www/html3/server
sudo chmod 600 /var/www/html3/server/.env

# Install production dependencies
cd /var/www/html3/server
sudo npm install --production

echo "Copying client files..."
# Copy static files to the web root
sudo cp -r dist/* /var/www/html3/

echo "Starting the server with PM2..."
cd /var/www/html3/server
pm2 start index.js --name kaspataxi-server --update-env
cd ..

echo "Saving the PM2 configuration..."
pm2 save

echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "Deployment complete! KaspaTaxi is now running."
echo "Client: https://kaspataxi.kasperience.xyz"
echo "API: https://kaspataxi.kasperience.xyz/api"