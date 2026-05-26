import dotenv from 'dotenv';

dotenv.config();

export const config = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  sentinelClientId: process.env.SENTINEL_HUB_CLIENT_ID,
  sentinelClientSecret: process.env.SENTINEL_HUB_CLIENT_SECRET,
  africasTalkingApiKey: process.env.AFRICASTALKING_API_KEY,
  africasTalkingUsername: process.env.AFRICASTALKING_USERNAME,
  twilioSid: process.env.TWILIO_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioWhatsAppNumber: process.env.TWILIO_WHATSAPP_NUMBER
};
