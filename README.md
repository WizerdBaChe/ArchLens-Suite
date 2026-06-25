# ArchLens Suite

The hub for **ArchLens** — four browser-based, backend-free tools that form one
continuous project-maintenance workflow:

> **understand → analyze → compare → verify**

| Stage | Product | Solves | Produces |
|---|---|---|---|
| understand | [ArchLens Web](https://github.com/WizerdBaChe/ArchLens-Web) | structure overview, AI-context export | `tree` |
| analyze | [ArchLens Dependency](https://github.com/WizerdBaChe/ArchLens-DependencyTeller) | coupling, circular deps, cross-tier calls, multi-hop impact | `graph` |
| compare | [ArchLens Diff](https://github.com/WizerdBaChe/ArchLens-DiffTeller) | structural change (added / removed / moved / renamed) | `diff` |
| verify | [ArchLens DocsGap](https://github.com/WizerdBaChe/ArchLens-DocsGapTeller) | doc drift, dead links, stale commands, uncovered folders | `docsgap` |

Mission: **reduce the friction of maintaining projects and collaborating with
AI.** Each product is a separate repo; this repo is the shared layer that keeps
them a *suite* rather than four silos.

## What lives here

```
suite-manifest.json      ← single source of truth: products, stages, pain-point index
portal/index.html        ← the entry portal (renders the manifest at runtime)
index.html               ← redirect to portal/
packages/
  schema/                 · @archlens/schema — the versioned data envelope + tree schema
  tokens/                 · @archlens/tokens — shared design tokens + theme packs
  ui/                     · <suite-nav> — the anti-silo cross-product nav bar
docs/
  design-first-playbook.md
  new-product-starter/    · template for bootstrapping a new product into the suite
AGENTS.md                ← suite-level AI collaboration guide (read this first)
```

## The shared contracts

- **Data envelope** (`packages/schema`) — every product's JSON export is wrapped
  in one versioned envelope so one product's output can be another's input:
  ```json
  { "archlens": "1.0", "kind": "tree|graph|diff|docsgap", "source": { … }, "payload": { … } }
  ```
  The core atom is `tree`, produced by Web and consumed by the other three.
- **Design tokens** (`packages/tokens`) — shared *structure* (spacing, radius,
  type scale, fonts) plus switchable *theme packs*. The suite default is
  **Blueprint** (`al-theme-blueprint`); see that package's README.
- **Cross-product nav** (`packages/ui/suite-nav.js`) — a `<suite-nav>` web
  component each product vendors, driven by the manifest, that links the
  workflow stages together.

## Running the portal locally

The portal fetches `../suite-manifest.json` at runtime, so it must be served over
http(s) (a `file://` open is blocked by the browser):

```
npx serve .      # then open /portal/
```

## Adding a product

1. Move the new repo under `ArchLens_Series/`.
2. Add an entry to `suite-manifest.json` (`products` + `painPointIndex`).
3. Add the folder to `.gitignore` (each product keeps its own git repo).
4. Drop a product-level `AGENTS.md` in the new repo root (see any existing
   product, or `docs/new-product-starter/`).

See [`AGENTS.md`](./AGENTS.md) for the full suite-level guidance.
