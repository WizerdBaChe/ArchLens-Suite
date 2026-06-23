# ArchLens Series — AI 協作指引（系列層 / suite-level）

> 這份文件位於 `D:\AIWork\ArchLens_Series\`，是 **ArchLens 系列** 四個產品的共同上層。
> 在任一產品子資料夾開啟的 AI session 都會繼承這份文件 + 該產品自己的 `AGENTS.md`。
> 系列的單一事實來源是 [`suite-manifest.json`](./suite-manifest.json)；本文件與它若有出入，以 manifest 為準。

## 這是一個系列，不是四個孤立工具

開發目的（mission）：**減少工程師維護專案的困難，並排除與 AI 協作時的障礙。**

四個產品其實是「同一個連續任務被拆開」——通常的流程是
**understand → analyze → compare → verify**（順序可變、可只用其中幾個）：

| 階段 | 產品 | 目錄 | 負責解決的痛點 | 輸入 | 輸出 |
|---|---|---|---|---|---|
| understand | **ArchLens Web** | `ArchLens-Web/` | 結構總覽、AI context 匯出 | 資料夾 / zip | `tree` |
| analyze | **ArchLens Dependency** | `ArchLens-DependencyTeller/` | 耦合、循環依賴、跨層呼叫、多跳影響 | 資料夾 / zip / 貼上 | `graph` |
| compare | **ArchLens Diff** | `ArchLens-DiffTeller/` | 結構差異（增 / 刪 / 移動 / 改名） | 兩份 `tree` | `diff` |
| verify | **ArchLens DocsGap** | `ArchLens-DocsGapTeller/` | 文件漂移、死連結、過時指令、未覆蓋資料夾 | 資料夾 / zip | `docsgap` |

共同技術底盤：React 19 + TypeScript + Vite、**100% 瀏覽器端、無後端、隱私優先**、繁中/英雙語、可匯出 JSON 報告。

## 痛點 → 產品 對照表（給 AI 用來避免重複造輪子）

當使用者在討論某個產品的優化方向、而那個需求其實落在另一個產品的範疇時，**請主動指出**「這個痛點是 X 在解決的」，而不是在當前產品裡重做一遍。對照表（權威版見 manifest 的 `painPointIndex`）：

- 結構總覽 / 產生餵給 AI 的 context → **web**
- 耦合 / 循環依賴 / 前後端跨層呼叫 / 改一個檔會波及哪些檔（多跳影響）→ **dependency**
- 兩版之間「結構怎麼變了」（新增/刪除/移動/改名）→ **diff**
- 文件與程式碼對不上（死連結、過時指令、沒被寫到的資料夾）→ **docsgap**

## 邊界宣告（避免功能擴張到錯誤的產品）

- **import / 依賴關係分析屬於 dependency**。不要把它加進 diff 或 web。
- **「結構怎麼變了」屬於 diff**。dependency 看的是「目前的相依」，不是「版本間的變動」。
- **文件正確性屬於 docsgap**。其他產品不需自行檢查 README。
- **產生純粹的目錄樹 / AI context 屬於 web**。其他產品若需要樹，應**消費** web 產出的 `tree`，而非自己重寫掃描器。

## 資料可組合（Layer B）

四個產品都已輸出 JSON。系列共用一個有版本的信封格式（權威定義在 `packages/schema/`，落地中）：

```json
{ "archlens": "1.0", "kind": "tree|graph|diff|docsgap", "source": { ... }, "payload": { ... } }
```

- 核心原子是 **`tree`**。DiffTeller 已支援 `{ "nodes": [{ "path": "src/app.ts", "type": "file" }] }`，以此為 `tree` payload 基準。
- 目標：一個產品的輸出可直接當另一個的輸入（例：web 匯出 `tree` → diff 匯入）。新增 / 修改匯出入功能時，**一律走這個信封**。

## 與 AI 討論的 scope 慣例（避免失焦）

討論時請先確認粒度，並在回覆開頭標明：

- `[suite]` — 跨產品的系列層議題（manifest、共用 schema、設計系統、產品邊界、新產品歸屬）。
- `[product:<id>]` — 單一產品內部議題（如 `[product:diff]`）。`<id>` 用 manifest 的 `id`（web / dependency / diff / docsgap）。

若使用者的需求其實跨越了當前 `[product:*]` 的邊界，請升級為 `[suite]` 並指出正確歸屬，而不是在錯的產品裡硬做。

## 新增產品時要做的事（擴充性）

1. 把新 repo 移入 `ArchLens_Series/`。
2. 在 `suite-manifest.json` 的 `products` 加一筆、在 `painPointIndex` 補上它解決的痛點。
3. 在 `.gitignore` 加一行該資料夾。
4. 在新 repo 根目錄放一份產品層 `AGENTS.md`（見任一現有產品的範本）。

> 注意：本系列層文件刻意**只存在於 `ArchLens_Series/` 這一層**，不放在 `D:\AIWork\`，以免影響 AIWork 下其他無關 repo。
