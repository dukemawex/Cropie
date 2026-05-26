import express from 'express';
import serverless from 'serverless-http';
import { supabase } from './lib/supabase.js';
import { requireUser } from './lib/auth.js';
import { toSafeError } from './lib/http.js';

const app = express();
app.use(express.json());
app.use(requireUser);

app.get('/alerts/:farmId', async (req, res) => {
  try {
    const { farmId } = req.params;

    const { data: farm } = await supabase
      .from('farms')
      .select('id, user_id')
      .eq('id', farmId)
      .eq('user_id', req.user.id)
      .single();

    if (!farm) return res.status(404).json({ error: 'Farm not found' });

    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('farm_id', farmId)
      .order('analyzed_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data || []);
  } catch (err) {
    return res.status(500).json(toSafeError(err));
  }
});

export const handler = serverless(app);
