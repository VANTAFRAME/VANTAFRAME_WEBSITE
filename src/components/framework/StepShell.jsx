import React from "react";

const StepShell = ({
  frameworkName,
  closeLabel,
  stepIndexLabel,
  areaLabel,
  progressFraction,
  backLabel,
  nextLabel,
  onBack,
  onNext,
  canGoBack,
  nextDisabled,
  children,
  visual,
  onRestart,
  restartLabel,
  contained = false,
}) => (
  <div className={contained ? "relative flex h-full flex-col bg-brand-black text-white" : "fixed inset-0 z-[80] flex flex-col bg-brand-black text-white"}>
    {!contained && (
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 md:px-8">
        <a href="/" className="cursor-hover text-sm font-bold tracking-[0.05em]" data-cursor-label="HOME">
          VANTAFRAME <span className="text-white/40">/ {frameworkName}</span>
        </a>
        <a
          href="/"
          className="cursor-hover flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
          aria-label={closeLabel}
          data-cursor-label="CLOSE"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </a>
      </header>
    )}

    <div className={contained ? "grid min-h-0 flex-1 md:grid-cols-2" : "grid min-h-0 flex-1 md:grid-cols-2"}>
      <main
        id="framework-question"
        aria-live="polite"
        className={contained ? "order-2 flex min-h-0 flex-col overflow-y-auto px-5 py-6 md:order-1 md:px-8 md:py-8" : "order-2 flex min-h-0 flex-col overflow-y-auto px-5 py-8 md:order-1 md:px-12 md:py-14 lg:px-16"}
      >
        <div className={contained ? "w-full" : "mx-auto w-full max-w-xl"}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
            {stepIndexLabel} — {areaLabel}
          </p>
          {children}

          <button
            type="button"
            onClick={onRestart}
            data-cursor-label="RESTART"
            className="cursor-hover mt-12 text-xs uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
          >
            {restartLabel}
          </button>
        </div>
      </main>

      <aside className={contained ? "order-1 h-[110px] shrink-0 border-b border-white/8 md:order-2 md:h-auto md:border-b-0 md:border-l md:border-white/10" : "order-1 h-[26vh] shrink-0 border-b border-white/10 md:order-2 md:h-auto md:border-b-0 md:border-l"}>
        {visual}
      </aside>
    </div>

    <footer className={contained ? "shrink-0 border-t border-white/10 px-5 py-4" : "shrink-0 border-t border-white/10 px-5 py-4 md:px-8"}>
      <div className="mx-auto flex w-full max-w-xl items-center gap-4 md:max-w-none md:mx-0 md:pl-0">
        <div className="hidden h-[2px] flex-1 bg-white/10 md:block">
          <div
            className="h-full bg-brand-cyan transition-[width] duration-500 ease-out"
            style={{ width: `${Math.round(progressFraction * 100)}%` }}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-start">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            className="cursor-hover rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white/70 transition-colors hover:border-white/40 hover:text-white disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white/70"
            data-cursor-label="BACK"
          >
            {backLabel}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="cursor-hover rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-white/85 disabled:opacity-30 disabled:hover:bg-white"
            data-cursor-label="NEXT"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </footer>
  </div>
);

export default StepShell;
