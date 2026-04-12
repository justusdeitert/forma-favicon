---
description: "Use when creating a plugin release tag and deploying to WordPress.org via GitHub Actions."
---

# Release Flow

## 1. Choose version

- Use patch (`1.0.0 -> 1.0.1`) for fixes and small improvements
- Use minor (`1.0.1 -> 1.1.0`) for notable new features

## 2. Update versioned files

- Update `Version` in `forma-favicon.php`
- Update `FORMA_FAVICON_VERSION` in `forma-favicon.php`
- Update `Stable tag` in `readme.txt`
- Add changelog section for the new version in `readme.txt`

## 3. Sync dependencies when needed

- If dependencies changed, run `npm install` and commit updated `package-lock.json`
- Ensure CI install step will pass (`npm ci`)

## 4. Build and verify

- Run `npm run build`
- Run `npm run typecheck`

## 5. Create release commit

- Commit relevant release files
- Commit message format: `chore: release v<version>`
- Optional body bullets should start with capital letters

## 6. Tag and push

- Create tag: `git tag -a v<version> -m "Release v<version>"`
- Push commit and tag: `git push origin main && git push origin v<version>`

## 7. Deploy and validate

- Tag push triggers `.github/workflows/deploy-wordpress-org.yml`
- Confirm workflow success in GitHub Actions
- Verify listing page and version on WordPress.org:
  - `https://wordpress.org/plugins/forma-favicon/`
