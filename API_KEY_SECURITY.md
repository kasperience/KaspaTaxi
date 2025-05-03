# API Key Security in KaspaTaxi

This document outlines the approach we've taken to secure API keys in the KaspaTaxi application.

## The Problem

API keys are sensitive credentials that should never be exposed to the public. When building web applications, there's a risk of exposing API keys if they're included directly in frontend code. This can happen in several ways:

1. **Client-side code exposure**: API keys in JavaScript files can be viewed by anyone who inspects the code
2. **Environment variables leakage**: Frontend environment variables (like those prefixed with `VITE_`) are compiled into the build and accessible in the browser
3. **Network requests**: API keys included in client-side network requests are visible in browser developer tools
4. **Source code repositories**: API keys committed to public repositories can be scraped by bots

## Our Solution

We've implemented a secure server-side approach to handle API keys:

### 1. Server-Side API Key Storage

- All API keys are stored in server-side environment variables
- The `.env` file on the server contains sensitive credentials and is not committed to the repository
- Example server environment variables:
  ```
  PORT=3001
  MAPTILER_API_KEY=your_maptiler_key
  FIREBASE_API_KEY=your_firebase_key
  ```

### 2. API Proxies

- We've created secure proxy endpoints on our Express server for third-party APIs
- Example: MapTiler API proxy
  ```javascript
  // Server-side code
  app.get('/api/maptiler/style', async (req, res) => {
    try {
      const apiKey = process.env.MAPTILER_API_KEY;
      const url = `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`;
      const response = await axios.get(url);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error proxying request to MapTiler' });
    }
  });
  ```

### 3. Client-Side API Services

- The frontend uses API services that communicate with our secure server
- No API keys are included in these requests
- Example client-side code:
  ```javascript
  // Client-side code
  export const mapTilerAPI = {
    getMapStyle: async () => {
      const response = await fetch('/api/maptiler/style');
      return response.json();
    },
  };
  ```

### 4. Authentication and Authorization

- Protected endpoints require Firebase authentication
- The server verifies ID tokens before allowing access to sensitive operations
- Example authentication middleware:
  ```javascript
  // Server-side middleware
  const verifyToken = async (req, res, next) => {
    try {
      const idToken = req.headers.authorization?.split('Bearer ')[1];
      if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
  ```

### 5. Minimal Frontend Configuration

- Only the minimum required Firebase configuration is kept in the frontend
- This configuration is only used for authentication purposes
- Example minimal Firebase configuration:
  ```javascript
  // Minimal configuration for authentication
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  };
  ```

## Benefits of This Approach

1. **Enhanced Security**: API keys are never exposed in client-side code or network requests
2. **Centralized Control**: All API access is controlled through our secure server
3. **Simplified Frontend**: The frontend only needs to know about our server API, not third-party APIs
4. **Easier Key Rotation**: API keys can be updated on the server without changing the frontend
5. **Monitoring and Rate Limiting**: We can monitor API usage and implement rate limiting on the server

## Best Practices for API Key Security

1. **Never store API keys in frontend code**
2. **Use environment variables for server-side configuration**
3. **Implement proper authentication and authorization**
4. **Create proxy endpoints for third-party APIs**
5. **Regularly rotate API keys**
6. **Monitor API usage for suspicious activity**
7. **Implement rate limiting to prevent abuse**
8. **Use the principle of least privilege when granting API access**

## Conclusion

By implementing this secure approach to API key management, we've significantly improved the security of the KaspaTaxi application. API keys are now kept secure on the server side, and all sensitive operations are properly authenticated and authorized.

## References

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/basics)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
