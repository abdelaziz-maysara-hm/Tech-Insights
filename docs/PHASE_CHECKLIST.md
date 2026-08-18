# NetSec Atlas Phase Checklist

This checklist is mandatory for every future phase and batch.

## Before

- Read `ROADMAP.md` and `docs/AGENT_HANDOFF.md`.
- Pull latest `main` with safe fast-forward behavior.
- Confirm a clean working tree.
- Inspect the current phase requirements and only relevant files.
- Assess exposed execution/credit capacity; never invent a number.
- Do not begin work unlikely to finish safely in the current session.

## During

- Keep scope narrow and avoid unrelated refactors.
- Preserve backward compatibility and established architecture.
- Keep each batch buildable and independently useful.
- Commit logical completed work.
- Update documentation when architecture or project state changes.

## Validation

- Run `pnpm run typecheck`.
- Run `pnpm --filter @workspace/techpulse-ar run build`.
- Run phase-specific tests.
- Inspect sitemap/RSS when affected.
- Check for unresolved merge markers and unintended generated changes.

## After

- Update `CHANGELOG.md`.
- Update ROADMAP phase status.
- Update `docs/AGENT_HANDOFF.md`.
- Commit and push normally; never force-push.
- Verify the remote commit and report its exact SHA.
