#!/bin/bash

# Script to commit and push changes to GitHub
# Usage: ./push-to-github.sh "Your commit message"

COMMIT_MESSAGE=${1:-"Update website"}

echo "📦 Staging all changes..."
git add -A

echo "💾 Committing changes..."
git commit -m "$COMMIT_MESSAGE"

echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Netlify will automatically deploy your changes."
else
    echo "❌ Push failed. Please check your GitHub authentication."
    echo "   You may need to:"
    echo "   1. Create the repository at https://github.com/new"
    echo "   2. Use a Personal Access Token for authentication"
fi
