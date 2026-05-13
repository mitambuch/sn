// ═══════════════════════════════════════════════════
// ShareDialog — content of the Sanity Document Action modal
//
// WHAT: A self-contained dialog body shown when Salva clicks "Partager
//       cette fiche…" on any shareable doc. Three modes driven by the
//       doc's visibility field :
//
//       · public   — show the public canonical URL + WhatsApp / Email /
//                    Copy buttons with the pre-filled brand-voice text.
//       · shareCode — explain the flow (a code grants single-fiche
//                     access), and provide a big "Ouvrir le générateur
//                     de code" button that deeplinks to /admin/share-
//                     codes with the doc pre-filled.
//       · private  — explain that the fiche is locked, hint the path
//                    forward (change Visibility to public or shareCode).
//
// WHEN: Used by shareDocumentAction.tsx — no other call site.
// NOTE: Standalone — does not import from src/, so the Studio bundle
//       stays decoupled from the app bundle. The share-message template
//       is duplicated by design (tiny, brand-voice-stable).
// ═══════════════════════════════════════════════════

import {
  CheckmarkIcon,
  ClipboardIcon,
  EnvelopeIcon,
  EarthGlobeIcon,
  LockIcon,
  LinkIcon,
} from '@sanity/icons';
import { Box, Button, Card, Code, Flex, Inline, Stack, Text } from '@sanity/ui';
import { useCallback, useState } from 'react';

const TYPE_LABELS_FR: Record<string, string> = {
  event: 'évènement',
  property: 'propriété',
  timepiece: 'pièce horlogère',
  artwork: "œuvre d'art",
  journey: 'voyage',
  conciergeService: 'service',
  article: 'actualité',
};

const ARTICLE_VOWELS = new Set(['évènement', 'actualité', "œuvre d'art"]);

const buildShareMessage = (docType: string, title: string, url: string): string => {
  const noun = TYPE_LABELS_FR[docType] ?? 'fiche';
  const article = ARTICLE_VOWELS.has(noun) ? 'une' : noun === 'évènement' ? 'un' : 'une';
  const head = title
    ? `Bonjour, voici ${article} ${noun} que je souhaite vous partager : ${title}.`
    : `Bonjour, voici une fiche que je souhaite vous partager.`;
  return `${head}\n\n${url}`;
};

