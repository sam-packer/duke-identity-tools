---
name: duke-identity-tools
description: Integrate the `duke-identity-tools` TypeScript package correctly in application code. Use when a repo already depends on this library, when the user asks to add it, or when implementing Duke Streamer LDAP directory lookups by NetID, DUID, LDAP key, or free-text search in JavaScript or TypeScript projects.
---

# Duke Identity Tools

## Overview

Use this skill to write application code against the published `duke-identity-tools` package. This skill is for package integration and usage guidance, not for performing live directory lookups itself.

## Follow This Workflow

1. Confirm whether the repo already depends on `duke-identity-tools` or whether the user wants it added.
2. Read [references/api.md](./references/api.md) before writing integration code.
3. Instantiate one `DukeIdentityClient` with an `apiKey`.
4. Choose the library method that matches the identifier type being used.
5. Add explicit error handling only when the surrounding codebase or the user asks for it.

## Apply These Rules

- Import from `duke-identity-tools`.
- Prefer the packaged client over ad hoc `fetch` wrappers when this library is available in the project.
- Treat `fetchByNetId()` and `search()` as multi-result calls.
- Preserve the library's `Person` field names, including `display_name`.
- Use `baseUrl` and `timeout` only when the caller needs overrides.
- Keep generated code aligned with the repo's package manager and TypeScript conventions.

## Reach For The Right Method

- Use `fetchByNetId(netId)` for Duke NetID lookups.
- Use `fetchByDuid(duid)` for Duke Unique ID lookups.
- Use `fetchByLdapkey(ldapkey)` for LDAP key or UUID lookups.
- Use `search(query)` for free-text directory search.

## Reference

Read [references/api.md](./references/api.md) for the exact exported types, method signatures, return shapes, and example usage.
