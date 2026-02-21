# 🔑 Get Free Alchemy API Key (2 Minutes)

## Why You Need This

The public RPC endpoints are unreliable:
- ❌ BlockPI: 503 errors (overloaded)
- ❌ Official Arbitrum: DNS issues
- ✅ Alchemy: Reliable, fast, free tier

## 📝 Quick Setup (2 Minutes)

### Step 1: Sign Up for Alchemy

1. Go to: https://www.alchemy.com/
2. Click "Get started for free"
3. Sign up with email or GitHub
4. Verify your email

### Step 2: Create an App

1. Click "Create new app"
2. Fill in:
   - **Name**: ArbShield
   - **Chain**: Arbitrum
   - **Network**: Arbitrum Sepolia
3. Click "Create app"

### Step 3: Get Your API Key

1. Click on your app name
2. Click "API Key" button
3. Copy the **HTTPS** URL (looks like: `https://arb-sepolia.g.alchemy.com/v2/YOUR_KEY_HERE`)

### Step 4: Update Your Config

Add to your `.env.local`:

```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=your_key_here
```

Then update `lib/contracts.ts`:

```typescript
rpcUrls: {
  default: { 
    http: [
      `https://arb-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo'}`,
      "https://arbitrum-sepolia-rpc.publicnode.com",
    ] 
  },
}
```

## 🚀 Alternative: Use Demo Key (Quick Test)

I've already set up a demo key for you. Just:

1. **Restart your browser**
2. **Refresh the page**
3. **Try the transaction**

The demo key has rate limits but should work for testing.

## 📊 Alchemy Free Tier

- ✅ 300M compute units/month (plenty for testing)
- ✅ No credit card required
- ✅ Reliable infrastructure
- ✅ Fast response times

## 🔧 If Still Having Issues

### Option 1: Try Different Network

Your ISP might be blocking certain endpoints. Try:
- Mobile hotspot
- Different WiFi network
- VPN to different location

### Option 2: Use Local Node

Run your own Arbitrum Sepolia node:
```bash
# This is advanced - only if you really need it
docker run -p 8547:8547 offchainlabs/nitro-node:latest
```

### Option 3: Wait and Retry

Sometimes public RPCs are just temporarily down. Wait 5-10 minutes and try again.

## ✅ Expected Result

After using Alchemy:
- ✅ No more 503 errors
- ✅ Fast transaction submission
- ✅ Reliable connection
- ✅ Verification works

---

**Quick Fix**: The demo key is already configured. Just restart your browser!
