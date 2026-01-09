#!/bin/bash

# Script to commit and push changes to GitHub
# Usage: ./push-to-github.sh "Your commit message"

COMMIT_MESSAGE=${1:-"Update website"}

echo "📦 Staging all changes..."
git add -A

echo "💾 Committing changes..."
git commit -m "$COMMIT_MESSAGE"

echo "🚀 Pushing to GitHub..."
echo "   (You'll be prompted for your GitHub username and Personal Access Token)"

git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Netlify will automatically deploy your changes."
else
    echo ""
    echo "❌ Push failed. Here's how to fix it:"
    echo ""
    echo "1. Make sure the GitHub repository exists:"
    echo "   https://github.com/new (create 'royal-saffron')"
    echo ""
    echo "2. Get a Personal Access Token:"
    echo "   https://github.com/settings/tokens"
    echo "   - Click 'Generate new token (classic)'"
    echo "   - Select 'repo' scope"
    echo "   - Copy the token"
    echo ""
    echo "3. When prompted for password, paste the token"
    echo ""
    echo "4. Or set up SSH authentication (optional):"
    echo "   git remote set-url origin git@github.com:jkdrughouse/royal-saffron.git"
fi
