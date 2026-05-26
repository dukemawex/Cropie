import { computeBboxFromGeoJSON, polygonToWKT } from '../netlify/functions/lib/geo.js';

describe('geo helpers', () => {
  const polygon = {
    type: 'Polygon',
    coordinates: [[[32.5, -1.2], [32.6, -1.2], [32.6, -1.1], [32.5, -1.1], [32.5, -1.2]]]
  };

  test('computes bbox correctly', () => {
    expect(computeBboxFromGeoJSON(polygon)).toEqual([32.5, -1.2, 32.6, -1.1]);
  });

  test('converts polygon to wkt', () => {
    expect(polygonToWKT(polygon)).toContain('POLYGON((');
    expect(polygonToWKT(polygon)).toContain('32.5 -1.2');
  });
});
