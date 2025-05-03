# KaspaTaxi

<div align="center">
  <img src="src/assets/taxi-icon.png" alt="KaspaTaxi Logo" width="100" height="100">
  <h1>KaspaTaxi</h1>
  <p><strong>Decentralized Ride-Booking leveraging Kaspa</strong></p>
</div>

## Deployment Options

KaspaTaxi offers two deployment approaches to suit different needs:

### Option 1: Client-Only Deployment (Simple)
- **Branch**: `main`
- **Description**: Simpler setup with all functionality in the client
- **Best for**: Quick demos, learning, and development
- **Security note**: API keys are stored in client-side code (not recommended for production)

### Option 2: Secure Server Deployment (Recommended for Production)
- **Branch**: `server`
- **Description**: Secure architecture with server-side API handling
- **Best for**: Production deployments and public-facing applications
- **Security benefits**: API keys are protected on the server side

## Choosing the Right Approach

- **For learning and development**: The client-only approach (main branch) is simpler to set up and understand
- **For production use**: The secure server approach (server branch) follows best practices for security
- **For contributing**: Please follow the secure approach for any production-ready contributions

## Getting Started

### Client-Only Approach (main branch)
```bash
# Clone the repository
git clone https://github.com/yourusername/KaspaTaxi.git
cd KaspaTaxi

# Install dependencies
npm install

# Set up environment variables in .env file
# (See .env.example for required variables)

# Run the development server
npm run dev
```

### Secure Server Approach (server branch)
```bash
# Clone the repository
git clone https://github.com/yourusername/KaspaTaxi.git
cd KaspaTaxi

# Switch to the server branch
git checkout server

# Install client dependencies
npm install

# Set up server
cd server
npm install
# Create .env file with API keys
cd ..

# Run both client and server
npm run dev:all
```

For more detailed instructions, see the full README in each branch.

## Security Considerations

We strongly recommend using the secure server approach (server branch) for any public or production deployment. The client-only approach exposes API keys in the client-side code, which poses security risks.

For more information on the security improvements in the server branch, see:
- [API_KEY_SECURITY.md](https://github.com/yourusername/KaspaTaxi/blob/server/API_KEY_SECURITY.md)
- [SECURE_API_APPROACH.md](https://github.com/yourusername/KaspaTaxi/blob/server/SECURE_API_APPROACH.md)
