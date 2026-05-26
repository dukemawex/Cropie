import { supabase } from './supabase.js';
import { fetchSentinelIndices, fetchSentinelTrueColor } from './sentinel.js';
import { analyzeWithClaude } from './claude.js';

const normalizeSeverity = (severity) => {
  const valid = ['low', 'medium', 'high', 'critical'];
  const v = String(severity || 'low').toLowerCase();
  return valid.includes(v) ? v : 'low';
};

export const runFarmAnalysis = async (farmId) => {
  const { data: farm, error: farmError } = await supabase
    .from('farms')
    .select('id, name, user_id, polygon')
    .eq('id', farmId)
    .single();

  if (farmError || !farm) throw new Error('Farm not found');

  const polygon = typeof farm.polygon === 'string' ? JSON.parse(farm.polygon) : farm.polygon;

  const [indices, imageDataUrl] = await Promise.all([
    fetchSentinelIndices(polygon),
    fetchSentinelTrueColor(polygon)
  ]);

  const ai = await analyzeWithClaude({
    imageDataUrl,
    ndvi: indices.ndvi,
    evi: indices.evi
  });

  const payload = {
    farm_id: farm.id,
    severity: normalizeSeverity(ai.severity),
    disease_detected: ai.disease_detected || null,
    ndvi_score: indices.ndvi,
    evi_score: indices.evi,
    confidence: Number(ai.confidence || 0),
    recommendation: ai.recommendation || 'Monitor crop closely and inspect affected areas manually.',
    satellite_image_url: imageDataUrl
  };

  const { data: alert, error: alertError } = await supabase
    .from('alerts')
    .insert(payload)
    .select('*')
    .single();

  if (alertError) throw new Error(alertError.message);

  return alert;
};
