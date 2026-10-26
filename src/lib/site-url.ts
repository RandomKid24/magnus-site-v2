const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : '';
// `||` (not `??`) so an APP_URL that is set but empty still falls back.
const raw = (process.env.APP_URL || vercelUrl || 'http://localhost:3000')
  .replace(/["'\s]/g, '')
  .replace(/\/$/, '');

/** Public site origin. Set APP_URL to the real domain in production. */
export const SITE_URL = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;

export const SITE_NAME = 'Magnus Enterprises';
export const SITE_DESCRIPTION =
  'Precision CNC machining, VMC milling, CNC turning and switchgear assembly in Nashik, India.';
