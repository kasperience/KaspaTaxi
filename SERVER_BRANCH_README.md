# KaspaTaxi Server Branch

This branch implements a secure server-side approach for handling API keys and sensitive operations in the KaspaTaxi application.

## Why This Branch Exists

The main branch of KaspaTaxi had security vulnerabilities related to API key exposure in client-side code. This branch represents a significant architectural change to address these issues by implementing a secure server-side approach.

## Key Differences from Main Branch

1. **Server-Side API Key Storage**: All API keys are now stored securely on the server side
2. **Express Server**: Added an Express server to handle API requests securely
3. **Authentication**: Implemented proper token verification for all protected endpoints
4. **Secure API Architecture**: Created a clean separation between frontend UI and backend data access
5. **Documentation**: Added comprehensive documentation about the security improvements

## Using This Branch

This branch is intended to eventually replace the main branch after thorough testing. It represents a more secure approach to handling API keys and sensitive operations.

### Setup

1. Clone the repository
2. Checkout the server branch: `git checkout server`
3. Install dependencies: `npm install`
4. Set up the server:
   - Navigate to the server directory: `cd server`
   - Install server dependencies: `npm install`
   - Create a `.env` file with your API keys
   - Return to the main directory: `cd ..`
5. Run the development server: `npm run dev:all`

## Security Considerations

This branch follows industry best practices for API key security and sensitive operations. For more details, see:

- [API_KEY_SECURITY.md](API_KEY_SECURITY.md)
- [SECURE_API_APPROACH.md](SECURE_API_APPROACH.md)
- [SECURITY_UPDATES.md](SECURITY_UPDATES.md)

## Next Steps

1. Complete testing of all functionality
2. Address any issues or bugs
3. Merge this branch into main (or create a fresh repository)
4. Deploy the secure version to production
