Fix image paths in Markdown files for production deployment

This commit includes the following changes:

1. Updated deployment scripts (deploy.sh and deploy-ubuntu.sh) to automatically fix image paths in Markdown files
2. Added specific fixes for taxi-icon.png and qr-code.png paths
3. Added a placeholder in deploy.bat for Windows environments
4. Improved the deployment process to ensure images display correctly in production

These changes ensure that images referenced in Markdown files (like README.md) will display correctly in the production environment by changing paths from "src/assets/..." to "assets/...".
