import React from "react";
import MetricCounter from "../islands/MetricCounter";

const SlideROI = () => (
  <div className="roi-slide-layout">
    <div className="roi-slide-layout__intro">
      <p className="presentation-stat-label text-cyan-300/78">Measured Outcome</p>
      <h2 className="presentation-focus-text mt-5 text-[clamp(2.8rem,9vw,6.2rem)] font-black leading-[0.9] text-white">
        Wyższa konwersja. Niższy koszt utrzymania.
      </h2>
      <p className="mt-5 max-w-[38rem] text-base leading-relaxed text-white/62 md:text-lg">
        B2B nie potrzebuje ciężkiego stacku do codziennego działania. Potrzebuje strony, która
        komunikuje wartość szybciej, działa stabilnie i po wdrożeniu nie zamienia się w koszt
        operacyjny.
      </p>
    </div>

    <div className="roi-slide-layout__metrics">
      <MetricCounter
        value={40}
        prefix="+"
        suffix="%"
        label="Higher conversion"
        description="Potencjał wzrostu skuteczności dzięki szybszemu ładowaniu, czytelniejszej hierarchii i lepszym CTA."
        className="min-h-[13rem] justify-between md:min-h-[17rem]"
      />
      <MetricCounter
        value={0}
        from={12}
        suffix="zł/mies."
        label="Maintenance"
        description="Całkowita bezobsługowość po wdrożeniu w codziennym operowaniu stroną."
        className="min-h-[13rem] justify-between md:min-h-[17rem]"
      />
      <MetricCounter
        value={24}
        suffix="/7"
        label="Sales presence"
        description="Strona działa jako cyfrowy handlowiec, bez przerw i bez zależności od godzin pracy zespołu."
        className="min-h-[13rem] justify-between md:min-h-[17rem]"
      />
    </div>
  </div>
);

export default SlideROI;
