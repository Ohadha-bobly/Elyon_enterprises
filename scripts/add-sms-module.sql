-- SMS Module - Add to existing Elyon ISP database
-- Run this after the main init-database.sql script

-- 1. SMS Templates Table
CREATE TABLE sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  template_key VARCHAR(50) UNIQUE NOT NULL, -- payment_confirmation, expiry_warning, expiry_reminder, renewal_successful
  message_content TEXT NOT NULL,
  variables_used VARCHAR(255)[], -- variables like {customer_name}, {expiry_date}, {amount}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. SMS Logs Table
CREATE TABLE sms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  phone_number VARCHAR(20) NOT NULL,
  message_content TEXT NOT NULL,
  template_id UUID REFERENCES sms_templates(id),
  sms_type VARCHAR(50) NOT NULL, -- payment_confirmation, expiry_warning, expiry_reminder, renewal_successful, bulk_campaign
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed, delivered
  external_sms_id VARCHAR(100), -- ID from SMS provider (Africa's Talking, Twilio, etc)
  error_message TEXT,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. SMS Campaigns Table (for bulk SMS)
CREATE TABLE sms_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  template_id UUID REFERENCES sms_templates(id),
  message_override TEXT, -- if different from template
  target_users_filter JSONB, -- filter criteria: user_type, status, subscription_status, etc
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  total_recipients INTEGER,
  successfully_sent INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, in_progress, completed, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. SMS Provider Configuration Table
CREATE TABLE sms_provider_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name VARCHAR(50) NOT NULL, -- africas_talking, twilio, etc
  is_active BOOLEAN DEFAULT false,
  api_key VARCHAR(255),
  api_secret VARCHAR(255),
  sender_id VARCHAR(20),
  base_url TEXT,
  account_balance DECIMAL(10, 2),
  last_balance_check TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Expiry Notifications Tracking Table
CREATE TABLE expiry_notifications_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id),
  notification_type VARCHAR(50) NOT NULL, -- warning_7days, warning_3days, warning_1day, renewal_successful
  sent_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(subscription_id, notification_type)
);

-- Enable RLS
ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_provider_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE expiry_notifications_sent ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Only admins can manage SMS templates
CREATE POLICY "Only admins manage SMS templates"
  ON sms_templates FOR ALL
  USING ((SELECT user_type FROM users WHERE auth_id = auth.uid()) = 'admin');

-- Users can see their own SMS logs
CREATE POLICY "Users can see their SMS logs"
  ON sms_logs FOR SELECT
  USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    OR (SELECT user_type FROM users WHERE auth_id = auth.uid()) = 'admin'
  );

-- Only admins can view SMS campaigns
CREATE POLICY "Only admins view SMS campaigns"
  ON sms_campaigns FOR SELECT
  USING ((SELECT user_type FROM users WHERE auth_id = auth.uid()) = 'admin');

-- Only admins manage SMS campaigns
CREATE POLICY "Only admins manage SMS campaigns"
  ON sms_campaigns FOR ALL
  USING ((SELECT user_type FROM users WHERE auth_id = auth.uid()) = 'admin');

-- Create indexes
CREATE INDEX idx_sms_logs_user_id ON sms_logs(user_id);
CREATE INDEX idx_sms_logs_created_at ON sms_logs(created_at);
CREATE INDEX idx_sms_logs_status ON sms_logs(status);
CREATE INDEX idx_sms_campaigns_created_by ON sms_campaigns(created_by);
CREATE INDEX idx_sms_campaigns_status ON sms_campaigns(status);
CREATE INDEX idx_expiry_notifications_subscription_id ON expiry_notifications_sent(subscription_id);

-- Insert default SMS templates
INSERT INTO sms_templates (name, template_key, message_content, variables_used, is_active)
VALUES
  (
    'Payment Confirmation',
    'payment_confirmation',
    'Hello {customer_name}, your payment of KES {amount} has been received. Your subscription is active until {expiry_date}. Thank you!',
    ARRAY['customer_name', 'amount', 'expiry_date'],
    true
  ),
  (
    'Expiry Warning - 7 Days',
    'expiry_warning_7days',
    'Hi {customer_name}, your internet subscription expires in 7 days ({expiry_date}). Renew now to maintain continuous service. Reply RENEW to renew.',
    ARRAY['customer_name', 'expiry_date'],
    true
  ),
  (
    'Expiry Warning - 3 Days',
    'expiry_warning_3days',
    'Hi {customer_name}, your internet subscription expires in 3 days ({expiry_date}). Renew now to avoid service interruption.',
    ARRAY['customer_name', 'expiry_date'],
    true
  ),
  (
    'Expiry Warning - 1 Day',
    'expiry_warning_1day',
    'URGENT: {customer_name}, your internet expires TOMORROW ({expiry_date}). Renew immediately to stay connected. Use code RENEW or call support.',
    ARRAY['customer_name', 'expiry_date'],
    true
  ),
  (
    'Renewal Successful',
    'renewal_successful',
    'Welcome back {customer_name}! Your subscription has been renewed successfully. New expiry date: {expiry_date}. Enjoy unlimited browsing!',
    ARRAY['customer_name', 'expiry_date'],
    true
  ),
  (
    'Service Suspended',
    'service_suspended',
    'Your internet service has been suspended due to non-payment. Contact support immediately or renew your subscription to restore service.',
    ARRAY[],
    true
  );