const buildWhatsAppUrl = (msg: string): string => `https://wa.me/?text=${encodeURIComponent(msg)}`;
const buildMailtoUrl = (subject: string, body: string): string =>
  `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

interface ShareDialogProps {
  docType: string;
  docId: string;
  title: string;
  visibility: 'private' | 'public' | 'shareCode';
  publicUrl: string;
  adminDeeplink: string;
}

export function ShareDialog(props: ShareDialogProps) {
  const { docType, title, visibility, publicUrl, adminDeeplink } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Best-effort: silent fail. Salva will see the URL right next to the button.
    }
  }, []);

  // ── PRIVATE ───────────────────────────────────────────
  if (visibility === 'private') {
    return (
      <Box padding={4}>
        <Stack space={4}>
          <Flex align="center" gap={3}>
            <LockIcon style={{ fontSize: 24 }} />
            <Text size={2} weight="medium">
              Cette fiche est privée
            </Text>
          </Flex>
          <Text size={1} muted>
            Une fiche privée n&apos;est visible que dans l&apos;espace client (membres connectés).
            Pour la partager publiquement ou via un code unique, change le mode dans le groupe{' '}
            <strong>🔓 Visibilité &amp; partage</strong> en haut de la fiche, puis publie.
          </Text>
          <Card padding={3} radius={2} tone="primary">
            <Stack space={3}>
              <Text size={1} weight="medium">
                Les deux options :
              </Text>
              <Text size={1}>
                <strong>🌐 Publique</strong> — URL canonique indexée par Google, visible par tout le
                monde.
              </Text>
              <Text size={1}>
                <strong>🔑 Code de partage</strong> — un code <Code size={1}>SAW-XXXX-XXXX</Code>{' '}
                donne accès à cette fiche seule, sans authentification.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Box>
    );
  }

  // ── PUBLIC ────────────────────────────────────────────
  if (visibility === 'public') {
    if (!publicUrl) {
      return (
        <Box padding={4}>
          <Stack space={4}>
            <Text size={2} weight="medium">
              URL non disponible
            </Text>
            <Text size={1} muted>
              Cette fiche est en mode public mais n&apos;a pas encore de slug. Renseigne le champ{' '}
              <strong>Slug URL</strong> dans <strong>🎯 Essentiel</strong>, puis publie pour générer
              l&apos;URL.
            </Text>
          </Stack>
        </Box>
      );
    }

    const message = buildShareMessage(docType, title, publicUrl);

    return (
      <Box padding={4}>
        <Stack space={4}>
          <Flex align="center" gap={3}>
            <EarthGlobeIcon style={{ fontSize: 24 }} />
            <Text size={2} weight="medium">
              URL publique de cette fiche
            </Text>
          </Flex>

          <Card padding={3} radius={2} tone="transparent" border>
            <Stack space={2}>
              <Text size={0} muted>
                Lien à partager
              </Text>
              <Code size={1} style={{ wordBreak: 'break-all' }}>
                {publicUrl}
              </Code>
            </Stack>
          </Card>

          <Box>
            <Text size={1} muted style={{ marginBottom: 8 }}>
              Texte pré-rempli :
            </Text>
            <Card padding={3} radius={2} tone="transparent" border>
              <Text size={1} style={{ whiteSpace: 'pre-wrap' }}>
                {message}
              </Text>
            </Card>
          </Box>

          <Inline space={2}>
            <Button
              as="a"
              href={buildWhatsAppUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              text="Envoyer sur WhatsApp"
              tone="primary"
              mode="default"
            />
            <Button
              as="a"
              href={buildMailtoUrl('Sawnext — Une fiche pour vous', message)}
              icon={EnvelopeIcon}
              text="Email"
              mode="ghost"
            />
            <Button
              icon={copied ? CheckmarkIcon : ClipboardIcon}
              text={copied ? 'Copié' : 'Copier le lien'}
              mode="ghost"
              onClick={() => {
                void handleCopy(publicUrl);
              }}
            />
          </Inline>
        </Stack>
      </Box>
    );
  }

  // ── SHARE CODE ────────────────────────────────────────
  return (
    <Box padding={4}>
      <Stack space={4}>
        <Flex align="center" gap={3}>
          <LinkIcon style={{ fontSize: 24 }} />
          <Text size={2} weight="medium">
            Partage par code unique
          </Text>
        </Flex>
        <Text size={1} muted>
          Cette fiche est configurée pour le partage par code. Un code{' '}
          <Code size={1}>SAW-XXXX-XXXX</Code> donne accès à cette fiche seule, sans
          authentification. Tu peux en générer plusieurs (un par destinataire) et choisir une date
          d&apos;expiration ou un nombre de vues maximum.
        </Text>

        <Card padding={3} radius={2} tone="primary">
          <Stack space={3}>
            <Text size={1} weight="medium">
              Comment faire :
            </Text>
            <Text size={1}>
              1. Clique sur <strong>Ouvrir le générateur</strong> ci-dessous.
            </Text>
            <Text size={1}>
              2. Le type de fiche et l&apos;ID sont déjà pré-remplis — tu n&apos;as qu&apos;à
              choisir une expiration (optionnel) puis cliquer <strong>Générer</strong>.
            </Text>
            <Text size={1}>
              3. Le code et l&apos;URL <Code size={1}>/share/SAW-XXXX-XXXX</Code> sont prêts à être
              envoyés sur WhatsApp.
            </Text>
          </Stack>
        </Card>

        <Inline space={2}>
          <Button
            as="a"
            href={adminDeeplink}
            target="_blank"
            rel="noopener noreferrer"
            text="Ouvrir le générateur de code"
            tone="primary"
            mode="default"
          />
        </Inline>
      </Stack>
    </Box>
  );
}
