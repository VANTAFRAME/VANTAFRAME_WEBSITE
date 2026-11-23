import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
// Closing statement of /strony/ (full-screen, centred), same layout as the one the page had inline.
const FinalStatement = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].stronyPage.finalStatement;
  return (
    <section className="min-h-[100svh] flex items-center justify-center px-6 text-center bg-brand-black">
      <h2 className="text-[clamp(2.6rem,9vw,7rem)] font-black tracking-tight leading-[0.95]" data-reveal>
        {t.heading.map((line, i) => (
          <React.Fragment key={line}>
            {i > 0 && (
              <>
                {" "}
                <br />
              </>
            )}
            {line}
          </React.Fragment>
        ))}
      </h2>
    </section>
  );
};
export default FinalStatement;