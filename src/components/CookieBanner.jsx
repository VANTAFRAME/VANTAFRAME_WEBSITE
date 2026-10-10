import React, { useEffect, useState } from "react";
import { togglePrivacy } from "../stores/legalStore";
import { useStore } from "../lib/useStore";
import { currentLang } from "../i18n/store";
import { languages } from "../i18n/translations";

const CONSENT_KEY = "vf_cookie_consent_v1";

const CookieBanner = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].cookieBanner;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(CONSENT_KEY);
    setIsVisible(!storedConsent);

    const openSettings = () => setIsVisible(true);
    window.addEventListener("open-cookie-settings", openSettings);

    return () => {
      window.removeEventListener("open-cookie-settings", openSettings);
    };
  }, []);

  const saveConsent = (type) => {
    window.localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({
        type,
        savedAt: new Date().toISOString(),
      })
    );
    if (type === "accepted") {
      window.__vfLoadGTM?.();
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-4 md:p-6">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/15 bg-black/95 backdrop-blur-md shadow-2xl">
        <div className="p-5 md:p-6 flex flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/45 mb-3">{t.label}</p>
            <p className="text-sm md:text-base leading-relaxed text-white/80">
              {t.desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              type="button"
              onClick={() => togglePrivacy(true)}
              className="text-left text-xs md:text-sm text-white/70 hover:text-white underline underline-offset-4 transition-colors"
            >
              {t.viewPolicy}
            </button>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => saveConsent("essential")}
                className="px-4 py-2 rounded-full border border-white/20 text-white text-xs md:text-sm font-semibold uppercase tracking-wider hover:border-white/45 transition-colors"
              >
                {t.essentialOnly}
              </button>
              <button
                type="button"
                onClick={() => saveConsent("accepted")}
                className="px-4 py-2 rounded-full bg-white text-black text-xs md:text-sm font-semibold uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
