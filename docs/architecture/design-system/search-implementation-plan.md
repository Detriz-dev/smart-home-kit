https://smart-home-kit.detriz.com/# Search implementation plan (Algolia DocSearch)

Issue: #77. Plan for adding search to the docs site (`kit/apps/docs-site`) with Algolia DocSearch, following the Docusaurus guide: https://docusaurus.io/docs/search

## Current state

- The docs site uses `@docusaurus/preset-classic` 3.10.2, which already includes Algolia search (`@docusaurus/theme-search-algolia`). **Nothing new needs to be installed.** We only add an `algolia` block to `themeConfig`.
- The site is live on Vercel at https://smart-home-kit.detriz.com. DocSearch crawls this **live production site**, and Algolia asks for that URL when you apply.

## How it works

1. Algolia's crawler visits the live site about once a week and saves every page's text in an **index** (a search database Algolia hosts).
2. The search box in the navbar sends what the user types straight to Algolia, which returns results. Our build and Vercel aren't involved.
3. To do this, the site needs three values: `appId`, `apiKey` and `indexName`. The `apiKey` is a public key that can only search, so it's safe to commit.

## Steps

### Phase 0: before applying (repo)

1. ✅ Set `url` in `docusaurus.config.ts` to `https://smart-home-kit.detriz.com` and fix the GitHub Pages comment.
2. Check that https://smart-home-kit.detriz.com/sitemap.xml lists the real domain. The classic preset generates it, and the crawler uses it to find pages. Before step 1 is deployed, it still lists `https://example.com/...` URLs, so deploy step 1 to production before applying.

### Phase 1: apply (outside the repo)

3. Check the eligibility list at https://docsearch.algolia.com/docs/who-can-apply, then apply at https://docsearch.algolia.com/apply. It's free for public technical docs.
4. Once approved, Algolia sends the `appId`, the search `apiKey` and the `indexName` by email. Algolia sets up the crawler with its official **Docusaurus v3 template** (https://docsearch.algolia.com/docs/templates/#docusaurus-v3-template). Keep that template: the Docusaurus docs strongly recommend it.

### Phase 2: wire it up (repo)

5. Add the config to `themeConfig` in `docusaurus.config.ts`:

   ```ts
   algolia: {
     appId: "…",
     apiKey: "…", // public search-only key, safe to commit
     indexName: "…",
     contextualSearch: true, // default; we have one language and no versions, so it changes nothing
     searchPagePath: "search", // full-page results at /search
   },
   ```

6. Choose where the search box sits in the navbar. Adding `{ type: "search", position: "right" }` to `navbar.items` lets us place it, for example before the GitHub icon. Check it on mobile widths too.

### Phase 3: style it with the kit's tokens

7. In `src/css/custom.css`, map the `--docsearch-*` variables to `--shk-` tokens: primary colour, text, muted text, modal background, highlighted result and so on. Do it for light and dark (`[data-theme='dark'] .DocSearch`). This replaces the `--ifm-` mapping the Docusaurus docs show.
8. Check the cascade layers. `future.v4` puts Docusaurus's CSS in layers, so our overrides must still win. If any override doesn't apply, that's the first place to look.

### Phase 4: check it

9. Run `pnpm turbo run build --filter=docs-site...` and `pnpm --filter docs-site typecheck`.
10. On a Vercel preview, open search with Cmd/Ctrl+K and search for Glossary terms ("Reading", "Connection Status", "Hub"), component names and a heading inside a page. Check keyboard use and both colour modes.
11. Preview links search the **production** index, so results open production pages. Search only reflects new pages after the next crawl. After a big change, start a crawl manually from the Algolia dashboard (https://crawler.algolia.com).

### Phase 5: document it

12. Add a short "Search" section to `CLAUDE.md` under Docs site. It should say where the keys live, where the crawler is managed and how to start a new crawl. Add it to `documentation-implementation-plan.md` if that file tracks site features.

## Optional, later

- **Ask AI** (DocSearch v4): add `askAi: "<assistantId>"`. Algolia doesn't charge for it, but you need your own LLM provider and pay for that. It fits the kit's AI angle, but leave it out of the first version.
- **If Algolia turns us down** (for example, while the packages aren't on npm yet): use a local search plugin such as `@easyops-cn/docusaurus-search-local`. It builds the index during the site build and needs no external account.

## Open questions

1. ✅ Production domain: https://smart-home-kit.detriz.com (live on Vercel).
2. Do we want Ask AI in the first version, or later?
