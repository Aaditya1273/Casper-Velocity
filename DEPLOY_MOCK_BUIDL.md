# Deploying Updated MockBUIDL Contract

The MockBUIDL contract has been updated to allow compliant users to mint and burn tokens themselves (for demo purposes).

## Changes Made

### Contract Updates (`contracts/src/MockBUIDL.sol`)
- Added `mint(uint256 amount)` - Allows compliant users to mint tokens to themselves
- Added `burn(uint256 amount)` - Allows users to burn their own tokens (redeem)
- Both functions check compliance status via the ComplianceRegistry

## Deployment Steps

### Option 1: Using Forge Script (Recommended)

```bash
cd contracts

# Make sure you have PRIVATE_KEY and ARBITRUM_SEPOLIA_RPC_URL in .env
source ../.env

# Deploy the new contract
forge script script/RedeployMockBUIDL.s.sol:RedeployMockBUIDL \
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  -vvv
```

### Option 2: Using Forge Create

```bash
cd contracts

# Deploy directly
forge create src/MockBUIDL.sol:MockBUIDL \
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --constructor-args 0xD39184bd636D5f18604e696C149DdAF770023BEA \
  --verify
```

## After Deployment

1. Copy the new contract address
2. Update `.env` file:
   ```
   NEXT_PUBLIC_MOCK_BUIDL=<new_contract_address>
   ```
3. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

## Testing

1. Navigate to `/verify` page
2. Complete KYC and Accredited Investor verification
3. Go to `/portal` page
4. Try minting tokens - should work now!

## Current Contract Address

**Old (needs redeployment):** `0x64983C51cF3d08ada29fD4e13E07B0c4453C903f`

**ComplianceRegistry (don't change):** `0xD39184bd636D5f18604e696C149DdAF770023BEA`

## Alternative: Skip Redeployment

If you don't want to redeploy, the frontend now shows better error messages:
- "You must complete KYC and Accredited Investor verification before minting"
- "You must be verified as an Accredited Investor to mint tokens"

This provides a better user experience even with the old contract.
