#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   FIX-TEAM — corrige UNIQUEMENT l'équipe (teamMember) dans Sanity

   Pourquoi ce script existe :
   La base Sanity production contenait d'anciens membres (Salvatore /
   Bokar / Harry) qui écrasaient le bon fallback du composant
   Interlocutor. On ne peut PAS utiliser `seed-sawnext --wipe` pour
   corriger : il efface aussi tout le catalogue (events, properties…)
   et réinjecte des fiches démo, ce qui détruirait le vrai contenu
   client. Ce script est chirurgical : il ne touche QUE le type
   `teamMember`.

   Ce qu'il fait :
     1. Supprime TOUS les documents `teamMember` (les anciens partent).
     2. Recrée les 5 membres corrects depuis
        studio/fixtures/sawnext-seed.json (Valmont focal + réseau).

   Le catalogue (event/property/timepiece/artwork/journey/
   conciergeService/article), les singletons et les pages ne sont
   JAMAIS touchés.

   Usage :
     pnpm sanity:fix-team             → dataset production par défaut
     pnpm sanity:fix-team --staging   → dataset staging
     pnpm sanity:fix-team --dry-run   → aperçu seulement, rien écrit

   Requires :
     SANITY_STUDIO_PROJECT_ID (ou VITE_SANITY_PROJECT_ID)
     SANITY_WRITE_TOKEN (scope Editor) — généré sur sanity.io/manage
   ═══════════════════════════════════════════════════════════════ */

import { createClient } from '@sanity/client';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

for (const envFile of ['.env.local', 'studio/.env.local', 'studio/.env']) {
  const path = resolve(repoRoot, envFile);
  if (existsSync(path)) process.loadEnvFile(path);
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const USE_STAGING = args.includes('--staging');

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const DATASET = USE_STAGING
  ? 'staging'
  : process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production';

if (!PROJECT_ID && !DRY_RUN) {
  console.error('  ✗ SANITY_STUDIO_PROJECT_ID manquant — à définir dans studio/.env.');
  process.exit(1);
}
if (!TOKEN && !DRY_RUN) {
  console.error(
    '  ✗ SANITY_WRITE_TOKEN manquant — génère-le sur sanity.io/manage → API → Tokens (scope Editor), puis colle-le dans .env.local.',
  );
  process.exit(1);
}

const fixturePath = resolve(__dirname, '..', 'fixtures', 'sawnext-seed.json');
if (!existsSync(fixturePath)) {
  console.error(`  ✗ Fixture introuvable : ${fixturePath}`);
  process.exit(1);
}

const fixture = JSON.parse(readFileSync(fixturePath, 'utf-8'));
const teamDocs = (fixture.documents || []).filter(doc => doc._type === 'teamMember');

if (teamDocs.length === 0) {
  console.error('  ✗ Aucun document teamMember dans la fixture.');
  process.exit(1);
}

const target = PROJECT_ID ? `${PROJECT_ID}/${DATASET}` : '(aucun projet configuré)';
console.log(
  `\n  Fix team — cible ${target}  (${teamDocs.length} membres)${DRY_RUN ? '  [DRY-RUN]' : ''}\n`,
);

if (DRY_RUN) {
  console.log('  ⚠  Tous les docs teamMember existants seraient supprimés, puis recréés :');
  for (const doc of teamDocs) {
    console.log(`  • ${doc._id} — ${doc.firstName} ${doc.lastName}${doc.isFocal ? ' (focal)' : ''}`);
  }
  console.log('\n  Rien écrit. Relance sans --dry-run pour appliquer.\n');
  process.exit(0);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2024-06-01',
  useCdn: false,
});

async function main() {
  // 1. Supprimer tous les teamMember existants (anciens membres inclus).
  console.log('  ⚠  Suppression des teamMember existants…');
  const deleted = await client.delete({ query: '*[_type == "teamMember"]' });
  const ids = deleted.results?.map(r => r.id) ?? [];
  console.log(`  ✓ ${ids.length} doc(s) supprimé(s)${ids.length ? ' : ' + ids.join(', ') : ''}\n`);

  // 2. Recréer les 5 membres corrects.
  let ok = 0;
  let failed = 0;
  for (const doc of teamDocs) {
    try {
      await client.createOrReplace(doc);
      console.log(`  ✓ ${doc._id} — ${doc.firstName} ${doc.lastName}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${doc._id} — ${err.message}`);
      failed++;
    }
  }
  console.log(`\n  Terminé : ${ok} créé(s), ${failed} échec(s).\n`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error(`  ✗ Fix team échoué — ${err.message}`);
  process.exit(1);
});
