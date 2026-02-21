# ArbShield Vercel Setup Script (PowerShell)
# This script helps you configure and deploy to Vercel

Write-Host "🚀 ArbShield Vercel Deployment Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "📦 Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
} else {
    Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Pre-deployment Checklist:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Get WalletConnect Project ID:"
Write-Host "   → Go to https://cloud.walletconnect.com"
Write-Host "   → Create a free account and new project"
Write-Host "   → Copy your Project ID"
Write-Host ""
Write-Host "2. (Optional) Get Alchemy API Key:"
Write-Host "   → Go to https://www.alchemy.com/"
Write-Host "   → Create a free account"
Write-Host "   → Create an app for Arbitrum Sepolia"
Write-Host "   → Copy your API Key"
Write-Host ""

$hasWalletConnect = Read-Host "Do you have your WalletConnect Project ID? (y/n)"

if ($hasWalletConnect -ne "y" -and $hasWalletConnect -ne "Y") {
    Write-Host "❌ Please get your WalletConnect Project ID first" -ForegroundColor Red
    Write-Host "   Visit: https://cloud.walletconnect.com"
    exit 1
}

Write-Host ""
Write-Host "🔐 Setting up environment variables..." -ForegroundColor Cyan
Write-Host ""

$walletConnectId = Read-Host "Enter your WalletConnect Project ID"
$alchemyKey = Read-Host "Enter your Alchemy API Key (optional, press Enter to skip)"

# Update .env.local
$envContent = @"
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$walletConnectId

# Arbitrum Sepolia Chain ID
NEXT_PUBLIC_CHAIN_ID=421614

# Optional: Alchemy API Key
NEXT_PUBLIC_ALCHEMY_API_KEY=$alchemyKey

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
"@

Set-Content -Path ".env.local" -Value $envContent

Write-Host "✅ .env.local configured" -ForegroundColor Green
Write-Host ""

# Test build locally
Write-Host "🔨 Testing build locally..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    
    $deploy = Read-Host "Deploy to Vercel now? (y/n)"
    
    if ($deploy -eq "y" -or $deploy -eq "Y") {
        Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
        vercel
        
        Write-Host ""
        Write-Host "✅ Deployment initiated!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Go to your Vercel dashboard"
        Write-Host "2. Add environment variables:"
        Write-Host "   - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$walletConnectId"
        Write-Host "   - NEXT_PUBLIC_APP_URL=https://your-app.vercel.app"
        Write-Host "   - NEXT_PUBLIC_CHAIN_ID=421614"
        if ($alchemyKey) {
            Write-Host "   - NEXT_PUBLIC_ALCHEMY_API_KEY=$alchemyKey"
        }
        Write-Host "3. Redeploy with: vercel --prod"
    }
} else {
    Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📚 For detailed instructions, see DEPLOY_VERCEL.md" -ForegroundColor Cyan
