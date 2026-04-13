---
description: "Use when creating a plugin release tag and deploying to WordPress.org via GitHub Actions."
---

# Release Flow

## 1. Choose version

- Use patch (`1.0.1 -> 1.0.2`) for fixes and small improvements
- Use minor (`1.0.2 -> 1.1.0`) for notable new features

## 2. Update versioned files

All four locations must use the same version string:

- `Version` header in `forma-favicon.php`
- `FORMA_FAVICON_VERSION` constant in `forma-favicon.php`
- `Stable tag` in `readme.txt`
- `version` in `package.json`

Also add a changelog section for the new version in `readme.txt`.

## 3. Sync lock file

- Run `npm install --package-lock-only` to update `package-lock.json`
- If dependencies changed, run `npm install` instead and commit the updated lock file
- Ensure CI install step will pass (`npm ci`)

## 4. Build and verify

- Run `npm run build`
- Run `npm run typecheck`

## 5. Create release commit

- Stage: versioned files, `package-lock.json`, and any other changed files for the release
- Commit message format: `chore: release v<version>`
- Optional body bullets should start with capital letters

## 6. Tag and push

- Create tag: `git tag -a v<version> -m "Release v<version>"`
- Push commit and tag: `git push origin main && git push origin v<version>`

## 7. Deploy and validate

- Tag push triggers `.github/workflows/deploy-wordpress-org.yml`
- The workflow runs `npm ci && npm run build`, then deploys via SVN
- `.distignore` controls which files are excluded from the WordPress.org package
- Confirm workflow success in GitHub Actions
- Verify listing page and version on WordPress.org:
  - `https://wordpress.org/plugins/forma-favicon/`
