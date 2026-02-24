# ArbShield Testing Guide

## Quick Start

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open in browser**: http://localhost:3000

3. **Connect wallet**: Use MetaMask on Arbitrum Sepolia testnet

## Test Scenarios

### 1. Verification Flow Test

**Objective**: Verify that completing a verification updates the portfolio and dashboard.

**Steps**:
1. Navigate to `/verify`
2. Connect your wallet
3. **Step 1 - Passkey Authentication**:
   - If you have biometric device (FaceID/TouchID):
     - Click "Authenticate with Biometrics"
     - Follow device prompts
   - For testing without biometrics:
     - Click "Continue Without Biometrics (Dev Mode)"
4. **Step 2 - Generate Proof**:
   - Select attribute type (e.g., "credit_score")
   - Enter test values (e.g., credit score: 750)
   - Click "Generate ZK Proof"
   - Wait for proof generation (~5-10 seconds)
5. **Step 3 - Verify On-Chain**:
   - Click "Verify Proof"
   - Confirm transaction in MetaMask
   - Wait for confirmation
   - Click "View Portfolio"
6. **Verify Updates**:
   - Check that portfolio shows updated balance
   - Verify transaction appears in history
   - Confirm verification count increased

**Expected Results**:
- ✅ Proof generates successfully
- ✅ Transaction confirms on-chain
- ✅ Portfolio redirects and shows new data
- ✅ Transaction appears in history
- ✅ Compliance status updates

### 2. Passkey Authentication Test

**Objective**: Test biometric authentication flow and skip functionality.

**Steps**:
1. Navigate to `/verify`
2. Connect wallet
3. **Test Biometric Auth** (if available):
   - Click "Authenticate with Biometrics"
   - Use FaceID/TouchID/Windows Hello
   - Verify success message appears
4. **Test Skip Button**:
   - Refresh page
   - Click "Continue Without Biometrics (Dev Mode)"
   - Verify it proceeds to next step

**Expected Results**:
- ✅ Clear messaging about biometric authentication
- ✅ No mention of "password"
- ✅ Platform authenticator detection works
- ✅ Skip button works for testing
- ✅ Helpful error messages if WebAuthn not supported

### 3. Portfolio UI Test

**Objective**: Verify portfolio displays correctly with enhanced UI.

**Steps**:
1. Navigate to `/portal`
2. Connect wallet
3. **Test Refresh**:
   - Click refresh button
   - Verify loading state
   - Confirm data updates
4. **Test Hover Effects**:
   - Hover over stat cards
   - Verify gradient animations
   - Check shimmer effects
5. **Test Transaction History**:
   - Scroll through transactions
   - Hover over transaction cards
   - Click "View" link to Arbiscan
   - Verify external link opens

**Expected Results**:
- ✅ Animated gradients on hover
- ✅ Shimmer effects visible
- ✅ Refresh button works
- ✅ Transaction cards scale on hover
- ✅ Color coding correct (green=mint, red=redeem)
- ✅ Arbiscan links work

### 4. Identity Page Test

**Objective**: Verify identity page shows real data and is functional.

**Steps**:
1. Navigate to `/identity`
2. Connect wallet
3. **Test User Profile**:
   - Verify wallet address displays
   - Click copy button
   - Verify toast notification
   - Click Arbiscan link
4. **Test Stats**:
   - Check compliance status
   - Verify proof count
   - Confirm active status
5. **Test Passkey Manager**:
   - Check device list
   - Try adding device (if biometrics available)
   - Verify device appears in list
6. **Test Onboarding Guide**:
   - Check progress bar
   - Verify completed steps show checkmarks
   - Click "Start" on incomplete steps

**Expected Results**:
- ✅ Real data from blockchain
- ✅ Copy address works
- ✅ Stats update correctly
- ✅ Verified attributes display
- ✅ Onboarding progress accurate
- ✅ Enhanced UI with gradients

### 5. Analytics Page Test

**Objective**: Verify analytics shows real blockchain data.

**Steps**:
1. Navigate to `/analytics`
2. **Test Network Stats**:
   - Verify total verifications count
   - Check active users estimate
   - Confirm gas saved percentage
   - Verify hover effects
3. **Test Verification Chart**:
   - Check daily bar chart
   - Hover over bars to see values
   - Verify weekly summary
   - Confirm "Live from Blockchain" indicator
4. **Test Gas Comparison**:
   - Review gas benchmarks
   - Verify Stylus vs Solidity comparison
