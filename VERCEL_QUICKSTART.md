# 🚀 Vercel Deployment - Quick Start

## 1-Minute Setup

### Prerequisites
- [ ] WalletConnect Project ID from https://cloud.walletconnect.com (free, 2 min)
- [ ] Vercel account from https://vercel.com/signup (free)

### Deploy Now

**Option 1: Automated Setup (Recommended)**
```bash
# Windows PowerShell
.\setup-vercel.ps1

# Linux/Mac
chmod +x setup-vercel.sh
./setup-vercel.sh
```

**Option 2: Manual Setup**

1. **Configure Environment**
   ```bash
   # Copy and edit .env.local
   cp .env.example .env.local
   # Add your WalletConnect Project ID
   ```

2. **Test Build**
   ```bash
   npm install
   npm run build
   ```

3. **Deploy**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel
   ```

4. **Add Environment Variables in Vercel Dashboard**
   - Go to Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` = your_project_id
     - `NEXT_PUBLIC_APP_URL` = https://your-app.vercel.app
     - `NEXT_PUBLIC_CHAIN_ID` = 421614

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Required Environment Variables

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Your Project ID | https://cloud.walletconnect.com |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL | After first deployment |
| `NEXT_PUBLIC_CHAIN_ID` | `421614` | Pre-configured |

## Optional Variables

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Better RPC performance | https://www.alchemy.com/ |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Analytics | https://analytics.google.com/ |

## Troubleshooting

### Build Fails
```bash
npm install
npm run build
# Fix any errors, then redeploy
```

### Wallet Connection Fails
1. Check WalletConnect Project ID is correct
2. Add your Vercel domain to WalletConnect allowed origins
3. Verify `NEXT_PUBLIC_APP_URL` matches your Vercel URL

### Environment Variables Not Working
1. Add them in Vercel Dashboard (Settings → Environment Variables)
2. Redeploy: Go to Deployments → Click "..." → Redeploy

## Quick Commands

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# View logs
vercel logs

# Pull env variables
vercel env pull
```

## What's Deployed?

✅ Next.js 15 frontend  
✅ RainbowKit wallet integration  
✅ ZK proof verification UI  
✅ Compliance dashboard  
✅ Analytics page  
✅ RWA portal  

❌ Smart contracts (already deployed on Arbitrum Sepolia)  
❌ Circuits (not needed for frontend)  

## Post-Deployment

1. **Test your app**: Visit your Vercel URL
2. **Connect wallet**: Use RainbowKit to connect
3. **Verify it works**: Try the verification flow
4. **Share**: Your app is live! 🎉

## Support

- **Full Guide**: See `DEPLOY_VERCEL.md`
- **Vercel Docs**: https://vercel.com/docs
- **Issues**: Check Vercel deployment logs

---

**Estimated Time**: 5-10 minutes  
**Cost**: Free (Vercel Hobby plan)  
**Difficulty**: Easy ⭐
