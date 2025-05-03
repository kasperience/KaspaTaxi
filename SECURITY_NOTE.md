# ⚠️ Security Notice for KaspaTaxi

## Important Security Information

This branch (`main`) contains a simplified implementation of KaspaTaxi that stores API keys in client-side code. While this approach is easier to set up and understand, it poses significant security risks for production deployments.

## Security Risks

1. **Exposed API Keys**: API keys are visible in the client-side code and network requests
2. **Potential for Abuse**: Exposed keys could be used by malicious actors
3. **No Access Control**: Limited ability to control who can use your API keys
4. **Billing Risks**: Potential for unexpected charges if keys are misused

## Secure Alternative Available

We have implemented a secure server-side approach in the `server` branch that addresses these security concerns. This approach:

1. Keeps API keys secure on the server side
2. Provides proper authentication and authorization
3. Follows web security best practices
4. Is recommended for production deployments

## When to Use This Branch

This branch is suitable for:
- Learning and understanding the basic functionality
- Local development and testing
- Demonstrations in controlled environments

## When to Use the Server Branch

The `server` branch is recommended for:
- Production deployments
- Public-facing applications
- Any scenario where security is a concern

## How to Switch to the Secure Approach

```bash
# Switch to the server branch
git checkout server

# Follow the setup instructions in the README
```

For more information on the security improvements, see the documentation in the server branch:
- [API_KEY_SECURITY.md](https://github.com/yourusername/KaspaTaxi/blob/server/API_KEY_SECURITY.md)
- [SECURE_API_APPROACH.md](https://github.com/yourusername/KaspaTaxi/blob/server/SECURE_API_APPROACH.md)
