import { useEffect } from "react";
import { currentLang, readStoredLang } from "../i18n/store";

// Applies the visitor's stored language choice after hydration, once React
// has already reconciled against the server-rendered ('pl') markup. Doing
// this in an effect (rather than at module init) keeps first hydration in
// sync with SSR output, so no client pages ever log a hydration mismatch.
const LangSync = () => {
  useEffect(() => {
    // Safe to apply immediately: every reader of `currentLang` passes a
    // fixed "pl" getServerSnapshot to useStore, so each independently
    // hydrating Astro island always hydrates against "pl" (matching SSR)
    // no matter when this runs relative to other islands' hydration.
    const stored = readStoredLang();
    if (stored !== currentLang.get()) {
      currentLang.set(stored);
    }

    document.documentElement.lang = currentLang.get();
    const unsubscribe = currentLang.listen((lang) => {
      document.documentElement.lang = lang;
    });

    return unsubscribe;
  }, []);

  return null;
};

export default LangSync;
