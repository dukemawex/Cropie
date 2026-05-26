import express from 'express';
import serverless from 'serverless-http';
import axios from 'axios';
import { supabase } from './lib/supabase.js';
import { requireUser } from './lib/auth.js';
import { config } from './lib/config.js';
import { toSafeError } from './lib/http.js';

const app = express();
app.use(express.json());
app.use(requireUser);

const sendAfricasTalkingSms = async (to, message) => {
  const payload = new URLSearchParams({
    username: config.africasTalkingUsername,
    to,
    message
  });

  await axios.post('https://api.africastalking.com/version1/messaging', payload.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      apiKey: config.africasTalkingApiKey
    }
  });
};

const sendTwilioWhatsApp = async (to, message) => {
  const payload = new URLSearchParams({
    From: `whatsapp:${config.twilioWhatsAppNumber}`,
    To: `whatsapp:${to}`,
    Body: message
  });

  await axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${config.twilioSid}/Messages.json`,
    payload.toString(),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      auth: {
        username: config.twilioSid,
        password: config.twilioAuthToken
      }
    }
  );
};

app.post('/notify/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;

    const { data: alert, error: alertError } = await supabase
      .from('alerts')
      .select('id, farm_id, severity, disease_detected, recommendation, farms(name, user_id)')
      .eq('id', alertId)
      .single();

    if (alertError || !alert) return res.status(404).json({ error: 'Alert not found' });

    const farmUserId = alert.farms?.user_id;
    if (farmUserId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('phone, notification_method')
      .eq('id', req.user.id)
      .single();

    if (userError || !user) return res.status(404).json({ error: 'User profile missing' });

    const message = `⚠️ AgroSentinel Alert for ${alert.farms?.name}: ${alert.disease_detected || 'Crop stress'} detected with ${alert.severity} severity. Action: ${alert.recommendation}`;

    if (user.notification_method === 'whatsapp') {
      await sendTwilioWhatsApp(user.phone, message);
    } else {
      await sendAfricasTalkingSms(user.phone, message);
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json(toSafeError(err));
  }
});

export const handler = serverless(app);
