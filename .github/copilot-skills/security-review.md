---
name: museum-security-review
description: >-
  Security checklist for MuseumCheck. Guides Windsurf/Copilot agents through static checks, data-handling
  validation, and regression traps whenever the user asks for security review, API changes, storage
  updates, or anything that might expose visitor data.
---

# MuseumCheck Security Review

Derived from the Everything Claude Code security skill and tightened for our static-site + API hybrid
architecture. Use it proactively when touching authentication-like flows (shared menu state, KV storage,
mock API server) or when the user mentions "secure", "audit", "pii", "token", "endpoint", etc.

## Scope & Triggers
- Updates to `config/api-endpoints.js`, adapters under `core/`, or fetch calls in `js/`
- Changes to storage adapters (localStorage, kv-storage, file storage)
- Modifications to admin or data-entry tooling under `admin/`, `survey/`, or `utils/`
- Any code consuming external APIs (letmetry.cloud, mock server, QR assets)
- Build scripts or CI changes that might expose secrets/logs

## Quick Checklist

| Area | Questions |
| --- | --- |
| Secrets & Keys | Are any API keys, tokens, or credentials added to the repo? Use `.env` or config indirection. |
| API Endpoints | Does the change hit letmetry.cloud vs localhost correctly? Ensure `API_ENDPOINTS` auto-detect logic stays intact. |
| Input Validation | Are user inputs (survey answers, museum names) sanitized before storage/render? Guard against markup injection in DOM updates. |
| Storage Safety | Are we storing only necessary fields in `localStorage`/KV? Avoid personal data beyond visit stats. |
| DOM Injection | When inserting HTML, use `textContent` or vetted templates; never `innerHTML` with raw input. |
| External Links | For new anchors, add `rel="noopener"` and ensure URLs come from trusted lists. |
| File Placement | Confirm new files live in approved directories so automated audits (file placement checker) can run. |

## Process
1. **Inventory the change**
   - List files touched and classify (UI, data, scripts, admin).
   - Identify any user-generated content passing through these files.
2. **Trace data flow**
   - From input → processing → storage → rendering.
   - Note where validation or encoding happens; add it if missing.
3. **Check APIs & Fetch Calls**
   - Ensure fetch URLs go through `API_ENDPOINTS` or config constants.
   - Verify error handling prevents leaking stack traces to UI.
4. **Review Storage & Caching**
   - Confirm TTL/expiration defaults for fireworks, check-ins, etc., remain within bounds.
   - Ensure storage keys defined in `APP_CONFIG.LOCAL_STORAGE_KEYS` are reused rather than duplicated ad hoc.
5. **Run Automated Safeguards**
   - `npm run verify:pages:simple` (catches missing resources that might indicate tampering).
   - `npm run verify:file-placement` and `npm run verify:docs-location` (enforces structure to limit accidental exposures).
   - `npm test -- security` if relevant suites exist; otherwise run targeted Jest tests for touched modules.
6. **Report Findings**
   - Summarize risks, mitigations, and any TODO follow-ups (e.g., future CSP headers) in the response.

## Red Flags & Mitigations
- **Inline script injections** → move logic into JS files and reference via `<script src>`.
- **Unescaped template literals** → wrap in helper that encodes HTML entities.
- **Open redirects** → validate query params against known pages.
- **Third-party script additions** → document origin and integrity, consider subresource integrity hashes.

## Success Criteria
- No secrets or personal data committed.
- Inputs validated or sanitized at the boundary.
- Storage usage documented and minimal.
- Automated verification scripts pass.
- Risks and mitigations clearly communicated.
