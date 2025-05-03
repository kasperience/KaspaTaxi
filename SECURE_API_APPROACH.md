# Secure API Approach for KaspaTaxi

This document outlines the secure approach for handling API keys and sensitive operations in the KaspaTaxi application.

## Overview

To improve security, we've implemented a server-side approach for handling API keys and sensitive operations. This approach:

1. Keeps API keys on the server side, not in client-side code
2. Provides a secure proxy for third-party APIs (like MapTiler)
3. Adds authentication verification for all API requests
4. Centralizes data access through a secure API layer
5. Minimizes exposure of sensitive information in the frontend

## Implementation Details

### Server-Side Components

1. **Express Server**: A Node.js Express server that handles all API requests
2. **Firebase Admin SDK**: Server-side Firebase authentication and Firestore access
3. **API Proxies**: Secure proxies for third-party APIs like MapTiler
4. **Authentication Middleware**: Verifies Firebase ID tokens for all protected endpoints
5. **Environment Variables**: All API keys and sensitive configuration stored in server-side environment variables

### Client-Side Components

1. **API Services**: Client-side services that communicate with the server API
2. **Secure Hooks**: Updated React hooks that use the secure API services
3. **Token Management**: Automatic handling of Firebase ID tokens for authentication
4. **Minimal Firebase Config**: Only the minimum required Firebase configuration for authentication is kept in the frontend

## How It Works

1. The client authenticates with Firebase Authentication
2. The client receives an ID token from Firebase
3. The client includes this token in all API requests to the server
4. The server verifies the token with Firebase Admin SDK
5. The server performs the requested operation using server-side API keys
6. The server returns the result to the client

## Security Benefits

1. **API Key Protection**: API keys are never exposed in client-side code or network requests
2. **Authentication Verification**: All API requests are verified on the server side
3. **Centralized Access Control**: All data access is controlled through a single API layer
4. **Reduced Attack Surface**: Fewer opportunities for malicious users to access sensitive data
5. **Audit Trail**: Server-side logging of all API requests for security auditing
6. **Error Handling**: Improved error handling for authentication and API requests
7. **Separation of Concerns**: Clear separation between frontend UI and backend data access

## Implementation Steps

1. Set up an Express server with Firebase Admin SDK
2. Create secure API endpoints for authentication and data access
3. Implement token verification middleware
4. Create client-side API services to communicate with the server
5. Update React hooks and utilities to use the secure API services
6. Remove API keys from client-side environment variables
7. Update components to handle loading and error states
8. Test all functionality to ensure it works with the secure approach

## Usage Examples

### Authentication

```typescript
// Using the secure authentication hook
import { useAuthSecure } from '../hooks/useAuthSecure';

const MyComponent = () => {
  const { user, loading, error, signIn, signOut } = useAuthSecure();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={signIn}>Sign In</button>
      )}
    </div>
  );
};
```

### Data Access

```typescript
// Using the secure Firestore utilities
import { requestRide, updateRide } from '../utils/firebaseUtilsSecure';

// Request a ride
const handleRequestRide = async () => {
  try {
    const rideId = await requestRide({
      userId: user.uid,
      pickupCoords: pickupCoords,
      dropoffCoords: dropoffCoords,
      status: 'pending',
    });
    console.log('Ride requested:', rideId);
  } catch (error) {
    console.error('Error requesting ride:', error);
  }
};

// Update a ride
const handleUpdateRide = async () => {
  try {
    await updateRide(rideId, {
      status: 'accepted',
      driverId: driverId,
    });
    console.log('Ride updated');
  } catch (error) {
    console.error('Error updating ride:', error);
  }
};
```

### Map Integration

```typescript
// Using the secure MapTiler API
import { mapTilerAPI } from '../services/api';

const MapComponent = () => {
  const [mapStyle, setMapStyle] = useState(null);

  useEffect(() => {
    const loadMapStyle = async () => {
      try {
        const style = await mapTilerAPI.getMapStyle();
        setMapStyle(style);
      } catch (error) {
        console.error('Error loading map style:', error);
      }
    };
    loadMapStyle();
  }, []);

  // Render map with the loaded style
  return mapStyle ? <Map style={mapStyle} /> : <div>Loading map...</div>;
};
```

## Conclusion

By implementing this secure API approach, we've significantly improved the security of the KaspaTaxi application. API keys are now kept secure on the server side, and all sensitive operations are properly authenticated and authorized.

## Next Steps

1. **Continuous Monitoring**: Regularly monitor server logs for any suspicious activity
2. **Security Audits**: Conduct periodic security audits of the codebase
3. **Update Dependencies**: Keep all dependencies up to date to address security vulnerabilities
4. **User Education**: Educate users about security best practices
5. **Consider Further Improvements**: Explore additional security measures like rate limiting, CORS configuration, and more comprehensive logging

## References

- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/basics)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Web Security Cheat Sheet](https://cheatsheetseries.owasp.org/)
