# MuseumCheck Project Charter

Status: Active
Audience: maintainers, contributors, and AI coding agents
Last updated: 2026-07-26

This document is the product and engineering north star for MuseumCheck. Any AI agent, regardless of vendor or model family, should use it as the first decision filter before proposing or making changes.

## Mission

MuseumCheck helps families turn museum visits into shared parent-child exploration, so children build curiosity, confidence, and lasting affection for museums.

The product should make a real visit better. It should help parents guide attention, help children notice exhibits, and help museums offer a lightweight interactive layer without requiring heavy setup.

## Vision

MuseumCheck should become the simplest trusted companion for Chinese families visiting museums anywhere in the world:

- Families can open it instantly from an H5 web page, including QR-code entry at museum sites.
- Children can complete age-appropriate missions during a real museum visit.
- Parents get enough guidance to start meaningful conversations without becoming tour guides or teachers.
- Museums can onboard their own pages, tasks, images, and public activity walls with minimal operational burden.
- The system remains small, resilient, inexpensive to run, privacy-conscious, and easy for AI agents to improve safely.

Museum coverage is not limited to China. The current product voice, language, family assumptions, and onboarding flows should prioritize Chinese families first, while the data model and architecture should allow museums worldwide to be added without special-case rewrites.

The current product focus is H5 web. Mini-program-specific flows, platform APIs, and packaging should be ignored unless the maintainer explicitly asks for them. Mobile H5 is the primary experience because MuseumCheck is expected to be used during museum visits. PC should remain usable, especially for planning, administration, and longer content work, but PC polish is secondary to on-site mobile UX.

## Product Tenets

1. Real-world visit first

   MuseumCheck should encourage looking at exhibits, talking with family, and moving through the museum. It must not become a screen-first game that distracts from the visit.

2. Child-first, parent-enabled

   The child's task flow should be direct, visual, and low-friction. Parent content should support guidance and preparation without dominating the child's experience.

3. Age matters

   Tasks and explanations must fit the chosen age band. Content for younger children should emphasize observation and delight; older children can handle comparison, history, inference, and research.

4. Global museums, Chinese-family experience

   The museum catalog may include museums worldwide. The experience should remain optimized for Chinese families today, including Chinese-language guidance, family travel needs, and culturally understandable explanations.

5. Mobile-first H5, PC-compatible

   Mobile is the primary product surface for on-site QR-code use during museum visits. Features should be touch-friendly, fast, readable outdoors, and resilient on narrow screens. PC should remain functional and reasonably clean for planning, administration, and longer browsing sessions, but do not optimize PC at the expense of mobile visit UX.

6. Trust beats novelty

   Museum names, images, locations, exhibit descriptions, and task claims should be accurate or clearly marked as user-generated. Do not invent facts to make a page feel complete.

7. Privacy by default

   Local progress should stay local unless the user explicitly publishes or shares it. Public pages should avoid exposing unnecessary personal data.

8. Instant access

   A family at a museum entrance should be able to open the experience quickly on a phone, even on imperfect network conditions. Avoid heavy assets and fragile startup paths.

9. Museum-operator friendly

   QR-code workflows, public achievement walls, and admin tools should be understandable by non-engineers. Operational tools should be dense, clear, and hard to misuse.

10. Visual proof matters

   UI changes are not complete until they have been seen in a browser at realistic mobile and desktop sizes. Code review alone is not enough for visual or interaction work.

11. Small architecture, strong contracts

   Prefer plain, understandable HTML/CSS/JavaScript and existing repo patterns. Add abstractions only when they reduce real duplication or protect a cross-page contract.

12. Backward compatibility is a feature

   Existing localStorage keys, public URLs, database rows, image URLs, and deployed pages may already be in use. Preserve them or provide explicit migration/compatibility behavior.

## Engineering Tenets

1. Use the existing shape of the app before introducing new structure.
2. Keep static pages deployable without a build step unless there is a strong reason to change that contract.
3. Treat `config/api-endpoints.js` as the central API routing contract.
4. Treat `museumcheck.cn` as the canonical production API and asset origin.
5. Do not reintroduce `letmetry.cloud` into frontend runtime paths.
6. Prioritize H5 web behavior; do not optimize for mini-program packaging or platform APIs unless explicitly requested.
7. Design and test mobile first for user-facing visit flows; keep PC compatible, especially for planning and admin flows.
8. Prefer resilient client-side compatibility layers over risky production data rewrites when legacy data exists.
9. Keep shared scripts safe for multiple pages; check load order and missing DOM elements.
10. Write targeted tests for regressions that are likely to recur.
11. Use Playwright or browser checks for navigation, check-in, poster, and public wall behavior.
12. Keep docs in `docs/`; do not add new root Markdown files except the explicitly allowed root docs.

