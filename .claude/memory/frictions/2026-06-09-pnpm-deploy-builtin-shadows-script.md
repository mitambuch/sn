---
id: pnpm-deploy-builtin-shadows-script
date: 2026-06-09
type: friction
tags: [#build, #friction, #sanity]
scope: template
status: active
---

# `pnpm --filter X deploy` runs pnpm's builtin, not the package's `deploy` script

Deploying the Studio via `pnpm studio:deploy` failed with:

```
ERR_PNPM_INVALID_DEPLOY_TARGET  This command requires one parameter
```

## Cause

`deploy` is a **reserved pnpm built-in command** (`pnpm deploy <target>` for
deployable-package bundling). When a root script does
`pnpm --filter @steaksoap/studio deploy`, pnpm runs the **builtin**, not the
`deploy` script defined in `studio/package.json` (`sanity deploy`). The builtin
demands a target dir → hard error. Same trap exists for other reserved verbs
(`pnpm install`, `pnpm test` is fine via run, etc.).

## Fix

Insert the explicit `run` keyword so pnpm runs the package script:

```diff
- "studio:deploy": "pnpm --filter @steaksoap/studio deploy",
+ "studio:deploy": "pnpm --filter @steaksoap/studio run deploy",
```

Manual workaround if the root script isn't fixed yet:
`pnpm --filter @steaksoap/studio run deploy`.

## Lesson

Any root script that proxies a workspace script whose name collides with a
pnpm builtin (`deploy`, `dlx`, `link`, `patch`, `start`...) **must** use
`run`. The plain `--filter X <name>` form is only safe for non-reserved names.
Template-scope: this script ships in the base, so the fix propagates.
