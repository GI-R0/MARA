import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCookieOptions, getAllowedOrigins } from '../src/config/cookies.js';

test('buildCookieOptions uses SameSite=None and Secure=true in production', () => {
  process.env.NODE_ENV = 'production';
  const options = buildCookieOptions();

  assert.equal(options.secure, true);
  assert.equal(options.sameSite, 'none');
  assert.equal(options.httpOnly, true);
  assert.equal(options.path, '/');
});

test('buildCookieOptions uses lax cookies in development', () => {
  process.env.NODE_ENV = 'development';
  const options = buildCookieOptions();

  assert.equal(options.secure, false);
  assert.equal(options.sameSite, 'lax');
});

test('getAllowedOrigins parses comma-separated values', () => {
  process.env.CORS_ORIGIN = 'https://a.com, https://b.com';
  const origins = getAllowedOrigins();

  assert.deepEqual(origins, ['https://a.com', 'https://b.com']);
});
