# How to Push to GitHub

## The Problem
Git needs authentication to push to GitHub. You have two options:

## Option 1: Use Personal Access Token (Recommended)

### Step 1: Create GitHub Repository (if not done)
1. Go to: https://github.com/new
2. Repository name: `royal-saffron`
3. Click "Create repository"

### Step 2: Get Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Royal Saffron Project"
4. Select scope: **`repo`** (this gives full repository access)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

### Step 3: Push Your Code
Run this command:

```bash
cd ~/Desktop/royal_saffron
git push -u origin main
```

When prompted:
- **Username:** `jkdrughouse`
- **Password:** Paste your Personal Access Token (not your GitHub password)

### Step 4: Save Credentials (Optional - to avoid re-entering)

After successful push, you can save credentials:

```bash
git config credential.helper store
```

Then future pushes won't ask for credentials.

## Option 2: Use SSH (Alternative)

### Step 1: Generate SSH Key (if you don't have one)
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location
# Enter a passphrase (optional, but recommended)
```

### Step 2: Add SSH Key to GitHub
1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. Go to: https://github.com/settings/keys
3. Click "New SSH key"
4. Paste your public key
5. Click "Add SSH key"

### Step 3: Change Remote URL to SSH
```bash
cd ~/Desktop/royal_saffron
git remote set-url origin git@github.com:jkdrughouse/royal-saffron.git
```

### Step 4: Push
```bash
git push -u origin main
```

## Quick Check Commands

```bash
# Check current branch
git branch

# Check remote URL
git remote -v

# Check if you have commits
git log --oneline -5

# Try pushing
git push -u origin main
```

## After Successful Push

Once your code is on GitHub:
1. Go to Netlify: https://app.netlify.com
2. Connect your GitHub repository
3. Netlify will automatically deploy on every push!
