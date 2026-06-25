# ArchLens Suite

**ArchLens 系列的中樞 — 四個瀏覽器端、無後端的工具，組成一條連續的專案維護工作流。**  
**The hub for ArchLens — four browser-based, backend-free tools forming one continuous project-maintenance workflow.**

> **understand → analyze → compare → verify**（理解 → 分析 → 比較 → 驗證）

---

**語言 / Language:** 繁體中文 | [English](#english-version)

---

## 繁體中文

### 這是什麼

ArchLens 不是四個孤立工具，而是**同一個連續任務被拆開**。每個產品是獨立的 repo；本 repo 是讓它們維持成一個「系列」而非四個孤島的共用上層。

任務目的（mission）：**減少工程師維護專案的困難，並排除與 AI 協作時的障礙。**

| 階段 | 產品 | 負責解決的痛點 | 輸出 |
|---|---|---|---|
| understand | [ArchLens Web](https://github.com/WizerdBaChe/ArchLens-Web) | 結構總覽、AI context 匯出 | `tree` |
| analyze | [ArchLens Dependency](https://github.com/WizerdBaChe/ArchLens-DependencyTeller) | 耦合、循環依賴、跨層呼叫、多跳影響 | `graph` |
| compare | [ArchLens Diff](https://github.com/WizerdBaChe/ArchLens-DiffTeller) | 結構差異（增 / 刪 / 移動 / 改名） | `diff` |
| verify | [ArchLens DocsGap](https://github.com/WizerdBaChe/ArchLens-DocsGapTeller) | 文件漂移、死連結、過時指令、未覆蓋資料夾 | `docsgap` |

---

### 這個 repo 裝了什麼

```
suite-manifest.json      ← 單一事實來源：產品、階段、痛點對照表
portal/index.html        ← 入口站（執行時讀取 manifest 渲染）
index.html               ← 轉址到 portal/
packages/
  schema/                 · @archlens/schema — 有版本的資料信封 + tree schema
  tokens/                 · @archlens/tokens — 共用設計 token + 主題包
  ui/                     · <suite-nav> — 反孤島的跨產品導覽列
docs/
  design-first-playbook.md
  new-product-starter/    · 把新產品接進系列的範本
AGENTS.md                ← 系列層 AI 協作指引（請先讀這份）
```

---

### 共用契約

- **資料信封**（`packages/schema`）— 每個產品的 JSON 匯出都包進同一個有版本的信封，讓一個產品的輸出可直接當另一個的輸入：
  ```json
  { "archlens": "1.0", "kind": "tree|graph|diff|docsgap", "source": { … }, "payload": { … } }
  ```
  核心原子是 `tree`，由 Web 產生、其他三個消費。
- **設計 token**（`packages/tokens`）— 共用「結構」（間距、圓角、字級、字體）＋ 可切換的「主題包」。系列預設為 **Blueprint（藍圖）**（`al-theme-blueprint`），詳見該套件 README。
- **跨產品導覽**（`packages/ui/suite-nav.js`）— 每個產品 vendored 的 `<suite-nav>` web component，由 manifest 驅動，把工作流各階段串起來。

---

### 在本機跑 portal

portal 在執行時 fetch `../suite-manifest.json`，所以必須以 http(s) 提供（`file://` 下瀏覽器會擋）：

```
npx serve .      # 然後開 /portal/
```

---

### 新增產品

1. 把新 repo 移入 `ArchLens_Series/`。
2. 在 `suite-manifest.json` 加一筆（`products` + `painPointIndex`）。
3. 在 `.gitignore` 加上該資料夾（每個產品保有自己的 git repo）。
4. 在新 repo 根目錄放一份產品層 `AGENTS.md`（見任一現有產品，或 `docs/new-product-starter/`）。

完整的系列層指引見 [`AGENTS.md`](./AGENTS.md)。

---

## English Version

### What This Is

ArchLens is not four isolated tools — it is **one continuous task, split apart.**
Each product is a separate repo; this repo is the shared layer that keeps them a
*suite* rather than four silos.

Mission: **reduce the friction of maintaining projects and collaborating with AI.**

| Stage | Product | Solves | Produces |
|---|---|---|---|
| understand | [ArchLens Web](https://github.com/WizerdBaChe/ArchLens-Web) | structure overview, AI-context export | `tree` |
| analyze | [ArchLens Dependency](https://github.com/WizerdBaChe/ArchLens-DependencyTeller) | coupling, circular deps, cross-tier calls, multi-hop impact | `graph` |
| compare | [ArchLens Diff](https://github.com/WizerdBaChe/ArchLens-DiffTeller) | structural change (added / removed / moved / renamed) | `diff` |
| verify | [ArchLens DocsGap](https://github.com/WizerdBaChe/ArchLens-DocsGapTeller) | doc drift, dead links, stale commands, uncovered folders | `docsgap` |

---

### What Lives Here

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

---

### The Shared Contracts

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

---

### Running the Portal Locally

The portal fetches `../suite-manifest.json` at runtime, so it must be served over
http(s) (a `file://` open is blocked by the browser):

```
npx serve .      # then open /portal/
```

---

### Adding a Product

1. Move the new repo under `ArchLens_Series/`.
2. Add an entry to `suite-manifest.json` (`products` + `painPointIndex`).
3. Add the folder to `.gitignore` (each product keeps its own git repo).
4. Drop a product-level `AGENTS.md` in the new repo root (see any existing
   product, or `docs/new-product-starter/`).

See [`AGENTS.md`](./AGENTS.md) for the full suite-level guidance.
