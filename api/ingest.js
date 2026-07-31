// Vercel serverless function: receives anonymous funnel events from the avatar
// page and writes them into Supabase. The Supabase service key lives ONLY here
// (server-side env var) and never reaches the browser.
//
// Required Vercel environment variables:
//   SUPABASE_URL                 e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY    (Supabase → Project Settings → API → service_role)

const ALLOWED_EVENTS = new Set([
  'page_view', 'chat_started', 'avatar_loaded', 'lead_captured', 'booking',
]);

async function sb(path, opts = {}) {
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return fetch(`${base}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Server not configured (missing Supabase env vars).' });
  }

  try {
    // sendBeacon delivers a Blob; make sure we can read either shape.
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body || '{}');
    if (!body || typeof body !== 'object') body = {};

    const { client_slug, visitor_id, event_type, session_id = null, metadata = null } = body;

    if (!client_slug || !event_type) {
      return res.status(400).json({ error: 'Missing client_slug or event_type.' });
    }
    if (!ALLOWED_EVENTS.has(event_type)) {
      return res.status(400).json({ error: 'Unknown event_type.' });
    }

    // Resolve the client's id from its slug.
    const cRes = await sb(`clients?slug=eq.${encodeURIComponent(client_slug)}&select=id`);
    const clients = await cRes.json();
    if (!Array.isArray(clients) || !clients[0]) {
      return res.status(404).json({ error: `No client found for slug "${client_slug}".` });
    }
    const client_id = clients[0].id;

    // Insert the event.
    const iRes = await sb('events', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify([{ client_id, session_id, visitor_id, event_type, metadata }]),
    });

    if (!iRes.ok) {
      const detail = await iRes.text();
      return res.status(502).json({ error: 'Insert failed', detail });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
}
