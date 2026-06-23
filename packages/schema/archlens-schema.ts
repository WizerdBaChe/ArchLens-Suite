/**
 * @archlens/schema — ArchLens 系列共用交換信封（單一事實來源）
 *
 * 來源位置：D:\AIWork\ArchLens_Series\packages\schema\archlens-schema.ts
 *
 * 系列四個產品（web / dependency / diff / docsgap）的 JSON 匯出入都走這個有版本的
 * 信封格式，讓上游的輸出可以直接當下游的輸入（例：web 匯出 tree → diff 匯入）。
 *
 * 落地方式（初期，低摩擦）：各產品「vendor」一份此檔到自己的 src 下，並在檔頭標註
 * 它是從這裡複製來的。要改格式時，先改這份來源、再同步各產品的副本。之後可正式
 * 套件化為 npm / GitHub Packages 的 `@archlens/schema`，屆時各產品改成版本依賴即可。
 *
 * 對應系列層 AGENTS.md 的 Layer B（資料可組合）。
 */

/** 信封格式版本。payload 內容變動但相容 → 不升版；不相容 → 升版。 */
export const ARCHLENS_ENVELOPE_VERSION = "1.0";

/** 系列目前的四種資料原子。核心原子是 `tree`，其餘 kind 逐步擴充。 */
export type ArchlensKind = "tree" | "graph" | "diff" | "docsgap";

/** 樹節點型別。沿用 DiffTeller 既有契約（"file" | "dir"）。 */
export type TreeNodeType = "file" | "dir";

/**
 * 樹的單一節點。`path` 為 forward-slash、相對根目錄、無前導/尾隨斜線。
 * 這就是系列共用的「樹」原子，DiffTeller 早已支援 `{ nodes: [{ path, type }] }`。
 */
export interface TreeNode {
  path: string;
  type: TreeNodeType;
  /** 選填：檔案內容指紋（hash），供下游做「改名/移動」或「內容是否變動」判斷。 */
  contentHash?: string;
}

/** `kind: "tree"` 的 payload。 */
export interface TreePayload {
  /** 選填：根目錄名稱（顯示用，不影響各 node 的相對 path）。 */
  root?: string;
  nodes: TreeNode[];
}

/** 來源中繼資料（誰、何時、什麼專案產生的）。全為選填，不影響解析。 */
export interface ArchlensSource {
  /** 產生此檔的產品 id，如 "web"。 */
  product?: string;
  /** ISO 8601 產生時間。 */
  generatedAt?: string;
  /** 來源專案 / 根目錄名稱。 */
  name?: string;
  [key: string]: unknown;
}

/** 系列共用的有版本信封。 */
export interface ArchlensEnvelope<K extends ArchlensKind = ArchlensKind, P = unknown> {
  /** 信封版本，目前固定 "1.0"。 */
  archlens: string;
  kind: K;
  source?: ArchlensSource;
  payload: P;
}

/** `kind: "tree"` 的具體信封型別。 */
export type TreeEnvelope = ArchlensEnvelope<"tree", TreePayload>;

/** 把一組 tree 節點包進系列共用信封。 */
export function wrapTree(
  nodes: TreeNode[],
  source?: ArchlensSource,
  root?: string,
): TreeEnvelope {
  return {
    archlens: ARCHLENS_ENVELOPE_VERSION,
    kind: "tree",
    ...(source ? { source } : {}),
    payload: root ? { root, nodes } : { nodes },
  };
}

/** 是否為一個 ArchLens 信封（不檢查 kind/payload 細節）。 */
export function isArchlensEnvelope(value: unknown): value is ArchlensEnvelope {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.archlens === "string" && typeof v.kind === "string" && "payload" in v;
}

/** 是否為 `kind: "tree"` 的信封，且 payload 帶 nodes 陣列。 */
export function isTreeEnvelope(value: unknown): value is TreeEnvelope {
  if (!isArchlensEnvelope(value) || value.kind !== "tree") return false;
  const payload = (value as TreeEnvelope).payload as Partial<TreePayload> | undefined;
  return !!payload && Array.isArray(payload.nodes);
}
