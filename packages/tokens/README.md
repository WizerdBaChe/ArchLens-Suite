# `@archlens/tokens`

ArchLens 系列共用設計 token。對應系列層 [`AGENTS.md`](../../AGENTS.md) 的 **Layer A（設計系統）**、計畫的 **Phase 4**。

## 核心原則：共用結構，不強制顏色

四個產品外觀各異是**刻意的**（各有招牌風格）。所以本套件：

- **結構 token（共用值）** — 間距 / 圓角 / 字級 / 字重 / 行高 / 字體 / 動態。全系列同一套,版面節奏一致 → 系統感。
- **顏色語意角色（只定義名稱）** — `--al-surface` / `--al-text` / `--al-accent` / 狀態色…。實際色票由**主題包**提供,各產品保留招牌、亦可讓使用者切換。

所有變數命名空間為 `--al-*`,不會撞到各產品既有變數（`--paper`、`--color-bg`、`--ink`…）。

## 用法

```html
<link rel="stylesheet" href="./tokens.css" />
<body class="al-theme-blueprint">  <!-- 掛主題包 class；切換＝換 class -->
```

```css
.panel {
  background: var(--al-surface);
  color: var(--al-text);
  padding: var(--al-space-4);
  border: 1px solid var(--al-border);
  border-radius: var(--al-radius-md);
  font-family: var(--al-font-body);
}
```

CSS custom properties 會**穿透 Shadow DOM**,所以掛在 `:root` / `<body>` 的 `--al-*` 子元件（含 web component）也讀得到。

## 主題包

| class | 對應 | 風格 |
|---|---|---|
| （`:root` 預設） | — | 中性深色（藍黑） |
| `.al-theme-light` | ArchLens Web | 淺色 |
| `.al-theme-blueprint` | ArchLens Diff | 藍圖 |
| `.al-theme-hacker` | Web Hacker 模式 / SuiteNav 品牌 | 駭客綠 |

新增主題包：複製一個 class、覆寫顏色角色即可（結構 token 不要動）。

### 系列慣例（重要）

- **預設主題＝`.al-theme-light`**，四個產品（含未來新產品）一律以 Light 為預設。
- **主題選擇不持久化**：切換器只在當次 session 生效，**不寫 localStorage**；每次重新載入都重置回 Light。這是刻意的隱私選擇（不在使用者裝置留存任何偏好），與系列「隱私優先、無後端、不留存」一致。
- 因此各產品 `index.html` 直接在 `<html>` 掛 `class="al-theme-light"`（靜態、無腳本、無讀取），避免閃爍也不需儲存。

## 漸進採用（非破壞）

產品不必一次全換。建議順序：

1. 引入 `tokens.css`,在根元素掛一個主題包 class。
2. **把既有變數別名到角色**（最省事,零視覺變動）：
   ```css
   :root { --al-surface: var(--paper-raised); --al-text: var(--line); }
   ```
   或反向讓既有元件改讀 `--al-*`。
3. 新元件直接用 `--al-*`。

落地參考：本 hub 的 `portal/index.html` 已採用本套件（預設深色主題）。

## 落地狀態

- ✅ hub `portal/`（採用 `--al-*` + 預設主題）
- ⏳ 四個產品：待逐步採用（**會改外觀/互動,屬 UX 變更,採用前各自確認方向**）

> 之後可正式套件化為 `@archlens/tokens`；初期沿用 vendor 策略（與 `@archlens/schema`、`suite-nav` 一致）。
