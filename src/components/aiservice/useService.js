import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { UI } from "./ui";
// Content + UI strings for one service section in the visitor's language. `data` is the slice of
// the service's content ({ pl, en }) that the Astro page passed to this island as a prop (see
// data/aiServices/pick.js): islands never import the content of the services themselves, so a page
// only ships its own service's copy. Starts in PL (matches the pre-rendered HTML); LangSync
// switches to the stored language after hydration — same mechanism as every other page.
export const useService = (data) => {
  const lang = useStore(currentLang, () => "pl");
  return { lang, c: data[lang] || data.pl, ui: UI[lang] || UI.pl };
};