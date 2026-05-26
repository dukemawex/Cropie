import Anthropic from '@anthropic-ai/sdk';
import { config } from './config.js';

const systemPrompt = 'You are an expert agronomist specializing in satellite-based crop disease detection for African smallholder farms. Analyze this multispectral satellite image and NDVI/EVI values. Identify any visible signs of crop stress, disease, or pest infestation. Return JSON with keys: disease_detected (string or null), severity (low/medium/high/critical), confidence (0-1), recommendation (2-3 actionable sentences in plain language), affected_area_estimate (percentage).';

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey || 'test-key' });

const extractJson = (text) => {
  const block = text.match(/\{[\s\S]*\}/);
  if (!block) throw new Error('Claude response did not include JSON');
  return JSON.parse(block[0]);
};

export const analyzeWithClaude = async ({ imageDataUrl, ndvi, evi }) => {
  const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: `NDVI: ${ndvi.toFixed(4)}, EVI: ${evi.toFixed(4)}. Assess disease risk and return JSON only.` },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/png',
              data: base64
            }
          }
        ]
      }
    ]
  });

  const text = response.content
    ?.filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('\n') || '{}';

  return extractJson(text);
};
