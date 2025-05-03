import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if we're already initialized
if (!admin.apps.length) {
  // Initialize the app with environment variables
  try {
    // For production, use service account credentials
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString()
      );
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    } 
    // For local development, use application default credentials
    else {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
    
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
  }
}

// Export the admin instance
export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
