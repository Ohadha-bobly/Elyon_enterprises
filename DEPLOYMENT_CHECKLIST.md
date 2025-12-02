# Deployment Checklist

Complete checklist for deploying Elyon ISP system to production.

## Pre-Deployment

### Code & Version Control
- [ ] All code committed to git
- [ ] No sensitive data in repository
- [ ] Environment variables in .env.local (not committed)
- [ ] Build succeeds: `npm run build`
- [ ] No console errors or warnings

### Database
- [ ] Supabase project created
- [ ] All migrations run (init-database.sql, add-sms-module.sql)
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Backups configured
- [ ] Database user created with limited permissions

### Security
- [ ] API keys rotated
- [ ] Passwords changed from defaults
- [ ] SSL/HTTPS certificate installed
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all forms

### Integrations
- [ ] Supabase credentials verified
- [ ] SMS provider credentials (live, not sandbox)
- [ ] MPESA credentials (production)
- [ ] Google Maps API key active
- [ ] All webhooks configured

### Testing
- [ ] Login flow tested
- [ ] User creation tested
- [ ] SMS sending tested (real provider)
- [ ] Payment webhook tested
- [ ] All API endpoints tested
- [ ] Database queries optimized

---

## Deployment Steps

### Step 1: Deploy to Vercel (Recommended)

\`\`\`bash
# 1. Ensure code is clean
git add .
git commit -m "Ready for production deployment"

# 2. Push to GitHub
git push origin main

# 3. In Vercel dashboard:
# - Import repository
# - Add environment variables
# - Deploy
\`\`\`

Or use Vercel CLI:
\`\`\`bash
npm i -g vercel
vercel login
vercel
# Follow prompts to deploy
\`\`\`

### Step 2: Configure Environment Variables in Vercel

In Vercel dashboard → Project Settings → Environment Variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...
SUPABASE_JWT_SECRET=...
SMS_PROVIDER=africas_talking
SMS_API_KEY=...
SMS_SENDER_ID=Elyon
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_BUSINESS_SHORT_CODE=123456
MPESA_PASSKEY=...
MPESA_CALLBACK_URL=https://yourdomain.vercel.app/api/webhooks/mpesa-callback
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
GEMINI_API_KEY=...
\`\`\`

### Step 3: Configure MPESA Callback URL

1. In MPESA developer portal
2. Go to Settings → Callback URLs
3. Update to production URL:
   \`\`\`
   https://yourdomain.vercel.app/api/webhooks/mpesa-callback
   \`\`\`

### Step 4: Configure SMS Provider

For Africa's Talking:
1. Switch from sandbox to production
2. Update SMS_API_KEY to production key
3. Redeploy

### Step 5: Set Up Cron Jobs

In `vercel.json`:
\`\`\`json
{
  "crons": [
    {
      "path": "/api/sms/expiry-notifications",
      "schedule": "0 9 * * *"
    }
  ]
}
\`\`\`

Deploy:
\`\`\`bash
git add vercel.json
git commit -m "Add cron jobs"
git push origin main
\`\`\`

### Step 6: Set Up Monitoring

1. In Vercel dashboard → Analytics
2. Enable real-time monitoring
3. Set up alerts for:
   - Build failures
   - High error rates
   - Slow API responses

### Step 7: Create Admin Account

1. Go to production domain
2. Sign up with admin email
3. Update user_type to 'admin' in Supabase
4. Verify login works

---

## Post-Deployment

### Immediate After Deployment
- [ ] Test login with new domain
- [ ] Send test SMS
- [ ] Verify SMS logs
- [ ] Check database connections
- [ ] Test payment callback
- [ ] Review error logs

### First Week
- [ ] Monitor SMS delivery rates
- [ ] Check payment webhook logs
- [ ] Review performance metrics
- [ ] Get user feedback
- [ ] Fix any issues found

### First Month
- [ ] Analyze usage patterns
- [ ] Optimize database queries
- [ ] Review SMS costs
- [ ] Check error logs for patterns
- [ ] Plan scaling if needed

---

## Monitoring & Maintenance

### Daily Checks
- [ ] SMS delivery rates > 98%
- [ ] No pending transactions
- [ ] No failed API calls
- [ ] SMS credits > 100

### Weekly Checks
- [ ] Database backup completed
- [ ] Error logs reviewed
- [ ] Payment reconciliation
- [ ] User complaints resolved

### Monthly Checks
- [ ] Full system health check
- [ ] Security audit
- [ ] Performance optimization
- [ ] Cost analysis
- [ ] Feature request evaluation

---

## Troubleshooting Deployments

### Build Fails
\`\`\`bash
# Check for errors
npm run build

# Clear cache
rm -rf .next node_modules
npm install
npm run build
\`\`\`

### SMS Not Sending
- Verify provider credentials in Vercel
- Check SMS logs in Supabase
- Verify phone number format (+254...)
- Check provider account balance

### Payments Not Working
- Verify MPESA callback URL is correct
- Check webhook logs
- Test with simulator first
- Verify credentials in Vercel

### Database Connection Issues
- Verify Supabase credentials
- Check database is not paused
- Verify firewall allows connections
- Check RLS policies

---

## Rollback Plan

If issues occur:

\`\`\`bash
# Revert to previous version
git revert <commit-hash>
git push origin main

# Or deploy specific commit
vercel deploy <commit-hash>

# Check logs
vercel logs
\`\`\`

---

## Performance Targets

- **Page Load Time:** < 2 seconds
- **API Response Time:** < 500ms
- **SMS Delivery Rate:** > 98%
- **Database Query Time:** < 100ms
- **Uptime:** > 99.5%

---

## Support Contacts

- **Tech Support:** support@elyon.com
- **Emergency:** +254 795 673 453
- **SMS Provider Support:** [Provider specific]
- **MPESA Support:** developer.safaricom.co.ke

---

**Last Updated:** November 2024  
**Maintained By:** Elyon Concepts Ltd
