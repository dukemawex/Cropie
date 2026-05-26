import axios from 'axios';
import sharp from 'sharp';
import { config } from './config.js';
import { computeBboxFromGeoJSON } from './geo.js';

const TOKEN_URL = 'https://services.sentinel-hub.com/oauth/token';
const PROCESS_URL = 'https://services.sentinel-hub.com/api/v1/process';
const STATS_URL = 'https://services.sentinel-hub.com/api/v1/statistics';

export const getSentinelAccessToken = async () => {
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: config.sentinelClientId,
    client_secret: config.sentinelClientSecret
  });

  const { data } = await axios.post(TOKEN_URL, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return data.access_token;
};

const defaultInputData = [{ type: 'sentinel-2-l2a', dataFilter: { maxCloudCoverage: 40 } }];

export const fetchSentinelTrueColor = async (polygonGeoJSON) => {
  const bbox = computeBboxFromGeoJSON(polygonGeoJSON);
  const token = await getSentinelAccessToken();

  const evalscript = `
//VERSION=3
function setup() {
  return {
    input: [{ bands: ["B04", "B03", "B02"] }],
    output: { bands: 3 }
  }
}
function evaluatePixel(sample) {
  return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
}`;

  const { data } = await axios.post(
    PROCESS_URL,
    {
      input: {
        bounds: { bbox },
        data: defaultInputData
      },
      output: {
        width: 512,
        height: 512,
        responses: [{ identifier: 'default', format: { type: 'image/png' } }]
      },
      evalscript
    },
    {
      responseType: 'arraybuffer',
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const png = await sharp(data).png().toBuffer();
  return `data:image/png;base64,${png.toString('base64')}`;
};

export const fetchSentinelIndices = async (polygonGeoJSON) => {
  const bbox = computeBboxFromGeoJSON(polygonGeoJSON);
  const token = await getSentinelAccessToken();

  const evalscript = `
//VERSION=3
function setup() {
  return {
    input: [{bands:["B02", "B04", "B08"]}],
    output: [
      { id: "ndvi", bands: 1, sampleType: "FLOAT32" },
      { id: "evi", bands: 1, sampleType: "FLOAT32" }
    ]
  };
}

function evaluatePixel(s) {
  let ndvi = (s.B08 - s.B04) / (s.B08 + s.B04 + 1e-6);
  let evi = 2.5 * (s.B08 - s.B04) / (s.B08 + 6.0 * s.B04 - 7.5 * s.B02 + 1.0 + 1e-6);
  return {
    ndvi: [ndvi],
    evi: [evi]
  };
}`;

  const { data } = await axios.post(
    STATS_URL,
    {
      input: {
        bounds: { bbox },
        data: defaultInputData
      },
      aggregation: {
        timeRange: {
          from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
          to: new Date().toISOString()
        },
        aggregationInterval: { of: 'P1D' },
        width: 256,
        height: 256,
        evalscript
      },
      calculations: {
        ndvi: { statistics: { default: { percentiles: { k: [50] } } } },
        evi: { statistics: { default: { percentiles: { k: [50] } } } }
      }
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const entries = Object.values(data?.data || {});
  const valid = entries.filter((item) => item.outputs?.ndvi?.bands?.B0?.stats && item.outputs?.evi?.bands?.B0?.stats);
  const latest = valid.at(-1);

  const ndvi = latest?.outputs?.ndvi?.bands?.B0?.stats?.mean ?? 0;
  const evi = latest?.outputs?.evi?.bands?.B0?.stats?.mean ?? 0;
  return { ndvi, evi };
};
