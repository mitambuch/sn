# Changelog

## [1.2.2](https://github.com/mitambuch/sn/compare/v1.2.1...v1.2.2) (2026-05-29)

### 🐛 Fixes

* **login:** removed forced `data-theme="dark"` from the page wrapper — /login now follows the html-level theme (default light) instead of being permanently dark. The submit button reverts to the adaptive `bg-fg text-bg` tokens. v1.2.1 fixed the wrong layer (button color) while the regression was the entire page being theme-forced.

## [1.2.1](https://github.com/mitambuch/sn/compare/v1.2.0...v1.2.1) (2026-05-29)

### 🐛 Fixes

* **login:** submit button now uses stable `on-ink` tokens so it reliably renders WHITE regardless of theme cascade (was visually dark on the live deploy because `bg-fg` resolved via the `data-theme='dark'` wrapper which wasn't winning the cascade). Matches the landing primary CTA visual language.

## [1.2.0](https://github.com/mitambuch/sn/compare/v1.1.1...v1.2.0) (2026-05-29)

Same-day minor — finishes the Sanity wire-up by surfacing SEO meta defaults from the singleton and populating the landing-singleton in prod.

### ✨ Features

* **seo:** SeoHead resolves description / siteName / seoTitle from Sanity `siteConfig-singleton` (LocaleField chain via `resolveField`) with prop > Sanity > local config defaults
* **sanity:** surgical `push-landing.js` for landing-singleton-only writes (mirror of push-site-config.js)

### 🛠 Chore

* **sanity:** `landing-singleton` pushed to k2xrvftw/production with the 42 fields from `studio/fixtures/sawnext-seed.json` — the home page footer (LandingFooter wired in v1.1.1) now renders Sanity-driven content

### 📝 Known limitation

* Static prerender (`scripts/prerender-meta.js` postbuild) still emits local config defaults for the build-time HTML. Bots that execute JavaScript pick up the Sanity values within ~100ms after hydration. Build-time Sanity fetch deferred to v1.3.x.

## [1.1.1](https://github.com/mitambuch/sn/compare/v1.1.0...v1.1.1) (2026-05-29)

Same-day patch — extends the Sanity wire-up to the home page footer
and ships operator provisioning tooling.

### 🐛 Fixes

* **landing:** wire LandingFooter seat city to Sanity `landing.footerLocation` with i18n fallback (closes the v1.1.0 audit gap where the home page footer was i18n-only)

### 🛠 Chore

* **supabase:** add `create-admin-user.js` for operator provisioning (invite or password modes)
* **ops:** add `audit-prod-data.js` + `sql/2026-05-29-salva-promote-and-audit.sql` for prod data audit + Salva admin promotion (postgres-role SQL bypasses column-level GRANTs that `sb_secret_*` keys lack)

### 📝 Docs

* **memory:** session journals 1406 + bilingual catalogue friction (carry-over) + swatch firewall block friction (enterprise client PAN-DB recategorization required)

## [1.1.0](https://github.com/mitambuch/sn/compare/v0.2.0...v1.1.0) (2026-05-29)

Post-demo milestone — admin operator panel complete, Sanity Studio populated in production, public Footer reads global config from the CMS. The 1.0.0 jump reflects "MVP shipped at client demo on 2026-05-29 12:00" and 1.1.0 captures same-day polish + Sanity wire-up.

### ✨ Features

* **admin:** access requests kanban triage (`/admin/access-requests`) + nav consolidation
* **admin:** AdminUsers refondu — promote/demote inline, filters tabs, search, role badges
* **admin:** AdminDashboard activity feed (4 sources merged) + visibility stats rows on Inquiries / Catalogue
* **footer:** Footer reads copyright / footerTagline / contactEmail from Sanity `siteConfig-singleton` with i18n fallback

### 🐛 Fixes

* **ci:** hoist VITE_APP_URL to workflow-level env (e2e + lighthouse)
* **ci:** recalibrate bundle size thresholds to 2.2MB project baseline
* **landing:** strip trailing dots + commas from titles per Salva feedback

### 🛠 Chore

* **sanity:** surgical `push-site-config.js` for singleton-only writes (does not touch landing / catalogue / team)
* **sanity:** siteConfig-singleton populated in `k2xrvftw/production` (copyright, contactEmail, footerTagline FR+EN, SEO defaults)
* **docs:** session journals 1105 + 1316 + bilingual catalogue gap friction documented

### 📝 Known limitation (carry-over)

* Catalogue detail pages render `title.fr` regardless of active locale. Bilingual rendering across catalogue (event, property, timepiece, artwork, journey, conciergeService, article) deferred — see `.claude/memory/frictions/2026-05-29-bilingual-detail-gap.md` for the refactor plan. Target : v1.2.x.

## [0.2.0](https://github.com/mitambuch/sn/compare/v0.3.0...v0.2.0) (2026-05-27)

### ✨ Features

* **access:** catalogue teaser using backend Card + Mono placeholder ([31662d8](https://github.com/mitambuch/sn/commit/31662d8599774d20a3fcacc26c58a001f3c29094)), closes [#s08](https://github.com/mitambuch/sn/issues/s08)
* **access:** pièce maîtresse — events tease + dual-mode modal (request / code) ([f21921d](https://github.com/mitambuch/sn/commit/f21921d894af46088319e5ef248b0417841764f4))
* **account:** AccountInquiries + Dashboard read from Supabase ([7928031](https://github.com/mitambuch/sn/commit/7928031d332ae92e6d0e70ebc62145a6e08aa29b))
* **account:** AuthHeader (SN + logout) + light bottom nav ([0535cf6](https://github.com/mitambuch/sn/commit/0535cf6cfde406167bf01ca4ebe16063d92c3b01))
* **account:** center-docked FAB + drop Collection from bottom nav ([21451d5](https://github.com/mitambuch/sn/commit/21451d5cb249ef165bee4ca902e94c23f71b9c28))
* **account:** mobile bottom nav + sidebar polish + dashboard chrome ([bf9112c](https://github.com/mitambuch/sn/commit/bf9112c586581b2168b15faec6f7a07ccbc0fb12))
* **account:** real dashboard grid — full-width + invert concierge ([dddc9ed](https://github.com/mitambuch/sn/commit/dddc9edc09994079df7a130c57665c00716c8599))
* **admin:** AdminCatalogue becomes a monitoring hub, creation moves to Sanity ([0d0a874](https://github.com/mitambuch/sn/commit/0d0a87489b1d36ae5c5071f0699d2722865a5ca4))
* **admin:** AdminInvitations Supabase live (generate + revoke + list) ([b09f5d8](https://github.com/mitambuch/sn/commit/b09f5d8244dbd52bb9b31459c712fcb9ee69af79))
* **admin:** Inquiries + Users + Dashboard read from Supabase ([025d939](https://github.com/mitambuch/sn/commit/025d9395fbcba554a3ef48404e49cd89d7f7c221))
* **admin:** mobile-first AdminInvitations + tap-to-copy + WhatsApp share ([18d71b6](https://github.com/mitambuch/sn/commit/18d71b63788eb47d3a0b50bf39ee8799ebc12132))
* **auth:** atomic redeem_invitation_code RPC + confirmInvitationRedemption ([f3529f9](https://github.com/mitambuch/sn/commit/f3529f95b1a76af39159f771d205f56a998baf75))
* **brand+motion:** light default + 35mm grain + mono typo ([96fc59d](https://github.com/mitambuch/sn/commit/96fc59dc0eddeb4b3306e4dd7376562b07a58a2f)), closes [#bcbcbc](https://github.com/mitambuch/sn/issues/bcbcbc) [#2a2a2a](https://github.com/mitambuch/sn/issues/2a2a2a)
* **brand:** <BrandMark /> canonical — pixel-perfect SAW↗NEXT (weight 600) ([6197a56](https://github.com/mitambuch/sn/commit/6197a56392ef6666c51264df65d30a21a1cb621e))
* **brand:** Geist Mono full-glyph + SAW↗NEXT identity foundation ([106a4a8](https://github.com/mitambuch/sn/commit/106a4a8b4b91ecffcc110b96c46f563ba491262e))
* **card:** MonoGradient fallback in Card.Media + fix bottom band bug ([583728b](https://github.com/mitambuch/sn/commit/583728bd6b0aa164684d9b7b843e1c7ab921c9fe)), closes [#s08](https://github.com/mitambuch/sn/issues/s08)
* **catalogue:** full-bleed grouped sections + sticky filter + square pills ([0ddf9d8](https://github.com/mitambuch/sn/commit/0ddf9d87590d9056e5a5358b014ac524b72d84c0))
* **catalogue:** unified /account/catalogue + Timepiece material stat + Concierge cleanup ([a245b99](https://github.com/mitambuch/sn/commit/a245b99939c83cb1b7879d75137c39557daf9e41)), closes [#p0](https://github.com/mitambuch/sn/issues/p0)
* **dashboard+filters:** Offres exclusives shortcut + FilterChip box style ([ffdc4ec](https://github.com/mitambuch/sn/commit/ffdc4ecf259a7d444e6a307c716d819457527d25)), closes [#p0](https://github.com/mitambuch/sn/issues/p0) [#p0](https://github.com/mitambuch/sn/issues/p0)
* **demo:** Sawnext seed fixture + /exemple landing + DEMO2026 share code ([caec154](https://github.com/mitambuch/sn/commit/caec154bc2fec8de77026dcac361cc62652ff8e6))
* **devx:** per-project VS Code accent — same script as steaksoap ([d1445b3](https://github.com/mitambuch/sn/commit/d1445b36aaaa7cb1ca6bb5bb81c9ed0a37e0ed7c))
* **filter-bar:** etoiles-aux-atomes pill style — defined capsules ([6754a4f](https://github.com/mitambuch/sn/commit/6754a4f3f6e3593a87a167d3cfd7b35f28cf8c3d))
* **footer:** full-width breathing wordmark + compact 3-col + Hero-style TerminalBar ([00d9bd7](https://github.com/mitambuch/sn/commit/00d9bd767af1de57a60cb6f6172f1056626357f4))
* **forms+motion:** Lenis smooth scroll + <RequestDrawerShell> unifié ([361066c](https://github.com/mitambuch/sn/commit/361066c61838f33e209d0c19cb9857bdaf1ea46d))
* **interlocutor:** autoplay 8s rotation + progress bar + fixed height ([b6a92ad](https://github.com/mitambuch/sn/commit/b6a92ad063f04deb0e1536fe1b5d9991232f19dc))
* **landing+share:** fiche box, interlocutor promote, mobile terminal CTAs ([6c28b5f](https://github.com/mitambuch/sn/commit/6c28b5f664a15ad0dc65de98a45541224bd8909d))
* **landing:** hero terminal typewriter + video cycle per phrase ([721ae87](https://github.com/mitambuch/sn/commit/721ae8728d64443c1d4c676b05dad39fd25f4342))
* **landing:** hero video bg + mix-blend headline, slower bold marquee ([1e0b41e](https://github.com/mitambuch/sn/commit/1e0b41e1173a209e6aff7fedfc759b644e40bbde))
* **landing:** publique spine — Hero / Presentation / Access / Interlocutor ([ed87d4d](https://github.com/mitambuch/sn/commit/ed87d4d55f22d2f5804dbd825c21cd7361de5f50))
* **landing:** typewriter key-word negative + dark mask + 2-lines + slower ([6e88daf](https://github.com/mitambuch/sn/commit/6e88daf715780dea092faaf4ea91b61f1f3101d4))
* **layout:** dashboard épuré 3 sections + sidebar full-height + drawer mobile ([01b793a](https://github.com/mitambuch/sn/commit/01b793a8b47771966a7ff8177de5e9514f75b791))
* **login:** global LoginModal — popup over the landing, not a route swap ([63f526f](https://github.com/mitambuch/sn/commit/63f526ff21a93fb0f0beaf94c23bff92589b600c))
* **login:** popup-like centered card + drop PublicLayout chrome ([45e516d](https://github.com/mitambuch/sn/commit/45e516df111c433bc32e7621795f9a59ead1c68a))
* **login:** restyle Espace privé with landing visual language ([6b88257](https://github.com/mitambuch/sn/commit/6b88257eb612d8ad24f3ec3a9f74276f3f2ea415))
* **manifesto:** replace radial-gradient fog with SVG turbulence layers ([028bfcb](https://github.com/mitambuch/sn/commit/028bfcb511609306bc6d59a835a99d9e88505697))
* **motion:** magnetic hover sur CTAs critiques (Phase 5) ([24e41e3](https://github.com/mitambuch/sn/commit/24e41e3d205746c2ce602aaff035583c8511c707))
* **motion:** scroll-reveal stagger sur 8 listings (Phase 3) ([b4067b0](https://github.com/mitambuch/sn/commit/b4067b04dfe90bb9d8de767e2f6aedc8a5ededfd))
* **motion:** view-transitions native inter-pages (Phase 4) ([dbf22fb](https://github.com/mitambuch/sn/commit/dbf22fb2ed0b6c046561eeb9ff0265152f78c17d))
* **observability:** opt-in Sentry init + CSP whitelist + env documentation ([ad4e8fb](https://github.com/mitambuch/sn/commit/ad4e8fbd046df80c6f0f57fd4e460d78fb2303cd))
* **onboarding:** step 1 validates code via RPC + step 2 updates profile ([173b34d](https://github.com/mitambuch/sn/commit/173b34d944ba837db1cf2195401f4a89400c4d1d))
* **sanity:** 8 domain schemas + visibility tri-state + desk structure ([e17ba94](https://github.com/mitambuch/sn/commit/e17ba943be4980e968d14abcd86c82e881cb629f))
* **sanity:** add landing singleton schema + desk entry ([2de9cc0](https://github.com/mitambuch/sn/commit/2de9cc03bedf6b0748d4dd452165143cf990d248))
* **sanity:** rewrite seed fixture + add --wipe to seed script ([f717157](https://github.com/mitambuch/sn/commit/f7171577833ed7b0f355cc740f219d6ba929ee7f))
* **sanity:** wire 7 detail pages with useSanityItem + GROQ queries ([e06d95f](https://github.com/mitambuch/sn/commit/e06d95fe2ac58f45bad35632e4bc8fc2d2d22e3e))
* **sanity:** wire 7 listings + AdminShareCodes — Phase 3 backend live ([27e8911](https://github.com/mitambuch/sn/commit/27e8911ae81f3065f7b857480cfe481a03994663))
* **sanity:** wire landing sections to Sanity singleton w/ i18n fallback ([816ab7d](https://github.com/mitambuch/sn/commit/816ab7ddf0f93cf3f90a6fa8b4a66b5704e840a2))
* **share:** 6-char codes (no SAW prefix) + OTP /exemple in light grey ([d6f657c](https://github.com/mitambuch/sn/commit/d6f657cfec293886e450781ce1b91c5f3dc09c7b))
* **share:** Salva autonomy — Studio share action + real SharePage ([5fd9d25](https://github.com/mitambuch/sn/commit/5fd9d2507b552c955cceceec41b83b68f0cb276b))
* **share:** share_codes table + RPC + public /share/:code route ([0430451](https://github.com/mitambuch/sn/commit/0430451a8d4b7a85b883598f90f7adbb3a4273e0))
* **studio:** action-first Dashboard with 4 tiles + live inquiry badge ([36f161c](https://github.com/mitambuch/sn/commit/36f161cfe2be5a1d3ee87c9d9274976ee280bf13))
* **team:** show 3 founders behind Salvatore — focal + inner circle layout ([19e911c](https://github.com/mitambuch/sn/commit/19e911cad4c699c3bab198fd6ba1a15457e6f696)), closes [#s09](https://github.com/mitambuch/sn/issues/s09)
* **ui:** Apple-closed Card system for 7 domain cards + admin ([0e68ba2](https://github.com/mitambuch/sn/commit/0e68ba2d3f860e675f7670fb77622baf038da40a))
* **ui:** Card.Badge slot + 7 cards strictly unified on 4:3 + frosted stamp ([3077b83](https://github.com/mitambuch/sn/commit/3077b8369375490679c2a6523d9022a373d92ee2))
* **ui:** Card.Countdown live timer + important pulsing outline ([dac203c](https://github.com/mitambuch/sn/commit/dac203c6110341044b01f50ce4801ec77b563d03)), closes [#1](https://github.com/mitambuch/sn/issues/1) [#1](https://github.com/mitambuch/sn/issues/1) [#1](https://github.com/mitambuch/sn/issues/1) [#1](https://github.com/mitambuch/sn/issues/1) [#1](https://github.com/mitambuch/sn/issues/1) [#1](https://github.com/mitambuch/sn/issues/1) [#1](https://github.com/mitambuch/sn/issues/1) [#1](https://github.com/mitambuch/sn/issues/1)
* **ui:** Card.Pill premium tag + footer signature for all 7 modules ([0fb4372](https://github.com/mitambuch/sn/commit/0fb43724889813e8613670486fb4e81da6c59170))
* **ui:** Card.Stats + Card.PriceBlock — infos structurées en un coup d'œil ([60cfd45](https://github.com/mitambuch/sn/commit/60cfd453c6945b955f0ad07b03b7986e56ac93af))
* **wizard:** "Other" category — inviting copy + roomier textarea ([792cc47](https://github.com/mitambuch/sn/commit/792cc4772051ff5b44cbf69b5d4052b0eb53a13e))
* **wizard:** 4-step split + footer nowrap + session journal ([be601dd](https://github.com/mitambuch/sn/commit/be601dde55d446db45ffa29115f9b1677f13728e))
* **wizard:** ConciergeRequestWizard 3-step modal + dashboard entry ([9d7d669](https://github.com/mitambuch/sn/commit/9d7d6697072d67a8d36ec86cffa445bc04a155f1))
* **wizard:** per-category fields (Travel + Timepiece) + callback fastpath ([71ded52](https://github.com/mitambuch/sn/commit/71ded526ae37dc7f5e5abf8a2735c151e4737007))
* **wizard:** premium RangeSlider + Stepper atoms — no manual digits ([da87c5e](https://github.com/mitambuch/sn/commit/da87c5e39e169af210a50b592b97fb23682cba93))
* **wizard:** propagate structured fields to real-estate, art, experience ([fde568a](https://github.com/mitambuch/sn/commit/fde568ad0fe16d611fda008121e2bb583276fffa))
* **wizard:** rework UI — segmented progress + denser inputs + h-12 CTAs ([35c003f](https://github.com/mitambuch/sn/commit/35c003fccf210a66dfd0ef0e54921a046e5e16f6))

### 🐛 Bug Fixes

* **a11y:** localize hardcoded English aria-labels (Phase 3 audit) ([ee3769b](https://github.com/mitambuch/sn/commit/ee3769b0bb9cb1ea97b05e4fb0ef6e75872851a5))
* **access:** align S08 headline size with other landing titles ([c23e444](https://github.com/mitambuch/sn/commit/c23e4447aae20089381a165c2d0f95f6a67c7070)), closes [#s08](https://github.com/mitambuch/sn/issues/s08) [#s05](https://github.com/mitambuch/sn/issues/s05)
* **account:** AccountInquiries items restructure mobile-first ([d12c029](https://github.com/mitambuch/sn/commit/d12c029f23a06c8cbbcc591ae81cd09def4dc98c)), closes [#p0](https://github.com/mitambuch/sn/issues/p0)
* **account:** app-shell density — flush header + hairline sections ([ea3c88e](https://github.com/mitambuch/sn/commit/ea3c88e27d8196358fea3b6129e4f6ea0a6037c0))
* **account:** concierge button height bump — h-16 + revert text bloat ([b1d2af2](https://github.com/mitambuch/sn/commit/b1d2af2a8ed6e82294ff5fea88d9f030ffb20ecd))
* **account:** concierge buttons column up to lg + short labels ([e2684aa](https://github.com/mitambuch/sn/commit/e2684aa0779710f2ad86194426d38ec153e09201))
* **account:** concierge buttons row + h-12 normal CTA height ([7d9ba3a](https://github.com/mitambuch/sn/commit/7d9ba3a5868d3fc96b13dd9ebcba1bc653cf3e5d))
* **account:** feed the concierge buttons — text-sm semibold size-18 icon ([e97658a](https://github.com/mitambuch/sn/commit/e97658a0959dd8cf661dbb3edeefb01f023b3920))
* **account:** light concierge variant + h-14 CTAs + voyage shortcut ([d82a863](https://github.com/mitambuch/sn/commit/d82a86339d2136b4742eb4557347fb3cae2231d7))
* **account:** real user name in greeting + admin sidebar entry for role=admin ([1fd9544](https://github.com/mitambuch/sn/commit/1fd954410c0b386b73150be7d27bcddc027d0750))
* **account:** remove ConciergeDock pinned bubble ([ef7f782](https://github.com/mitambuch/sn/commit/ef7f782afe31c43b3a51982ab04d310c0332cb11))
* **auth:** logout lands on the public landing, not /login ([8fcb18b](https://github.com/mitambuch/sn/commit/8fcb18bdd8020427084f221239ece8a5a1c68797))
* **build:** fallback on VERCEL_URL when VITE_APP_URL is unset ([c23cd69](https://github.com/mitambuch/sn/commit/c23cd69c6f011c24b37f4e706edbe6005d4aefdd))
* **catalogue:** +1 col per breakpoint + tighter mobile gap ([58550ae](https://github.com/mitambuch/sn/commit/58550ae7fa732b651f6fc28b225d29251ce3c1b3))
* **catalogue:** mobile back to 1 card per row ([6ef2aad](https://github.com/mitambuch/sn/commit/6ef2aadb9703283b706bd58296924295872b8964))
* **csp:** allow Supabase + Cloudinary media — login was CSP-blocked ([1b33132](https://github.com/mitambuch/sn/commit/1b331321d79d79ad433a983d02bdba8c0332a656))
* **csp:** allow Supabase in vercel.json connect-src (was missed) ([9931489](https://github.com/mitambuch/sn/commit/99314898ecd7e90ceb26f0db81fe931681199f10))
* **demo:** unconditional APERCU short-circuit + brand Studio Dashboard ([178be96](https://github.com/mitambuch/sn/commit/178be96109aae5d8d32b09fc994c2af9c3daace1)), closes [#60a5fa](https://github.com/mitambuch/sn/issues/60a5fa) [#a78bfa](https://github.com/mitambuch/sn/issues/a78bfa) [#34d399](https://github.com/mitambuch/sn/issues/34d399) [#fbbf24](https://github.com/mitambuch/sn/issues/fbbf24) [#f87171](https://github.com/mitambuch/sn/issues/f87171) [#d65a3a](https://github.com/mitambuch/sn/issues/d65a3a)
* **detail:** drop aside specs label (i18n key didn't exist + clutter) ([c394a79](https://github.com/mitambuch/sn/commit/c394a791ea660cdcde9a18b466a2840c264dfade))
* **detail:** TimepieceDetail desktop — CTA anchored bottom, PriceTag aside ([d166d50](https://github.com/mitambuch/sn/commit/d166d504373b09e58bfd5c2a80cda605b33ed7af))
* **detail:** TimepieceDetail hero packs specs + price + CTA (no empty space) ([1a7fa65](https://github.com/mitambuch/sn/commit/1a7fa65b15ddad7cb53c644b556ef05bf34a15ba))
* **detail:** TimepieceDetail restructure + SimilarItemsStrip compact ([42ef2bf](https://github.com/mitambuch/sn/commit/42ef2bf1672770509fc6c0d2dbc17f42836fa210)), closes [#p0](https://github.com/mitambuch/sn/issues/p0)
* **domains:** mobile-friendly — hide preview card + open Modal on tap ([f2fbd93](https://github.com/mitambuch/sn/commit/f2fbd933781fbf4aefc675ca8a75df822e324e3b)), closes [#s05](https://github.com/mitambuch/sn/issues/s05) [#s05](https://github.com/mitambuch/sn/issues/s05)
* **example:** apply tokenized 'animate-important' pulse on form card ([a6d37e0](https://github.com/mitambuch/sn/commit/a6d37e0a21a655c7731fd5e908942e18940e5b37))
* **example:** brand mark on top, form card layout, prominent back CTA ([3a929e7](https://github.com/mitambuch/sn/commit/3a929e75683283d53e84d0c0fbf1f5b1fa58f635))
* **example:** tolerate diacritics + manual Entrer + visible demo shortcut ([bd434e1](https://github.com/mitambuch/sn/commit/bd434e14f46e30f1d805977c033b896a6913b69a))
* **footer:** longer hold + single-line clock + 3 inverted CTAs + siège typo ([23ac5e4](https://github.com/mitambuch/sn/commit/23ac5e441ab3ad25c3dab8dac7455fad404983db))
* **i18n:** localize 4 hardcoded FR strings flagged by validate-i18n ([3998f5c](https://github.com/mitambuch/sn/commit/3998f5c83b0f9e2c33085756f2e898512f7ed823))
* **landing:** Card/Button atoms + drawer wiring + S05 Domaines ([12198fd](https://github.com/mitambuch/sn/commit/12198fd0433df7b65efd94abe57f240ee1251092)), closes [#s01](https://github.com/mitambuch/sn/issues/s01)
* **landing:** CSP media-src for Cloudinary video + Loader sur Home ([6d2a00b](https://github.com/mitambuch/sn/commit/6d2a00b58d506042ff0cca9eaf251c8bb21f8649))
* **landing:** grain on ink — overlay 0.3 + finer noise (anti-wash) ([2ec8ddc](https://github.com/mitambuch/sn/commit/2ec8ddcacaa308ef51d560dace071c49ef76f8d9)), closes [#0a0a0a](https://github.com/mitambuch/sn/issues/0a0a0a) [#0a0a0a](https://github.com/mitambuch/sn/issues/0a0a0a) [#0a0a0a](https://github.com/mitambuch/sn/issues/0a0a0a)
* **landing:** grain visible on dark + Access cards dark + Hero CTAs white ([1ed5245](https://github.com/mitambuch/sn/commit/1ed524505484dd9ffc2d358682f6e2a196347f09)), closes [#1a1a1a](https://github.com/mitambuch/sn/issues/1a1a1a)
* **landing:** hero font-medium + chrome mix-blend-difference ([2ead3fb](https://github.com/mitambuch/sn/commit/2ead3fb7155dceeb63aff7d7ab01305a4708e9bb))
* **landing:** hero top meta strip in negative over video ([9be7083](https://github.com/mitambuch/sn/commit/9be70835bd47779cf6d4e4f89f45d01207369fab))
* **landing:** hero video mask extend to bottom, keep tail fade for strip ([6da8476](https://github.com/mitambuch/sn/commit/6da84766374a9a1bd1ca9d03a92ec5de9c4e1f20))
* **landing:** hide top chrome until loader done ([1c309b1](https://github.com/mitambuch/sn/commit/1c309b1b1349d111b09e2f8a50b4bd0be3e3e770))
* **landing:** Presentation — triptyque dans col 3 du body (à côté paragraphes) ([bb59829](https://github.com/mitambuch/sn/commit/bb59829417ddc8232f229d9e0b8485bc4be48c97))
* **landing:** Presentation body — 2-col mirror header, triptyque aligns under lead ([68f8a24](https://github.com/mitambuch/sn/commit/68f8a2489e34ae9c8d8b8c7b2e0de92870ea4db5))
* **landing:** remove duplicate grain layer on dark sections ([a9ce587](https://github.com/mitambuch/sn/commit/a9ce587425270b94f5b33635e8e08a81992dd087)), closes [#0a0a0a](https://github.com/mitambuch/sn/issues/0a0a0a)
* **landing:** round 10 — triptyque width = lead, manifesto sticky restored ([2b9f495](https://github.com/mitambuch/sn/commit/2b9f495a7a32b7a208120fece0fa9df86ae5447e))
* **landing:** round 11 — manifesto fog above text, organic exit, softer white ([166d92f](https://github.com/mitambuch/sn/commit/166d92f9873e3078facfb3f0239fbf8805593916))
* **landing:** round 12 — text illumination, smoother fog, dwell between phrases ([4f6b7ba](https://github.com/mitambuch/sn/commit/4f6b7bac4e5d88fdaaa3d5351863692fce0fbc40))
* **landing:** round 2 feedback — TerminalBar sticky, premium boxes, menu CTAs ([b781d18](https://github.com/mitambuch/sn/commit/b781d18b57aebe5f151d17ac991a6145763116b9))
* **landing:** round 3 — immersion + Principles + breathing footer ([047ea43](https://github.com/mitambuch/sn/commit/047ea436a548355cb3ca889c4f54406d463434c1))
* **landing:** round 4 — Manifesto S02 + Principles blur-hover + Presentation visible ([f6b1088](https://github.com/mitambuch/sn/commit/f6b1088ef5692cf4fa359afb2d98182a98ac0e23))
* **landing:** round 5 — deeper black, Presentation extended, Access h2 calmer ([d66f574](https://github.com/mitambuch/sn/commit/d66f5746ef1db927e5684eb7ffbde8eb24c64b0e)), closes [#2a2a2a](https://github.com/mitambuch/sn/issues/2a2a2a) [#0a0a0a](https://github.com/mitambuch/sn/issues/0a0a0a) [#050505](https://github.com/mitambuch/sn/issues/050505) [#2a2a2a](https://github.com/mitambuch/sn/issues/2a2a2a) [#0a0a0a](https://github.com/mitambuch/sn/issues/0a0a0a)
* **landing:** round 6 — single black, luxe manifesto, grain on ink, logo morph ([d9c73d0](https://github.com/mitambuch/sn/commit/d9c73d03f1c48d76205993c7b006a8c1e73b663c)), closes [#0a0a0a](https://github.com/mitambuch/sn/issues/0a0a0a) [#2a2a2a](https://github.com/mitambuch/sn/issues/2a2a2a) [#0a0a0a](https://github.com/mitambuch/sn/issues/0a0a0a)
* **landing:** round 7 — sticky pinning, dense paragraphs, monumental method ([9f5713d](https://github.com/mitambuch/sn/commit/9f5713d6b417e4f73bb19ebde5982e0bae1ec611))
* **landing:** round 8 — manifesto pool + glow, method compact, no h-scroll ([ddd16ae](https://github.com/mitambuch/sn/commit/ddd16aee2cca7eb6413d20a7181f9229b1ec71f3))
* **landing:** round 9 — single black, manifesto fog + typo, S08 cleanup ([36874b0](https://github.com/mitambuch/sn/commit/36874b02a88f08f46dcbc2256717c849c8f63d29)), closes [#2a2a2a](https://github.com/mitambuch/sn/issues/2a2a2a) [#0a0a0a](https://github.com/mitambuch/sn/issues/0a0a0a)
* **landing:** wizard form, slim loader bar, login overlay, terminal fit ([d3d30b4](https://github.com/mitambuch/sn/commit/d3d30b450d472cb3798ddbcb348bb00833706b0b))
* **layout:** drop floating Cmd+K search button (UI clutter) ([560a83c](https://github.com/mitambuch/sn/commit/560a83c09f4501c3c515f4ab8a9a288b2d1eea8d))
* **layout:** i18n greeting keys + Header pill simplifié sur auth surfaces ([d92066b](https://github.com/mitambuch/sn/commit/d92066b8a7a9877ac4479d4211050f76238a9c3c))
* **loader:** scroll to top on Entrer so user lands on Hero ([a49ab77](https://github.com/mitambuch/sn/commit/a49ab77024f60a3fa495d5cbb4a125dc7918e1bb))
* **login:** freeze landing animations while modal is open (input lag) ([399cf10](https://github.com/mitambuch/sn/commit/399cf10c78367b417f6aaf69ff5d9082f9701a7a))
* **login:** unmount landing main while LoginModal is open (input freeze) ([3cf676b](https://github.com/mitambuch/sn/commit/3cf676b13bc96537221996ce7f2ea3d40f700ddf)), closes [#bcbcbc](https://github.com/mitambuch/sn/issues/bcbcbc)
* **mobile:** ConciergeCard buttons icon-only mobile, label revealed md+ ([93f918e](https://github.com/mitambuch/sn/commit/93f918e2e13ca4693e018302f4cce614ff1d4bec))
* **mobile:** pill collision + drawer w-64 + Concierge no-wrap + Saved Card ([2a47578](https://github.com/mitambuch/sn/commit/2a4757804f1ad1bf69d1406d6b7af3646c683159))
* **mobile:** RecentInquiries restructure — meta+pill en haut, message dessous ([72c7680](https://github.com/mitambuch/sn/commit/72c7680927f8d75f0da1072e3c20c8f74df91f0b))
* **mobile:** StatusPill nowrap + shrink-0 + RecentInquiries Card layout ([a3ca2a1](https://github.com/mitambuch/sn/commit/a3ca2a12da5b6e27633a0b91a033d5aa062aff5d))
* **modal:** split focus effect — one char at a time was a focus trap bug ([ddd3fd7](https://github.com/mitambuch/sn/commit/ddd3fd794c6580667e5d688da4d8dd52ea8ef358))
* **motion:** Lenis app-level + <BrandLink> + /motion showcase ([c869ffb](https://github.com/mitambuch/sn/commit/c869ffb496ed8a1c6989e09504771845c91f4570))
* **security:** close P0/P1/P2 findings from Phase 1 audit ([c9a9736](https://github.com/mitambuch/sn/commit/c9a9736aea596f3e3f48b62339b0fc583ced62ea))
* **share:** light mode + SN logo inside box + drop duplicate header ([7b28594](https://github.com/mitambuch/sn/commit/7b285942fac4a277ff2d304f7d8e86b5be97d3cb))
* **share:** rich mock fallback so /share/APERCU renders without seed ([21e3dfb](https://github.com/mitambuch/sn/commit/21e3dfb41d18499ce266fc1215881b6fb41d0ab9))
* **slider:** wrap RangeSlider in a bordered container ([a918cc8](https://github.com/mitambuch/sn/commit/a918cc8fe77ce80af2fd559d371b34f7a920852d))
* **studio:** filter system docs out of Dashboard activity + counts ([a0d1b8d](https://github.com/mitambuch/sn/commit/a0d1b8d5aed718e6061beffcf7cc449abbb17851))
* **test:** unblock validate — nested-modules exclude + 2 stale assertions ([a9380e0](https://github.com/mitambuch/sn/commit/a9380e082781ebb20c9e8f984ffd024087ef251e))
* **ui:** badge top-left réservé aux infos temporelles, pas aux produits ([e440a09](https://github.com/mitambuch/sn/commit/e440a090680e13f47eaffd118151200618b4f200))
* **ui:** Card.Body justify-end — cascade anchor bottom du contenu ([526dab1](https://github.com/mitambuch/sn/commit/526dab15503641d64ebf0262262e51caa0b7a227))
* **ui:** readable toast + chunkier RangeSlider ([56c3b5f](https://github.com/mitambuch/sn/commit/56c3b5f1b61f55b7eb5bcbb1abc2d03ca918bf0d))
* **ui:** restore same-height grille catalogue + Stats mt-auto ([24bba3c](https://github.com/mitambuch/sn/commit/24bba3c7b99231c062230b57e168213442b65d00))
* **ui:** retire PriceBlock dupliqués Event/Journey + same-height grille catalogue ([67862e7](https://github.com/mitambuch/sn/commit/67862e79906b0994bebce5f76511f2be2dd61995))
* **ui:** titre Article unifié sur les autres + catalogue items-start ([bc9dca3](https://github.com/mitambuch/sn/commit/bc9dca36471e769ae4ad01441e67e2b0b8a267ba))
* **wizard:** fixed modal height + centered always + cleaner callback label ([3e6e521](https://github.com/mitambuch/sn/commit/3e6e5216f389a229de47b4e811f5318d84ad22ae))
* **wizard:** mobile padding bump + dashboard shortcuts 2x2 grid + drop label ([1991cf9](https://github.com/mitambuch/sn/commit/1991cf985ad6dff1cfae4ee3996e9fee5da4c62a))
* **wizard:** no-scroll mantra — h-[88vh] modal + drop step ledes + tighter gaps ([9c03d43](https://github.com/mitambuch/sn/commit/9c03d43e1a7d2d1ac779d59159c661e67126283f))

### 📚 Documentation

* **sanity:** handoff guide + memory entries + docs sync ([86d81df](https://github.com/mitambuch/sn/commit/86d81df458c6aa31493c7ae340b707d76b7663a0))
* **ship:** pre-flight audit + memory entries + RELEASE CHECK ([cf1d233](https://github.com/mitambuch/sn/commit/cf1d2334e4ec63abd2b88c994862af9c4b4ec028))

### 🔧 Chores

* **devx:** pin VS Code accent to slate for sawnext ([67eb6ec](https://github.com/mitambuch/sn/commit/67eb6ecee9ceb679dbcd977020188e626acdfe05)), closes [#5a7090](https://github.com/mitambuch/sn/issues/5a7090) [#5a7090](https://github.com/mitambuch/sn/issues/5a7090)
* **memory:** final addendum journal — typewriter + merge sur main ([e4d0b21](https://github.com/mitambuch/sn/commit/e4d0b21ee168e1d2fc581e03d56f7ecad69e979c))
* **memory:** journal session 2026-05-13 — landing v0.7 + Sanity v0.8 sprint ([70de5e4](https://github.com/mitambuch/sn/commit/70de5e465f8094320719fb0c0ea65158f8c988ca))
* **memory:** journal session 2026-05-13 — Salva autonomy démo-ready ([f6a1ad1](https://github.com/mitambuch/sn/commit/f6a1ad1c14adafe90ec46c69a6eea23a49e77d93))
* **memory:** journal session 2026-05-13 — Salva autonomy share flow ([ed1540a](https://github.com/mitambuch/sn/commit/ed1540ab1a570ef9c79ac09c869749c4d3fa13f8))
* **memory:** regen digest pre-release v0.4.0 ([e5c0381](https://github.com/mitambuch/sn/commit/e5c03819ac7095bf024a54d7ae9721cd99f8d8f4))
* **memory:** session journal — Apple-closed Card system + push-further bias ([47e2c35](https://github.com/mitambuch/sn/commit/47e2c3513c0bb4670e9cb2a47993375c1d3877c7))
* **memory:** session journal — landing iteration marathon (rounds 2-13) ([b0f4271](https://github.com/mitambuch/sn/commit/b0f427184e257a6b40fb037edf31360ea84fb4f9))
* **memory:** session journal 2026-05-14-2140 + index regen ([0d27504](https://github.com/mitambuch/sn/commit/0d27504a922735c7e427456d9770dcba41a3ef22))
* **memory:** session journal design-night + docs counts sync ([c88228c](https://github.com/mitambuch/sn/commit/c88228c9e8647831fc3e9b6d2f9a8e3a2c8c1757))
* **sanity:** widen schema validator allowlist + finalise landing singleton wiring ([90f50d8](https://github.com/mitambuch/sn/commit/90f50d8250e3c7deeacd38afc8f4da115dac1a1a))
* **security:** pnpm overrides clear all 11 transitive vulns + audit doc final ([28d4645](https://github.com/mitambuch/sn/commit/28d4645def9c5bb72623fa7c11dc5c120dce0ec9))
* **studio:** pin studioHost + appId for non-interactive deploy ([444949e](https://github.com/mitambuch/sn/commit/444949e37d504ff930cb0c5f1a2cef22894edff9))
* **tests:** mock ResizeObserver + fix Home/App AuthProvider + sync docs ([3fb66b5](https://github.com/mitambuch/sn/commit/3fb66b57b8437fd279ab140010a246b159ccb6b3))

### ✅ Tests

* **coverage:** worker-dispatched smoke tests + OtpInput onComplete fix + ratchet ([39c39ca](https://github.com/mitambuch/sn/commit/39c39ca63da5b543fd8820060bffe7c154c54e88)), closes [#3](https://github.com/mitambuch/sn/issues/3)
* **e2e:** admin route reachability + public auth surface specs ([880d5cd](https://github.com/mitambuch/sn/commit/880d5cd87821dae75b0b01083bfa71288aa778e6))

All notable changes to this project will be documented in this file.

## [0.1.0] (2026-04-28)

### Features

- project initialized
