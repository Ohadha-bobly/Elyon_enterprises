# SMS Integration Setup Guide

This guide walks you through setting up SMS functionality for the Elyon ISP system.

## Overview

The SMS module includes:
- Automated payment confirmations
- Expiry reminders (7, 3, 1 day)
- Renewal notifications
- Bulk SMS campaigns
- SMS delivery tracking and logging

## Supported SMS Providers

### 1. Africa's Talking (Recommended for East Africa)

**Advantages:**
- Lowest rates in East Africa (≈0.50 KES per SMS)
- Excellent delivery rates (99%+)
- Easy integration
- Free sandbox for testing

**Setup Steps:**

1. Go to https://africastalking.com
2. Sign up for a free account
3. Create an app and get your API key
4. In sandbox mode:
   \`\`\`
   SMS_PROVIDER=africas_talking
   SMS_API_KEY=your_api_key
   AFRICAS_TALKING_USERNAME=sandbox
   SMS_SENDER_ID=Elyon
   \`\`\`
5. Test endpoint:
   \`\`\`bash
   curl -X POST https://api.sandbox.africastalking.com/version1/messaging \
     -H "Accept: application/json" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -H "X-API-Key: YOUR_API_KEY" \
     -d "username=sandbox&messages=[{\"to\":\"+254700000000\",\"message\":\"Test SMS\"}]"
   \`\`\`

### 2. Twilio

**Advantages:**
- Global coverage
- Multiple messaging channels
- Excellent API documentation
- Pay-as-you-go pricing

**Setup Steps:**

1. Go to https://www.twilio.com/console
2. Sign up and create a project
3. Get your Account SID and Auth Token
4. Purchase a phone number
5. Configure:
   \`\`\`
   SMS_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   \`\`\`

## Database Setup

Run the SMS module initialization:

\`\`\`bash
# In Supabase SQL Editor, run:
psql -h your_host -U postgres -d your_db -f scripts/add-sms-module.sql
\`\`\`

This creates:
- `sms_templates` - SMS message templates
- `sms_logs` - SMS delivery logs
- `sms_campaigns` - Bulk SMS campaigns
- `sms_provider_config` - Provider settings
- `expiry_notifications_sent` - Tracking sent notifications

## Default SMS Templates

The system comes with 6 pre-configured templates:

1. **Payment Confirmation**
   - Triggered: After successful payment
   - Message: Confirms payment and subscription end date

2. **Expiry Warning - 7 Days**
   - Triggered: 7 days before expiry
   - Message: Reminder to renew subscription

3. **Expiry Warning - 3 Days**
   - Triggered: 3 days before expiry
   - Message: Urgent renewal reminder

4. **Expiry Warning - 1 Day**
   - Triggered: 1 day before expiry
   - Message: Final renewal notification

5. **Renewal Successful**
   - Triggered: After subscription renewal
   - Message: Confirmation of renewal

6. **Service Suspended**
   - Triggered: When service is suspended
   - Message: Notification of suspension

## Integration with Billing

### Payment Confirmation SMS

When a transaction is completed:

\`\`\`typescript
// Automatically send SMS after payment
await fetch('/api/sms/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: transaction.user_id,
    templateKey: 'payment_confirmation',
    variables: {
      customer_name: user.first_name,
      amount: transaction.amount,
      expiry_date: subscription.end_date,
    },
  }),
})
\`\`\`

### Automated Expiry Notifications

Set up a cron job to send expiry warnings:

\`\`\`bash
# Run every day at 09:00 AM
0 9 * * * curl -X POST https://yourdomain.com/api/sms/expiry-notifications
\`\`\`

This will:
- Check subscriptions expiring in 7, 3, 1 days
- Skip users already notified
- Send appropriate warning message
- Log all notifications

## Creating Bulk SMS Campaigns

Via the Admin Dashboard:

1. Navigate to **SMS Management** > **Bulk Campaigns**
2. Enter campaign details:
   - Campaign name
   - Select SMS template
   - Choose target users (all, PPPoE, hotspot, resellers)
   - Filter by status (active, expiring soon, expired)
3. Schedule or send immediately
4. Monitor delivery in SMS Logs

### Example: Send renewal reminder to expiring subscriptions

1. Campaign Name: "Monthly Renewal Reminder"
2. Template: "Expiry Warning - 7 Days"
3. Target Users: All
4. Filter: Subscriptions ending between 6-8 days
5. Send immediately

## API Endpoints

### Send Individual SMS
\`\`\`
POST /api/sms/send
Body: {
  userId: "user-id",
  templateKey: "payment_confirmation",
  variables: { customer_name: "John", amount: "500" }
}
\`\`\`

### Send Bulk Campaign
\`\`\`
POST /api/sms/bulk-send
Body: {
  campaignId: "campaign-id",
  templateKey: "expiry_warning_7days"
}
\`\`\`

### Get SMS Logs
\`\`\`
GET /api/sms/logs?status=sent&limit=50&offset=0
\`\`\`

### Automated Expiry Notifications
\`\`\`
POST /api/sms/expiry-notifications
\`\`\`

## SMS Delivery Monitoring

Monitor SMS delivery in the admin dashboard:

- **SMS Logs Page**: View all sent/failed messages
- **SMS Campaigns Page**: Track bulk campaign status
- **SMS Management Dashboard**: Quick stats on delivery rate, credits, etc.

## Cost Estimation

### Africa's Talking
- SMS Rate: ~0.50 KES
- 1000 users: ~500 KES
- Monthly (2 campaigns): ~1,000 KES

### Twilio
- SMS Rate: ~$0.0075 (0.94 KES)
- 1000 users: ~9,400 KES
- Monthly (2 campaigns): ~18,800 KES

## Troubleshooting

### SMS Not Sending
1. Check SMS provider credentials in .env
2. Verify phone numbers include country code (+254)
3. Check SMS provider account balance
4. Review SMS logs for error messages

### High Failure Rate
1. Verify phone number format
2. Check SMS provider API status
3. Review rate limits
4. Contact SMS provider support

### Duplicate Messages
1. Check cron job schedule
2. Verify `expiry_notifications_sent` table
3. Review campaign execution logs

## Production Deployment

For production, ensure:

1. Use live SMS provider credentials (not sandbox)
2. Set proper phone number format validation
3. Implement rate limiting
4. Monitor SMS costs daily
5. Set up alerts for high failure rates
6. Regular backup of SMS logs
7. Enable encryption for sensitive data

## Next Steps

1. Choose SMS provider
2. Set up API credentials
3. Initialize database tables
4. Test with sample SMS
5. Create SMS templates
6. Set up automated expiry notifications
7. Monitor and optimize
