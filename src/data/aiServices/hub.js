// Service rows on the /wdrozenia-ai/ pillar page (section under the hero) and short names used
// by the "related services" blocks. HUB_ORDER = the five child pages, in page order;
// "wdrozenia-ai" itself is the pillar (n "00") and is not listed among its own children. The PL copy and the micro
// labels (per language: `micro.pl` / `micro.en`) are the agreed wording; EN is the same meaning in natural English.
// Full page content lives in ./<slug>.js (see index.js).
export const HUB_ORDER = [
  "automatyzacja-procesow",
  "agenci-ai",
  "asystenci-ai",
  "integracje-ai",
  "automatyzacja-dokumentow",
];
export const HUB = {
  "wdrozenia-ai": {
    n: "00",
    path: "/wdrozenia-ai/",
    micro: { pl: "ANALIZA — PROJEKT — WDROŻENIE", en: "ANALYSIS — DESIGN — DEPLOY" },
    pl: {
      area: "KOMPLEKSOWE PROJEKTY",
      title: "Wdrożenia AI",
      desc: "Projektujemy i wdrażamy rozwiązania AI dopasowane do procesów, danych i infrastruktury firmy.",
    },
    en: {
      area: "END-TO-END PROJECTS",
      title: "AI implementation",
      desc: "We design and deploy AI solutions fitted to a company's processes, data and infrastructure.",
    },
  },
  "agenci-ai": {
    n: "02",
    path: "/wdrozenia-ai/agenci-ai/",
    micro: { pl: "ANALIZA — NARZĘDZIE — AKCJA", en: "REASON — TOOL — ACTION" },
    pl: {
      area: "SYSTEMY AGENTOWE",
      title: "Agenci AI",
      desc: "Budujemy agentów AI, którzy korzystają z narzędzi, analizują informacje i realizują wieloetapowe zadania.",
    },
    en: {
      area: "AGENTIC SYSTEMS",
      title: "AI agents",
      desc: "We build AI agents that use tools, analyse information and carry out multi-step tasks.",
    },
  },
  "automatyzacja-procesow": {
    n: "01",
    path: "/wdrozenia-ai/automatyzacja-procesow/",
    micro: { pl: "ZDARZENIE — REGUŁY — DZIAŁANIE", en: "TRIGGER — LOGIC — EXECUTE" },
    pl: {
      area: "PROCESY I OPERACJE",
      title: "Automatyzacja procesów",
      desc: "Łączymy działania, systemy i dane w procesy działające bez ciągłej ręcznej obsługi.",
    },
    en: {
      area: "WORKFLOW & OPERATIONS",
      title: "Process automation",
      desc: "We connect actions, systems and data into processes that run without constant manual handling.",
    },
  },
  "integracje-ai": {
    n: "04",
    path: "/wdrozenia-ai/integracje-ai/",
    micro: { pl: "SYSTEM — API — AI", en: "SYSTEM — API — AI" },
    pl: {
      area: "POŁĄCZENIA SYSTEMOWE",
      title: "Integracje AI",
      desc: "Integrujemy modele AI z CRM, ERP, API, bazami danych i narzędziami wykorzystywanymi w firmie.",
    },
    en: {
      area: "SYSTEM CONNECTIONS",
      title: "AI integrations",
      desc: "We integrate AI models with CRM, ERP, APIs, databases and the tools a company already uses.",
    },
  },
  "asystenci-ai": {
    n: "03",
    path: "/wdrozenia-ai/asystenci-ai/",
    micro: { pl: "WIEDZA — KONTEKST — ODPOWIEDŹ", en: "KNOWLEDGE — CONTEXT — ANSWER" },
    pl: {
      area: "WSPARCIE ZESPOŁÓW",
      title: "Asystenci AI",
      desc: "Tworzymy asystentów wspierających zespoły w pracy z dokumentami, wiedzą firmową i zapytaniami.",
    },
    en: {
      area: "TEAM SUPPORT",
      title: "AI assistants",
      desc: "We create assistants that help teams work with documents, company knowledge and enquiries.",
    },
  },
  "automatyzacja-dokumentow": {
    n: "05",
    path: "/wdrozenia-ai/automatyzacja-dokumentow/",
    micro: { pl: "DOKUMENT — ODCZYT — DANE", en: "DOCUMENT — EXTRACT — PROCESS" },
    pl: {
      area: "PRZETWARZANIE DANYCH",
      title: "Automatyzacja dokumentów",
      desc: "Automatyzujemy odczytywanie, klasyfikację i przetwarzanie dokumentów oraz przekazywanie danych do systemów.",
    },
    en: {
      area: "DATA PROCESSING",
      title: "Document automation",
      desc: "We automate reading, classifying and processing documents and passing the data on to your systems.",
    },
  },
};
export const hubRows = (lang) =>
  HUB_ORDER.map((slug) => {
    const h = HUB[slug];
    const t = h[lang] || h.pl;
    const micro = (h.micro && (h.micro[lang] || h.micro.pl)) || "";
    return { slug, n: h.n, href: h.path, micro, flow: micro.split(" — "), ...t };
  });