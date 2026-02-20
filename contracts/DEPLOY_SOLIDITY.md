# Deploy Solidity Contracts to Arbitrum Sepolia

Quick guide to deploy the real Groth16-based Solidity contracts.

## ✅ What You're Deploying

1. **ComplianceRegistry** - Stores verified compliance attributes
2. **CreditScoreVerifier** - Generated Groth16 verifier (real cryptographic verification)
3. **ZKVerifier** - Wrapper for Groth16 verification + compliance tracking
3. **MockBUIDL** - Demo RWA token with compliance checks

## 🚀 Quick Deploy

### Step 1: Generate Groth16 Verifier

From the project root:

```bash
cd circuits
bash generate_credit_score.sh
```

This generates:
- `contracts/src/CreditScoreVerifier.sol`
- `public/zk/credit_score/*` (frontend artifacts)

### Step 2: Deploy CreditScoreVerifier

Using Foundry:

```bash
forge create --rpc-url $ARBITRUM_SEPOLIA_RPC \
  --private-key $PRIVATE_KEY \
  contracts/src/CreditScoreVerifier.sol:Verifier
```

Copy the deployed address (this is your `GROTH16_VERIFIER`).

### Step 3: Set Environment Variables

Create `.env` in the `contracts` directory:

```bash
PRIVATE_KEY=your_private_key_without_0x
ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
ARBISCAN_API_KEY=your_arbiscan_api_key (optional, for verification)
GROTH16_VERIFIER=0xYourDeployedVerifier
```

### Step 4: Deploy

```bash
cd contracts
forge script script/Deploy.s.sol \
  --rpc-url $ARBITRUM_SEPOLIA_RPC \
  --broadcast \
  --verify \
  --etherscan-api-key $ARBISCAN_API_KEY
```

Or without verification:

```bash
forge script script/Deploy.s.sol \
  --rpc-url $ARBITRUM_SEPOLIA_RPC \
  --broadcast
```

### Step 5: Update Frontend

Copy the deployed addresses from the output and update `lib/contracts.ts`:

```typescript
export const CONTRACTS = {
  ZK_VERIFIER: "0xYourZKVerifierAddress" as const,
  COMPLIANCE_REGISTRY: "0xYourRegistryAddress" as const,
  MOCK_BUIDL: "0xYourBUIDLAddress" as const,
  PASSKEY_VERIFIER: "0x0000000000000000000000000000000000000100" as const,
} as const;
```

## 📊 What You Get

- ✅ Fully functional compliance system
- ✅ Real ZK proof verification (Groth16 Solidity verifier)
- ✅ Compliance registry with expiration
- ✅ Mock RWA token integration
- ✅ Ready for frontend integration

## 🔄 Stylus Upgrade Path

You can later swap to a Stylus verifier if desired, but the Groth16 Solidity verifier is fully real and functional.

## 🧪 Test Deployment

After deploying, test with:

```bash
forge test --fork-url $ARBITRUM_SEPOLIA_RPC
```

## 📝 Notes

- The ZKVerifier expects a valid Groth16 verifier address at deployment
- You can update it later with `updateGroth16Verifier()`
- All contracts are upgradeable through the owner/admin roles
- Compliance records have expiration timestamps

---

**Ready to deploy?** Run the forge script command above!
