---
id: powershell-heredoc-double-quotes
date: 2026-06-26
type: friction
tags: [#git, #client-specific]
scope: client-specific
status: active
---

# PowerShell here-strings break on embedded double quotes in `git commit -m`

## Symptom

Committing with a multi-line message via a single-quoted here-string:

```powershell
git commit -m @'
feat(scope): title with "quoted words" inside
...
'@
```

fails with `error: pathspec '...' did not match any file(s)` — git receives
the message fragments as pathspecs. It happened twice this session, both
times when the body contained literal `"double quotes"` (e.g. a quoted
`"Option A"`). Removing the double quotes made the identical command work.

## Cause

In this shell layer the `@'...'@` here-string is not parsed as a single
literal argument once it contains `"` — the double quotes are treated as
string delimiters, so `-m` binds only the first token and the rest spill
into argv as pathspecs.

## Resolution

- **Author commit/PR bodies without literal double quotes.** Use plain
  words, single quotes, em dashes, or middots instead.
- Single quotes, `#`, parentheses, `—`, `·` inside the here-string are
  fine; only `"` triggers it.
- The closing `'@` must be at column 0.

## Prevent recurrence

Keep commit titles/bodies quote-free by default. If a quote is essential,
write the message to a file and use `git commit -F <file>`.
