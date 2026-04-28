#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   CLASSIFY-TASK — R0/R1/R2 dispatch classification

   Reads a user prompt (stdin or argv), returns a JSON classification
   used by the UserPromptSubmit hook to inject a [DISPATCH_CLASS]
   hint into Claude's context.

   Categories (from .claude/rules/dispatch.md) :
     R0 = mechanical / deterministic         → worker-haiku (cheap/fast)
     R1 = new code following existing pattern → worker-sonnet
     R2 = architecture / design / debug       → main Opus (no dispatch)
     SKIP = conversational / info retrieval   → no hint injected

   Usage :
     echo "rename foo to bar" | node scripts/classify-task.js
     node scripts/classify-task.js "create a new Button component with test"

   Output (stdout) : { "class": "R0"|"R1"|"R2"|"SKIP", "confidence": 0..1, "reason": "..." }
   ═══════════════════════════════════════════════════════════════ */

// WHY: classification is heuristic, not AI. It runs in a <5s hook so we
// stay on simple regex patterns. Worst case: misclassify → hint is wrong
// → Claude ignores it. Better than no hint at all.

// WHY flag `u` everywhere: Unicode-safe regex semantics.
// WHY no leading `\b` before accented chars ([eé]cri, [aà] jour, etc.):
// JS `\b` is ASCII-only even with `u` flag (the `v` flag fixes it but isn't
// universally supported yet). `(?:^|\s)` serves as boundary where needed.
const R0_PATTERNS = [
  // French — existing
  /\b(renomme|renommer|bump|archiv|déplace|deplace)\b/iu,
  /(?:^|\s)(?:réindex|reindex)\b/iu,
  /\bajouter? (une )?cl(?:é|e) (locale|i18n)/iu,
  /(?:^|\s)mettre? (?:à|a) jour la? version/iu,
  /\bregen(?:er|ère)?\b/iu,
  /(?:^|\s)régen(?:er|ère)?/iu,
  // French — broadened (v6.7.2): natural phrasings for mechanical ops
  /\b(patche?|patcher?|propage?|propager?|applique?|appliquer?)\b/iu,
  /\b(nettoi|clean(-| )?up|reformat|prettify)/iu,
  /\b(rattrap|catch(-| )?up|resync|re-?sync)/iu,
  /\b(bump(er)?|upgrade(r)?)\s+(les\s+)?deps?\b/iu,
  /(?:^|\s)mets?\s+(?:à|a)\s+jour\s+(les\s+)?deps?\b/iu,
  /\b(pnpm|npm) (memory|docs):(index|archive|sync)/iu,
  /\bsupprime?r? (le|la|les|ce|cette) (import|variable|fichier)/iu,
  // English — existing
  /\b(rename|regenerate|reindex|bump|move file|archive memory)\b/iu,
  /\badd (a )?locale key/iu,
  /\bversion bump\b/iu,
  // English — broadened
  /\b(propagate|apply patch|sync (docs|memory|upstream))\b/iu,
  /\b(tidy up|format (the )?code|autofix)\b/iu,
  /\bpatch (the )?(client|site|project|repo)\b/iu,
  /\bbump (the )?deps\b/iu,
  // File ops
  /\bregen(erate)? INDEX/iu,
  /\bpnpm memory:(index|archive)\b/iu,
];

const R1_PATTERNS = [
  // French — existing (with `u` flag so accented starters are caught)
  /\bnouveau (composant|atom|hook|page|test|validator|slash|script)/iu,
  /\bnouvelle (page|feature|commande|command|route)/iu,
  /(?:^|\s)cr(?:ée|ee|éer|eer|éé|eé)r? (un|une) (composant|page|hook|test|feature|atom)/iu,
  // WHY double-space fix: the optional `(un|une|des)?` used to leave a
  // required double-space when absent — we now make the article+space
  // optional as a unit, and accept tests?/specs?.
  /(?:^|\s)(?:é|e)cri(s|re|t)\s+(?:(?:un|une|des)\s+)?(tests?|specs?)\b/iu,
  /\bfix(e|er)? (le|la|ce) bug.*(repro|reproduit|reproduction)/iu,
  // WHY widen "ajouter" → "ajoute?r?" and keep the original noun list so
  // "ajoute un champ" matches even though the old regex required infinitive.
  /\b(ajoute?r?|add) (un|une|a) (champ|field|route|endpoint|schema)\b/iu,
  // French — broadened (v6.7.2)
  /(?:^|\s)(?:impl(?:é|e)mente?r?|monte?r?|extract(er|ion)?)\b/iu,
  /\bajoute?r? (un|une) (bouton|input|modal|composant|page|hook)\b/iu,
  /\bcorrige?r? (le|la|ce) (bug|d[eé]faut|probl[eè]me)\b/iu,
  /\b(refactor(e|er)?) (local|ce fichier|cette fonction)/iu,
  // English — existing
  /\bnew (component|page|hook|feature|atom|slash command|validator|test)/iu,
  /\bcreate (a|an) (component|page|hook|test|feature|atom)/iu,
  /\bwrite (a|an) test/iu,
  /\bfix (the |this )?bug.*(repro|reproduced)/iu,
  /\badd (a|an) (field|endpoint|route|schema)/iu,
  // English — broadened
  /\bimplement (a|an|the) (component|page|hook|feature|atom|function)/iu,
  /\bextract (a|an|the) (component|hook|helper|function)/iu,
  /\blocal refactor\b/iu,
];

