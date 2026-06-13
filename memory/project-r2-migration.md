---
name: project-r2-migration
description: R2 migration plan status and what the user needs to do before implementation can begin
metadata:
  type: project
---

R2 migration plan is written and awaiting user approval + manual setup.

**Why:** Supabase storage egress is ~535 MB/day serving 6 proof images. Cloudflare R2 has zero egress fees.

**Plan location:** `dev/features/r2-migration/` — Stage 1 complete, Stage 2 awaiting user approval.

**User must do before Stage 3 can start:**
1. Create R2 bucket in Cloudflare dashboard (name: `activity-proofs`)
2. Enable public access on the bucket
3. Add custom domain `cdn.1millionmiles.app` (requires `1millionmiles.app` on Cloudflare DNS)
4. Create R2 API token with Object Read & Write on the bucket
5. Have credentials ready: Account ID, Access Key ID, Secret Access Key

**Also bundled in this release (bug fixes):**
- `revalidateTag('dashboard-stats', 'max')` in submit route — remove `'max'` arg
- `proof-modal.tsx` still imports/uses `formatTrustName` — remove it
- Post-submit stats refetch hits browser HTTP cache — add `{ cache: 'no-store' }` to fetch in `use-dashboard-state.ts`

**How to apply:** When user says "continue r2-migration Stage 3", read `dev/features/r2-migration/02-design-plan.md` for the full implementation plan before touching any code.
