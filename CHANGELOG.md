# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.9.2] - 2026-07-12

### Added

- Submission cooldown: a submitter must wait 60 seconds between submissions, and an identical submission (same activity and distance) is rejected for 10 minutes, to stop accidental duplicate entries.

## [0.9.1] - 2026-07-12

### Added

- `robots.txt` (allows all crawlers, disallows `/api/`) and `sitemap.xml` listing `/`, `/about`, `/privacy`, and `/terms`, for search and AdSense crawler discovery.

### Fixed

- `/about` page title and heading reverted back to One Million Miles Challenge rather than the justgiving title

### Changed

- README rewritten as a project overview adding link to prod site, justgiving page etc

## [0.9.0] - 2026-07-12

### Added

- Real, crawlable `/about`, `/privacy`, and `/terms` pages, replacing the JS-only Privacy Policy and Terms of Service modals.
- Added an `/about` that tells the actual campaign story.
- Shared `StaticPageShell` component (`app/_components/static-page-shell.tsx`) to provide consistent header/footer chrome for the new content pages.

### Changed

- Homepage leaderboard and activity feed are now server-rendered on first load instead of fetched entirely client-side, so the initial HTML contains real content rather than an empty loading shell.
- Stats-fetching logic extracted from `/api/stats` into a shared server module (`app/_lib/get-stats.server.ts`), reused directly by the homepage server component and the API route.
- Footer "About" (previously mislabeled and opening the Terms modal), "Privacy", and "Terms" links now navigate to the real pages instead of opening modals.

### Removed

- Privacy Policy and Terms of Service modal components, superseded by the dedicated pages.

## [0.8.1] - 2026-07-10

### Added

- **Rowing** activity type in the submission form.

### Fixed

- "Laps of Earth" fun-fact on the homepage was inflated 14x by a stray `* 14` multiplier in the calculation, now removed, so it correctly reflects distance / Earth's circumference (24,901 mi).
- "Land's End → John o'Groats" fun-fact used an inaccurate 303-mile distance constant; updated to 874 miles, the commonly cited road distance for the route.

## [0.8.0] - 2026-06-17

### Added

- Optional **job role** on user profiles (Doctor, Nurse, ACP, Physio, Tech, Admin, Housekeeper, Dietician, Pharmacist, or a custom "Other" up to 15 characters), shown inline next to a member's name in the leaderboard and activity feed.
- One-time role prompt on sign-in via the profile modal, tracked by a new `role_prompted_at` column so it appears exactly once (existing users included) and never again after Save or "Skip for now".
- "Edit Profile" entry point in the nav: the signed-in chip is now a button that reopens the profile modal in edit mode to change name or role at any time.
- New-user profile modal pre-fills the first and last name from the Google account name.
- Shared `PREDEFINED_ROLES` constant (`lib/roles.ts`) used by both the profile API and the modal as a single source of truth.

### Changed

- `user_profiles` gains nullable `job_role` and `role_prompted_at` columns (additive migration, no defaults).
- `get_dashboard_stats()` is now `SECURITY DEFINER` with a pinned `search_path` and LEFT JOINs `user_profiles`, so `job_role` reaches the public leaderboard and activity feed.
- `/api/stats` route now imports the canonical `Stats` type instead of redeclaring it, keeping the two stats sources from drifting.

### Fixed

- Editing a profile name now **retroactively** updates the denormalised name on all of that user's past submissions, so the leaderboard and activity feed show their current name throughout their history
- Profile saves now invalidate and refetch the dashboard stats cache (`revalidateTag` + `no-store` refetch), so role and name changes appear without a manual reload.
- Stats display now shows dashes (-) for all figures when the database is temporarily unavailable, rather than leaving stale or broken values on the dashboard.
- `/api/stats` now returns a `503` with `Cache-Control: no-store` on database failure rather than an unhandled exception, so errors do not get cached by the CDN.

## [0.7.0] - 2026-06-13

### Added

- Proof images now upload to Cloudflare R2 (zero egress fees) instead of Supabase Storage, dramatically reducing storage egress costs.
- Public R2 URLs stored directly in `submission_proofs.storage_path` for new uploads, so no signing is required.
- One-off migration script (`scripts/migrate-proofs-to-r2.ts`) to move existing proof images from Supabase Storage to R2.
- Backwards-compatible URL detection in `/api/proofs`: old Supabase paths fall back to signed URLs during migration.

### Fixed

- Post-submit activity feed and stats now bypass the browser HTTP cache (`cache: 'no-store'`), so updates appear immediately after logging miles.
- NHS trust name in proof image modal now shows the full trust name, consistent with the rest of the app.

## [0.6.0] - 2026-06-13

