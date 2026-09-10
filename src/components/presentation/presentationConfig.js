import { projects } from "../../data/projects";

const bespokeProject =
  projects.find((project) => project.title === "Solhaus Studio") ??
  projects.find((project) => project.title === "Siudek Jubiler") ??
  projects[0];

export const presentationSlides = [
  { index: 1, eyebrow: "Manifest", title: "VANTAFRAME", mode: "standard", scrollSpan: 1 },
  { index: 2, eyebrow: "Status Quo", title: "Pułapka WordPressa", mode: "standard", scrollSpan: 1 },
  { index: 3, eyebrow: "Nowy Standard", title: "Jamstack + Headless", mode: "standard", scrollSpan: 1 },
  { index: 4, eyebrow: "Dowód 01", title: "Ekstremalna wydajność", mode: "standard", scrollSpan: 1 },
  { index: 5, eyebrow: "Dowód 02", title: "Architektura bezpieczeństwa", mode: "standard", scrollSpan: 1 },
  { index: 6, eyebrow: "Dowód 03", title: "SEO jako przewaga", mode: "standard", scrollSpan: 1 },
  { index: 7, eyebrow: "Proces", title: "Od audytu do launchu", mode: "scrubbed", scrollSpan: 1.22 },
  { index: 8, eyebrow: "Design", title: "Szablon obniża zaufanie", mode: "scrubbed", scrollSpan: 1.16 },
  { index: 9, eyebrow: "ROI", title: "Wyższa konwersja, mniej kosztów", mode: "standard", scrollSpan: 1 },
  { index: 10, eyebrow: "Final", title: "Zbuduj cyfrową przewagę", mode: "standard", scrollSpan: 1 },
];

export const presentationCopy = {
  slideTwoRisks: [
    {
      title: "Wtyczki",
      body: "Każda kolejna wtyczka to kolejny punkt awarii, konflikt aktualizacji i nowe opóźnienie.",
    },
    {
      title: "Awarie",
      body: "Niewinne zmiany w panelu potrafią zatrzymać sprzedaż, formularze i tracking dokładnie wtedy, gdy są potrzebne.",
    },
    {
      title: "Luki bezpieczeństwa",
      body: "Publiczny panel, baza danych i PHP runtime tworzą niepotrzebną powierzchnię ataku.",
    },
  ],
  slideTwoChips: [
    "SEO",
    "CACHE",
    "SMTP",
    "BUILDER",
    "COOKIE",
    "BACKUP",
    "FORMS",
    "SECURITY",
    "API",
    "CDN",
    "PAYMENTS",
    "ANALYTICS",
    "TRACKING",
    "PERFORMANCE",
    "DATABASE",
  ],
  slideThreeModules: ["Astro Frontend", "Headless Content", "API Integrations"],
  workflowSteps: [
    {
      title: "Audit",
      body: "Analiza oferty, konkurencji i punktów blokujących konwersję.",
    },
    {
      title: "Custom UX/UI",
      body: "Projekt ścieżki sprzedaży i indywidualnej warstwy wizualnej.",
    },
    {
      title: "Astro Code",
      body: "Szybki, modularny frontend bez nadmiarowego JavaScriptu.",
    },
    {
      title: "QA",
      body: "Testy wydajności, dostępności, formularzy i scenariuszy leadowych.",
    },
  ],
  comparisonCallouts: ["Własna hierarchia", "Brand-fit visuals", "CTA pod ofertę"],
  roiMetrics: {
    hero: { value: 40, prefix: "+", suffix: "%" },
    maintenance: { value: 0, suffix: "h/mies." },
    presence: { value: 24, suffix: "/7" },
  },
  cta: {
    label: "START",
    primaryHref: "/#contact-form",
    primaryText: "Umów rozmowę",
    secondaryHref: "mailto:kontakt@vantaframe.pl",
    secondaryText: "kontakt@vantaframe.pl",
  },
  bespokeProject,
};
