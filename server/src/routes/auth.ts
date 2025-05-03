import express from 'express';
import { auth } from '../firebase-admin';

const router = express.Router();

// Verify a Firebase ID token
router.post('/verify-token', (req, res) => {
  (async () => {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ error: 'ID token is required' });
      }

      // Verify the ID token
      const decodedToken = await auth.verifyIdToken(idToken);

      // Return the user information
      return res.status(200).json({
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture,
      });
    } catch (error) {
      console.error('Error verifying ID token:', error);
      return res.status(401).json({ error: 'Invalid ID token' });
    }
  })();
});

// Create a custom token for a user
router.post('/create-custom-token', (req, res) => {
  (async () => {
    try {
      const { uid } = req.body;

      if (!uid) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Create a custom token
      const customToken = await auth.createCustomToken(uid);

      return res.status(200).json({ customToken });
    } catch (error) {
      console.error('Error creating custom token:', error);
      return res.status(500).json({ error: 'Failed to create custom token' });
    }
  })();
});

// Get user by ID
router.get('/user/:uid', (req, res) => {
  (async () => {
    try {
      const { uid } = req.params;

      // Get the user
      const userRecord = await auth.getUser(uid);

      return res.status(200).json({
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
      });
    } catch (error) {
      console.error('Error getting user:', error);
      return res.status(404).json({ error: 'User not found' });
    }
  })();
});

export default router;
