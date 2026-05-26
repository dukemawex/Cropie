export const json = (res, status, payload) => res.status(status).json(payload);

export const parseAuthHeader = (req) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice(7);
};

export const ensureEnv = (keys) => {
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length) {
    const error = new Error(`Missing environment variables: ${missing.join(', ')}`);
    error.statusCode = 500;
    throw error;
  }
};

export const toSafeError = (err) => ({
  error: err?.message || 'Unexpected error'
});
