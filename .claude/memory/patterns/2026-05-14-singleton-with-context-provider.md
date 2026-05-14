---
id: singleton-with-context-provider
date: 2026-05-14
type: pattern
tags: [#sanity, #state, #pattern, #template, #active]
scope: template
status: active
---

# Sanity singleton + React context provider = one fetch, N consumers

## Problem

A large singleton (siteConfig, landing) is read by 10+ components.
Calling the hook in each component triggers 10 GROQ fetches — even with
HTTP caching, that's pointless re-rendering churn.

## Solution

Wrap the consuming tree in a provider that calls the hook once :

```tsx
// src/context/LandingContentContext.tsx
const LandingContext = createContext<{ data: SanityLanding | null; loading: boolean }>({
  data: null,
  loading: false,
});

export const LandingContentProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading } = useLandingContent(); // single fetch
  const value = useMemo(() => ({ data, loading }), [data, loading]);
  return <LandingContext.Provider value={value}>{children}</LandingContext.Provider>;
};

export const useLandingContext = () => useContext(LandingContext);
```

Sections then consume :

```tsx
const { data: landing } = useLandingContext();
const text = resolveFieldOrFallback(landing?.field, locale, t('i18n.key'));
```

## Why this beats prop drilling

- Sections don't need to know the singleton type — they can subscribe
  to one or two fields each.
- Adding a field to the singleton is a 1-file change in the schema
  + the section that uses it ; no plumbing through 5 ancestors.
- The default value `{ data: null, loading: false }` means a section
  rendered outside the provider falls back to i18n cleanly (used in
  tests, in `/lab` previews).

## When to apply

- The singleton has > 5 fields read by > 3 components.
- The data shape is stable enough that adding fields is rare.

## When NOT to apply

- For collection-typed data (multiple events, properties, …) — those
  belong in `useSanityCollection` with mock fallback, where each list
  page owns its own fetch.
- For a singleton read by 1 component only — just call the hook there.

## Cross-refs

- Decision : `[[sanity-landing-singleton]]`
- i18n-sanity rule : `.claude/rules/i18n-sanity.md` (taxonomy
  "singleton partagé").
