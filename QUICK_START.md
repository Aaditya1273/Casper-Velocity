# ArbShield - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- MetaMask wallet
- Arbitrum Sepolia testnet ETH (get from faucet)

---

## Step 1: Install Dependencies

```bash
npm install
```

---

## Step 2: Setup Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get API Keys**:
- WalletConnect: https://cloud.walletconnect.com
- Alchemy: https://www.alchemy.com

---

## Step 3: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Step 4: Connect Wallet

1. Click "Connect Wallet" button
2. Select MetaMask
3. Switch to Arbitrum Sepolia network
4. Approve connection

**Add Arbitrum Sepolia to MetaMask**:
- Network Name: Arbitrum Sepolia
- RPC URL: https://sepolia-rollup.arbitrum.io/rpc
- Chain ID: 421614
- Currency: ETH
- Explorer: https://sepolia.arbiscan.io

**Get Testnet ETH**:
- Faucet: https://faucet.quicknode.com/arbitrum/sepolia

---

## Step 5: Complete Your First Verification

### A. Navigate to Verify Page
Click "Verify" in navigation or go to http://localhost:3000/verify

### B. Passkey Authentication (Step 1)
- **Option 1**: Use biometrics (FaceID/TouchID/Windows Hello)
- **Option 2**: Click "Continue Without Biometrics (Dev Mode)"

### C. Generate Proof (Step 2)
1. Select attribute type (e.g., "Credit Score Threshold")
2. Enter values:
   - Credit Score: 750
   - Threshold: 700
3. Click "Generate Proof"
4. Wait 5-10 seconds

### D. Verify On-Chain (Step 3)
1. Click "Verify Proof"
2. Confirm transaction in MetaMask
3. Wait for confirmation
4. Click "View Portfolio"

---

## Step 6: Explore the App

### Portfolio (`/portal`)
- View your BUIDL token balance
- See transaction history
- Check net position
- Click refresh to update data

### Compliance Dashboard (`/compliance`)
- View verified attributes
- See verification activity
- Check gas benchmarks

### Identity (`/identity`)
- View user profile
- Manage passkeys
- Track onboarding progress

### Analytics (`/analytics`)
- Network statistics
- Verification charts
- Gas efficiency data
- Technology stack

---

## 🎯 Common Tasks

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Type Check
```bash
npm run type-check
```

### Lint Code
```bash
npm run lint
```

---

## 🐛 Troubleshooting

### Issue: "Verification not showing"
**Solution**: Wait 10-15 seconds and click refresh button in portfolio

### Issue: "MetaMask shows warning"
**Solution**: Click "I want to proceed anyway" - this is normal for testnet

### Issue: "Passkey not working"
**Solution**: Use "Continue Without Biometrics" button for testing

### Issue: "Wrong network"
**Solution**: Switch to Arbitrum Sepolia in MetaMask

### Issue: "Out of gas"
**Solution**: Get more testnet ETH from faucet

For more help, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📚 Documentation

- **README.md** - Project overview
- **TESTING_GUIDE.md** - Comprehensive testing
- **TROUBLESHOOTING.md** - Common issues
- **DEPLOYMENT_CHECKLIST.md** - Production deployment
- **CRITICAL_FIXES.md** - Recent bug fixes
- **FINAL_SUMMARY.md** - Complete project summary

---

## 🎓 Learning Path

### Beginner
1. Connect wallet
2. Complete verification flow
3. View portfolio
4. Explore compliance dashboard

### Intermediate
1. Understand ZK proofs
2. Learn about Stylus contracts
3. Explore passkey authentication
4. Review smart contracts

### Advanced
1. Deploy own contracts
2. Customize verification logic
3. Integrate with other dApps
4. Contribute to codebase

---

## 🔗 Useful Links

### Documentation
- Arbitrum Docs: https://docs.arbitrum.io
- Stylus Docs: https://docs.arbitrum.io/stylus
- Next.js Docs: https://nextjs.org/docs
- wagmi Docs: https://wagmi.sh

### Tools
- Arbiscan: https://sepolia.arbiscan.io
- Alchemy Dashboard: https://dashboard.alchemy.com
- WalletConnect Cloud: https://cloud.walletconnect.com

### Community
- Arbitrum Discord: https://discord.gg/arbitrum
- GitHub Issues: [Your repo URL]

---

## ✅ Success Checklist

After completing this guide, you should be able to:

- [x] Install and run the application
- [x] Connect wallet to Arbitrum Sepolia
- [x] Complete a verification flow
- [x] View verification in portfolio
- [x] Navigate all pages
- [x] Understand basic functionality

---

## 🚀 Next Steps

1. **Explore Features**: Try all pages and features
2. **Read Documentation**: Understand the architecture
3. **Test Thoroughly**: Follow TESTING_GUIDE.md
4. **Deploy**: Use DEPLOYMENT_CHECKLIST.md
5. **Customize**: Modify for your use case

---

## 💡 Pro Tips

1. **Use Skip Button**: For faster testing, skip biometric auth
2. **Wait for Indexing**: Give blockchain 10-15 seconds to index
3. **Check Console**: Browser console shows helpful debug info
4. **Use Refresh**: Manual refresh button in portfolio
5. **Read Warnings**: Yellow warnings help prevent mistakes

---

## 🎉 You're Ready!

You now have a fully functional privacy-preserving compliance verification system running locally.

**What you built**:
- ✅ Zero-knowledge proof generation
- ✅ Biometric authentication
- ✅ On-chain verification
- ✅ Portfolio management
- ✅ Compliance dashboard
- ✅ Analytics platform

**Next**: Deploy to production and start verifying! 🚀

---

**Need Help?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or open an issue.

**Ready to Deploy?** See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md).

**Want to Contribute?** Read [CONTRIBUTING.md](./CONTRIBUTING.md) (if available).
