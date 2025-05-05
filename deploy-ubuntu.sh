#!/bin/bash
# Deployment script for KaspaTaxi on Ubuntu server

echo "Pulling latest changes from the server branch..."
git pull origin server

echo "Setting proper permissions..."
chmod -R 755 .

echo "Installing dependencies..."
npm install
cd server && npm install && cd ..

echo "Building both client and server..."
npm run build:all

echo "Copying built files to web server directory..."
# Make sure this runs with appropriate permissions
sudo cp -r dist/* /var/www/html3/

echo "Starting or restarting the application with PM2..."
pm2 start ecosystem.config.cjs

echo "Saving the PM2 configuration..."
pm2 save

echo "Deployment complete! KaspaTaxi is now running."
