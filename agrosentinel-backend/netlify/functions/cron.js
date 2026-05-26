import { supabase } from './lib/supabase.js';
import { runFarmAnalysis } from './lib/analyzeService.js';

export const handler = async () => {
  const { data: farms, error } = await supabase.from('farms').select('id');
  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }

  const results = [];
  for (const farm of farms || []) {
    try {
      const alert = await runFarmAnalysis(farm.id);
      results.push({ farm_id: farm.id, status: 'ok', alert_id: alert.id });
    } catch (err) {
      results.push({ farm_id: farm.id, status: 'error', message: err.message });
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ processed: results.length, results })
  };
};
