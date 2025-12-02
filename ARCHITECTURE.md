# Elyon ISP - System Architecture

## Overview

This is a three-tier architecture supporting multiple user types, real-time features, and external integrations.

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACES                          │
├─────────────────────────────────────────────────────────────────┤
│  Admin Dashboard  │  Client Portal  │  Hotspot Portal │  Mobile │
└────────┬──────────────────┬──────────────────┬─────────────────┘
         │                  │                  │
┌────────▼──────────────────▼──────────────────▼─────────────────┐
│                    NEXT.JS APPLICATION                         │
│  ┌────────────────────────────────────────────────────────────┐│
│  │            API ROUTES (Route Handlers)                    ││
│  │  • Authentication  • Billing  • Router  • Communities     ││
│  │  • Hospitals  • Chatbot  • Webhooks                       ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │         SERVER COMPONENTS & ACTIONS                       ││
│  │  • Supabase queries  • File processing  • Email send      ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │      CLIENT COMPONENTS & HOOKS                           ││
│  │  • Real-time updates  • Forms  • Charts  • Maps           ││
│  └────────────────────────────────────────────────────────────┘│
└────────┬──────────────────────────────────────────────────────┘
         │
┌────────▼──────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                          │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐│
│  │   PostgreSQL   │  │    Auth        │  │   Realtime       ││
│  │   Database     │  │    (JWT)       │  │   (WebSocket)    ││
│  │                │  │                │  │                  ││
│  │  • 15 tables   │  │ • Email/Pass   │  │ • Messages       ││
│  │  • RLS enabled │  │ • OAuth ready  │  │ • Subscriptions  ││
│  │  • Indexed     │  │                │  │ • Transactions   ││
│  └────────────────┘  └────────────────┘  └──────────────────┘│
│                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐│
│  │    Storage     │  │   Vectors      │  │  Edge Functions  ││
│  │    (S3/CDN)    │  │    (pgvector)  │  │  (TypeScript)    ││
│  │                │  │                │  │                  ││
│  │  • Files       │  │  • AI search   │  │  • Hooks         ││
│  │  • Images      │  │  • Embeddings  │  │  • Automation    ││
│  └────────────────┘  └────────────────┘  └──────────────────┘│
└────────┬──────────────────────────────────────────────────────┘
         │
