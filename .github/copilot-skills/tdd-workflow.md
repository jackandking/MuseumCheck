---
name: museum-tdd-workflow
description: >-
  Test-Driven Development skill tailored for MuseumCheck. Guides Windsurf/Copilot agents through
  red-green-refactor loops, integrates with npm test suites, and enforces coverage and regression
  protections whenever users ask for new features, bug fixes, or refactors.
---

# MuseumCheck TDD Workflow

This skill adapts the Everything Claude Code TDD playbook to MuseumCheck's stack (Node 20, Jest, Playwright
E2E, extensive `tests/` tree). Trigger it whenever you hear "add feature", "fix bug", "refactor", or the
user explicitly asks for TDD/red-green execution.

## Scope of Application

- Implementing or modifying UI behavior in `js/`, `core/`, `quiz/`, or `survey/`
- Fixing regressions reproduced by HTML harnesses under `tests/pages/`
- Updating data flows that persist to storage adapters or KV stores
- Building new npm scripts or CLI utilities inside `scripts/`
- Any change that could affect the nine core pages guarded by `npm run verify:pages:simple`

## Prerequisites

1. **Clean working tree** (`git status --short` is empty).
2. **Dependencies installed** (`npm install`).
3. **Node 20+** (`node -v`). Aligns with GitHub Actions runner.
4. **Jest + Playwright** available via `npm test` and `npx playwright test`.
5. **Context**: know which module you are touching and the nearest test file (usually mirrors folder name).

## Workflow Overview

```mermaid
flowchart TD
    A[Clarify requirement] --> B[Draft user journeys]
    B --> C[Author or update failing tests]
    C --> D[Run tests (expect RED)]
    D --> E[Implement minimal code]
    E --> F[Run tests (aim for GREEN)]
    F --> G[Refactor with safety net]
    G --> H[Check coverage + verification scripts]
```

### Step 1. Clarify Acceptance Criteria
- Capture user stories in `As a <role> I want <action> so that <benefit>` format.
- Note which page or script is impacted and any device constraints (mobile-first requirement applies here).

### Step 2. Locate or Create Tests
- Prefer colocated suites under `tests/` (unit/feature/ui) or HTML harnesses in `tests/pages/`.
- For front-end flows initiated from menu buttons, also consider E2E specs inside `e2e/`.
- If no suite exists, scaffold one mirroring repo conventions:
  - Unit: `tests/features/<area>/<feature>.test.js`
  - UI harness: `tests/pages/<page>.html`
  - E2E: `e2e/<feature>.spec.ts`

### Step 3. Write Failing Tests (RED)
- Cover primary happy path, error handling, and regression edge cases.
- Use semantics-friendly selectors (`data-testid`, role-based queries) since mobile viewport is standard.
- Mock network calls via `jest.spyOn(global, 'fetch')` or local storage helpers when necessary.

### Step 4. Minimal Implementation (GREEN)
- Modify only the files necessary to satisfy the failing tests.
- Keep museum data rules in mind (file placement guard, API endpoint auto-detection, etc.).

### Step 5. Refactor
- Remove duplication, simplify DOM queries, and ensure shared menu interactions stay centralized.
- Preserve behavior that pre-commit hooks expect (page verification, file placement, docs location).

### Step 6. Verify Coverage & Regressions

```bash
npm test -- --runInBand            # deterministic red/green loop
npm run coverage                   # repository coverage baseline (~80%)
npm run verify:pages:simple        # sanity check 9 critical pages
npm run verify:file-placement      # ensure new files live in allowed directories
```

Run `npx playwright test` if UI flows changed or when specifically requested.

### Step 7. Document & Surface Findings
- Summarize test evidence in the response (tests added, suites touched, verification status).
- Mention any skipped or TODO tests so humans can follow up.

## Testing Patterns Cheat Sheet

| Scenario | Pattern |
| --- | --- |
| DOM utility or adapter | Use Jest with JSDOM, import the module directly |
| Shared menu / navigation | Write integration test under `tests/features/menus/` and update relevant HTML harness |
| Quiz or survey logic | Mirror file under `quiz/js/` or `survey/` and target `tests/features/quiz/` or `tests/features/survey/` |
| Full flow (check-in → leaderboard) | Prefer `e2e/homepage.spec.ts` or create new spec |

## Common Pitfalls to Avoid
- **Writing code before tests** – always show the failing test output first.
- **Touching multiple domains** – split large tasks or clearly isolate commits (aligns with git workflow rules).
- **Skipping verification scripts** – pre-commit will run them anyway; catch failures proactively.
- **Forgetting mobile constraints** – when simulating UI behavior, assume mobile viewport and touch events.

## Success Criteria
- A failing test was observed before implementation.
- Tests pass locally with clear command output shared back to the user.
- Coverage and verification scripts succeed (or blockers are explicitly documented).
- The change description ties back to the original user journey and MuseumCheck constraints.
