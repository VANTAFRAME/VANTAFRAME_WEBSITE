// Client references shown as quotes (components/shared/ReferenceQuote.jsx). The text of a reference
// is a quotation of a document supplied by the client: it is shown exactly as written (never edited
// or translated). `short` is one sentence taken from `full`; `pdf` is the original document.
export const references = [
  {
    id: "forum-ekonomiczne",
    organization: "Forum Ekonomiczne",
    author: "Jerzy Stanisław Bochyński",
    role: null,
    date: "2026-11-12",
    project: "Serwis raportsghforum.pl — Raport SGH i Forum Ekonomicznego",
    caseStudySlug: "sgh-warsaw",
    pdf: "/referencje/forum-ekonomiczne-vantaframe.pdf",
    // Page 1 of the PDF as images (made by scripts/render-reference-previews.mjs): a thumbnail for the section
    // and the full page for the viewer window.
    thumb: { src: "/referencje/forum-ekonomiczne-vantaframe-thumb.webp", width: 640, height: 906 },
    page: { src: "/referencje/forum-ekonomiczne-vantaframe-page.webp", width: 1600, height: 2264 },
    // Phrases of the large quotation shown in full white (the text itself is not changed).
    highlights: ["dbałość o detale", "spójne i estetyczne rozwiązania cyfrowe"],
    short:
      "Na szczególne uznanie zasługują profesjonalne podejście do realizacji projektu, dbałość o detale oraz umiejętność przełożenia naszych potrzeb na spójne i estetyczne rozwiązania cyfrowe.",
    full: [
      "Niniejszym potwierdzamy współpracę ze studiem VANTAFRAME w zakresie zaprojektowania i wykonania serwisu internetowego raportsghforum.pl, poświęconego Raportowi SGH i Forum Ekonomicznego, którego premiera odbyła się podczas XXXV Forum Ekonomicznego w Karpaczu.",
      "W ramach realizacji projektu studio VANTAFRAME odpowiadało za przygotowanie nowoczesnej, funkcjonalnej i responsywnej strony internetowej, łączącej wysoką jakość wizualną z intuicyjną obsługą oraz przejrzystą prezentacją treści.",
      "Na szczególne uznanie zasługują profesjonalne podejście do realizacji projektu, dbałość o detale oraz umiejętność przełożenia naszych potrzeb na spójne i estetyczne rozwiązania cyfrowe.",
      "Współpracę ze studiem VANTAFRAME oceniamy bardzo pozytywnie. Projekt został zrealizowany z należytą starannością, a komunikacja i zaangażowanie zespołu pozwoliły na sprawne przeprowadzenie procesu wdrożenia.",
      "Rekomendujemy VANTAFRAME jako rzetelnego i kompetentnego partnera w zakresie projektowania oraz tworzenia nowoczesnych serwisów internetowych.",
    ],
  },
];
export const getReference = (id) => references.find((r) => r.id === id);
export const getReferenceForCase = (slug) => references.find((r) => r.caseStudySlug === slug);