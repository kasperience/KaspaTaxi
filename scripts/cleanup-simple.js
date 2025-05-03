/**
 * Simple cleanup script for removing API keys from frontend files
 * 
 * Usage: node scripts/cleanup-simple.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the environment variables to check for
const FIREBASE_ENV_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID',
  'VITE_MAPTILER_API_KEY'
];

// Define the files to clean up
const FILES_TO_CLEAN = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production'
];

// Function to create a backup of a file
const backupFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return false;
    }

    const backupPath = `${filePath}.bak`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`Created backup: ${backupPath}`);
    return true;
  } catch (error) {
    console.error(`Error creating backup of ${filePath}:`, error);
    return false;
  }
};

// Function to clean up environment variables
const cleanupEnvFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return;
    }

    // Create a backup
    if (!backupFile(filePath)) {
      return;
    }

    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split('\n');
    let newLines = [];
    let removed = [];

    // Process each line
    lines.forEach(line => {
      let shouldKeep = true;
      FIREBASE_ENV_VARS.forEach(envVar => {
        if (line.trim().startsWith(envVar)) {
          shouldKeep = false;
          removed.push(line.trim());
        }
      });

      if (shouldKeep) {
        newLines.push(line);
      }
    });

    // Add a comment about the secure approach
    newLines.push('');
    newLines.push('# Firebase configuration has been moved to the server');
    newLines.push('# See server/.env for API keys and configuration');

    // Write the new content
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`Cleaned up ${removed.length} environment variables from ${filePath}`);
    if (removed.length > 0) {
      console.log('Removed the following variables:');
      removed.forEach(line => console.log(`  ${line}`));
    }
  } catch (error) {
    console.error(`Error cleaning up ${filePath}:`, error);
  }
};

// Function to update firebase.ts to use minimal configuration
const updateFirebaseConfig = () => {
  const filePath = path.join(__dirname, '..', 'src', 'firebase.ts');
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return;
    }

    // Create a backup
    if (!backupFile(filePath)) {
      return;
    }

    // Create a new minimal configuration
    const newContent = `// firebase.ts - UPDATED FOR SECURE API APPROACH
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Minimal configuration - no API keys exposed
// Full Firebase functionality is now handled by the secure backend API
const firebaseConfig = {
  apiKey: "MINIMAL_CONFIG_FOR_AUTH_ONLY",
  authDomain: "kaspataxi.firebaseapp.com",
  projectId: "kaspataxi",
};

// Initialize Firebase - only used for authentication
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the Firestore instance to use in your components
export { db, auth };
`;

    // Write the new content
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${filePath} with minimal configuration`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
};

// Main function
const main = async () => {
  console.log('Firebase Configuration Cleanup Tool');
  console.log('==================================');
  console.log('This tool will clean up Firebase configuration from the frontend');
  console.log('after migrating to the secure backend approach.');
  console.log('');
  
  // Clean up environment files
  console.log('Cleaning up environment files...');
  FILES_TO_CLEAN.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    cleanupEnvFile(filePath);
  });
  
  // Update firebase.ts
  console.log('');
  console.log('Updating firebase.ts with minimal configuration...');
  updateFirebaseConfig();
  
  console.log('');
  console.log('Cleanup complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Update your components to use the secure API');
  console.log('2. Test your application thoroughly');
  console.log('3. Deploy the server and client');
};

// Run the main function
main().catch(error => {
  console.error('Error:', error);
});
