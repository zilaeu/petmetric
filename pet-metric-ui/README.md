# PetMetric UI

Nuxt 4 site for PetMetric, deployed to Cloudflare Pages. The visual system follows the Figma export in `../figma-export-code`, while the content model follows `../docs`.

## Local development

```bash
pnpm install
pnpm run db:migrate:local
pnpm run dev:wrangler
```

Open `http://localhost:3000`. `nitro-cloudflare-dev` exposes the Cloudflare runtime bindings during Nuxt development. If the content API is unavailable, the UI shows explicit unavailable states instead of presenting empty fallback values as real research totals.

## Cloudflare bindings

- D1 `DB`: categories, products, research items, and correction requests.
- R2 `BUCKET`: research media, served through `/api/media/:key`.
- `ADMIN_TOKEN`: secret used by the media upload endpoint.

See [`CLOUDFLARE_DEPLOYMENT.md`](./CLOUDFLARE_DEPLOYMENT.md) for the full setup and deploy checklist.
