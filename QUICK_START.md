# 🚀 ArbShield Quick Start Guide

## TL;DR - Get Started in 5 Minutes

### 1. Start the App
```bash
npm run dev
```

### 2. Test the Complete Flow

**A. Complete Verification (Required First!)**
```
1. Go to http://localhost:3000/verify
2. Generate proof for "KYC Verified" (private: 1, public: 1)
3. Click "Verify Proof On-Chain" → Approve in MetaMask
4. Generate proof for "Accredited Investor" (private: 1, public: 1)
5. Click "Verify Proof On-Chain" → Approve in MetaMask
✅ You're now verified!
```

**B. Mint BUIDL Tokens**
```
1. Go to http://localhost:3000/portal
2. Should see "Access Granted" ✅
3. Enter amount: 1000
4. Click "Mint BUIDL" → Approve in MetaMask
5. Wait ~5 seconds
✅ Balance updated!
```

**C. View Your Portfolio**
```
1. Scroll down on portal page
2. See your balance and transaction history
✅ All data is real from blockchain!
```

---

## 📝 Key Contract Addresses

| Contract | Address |
|----------|---------|
| MockBUIDL (NEW!) | `0x444709c368e2DfeAD2B91C74f81D59Ca897120a4` |
| ZKVerifier | `0x68B54E13F3da4A3dF34Af657853769ea6D66b6d9` |
| ComplianceRegistry | `0xD39184bd636D5f18604e696C149DdAF770023BEA` |

**Network:** Arbitrum Sepolia (421614)

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| "User not compliant" | Complete BOTH KYC + Accredited Investor verification |
| Transaction reverts | Get testnet ETH from faucet |
| Balance not updating | Wait 10 seconds, refresh page |
| Wallet not connecting | Switch to Arbitrum Sepolia network |

---

## 🎯 What Makes This Special?

1. **Real ZK Proofs** - Groth16 circuit, verified on-chain
2. **Arbitrum Stylus** - 92% gas savings vs Solidity
3. **RIP-7212 Passkeys** - 99% cheaper authentication
4. **User-Mintable RWA** - Demo institutional tokens
5. **Professional UI** - Production-ready design

---

## 📊 Pages to Demo

- `/` - Landing page
- `/verify` - ZK proof generation
- `/portal` - BUIDL token portal (mint/redeem)
- `/analytics` - Gas efficiency charts
- `/identity` - Passkey management

---

## ✅ Everything is Ready!

- ✅ All contracts deployed
- ✅ ZK circuits compiled
- ✅ Frontend fully functional
- ✅ Real blockchain data
- ✅ Professional UI/UX

**Just run `npm run dev` and start testing!** 🚀