## AI Evolution Model

AI agents may help the project evolve autonomously, but autonomy means disciplined incremental improvement, not unsupervised product drift.

Every AI agent should follow this loop:

1. Read this charter, `AGENTS.md`, and task-relevant docs before changing code.
2. Inspect the actual source files instead of relying only on summaries or generated repo packs.
3. State assumptions when they affect product behavior, data, privacy, deployment, or architecture.
4. Make the smallest coherent change that moves the product toward the mission.
5. Verify locally with the narrowest meaningful test set, then broaden when the blast radius is larger.
6. Check the real deployed environment when the task concerns deployment, routing, assets, or browser behavior.
7. Leave durable context: update docs, tests, comments, or commit messages when the lesson should help the next agent.

## Autonomous Merge Policy

If a future change does not conflict with the mission, vision, or product tenets in this charter, and the relevant validation gates pass, AI agents may merge or push the change to `prod` without asking for another product decision.

If a future change conflicts with the mission, vision, or product tenets, or requires changing the mission, vision, or product tenets, the AI agent must pause and discuss the product direction with a human maintainer first. The maintainer decides whether to reject the change, adapt the implementation, or update this charter.

This policy does not override the explicit-approval requirements below. Production infrastructure, secrets, destructive operations, SSH access, database schema changes, and other high-risk actions still require explicit human approval.

## Autonomous Change Scope

AI agents may generally proceed without extra human approval for:

- Bug fixes with a clear reproduction path and low-risk implementation.
- Test additions or updates that encode existing intended behavior.
- Documentation updates that clarify current behavior.
- Small UI copy, layout, or accessibility improvements that preserve the current product intent.
- Data normalization that is deterministic, reversible, and validated.
- Refactors that are local, behavior-preserving, and covered by existing or added tests.

AI agents must ask for explicit approval before:

- Running `ssh`, `scp`, `sftp`, or any command that invokes SSH.
- Changing production server, Nginx, database, DNS, CDN, SSL, or GitHub Secrets configuration.
- Performing destructive operations, mass deletes, or irreversible data migration.
- Adding or upgrading major dependencies.
- Changing branch strategy, deployment topology, or public API contracts.
- Rewriting localStorage keys or database schema.
- Publishing user-generated content, sending messages to users, or changing privacy defaults.
- Introducing AI-generated museum facts, images, or recommendations without source review.

## Validation Gates

Use the smallest relevant gate first, then expand when needed:

- Static syntax: `node --check <file>` for changed JavaScript files.
- Unit tests: `npm test -- --runInBand` or targeted Jest files.
- Page health: `npm run verify:pages:fast`.
- E2E: `npm run e2e` or targeted Playwright specs for affected flows.
- Visual/browser checks: use Playwright screenshots or real browser inspection for UI changes.
- Deployment observation: use `gh run list`, `gh run view`, and `gh run watch` for GitHub Actions.
- Production smoke test: verify `https://museumcheck.cn/` for prod-facing changes.
- Dev smoke test: verify `https://jackandking.github.io/MuseumCheckDev/` for dev-facing changes.

For image and API routing changes, explicitly verify:

- No frontend request goes to `letmetry.cloud`.
- Legacy `https://letmetry.cloud/images/...` values render through `https://museumcheck.cn/images/...`.
- GitHub Pages uses `https://museumcheck.cn` as API origin.
- `museumcheck.cn` pages can use same-origin API paths.

## Branch And Deployment Contract

The active branch model is:

- `dev`: development branch, deployed to GitHub Pages dev environment.
- `prod`: production branch, deployed to GitHub Pages and the cloud server.

Do not assume a `main` branch exists for production work. If branch strategy needs to change, ask first and document it with an ADR.

## Cross-AI Handoff Format

When handing work from one AI agent to another, include:

- Current branch and latest commit.
- User goal in one sentence.
- Files changed or suspected.
- Commands already run and their outcomes.
- Known blockers, risks, and assumptions.
- Exact URLs or Actions run IDs checked.
- Next recommended step.

This keeps Codex, Claude, Copilot, Gemini, and future agents aligned on evidence instead of memory.

## Definition Of Done

A change is done when:

- It improves or protects the family museum visit experience.
- It follows this charter and the repository agent rules.
- It has been verified with tests or browser checks proportional to risk.
- It does not leak secrets or unnecessary user data.
- It does not introduce avoidable deployment or operational burden.
- The next maintainer or AI agent can understand why the change exists.
