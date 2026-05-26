import express from 'express';
import { handler as auth } from './auth.js';
import { handler as farms } from './farms.js';
import { handler as analyze } from './analyze.js';
import { handler as alerts } from './alerts.js';
import { handler as notify } from './notify.js';

const app = express();
app.use(express.json());

const wrap = (fn) => async (req, res) => {
  const result = await fn({
    path: req.path,
    httpMethod: req.method,
    headers: req.headers,
    body: JSON.stringify(req.body || {}),
    queryStringParameters: req.query
  });
  res.status(result.statusCode || 200).set(result.headers || {}).send(result.body);
};

app.use(wrap(auth));
app.use(wrap(farms));
app.use(wrap(analyze));
app.use(wrap(alerts));
app.use(wrap(notify));

app.listen(8080, () => {
  console.log('Local function server running on http://localhost:8080');
});
