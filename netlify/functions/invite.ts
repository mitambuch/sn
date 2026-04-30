// ═══════════════════════════════════════════════════
// invite — receives a form submission from /:locale/invite/:code
//          and emails Salvatore via Resend.
//
// WHAT: POST handler that validates the payload, formats a brand-
//       aligned HTML email, and sends it through Resend's REST API.
//       In dev (no RESEND_API_KEY set) it logs the payload and
//       returns 200 so the UI flow can be exercised locally without
//       a key.
// WHEN: Auto-mounted by Netlify at /.netlify/functions/invite. The
//       page calls fetch(SUBMIT_URL) — no rewrites needed.
// SECURITY: RESEND_API_KEY is BACKEND-ONLY; never prefix with VITE_.
//           Set it in Netlify dashboard → Site settings → Env vars.
// ═══════════════════════════════════════════════════

interface InvitePayload {
  code: string;
  name: string;
  email: string;
  phone: string;
}

const TO_EMAIL = 'info@saw-next.ch';
const FROM_EMAIL = process.env.VITE_RESEND_FROM_EMAIL || 'invitations@saw-next.ch';
const FROM_NAME = 'SAW Next';

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
} as const;

function safe(value: string): string {
  return value.replace(/[<>&"']/g, ch => {
    switch (ch) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return ch;
    }
  });
}

function renderEmail(p: InvitePayload): { html: string; text: string } {
  const safeName = safe(p.name);
  const safeEmail = safe(p.email);
  const safePhone = safe(p.phone);
  const safeCode = safe(p.code);
  const stamp = new Date().toLocaleString('fr-CH', {
    timeZone: 'Europe/Zurich',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:32px 16px;background:#edf2f1;font-family:'Geist','Helvetica Neue',Arial,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;margin:0 auto;background:#edf2f1;">
      <tr><td style="padding:0 0 24px 0;font-family:'Geist Mono','SFMono-Regular',monospace;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#1a1a1a;">SAW &middot; NEXT</td></tr>
      <tr><td style="padding:0 0 8px 0;font-family:'Geist Mono','SFMono-Regular',monospace;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(26,26,26,0.5);">Nouvelle inscription</td></tr>
      <tr><td style="padding:0 0 32px 0;font-family:'Geist Mono','SFMono-Regular',monospace;font-size:24px;line-height:1.1;letter-spacing:-0.01em;text-transform:uppercase;color:#1a1a1a;">Code ${safeCode}</td></tr>
      <tr><td style="padding:24px 0;border-top:1px solid rgba(26,26,26,0.15);">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="120" style="padding:8px 0;font-family:'Geist Mono','SFMono-Regular',monospace;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(26,26,26,0.5);vertical-align:top;">Nom</td>
            <td style="padding:8px 0;font-size:15px;color:#1a1a1a;">${safeName}</td>
          </tr>
          <tr>
            <td width="120" style="padding:8px 0;font-family:'Geist Mono','SFMono-Regular',monospace;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(26,26,26,0.5);vertical-align:top;">Email</td>
            <td style="padding:8px 0;font-size:15px;color:#1a1a1a;"><a href="mailto:${safeEmail}" style="color:#1a1a1a;text-decoration:underline;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td width="120" style="padding:8px 0;font-family:'Geist Mono','SFMono-Regular',monospace;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(26,26,26,0.5);vertical-align:top;">Téléphone</td>
            <td style="padding:8px 0;font-size:15px;color:#1a1a1a;"><a href="tel:${safePhone.replace(/\s+/g, '')}" style="color:#1a1a1a;text-decoration:underline;">${safePhone}</a></td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding:24px 0;border-top:1px solid rgba(26,26,26,0.15);font-family:'Geist Mono','SFMono-Regular',monospace;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(26,26,26,0.5);">${safe(stamp)}</td></tr>
    </table>
  </body>
</html>`;

  const text = `SAW · NEXT — Nouvelle inscription

Code: ${p.code}
Nom: ${p.name}
Email: ${p.email}
Téléphone: ${p.phone}

Reçu: ${stamp}

Répondez directement à cet email pour contacter ${p.name}.`;

  return { html, text };
}

function isPayload(value: unknown): value is InvitePayload {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.code === 'string' &&
    typeof v.name === 'string' &&
    typeof v.email === 'string' &&
    typeof v.phone === 'string'
  );
}

export default async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json', ...cors },
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400,
      headers: { 'content-type': 'application/json', ...cors },
    });
  }

  if (!isPayload(body)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_shape' }), {
      status: 400,
      headers: { 'content-type': 'application/json', ...cors },
    });
  }

  const payload: InvitePayload = {
    code: body.code.slice(0, 64),
    name: body.name.trim().slice(0, 200),
    email: body.email.trim().slice(0, 200),
    phone: body.phone.trim().slice(0, 60),
  };

  if (!payload.name || payload.name.length < 2) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_name' }), {
      status: 400,
      headers: { 'content-type': 'application/json', ...cors },
    });
  }
  if (!isEmail(payload.email)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), {
      status: 400,
      headers: { 'content-type': 'application/json', ...cors },
    });
  }
  if (!payload.phone || payload.phone.length < 6) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_phone' }), {
      status: 400,
      headers: { 'content-type': 'application/json', ...cors },
    });
  }

  const apiKey = process.env.RESEND_API_KEY;

  // Dev fallback — no key configured. Log the payload, return ok=true so the
  // UI flow can be exercised. Production must set RESEND_API_KEY in Netlify.
  if (!apiKey) {
    console.log('[invite] RESEND_API_KEY missing — dev fallback. Payload:', payload);
    return new Response(JSON.stringify({ ok: true, dev: true }), {
      status: 200,
      headers: { 'content-type': 'application/json', ...cors },
    });
  }

  const { html, text } = renderEmail(payload);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [TO_EMAIL],
        reply_to: payload.email,
        subject: `Nouvelle inscription — ${payload.name} via ${payload.code}`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[invite] Resend rejected:', res.status, detail);
      return new Response(JSON.stringify({ ok: false, error: 'resend_failed' }), {
        status: 502,
        headers: { 'content-type': 'application/json', ...cors },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json', ...cors },
    });
  } catch (err) {
    console.error('[invite] network error:', err);
    return new Response(JSON.stringify({ ok: false, error: 'network' }), {
      status: 500,
      headers: { 'content-type': 'application/json', ...cors },
    });
  }
};
