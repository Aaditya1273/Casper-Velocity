# Vercel Deployment Guide for ArbShield

This guide will help you deploy ArbShield to Vercel in minutes.

## Prerequisites

1. A Vercel account (free tier works fine) - [Sign up here](https://vercel.com/signup)
2. A WalletConnect Project ID (free) - [Get it here](https://cloud.walletconnect.com)
3. (Optional) An Alchemy API key for better RPC performance - [Get it here](https://www.alchemy.com/)

---

## Quick Deploy (3 Steps)

### Step 1: Get Your WalletConnect Project ID

1. Go to https://cloud.walletconnect.com
2. Sign up or log in (free account)
3. Click "Create New Project"
4. Give it a name (e.g., "ArbShield")
5. Copy your Project ID (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. Add Environment Variables:
   ```
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_CHAIN_ID=421614
   ```

5. Click "Deploy"

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? arbshield (or your choice)
# - Directory? ./ (press Enter)
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# Paste your WalletConnect Project ID

vercel env add NEXT_PUBLIC_APP_URL
# Enter: https://your-app-name.vercel.app

# Deploy to production
vercel --prod
```

### Step 3: Update Environment Variables

After your first deployment, you'll get a Vercel URL (e.g., `arbshield.vercel.app`).

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL:
   ```
   NEXT_PUBLIC_APP_URL=https://arbshield.vercel.app
   ```
4. Click "Save"
5. Redeploy (Vercel will auto-redeploy on the next git push)

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | `https://arbshield.vercel.app` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Project ID | `a1b2c3d4e5f6...` |
| `NEXT_PUBLIC_CHAIN_ID` | Arbitrum Sepolia Chain ID | `421614` |

### Optional Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Alchemy RPC API key (improves performance) | https://www.alchemy.com/ |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID | https://analytics.google.com/ |

### Contract Addresses (Pre-configured)

These are already set in `lib/contracts.ts`. Only override if you deployed your own contracts:

- `NEXT_PUBLIC_ZK_VERIFIER`
- `NEXT_PUBLIC_GROTH16_VERIFIER`
- `NEXT_PUBLIC_COMPLIANCE_REGISTRY`
- `NEXT_PUBLIC_MOCK_BUIDL`
- `NEXT_PUBLIC_PASSKEY_REGISTRY`

---

## Vercel Configuration Files

### `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### `.vercelignore`

Excludes unnecessary files from deployment (contracts, circuits, build artifacts).

---

## Troubleshooting

### Build Fails with "Module not found"

**Solution**: Make sure all dependencies are in `package.json`:
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### "WalletConnect Project ID is invalid"

**Solution**: 
1. Verify your Project ID at https://cloud.walletconnect.com
2. Make sure it's added to Vercel environment variables
3. Redeploy after adding the variable

### App loads but wallet connection fails

**Solution**: 
1. Check that `NEXT_PUBLIC_APP_URL` matches your actual Vercel URL
2. Add your Vercel domain to WalletConnect allowed origins:
   - Go to https://cloud.walletconnect.com
   - Select your project
   - Add your Vercel URL to allowed origins

### Environment variables not updating

**Solution**: 
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Update the variable
3. Go to Deployments tab
4. Click "..." on latest deployment → "Redeploy"

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain (e.g., `arbshield.com`)
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain
5. Update WalletConnect allowed origins

---

## Performance Optimization

### Enable Edge Runtime (Optional)

Add to `app/layout.tsx`:
```typescript
export const runtime = 'edge';
```

### Enable Image Optimization

Vercel automatically optimizes images. No configuration needed!

### Enable Analytics

1. Go to Vercel Dashboard → Analytics
2. Enable Web Analytics (free)
3. View real-time performance metrics

---

## Monitoring

### Vercel Logs

View deployment and runtime logs:
```bash
vercel logs
```

Or in the dashboard: Deployments → Select deployment → View Logs

### Error Tracking

Consider adding Sentry for error tracking:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Continuous Deployment

Vercel automatically deploys on every git push:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches (e.g., `dev`, `staging`)

### Branch Deployments

```bash
# Create a preview deployment
git checkout -b feature/new-feature
git push origin feature/new-feature
# Vercel creates a preview URL automatically
```

---

## Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use Vercel Environment Variables** - Add secrets via dashboard
3. **Enable Vercel Authentication** (optional) - For staging environments
4. **Review deployment logs** - Check for exposed secrets
