# ArchLens 設計優先手冊 — 把「事後整併」變成「事前思維」

> 這份文件把 ArchLens 系列從「四個孤立產品」**事後**整併成一套系統（Phase 0–4）的經驗，
> 倒過來寫成「下一個產品**從第一天就該有**的思維」。核心一句話：
>
> **契約先行（contract-first），產品後生。** 共用的東西先定義成契約，新產品「消費契約」而生，
> 而不是各自長好再回頭對齊。

---

## 0. 我們踩過的坑（為什麼要事前做）

整併時最貴的成本，全部來自「先做完才對齊」：

| 事後整併的痛 | 根因 | 事前就能避免 |
|---|---|---|
| 每個產品的色彩變數命名都不同（`--paper` / `--color-bg` / `--ink`） | 各自發明 token | 一開始就用共用 `--al-*` 角色名 |
| 改一次設計要同步 4 份 vendored 副本 | 沒有單一事實來源 | 先把 token/schema/nav 設成共用套件 |
| 匯出 JSON 格式四種，彼此不能互吃 | 沒有資料契約 | 一開始就用 `{archlens,kind,source,payload}` 信封 |
| 主題要逐產品重調色、補 light 變體 | 顏色寫死在元件裡 | 一開始就「結構共用、顏色走主題包」 |
| 搬移後 workspace symlink 全斷、Pages 不部署 | 環境/部署沒先想 | 部署管線與路徑假設先寫進範本 |
| 導覽列遮罩、深色列疊在淺色頁上很醜 | 共用元件沒考慮宿主主題 | 共用元件一開始就吃 `--al-*`、自我隔離 |

**結論**：這些都不是「bug」，是「順序錯了」。把契約提前，產品天生就對齊。

---

## 1. 四條「先定義」的契約

新系列 / 新產品開工前，先把這四件事定成**共用套件**（放 `packages/`，產品 vendor 或依賴）：

### 1.1 設計 token 契約（`@archlens/tokens`）
- **共用「結構」，不強制「顏色」**：間距 / 圓角 / 字級 / 字重 / 行高 / 字體 → 全系列同一套值；
  顏色只定義**語意角色名**（`--al-bg` / `--al-surface` / `--al-text` / `--al-accent` / 狀態色…）。
- 顏色值由**可切換主題包**（`.al-theme-*` class）提供，各產品挑招牌包、也能切換。
- 命名空間 `--al-*`，不撞產品既有變數。
- 細節見 [`packages/tokens/README.md`](../packages/tokens/README.md)。

### 1.2 資料交換契約（`@archlens/schema`）
- 所有匯出入走有版本的信封：`{ "archlens": "1.0", "kind": "...", "source": {...}, "payload": {...} }`。
- 一個產品的輸出能直接當另一個的輸入。新增匯出功能**一律走信封**。
- 細節見 [`packages/schema/README.md`](../packages/schema/README.md)。

### 1.3 反孤島導覽契約（`@archlens/ui` 的 `<suite-nav>`）
- 框架無關 Web Component，吃 `manifest-url` 讀系列單一事實來源。
- 共用元件**自己吃 `--al-*` + 自我隔離（Shadow DOM）+ 疊在宿主裝飾層之上（z-index）**，
  才不會在別人的頁面上「水土不服」。

### 1.4 能力註冊契約（`suite-manifest.json`）
- 機器可讀的產品註冊表（id / stage / solves / consumes / produces / url）。
- **新增產品＝加一筆**。portal、SuiteNav、AI 指引都讀它。

---

## 2. 一條鐵則：結構共用，顏色走主題包

這是整套設計系統的心臟，務必第一天就照做。

```css
/* 產品的「在地變數」別名到共用角色——零視覺成本就接上系統 */
:root {
  --surface: var(--al-surface);
  --text:    var(--al-text);
  --border:  var(--al-border);
  /* 字體 / 圓角 / 產品專屬語意色（如 diff 的 added/removed）留在地 */
}
/* 產品專屬語意色，各主題覆寫，維持可讀性 */
.al-theme-light  { --added: #128a6e; }
.al-theme-hacker { --added: #39ff6a; }
```

