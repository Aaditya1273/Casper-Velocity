# ArbShield Troubleshooting Guide

## Quick Fixes for Common Issues

### 🔴 Issue: "Verification not showing in portfolio"

**Symptoms**:
- Completed verification successfully
- Transaction confirmed on-chain
- Portfolio shows old data or no verification

**Solution**:
1. **Wait 10-15 seconds** - Blockchain needs time to index events
2. **Click the refresh button** in portfolio (top right)
3. **Hard refresh the page** (Ctrl+Shift+R or Cmd+Shift+R)
4. **Check Arbiscan** - Verify transaction succeeded: https://sepolia.arbiscan.io

**Why this happens**:
- Arbitrum Sepolia takes 10-15 seconds to index events
- React Query cache may need invalidation
- RPC nodes need time to sync

**Prevention**:
- App now waits 2 seconds before redirecting
- Success message explains the delay
- Refresh button available for manual updates

---

### 🔴 Issue: "Base64 decoding error in passkey auth"

**Symptoms**:
```
InvalidCharacterError: Failed to execute 'atob' on 'Window'
```

**Solution**:
✅ **Already Fixed** - Update to latest code

**If still occurring**:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Use the "Skip Biometric Auth" button
4. Ensure you're on HTTPS or localhost

**Technical Details**:
- WebAuthn returns base64url encoded data
- Fixed by converting base64url → base64 before decoding

---

### 🔴 Issue: "Duplicate verifications appearing"

**Symptoms**:
- Same attribute verified multiple times
- Multiple entries in verification history
- Confused about which is current

**Solution**:
✅ **Already Fixed** - App now:
- Shows warning when selecting already-verified attribute
- Deduplicates to show only latest verification
- Suggests selecting different attributes

**To avoid duplicates**:
1. Check compliance dashboard before verifying
2. Heed the yellow warning in generate proof step
3. Select different attributes for each verification

---

### 🔴 Issue: "MetaMask shows 'Review alert' warning"

**Symptoms**:
- MetaMask displays simulation warning
- "This transaction may fail" message
- Worried about confirming

**Solution**:
✅ **This is normal for testnet contracts**
1. Click "I want to proceed anyway"
2. Confirm the transaction
3. Transaction will succeed despite warning

**Why this happens**:
- MetaMask simulation doesn't work well with testnet
- Stylus contracts may not simulate correctly
- The transaction will still succeed

---

### 🔴 Issue: "Passkey authentication not working"

**Symptoms**:
- Biometric prompt doesn't appear
- "Platform authenticator not available"
- Authentication fails

**Solution**:

**Option 1: Use Skip Button**
- Click "Continue Without Biometrics (Dev Mode)"
- This is perfectly fine for testing

**Option 2: Enable Biometrics**
1. **macOS**: Enable TouchID in System Preferences
2. **iOS**: Enable FaceID in Settings
3. **Windows**: Enable Windows Hello
4. **Android**: Enable fingerprint in Settings

**Option 3: Use HTTPS**
- WebAuthn requires HTTPS or localhost
- If on HTTP, deploy to HTTPS or use localhost

**Check Support**:
```javascript
// Open browser console and run:
PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  .then(available => console.log('Biometrics available:', available))
```

---

### 🔴 Issue: "Transaction failing with 'out of gas'"

**Symptoms**:
- Transaction reverts
- "Out of gas" error
- Insufficient gas limit

**Solution**:
1. **Increase gas limit** in MetaMask (Advanced settings)
2. **Use recommended gas**: ~3,000,000 for verification
3. **Check ETH balance**: Need ~0.01 ETH for gas

**Get testnet ETH**:
- Arbitrum Sepolia Faucet: https://faucet.quicknode.com/arbitrum/sepolia
- Bridge from Sepolia: https://bridge.arbitrum.io

---

### 🔴 Issue: "Proof generation taking too long"

**Symptoms**:
- "Generating Proof..." stuck for minutes
- Browser becomes unresponsive
- No progress indicator

**Solution**:
1. **Wait 10-15 seconds** - Groth16 proofs are slow
2. **Don't close the tab** - Generation happens in browser
3. **Check browser console** for errors
4. **Refresh and try again** if stuck > 30 seconds

**Expected Times**:
- Credit Score proof: 5-10 seconds
- Accredited Investor: 5-10 seconds
- Other attributes: 5-10 seconds

**If consistently slow**:
- Close other browser tabs
- Disable browser extensions
- Use Chrome/Edge (fastest)
- Check CPU usage

---

### 🔴 Issue: "Wrong network" error

**Symptoms**:
- "Please switch to Arbitrum Sepolia"
- Transactions not working
- Contract not found

**Solution**:
1. **Open MetaMask**
2. **Click network dropdown** (top left)
3. **Select "Arbitrum Sepolia"**
4. **If not listed**, add manually:
   - Network Name: Arbitrum Sepolia
   - RPC URL: https://sepolia-rollup.arbitrum.io/rpc
   - Chain ID: 421614
   - Currency: ETH
   - Explorer: https://sepolia.arbiscan.io

