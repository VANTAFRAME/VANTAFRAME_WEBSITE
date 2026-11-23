import base from "../data/llms/llms.txt?raw";
import { getArticles } from "../lib/wiedza";
import { WIEDZA_PUBLIC } from "../data/wiedzaConfig";
// llms.txt = src/data/llms/llms.txt, plus the knowledge-base articles when WIEDZA_PUBLIC is true.
export async function GET() {
  let text = base;
  if (WIEDZA_PUBLIC) {
    const articles = await getArticles();
    if (articles.length) {
      const section = `## Wiedza\n- [Wiedza o wdrożeniach AI](https://vantaframe.pl/wiedza/): Praktyczne artykuły o wdrażaniu AI w firmach.\n${articles
        .map((a) => `  - [${a.data.title}](https://vantaframe.pl/wiedza/${a.id}/): ${a.data.description}`)
        .join("\n")}\n\n`;
      text = text.includes("## Rozszerzony kontekst") ? text.replace("## Rozszerzony kontekst", `${section}## Rozszerzony kontekst`) : `${text}\n${section}`;
    }
  }
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}