- 元件 CSS 一律用 `var(--al-*)` 或別名變數，**不要寫死 hex**。
- 切主題＝換掛在 `<html>` 的 `.al-theme-*` class，所有顏色一起換。
- 產品自帶的字體 / 招牌圓角 / 領域語意色，留在地 + 各主題覆寫即可。

---

## 3. 系列慣例（一旦定了，全產品照辦）

- **預設主題 = `.al-theme-light`**，四產品（含未來）統一。
- **主題選擇不持久化**：每次載入重置回 Light，不寫 `localStorage`（隱私優先，與「無後端、不留存」一致）。
- `index.html` 直接 `<html class="al-theme-light">`（靜態、無腳本、無讀取，避免閃爍）。
- 100% 瀏覽器端、無後端、隱私優先、繁中/英雙語、可匯出 JSON 報告。

---

## 4. 新產品第一天檢查清單（Day-1 Checklist）

開一個新 ArchLens 產品時，**照順序**做：

1. [ ] 在 `suite-manifest.json` 的 `products` 加一筆（id / stage / solves / consumes / produces / url）。
2. [ ] 在 `painPointIndex` 補上它解決的痛點。
3. [ ] repo 根放產品層 `AGENTS.md`（宣告負責什麼、不負責什麼指向誰）。
4. [ ] 引入 `@archlens/tokens`：`<html class="al-theme-light">` + 引 `tokens.css`。
5. [ ] 新元件一律用 `var(--al-*)`；產品專屬色別名 + 各主題覆寫。
6. [ ] 掛 `<suite-nav current="<id>" manifest-url="...">`。
7. [ ] 加主題切換器（預設 Light、不持久化）。見 [`new-product-starter/`](./new-product-starter/)。
8. [ ] 匯出入一律走 `@archlens/schema` 信封。
9. [ ] 部署：靜態 Pages via Actions（見範本 `.github/workflows/deploy-pages.yml`）。
10. [ ] `.gitignore` / workspace 設定沿用系列範本，避免搬移斷連。

做完這 10 步，新產品「天生」就是系列的一員——不需要任何事後整併。

---

## 5. vendor vs 套件化（落地策略）

- **初期 vendor（複製副本）**：摩擦最低，適合契約還在演化時。**規矩**：改正本 → 同步所有副本（見各 README 的副本清單）。
- **穩定後套件化**：發到 npm / GitHub Packages，產品改成版本依賴、移除副本。
- 兩階段都可以，但**務必把「單一事實來源在哪」「副本清單」寫進 README**，否則會像我們一樣改一次同步四份。

---

## 6. 模板檔在哪

- 真實使用中的設計系統檔（拿來當模板）見下表，可直接複製：

| 你要的東西 | 真實檔案（使用中） |
|---|---|
| 主題 token + 三個主題包 | [`packages/tokens/tokens.css`](../packages/tokens/tokens.css) |
| 反孤島導覽列 | [`packages/ui/suite-nav.js`](../packages/ui/suite-nav.js) |
| 資料交換信封 | [`packages/schema/archlens-schema.ts`](../packages/schema/archlens-schema.ts) |
| 入口站（讀 manifest 渲染） | [`portal/index.html`](../portal/index.html) |
| 部署 workflow | [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml) |
| **新產品起手式模板** | [`docs/new-product-starter/`](./new-product-starter/) |

> 一句話總結：**先把「共用的」定義成契約，產品消費契約而生。** 這就是把「做完才修」變成「一開始就對」。

---

## 7. 這份方法論也是一個全域 skill

本手冊的可遷移部分已濃縮成一個 **條件觸發** 的全域 skill：`design-system-suite`
（`~/.claude/skills/design-system-suite/SKILL.md`）。它只在「**新增產品到既有套件**」或
「**把多個前端整併成共用設計系統 / 資料契約 / 反孤島導覽**」時才被叫用，且該 skill 反過來
**reference 本 repo 的這份手冊與 `new-product-starter/` 作為維護中的範本**。一般單一 app /
改 bug / 後端工作不會觸發它。
