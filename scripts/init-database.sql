-- Elyon ISP - Database Initialization Script
-- Run this in Supabase SQL Editor

-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  user_type VARCHAR(50) NOT NULL DEFAULT 'pppoe', -- admin, reseller, pppoe, hotspot
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, suspended, deleted
  company_name VARCHAR(255),
  business_registration VARCHAR(100),
  mpesa_account VARCHAR(50),
  bank_account VARCHAR(100),
  billing_address TEXT,
  id_number VARCHAR(50),
  profile_picture_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(auth_id)
);

-- 2. Routers Table
CREATE TABLE routers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  ip_address VARCHAR(15) NOT NULL,
  api_port INTEGER DEFAULT 8728,
  api_username VARCHAR(100),
  api_password VARCHAR(255), -- Encrypted in production
  location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bandwidth_capacity INTEGER, -- in Mbps
  status VARCHAR(50) DEFAULT 'active',
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Packages Table
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  package_type VARCHAR(50) NOT NULL, -- pppoe, hotspot
  bandwidth_mbps INTEGER NOT NULL,
  data_limit_gb INTEGER,
  time_limit_hours INTEGER,
  price_monthly DECIMAL(10, 2),
  price_daily DECIMAL(10, 2),
  price_hourly DECIMAL(10, 2),
  price_weekly DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id),
  subscription_type VARCHAR(50) NOT NULL, -- pppoe, hotspot, reseller
  status VARCHAR(50) DEFAULT 'active', -- active, expired, suspended, cancelled
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT false,
  amount_paid DECIMAL(10, 2),
  pppoe_username VARCHAR(100),
  pppoe_password VARCHAR(255),
  mac_address VARCHAR(17),
  session_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  invoice_id UUID,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- mpesa, bank, cash, card
  payment_reference VARCHAR(100),
  mpesa_receipt_number VARCHAR(100),
  mpesa_phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, reversed
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Invoices Table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2),
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, overdue, cancelled
  due_date DATE,
  paid_date DATE,
  items JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Communities Table
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- health, wellness, support, etc
  member_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  donation_enabled BOOLEAN DEFAULT false,
  donation_bank_account VARCHAR(100),
  admin_ids UUID[] DEFAULT ARRAY[]::UUID[],
  rules TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. Community Members Table
CREATE TABLE community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- admin, moderator, member
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- 9. Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- text, image, file, voice
  file_url TEXT,
  is_pinned BOOLEAN DEFAULT false,
  reactions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 10. Direct Messages Table
CREATE TABLE direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_encrypted BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 11. Donations Table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id),
  donor_id UUID REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  transaction_id UUID REFERENCES transactions(id),
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 12. Hospitals Table
CREATE TABLE hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  address VARCHAR(255),
  city VARCHAR(100),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  hospital_type VARCHAR(50), -- public, private, clinic
  specialties VARCHAR(255)[], -- array of specialties
  operating_hours TEXT,
  website VARCHAR(255),
  emergency_services BOOLEAN DEFAULT false,
  rating DECIMAL(2, 1),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 13. Chatbot Conversations Table
CREATE TABLE chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  conversation_history JSONB DEFAULT '[]',
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 14. Reseller Configuration Table
CREATE TABLE reseller_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID REFERENCES users(id),
  commission_percentage DECIMAL(5, 2),
  max_clients INTEGER,
  white_label_enabled BOOLEAN DEFAULT false,
  custom_domain VARCHAR(255),
  api_key VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 15. Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255),
  resource_type VARCHAR(100),
  resource_id VARCHAR(100),
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE routers ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseller_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Sample RLS Policies
-- Users can only see their own profile and public data
CREATE POLICY "Users can see their own data"
  ON users FOR SELECT
  USING (auth.uid() = auth_id OR user_type = 'admin');

-- Users can see their subscriptions
CREATE POLICY "Users can see own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = (SELECT auth_id FROM users WHERE id = user_id));

-- Public communities are viewable by all
CREATE POLICY "Public communities are viewable"
  ON communities FOR SELECT
  USING (is_public = true OR creator_id = auth.uid());

-- Messages in communities you're a member of
CREATE POLICY "View community messages if member"
  ON messages FOR SELECT
  USING (
    community_id IN (
      SELECT community_id FROM community_members 
      WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- Create indexes for performance
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_messages_community_id ON messages(community_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_hospitals_location ON hospitals USING GIST (
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create useful views
CREATE VIEW active_subscriptions AS
SELECT * FROM subscriptions 
WHERE status = 'active' AND end_date > NOW();

CREATE VIEW monthly_revenue AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(amount) as total_revenue,
  COUNT(*) as transaction_count
FROM transactions
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', created_at);

-- Grant appropriate permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
\`\`\`
