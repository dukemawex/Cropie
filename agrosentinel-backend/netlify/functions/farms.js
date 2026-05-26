import express from 'express';
import serverless from 'serverless-http';
import { supabase } from './lib/supabase.js';
import { requireUser } from './lib/auth.js';
import { polygonToWKT } from './lib/geo.js';
import { toSafeError } from './lib/http.js';

const app = express();
app.use(express.json());
app.use(requireUser);

app.get('/farms', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('farms')
      .select('id, user_id, name, crop_type, country, created_at, polygon')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    return res.json(
      (data || []).map((farm) => ({
        ...farm,
        polygon: typeof farm.polygon === 'string' ? JSON.parse(farm.polygon) : farm.polygon
      }))
    );
  } catch (err) {
    return res.status(500).json(toSafeError(err));
  }
});

app.post('/farms', async (req, res) => {
  try {
    const { name, crop_type, country, polygon } = req.body;
    const wkt = polygonToWKT(polygon);
    const { data, error } = await supabase
      .from('farms')
      .insert({
        user_id: req.user.id,
        name,
        crop_type,
        country,
        polygon: `SRID=4326;${wkt}`
      })
      .select('id, user_id, name, crop_type, country, created_at, polygon')
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json({
      ...data,
      polygon: typeof data.polygon === 'string' ? JSON.parse(data.polygon) : data.polygon
    });
  } catch (err) {
    return res.status(500).json(toSafeError(err));
  }
});

app.delete('/farms/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('farms')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json(toSafeError(err));
  }
});

export const handler = serverless(app);
