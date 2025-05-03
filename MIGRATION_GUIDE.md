# Migration Guide: Secure API Approach

This guide provides step-by-step instructions for migrating from the direct Firebase approach to the new secure API approach.

## Overview

We're moving from directly using Firebase in the frontend to a more secure approach where:

1. API keys are stored only on the server
2. All Firebase operations go through our secure Express server
3. Authentication is verified on the server side
4. No sensitive information is exposed in the frontend code

## Migration Steps

### 1. Server Setup

The server has already been set up with:
- Express server with Firebase Admin SDK
- Secure API endpoints for authentication and Firestore operations
- Proxy for MapTiler API

Make sure the server is running with:

```bash
cd server
npm run dev
```

### 2. Update Your Components

#### Authentication

Replace `useAuth` with `useAuthSecure`:

```typescript
// Before
import { useAuth } from '../hooks/useAuth';
const { user, signIn, signOut } = useAuth();

// After
import { useAuthSecure } from '../hooks/useAuthSecure';
const { user, loading, error, signIn, signOut } = useAuthSecure();

// Handle loading and error states
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

#### Firestore Operations

Replace direct Firestore operations with secure API calls:

```typescript
// Before
import { updateRide, requestRide } from '../utils/firebaseUtils';

// After
import { updateRide, requestRide } from '../utils/firebaseUtilsSecure';
```

The API signatures remain the same, so you don't need to change how you call these functions.

#### Map Integration

The map integration has been updated to use the secure MapTiler API proxy:

```typescript
// This is already handled in useMap.ts
// No changes needed in your components
```

### 3. Testing

Test each component after migration to ensure it works correctly with the secure API:

1. Authentication flow (sign in, sign out)
2. Firestore operations (create, read, update, delete)
3. Map integration

### 4. Cleanup

Once all components have been migrated and tested, run the cleanup script:

```bash
node scripts/cleanup-firebase.js
```

This script will:
1. Check for Firebase configuration in your files
2. Create backups of files that will be modified
3. Update `firebase.ts` to use minimal configuration
4. Remove sensitive environment variables from `.env` files

### 5. Final Verification

After cleanup, verify that:

1. The application still works correctly
2. No sensitive information is exposed in the frontend code
3. All Firebase operations go through the secure API

## Troubleshooting

### Authentication Issues

If you encounter authentication issues:

1. Check that the server is running
2. Verify that the Firebase project ID is correctly set in `server/.env`
3. Check the server logs for any errors
4. Ensure you're using `useAuthSecure` instead of `useAuth`

### Firestore Operation Issues

If Firestore operations fail:

1. Check that you're authenticated (the user is signed in)
2. Verify that the server has the correct permissions
3. Check the server logs for any errors
4. Ensure you're using the secure utilities from `firebaseUtilsSecure.ts`

### Map Issues

If the map doesn't load:

1. Check that the MapTiler API key is correctly set in `server/.env`
2. Verify that the server is running
3. Check the network tab in your browser's developer tools for any errors

## Rollback Plan

If you need to roll back to the direct Firebase approach:

1. Restore the backups created by the cleanup script
2. Revert to using the original hooks and utilities
3. Ensure the environment variables are correctly set in `.env` files

## Contact

If you have any questions or issues with the migration, please contact the development team.
