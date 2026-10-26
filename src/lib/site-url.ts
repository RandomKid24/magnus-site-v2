/** Public site origin, from APP_URL (set this to the real domain in production). */
export const SITE_URL = (process.env.APP_URL ?? 'http://localhost:3000').replace(/["'\s]/g, '').replace(/\/$/, '');

export const SITE_NAME = 'Magnus Enterprises';
export const SITE_DESCRIPTION =
  'Precision CNC machining, VMC milling, CNC turning and switchgear assembly in Nashik, India.';
