#!/bin/bash

# ArbShield Vercel Setup Script
# This script helps you configure and deploy to Vercel

echo "🚀 ArbShield Vercel Deployment Setup"
echo "===================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
else
    echo "✅ Vercel CLI is installed"
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo ""
echo "1. Get WalletConnect Project ID:"
echo "   → Go to https://cloud.walletconnect.com"
echo "   → Create a free account and new project"
echo "   → Copy your Project ID"
echo ""
echo "2. (Optional) Get Alchemy API Key:"
echo "   → Go to https://www.alchemy.com/"
echo "   → Create a free account"
echo "   → Create an app for Arbitrum Sepolia"
echo "   → Copy your API Key"
echo ""

read -p "Do you have your WalletConnect Project ID? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please get your WalletConnect Project ID first"
    echo "   Visit: https://cloud.walletconnect.com"
    exit 1
fi

echo ""
echo "🔐 Setting up environment variables..."
echo ""

read -p "Enter your WalletConnect Project ID: " WALLETCONNECT_ID
read -p "Enter your Alchemy API Key (optional, press Enter to skip): " ALCHEMY_KEY

# Update .env.local
cat > .env.local << EOF
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$WALLETCONNECT_ID

# Arbitrum Sepolia Chain ID
NEXT_PUBLIC_CHAIN_ID=421614

# Optional: Alchemy API Key
NEXT_PUBLIC_ALCHEMY_API_KEY=$ALCHEMY_KEY

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
EOF

echo "✅ .env.local configured"
echo ""

# Test build locally
echo "🔨 Testing build locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    read -p "Deploy to Vercel now? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Deploying to Vercel..."
        vercel
        
        echo ""
        echo "✅ Deployment initiated!"
        echo ""
        echo "📝 Next steps:"
        echo "1. Go to your Vercel dashboard"
        echo "2. Add environment variables:"
        echo "   - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$WALLETCONNECT_ID"
        echo "   - NEXT_PUBLIC_APP_URL=https://your-app.vercel.app"
        echo "   - NEXT_PUBLIC_CHAIN_ID=421614"
        if [ ! -z "$ALCHEMY_KEY" ]; then
            echo "   - NEXT_PUBLIC_ALCHEMY_API_KEY=$ALCHEMY_KEY"
        fi
        echo "3. Redeploy with: vercel --prod"
    fi
else
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo ""
echo "📚 For detailed instructions, see DEPLOY_VERCEL.md"
