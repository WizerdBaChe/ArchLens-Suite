# `@archlens/schema`

ArchLens 系列共用的 **JSON 交換信封** 單一事實來源。對應系列層 [`AGENTS.md`](../../AGENTS.md) 的 **Layer B（資料可組合）**。

## 信封格式

```json
{ "archlens": "1.0", "kind": "tree|graph|diff|docsgap", "source": { ... }, "payload": { ... } }
```

核心原子是 **`tree`**：

```json
{
  "archlens": "1.0",
  "kind": "tree",
  "source": { "product": "web", "name": "MyProject", "generatedAt": "2026-06-24T00:00:00.000Z" },
  "payload": { "nodes": [{ "path": "src/app.ts", "type": "file" }] }
}
```

目標：一個產品的輸出可直接當另一個的輸入。例：**web 匯出 `tree` → diff 匯入** 直接可用。

## 檔案

| 檔案 | 用途 |
|---|---|
| `archlens-schema.ts` | 型別 + helper（`wrapTree` / `isTreeEnvelope` …）。**權威來源。** |
| `tree.schema.json` | `kind: "tree"` 的 JSON Schema，供 CI / 外部驗證。 |

## 落地方式（初期：vendor，低摩擦）

各產品先 **複製（vendor）** 一份 `archlens-schema.ts` 到自己的 `src/` 下，並在檔頭標註來源。
要改格式時：**先改這份來源 → 再同步各產品的副本**。

目前的 vendor 副本：

- `ArchLens-Web/src/services/archlensSchema.ts`
- `ArchLens-DiffTeller/src/schema/archlensSchema.ts`

之後可正式套件化為 npm / GitHub Packages 的 `@archlens/schema`，屆時各產品改成版本依賴、移除 vendor 副本即可。

## 邊界

- `tree` 的節點型別沿用 DiffTeller 既有契約 `"file" | "dir"`。
- 新增 `kind`（graph / diff / docsgap）時，在 `archlens-schema.ts` 補型別、必要時加對應 `*.schema.json`，不改既有 `tree` 契約。
