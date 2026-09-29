# VaiL website — first migration preview

A portable website for Safwan Wshah's Vermont Artificial Intelligence Laboratory, built for Cloudflare Pages with Decap CMS editing. This package does not create or modify any online accounts. Live login, publishing and domain migration remain to be connected and tested.

## What is included

- Home, people, research, publications, news, datasets, courses and recruitment pages.
- Browser editing at `/admin/` with forms and image uploads.
- Your existing logo and selected images downloaded locally.
- Original content snapshots and a content-review checklist under `source-review/` (not published).
- Cloudflare Pages Functions for GitHub OAuth with a protected state cookie, fixed callback origin, repository permission check, and origin-restricted token delivery.
- No database, paid CMS plan or AI API is needed for manual editing.

## First setup (one time)

1. Create a **public** GitHub repository named `vail-website`, on branch `main`. Upload the contents of this folder, including `functions`, `content`, `public`, `scripts` and `package.json`. Do not upload `.env` or secrets. The included OAuth scope is for public repositories.
2. In Cloudflare Pages, create a project from that repository. Build command: `npm run build`. Build output directory: `dist`. Root directory: the repository root. Use Node 22 or later. No installation dependencies are required. Ensure Pages Functions are enabled; do not use dashboard drag-and-drop, which is insufficient for this login setup.
3. Cloudflare will assign a URL such as `https://YOUR-PROJECT.pages.dev`.
4. Configure `content/settings.json`: `githubRepo` is `safwanwshah1978/vail-website`; `siteUrl` is the assigned HTTPS origin without a trailing slash. Alternatively run `npm run configure -- safwanwshah1978/vail-website https://YOUR-PROJECT.pages.dev`. Commit the changes.
5. In GitHub Settings → Developer settings → OAuth Apps, register an OAuth application. Homepage URL: the assigned site origin. Authorization callback URL: that origin plus `/api/callback`.
6. Add these Cloudflare Pages environment variables for production: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (as an encrypted secret), `GITHUB_REPO` (same repository as step 4), and `SITE_ORIGIN` (same origin as step 4). Never put the client secret in GitHub files or chat. Redeploy after saving variables.
7. Visit `/admin/`, log in using a GitHub account with write permission to that repository, edit a test entry and click Publish. Confirm a repository commit, successful Cloudflare rebuild and visible public-page change. Try an image upload too. Failed rebuilds should leave the previous deployment online.
8. Review `source-review/REVIEW.md` before switching the domain. Confirm the current roster and bibliography.
9. When approved, attach `www.wshahaigroup.com` in Cloudflare Pages and follow its DNS instructions. Preserve email/MX records. If the canonical editor origin changes, update settings.json, `SITE_ORIGIN`, and the GitHub OAuth callback together. Keep the original Wix service until the new pages and login work on the domain.
10. Cancel only the Wix website subscription when migration is complete; keep the domain registered and renewing.

Authentication functions consume Cloudflare Workers/Pages Functions quota. This low-volume editor is intended for the free allowance, but verify your account settings. The GitHub OAuth public_repo grant is broader than one repository, although the CMS configuration and login permission check target this repository. GitHub authorization displays this scope for review.

## Everyday editing

Open `/admin/` → choose a section → expand an entry → edit → Publish. In Publications, enter the title, authors, year, venue and links. In People, edit roles and biographies or upload a photo. Toggle **Show on website** off to hide an entry without deleting it. Publishing commits the content and triggers a rebuild, which normally takes a short time. The public website is not a drag-and-drop layout editor.

Home & contact controls the homepage introduction, headline, contact details and recruitment message. Layout changes still need a developer. The GitHub repository keeps change history for recovery.

## Build and checks

Run `npm run build` and `npm test` using Node 22+. Serve `dist` with a local HTTP server for a public-page preview; opening HTML directly from disk will not resolve root-relative navigation/assets. OAuth requires the deployed HTTPS origin; a local static server does not run it.

The Decap browser script is pinned to version 3.8.4 from unpkg. Update deliberately and verify login/editing after upgrades.

## Automatic publication discovery — next phase

Not enabled in this package. First verify Safwan's OpenAlex author ID against his Google Scholar record. A future scheduled importer should add candidates as unpublished entries, deduplicate by DOI/title, retain manual edits, and leave acceptance/venue claims for review. Do not scrape Scholar or match by name alone. The present bibliography includes selected papers migrated from the old website plus a link to the full Scholar profile.
