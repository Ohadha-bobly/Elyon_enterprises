# Client Portal - User Guide

## Overview

The Client Portal is where PPPoE and internet package customers can:
- Browse available internet packages
- Purchase and manage subscriptions
- Make payments via MPESA
- View usage and invoices
- Manage their account

## Access Points

### URL
- **Development**: `http://localhost:3000/client`
- **Production**: `https://yourdomain.com/client`

## Features

### 1. Package Browsing
**Path**: `/client/packages`

- View all available internet packages
- Filter by:
  - Package type (PPPoE, Hotspot)
  - Speed (Mbps)
  - Price range
  - Contract period
- Sort by:
  - Price (low to high)
  - Speed (high to low)
  - Popularity
  - Newest first

**Package Details**:
- Name and description
- Download/Upload speeds
- Data cap (if applicable)
- Monthly/one-time price
- Contract terms
- "Purchase" button

### 2. Shopping Cart
**Path**: `/client/checkout`

**Features**:
- Add packages to cart
- Adjust quantities
- View subtotal
- Apply promotional codes
- View payment breakdown
- Proceed to checkout

**Cart Items Show**:
- Package name and details
- Selected period (monthly, weekly, daily)
- Unit price
- Quantity
- Total price

### 3. Payment Processing
**Path**: `/client/checkout` (Payment Step)

**Payment Methods**:
- MPESA (primary)
- STK Push (mobile phones)
- Payment page (QR code)

**MPESA Payment Flow**:
1. Enter phone number
2. Select payment type (STK Push/Payment Page)
3. Confirm amount
4. Complete payment on phone
5. System confirms automatically
6. Subscription activated

**Payment Details Shown**:
- Order total
- Payment method
- Reference number
- Transaction status
- Estimated activation time

### 4. Subscription Management
**Path**: `/client/subscriptions`

**View Active Subscriptions**:
- Package name and speed
- Start date and expiry date
- Data used / Data limit
- Days remaining
- Auto-renewal status
- Usage bar chart

**Actions**:
- Renew subscription
- Upgrade package
- View bills
- Contact support
- Cancel subscription

### 5. Account Management
**Path**: `/client/account`

**Profile Settings**:
- Personal information
  - Full name
  - Email address
  - Phone number
  - Company name (if applicable)
- Account preferences
  - Auto-renewal settings
  - Communication preferences
  - Password change
  - Security settings

**Saved Information**:
- Primary phone number for payments
- Backup email
- Billing address

### 6. Invoice & Billing
**Path**: `/client/invoices`

**Features**:
- Download invoices as PDF
- View payment history
- Filter by date range
- Search by invoice number
- View transaction details

**Invoice Information**:
- Invoice number and date
- Package details
- Amount charged
- Payment method
- Payment date
- Receipt number (for MPESA)

### 7. Usage Tracking
**Path**: `/client/subscriptions` (Usage Tab)

**Real-time Usage Display**:
- Data used (MB/GB)
- Data remaining
- Visual progress bar
- Estimated days left
- Usage by day (chart)

**For Time-based (Hotspot)**:
- Hours used
- Hours remaining
- Session history
- Connection statistics

## User Workflows

### New User - First Purchase

1. **Browse**: Visit `/client/packages`
2. **Select**: Choose desired package
3. **Review**: Confirm package details
4. **Add to Cart**: Click "Add to Cart"
5. **Checkout**: Review cart at `/client/checkout`
6. **Payment**: Enter MPESA phone number
7. **Confirm**: Complete payment on phone
8. **Activate**: System activates subscription
9. **Connect**: User can now connect to service

### Existing User - Renewing

1. **Login**: Go to `/client`
2. **View**: See expiring subscriptions
3. **Renew**: Click "Renew Now"
4. **Payment**: Make MPESA payment
5. **Confirm**: Subscription extended

### User - Upgrading Package

1. **Login**: Go to `/client`
2. **Browse**: Check `/client/packages`
3. **Upgrade**: Select better package
4. **Payment**: Pay difference if applicable
5. **Activate**: Upgrade takes effect

## Payment Methods

### MPESA STK Push
**Best for**: Mobile phone users

- Phone receives STK prompt
- User enters PIN
- Payment confirmed instantly
- Works offline (stored for later)

### MPESA Payment Page
**Best for**: Online browsers

- QR code displayed
- User scans with phone
- Enters amount
- Pays via MPESA
- Confirmation sent to portal

### Supported Currencies
- Kenya Shilling (KES) - Default
- Easily configureable for other currencies

## Security Features

- ✅ HTTPS/SSL encryption
- ✅ Password hashing
- ✅ Session tokens
- ✅ Rate limiting
- ✅ Input validation
- ✅ CSRF protection
- ✅ Secure payment handling
- ✅ Audit logging

## Mobile Responsiveness

Portal is fully responsive:
- ✅ Mobile phones (320px+)
- ✅ Tablets (768px+)
- ✅ Desktops (1024px+)
- ✅ Touch-friendly buttons
- ✅ Mobile-optimized checkout

## API Endpoints Used by Portal

\`\`\`
GET    /api/client/packages             - Fetch packages
POST   /api/client/subscriptions        - Create subscription
GET    /api/client/subscriptions        - View subscriptions
PATCH  /api/client/subscriptions/:id    - Renew/upgrade
GET    /api/client/invoices             - Download invoices
PATCH  /api/client/profile              - Update account
GET    /api/client/usage                - Get usage stats
POST   /api/billing/transactions        - Create payment
\`\`\`

## Common Issues & Solutions

### Payment Confirmation Delay
- Payment confirms within 30 seconds
- Check SMS for confirmation
- Contact support if not confirmed in 5 minutes

### Can't Renew Package
- Check if current package hasn't expired yet
- Renew before expiry to avoid service interruption
- Can renew up to 7 days before expiry

### Need to Upgrade
- You can upgrade anytime
- Only pay difference for remaining days
- Upgrade takes effect immediately

### Lost Access Credentials
- Email: support@elyonconcepts.com
- Phone: +254 795 673 453

## Support

For issues or questions about the client portal:
- Email: support@elyonconcepts.com
- Phone: +254 795 673 453
- Hours: 24/7 support available
