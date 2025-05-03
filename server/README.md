# KaspaTaxi API Server

This is a simple Express server that handles API requests for the KaspaTaxi application. It provides a secure way to handle API keys and other sensitive information without exposing them in the client-side code.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory with the following content:
```
# Server environment variables
PORT=3001

# API Keys (these should never be exposed to the client)
MAPTILER_API_KEY=YOUR_MAPTILER_API_KEY
```

3. Replace `YOUR_MAPTILER_API_KEY` with your actual MapTiler API key.

## Development

To run the server in development mode:
```bash
npm run dev
```

This will start the server using ts-node, which allows you to make changes to the code without having to restart the server.

## Production

To build the server for production:
```bash
npm run build
```

This will compile the TypeScript code to JavaScript in the `dist` directory.

To run the server in production mode:
```bash
npm start
```

## API Endpoints

### MapTiler Style
- `GET /api/maptiler/style`: Returns the MapTiler style JSON with the API key included.

### MapTiler Resources
- `GET /api/maptiler/*`: Proxies requests to MapTiler API with the API key included.

### Health Check
- `GET /api/health`: Returns a simple health check response.