5. **Test Tech Stack**:
   - Review technology cards
   - Verify links work

**Expected Results**:
- ✅ Real data from Arbitrum Sepolia
- ✅ Chart displays correctly
- ✅ Hover tooltips work
- ✅ Stats update with new verifications
- ✅ Enhanced UI with animations

## Responsive Design Test

**Test on different screen sizes**:
1. Desktop (1920x1080)
2. Laptop (1366x768)
3. Tablet (768x1024)
4. Mobile (375x667)

**Check**:
- ✅ Layout adapts correctly
- ✅ Cards stack on mobile
- ✅ Text remains readable
- ✅ Buttons accessible
- ✅ No horizontal scroll

## Browser Compatibility Test

**Test on**:
1. Chrome (latest)
2. Firefox (latest)
3. Safari (latest)
4. Edge (latest)

**Check**:
- ✅ WebAuthn support detection
- ✅ Animations work smoothly
- ✅ Gradients render correctly
- ✅ No console errors

## Performance Test

**Metrics to check**:
1. **Page Load Time**: < 3 seconds
2. **Time to Interactive**: < 5 seconds
3. **Proof Generation**: 5-10 seconds
4. **Transaction Confirmation**: 10-30 seconds

**Tools**:
- Chrome DevTools Lighthouse
- Network tab for API calls
- Performance tab for rendering

## Error Handling Test

**Test error scenarios**:
1. **No Wallet Connected**:
   - Verify helpful message
   - Check connect button visible
2. **Wrong Network**:
   - Switch to different network
   - Verify error message
3. **Transaction Rejected**:
   - Reject MetaMask transaction
   - Verify error handling
4. **No Biometrics**:
   - Test on device without biometrics
   - Verify skip option available
5. **Network Error**:
   - Disconnect internet
   - Verify error messages

**Expected Results**:
- ✅ Clear error messages
- ✅ No app crashes
- ✅ Recovery options available
- ✅ Loading states handle errors

## Accessibility Test

**Check**:
1. **Keyboard Navigation**:
   - Tab through all interactive elements
   - Verify focus indicators
2. **Screen Reader**:
   - Test with NVDA/JAWS
   - Verify labels are descriptive
3. **Color Contrast**:
   - Use browser tools to check contrast
   - Verify WCAG AA compliance
4. **Touch Targets**:
   - Verify buttons are at least 44x44px
   - Check spacing between elements

## Integration Test

**End-to-End Flow**:
1. Connect wallet
2. Complete verification
3. Check portfolio updates
4. View compliance dashboard
5. Check analytics
6. Review identity page
7. Complete onboarding

**Expected Results**:
- ✅ Smooth flow between pages
- ✅ Data consistency across pages
- ✅ No broken links
- ✅ All features work together

## Known Issues & Workarounds

### Issue 1: MetaMask Simulation Warning
**Problem**: MetaMask shows "Review alert" on testnet transactions.
**Workaround**: This is normal for testnet contracts. Click "Confirm" to proceed.

### Issue 2: WebAuthn Requires HTTPS
**Problem**: Biometric auth doesn't work on HTTP.
**Workaround**: Use localhost or deploy to HTTPS. Use skip button for testing.

### Issue 3: Alchemy Rate Limits
**Problem**: Too many requests can hit rate limits.
**Workaround**: Reduce block range or upgrade Alchemy plan.

### Issue 4: Slow Proof Generation
**Problem**: ZK proof generation takes 5-10 seconds.
**Workaround**: This is expected for Groth16 proofs. Show loading indicator.

## Reporting Issues

When reporting issues, include:
1. **Browser & Version**: e.g., Chrome 120
2. **Device**: e.g., MacBook Pro M1
3. **Network**: Arbitrum Sepolia
4. **Wallet**: MetaMask version
5. **Steps to Reproduce**: Detailed steps
6. **Expected vs Actual**: What should happen vs what happened
7. **Screenshots**: If applicable
8. **Console Errors**: From browser DevTools

## Success Criteria

All tests pass when:
- ✅ Verification flow completes successfully
- ✅ Portfolio updates after verification
- ✅ Passkey authentication works (or skip works)
- ✅ All pages load without errors
- ✅ Real blockchain data displays
- ✅ UI animations work smoothly
- ✅ Responsive design works on all devices
- ✅ Error handling is graceful
- ✅ No console errors
- ✅ Build completes successfully
