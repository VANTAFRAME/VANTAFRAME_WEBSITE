import { atom } from 'nanostores';

export const STORAGE_KEY = 'vf_lang';

export function readStoredLang() {
    if (typeof window === 'undefined') return 'pl';
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored === 'pl' || stored === 'en' ? stored : 'pl';
    } catch (e) {
        return 'pl';
    }
}

function persistLang(lang) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
        // Ignore write failures (private mode, storage disabled, etc.)
    }
}

// Always starts at 'pl' to match the statically pre-rendered markup (the
// build has no knowledge of the visitor's stored preference). The stored
// language is applied post-hydration by <LangSync>, so React never sees a
// server/client mismatch on first render.
export const currentLang = atom('pl');

export function toggleLang() {
    const next = currentLang.get() === 'pl' ? 'en' : 'pl';
    currentLang.set(next);
    persistLang(next);
}

export function setLang(lang) {
    currentLang.set(lang);
    persistLang(lang);
}
