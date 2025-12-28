#!/bin/bash

# Casper Velocity Deployment Script
# Usage: ./deploy.sh [testnet|mainnet]

set -e

NETWORK=${1:-testnet}
KEYS_DIR="./keys"
CONTRACTS_DIR="./contracts"
APP_DIR="./app"

echo "🚀 Deploying Casper Velocity to $NETWORK"

# Check prerequisites
if ! command -v casper-client &> /dev/null; then
    echo "❌ casper-client not found. Please install Casper CLI tools."
    exit 1
fi

if ! command -v cargo &> /dev/null; then
    echo "❌ cargo not found. Please install Rust."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js."
    exit 1
fi

# Setup keys directory
if [ ! -d "$KEYS_DIR" ]; then
    echo "📁 Creating keys directory..."
    mkdir -p $KEYS_DIR
fi

if [ ! -f "$KEYS_DIR/secret_key.pem" ]; then
    echo "🔑 Generating Casper keys..."
    casper-client keygen $KEYS_DIR/
    echo "✅ Keys generated. Please fund your account with testnet tokens:"
    echo "   https://testnet.cspr.live/tools/faucet"
    echo "   Public key: $(cat $KEYS_DIR/public_key_hex)"
    read -p "Press enter after funding your account..."
fi

# Set network configuration
if [ "$NETWORK" = "testnet" ]; then
    NODE_ADDRESS="http://3.208.91.63:7777"
    CHAIN_NAME="casper-test"
elif [ "$NETWORK" = "mainnet" ]; then
    NODE_ADDRESS="http://3.208.91.63:7777"
    CHAIN_NAME="casper"
else
    echo "❌ Invalid network. Use 'testnet' or 'mainnet'"
    exit 1
fi

echo "🔧 Network: $NETWORK"
echo "🔧 Node: $NODE_ADDRESS"
echo "🔧 Chain: $CHAIN_NAME"

# Build contracts
echo "🔨 Building smart contracts..."
cd $CONTRACTS_DIR

if ! command -v cargo-odra &> /dev/null; then
    echo "📦 Installing cargo-odra..."
    cargo install cargo-odra --locked
fi

echo "🔨 Building contracts with Odra..."
cargo odra build

echo "🧪 Running contract tests..."
cargo odra test

# Deploy contracts
echo "🚀 Deploying contracts to $NETWORK..."

# Deploy Liquid Staking Contract
echo "📄 Deploying Liquid Staking Contract..."
LIQUID_STAKING_DEPLOY=$(casper-client put-deploy \
    --node-address $NODE_ADDRESS \
    --chain-name $CHAIN_NAME \
    --secret-key ../keys/secret_key.pem \
    --payment-amount 200000000000 \
    --session-path target/wasm32-unknown-unknown/release/liquid_staking_contract.wasm \
    --session-arg "owner:public_key='$(cat ../keys/public_key_hex)'" \
    | grep -o 'deploy-[a-f0-9]*')

echo "✅ Liquid Staking Deploy Hash: $LIQUID_STAKING_DEPLOY"

# Wait for deployment
echo "⏳ Waiting for deployment confirmation..."
sleep 30

# Deploy Yield Aggregator Contract
echo "📄 Deploying Yield Aggregator Contract..."
YIELD_AGGREGATOR_DEPLOY=$(casper-client put-deploy \
    --node-address $NODE_ADDRESS \
    --chain-name $CHAIN_NAME \
    --secret-key ../keys/secret_key.pem \
    --payment-amount 200000000000 \
    --session-path target/wasm32-unknown-unknown/release/yield_aggregator_contract.wasm \
    --session-arg "owner:public_key='$(cat ../keys/public_key_hex)'" \
    | grep -o 'deploy-[a-f0-9]*')

echo "✅ Yield Aggregator Deploy Hash: $YIELD_AGGREGATOR_DEPLOY"

# Wait for deployment
sleep 30

# Deploy Synthetic Stablecoin Contract
echo "📄 Deploying Synthetic Stablecoin Contract..."
SYNTHETIC_DEPLOY=$(casper-client put-deploy \
    --node-address $NODE_ADDRESS \
    --chain-name $CHAIN_NAME \
    --secret-key ../keys/secret_key.pem \
    --payment-amount 200000000000 \
    --session-path target/wasm32-unknown-unknown/release/synthetic_stablecoin_contract.wasm \
    --session-arg "owner:public_key='$(cat ../keys/public_key_hex)'" \
    --session-arg "bridge_contract:public_key='$(cat ../keys/public_key_hex)'" \
    | grep -o 'deploy-[a-f0-9]*')

echo "✅ Synthetic Stablecoin Deploy Hash: $SYNTHETIC_DEPLOY"

cd ..

# Build and deploy frontend
echo "🌐 Building frontend application..."
cd $APP_DIR

echo "📦 Installing dependencies..."
npm install

echo "🔧 Updating environment configuration..."
cat > .env.production.local << EOF
REACT_APP_CASPER_NETWORK=$NETWORK
REACT_APP_CASPER_RPC_URL=$NODE_ADDRESS/rpc
REACT_APP_CASPER_CHAIN_NAME=$CHAIN_NAME
REACT_APP_LIQUID_STAKING_DEPLOY=$LIQUID_STAKING_DEPLOY
REACT_APP_YIELD_AGGREGATOR_DEPLOY=$YIELD_AGGREGATOR_DEPLOY
REACT_APP_SYNTHETIC_STABLECOIN_DEPLOY=$SYNTHETIC_DEPLOY
EOF

echo "🔨 Building production frontend..."
npm run build

echo "✅ Frontend built successfully!"

cd ..

# Summary
echo ""
echo "🎉 Casper Velocity Deployment Complete!"
echo ""
echo "📋 Deployment Summary:"
echo "   Network: $NETWORK"
echo "   Liquid Staking: $LIQUID_STAKING_DEPLOY"
echo "   Yield Aggregator: $YIELD_AGGREGATOR_DEPLOY"
echo "   Synthetic Stablecoin: $SYNTHETIC_DEPLOY"
echo ""
echo "🌐 Frontend:"
echo "   Built: ./app/build/"
echo "   Deploy to NodeOps or your preferred hosting"
echo ""
echo "🔍 Verify deployments:"
echo "   https://testnet.cspr.live/deploy/$LIQUID_STAKING_DEPLOY"
echo "   https://testnet.cspr.live/deploy/$YIELD_AGGREGATOR_DEPLOY"
echo "   https://testnet.cspr.live/deploy/$SYNTHETIC_DEPLOY"
echo ""
echo "🚀 Ready for hackathon demo!"