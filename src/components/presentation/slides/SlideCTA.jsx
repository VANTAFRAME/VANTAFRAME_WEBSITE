import React from "react";

const nextSteps = [
  "Krok 1: zakres",
  "Krok 2: harmonogram i wycena",
  "Krok 3: start projektu",
];

const SlideCTA = () => (
  <div className="relative flex h-full min-h-0 flex-col justify-center overflow-hidden">
    <div className="presentation-wire-mark opacity-[0.035]">
      <img src="/vf-logo-wireframe.png" alt="" aria-hidden="true" />
    </div>

    <div className="relative z-10 max-w-[62rem]">
      <p className="presentation-stat-label text-cyan-300/78">Closing Slide</p>
      <h2 className="presentation-focus-text mt-5 text-[clamp(2.8rem,10vw,7rem)] font-black leading-[0.88] text-white">
        Jeśli to ma sens
        <br />
        przejdźmy dalej.
      </h2>
      <p className="mt-6 max-w-[40rem] text-base leading-relaxed text-white/62 md:text-lg">
        Następny krok jest prosty. Doprecyzowanie zakresu, harmonogram i wycena, a potem start
        projektu bez zbędnego przeciągania decyzji.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {nextSteps.map((step) => (
          <span
            key={step}
            className="rounded-full border border-white/12 bg-white/[0.02] px-4 py-2 text-[0.68rem] uppercase tracking-[0.28em] text-white/68"
          >
            {step}
          </span>
        ))}
      </div>
    </div>

    <div className="relative z-10 mt-12 flex flex-col items-start gap-4">
      <a
        href="/#contact-form"
        className="cursor-hover inline-flex items-center gap-3 border-b border-cyan-300/36 pb-2 text-sm font-medium uppercase tracking-[0.32em] text-white transition-colors duration-300 hover:border-cyan-200 hover:text-cyan-200"
        data-cursor-label="DALEJ"
      >
        <span>Ustalmy zakres i start</span>
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M13 5l7 7-7 7" />
        </svg>
      </a>

      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/36">
        Decyzja należy do Państwa.
      </p>

      <a
        href="mailto:kontakt@vantaframe.pl"
        className="cursor-hover text-[0.72rem] uppercase tracking-[0.28em] text-white/48 transition-colors duration-300 hover:text-white/72"
        data-cursor-label="MAIL"
      >
        kontakt@vantaframe.pl
      </a>
    </div>
  </div>
);

export default SlideCTA;
