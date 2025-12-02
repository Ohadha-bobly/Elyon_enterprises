# ISP Billing & Management System - Focus & Features

This is a **pure Internet Service Provider (ISP) management system** - no health, wellness, or unrelated features.

## Three-Tier Platform Architecture

### 1. Admin Dashboard (Admin Users)
- System configuration and management
- User and package administration
- Router and bandwidth management
- Revenue tracking and reporting
- SMS campaign management
- Reseller commission tracking

**URL**: `http://localhost:3000/dashboard`
**Access**: Admin/Reseller login only

### 2. Client Portal (PPPoE & Package Buyers)
- Browse and purchase internet packages
- View subscription details
- Payment via MPESA
- Usage tracking
- Invoice management
- Account settings

**URL**: `http://localhost:3000/client`
**Access**: Self-registration or admin-created accounts

### 3. Hotspot Captive Portal (WiFi Users)
- Splash page for WiFi networks
- Quick package purchase
- Hourly/Daily/Weekly subscriptions
- Automatic account activation
- Real-time usage display

**URL**: Redirected from WiFi login
**Access**: Public - no account required initially

## Core Features

### Internet Service Management
- ✅ PPPoE subscriptions (monthly)
- ✅ Hotspot WiFi packages (daily/weekly/hourly)
- ✅ Reseller accounts
- ✅ Bandwidth profiles and speed limiting
- ✅ Data cap enforcement

### Package Management
- ✅ Create speed/data plans
- ✅ Set pricing per package
- ✅ Define contract periods
- ✅ Apply discounts
- ✅ Bulk package assignment

### User Management
- ✅ Admin account creation
- ✅ PPPoE user management
- ✅ Hotspot user tracking
- ✅ Reseller partner setup
- ✅ Auto-suspend on expiry
- ✅ Bulk user import

### Payment Processing
- ✅ MPESA Daraja integration
- ✅ STK Push for mobile payments
- ✅ Payment page checkout
- ✅ Payment confirmation
- ✅ Automatic subscription activation
- ✅ Invoice generation
- ✅ Manual payment entry

### SMS Notifications
- ✅ Payment confirmations
- ✅ Expiry reminders (7, 3, 1 day)
- ✅ Renewal confirmations
- ✅ Service suspension notices
- ✅ Bulk SMS campaigns
- ✅ Campaign scheduling
- ✅ Delivery tracking

### Router Integration
- ✅ Mikrotik router configuration
- ✅ User provisioning to routers
- ✅ Bandwidth profile assignment
- ✅ Real-time session tracking
- ✅ Automatic disconnection
- ✅ Router status monitoring

### Reporting & Analytics
- ✅ Revenue reports
- ✅ User growth metrics
- ✅ Subscription analytics
- ✅ Payment trends
- ✅ SMS delivery reports
- ✅ Router performance
- ✅ Churn analysis
- ✅ Data export (CSV/PDF)

## User Roles

### 1. Super Admin
- Full system access
- User management
- Payment processing
- SMS campaigns
- Reporting

### 2. Admin/Staff
- Limited admin functions
- User support
- Payment processing
- SMS sending

### 3. Reseller
- Manage own customers
- View own revenue
- Limited user management
- Commission tracking

### 4. PPPoE User
- View subscription
- Pay invoices
- Usage tracking
- Account settings

### 5. Hotspot User
- Quick purchase
- No account needed initially
- Automatic activation
- Usage display

## Database Schema

### Core Tables
- `users` - All user accounts
- `packages` - Internet plans
- `subscriptions` - Active services
- `transactions` - Payments
- `invoices` - Billing documents

### Router Management
- `routers` - Mikrotik configs
- `bandwidth_profiles` - Speed limits
- `ip_pools` - IP ranges

### Financial
- `transactions` - Payment history
- `invoices` - Generated bills
- `revenue_logs` - Income tracking

### SMS
- `sms_templates` - Message templates
- `sms_logs` - Delivery tracking
- `sms_campaigns` - Bulk campaigns

### Support
- `audit_logs` - System activity
- `error_logs` - System errors
- `api_logs` - API requests

## API Endpoints

### Authentication
\`\`\`
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/register
\`\`\`

### Admin - Users
\`\`\`
GET    /api/clients
POST   /api/clients
PATCH  /api/clients/:id
DELETE /api/clients/:id
GET    /api/clients/:id/subscriptions
\`\`\`

### Admin - Packages
\`\`\`
GET    /api/packages
POST   /api/packages
PATCH  /api/packages/:id
DELETE /api/packages/:id
\`\`\`

### Admin - Billing
\`\`\`
GET    /api/billing/transactions
POST   /api/billing/transactions
GET    /api/billing/invoices
GET    /api/billing/revenue
\`\`\`

### Admin - SMS
\`\`\`
POST   /api/sms/send
POST   /api/sms/bulk-send
POST   /api/sms/campaigns
GET    /api/sms/logs
GET    /api/sms/templates
PATCH  /api/sms/templates/:id
\`\`\`

### Client Portal
\`\`\`
GET    /api/client/packages
POST   /api/client/subscriptions
GET    /api/client/subscriptions
GET    /api/client/invoices
GET    /api/client/usage
PATCH  /api/client/profile
\`\`\`

### Payment Webhooks
\`\`\`
POST   /api/webhooks/mpesa-callback
\`\`\`

## Integration Points

### External Services
- **MPESA Daraja API** - Payment processing
- **Africa's Talking API** - SMS delivery
- **Twilio API** - Alternative SMS
- **Mikrotik API** - Router management

### Data Flow
1. Client purchases package via portal
2. Initiates MPESA payment
3. Payment confirmed via callback
4. SMS sent confirming payment
5. Subscription activated in system
6. Router receives configuration
7. User connected to internet
8. Usage tracked in real-time
9. Expiry reminders sent (7, 3, 1 days)
10. Auto-suspend on expiry

## Removed Features
- ❌ Hospitals/clinics search
- ❌ Health/wellness tracking
- ❌ Medical chatbot
- ❌ Community messaging
- ❌ Donation system
- ❌ Flutter mobile app

## What's Included
- ✅ Enterprise-grade ISP platform
- ✅ Multi-tenant reseller support
- ✅ Real-time analytics
- ✅ Automated billing
- ✅ SMS integration
- ✅ Router management
- ✅ Payment processing
- ✅ Complete API

## Next Steps

1. Configure environment variables
2. Initialize Supabase database
3. Set up MPESA credentials
4. Configure SMS provider
5. Create admin account
6. Add internet packages
7. Test payment flow
8. Deploy to production

---

**Contact**: +254 795 673 453
**Email**: support@elyonconcepts.com
