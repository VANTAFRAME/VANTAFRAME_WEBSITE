// Versioned localStorage key. Bump the version if the answers shape changes in a
// backwards-incompatible way — old saved progress will simply be ignored, not crash.
const STORAGE_KEY = "vf_framework_v1";

const isBrowser = () => typeof window !== "undefined";

export const loadFrameworkState = () => {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveFrameworkState = (state) => {
  if (!isBrowser()) return;
  try {
    // Contact details never live here by design — only project answers + wizard position.
    const { answers = {}, currentStepId = null } = state || {};
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentStepId, savedAt: Date.now() }));
  } catch {
    // Storage can fail (private mode, quota). Silently no-op — progress just won't persist.
  }
};

export const clearFrameworkState = () => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};
