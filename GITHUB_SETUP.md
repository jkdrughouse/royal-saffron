# GitHub and Netlify Auto-Deploy Setup Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `royal-saffron`
3. Description: "Royal Saffron E-commerce Website - Jhelum Kesar Co."
4. Set to **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push Your Code to GitHub

Run these commands in your terminal:

```bash
cd ~/Desktop/royal_saffron

# Push to GitHub (you'll be prompted for your GitHub username and password/token)
git push -u origin main
```

**Note:** If you get authentication errors, you may need to use a Personal Access Token instead of password:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` permissions
3. Use this token as your password when pushing

## Step 3: Connect Netlify to GitHub

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select the repository: `jkdrughouse/royal-saffron`
6. Configure build settings (should auto-detect):
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Base directory:** (leave empty)
   - **Node version:** 20 (set in Environment variables if needed)
7. Click "Deploy site"

## Step 4: Verify Auto-Deploy

After setup:
- Netlify will automatically deploy every time you push to the `main` branch
- You can also deploy manually from Netlify dashboard
- Pull requests will create preview deployments automatically

## Step 5: Set Up Automatic Pushes (Optional)

If you want to automatically push changes, you can create a git hook or use GitHub Desktop.

Alternatively, you can add this alias to your `.bashrc` or `.zshrc`:

```bash
alias git-push-all='git add -A && git commit -m "Update" && git push origin main'
```

Then use `git-push-all` to commit and push all changes.

## Environment Variables (if needed)

If you need to set environment variables for Netlify:
1. Go to Site settings → Environment variables
2. Add any variables like:
   - `NEXT_PUBLIC_WHATSAPP_PHONE=919876543210`

## Troubleshooting

- **Push fails:** Make sure the GitHub repo exists and you have access
- **Netlify build fails:** Check build logs in Netlify dashboard
- **Authentication issues:** Use Personal Access Token instead of password
