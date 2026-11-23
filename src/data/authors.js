// People shown as authors of knowledge-base articles (src/content/wiedza, field `author`) and in the team section of
// /o-nas/ (id = HTML id and the fragment of the JSON-LD Person @id: https://vantaframe.pl/o-nas/#<id>).
// Photos: scripts/build-team-photos.mjs (originals in assets-source/team/). Only facts confirmed by the owner go here.
export const authors = [
  {
    id: "dawid-jaskiewicz",
    name: "Dawid Jaśkiewicz",
    role: { pl: "Założyciel VANTAFRAME", en: "Founder, VANTAFRAME" },
    bio: {
      pl: "Założyciel VANTAFRAME. Odpowiada za projekty wdrożeń AI, stron i systemów dla firm: od rozmowy o procesach i analizy po uruchomienie i dalszy rozwój.",
      en: "Founder of VANTAFRAME. Leads AI implementation, website and system projects for companies: from process conversations and analysis to launch and further development.",
    },
    linkedin: "https://www.linkedin.com/in/dawid-jaskiewicz-vantaframe/",
    photo: "/team/dawid-jaskiewicz.webp",
    avatar: "/team/dawid-jaskiewicz-avatar.webp",
    card: "/team/dawid-jaskiewicz-card.webp",
    url: "/o-nas/#zespol",
  },
];
export const DEFAULT_AUTHOR_ID = "dawid-jaskiewicz";
export const getAuthor = (id) => authors.find((a) => a.id === id) ?? authors[0];
// schema.org Person (BlogPosting.author, Organization.founder) — same @id everywhere.
export const authorJsonLd = (a) => ({
  "@type": "Person",
  "@id": `https://vantaframe.pl/o-nas/#${a.id}`,
  name: a.name,
  jobTitle: a.role.pl,
  image: `https://vantaframe.pl${a.photo}`,
  url: `https://vantaframe.pl${a.url}`,
  sameAs: [a.linkedin],
  worksFor: { "@id": "https://vantaframe.pl/#organization" },
});