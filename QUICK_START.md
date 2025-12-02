# Elyon ISP - Quick Start Guide

Get up and running in 15 minutes!

## 1️⃣ Prerequisites

- Node.js 18+ ([download](https://nodejs.org))
- Git
- Supabase account (free tier OK)
- MPESA Daraja account (for payments)

## 2️⃣ Clone & Setup

\`\`\`bash
# Clone repository
git clone https://github.com/your-username/elyon-isp-admin.git
cd elyon-isp-admin

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
\`\`\`

## 3️⃣ Get Credentials

### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy:
   - `NEXT_PUBLIC_SUPABASE_URL` from Settings > API
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Settings > API
4. Paste into `.env.local`

### MPESA Daraja
1. Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create app in sandbox
3. Copy:
   - Consumer Key
   - Consumer Secret
   - Test shortcode (e.g., 174379)
   - Test passkey
4. Paste into `.env.local`

### Google Maps
1. Create project: [console.cloud.google.com](https://console.cloud.google.com)
2. Enable Maps APIs
3. Create API key
4. Paste into `.env.local`

### Gemini API
1. Get free key: [ai.google.dev](https://ai.google.dev)
2. Paste into `.env.local`

## 4️⃣ Setup Database

1. Copy entire content of `scripts/init-database.sql`
2. Go to Supabase > SQL Editor
3. Click "New Query"
4. Paste and run the SQL
5. Wait for completion (should show green checkmark)

## 5️⃣ Create Admin Account

\`\`\`bash
# In Supabase Auth > Users, manually create a test user:
# Email: admin@elyon.com
# Password: TestPass123!
\`\`\`

## 6️⃣ Run Application

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

**Login with:**
- Email: `admin@elyon.com`
- Password: `TestPass123!`

## 7️⃣ Test Features

### Dashboard
✅ View real-time stats  
✅ See active subscriptions  
✅ Check revenue

### Clients
✅ View all users  
✅ Filter by type  
✅ View details

### Billing
✅ See transactions  
✅ View revenue breakdown  
✅ Check payment status

### Next Steps
- Add test clients
- Create test packages
- Add test router
- Generate test invoices

---

## Common Errors & Solutions

### "Cannot connect to Supabase"
\`\`\`
Check:
1. NEXT_PUBLIC_SUPABASE_URL is correct
2. NEXT_PUBLIC_SUPABASE_ANON_KEY is valid
3. Project is running (check Supabase dashboard)
\`\`\`

### "MPESA payment not working"
\`\`\`
Check:
1. Consumer credentials are correct
2. Using sandbox shortcode (174379)
3. Phone format is +254...
4. Network connectivity
\`\`\`

### "Database table doesn't exist"
\`\`\`
Solution:
1. Verify SQL script ran successfully
2. Check Supabase SQL Editor for errors
3. Re-run init-database.sql
\`\`\`

### "Build errors"
\`\`\`
Solution:
npm install
npm run build
# Check for TypeScript errors
\`\`\`

---

## File Structure Guide

\`\`\`
elyon-isp-admin/
├── app/
│   ├── api/           ← API endpoints
│   ├── dashboard/     ← Admin dashboard pages
│   ├── layout.tsx     ← Main layout (edit theme here)
│   └── page.tsx       ← Login page
├── components/        ← React components
├── lib/               ← Utilities
├── scripts/           ← Database setup & testing
├── .env.local         ← Your secrets (don't commit!)
└── package.json       ← Dependencies
\`\`\`

## Next Steps

1. **Customize Branding**
   - Edit colors in `app/globals.css`
   - Change company name in components

2. **Add Your Logo**
   - Place in `public/images/`
   - Import in `components/layout/header.tsx`

3. **Deploy to Vercel**
   - Push to GitHub
   - Import project in Vercel
   - Add env variables
   - Deploy!

4. **Enable Production Features**
   - Setup SMTP for emails
   - Configure SMS gateway
   - Add Mikrotik routers
   - Setup webhook domains

---

## Support

- **Questions?** Check `SETUP_GUIDE.md`
- **Architecture?** Read `ARCHITECTURE.md`
- **API Docs?** See endpoint descriptions in `README.md`
- **Issues?** Email support@elyonconcepts.com

---

## You're Ready! 🚀

Now build amazing things with your ISP platform!
