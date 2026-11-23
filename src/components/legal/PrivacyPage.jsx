import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import PrivacyPolicyContent from "./PrivacyPolicyContent";
// Full-page version of the privacy and cookie policy (same text as the modal). The server renders
// the Polish version; English is switched on the client like everywhere else on the site.
const PrivacyPage = () => {
  const lang = useStore(currentLang, () => "pl");
  const isEn = lang === "en";
  return (
    <article className="mx-auto w-full max-w-3xl px-6 pt-32 pb-24 md:pt-40 md:pb-32 text-sm text-white/70 leading-relaxed space-y-4">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-8">
        {isEn ? "Privacy and Cookie Policy" : "Polityka prywatności i cookies"}
      </h1>
      <PrivacyPolicyContent lang={isEn ? "en" : "pl"} />
    </article>
  );
};
export default PrivacyPage;