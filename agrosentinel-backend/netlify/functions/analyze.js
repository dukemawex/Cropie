import express from 'express';
import serverless from 'serverless-http';
import { requireUser } from './lib/auth.js';
import { runFarmAnalysis } from './lib/analyzeService.js';
import { toSafeError } from './lib/http.js';

const app = express();
app.use(express.json());
app.use(requireUser);

app.post('/analyze/:farmId', async (req, res) => {
  try {
    const alert = await runFarmAnalysis(req.params.farmId);
    return res.status(201).json(alert);
  } catch (err) {
    return res.status(err.statusCode || 500).json(toSafeError(err));
  }
});

export const handler = serverless(app);
