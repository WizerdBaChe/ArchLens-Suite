# `@archlens/ui`

ArchLens 系列共用 UI 元件。對應系列層 [`AGENTS.md`](../../AGENTS.md) 的 **Layer A（設計系統）** 與 Phase 3（反孤島導覽）。

## `suite-nav.js` — `<suite-nav>`

框架無關的 Web Component（Shadow DOM 樣式隔離），是系列的**反孤島導覽列**：顯示四個產品的切換器、標出目前產品、並依 workflow stage 給「下一步」建議。因為是標準 Custom Element，React 與 vanilla 產品都能用同一份。

### 用法

各產品 vendor 一份到自己的 `public/`（Vite 會放到網站根目錄），在 `index.html` 掛載：

```html
<script type="module" src="./suite-nav.js"></script>
<suite-nav current="web"></suite-nav>
```

屬性：

| 屬性 | 必填 | 說明 |
|---|---|---|
| `current` | ✅ | 目前產品 id：`web` / `dependency` / `diff` / `docsgap`。用來標示 active tab 與算「下一步」。 |
| `manifest-url` | — | 指向 `suite-manifest.json`。提供時覆寫內建 registry，讓導覽跟著系列單一事實來源走（hub 發佈後可用 raw/CDN URL）。 |

內建 registry 是 fallback，讓產品即使 hub 尚未發佈也能單獨運作。

### 落地方式（vendor，與 `@archlens/schema` 一致）

正本在此資料夾。各產品的副本：

- `ArchLens-Web/public/suite-nav.js`
- `ArchLens-DependencyTeller/packages/web/public/suite-nav.js`
- `ArchLens-DiffTeller/public/suite-nav.js`
- `ArchLens-DocsGapTeller/web/public/suite-nav.js`

要改導覽列：先改這份正本 → 再同步各副本。新增產品：更新正本的 registry（或改用 `manifest-url`）。
