import { parseAuthHeader } from '../netlify/functions/lib/http.js';

describe('http helpers', () => {
  test('extracts bearer token', () => {
    expect(parseAuthHeader({ headers: { authorization: 'Bearer abc123' } })).toBe('abc123');
  });

  test('returns null when missing token', () => {
    expect(parseAuthHeader({ headers: {} })).toBe(null);
  });
});
