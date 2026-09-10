import React from "react";
import SecurityArchitectureDiagram from "../islands/SecurityArchitectureDiagram";

const SlideSecurity = () => (
  <div className="grid h-full min-h-0 items-center gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
    <div className="max-w-[34rem]">
      <p className="presentation-stat-label text-cyan-300/78">Static-first Security</p>
      <h2 className="presentation-focus-text mt-4 text-[clamp(2.2rem,6.6vw,5.4rem)] font-black leading-[0.92] text-white">
        Mniej ruchomych części. Mniej wektorów ataku.
      </h2>
      <p className="mt-4 text-base leading-relaxed text-white/62 md:mt-5 md:text-lg">
        Vantaframe usuwa z publicznej strony to, co najczęściej bywa celem. Brak bazy danych
        dostępnej z frontu, brak wp-admina, brak klasycznego serwera PHP obsługującego każdy
        request.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 md:mt-8">
        {["No public DB", "No wp-admin", "No PHP runtime"].map((item) => (
          <span key={item} className="presentation-chip">
            {item}
          </span>
        ))}
      </div>
    </div>

    <SecurityArchitectureDiagram />
  </div>
);

export default SlideSecurity;
