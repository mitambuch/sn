// ═══════════════════════════════════════════════════
// Invite — personal invitation landing reached from a WhatsApp link
//
// WHAT: Renders a code-personalised landing with a 3-field form
//       (name, email, phone) that POSTs to /.netlify/functions/invite.
//       The code from the URL is decorative — Salva tracks who
//       received which code, no DB validation needed.
// WHEN: Route /:locale/invite/:code, reachable only via the
//       direct link Salva shares on WhatsApp / SMS / email.
// CHANGE COPY: src/locales/{fr,en}.json under invite.* — never inline.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { useParams } from 'react-router-dom';

export default function Invite() {
  const { code } = useParams<{ code: string }>();

  return (
    <Container size="md">
      <section className="flex min-h-screen flex-col justify-center py-24">
        <p className="text-muted font-mono text-xs tracking-[0.4em] uppercase">
          Invitation · {code ?? 'unknown'}
        </p>
        <h1 className="text-fg mt-8 max-w-2xl text-3xl font-light tracking-tight md:text-5xl">
          Une invitation personnelle.
        </h1>
        <p className="text-muted mt-6 max-w-xl text-base leading-relaxed">
          Sprint 3 — full form + Netlify function arrive next.
        </p>
      </section>
    </Container>
  );
}