### Added

- Personal stats card ("Your Personal Contribution So Far") showing a signed-in user's total miles logged and current leaderboard rank, visible only when authenticated.
- New authenticated API endpoint `/api/me/stats` returning a user's total miles, rank, and total participant count, queried by `user_id`.
- Personal stats refresh automatically after sign-in and after a successful mile submission.

### Changed

- Leaderboard now aggregates by `user_id` instead of free-text name, eliminating same-name collisions, and increased from top 6 to top 10.
- Dashboard layout reordered: "Support Our Challenge" moved from the main grid to the summary area; "Log Your Miles" moved from the summary area to the main grid (above Activity Feed).
- "Live Feed" renamed to "Activity Feed" and the live pulse indicator removed, reflecting that entries are cached rather than real-time.
- NHS trust label removed from Recent Submissions Gallery cards.

## [0.5.0] - 2026-06-13

### Added

- Privacy Policy modal with GDPR-compliant content covering data collection, usage, user rights, and retention.
- Terms of Service modal covering accounts, conduct, intellectual property, donations, and liability.
- Footer links wired to open the Privacy Policy and Terms of Service modals on click.
- Contact footer link opening a mailto: compose window.
- Escape key handler to close both modals via keyboard.
- CONTRIBUTING.md with code standards, file organization, and quality guidelines.

### Changed

- Added `docs/` directory to `.gitignore` for internal documentation.

### Fixed

- Removed "need to convert miles?" text from the dashboard.

## [0.4.0] - 2026-05-28

### Added

- New logo for the challenge
- JustGiving donation links added in the main grid and footer
- Miles calculator quick access link added
- Countdown timer updated to show days remaining until June 1st, 2027
- Prominent "Support Our Challenge" donation section placed above Live Feed in main grid

### Changed

- Rebranded from "NHS Million Miles Challenge" to "One Million Miles Challenge".
- Removed NHS Trust field from the miles submission form.
- Removed "By NHS Trust" rankings section from the main grid.
- Removed trust affiliation display from leaderboard and live feed entries.
- Updated footer copyright to "© 2026 One Million Miles Challenge".
- Added clickable JustGiving donation link in footer with external link handling.
- Changed participant subtitle from "NHS staff" to "challengers".

### Fixed

- Fixed countdown calculation to target June 1st, 2027 instead of June 1st, 2026.

## [0.3.0] - 2026-05-05

### Added

- Added a `user_profiles` flow so authenticated participants save a first and last name before submitting miles.
- Added an authenticated profile API for reading and updating saved participant names.
- Added a public `.env.example` for the required Supabase environment variables.
- Added updated project imagery and an `app/icon.jpg` app icon for the Evelina London branding.

### Changed

- Rebranded the public-facing app copy and metadata around The One Million Miles Challenge in support of Evelina London.
- Updated signed-in submissions to use the saved profile name consistently instead of an editable free-text name field.
- Refreshed the README and repository metadata for public sharing.
- Replaced the old favicon asset with the new app icon image.

### Fixed

- Fixed hydration mismatch issues around the first-render auth state.
- Fixed Next.js image warnings for the Evelina logo usage.

## [0.2.0] - 2026-04-11

### Added

- Google OAuth sign-in and callback handling backed by Supabase SSR session helpers.
- Optional authenticated screenshot proof uploads with private storage and a signed-in proof gallery.
- A curated project changelog to track notable releases and unreleased work.

### Changed

- Refactored the homepage into smaller `app/_components`, `app/_hooks`, and `app/_lib` modules without changing the intended user flow.
- Switched client and server Supabase access to `@supabase/ssr` with proxy-based session refresh.
- Expanded the setup documentation for Supabase schema, Google OAuth, and proof uploads.

### Fixed

- Proof-backed submissions now inherit the authenticated user identity instead of trusting a typed display name.
- Invalid proof reselection now clears the previously chosen file instead of leaving a stale upload queued.

## [0.1.0] - 2026-04-11

### Added

- Initial NHS Million Miles challenge dashboard and leaderboard.
- Public miles submission flow backed by Supabase.
- Aggregate stats, trust rankings, and recent activity feed for challenge progress tracking.

[Unreleased]: https://github.com/KaiFS/1millionmiles/compare/v0.8.0...HEAD
[0.8.0]: https://github.com/KaiFS/1millionmiles/compare/v0.7.0...v0.8.0
[0.4.0]: https://github.com/KaiFS/1millionmiles/releases/tag/v0.4.0
[0.3.0]: https://github.com/KaiFS/1millionmiles/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/KaiFS/1millionmiles/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/KaiFS/1millionmiles/releases/tag/v0.1.0
