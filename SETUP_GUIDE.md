# Elyon ISP - Internet Billing & Management System
## Complete Setup Guide

### Overview
This is a production-grade Internet Service Provider (ISP) billing and management system supporting:
- PPPoE (home internet) users with monthly subscriptions
- Hotspot (WiFi) users with hourly/daily/weekly subscriptions  
- Multi-tenant reseller management
- Real-time messaging and communities
- Hospital/clinic directory with maps
- Automated MPESA payments
- Mikrotik router integration

---

## Phase 1: Project Setup

### 1.1 Prerequisites
- Node.js 18+ 
- Git
- Vercel account (for deployment)
- Supabase account (for database/auth)
- MPESA Daraja API credentials
- Google Maps API key (for hospital search)

### 1.2 Clone & Install

\`\`\`bash
# Clone repository
git clone <your-repo-url>
cd elyon-isp-admin

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
\`\`\`

### 1.3 Environment Variables

Create `.env.local` file:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# MPESA Daraja API
NEXT_PUBLIC_MPESA_CONSUMER_KEY=your-consumer-key
NEXT_PUBLIC_MPESA_CONSUMER_SECRET=your-consumer-secret
NEXT_PUBLIC_MPESA_SHORTCODE=your-shortcode
NEXT_PUBLIC_MPESA_PASSKEY=your-passkey

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# AI Chatbot (Gemini)
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key

# Mikrotik Configuration
MIKROTIK_HOST=your-mikrotik-ip
MIKROTIK_USERNAME=admin
MIKROTIK_PASSWORD=your-password
MIKROTIK_PORT=8728
\`\`\`

---

## Phase 2: Supabase Setup

### 2.1 Create Tables

Access your Supabase dashboard and run the SQL script in `scripts/init-database.sql`:

**Key tables created:**
- `users` - Admin, reseller, PPPoE users
- `hotspot_users` - WiFi hotspot users
- `packages` - Bandwidth packages  
- `routers` - Mikrotik router configurations
- `subscriptions` - Active user subscriptions
- `transactions` - MPESA payment records
- `communities` - Community groups
- `messages` - Real-time messaging
- `hospitals` - Hospital/clinic directory
- `invoices` - Billing records

### 2.2 Enable Realtime

In Supabase dashboard:

1. Go to **Database > Realtime**
2. Enable realtime for tables:
   - `messages`
   - `subscriptions`
   - `transactions`

### 2.3 Setup Row Level Security (RLS)

Enable RLS on all tables and apply appropriate policies:

\`\`\`sql
-- Example: Allow users to see their own data
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);
\`\`\`

### 2.4 Setup Authentication

1. Go to **Authentication > Providers**
2. Ensure Email/Password is enabled
3. Set up email templates for:
   - Confirmation
   - Password reset
   - Invitations

---

## Phase 3: MPESA Integration

### 3.1 Get Daraja Credentials

1. Register at [MPESA Developer Portal](https://developer.safaricom.co.ke)
2. Create an app and get:
   - Consumer Key
   - Consumer Secret
   - Shortcode
   - Passkey (for STK push)

### 3.2 Configure Webhook

Add webhook URL in your environment:

\`\`\`
https://your-domain.com/api/webhooks/mpesa-callback
\`\`\`

### 3.3 Test Payment Integration

\`\`\`bash
npm run test:mpesa
\`\`\`

---

## Phase 4: Mikrotik Router Setup

### 4.1 Generate API User

SSH into Mikrotik:

\`\`\`bash
# SSH to router
ssh admin@<router-ip>

# Create API user
/user add name=api-user password=strong-password group=full

# Enable API
/ip service enable api
\`\`\`

### 4.2 Configure in Admin Dashboard

1. Navigate to **Settings > Routers**
2. Add router:
   - IP Address
   - API Port (8728)
   - Username/Password
   - Test connection

---

## Phase 5: Running the Application

### 5.1 Development

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

### 5.2 Build & Deploy

\`\`\`bash
# Build
npm run build

# Test production build locally
npm start

# Deploy to Vercel
vercel deploy --prod
\`\`\`

---

## Phase 6: Module Usage

### Admin Dashboard
- **URL**: `/dashboard`
- **Features**: 
  - Real-time analytics
  - Client management
  - Router monitoring
  - Revenue tracking

### Client Portal
- **URL**: `/client`
- **Features**:
  - View subscriptions
  - Pay invoices
  - Check usage
  - Support tickets

### Hotspot Portal
- **URL**: `/hotspot`
- **Features**:
  - Sign up
  - MPESA payment
  - STK push
  - Instant activation

### API Endpoints

**Authentication**
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create account
- `POST /api/auth/logout` - Logout

**Clients**
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

**Billing**
- `GET /api/billing/invoices` - List invoices
- `POST /api/billing/invoices` - Generate invoice
- `GET /api/billing/transactions` - List transactions

**Routers**
- `GET /api/routers` - List routers
- `POST /api/routers` - Add router
- `GET /api/routers/:id/status` - Router status

**Packages**
- `GET /api/packages` - List packages
- `POST /api/packages` - Create package
- `PUT /api/packages/:id` - Update package

**Communities**
- `GET /api/communities` - List communities
- `POST /api/communities` - Create community
- `POST /api/communities/:id/join` - Join community
- `GET /api/communities/:id/messages` - Get messages

**Hospitals**
- `GET /api/hospitals` - List hospitals
- `GET /api/hospitals/nearby` - Find nearby
- `POST /api/hospitals` - Add hospital

**Chatbot**
- `POST /api/chatbot/message` - Send message to AI
- `GET /api/chatbot/health-tips` - Get health tips

---

## Database Schema Highlights

### Users Table
\`\`\`
- id (UUID)
- email (string, unique)
- phone (string)
- user_type (admin | reseller | pppoe | hotspot)
- status (active | suspended)
- created_at
\`\`\`

### Subscriptions Table
\`\`\`
- id (UUID)
- user_id (FK)
- package_id (FK)
- subscription_type (pppoe | hotspot)
- status (active | expired | suspended)
- start_date
- end_date
- amount_paid
\`\`\`

### Transactions Table
\`\`\`
- id (UUID)
- user_id (FK)
- amount (decimal)
- payment_method (mpesa | bank)
- mpesa_receipt (string)
- status (pending | completed | failed)
- created_at
\`\`\`

---

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] RLS policies applied
- [ ] MPESA credentials verified
- [ ] Mikrotik router connected
- [ ] Email templates configured
- [ ] Backup strategy in place
- [ ] SSL certificate installed
- [ ] Monitoring setup
- [ ] Documentation complete

---

## Troubleshooting

### Connection Issues
\`\`\`bash
# Test Supabase connection
npm run test:db

# Test MPESA API
npm run test:mpesa

# Test Mikrotik connection
npm run test:mikrotik
\`\`\`

### Common Issues

**"Cannot connect to Supabase"**
- Verify URL and keys in `.env.local`
- Check Supabase project is running
- Verify network connectivity

**"MPESA payment fails"**
- Check API credentials
- Verify phone number format (+254...)
- Check account balance in Daraja

**"Mikrotik connection timeout"**
- Verify IP address is correct
- Check firewall rules
- Ensure API service is enabled

---

## Support

For issues or questions:
- Email: support@elyonconcepts.com
- Phone: +254 795 673 453
- Documentation: https://docs.elyonconcepts.com

---

## License

© 2025 Elyon Concepts Ltd. All rights reserved.
