import { supabase } from './supabase.js';
import { parseAuthHeader } from './http.js';

export const requireUser = async (req, res, next) => {
  try {
    const token = parseAuthHeader(req);
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: 'Invalid token' });

    req.user = data.user;
    req.accessToken = token;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
