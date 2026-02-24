# ArbShield Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Quality
- [x] All TypeScript errors resolved
- [x] Build completes successfully (`npm run build`)
- [x] No console errors in development
- [x] All critical bugs fixed
- [x] Code reviewed and tested

### ✅ Environment Variables
- [ ] `.env.production` created with production values
- [ ] `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` set
- [ ] `NEXT_PUBLIC_ALCHEMY_API_KEY` set (production key)
- [ ] `NEXT_PUBLIC_APP_URL` set to production URL
- [ ] All contract addresses verified in `lib/contracts.ts`

### ✅ Smart Contracts
- [ ] Contracts deployed to Arbitrum Mainnet (or Sepolia for staging)
- [ ] Contract addresses updated in `lib/contracts.ts`
- [ ] Contracts verified on Arbiscan
- [ ] Test transactions completed successfully
- [ ] Gas limits tested and optimized

### ✅ Testing
- [ ] Verification flow tested end-to-end
- [ ] Passkey authentication tested (or skip works)
- [ ] Portfolio updates after verification
- [ ] All pages load correctly
- [ ] Mobile responsive design tested
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)

### ✅ Performance
- [ ] Lighthouse score > 90
- [ ] Page load time < 3 seconds
- [ ] Images optimized
- [ ] Bundle size optimized
- [ ] No memory leaks

### ✅ Security
- [ ] No sensitive data in client-side code
- [ ] API keys properly secured
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Rate limiting implemented (if applicable)

---

## Deployment Steps

### Option 1: Vercel Deployment (Recommended)

#### Step 1: Prepare Vercel Project
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link
```

#### Step 2: Set Environment Variables
```bash
# Set production environment variables
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID production
vercel env add NEXT_PUBLIC_ALCHEMY_API_KEY production
vercel env add NEXT_PUBLIC_APP_URL production
```

Or via Vercel Dashboard:
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add all required variables
4. Set scope to "Production"

#### Step 3: Deploy
```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploy)
git push origin main
```

#### Step 4: Verify Deployment
1. Visit production URL
2. Test wallet connection
3. Complete verification flow
4. Check all pages load
5. Verify no console errors

---

### Option 2: Custom Server Deployment

#### Step 1: Build Production Bundle
```bash
# Build for production
npm run build

# Test production build locally
npm start
```

#### Step 2: Prepare Server
```bash
# SSH into server
ssh user@your-server.com

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2
```

#### Step 3: Deploy Files
```bash
# From local machine
rsync -avz --exclude 'node_modules' --exclude '.next' \
  ./ user@your-server.com:/var/www/arbshield/

# On server
cd /var/www/arbshield
npm install
npm run build
```

#### Step 4: Start Application
```bash
# Start with PM2
pm2 start npm --name "arbshield" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Step 5: Configure Nginx (Optional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/arbshield /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: Setup SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

### Option 3: Docker Deployment

#### Step 1: Create Dockerfile
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Step 2: Create docker-compose.yml
```yaml
version: '3.8'

services:
  arbshield:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}
      - NEXT_PUBLIC_ALCHEMY_API_KEY=${NEXT_PUBLIC_ALCHEMY_API_KEY}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
    restart: unless-stopped
```

#### Step 3: Deploy
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Post-Deployment Checklist

### ✅ Functionality Testing
- [ ] Homepage loads correctly
- [ ] Wallet connection works
- [ ] Network detection works (Arbitrum Mainnet/Sepolia)
- [ ] Passkey authentication works
- [ ] Proof generation works
- [ ] On-chain verification works
- [ ] Portfolio displays correctly
- [ ] Compliance dashboard shows data
- [ ] Identity page functional
- [ ] Analytics page displays stats

### ✅ Performance Monitoring
- [ ] Setup error tracking (Sentry, LogRocket, etc.)
- [ ] Setup analytics (Google Analytics, Plausible, etc.)
- [ ] Monitor API rate limits
- [ ] Monitor RPC endpoint health
- [ ] Setup uptime monitoring (UptimeRobot, Pingdom, etc.)

### ✅ SEO & Social
- [ ] Meta tags configured
- [ ] Open Graph tags set
- [ ] Twitter Card tags set
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Favicon set
- [ ] Social media preview tested

### ✅ Documentation
- [ ] README.md updated with production info
- [ ] API documentation updated
- [ ] User guide created
- [ ] Troubleshooting guide accessible
- [ ] Contact information provided

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Check error logs
- [ ] Monitor transaction success rate
- [ ] Check RPC endpoint status
- [ ] Review user feedback

### Weekly Checks
- [ ] Review analytics
- [ ] Check performance metrics
- [ ] Update dependencies (security patches)
- [ ] Backup database (if applicable)

### Monthly Checks
- [ ] Full security audit
- [ ] Performance optimization
- [ ] Update documentation
- [ ] Review and update roadmap

---

## Rollback Plan

If deployment fails:

### Quick Rollback (Vercel)
```bash
# Rollback to previous deployment
vercel rollback
```

### Manual Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or checkout previous version
git checkout <previous-commit-hash>
git push -f origin main
```

### Emergency Maintenance Mode
Create `public/maintenance.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Maintenance - ArbShield</title>
</head>
<body>
    <h1>Under Maintenance</h1>
    <p>We'll be back soon!</p>
</body>
</html>
```

Redirect all traffic to maintenance page in `next.config.ts`.

---

## Production Environment Variables

### Required Variables
```bash
# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Alchemy (Production)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_production_key

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Contract Addresses (Update in lib/contracts.ts)
```typescript
// For Arbitrum Mainnet
export const CONTRACTS = {
  ZK_VERIFIER: '0x...',
  MOCK_BUIDL: '0x...',
  PASSKEY_REGISTRY: '0x...',
  COMPLIANCE_REGISTRY: '0x...',
  GROTH16_VERIFIER: '0x...',
} as const;

// Network
export const ARBITRUM_MAINNET = {
  id: 42161,
  name: 'Arbitrum One',
  network: 'arbitrum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://arb1.arbitrum.io/rpc'] },
    public: { http: ['https://arb1.arbitrum.io/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
  },
} as const;
```

---

## Success Criteria

Deployment is successful when:
- ✅ All pages load without errors
- ✅ Wallet connection works
- ✅ Verification flow completes successfully
- ✅ Data displays correctly
- ✅ No console errors
- ✅ Performance metrics meet targets
- ✅ Mobile responsive
- ✅ Cross-browser compatible
- ✅ SSL certificate valid
- ✅ Monitoring active

---

## Support & Maintenance

### Emergency Contacts
- **DevOps**: [Your contact]
- **Backend**: [Your contact]
- **Frontend**: [Your contact]

### Service Status
- **Status Page**: https://status.your-domain.com
- **Uptime Monitor**: [Your monitor URL]
- **Error Tracking**: [Your Sentry URL]

### Documentation
- **User Guide**: /docs/user-guide.md
- **API Docs**: /docs/api.md
- **Troubleshooting**: /TROUBLESHOOTING.md

---

## Version History

| Version | Date | Changes | Deployed By |
|---------|------|---------|-------------|
| 1.0.0   | TBD  | Initial release | - |

---

**Deployment Status**: Ready for Production ✅
**Last Updated**: After critical fixes
**Next Review**: After first deployment
