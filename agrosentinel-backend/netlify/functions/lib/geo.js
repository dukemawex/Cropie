export const computeBboxFromGeoJSON = (polygon) => {
  if (!polygon || polygon.type !== 'Polygon' || !Array.isArray(polygon.coordinates?.[0])) {
    throw new Error('Invalid GeoJSON polygon');
  }

  const points = polygon.coordinates[0];
  const lons = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);

  return [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)];
};

export const polygonToWKT = (polygon) => {
  if (!polygon || polygon.type !== 'Polygon') throw new Error('Invalid GeoJSON polygon');
  const ring = polygon.coordinates[0]
    .map(([lng, lat]) => `${lng} ${lat}`)
    .join(', ');
  return `POLYGON((${ring}))`;
};
