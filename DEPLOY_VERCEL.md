# Vercel Deployment Guide for ArbShield

## Quick Deploy (3 Steps)

### Step 1: Get Your WalletConnect Project ID

1. Go to https://cloud.walletconnect.com
2. Sign up or log in (free account)
3. Click "Create New Project"
4. Give it a name (e.g., "ArbShield")
5. Copy your Project ID

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

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

# Add environment variables
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
vercel env add NEXT_PUBLIC_APP_URL

# Deploy to production
vercel --prod
```

### Step 3: Update Environment Variables

After deployment, update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL in the dashboard.

## Environment Variables

### Required
- `NEXT_PUBLIC_APP_URL` - Your Vercel URL
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - From WalletConnect
- `NEXT_PUBLIC_CHAIN_ID` - 421614 (Arbitrum Sepolia)

### Optional
- `NEXT_PUBLIC_ALCHEMY_API_KEY` - For better RPC performance
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics

## Troubleshooting

### Build Fails
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Wallet Connection Fails
1. Verify WalletConnect Project ID
2. Add Vercel domain to WalletConnect allowed origins
3. Check `NEXT_PUBLIC_APP_URL` matches your Vercel URL

## Support
- Vercel Docs: https://vercel.com/docs
- WalletConnect Docs: https://docs.walletconnect.com/
