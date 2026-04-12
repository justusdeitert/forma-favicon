# Copilot Instructions for forma-favicon

## Style

- Do not use em dashes (`—`, `U+2014`). Rephrase instead.

## Overview

- WordPress plugin that generates and manages favicons from one source image.
- Admin UI is React + TypeScript via `@wordpress/element`.
- Backend logic is PHP with WordPress hooks, REST API endpoints, and GD based image processing.

## Tech Stack

- **Backend:** PHP 7.4+, WordPress 6.2+
- **Frontend:** TypeScript, React via `@wordpress/element`, SCSS, UnoCSS
- **Build:** `@wordpress/scripts` with custom webpack config
- **Package manager:** npm

## Project Structure

- `forma-favicon.php`: Main plugin bootstrap and metadata
- `inc/`: PHP modules (`admin`, `frontend`, `rest-api`, `settings`, `conflicts`, `helpers`, `migration`, `ico-generator`)
- `src/`: TypeScript and React admin app source
- `build/`: Compiled assets for production plugin runtime
- `readme.txt`: WordPress.org plugin directory metadata and changelog

## Development

- `npm install`: Install dependencies and update lockfile
- `npm run dev`: Start watch build
- `npm run build`: Production build
- `npm run typecheck`: TypeScript checks

## WordPress.org Deployment

- Deployment to WordPress.org runs through GitHub Actions workflow at `.github/workflows/deploy-wordpress-org.yml`.
- Release tags use format `vX.Y.Z` and trigger deployment.
- Keep plugin versions aligned in:
  - `forma-favicon.php` (`Version` and `FORMA_FAVICON_VERSION`)
  - `readme.txt` (`Stable tag` and changelog section)
