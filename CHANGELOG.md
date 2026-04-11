# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/KaiFS/1millionmiles/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/KaiFS/1millionmiles/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/KaiFS/1millionmiles/releases/tag/v0.1.0
