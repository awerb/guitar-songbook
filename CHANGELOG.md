# Changelog

All notable changes to OpenFret are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [1.0.0] - 2026-05-13

Initial open-source release. Forked from the Werbach Songbook personal project, stripped of personal content, given a generic identity and an in-browser library system so non-coders can use it without editing files.

### Added
- In-browser library: add, edit, delete songs through a UI
- JSON export and import (merge or replace)
- Welcome banner and dismissible first-run experience
- Help modal with quick-start guide and chord-bracket explanation
- 10 verified public-domain sample songs across folk, blues, jazz, and rock arrangements
- Generic OpenFret SVG header and favicon
- GitHub Pages auto-deploy workflow
- Netlify and Vercel one-click deploy configs
- MIT license
- README, CONTRIBUTING, CODE_OF_CONDUCT, CHANGELOG

### Changed
- Renamed product from Werbach Songbook to OpenFret
- Renamed `window.WERBACH_SONGS` global to `window.OPENFRET_SAMPLE_SONGS`
- Song list now sources from `OpenFretLibrary.getAllSongs()` (samples + user merged)
- Removed unused Tone.js CDN dependency

### Removed
- All personal songs from the original repository
- Personal header image
- Original git remote pointing to a private repo