┌────────▼──────────────────────────────────────────────────────┐
│              EXTERNAL INTEGRATIONS & SERVICES                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MPESA      │  │   Mikrotik   │  │   Google     │      │
│  │   Daraja     │  │   API        │  │   Maps       │      │
│  │              │  │              │  │              │      │
│  │ • STK Push   │  │ • PPP Users  │  │ • Hospital   │      │
│  │ • Callbacks  │  │ • Hotspot    │  │   Search     │      │
│  │ • Verify     │  │ • Bandwidth  │  │ • Geolocation       │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Gemini     │  │ Africa's     │  │   Sendgrid  │      │
│  │   AI         │  │ Talking      │  │   Email     │      │
│  │              │  │              │  │             │      │
│  │ • Chatbot    │  │ • Bulk SMS   │  │ • Invoices  │      │
│  │ • Health     │  │ • Alerts     │  │ • Receipts  │      │
│  │   Tips       │  │              │  │ • Updates   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└───────────────────────────────────────────────────────────────┘
\`\`\`

## Data Flow

### User Registration Flow

\`\`\`
User Signs Up (Hotspot/PPPoE)
    ↓
Frontend validates input
    ↓
POST /api/clients
    ↓
Create Auth user (Supabase Auth)
    ↓
Create User Profile (users table)
    ↓
Send confirmation email
    ↓
User receives email and confirms
    ↓
Account activated
\`\`\`

### Payment Flow (MPESA)

\`\`\`
User initiates payment
    ↓
Select package and amount
    ↓
POST /api/billing/initiate-payment
    ↓
Call MPESA STK Push API
    ↓
User enters M-PESA PIN
    ↓
MPESA processes transaction
    ↓
Webhook callback to /api/webhooks/mpesa-callback
    ↓
Verify transaction signature
    ↓
Update transaction status (completed/failed)
    ↓
If successful:
  - Update subscription (active)
  - Trigger Mikrotik activation
  - Send confirmation SMS
  - Generate invoice
    ↓
User gets instant access
\`\`\`

### Subscription Activation Flow

\`\`\`
Payment completed
    ↓
Check subscription type:
  
  If PPPoE:
    - Generate PPP username/password
    - Create MikroTik profile
    - Send credentials via email/SMS
    
  If Hotspot:
    - Generate hotspot voucher/token
    - Create session in Mikrotik
    - Send activation code
    
  If Reseller:
    - Create reseller account
    - Set commission percentage
    - Generate API key
    
    ↓
Send activation notification
    ↓
User can access service
\`\`\`

### Messaging Flow

\`\`\`
User sends message
    ↓
Message encrypted (client-side)
    ↓
POST to /api/communities/:id/messages
    ↓
Stored in messages table
    ↓
Realtime trigger fires
    ↓
Broadcast to all community members via WebSocket
    ↓
Other clients receive and decrypt
    ↓
Display in UI
\`\`\`

## Database Relationships

\`\`\`
users
├── routers (1:N)
├── subscriptions (1:N)
├── transactions (1:N)
├── invoices (1:N)
├── communities (creator_id)
├── community_members (1:N)
├── messages (sender_id)
├── direct_messages (1:N as sender/recipient)
└── donations (1:N)

packages
├── subscriptions (1:N)
└── reseller_config (1:1)

subscriptions
├── transactions (1:N)
└── invoices (1:N)

communities
├── community_members (1:N)
├── messages (1:N)
└── donations (1:N)

hospitals
└── ratings (implied)

routers
├── PPP profiles (Mikrotik)
├── Hotspot users (Mikrotik)
└── Bandwidth quotas
\`\`\`

## Security Model

### Row Level Security (RLS)

\`\`\`
users table:
  - SELECT: Own profile OR admin viewing
  - UPDATE: Own profile only
  - DELETE: Admin only

subscriptions table:
  - SELECT: Own subscription OR admin/reseller
  - INSERT: Admin/reseller creating
  - UPDATE: Own subscription OR admin
  - DELETE: Admin only

communities table:
  - SELECT: Public communities OR member
  - INSERT: Any authenticated user
  - UPDATE: Community creator/admin
  - DELETE: Community creator

messages table:
  - SELECT: Community members only
  - INSERT: Community members only
  - UPDATE: Own message or admin
  - DELETE: Own message or admin
\`\`\`

### Encryption

- **Passwords**: Supabase Auth (bcrypt)
- **Messages**: Client-side encryption (optional)
- **API Keys**: Environment variables, never exposed
- **Payment Data**: Never stored, PCI compliance via MPESA

## Scalability Strategy

### Database Optimization
- Indexes on frequently queried fields
- Partitioning on large tables (transactions, messages)
- Read replicas for reporting

### Caching
- Supabase Cache-Control headers
- Next.js ISR (Incremental Static Regeneration)
- Redis for session data (optional)

### Load Balancing
- Vercel's global CDN
- Database connection pooling
- API rate limiting

## Disaster Recovery

- **Backups**: Daily Supabase automated backups
- **Recovery Point Objective (RPO)**: 24 hours
- **Recovery Time Objective (RTO)**: 2 hours
- **Redundancy**: Multi-region database failover
- **Monitoring**: Real-time alerts via SendGrid

## Compliance

- **Data Privacy**: GDPR ready (user data export/delete)
- **Payment Security**: PCI compliance via MPESA
- **Encryption**: TLS in transit, at-rest encryption
- **Audit Logs**: All actions tracked and immutable
- **GDPR Compliance**: Data controller documentation

---

## Deployment Architecture

\`\`\`
GitHub Repository
    ↓
Vercel CI/CD Pipeline
    ↓
Environment Variables loaded
    ↓
Build & Optimize
    ↓
Deploy to Global Edge Network
    ↓
Database Migrations (if any)
    ↓
Health Checks
    ↓
Live at https://domain.com
\`\`\`

## Monitoring & Observability

- **Application Logs**: Vercel/Supabase logs
- **Performance Monitoring**: Web Vitals
- **Error Tracking**: Sentry integration (optional)
- **API Metrics**: Request/response times
- **Database Query Analysis**: Slow query logs
- **User Analytics**: PostHog/Mixpanel integration
