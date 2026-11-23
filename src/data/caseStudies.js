// Flagship portfolio case studies — only projects with real, verified source
// material (existing copy + dedicated screenshots) get a page here. Everything
// else in src/data/projects.js stays a grid tile linking to its live site.
//
// Fields used by src/pages/portfolio/[slug].astro:
//   kind          "web" (default) | "ai". "web" shows the pinned, scrolling browser preview (public/case-studies/<slug>/full.webp,
//                 made by scripts/capture-case-studies.mjs) and the detail frames; "ai" shows a before/after `flow` instead.
//   anonymized    true -> the client name is replaced by `clientLabel` and no live link is shown.
//   clientLabel   public client label used in the KLIENT meta field (defaults to `client`).
//   flow          { before: string[], after: string[] } — only for kind "ai".
//   short         optional ~120-character teaser for the /portfolio/ list (otherwise cut from `context`).
//   detailFrames  [{ src, alt, caption }] — captions describe only what the frame really shows.
//   projectId     id of the matching tile in src/data/projects.js (hidden from the "other projects" grid).
//
// Example of a future AI entry (not rendered yet — uncomment and fill with verified facts only):
// {
//   slug: "wdrozenie-ai-przyklad",
//   kind: "ai",
//   anonymized: true,
//   clientLabel: "Firma usługowa z branży X",
//   flow: { before: ["Ręczne przepisywanie zapytań"], after: ["Automatyczna klasyfikacja zapytań"] },
//   ...the same fields as below (title, description, h1, projectTitle, industry, projectType, context, problem,
//   scope, solution, effect, desktopImage, desktopAlt, liveUrl: null, relatedService, ctaText)
// },
export const caseStudies = [
  {
    slug: "sgh-warsaw",
    kind: "web",
    projectId: 15,
    client: "SGH Warsaw",
    detailFrames: [
      { src: "/case-studies/sgh-warsaw/detail-1.webp", alt: "Sekcja „Dla kogo jest ten Raport?” na stronie raportu SGH", caption: "Sekcja „Dla kogo jest ten Raport?” — lista odbiorców i przycisk przejścia dalej." },
      { src: "/case-studies/sgh-warsaw/detail-2.webp", alt: "Sekcja „Pakiety” na stronie raportu SGH", caption: "Pakiety raportu — wersja premium i podstawowa z cenami i przyciskami zamówienia." },
      { src: "/case-studies/sgh-warsaw/detail-3.webp", alt: "Sekcja „Obszary tematyczne” na stronie raportu SGH", caption: "„Obszary tematyczne” — karuzela obszarów raportu na niebieskim tle." },
    ],
    title: "Landing page raportu SGH i Forum Ekonomicznego | VANTAFRAME",
    description:
      "Zobacz, jak zaprojektowaliśmy landing page premiery flagowego raportu ekonomicznego SGH i zapisów na Forum Ekonomiczne w Karpaczu. Case study VANTAFRAME.",
    h1: "Landing page premiery raportu SGH i Forum Ekonomicznego",
    projectTitle: "SGH Warsaw",
    industry: "Edukacja wyższa i wydarzenia branżowe",
    projectType: "Landing page eventowy",
    context:
      "SGH (Szkoła Główna Handlowa w Warszawie) przygotowywała premierę raportu „Architektura nowego porządku — stabilność w czasach zmian” oraz zapisy na XXXV Forum Ekonomiczne w Karpaczu.",
    problem:
      "Premiera wymagała jednej, przejrzystej strony łączącej prezentację raportu, pakiety dla odbiorców i zapisy na wydarzenie — bez rozpraszania uwagi między kilkoma osobnymi kanałami komunikacji.",
    scope: [
      "Strategia treści i struktury strony",
      "Prezentacja pakietów dla odbiorców raportu",
      "Custom design zgodny z identyfikacją SGH",
      "Development i wdrożenie",
      "Ścieżka zapisu na Forum Ekonomiczne",
    ],
    solution:
      "Zaprojektowaliśmy jeden, przejrzysty landing page, który prowadzi odwiedzającego od prezentacji raportu, przez wybór pakietu, aż po zapis na Forum Ekonomiczne — bez zbędnych kroków i rozpraszaczy.",
    effect: [
      "Czytelniejsza prezentacja raportu i wydarzenia w jednym miejscu",
      "Uporządkowana struktura informacji od premiery po zapisy",
      "Gotowa baza pod komunikację kolejnych edycji wydarzenia",
    ],
    desktopImage: "/1_strony/portfolio/1_SGH_desktop.webp",
    desktopAlt: "Landing page raportu SGH i Forum Ekonomicznego — widok na komputerze",
    mobileImage: "/1_strony/portfolio/1_SGH_mobile.webp",
    mobileAlt: "Landing page raportu SGH i Forum Ekonomicznego — widok na telefonie",
    liveUrl: "https://raportsghforum.pl/",
    relatedService: { label: "strony i landing page", href: "/strony/" },
    ctaText: "Planujesz premierę publikacji lub wydarzenie branżowe? Porozmawiajmy o Twoim projekcie.",
  },
  {
    slug: "magdalena-zaplata",
    kind: "web",
    projectId: 19,
    client: "Magdalena Zapłata",
    detailFrames: [
      { src: "/case-studies/magdalena-zaplata/detail-1.webp", alt: "Cennik zabiegów na stronie Magdaleny Zapłaty", caption: "Cennik zabiegów — karty z ceną „od” i przyciskiem sprawdzenia dokładnej ceny." },
      { src: "/case-studies/magdalena-zaplata/detail-2.webp", alt: "Porównanie przed i po na stronie Magdaleny Zapłaty", caption: "„Naturalna zmiana widoczna w świetle dziennym” — porównanie zdjęć przed i po." },
      { src: "/case-studies/magdalena-zaplata/detail-3.webp", alt: "Sekcja rezerwacji terminu na stronie Magdaleny Zapłaty", caption: "Rezerwacja terminu — kalendarz, dane kontaktowe i godziny przyjęć." },
    ],
    title: "Magdalena Zapłata: strona kliniki estetycznej | VANTAFRAME",
    description:
      "Zobacz, jak zaprojektowaliśmy elegancką stronę wizerunkową dla kliniki medycyny estetycznej Magdaleny Zapłaty. Case study VANTAFRAME.",
    h1: "Strona kliniki medycyny estetycznej budowana wokół marki osobistej",
    projectTitle: "Magdalena Zapłata",
    industry: "Beauty i medycyna estetyczna",
    projectType: "Strona wizerunkowa",
    context:
      "Magdalena Zapłata prowadzi klinikę medycyny estetycznej i buduje markę osobistą wokół swojej eksperckiej pozycji.",
    problem:
      "Marka osobista w branży beauty potrzebowała strony na poziomie prestiżu oferowanych zabiegów — ze stonowaną estetyką i prostą ścieżką do rezerwacji wizyty.",
    scope: [
      "Identyfikacja wizualna strony dopasowana do marki osobistej",
      "Stonowana typografia i duże fotografie",
      "Prosta ścieżka rezerwacji wizyty",
      "Wersja mobilna",
    ],
    solution:
      "Zaprojektowaliśmy elegancką stronę zbudowaną wokół marki osobistej — stonowana typografia, duże zdjęcia i prosta ścieżka do rezerwacji wizyty, bez elementów odciągających uwagę od oferty.",
    effect: [
      "Mocniejszy, spójny wizerunek marki osobistej",
      "Czytelniejsza prezentacja oferty zabiegów",
      "Lepsza, prostsza ścieżka do rezerwacji wizyty",
    ],
    desktopImage: "/1_strony/portfolio/2_Magdalena_desktop.webp",
    desktopAlt: "Strona kliniki Magdalena Zapłata — widok na komputerze",
    mobileImage: "/1_strony/portfolio/2_Magdalena_mobile.webp",
    mobileAlt: "Strona kliniki Magdalena Zapłata — widok na telefonie",
    liveUrl: "https://magdalenazaplata.pl/",
    relatedService: { label: "strony wizerunkowe", href: "/strony/" },
    ctaText: "Prowadzisz markę osobistą i potrzebujesz strony na miarę Twojej marki? Porozmawiajmy.",
  },
  {
    slug: "teatr-scala",
    kind: "web",
    projectId: 1,
    client: "Teatr SCALA",
    detailFrames: [
      { src: "/case-studies/teatr-scala/detail-1.webp", alt: "Sekcja „Metoda 8S” na stronie Teatr SCALA", caption: "Sekcja „Metoda 8S” — etapy pracy zapisane w ciemnej, złotej stylistyce." },
      { src: "/case-studies/teatr-scala/detail-2.webp", alt: "Sekcja oferty na stronie Teatr SCALA", caption: "Oferta — kafle koncepcji, m.in. One Woman Show, Italian Trio i Scala 1920’." },
      { src: "/case-studies/teatr-scala/detail-3.webp", alt: "Sekcja partnerów na stronie Teatr SCALA", caption: "Sekcja „Partnerzy” — logotypy miejsc i marek, z którymi współpracuje Teatr." },
    ],
    title: "Teatr SCALA: strona marki eventowej premium | VANTAFRAME",
    description:
      "Zobacz, jak zaprojektowaliśmy ciemną, złotą identyfikację wizualną dla marki tworzącej autorskie koncepcje eventowe. Case study VANTAFRAME.",
    h1: "Premium strona dla marki autorskich koncepcji eventowych",
    projectTitle: "Teatr Scala",
    industry: "Eventy i hospitality",
    projectType: "Strona wizerunkowa premium",
    context:
      "Teatr SCALA tworzy autorskie koncepcje eventowe kierowane do hoteli, restauracji i organizatorów konferencji.",
    problem:
      "Marka kierowana do klientów premium — hoteli, restauracji i organizatorów konferencji — potrzebowała identyfikacji wizualnej na poziomie odbiorców, do których trafia oferta.",
    scope: [
      "Ciemna, złota identyfikacja wizualna",
      "Custom design i development",
      "Prezentacja autorskich koncepcji eventowych",
      "Wersja mobilna",
    ],
    solution:
      "Zaprojektowaliśmy premium stronę w ciemnej, złotej identyfikacji wizualnej, która komunikuje prestiż marki już od pierwszego wrażenia — dopasowaną do oczekiwań hoteli, restauracji i organizatorów konferencji.",
    effect: [
      "Mocniejszy, premium wizerunek marki",
      "Czytelniejsza prezentacja autorskich koncepcji eventowych",
      "Lepsze dopasowanie strony do klienta docelowego (hotele, restauracje, konferencje)",
    ],
    desktopImage: "/1_strony/portfolio/3_Scala_desktop.webp",
    desktopAlt: "Strona Teatr SCALA — widok na komputerze",
    mobileImage: "/1_strony/portfolio/3_scala_mobile.webp",
    mobileAlt: "Strona Teatr SCALA — widok na telefonie",
    liveUrl: "https://teatrscala.com/",
    relatedService: { label: "strony premium", href: "/strony/" },
    ctaText: "Twoja marka celuje w klienta premium? Zobacz, jak to robimy.",
  },
  {
    slug: "agh-wggiis",
    kind: "web",
    projectId: 30,
    client: "AGH WGGiIS",
    detailFrames: [], // no live site to capture — the preview uses desktopImage
    title: "Start WGGiIS: aplikacja dla studentów AGH | VANTAFRAME",
    description:
      "Zobacz, jak zaprojektowaliśmy aplikację webową — asystenta studenta dla Wydziału Geodezji Górniczej i Inżynierii Środowiska AGH. Case study VANTAFRAME.",
    h1: "Aplikacja webowa — asystent studenta dla AGH WGGiIS",
    projectTitle: "Start WGGiIS — asystent studenta AGH",
    industry: "Edukacja wyższa",
    projectType: "Dedykowana aplikacja webowa",
    context:
      "Wydział Geodezji Górniczej i Inżynierii Środowiska AGH potrzebował jednego miejsca łączącego plan zajęć, checklisty i dostęp do systemów uczelnianych dla studentów.",
    problem:
      "Informacje potrzebne studentom — plan zajęć, checklisty, komunikaty i dostęp do systemów uczelnianych — były rozrzucone po wielu platformach, co utrudniało codzienną organizację.",
    scope: [
      "Projekt UX dopasowany do potrzeb studentów",
      "Development dedykowanej aplikacji webowej",
      "Integracja z systemami uczelnianymi",
      "Wersja mobilna",
    ],
    solution:
      "Zbudowaliśmy webowego asystenta studenta łączącego planer zajęć, checklisty, komunikaty i szybki dostęp do systemów uczelnianych w jednym, uporządkowanym miejscu.",
    effect: [
      "Uporządkowana struktura informacji dla studentów wydziału",
      "Szybszy dostęp do planu zajęć i systemów uczelnianych w jednym miejscu",
      "Lepsze dopasowanie narzędzia do codziennych potrzeb studentów",
    ],
    desktopImage: "/2_systemy/portfolio/AGH_WGGIIS.webp",
    desktopAlt: "Aplikacja Start WGGiIS dla studentów AGH — widok na komputerze",
    mobileImage: "/2_systemy/portfolio/AGH_WGGIIS_mobilna.webp",
    mobileAlt: "Aplikacja Start WGGiIS dla studentów AGH — widok na telefonie",
    liveUrl: null,
    relatedService: { label: "dedykowane systemy i aplikacje", href: "/systemy/" },
    ctaText: "Potrzebujesz dedykowanego systemu dla instytucji lub uczelni? Porozmawiajmy.",
  },
];
export const caseStudyIndex = (slug) => caseStudies.findIndex((c) => c.slug === slug);
export const getCaseStudyBySlug = (slug) => caseStudies.find((c) => c.slug === slug);