import base from "../data/llms/llms-full.txt?raw";
import { getArticles } from "../lib/wiedza";
import { WIEDZA_PUBLIC } from "../data/wiedzaConfig";
// llms-full.txt = src/data/llms/llms-full.txt, plus the knowledge-base articles when WIEDZA_PUBLIC is true.
export async function GET() {
  let text = base;
  if (WIEDZA_PUBLIC) {
    const articles = await getArticles();
    if (articles.length) {
      text = `${text.trimEnd()}\n\n## 7. Wiedza (https://vantaframe.pl/wiedza/)\n${articles
        .map((a) => `- ${a.data.title}: https://vantaframe.pl/wiedza/${a.id}/ — ${a.data.description}`)
        .join("\n")}\n`;
    }
  }
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}