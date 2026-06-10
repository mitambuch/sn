# Sawnext Studio

Conciergerie privée suisse pour clientèle HNW. Accès curaté à des biens,
expériences et opportunités exclusives. Plateforme bilingue (FR/EN),
hébergée en UE, brand voice retenue et factuelle.

---

## Tech stack

| Layer           | Technology          | Version                 |
| --------------- | ------------------- | ----------------------- |
| Framework       | React               | 19                      |
| Language        | TypeScript          | 5.9 (strict, all flags) |
| Bundler         | Vite                | 7                       |
| Styling         | Tailwind CSS        | 4                       |
| Testing         | Vitest + Playwright | latest                  |
| Linting         | ESLint 9 + Prettier | latest                  |
| Package manager | pnpm                | 10                      |
| Icons           | Lucide React        | latest                  |

## Design system

All tokens live in [`src/index.css`](src/index.css) — single source of truth.

| Token     | Dark    | Light   |
| --------- | ------- | ------- |
| `accent`  | #c44040 | #c44040 |
| `bg`      | #0A0A0A | #B0B0A8 |
| `fg`      | #F0F0F0 | #1A1A1A |
| `surface` | #141414 | #A4A49C |
| `muted`   | #8A8A8A | #4A4A44 |

Fonts: **Space Grotesk** (sans) + **JetBrains Mono** (mono).
Duration tokens: `fast` (150ms), `base` (300ms), `slow` (500ms), `cinematic` (700ms).

Customize per project via `/init` or edit `src/index.css` directly.

## AI workflow

39 slash commands, 8 specialized agents, 25 contextual rules — all in `.claude/`.

| Category          | Commands                                                                        |
| ----------------- | ------------------------------------------------------------------------------- |
| **Scaffold**      | `/new-page`, `/new-component`, `/new-feature`, `/new-hook`, `/add-api`, `/init` |
| **Design**        | `/brief`, `/design`, `/design-explore`, `/design-convert`                       |
| **Quality**       | `/test`, `/review`, `/fix`, `/lighthouse`, `/responsive-check`, `/health-check` |
| **Ship**          | `/release`, `/deploy`, `/handoff`, `/pre-delivery`, `/changelog-client`         |
| **Evolve**        | `/refactor`, `/migrate`, `/theme`, `/update-deps`, `/legal`                     |
| **Content**       | `/wire-content`, `/translate`, `/sync-content`                                  |
| **Orchestration** | `/dispatch`, `/morning-brief`, `/context`                                       |
| **Delegate**      | `/delegate`, `/integrate`                                                       |
| **Explore**       | `/status`, `/discover`, `/connect`, `/install-extension`, `/spec`               |

## Architecture

```
src/
├── app/                — routes, providers, layout
├── components/
│   ├── ui/             — reusable atoms (Button, Card, Modal, Select, Tabs…)
│   ├── layout/         — Header, Container
│   └── features/       — ErrorBoundary, SeoHead
├── config/             — env.ts, site.ts, cloudinary.ts
├── context/            — ThemeContext
├── features/           — feature modules (component + hook + types)
├── hooks/              — useToast, useMediaQuery, useCopyToClipboard
├── pages/              — page components (one per route)
├── styles/             — fonts.css, animations.css
├── utils/              — cn(), helpers
├── lib/                — API services
└── workbench/          — playground sections, shared components
```

## Scripts

| Command              | What it does                     |
| -------------------- | -------------------------------- |
| `pnpm dev`           | Dev server (port 5173)           |
| `pnpm build`         | Production build                 |
| `pnpm validate`      | Lint + typecheck + test + build  |
| `pnpm test:coverage` | Unit tests with coverage report  |
| `pnpm test:e2e`      | Playwright E2E tests             |
| `pnpm release`       | Version bump + changelog + tag   |
| `pnpm setup`         | Interactive project setup wizard |
| `pnpm base:update`   | Pull updates from upstream base  |
| `pnpm analyze`       | Bundle size visualization        |
| `pnpm doctor`        | Project health check             |

## Testing

- **Unit**: Vitest with jsdom, 300+ tests (incl. script smoke tests)
- **E2E**: Playwright on production build (Chromium + Firefox + WebKit)
- **A11y**: axe-core integration (unit + E2E)
- **Lighthouse CI**: a11y + best-practices + SEO + performance ≥ 0.9

## CI/CD

GitHub Actions pipeline:

1. **validate** — ESLint, TypeScript, Vitest, Vite build (Node 22)
2. **e2e** — Playwright on built preview
3. **lighthouse** — Performance + a11y scores

## Security headers & external services

The base ships with strict CSP and security headers in [`netlify.toml`](netlify.toml) and [`vercel.json`](vercel.json).

Sanity read endpoints are allowed by default because the starter ships with an
optional Sanity content stack. When connecting to other external APIs or
third-party services, expand these per project:

```
# Example: adding an external API
connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io https://api.example.com;
```

**Where to adjust:**

- `netlify.toml` → `Content-Security-Policy` header value
- `vercel.json` → `Content-Security-Policy` header value
- For other platforms: configure equivalent headers in your deployment config

Do not loosen security globally. Add only the domains your project actually uses.

## Principles

- **Reuse-first** — check `components/ui/` before creating anything new
- **Token-first** — no local colors/spacing if a token covers the need
- **Branch-first** — never commit to `main` directly
- **Validate-first** — `pnpm validate` before every commit
