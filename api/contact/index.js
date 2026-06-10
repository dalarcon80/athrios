// Athrios "Request a briefing" → email via Resend (server-side; the API key is a
// Static Web Apps application setting, never shipped to the client). Reuses the
// account's verified domain (dalarcon.info) so it can deliver to any inbox.
const esc = (s) =>
  String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

module.exports = async function (context, req) {
  const json = (status, body) => {
    context.res = { status, headers: { 'Content-Type': 'application/json' }, body };
  };

  const b = (req && req.body) || {};
  const name = b.name, email = b.email, org = b.organization, priority = b.business_priority;

  if (!name || !email || !priority) {
    return json(400, { success: false, message: 'Missing required fields' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return json(500, {
      success: false,
      message: 'Email service not configured',
      _diag: {
        present: 'RESEND_API_KEY' in process.env,
        len: (process.env.RESEND_API_KEY || '').length,
        resendKeys: Object.keys(process.env).filter(function (k) { return /resend/i.test(k); }),
        totalEnv: Object.keys(process.env).length
      }
    });
  }

  const html =
    '<h2>New briefing request — Athrios</h2>' +
    '<p><strong>Name:</strong> ' + esc(name) + '</p>' +
    '<p><strong>Work email:</strong> ' + esc(email) + '</p>' +
    '<p><strong>Organization:</strong> ' + esc(org || '—') + '</p>' +
    '<p><strong>Business priority:</strong> ' + esc(priority) + '</p>';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Athrios <briefings@dalarcon.info>',
        to: ['daniel.alarconr@outlook.com'],
        reply_to: email,
        subject: 'Athrios — briefing request: ' + priority,
        html: html,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      context.log.error('Resend error', r.status, JSON.stringify(data));
      return json(502, { success: false, message: (data && data.message) || 'Email failed to send' });
    }
    return json(200, { success: true, id: data && data.id });
  } catch (e) {
    context.log.error('Resend exception', e && e.message);
    return json(500, { success: false, message: 'Failed to send message' });
  }
};
