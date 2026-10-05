import { createHmac, timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_COOKIE_PATH = '/api/admin/storage';
const SESSION_LIFETIME_SECONDS = 8 * 60 * 60;

function createSignature(timestamp: string, secret: string) {
  return createHmac('sha256', secret).update(timestamp).digest('hex');
}

export function createAdminSessionToken(secret: string) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  return `${timestamp}.${createSignature(timestamp, secret)}`;
}

export function hasValidAdminSession(request: NextRequest) {
  const secret = process.env.ADMIN_PASSWORD;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!secret || !token) return false;

  const [timestamp, signature, ...extraParts] = token.split('.');
  if (!timestamp || !signature || extraParts.length > 0) return false;

  const issuedAt = Number(timestamp);
  const now = Math.floor(Date.now() / 1000);
  if (
    !Number.isSafeInteger(issuedAt) ||
    issuedAt > now ||
    now - issuedAt > SESSION_LIFETIME_SECONDS
  ) {
    return false;
  }

  const expectedSignature = createSignature(timestamp, secret);
  const received = Buffer.from(signature, 'hex');
  const expected = Buffer.from(expectedSignature, 'hex');

  return (
    received.length === expected.length &&
    timingSafeEqual(received, expected)
  );
}
