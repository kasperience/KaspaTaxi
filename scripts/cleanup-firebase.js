/**
 * This script helps with cleaning up Firebase configuration from the frontend
 * after migrating to the secure backend approach.
 *
 * Usage: node scripts/cleanup-firebase.js
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Define the files to check
const FILES_TO_CHECK = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'src/firebase.ts',
  'src/hooks/useAuth.ts',
  'src/utils/firebaseUtils.ts'
];

// Function to check for Firebase configuration in a file
const checkFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { exists: false, message: 'File does not exist' };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const matches = [];

    // Check for environment variables
    FIREBASE_ENV_VARS.forEach(envVar => {
      const regex = new RegExp(`${envVar}\\s*=\\s*["']?([^"'\\s]+)["']?`, 'i');
      lines.forEach((line, index) => {
        if (regex.test(line)) {
          matches.push({ line: index + 1, content: line.trim() });
        }
      });
    });

    // Check for Firebase imports and configuration
    const firebaseRegex = /firebase|firestore|auth/i;
    lines.forEach((line, index) => {
      if (firebaseRegex.test(line) && !line.includes('Secure') && !line.includes('// SAFE:')) {
        matches.push({ line: index + 1, content: line.trim() });
      }
    });

    return {
      exists: true,
      matches,
      message: matches.length > 0 ? `Found ${matches.length} potential Firebase references` : 'No Firebase references found'
    };
  } catch (error) {
    return { exists: true, error: error.message };
  }
};

// Function to create a backup of a file
const backupFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, message: 'File does not exist' };
    }

    const backupPath = `${filePath}.bak`;
    fs.copyFileSync(filePath, backupPath);
    return { success: true, backupPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Function to update firebase.ts to use minimal configuration
const updateFirebaseConfig = () => {
  const filePath = 'src/firebase.ts';
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, message: 'File does not exist' };
    }

    // Create a backup
    const backup = backupFile(filePath);
    if (!backup.success) {
      return backup;
    }

    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');

    // Create a new minimal configuration
    const newContent = `// firebase.ts - UPDATED FOR SECURE API APPROACH
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Minimal configuration - no API keys exposed
// Full Firebase functionality is now handled by the secure backend API
const firebaseConfig = {
  apiKey: "MINIMAL_CONFIG_FOR_AUTH_ONLY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

// Initialize Firebase - only used for authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
`;

    // Write the new content
    fs.writeFileSync(filePath, newContent);
    return { success: true, message: 'Updated firebase.ts with minimal configuration' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Function to clean up environment variables
const cleanupEnvFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, message: 'File does not exist' };
    }

    // Create a backup
    const backup = backupFile(filePath);
    if (!backup.success) {
      return backup;
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
    return {
      success: true,
      message: `Cleaned up ${removed.length} environment variables from ${filePath}`,
      removed
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Main function
const main = async () => {
  console.log('Firebase Configuration Cleanup Tool');
  console.log('==================================');
  console.log('This tool will help you clean up Firebase configuration from the frontend');
  console.log('after migrating to the secure backend approach.');
  console.log('');
  console.log('The following files will be checked for Firebase configuration:');
  FILES_TO_CHECK.forEach(file => console.log(`- ${file}`));
  console.log('');
  console.log('The following environment variables will be removed:');
  FIREBASE_ENV_VARS.forEach(envVar => console.log(`- ${envVar}`));
  console.log('');

  // Check each file
  console.log('Checking files for Firebase configuration...');
  const results = {};
  FILES_TO_CHECK.forEach(file => {
    const result = checkFile(file);
    results[file] = result;

    if (result.exists) {
      console.log(`- ${file}: ${result.message}`);
      if (result.matches && result.matches.length > 0) {
        result.matches.forEach(match => {
          console.log(`  Line ${match.line}: ${match.content}`);
        });
      }
    } else {
      console.log(`- ${file}: ${result.message}`);
    }
  });

  console.log('');

  // Ask for confirmation
  rl.question('Do you want to proceed with the cleanup? (y/n) ', async (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('');
      console.log('Cleaning up Firebase configuration...');

      // Update firebase.ts
      console.log('Updating firebase.ts with minimal configuration...');
      const updateResult = updateFirebaseConfig();
      if (updateResult.success) {
        console.log(`- ${updateResult.message}`);
        console.log(`- Backup created at src/firebase.ts.bak`);
      } else {
        console.log(`- Error: ${updateResult.error || updateResult.message}`);
      }

      // Clean up environment files
      const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
      for (const file of envFiles) {
        if (fs.existsSync(file)) {
          console.log(`Cleaning up ${file}...`);
          const cleanupResult = cleanupEnvFile(file);
          if (cleanupResult.success) {
            console.log(`- ${cleanupResult.message}`);
            console.log(`- Backup created at ${file}.bak`);
            if (cleanupResult.removed && cleanupResult.removed.length > 0) {
              console.log('- Removed the following variables:');
              cleanupResult.removed.forEach(line => console.log(`  ${line}`));
            }
          } else {
            console.log(`- Error: ${cleanupResult.error || cleanupResult.message}`);
          }
        }
      }

      console.log('');
      console.log('Cleanup complete!');
      console.log('');
      console.log('Next steps:');
      console.log('1. Update your components to use the secure API');
      console.log('2. Test your application thoroughly');
      console.log('3. Deploy the server and client');
      console.log('');
      console.log('If you encounter any issues, you can restore the backups:');
      console.log('- src/firebase.ts.bak');
      envFiles.forEach(file => {
        if (fs.existsSync(`${file}.bak`)) {
          console.log(`- ${file}.bak`);
        }
      });
    } else {
      console.log('Cleanup cancelled.');
    }

    rl.close();
  });
};

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  rl.close();
});