---

### 🔴 Issue: "Wallet not connecting"

**Symptoms**:
- "Connect Wallet" button not working
- MetaMask not opening
- Connection rejected

**Solution**:
1. **Refresh the page**
2. **Unlock MetaMask** if locked
3. **Check MetaMask is installed**
4. **Try different browser** (Chrome recommended)
5. **Clear browser cache**
6. **Disable conflicting extensions**

**MetaMask Installation**:
- Chrome: https://metamask.io/download
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/
- Brave: Built-in wallet or MetaMask extension

---

### 🔴 Issue: "Data not loading / Infinite loading"

**Symptoms**:
- Spinner spinning forever
- "Loading..." never completes
- Blank sections

**Solution**:
1. **Check internet connection**
2. **Verify RPC endpoint** in `.env`:
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_key_here
   ```
3. **Check Alchemy rate limits** (free tier: 300 req/sec)
4. **Hard refresh** (Ctrl+Shift+R)
5. **Check browser console** for errors

**RPC Issues**:
- Get free Alchemy key: https://www.alchemy.com
- Alternative RPC: https://sepolia-rollup.arbitrum.io/rpc

---

### 🔴 Issue: "Build failing"

**Symptoms**:
```
Failed to compile
Type error: ...
```

**Solution**:
1. **Delete build artifacts**:
   ```bash
   rm -rf .next
   rm -rf node_modules
   ```

2. **Reinstall dependencies**:
   ```bash
   npm install
   ```

3. **Run build**:
   ```bash
   npm run build
   ```

4. **Check TypeScript errors**:
   ```bash
   npm run type-check
   ```

---

## 🔍 Debugging Tips

### Check Transaction Status
```bash
# View transaction on Arbiscan
https://sepolia.arbiscan.io/tx/YOUR_TX_HASH
```

### Check Contract Events
```bash
# View contract events
https://sepolia.arbiscan.io/address/YOUR_CONTRACT_ADDRESS#events
```

### Browser Console Commands
```javascript
// Check wallet connection
console.log(window.ethereum.selectedAddress)

// Check network
console.log(window.ethereum.chainId) // Should be 0x66eee (421614)

// Check local storage
console.log(localStorage.getItem('passkey_YOUR_ADDRESS'))

// Check session storage
console.log(sessionStorage.getItem('zkProof'))
```

### Clear All Data
```javascript
// Clear everything and start fresh
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

## 📞 Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Check browser console for errors
3. ✅ Verify you're on Arbitrum Sepolia
4. ✅ Ensure sufficient testnet ETH
5. ✅ Try hard refresh
6. ✅ Try different browser

### Information to Provide

When reporting issues, include:
- **Browser & Version**: e.g., Chrome 120
- **Operating System**: e.g., macOS 14.0
- **Wallet**: MetaMask version
- **Network**: Arbitrum Sepolia
- **Transaction Hash**: If applicable
- **Error Message**: Full error from console
- **Steps to Reproduce**: What you did
- **Screenshots**: If helpful

### Where to Get Help

- **GitHub Issues**: [Your repo URL]
- **Discord**: [Your Discord URL]
- **Documentation**: Check README.md
- **Arbitrum Discord**: https://discord.gg/arbitrum

---

## 🛠️ Developer Tools

### Useful Browser Extensions
- **MetaMask**: Wallet connection
- **React DevTools**: Debug React components
- **Redux DevTools**: Debug state (if using Redux)

### Useful Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint code
npm run lint

# Clear cache and rebuild
rm -rf .next && npm run build
```

### Environment Variables
```bash
# Required in .env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Contract addresses (in lib/contracts.ts)
ZK_VERIFIER=0x...
MOCK_BUIDL=0x...
PASSKEY_REGISTRY=0x...
```

---

## ✅ Health Check

Run this checklist to verify everything is working:

- [ ] Wallet connects successfully
- [ ] Network is Arbitrum Sepolia (421614)
- [ ] Sufficient testnet ETH (>0.01)
- [ ] Passkey auth works (or skip works)
- [ ] Proof generates in <15 seconds
- [ ] Transaction confirms on-chain
- [ ] Verification appears in portfolio (after 15s)
- [ ] No console errors
- [ ] All pages load correctly

If all checked, you're good to go! 🚀

---

## 🔄 Quick Reset

If everything is broken, try this:

```bash
# 1. Clear browser data
# In browser: Settings → Privacy → Clear browsing data

# 2. Clear project cache
rm -rf .next
rm -rf node_modules
rm -rf .turbo

# 3. Reinstall
npm install

# 4. Rebuild
npm run build

# 5. Start fresh
npm run dev
```

Then:
1. Disconnect wallet in MetaMask
2. Reconnect wallet
3. Try verification flow again

---

**Last Updated**: After critical fixes
**Status**: All major issues resolved ✅
