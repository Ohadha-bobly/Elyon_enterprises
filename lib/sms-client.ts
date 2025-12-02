// SMS Service Integration
// Supports: Africa's Talking, Twilio, and other providers

import axios from 'axios'

export interface SMSMessage {
  phoneNumber: string
  message: string
  templateKey?: string
  variables?: Record<string, string>
}

export interface SMSResponse {
  success: boolean
  messageId?: string
  error?: string
}

export class SMSProvider {
  private provider: string
  private apiKey: string
  private apiSecret?: string
  private senderId: string
  private baseUrl: string

  constructor(
    provider: string,
    apiKey: string,
    senderId: string,
    apiSecret?: string,
    baseUrl?: string
  ) {
    this.provider = provider
    this.apiKey = apiKey
    this.senderId = senderId
    this.apiSecret = apiSecret
    this.baseUrl = baseUrl || ''
  }

  async sendSMS(phoneNumber: string, message: string): Promise<SMSResponse> {
    try {
      if (this.provider === 'africas_talking') {
        return await this.sendViaAfrikasTalking(phoneNumber, message)
      } else if (this.provider === 'twilio') {
        return await this.sendViaTwilio(phoneNumber, message)
      } else {
        throw new Error(`Unsupported SMS provider: ${this.provider}`)
      }
    } catch (error: any) {
      console.error('[v0] SMS Error:', error.message)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  private async sendViaAfrikasTalking(
    phoneNumber: string,
    message: string
  ): Promise<SMSResponse> {
    try {
      const response = await axios.post(
        'https://api.sandbox.africastalking.com/version1/messaging',
        {
          username: 'sandbox',
          messages: [
            {
              to: phoneNumber,
              message: message,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            'X-API-Key': this.apiKey,
          },
        }
      )

      const result = response.data?.SMSMessageData?.Messages[0]
      if (result?.Status === 'Success') {
        return {
          success: true,
          messageId: result.id,
        }
      } else {
        return {
          success: false,
          error: result?.ErrorMessage || 'SMS send failed',
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  private async sendViaTwilio(
    phoneNumber: string,
    message: string
  ): Promise<SMSResponse> {
    try {
      const formData = new URLSearchParams()
      formData.append('From', this.senderId)
      formData.append('To', phoneNumber)
      formData.append('Body', message)

      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${this.apiSecret}/Messages.json`,
        formData,
        {
          auth: {
            username: this.apiSecret || '',
            password: this.apiKey,
          },
        }
      )

      if (response.data?.sid) {
        return {
          success: true,
          messageId: response.data.sid,
        }
      } else {
        return {
          success: false,
          error: 'SMS send failed',
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  formatPhoneNumber(phone: string): string {
    // Ensure phone has country code (+254 for Kenya)
    if (!phone.startsWith('+')) {
      if (phone.startsWith('0')) {
        phone = '+254' + phone.substring(1)
      } else {
        phone = '+254' + phone
      }
    }
    return phone
  }
}

// Initialize SMS provider from env variables
export function initializeSMSProvider(): SMSProvider | null {
  const provider = process.env.SMS_PROVIDER
  const apiKey = process.env.SMS_API_KEY
  const apiSecret = process.env.SMS_API_SECRET
  const senderId = process.env.SMS_SENDER_ID || 'Elyon'

  if (!provider || !apiKey) {
    console.warn('[v0] SMS provider not configured')
    return null
  }

  return new SMSProvider(provider, apiKey, senderId, apiSecret)
}
