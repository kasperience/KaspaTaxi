#!/bin/bash
# Script to commit changes to the server branch

# Make sure we're on the server branch
git checkout server || { echo "Failed to checkout server branch"; exit 1; }

# Add all changes
git add .

# Commit with the detailed message
git commit -F COMMIT_MESSAGE.md

echo "Changes committed to server branch"
echo "You can now push this branch to GitHub with:"
echo "git push -u origin server"
