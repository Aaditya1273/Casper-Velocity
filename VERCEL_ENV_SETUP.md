# Vercel Environment Variables Setup

## 🔐 Security Note
Your `.env.local` file contains sensitive keys (private keys, API keys) that should NEVER be deployed to Vercel or committed to git. It's already in `.gitignore` for safety.

## 📋 What to Add to Vercel

When deploying to Vercel, you only need these **PUBLIC** environment variables:

### Required Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_CHAIN_ID=421614
```

### Optional (Recommended)

```
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

## ⚠️ What NOT to Add to Vercel

These should ONLY be in your local `.env.local` (already in `.gitignore`):
- ❌ `PRIVATE_KEY` - Your wallet private key
- ❌ `ARBISCAN_API_KEY` - Only needed for local contract deployment
- ❌ `ARBITRUM_SEPOLIA_RPC` - Frontend uses public RPCs

## 📝 Step-by-Step

1. **Get WalletConnect Project ID**
   - Go to https://cloud.walletconnect.com
   - Create free account → New project
   - Copy Project ID

2. **Add to Vercel**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Settings → Environment Variables
   - Add each variable:
     - Name: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
     - Value: `your_project_id`
     - Environment: Production, Preview, Development (select all)
     - Click "Save"

3. **Update APP_URL**
   - After first deployment, you'll get a Vercel URL
   - Go back to Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` with your actual URL
   - Redeploy

## 🔍 Verify Setup

After adding variables, check:
- ✅ All variables start with `NEXT_PUBLIC_` (required for Next.js)
- ✅ No private keys or secrets
- ✅ WalletConnect Project ID is correct
- ✅ APP_URL matches your Vercel domain

## 🚀 Deploy

```bash
# After adding environment variables
vercel --prod
```

## 📚 Reference

See `.env.vercel` file for a clean template of what to add to Vercel.
