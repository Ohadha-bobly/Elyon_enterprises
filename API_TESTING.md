# API Testing Guide

Complete guide for testing Elyon ISP APIs using cURL.

## Prerequisites

\`\`\`bash
# Install cURL (usually pre-installed)
curl --version

# For JSON formatting, install jq
brew install jq  # macOS
apt install jq   # Ubuntu/Debian
\`\`\`

---

## Authentication Tests

### Test Login

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@elyon.com",
    "password": "your_password"
  }' | jq
\`\`\`

Expected response:
\`\`\`json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "admin@elyon.com",
    "user_type": "admin"
  }
}
\`\`\`

---

## SMS API Tests

### 1. Send Individual SMS

\`\`\`bash
curl -X POST http://localhost:3000/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-here",
    "templateKey": "payment_confirmation",
    "variables": {
      "customer_name": "John Doe",
      "amount": "500",
      "expiry_date": "2024-12-31"
    }
  }' | jq
\`\`\`

### 2. Get SMS Templates

\`\`\`bash
curl -X GET http://localhost:3000/api/sms/templates | jq
\`\`\`

Expected response:
\`\`\`json
{
  "data": [
    {
      "id": "template-uuid",
      "name": "Payment Confirmation",
      "template_key": "payment_confirmation",
      "message_content": "Hello {customer_name}...",
      "is_active": true
    }
  ]
}
\`\`\`

### 3. Update SMS Template

\`\`\`bash
curl -X PUT http://localhost:3000/api/sms/templates \
  -H "Content-Type: application/json" \
  -d '{
    "id": "template-uuid",
    "message_content": "New message content with {customer_name}",
    "is_active": true
  }' | jq
\`\`\`

### 4. Get SMS Logs

\`\`\`bash
# All SMS logs
curl -X GET "http://localhost:3000/api/sms/logs" | jq

# Filter by status
curl -X GET "http://localhost:3000/api/sms/logs?status=sent" | jq

# Paginated
curl -X GET "http://localhost:3000/api/sms/logs?limit=20&offset=0" | jq
\`\`\`

### 5. Create SMS Campaign

\`\`\`bash
curl -X POST http://localhost:3000/api/sms/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monthly Renewal Reminder",
    "templateKey": "expiry_warning_7days",
    "targetUserType": "all",
    "targetStatus": "active",
    "scheduleTime": ""
  }' | jq
\`\`\`

### 6. Send Bulk SMS Campaign

\`\`\`bash
curl -X POST http://localhost:3000/api/sms/bulk-send \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "campaign-uuid",
    "templateKey": "payment_confirmation"
  }' | jq
\`\`\`

### 7. Get SMS Configuration

\`\`\`bash
curl -X GET http://localhost:3000/api/sms/config | jq
\`\`\`

Expected response:
\`\`\`json
{
  "provider": "africas_talking",
  "balance": 5230,
  "stats": {
    "sent_today": 2847,
    "failed_today": 42,
    "delivery_rate": "98.5",
    "total_users": 5230
  }
}
\`\`\`

---

## Billing API Tests

### 1. Get Transactions

\`\`\`bash
# Get all transactions
curl -X GET "http://localhost:3000/api/billing/transactions" | jq

# With pagination
curl -X GET "http://localhost:3000/api/billing/transactions?limit=50&offset=0" | jq
\`\`\`

### 2. Create Invoice

\`\`\`bash
curl -X POST http://localhost:3000/api/billing/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "items": [
      {
        "description": "Internet Package - Monthly",
        "amount": 1500,
        "quantity": 1
      }
    ]
  }' | jq
\`\`\`

---

## Client Management API Tests

### 1. Get All Clients

\`\`\`bash
curl -X GET "http://localhost:3000/api/clients" | jq

# With pagination
curl -X GET "http://localhost:3000/api/clients?limit=20&offset=0" | jq

# Filter by type
curl -X GET "http://localhost:3000/api/clients?user_type=pppoe" | jq
\`\`\`

### 2. Create New Client

\`\`\`bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "phone": "+254700000000",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "pppoe",
    "company_name": "My Company"
  }' | jq
\`\`\`

### 3. Update Client

\`\`\`bash
curl -X PUT "http://localhost:3000/api/clients/{client-id}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "suspended",
    "phone": "+254722000000"
  }' | jq
\`\`\`

### 4. Delete Client

\`\`\`bash
curl -X DELETE "http://localhost:3000/api/clients/{client-id}" \
  -H "Content-Type: application/json" | jq
\`\`\`

---

## Automated Expiry Notifications Test

### Trigger Expiry SMS Manually

\`\`\`bash
curl -X POST http://localhost:3000/api/sms/expiry-notifications \
  -H "Content-Type: application/json" | jq
\`\`\`

Expected response:
\`\`\`json
{
  "success": true,
  "message": "Expiry notifications processed"
}
\`\`\`

---

## MPESA Webhook Test

### Simulate Payment Notification

\`\`\`bash
curl -X POST http://localhost:3000/api/webhooks/mpesa-callback \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "MerchantRequestID": "test-request-id",
        "CheckoutRequestID": "test-checkout-id",
        "ResultCode": 0,
        "ResultDesc": "The service request has been processed successfully.",
        "CallbackMetadata": {
          "Item": [
            {
              "Name": "Amount",
              "Value": 1500
            },
            {
              "Name": "MpesaReceiptNumber",
              "Value": "MTO00001"
            },
            {
              "Name": "PhoneNumber",
              "Value": 254700000000
            }
          ]
        }
      }
    }
  }' | jq
\`\`\`

Expected response:
\`\`\`json
{
  "ResultCode": 0,
  "ResultDesc": "Payment processed successfully"
}
\`\`\`

---

## Community API Tests

### 1. Create Community

\`\`\`bash
curl -X POST http://localhost:3000/api/communities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Women Wellness Group",
    "description": "Support group for women health",
    "category": "wellness",
    "is_public": true,
    "donation_enabled": true
  }' | jq
\`\`\`

### 2. Get Communities

\`\`\`bash
curl -X GET "http://localhost:3000/api/communities" | jq
\`\`\`

### 3. Join Community

\`\`\`bash
curl -X POST "http://localhost:3000/api/communities/{community-id}/members" \
  -H "Content-Type: application/json" | jq
\`\`\`

---

## Hospital Search API Tests

### Search Nearby Hospitals

\`\`\`bash
curl -X GET "http://localhost:3000/api/hospitals/nearby?latitude=-1.2921&longitude=36.8219&radius=5" | jq
\`\`\`

Expected response:
\`\`\`json
{
  "data": [
    {
      "id": "hospital-uuid",
      "name": "Kenyatta National Hospital",
      "phone": "+254723000000",
      "address": "Hospital Road, Nairobi",
      "emergency_services": true,
      "rating": 4.5
    }
  ]
}
\`\`\`

---

## Testing with Authentication

For protected endpoints, include Bearer token:

\`\`\`bash
# First get token from login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@elyon.com",
    "password": "password"
  }' | jq -r '.token')

# Use token in subsequent requests
curl -X GET http://localhost:3000/api/sms/logs \
  -H "Authorization: Bearer $TOKEN" | jq
\`\`\`

---

## Performance Testing with ApacheBench

\`\`\`bash
# Install ab
brew install httpd  # macOS
apt install apache2-utils  # Ubuntu

# Test SMS endpoint with 100 requests
ab -n 100 -c 10 http://localhost:3000/api/sms/config

# Expected: < 500ms average response time
\`\`\`

---

## Load Testing with hey

\`\`\`bash
# Install hey
go install github.com/rakyll/hey@latest

# Run load test (1000 requests, 100 concurrent)
hey -n 1000 -c 100 http://localhost:3000/api/sms/logs
\`\`\`

---

## Debug Mode

Add debug headers to requests:

\`\`\`bash
curl -X GET http://localhost:3000/api/sms/logs \
  -H "X-Debug: true" \
  -H "X-Request-ID: test-123" \
  -v  # Verbose mode to see all headers
\`\`\`

Check server logs for debug information.

---

## Common HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Need authentication |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Check server logs |

---

## Debugging Tips

### Enable Debug Logging

In code, use:
\`\`\`bash
console.log("[v0] API called with:", body)
console.log("[v0] Response:", result)
\`\`\`

### Check Network Tab

In Chrome DevTools → Network tab:
1. Click request
2. View "Headers" tab for request/response
3. View "Preview" tab for JSON
4. View "Console" tab for errors

### Use Postman

Better alternative to cURL:
1. Import provided collection
2. Set environment variables
3. Test endpoints with UI
4. Generate code snippets

---

## Rate Limiting

Default rate limits:
- 100 requests per minute per IP
- 1000 requests per hour per IP

Check headers:
\`\`\`bash
curl -I http://localhost:3000/api/sms/logs
# Look for: X-RateLimit-Remaining
\`\`\`

---

**Last Updated:** November 2024
