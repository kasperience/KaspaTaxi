@echo off
REM Deployment script for KaspaTaxi

echo Pulling latest changes from the server branch...
git pull origin server

echo Installing dependencies...
call npm install
cd server && call npm install && cd ..

echo Building both client and server...
call npm run build:all

echo Copying files to production directory...
REM Add commands here if you need to copy files to a specific location

echo Starting or restarting the application with PM2...
call pm2 start ecosystem.config.cjs

echo Saving the PM2 configuration...
call pm2 save

echo Deployment complete! KaspaTaxi is now running.
