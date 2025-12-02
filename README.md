# Elyon ISP - Internet Billing & Management System

A production-ready ISP management platform built with Next.js, React, TypeScript, and Supabase for billing, payments, and SMS notifications.

## Features

### Core Modules
- **Admin Dashboard** - Real-time analytics and management
- **Client Management** - PPPoE and Hotspot user management
- **Router Management** - Mikrotik integration ready
- **Billing System** - Automated invoicing and MPESA payments
- **Package Management** - Create and manage bandwidth packages
- **SMS Notifications** - Automated payment confirmations, expiry reminders
- **Multi-tenant System** - Reseller support with commission tracking

### User Types
1. **Admin** - Full system access and management
2. **Reseller** - Manage their own clients and packages
3. **PPPoE Users** - Home internet with monthly subscriptions
4. **Hotspot Users** - Street WiFi with hourly/daily/weekly plans

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: MPESA Daraja API
- **SMS**: Africa's Talking / Twilio API
- **Router Control**: Mikrotik API (integration ready)

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- MPESA Daraja credentials
- SMS provider account (Africa's Talking or Twilio)

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd elyon-isp
npm install
\`\`\`

2. **Configure environment variables**
\`\`\`bash
cp .env.example .env.local
\`\`\`

3. **Setup Supabase database**
- Run `scripts/init-database-isp-only.sql` in Supabase SQL editor
- Run `scripts/add-sms-module.sql` for SMS tables

4. **Run development server**
\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

## Project Structure

\`\`\`
elyon-isp/
├── app/
│   ├── api/                     # API routes
│   ├── dashboard/               # Admin dashboard
│   ├── client/                  # Client portal
│   ├── hotspot/                 # Hotspot portal
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx                 # Login page
├── components/
│   ├── auth/
│   ├── layout/
│   ├── dashboard/
│   ├── client/
│   └── ui/
├── lib/
│   ├── supabase-client.ts
│   ├── sms-client.ts
│   └── utils.ts
├── scripts/
│   ├── init-database-isp-only.sql
│   └── add-sms-module.sql
├── public/
├── .env.example
└── package.json
\`\`\`

## Database Schema

### Core Tables (13 total)
- `users` - All system users
- `packages` - Service packages
- `subscriptions` - Active subscriptions
- `transactions` - Payment records
- `invoices` - Billing documents
- `routers` - Mikrotik configurations
- `bandwidth_profiles` - Speed limits
- `ip_pools` - IP ranges
- `sms_templates` - Message templates
- `sms_logs` - Delivery tracking
- `sms_campaigns` - Bulk campaigns
- `reseller_config` - Reseller settings
- `audit_logs` - Activity logs

## API Routes

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout

### Clients
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client
- `PATCH /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Billing
- `GET /api/billing/transactions` - List transactions
- `POST /api/billing/transactions` - Create transaction
- `GET /api/billing/invoices` - List invoices

### SMS
- `POST /api/sms/send` - Send SMS
- `POST /api/sms/bulk-send` - Bulk campaign
- `POST /api/sms/expiry-notifications` - Expiry reminders
- `GET /api/sms/logs` - View logs
- `GET /api/sms/templates` - List templates

### Webhooks
- `POST /api/webhooks/mpesa-callback` - MPESA confirmation

## Deployment

### Vercel (Recommended)
\`\`\`bash
git push origin main
# Vercel auto-deploys
\`\`\`

### Self-hosted
\`\`\`bash
npm run build
npm start
\`\`\`

## Configuration

See [COMPLETE_SETUP.md](./COMPLETE_SETUP.md) for detailed setup instructions including:
- Supabase configuration
- MPESA integration
- SMS provider setup
- Google Maps setup

## Support

- **Email**: support@elyonconcepts.com
- **Phone**: +254 795 673 453
- **Docs**: [COMPLETE_SETUP.md](./COMPLETE_SETUP.md)

## License

© 2025 Elyon Concepts Ltd. All rights reserved.
