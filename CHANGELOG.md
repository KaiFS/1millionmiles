# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-05-28

### Added
- New logo for the challenge
- JustGiving donation links added in the main grid and footer
- Miles calculator quick access link added
- Countdown timer updated to show days remaining until June 1st, 2027.

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

[Unreleased]: https://github.com/KaiFS/1millionmiles/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/KaiFS/1millionmiles/releases/tag/v0.4.0
[0.3.0]: https://github.com/KaiFS/1millionmiles/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/KaiFS/1millionmiles/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/KaiFS/1millionmiles/releases/tag/v0.1.0
