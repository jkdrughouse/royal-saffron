# Quick Start Guide - Push to GitHub & Auto-Deploy

## One-Time Setup

### 1. Create GitHub Repository

Open in browser: https://github.com/new

- **Repository name:** `royal-saffron`
- **Visibility:** Public or Private
- **DO NOT** check "Add a README file"
- Click **"Create repository"**

### 2. Push Code to GitHub

Run this command (you'll be prompted for credentials):

```bash
cd ~/Desktop/royal_saffron
git push -u origin main
```

**Authentication:**
- Username: `jkdrughouse`
- Password: Use a **Personal Access Token** (not your GitHub password)
  - Get token: https://github.com/settings/tokens
  - Click "Generate new token (classic)"
  - Select `repo` scope
  - Copy and use as password

### 3. Connect Netlify

1. Go to: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify
5. Select: `jkdrughouse/royal-saffron`
6. Click **"Deploy site"**

Build settings should auto-detect:
- Build command: `npm run build`
- Publish directory: `.next`

## Daily Usage - Push Updates

After making changes, use this script:

```bash
cd ~/Desktop/royal_saffron
./push-to-github.sh "Your commit message"
```

Or manually:

```bash
git add -A
git commit -m "Your commit message"
git push origin main
```

Netlify will **automatically deploy** within 1-2 minutes! 🚀

## Check Your Deployment

- Netlify Dashboard: https://app.netlify.com
- Your site URL will be: `https://your-site-name.netlify.app`
