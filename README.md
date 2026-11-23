# Instrukcja Uruchomienia / Run Instructions

## Wymagania
- Node.js (v18+)
- npm

## Instalacja Zależności
Jeśli pliki `node_modules` nie istnieją, uruchom:
```bash
npm install
```

## Uruchomienie Serwera Developerskiego
Aby zobaczyć stronę lokalnie z Hot-Module Replacement (HMR):
```bash
npm run dev
```
Strona będzie dostępna pod adresem: `http://localhost:4321`

## Budowanie Produkcyjne
Aby zbudować zoptymalizowaną wersję statyczną:
```bash
npm run build
```
Pliki wynikowe znajdą się w folderze `dist/`.

## Notatki Deweloperskie (Parallax & Animations)
- **Animacje** są oparte na `GSAP` oraz `Lenis` (smooth scroll).
- Wszystkie komponenty interaktywne znajdują się w `src/components/` i są ładowane z dyrektywą `client:load` w `src/pages/index.astro`.
- Aby dostroić szybkość scrolla, edytuj `duration` w `src/layouts/Layout.astro` (konfiguracja Lenis).
- Parametry parallaxu (szybkość ruchu myszką) znajdują się w `src/components/Hero.jsx`.
## Źródła obrazów i wideo
- Oryginały (PNG zrzutów realizacji, materiały źródłowe wideo) leżą w `assets-source/` — poza repozytorium (`.gitignore`), tylko lokalnie. Zachowują strukturę katalogów `public/` (np. `assets-source/projects/x.png`).
- W `public/` są wyłącznie pliki używane przez stronę: WebP, klatki i wideo oraz kilka PNG (ikony, `og-image.png`, `og/wiedza/*.png`, logo).
- WebP z oryginałów generuje `node scripts/optimize-project-images.mjs` (czyta `assets-source/`, zapisuje do `public/` i uzupełnia `src/data/projectImageSizes.json`). Zrzuty case studies: `scripts/capture-case-studies.mjs`; obrazy OG artykułów: `scripts/render-article-og.mjs`; podgląd builda: `npm run preview:local`.