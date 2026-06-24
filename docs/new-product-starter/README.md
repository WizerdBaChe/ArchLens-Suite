# `new-product-starter` — 新產品起手式模板

把這個資料夾當作**新 ArchLens 產品的設計系統骨架**。它不是完整 app，而是「從第一天就接上系列設計系統」的最小可運行範本，照著抄就不用事後整併。

對應 [`../design-first-playbook.md`](../design-first-playbook.md)。

## 檔案

| 檔案 | 作用 | 你要改什麼 |
|---|---|---|
| `index.html` | 產品外殼：`<html class="al-theme-light">`、引 tokens、掛 `<suite-nav>` | 改 `current="<你的id>"`、`<title>`、內容 |
| `theme.css` | **token 採用範例**：把在地變數別名到 `--al-*` + 主題包覆寫產品專屬色 | 換成你的在地變數名與領域色 |
| `theme-switch.ts` | 主題切換器（vanilla，**預設 Light、不持久化**） | 通常不用改 |

## 三步接上系統

1. **引 tokens + 設預設主題**（`index.html`）
   ```html
   <html class="al-theme-light">
   <link rel="stylesheet" href="/path/to/@archlens/tokens/tokens.css" />
   ```
2. **在地變數別名到角色**（`theme.css`）—— 元件 CSS 照舊用在地變數，但值來自系列 token，
   切主題就一起換色。產品專屬語意色留在地、各主題覆寫。
3. **掛導覽列 + 切換器**（`index.html` / `theme-switch.ts`）
   ```html
   <suite-nav current="myproduct"
     manifest-url="https://wizerdbache.github.io/ArchLens-Suite/suite-manifest.json"></suite-nav>
   <div class="theme-switch" id="themeSwitch" role="group" aria-label="Theme"></div>
   ```

## 系列慣例（務必遵守）

- 預設 `.al-theme-light`；切換**不寫 localStorage**（每次重置回 Light，隱私優先）。
- 元件 CSS **不寫死 hex**，一律 `var(--al-*)` 或別名變數。
- 匯出入走 `@archlens/schema` 信封；在 `suite-manifest.json` 註冊一筆。

> React 產品：把 `theme-switch.ts` 的邏輯包成一個 `<ThemeSwitcher>` 元件即可（見
> `ArchLens-DiffTeller/src/components/ThemeSwitcher`）。若已有自己的主題機制（如 Web 的
> `ThemeContext`），改為**同步** `.al-theme-*` class 即可，不必重寫（輕觸整合）。