const R2_PATTERNS = [
  // French
  /\b(architecture|refactor(age)? (cross|global)|migration globale)/iu,
  /\b(direction design|redesign|refonte visuelle)/iu,
  /\b(debug|d[eé]bogger).*(sans repro|h(eu|é)rist|mystery)/iu,
  /\b(audit|analyse|plan|roadmap|strat[eé]gie|str[aâ]t[eé]g)/iu,
  /\bchoix (de |d')(librairie|library|framework|pattern)/iu,
  // English
  /\b(architecture|cross-cutting refactor|global refactor)/iu,
  /\b(design direction|redesign)/iu,
  /\bdebug without repro/iu,
  /\b(audit|plan|roadmap|strategy|strategize)/iu,
  /\blibrary choice|framework choice/iu,
];

const SKIP_PATTERNS = [
  // Pure info retrieval / conversational
  /^(o[uù] (on )?en est|status|liste|montre|liste-moi|t'as ou)/iu,
  /^(c'est (quoi|comment)|explique|pourquoi|comment)/iu,
  /^(git status|git log|ls |cat |grep )/iu,
  /^(what is|how does|show me|list)/iu,
  /^(help|aide|thanks|merci|ok|oui|non|yes|no)\b/iu,
  /^\s*$/, // empty
];

function classify(prompt) {
  const text = (prompt || '').trim();
  if (!text) return { class: 'SKIP', confidence: 1, reason: 'empty prompt' };

  for (const rx of SKIP_PATTERNS) {
    if (rx.test(text)) return { class: 'SKIP', confidence: 0.9, reason: 'conversational/info' };
  }

  let r2 = 0;
  let r1 = 0;
  let r0 = 0;
  for (const rx of R2_PATTERNS) if (rx.test(text)) r2++;
  for (const rx of R1_PATTERNS) if (rx.test(text)) r1++;
  for (const rx of R0_PATTERNS) if (rx.test(text)) r0++;

  // R2 wins if present (architecture trumps everything — stays main thread)
  if (r2 > 0) {
    return {
      class: 'R2',
      confidence: Math.min(1, 0.6 + r2 * 0.15),
      reason: `architecture/design/audit signal (${r2} match)`,
    };
  }
  if (r1 > 0) {
    return {
      class: 'R1',
      confidence: Math.min(1, 0.6 + r1 * 0.15),
      reason: `new-code-following-pattern signal (${r1} match) → worker-sonnet`,
    };
  }
  if (r0 > 0) {
    return {
      class: 'R0',
      confidence: Math.min(1, 0.6 + r0 * 0.15),
      reason: `mechanical/deterministic signal (${r0} match) → worker-haiku`,
    };
  }

  // Uncertain — don't inject hint, let Claude reason freely
  return { class: 'SKIP', confidence: 0.4, reason: 'no confident signal' };
}

async function readStdin() {
  if (!process.stdin.isTTY) {
    let data = '';
    for await (const chunk of process.stdin) data += chunk;
    return data.trim();
  }
  return '';
}

async function main() {
  const arg = process.argv.slice(2).join(' ').trim();
  const prompt = arg || (await readStdin());
  const result = classify(prompt);
  process.stdout.write(JSON.stringify(result));
}

export { classify };

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('classify-task.js')) {
  main().catch(err => {
    process.stderr.write(`classify-task failed: ${err.message}\n`);
    process.stdout.write(JSON.stringify({ class: 'SKIP', confidence: 0, reason: 'error' }));
    process.exit(0);
  });
}
