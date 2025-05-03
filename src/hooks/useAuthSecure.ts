// src/hooks/useAuthSecure.ts
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';
import { authAPI } from '../services/api';

export const useAuthSecure = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      try {
        if (currentUser) {
          // Get the ID token
          const idToken = await currentUser.getIdToken();
          
          // Verify the token with our backend
          const verifiedUser = await authAPI.verifyToken(idToken);
          
          // Set the user
          setUser({
            ...currentUser,
            // Add any additional properties from the backend
            ...verifiedUser,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      } catch (err) {
        console.error('Auth error:', err);
        setError(err instanceof Error ? err.message : 'Authentication error');
        setUser(null);
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign in with Firebase
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Verify the token with our backend
      await authAPI.verifyToken(idToken);
      
      // User will be set by the onAuthStateChanged listener
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Sign in failed');
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // User will be set to null by the onAuthStateChanged listener
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Sign out failed');
      setLoading(false);
    }
  };

  return { user, loading, error, signIn, signOut };
};
