#!/bin/bash

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Navigate to contracts directory
cd contracts

# Deploy MockBUIDL
echo "Deploying MockBUIDL contract..."
forge script script/RedeployMockBUIDL.s.sol:RedeployMockBUIDL \
  --rpc-url $ARBITRUM_SEPOLIA_RPC \
  --broadcast \
  --verify \
  -vvv

echo ""
echo "Deployment complete! Please check the output above for the new contract address."
echo "Update your .env file with: NEXT_PUBLIC_MOCK_BUIDL=<new_address>"
