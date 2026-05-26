import express from 'express';
import serverless from 'serverless-http';
import { supabase } from './lib/supabase.js';
import { toSafeError } from './lib/http.js';

const app = express();
app.use(express.json());

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, phone, country, language, notification_method } = req.body;
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, phone, country, language, notification_method }
    });

    if (error) return res.status(400).json({ error: error.message });

    await supabase.from('users').upsert({
      id: data.user.id,
      full_name,
      phone,
      country,
      language: language || 'en',
      notification_method: notification_method || 'sms'
    });

    return res.status(201).json({ user: data.user });
  } catch (err) {
    return res.status(500).json(toSafeError(err));
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json(toSafeError(err));
  }
});

app.post('/auth/logout', async (req, res) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return res.status(400).json({ error: 'Missing bearer token' });
    const { error } = await supabase.auth.admin.signOut(token);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json(toSafeError(err));
  }
});

export const handler = serverless(app);
