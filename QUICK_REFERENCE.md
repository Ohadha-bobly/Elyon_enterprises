# Quick Reference Card

## 🚀 Getting Started (5 Minutes)

\`\`\`bash
# 1. Install
npm install

# 2. Create Supabase project and copy URL + keys

# 3. Configure
cp .env.example .env.local
# Edit .env.local with credentials

# 4. Initialize database
# In Supabase SQL Editor, run scripts/init-database-isp-only.sql

# 5. Run
npm run dev
# Visit http://localhost:3000
\`\`\`

## 📍 URLs

| System | URL |
|--------|-----|
| Admin | http://localhost:3000/dashboard |
| Client | http://localhost:3000/client |
| Hotspot | http://localhost:3000/hotspot |

## 👤 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Reseller | reseller@example.com | reseller123 |
| PPPoE User | user@example.com | user123 |

## 📊 Database

| Table | Count | Purpose |
|-------|-------|---------|
| users | - | All accounts |
| packages | - | Plans |
| subscriptions | - | Active services |
| transactions | - | Payments |
| sms_logs | - | SMS tracking |

\`\`\`sql
-- Connect to database
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
\`\`\`

## 🔌 API Quick Test

\`\`\`bash
# Login (get token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get clients
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get packages
curl -X GET http://localhost:3000/api/client/packages

# Send SMS
curl -X POST http://localhost:3000/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number":"+254701234567",
    "message":"Test SMS"
  }'
\`\`\`

## ⚙️ Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Main layout |
| `app/dashboard/page.tsx` | Admin dashboard |
| `app/client/page.tsx` | Client portal |
| `lib/supabase-client.ts` | DB connection |
| `lib/sms-client.ts` | SMS integration |
| `scripts/init-database-isp-only.sql` | DB schema |

## 🛠️ Common Tasks

### Add Admin User
\`\`\`sql
INSERT INTO users (email, phone, user_type)
VALUES ('admin@example.com', '+254701234567', 'admin');
\`\`\`

### Create Package
\`\`\`sql
INSERT INTO packages (name, bandwidth_mbps, price_monthly)
VALUES ('Premium 10Mbps', 10, 1500);
\`\`\`

### View Transactions
\`\`\`sql
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;
\`\`\`

### Check SMS Logs
\`\`\`sql
SELECT * FROM sms_logs ORDER BY created_at DESC LIMIT 20;
\`\`\`

## 📱 Admin Features

| Feature | Access | Shortcut |
|---------|--------|----------|
| Dashboard | `/dashboard` | Click logo |
| Clients | `/dashboard/clients` | Left menu |
| Packages | `/dashboard/packages` | Left menu |
| Billing | `/dashboard/billing` | Left menu |
| SMS | `/dashboard/sms` | Left menu |
| Reports | `/dashboard/reports` | Left menu |

## 🛒 Client Features

| Feature | Access | Action |
|---------|--------|--------|
| Browse | `/client/packages` | Auto on login |
| Purchase | `/client/checkout` | Click "Buy" |
| View Account | `/client/subscriptions` | Dashboard |
| Pay Invoice | `/client/account` | Payment section |
| View Bills | `/client/invoices` | Billing menu |

## 🔐 Security Checklist

- [ ] Change default passwords
- [ ] Configure SSL/HTTPS
- [ ] Set strong database password
- [ ] Rotate API keys periodically
- [ ] Enable backups
- [ ] Configure rate limiting
- [ ] Set up monitoring/alerts
- [ ] Enable audit logging

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| DB connection fails | Check SUPABASE_URL and keys |
| SMS not sending | Verify SMS_API_KEY and balance |
| MPESA callback fails | Check MPESA_CALLBACK_URL is public |
| Login fails | Verify auth credentials |
| 404 on routes | Check Next.js dev server running |

## 📞 Support

- **Docs**: See `.md` files in root
- **Email**: support@elyonconcepts.com
- **Phone**: +254 795 673 453

## 💾 Backup & Recovery

\`\`\`bash
# Backup database (via Supabase)
# Settings > Backups > Create backup

# Export data
# In Supabase, use Export feature

# Restore from backup
# Contact Supabase support
\`\`\`

## 🚀 Deployment

### Vercel (1 minute)
\`\`\`bash
# Push to GitHub first
git push origin main

# Then in Vercel dashboard
# Import > Select repo > Add env vars > Deploy
\`\`\`

### Self-hosted
\`\`\`bash
npm run build
npm start
# Configure nginx reverse proxy
# Set up SSL with Let's Encrypt
\`\`\`

---

**Need Help?** Check the documentation in the root directory.
