# Elyon ISP - Complete Setup & Installation Guide

Complete setup instructions for the Internet Billing & Management System with SMS integration, MPESA payments, and multi-user management.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Project Setup](#project-setup)
4. [Environment Configuration](#environment-configuration)
5. [SMS Integration](#sms-integration)
6. [Payment Integration (MPESA)](#payment-integration)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase** account (free tier available)
- **SMS Provider** account (Africa's Talking or Twilio)
- **MPESA API** credentials (if using M-Pesa)
- **Google Maps API** key
- **Gemini API** key (optional, for chatbot)

---

## Database Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or login
3. Click "New Project"
4. Choose a name: `elyon-isp` or similar
5. Set a strong database password
6. Select region closest to you (East Africa recommended)
7. Click "Create new project" and wait 1-2 minutes

### Step 2: Initialize Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Create new query
3. Copy entire content of `scripts/init-database.sql`
4. Paste and run the query
5. Wait for completion (you'll see green checkmark)

### Step 3: Add SMS Module Tables

1. In SQL Editor, create new query
2. Copy entire content of `scripts/add-sms-module.sql`
3. Paste and run
4. This adds SMS templates, logs, and campaign tables

### Step 4: Verify Database

In **Table Editor**, you should see these tables:
- users
- routers
- packages
- subscriptions
- transactions
- invoices
- communities
- community_members
- messages
- direct_messages
- donations
- chatbot_conversations
- reseller_config
- audit_logs
- sms_templates
- sms_logs
- sms_campaigns
- sms_provider_config
- expiry_notifications_sent

---

## Project Setup

### Step 1: Clone/Download Project

\`\`\`bash
# Clone if using Git
git clone <repository-url> elyon-isp
cd elyon-isp

# Or download ZIP and extract
unzip elyon-isp.zip
cd elyon-isp
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

This installs:
- next
- react
- typescript
- @supabase/ssr
- @supabase/supabase-js
- axios
- recharts
- lucide-react
- and more

### Step 3: Verify Installation

\`\`\`bash
npm run build
\`\`\`

This compiles TypeScript and builds the project. Should complete without errors.

---

## Environment Configuration

### Step 1: Create .env.local File

In your project root, create `.env.local` file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### Step 2: Fill Supabase Credentials

From Supabase dashboard:

1. Go to **Settings** → **API**
2. Copy and paste:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

3. Go to **Authentication** → **Policies**
4. Find JWT secret and copy → `SUPABASE_JWT_SECRET`

Your `.env.local` should look like:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR...
SUPABASE_JWT_SECRET=your-jwt-secret-here
\`\`\`

### Step 3: Verify Connection

Run test script:
\`\`\`bash
npm run test-db
\`\`\`

You should see: ✅ Connected to Supabase successfully

---

## SMS Integration

### Step 1: Choose SMS Provider

#### Option A: Africa's Talking (Recommended)

**Cost:** ~0.50 KES per SMS  
**Delivery:** 99%+  
**Setup Time:** 5 minutes

Steps:
1. Go to [africastalking.com](https://africastalking.com)
2. Sign up for free account
3. Create an app
4. Go to **Settings** → **API Keys**
5. Copy API Key

In `.env.local`:
\`\`\`env
SMS_PROVIDER=africas_talking
SMS_API_KEY=your_api_key_here
AFRICAS_TALKING_USERNAME=sandbox
SMS_SENDER_ID=Elyon
\`\`\`

#### Option B: Twilio

**Cost:** ~0.75 KES per SMS  
**Coverage:** Global  
**Setup Time:** 10 minutes

Steps:
1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for free account
3. Verify phone number
4. Purchase SMS number
5. Copy Account SID and Auth Token

In `.env.local`:
\`\`\`env
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
SMS_SENDER_ID=Elyon
\`\`\`

### Step 2: Test SMS Sending

In admin dashboard, go to **SMS Management** → **Logs**

Create test message:
\`\`\`bash
curl -X POST http://localhost:3000/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "templateKey": "payment_confirmation",
    "variables": {
      "customer_name": "John",
      "amount": "500",
      "expiry_date": "2024-12-31"
    }
  }'
\`\`\`

### Step 3: Set Up Automated Notifications

Add to crontab (Linux/Mac):
\`\`\`bash
# Run expiry notifications daily at 9 AM
0 9 * * * curl -X POST https://yourdomain.com/api/sms/expiry-notifications
\`\`\`

Or use Vercel Cron Jobs (recommended):

Create `vercel.json`:
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

---

## Payment Integration (MPESA)

### Step 1: Get MPESA Credentials

1. Visit [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create developer account
3. Create new app
4. Get:
   - Consumer Key
   - Consumer Secret
   - Business Short Code
   - Passkey

### Step 2: Configure Environment

In `.env.local`:
\`\`\`env
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_BUSINESS_SHORT_CODE=123456
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/webhooks/mpesa-callback
\`\`\`

### Step 3: Set Callback URL in MPESA Portal

1. Login to MPESA developer portal
2. Go to **Settings** → **Callback URLs**
3. Add callback URL:
   \`\`\`
   https://yourdomain.com/api/webhooks/mpesa-callback
   \`\`\`

### Step 4: Create Admin User for Testing

In Supabase **SQL Editor**:
\`\`\`sql
-- Create admin user
INSERT INTO users (email, phone, first_name, last_name, user_type, status)
VALUES (
  'admin@elyon.com',
  '+254700000000',
  'Admin',
  'User',
  'admin',
  'active'
);
\`\`\`

---

## Google Maps Setup (for Hospital Search)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable **Maps API**
4. Create API key
5. Add to `.env.local`:

\`\`\`env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
\`\`\`

---

## Gemini AI Setup (Optional)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to `.env.local`:

\`\`\`env
GEMINI_API_KEY=your_api_key
\`\`\`

---

## Testing

### Step 1: Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Server runs at `http://localhost:3000`

### Step 2: Test Login

1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Create admin account with email and password
4. Login with credentials

### Step 3: Create Test User

In admin dashboard:
1. Navigate to **Clients** → **Add New Client**
2. Fill form:
   - Name: Test User
   - Phone: +254700000000
   - User Type: PPPoE
   - Status: Active
3. Click Add

### Step 4: Test SMS

1. Go to **SMS Management** → **Send SMS**
2. Select test user
3. Choose template: "Payment Confirmation"
4. Send
5. Check SMS logs for delivery status

### Step 5: Test Payment (Sandbox)

1. In **Billing**, create invoice for test user
2. User receives SMS to pay
3. Simulate MPESA payment
4. Webhook fires and subscription activates
5. User receives confirmation SMS

---

## File Structure

\`\`\`
elyon-isp/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── clients/
│   │   ├── billing/
│   │   ├── sms/
│   │   ├── webhooks/
│   │   └── ...
│   ├── dashboard/
│   │   ├── page.tsx (main dashboard)
│   │   ├── clients/
│   │   ├── billing/
│   │   ├── sms/
│   │   └── ...
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── layout/
│   └── dashboard/
├── lib/
│   ├── supabase-client.ts
│   ├── sms-client.ts
│   └── utils.ts
├── scripts/
│   ├── init-database.sql
│   └── add-sms-module.sql
├── public/
├── .env.example
├── package.json
├── tsconfig.json
└── next.config.js
\`\`\`

---

## Troubleshooting

### Database Connection Failed
\`\`\`bash
# Verify credentials
NEXT_PUBLIC_SUPABASE_URL should start with: https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY should be: eyJh...
\`\`\`

### SMS Not Sending
- Check provider balance
- Verify API credentials
- Check phone number format (+254...)
- Review SMS logs for error messages

### MPESA Callback Not Working
- Verify callback URL is HTTPS and public
- Check firewall allows incoming requests
- Test with Africa's Talking SMS simulator first

### Port 3000 Already in Use
\`\`\`bash
# Use different port
npm run dev -- -p 3001
\`\`\`

---

## Production Deployment

### Option 1: Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy

\`\`\`bash
git push origin main
# Vercel automatically deploys
\`\`\`

### Option 2: Deploy to Custom Server

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

### Production Checklist

- [ ] Use production SMS provider (not sandbox)
- [ ] Use production MPESA credentials
- [ ] Enable HTTPS/SSL
- [ ] Set strong database password
- [ ] Enable RLS on all tables
- [ ] Configure backup strategy
- [ ] Set up monitoring/alerts
- [ ] Update domain in MPESA callback

---

## Support & Next Steps

### Getting Help
- Check logs in `/app/dashboard/sms/logs`
- Review Supabase dashboard for database issues
- Test endpoints with Postman
- Contact: support@elyon.com or +254 795 673 453

### Next Features to Build
1. Hotspot captive portal
2. PPPoE user management
3. Reseller dashboard
4. Advanced analytics
5. Mobile app (Flutter)

---

## Quick Reference - Common Commands

\`\`\`bash
# Development
npm run dev                 # Start dev server
npm run build             # Build for production
npm run test-db           # Test database connection

# Database
# Access Supabase SQL Editor and run scripts

# Deployment
git push origin main      # Deploy to Vercel
npm run build && npm start  # Local production

# Debugging
console.log("[v0] ...")  # Debug logs
\`\`\`

---

## Success Indicators

You'll know setup is complete when:

✅ Admin can login  
✅ Can see dashboard with real-time data  
✅ SMS logs show sent messages  
✅ Payment confirmation SMS received  
✅ Subscriptions auto-activate on payment  
✅ Expiry reminders send automatically  
✅ Can create and manage SMS campaigns  

---

**Version:** 1.0  
**Last Updated:** November 2024  
**Support:** Elyon Concepts Ltd - +254 795 673 453
