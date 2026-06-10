// Athrios serverless contact endpoint → email via Resend (server-side; the API
// key is a Static Web Apps application setting, never shipped to the client).
// Reuses the account's verified dalarcon.info domain so it can deliver to any
// inbox. Handles two payloads: the "Request a briefing" form, and the
// "Value Conversion Pressure Test" lead capture (source: 'pressure-test').
const esc = (s) =>
  String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

module.exports = async function (context, req) {
  const json = (status, body) => {
    context.res = { status, headers: { 'Content-Type': 'application/json' }, body };
  };

  const b = (req && req.body) || {};
  const email = b.email;
  let subject, html;

  if (b.source === 'pressure-test') {
    if (!email) return json(400, { success: false, message: 'Missing required fields' });
    const DIMS = ['Demand & Ownership', 'Execution & Quality Gates', 'Adoption', 'Measurement & Monetization'];
    const sc = Array.isArray(b.dimension_scores) ? b.dimension_scores : [];
    subject = 'Athrios — pressure test lead: ' + (b.index != null ? b.index + '/100' : 'new');
    html =
      '<h2>New pressure-test lead — Athrios</h2>' +
      '<p><strong>Work email:</strong> ' + esc(email) + '</p>' +
      '<p><strong>Value Conversion Index:</strong> ' + esc(b.index) + '/100 (band ' + esc(b.overall) + '/2)</p>' +
      '<p><strong>Self-rated confidence:</strong> ' + esc(b.confidence) + '/10</p>' +
      '<p><strong>Time to value:</strong> ' + esc(b.time_to_value || '—') + '</p>' +
      '<p><strong>Dimension scores:</strong> ' + DIMS.map((n, i) => esc(n) + ': ' + esc(sc[i])).join(' · ') + '</p>' +
      '<p><strong>Answers (0–2):</strong> ' + esc(JSON.stringify(b.answers)) + '</p>';
  } else {
    const name = b.name, org = b.organization, priority = b.business_priority;
    if (!name || !email || !priority) {
      return json(400, { success: false, message: 'Missing required fields' });
    }
    subject = 'Athrios — briefing request: ' + priority;
    html =
      '<h2>New briefing request — Athrios</h2>' +
      '<p><strong>Name:</strong> ' + esc(name) + '</p>' +
      '<p><strong>Work email:</strong> ' + esc(email) + '</p>' +
      '<p><strong>Organization:</strong> ' + esc(org || '—') + '</p>' +
      '<p><strong>Business priority:</strong> ' + esc(priority) + '</p>';
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return json(500, { success: false, message: 'Email service not configured' });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Athrios <briefings@dalarcon.info>',
        to: ['daniel.alarconr@outlook.com'],
        reply_to: email,
        subject: subject,
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
