/*
 * theme-switch.ts — 主題切換器模板（vanilla TS，框架無關）。
 *
 * 系列慣例：**預設 Light，且不持久化**——切換只在當次 session 生效，不寫 localStorage；
 * 重新載入即重置回 Light（隱私優先）。index.html 已靜態掛 al-theme-light。
 *
 * React 產品：把 apply() 的邏輯包進一個元件的 useState/onClick 即可
 * （見 ArchLens-DiffTeller/src/components/ThemeSwitcher）。
 */

const THEMES = [
  { id: "light", label: "Light" },
  { id: "blueprint", label: "Blueprint" },
  { id: "hacker", label: "Hacker" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];
const CLASSES = THEMES.map((t) => `al-theme-${t.id}`);

export function initThemeSwitch(container: HTMLElement | null): void {
  if (!container) return;

  let current: ThemeId = "light"; // 預設 Light；不讀 localStorage
  const buttons = new Map<ThemeId, HTMLButtonElement>();

  const apply = (next: ThemeId) => {
    const el = document.documentElement;
    el.classList.remove(...CLASSES);
    el.classList.add(`al-theme-${next}`);
    current = next;
    buttons.forEach((btn, id) => {
      const active = id === current;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    // 刻意不寫 localStorage —— 不在裝置留存偏好（隱私優先）。
  };

  for (const t of THEMES) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-switch__btn";
    btn.textContent = t.label;
    btn.addEventListener("click", () => apply(t.id));
    buttons.set(t.id, btn);
    container.appendChild(btn);
  }

  apply(current);
}

// 自動掛載到 #themeSwitch（若存在）
initThemeSwitch(document.getElementById("themeSwitch"));
