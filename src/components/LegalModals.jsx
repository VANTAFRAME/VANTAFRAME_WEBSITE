import React, { useEffect, useId, useRef } from "react";
import { useStore } from "../lib/useStore";
import { isPrivacyOpen, togglePrivacy } from "../stores/legalStore";
import { currentLang } from "../i18n/store";
import gsap from "gsap";

const Modal = ({ isOpen, onClose, title, closeAria, closeLabel, children }) => {
  const titleId = useId();
  const descriptionId = useId();
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const scrollRef = useRef(null);
  const previousOverflowRef = useRef("");

  const scrollByAmount = (amount) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop += amount;
    el.focus({ preventScroll: true });
  };

  const handleOverlayWheel = (event) => {
    const el = scrollRef.current;
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    el.scrollTop += event.deltaY;
  };

  const handleScrollKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      scrollByAmount(90);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      scrollByAmount(-90);
      return;
    }
    if (event.key === "PageDown") {
      event.preventDefault();
      scrollByAmount(280);
      return;
    }
    if (event.key === "PageUp") {
      event.preventDefault();
      scrollByAmount(-280);
    }
  };

  useEffect(() => {
    if (isOpen) {
      previousOverflowRef.current = document.body.style.overflow;
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.25, pointerEvents: "auto" });
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }
      );
      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
          scrollRef.current.focus({ preventScroll: true });
        }
      });
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, pointerEvents: "none" });
      document.body.style.overflow = previousOverflowRef.current;
    }

    return () => {
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      ref={overlayRef}
      inert={!isOpen}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm opacity-0 pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={onClose}
      onWheelCapture={handleOverlayWheel}
    >
      <div
        ref={contentRef}
        className="bg-[#101010] border border-white/10 rounded-2xl w-full max-w-3xl h-[min(85dvh,780px)] max-h-[calc(100dvh-2rem)] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151515]">
          <h2 id={titleId} className="text-xl font-bold tracking-tight text-white">{title}</h2>
          <button type="button" onClick={onClose} className="p-2.5 md:p-2 hover:bg-white/10 rounded-full transition-colors group" aria-label={closeAria}>
            <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative flex-1 min-h-0 overflow-hidden group/modal">
          <div
            ref={scrollRef}
            tabIndex={0}
            id={descriptionId}
            onKeyDown={handleScrollKeyDown}
            className="h-full min-h-0 p-6 overflow-y-auto overscroll-contain text-sm text-white/70 leading-relaxed space-y-4 custom-scrollbar outline-none"
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          >
            {children}
          </div>

        </div>

        <div className="p-4 border-t border-white/5 bg-[#151515] flex justify-end">
          <button type="button" onClick={onClose} className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-wide rounded-md hover:bg-gray-200 transition-colors">
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const PolishPrivacyContent = () => (
  <>
        <p className="text-xs uppercase tracking-[0.22em] text-white/40">Ostatnia aktualizacja: 21 lipca 2026 r.</p>

        <p><strong>1. O tej polityce</strong></p>
        <p>
          Ta polityka wyjaśnia, w jaki sposób VANTAFRAME przetwarza dane osobowe użytkowników strony vantaframe.pl,
          formularza kontaktowego oraz kreatora projektu FRAMEWORK. Opisuje też użycie cookies, localStorage i usług
          zewnętrznych wykorzystywanych przez stronę.
        </p>

        <p><strong>2. Administrator danych</strong></p>
        <p>
          Administratorem danych jest VANTAFRAME SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ z siedzibą w Krakowie,
          ul. Żułowska 33 lok. 10, 31-436 Kraków, Polska, wpisana do KRS pod numerem 0001253958, NIP 9452332952,
          REGON 545245372. Kontakt: kontakt@vantaframe.pl, tel. +48 794 659 528.
        </p>
        <p>
          Administrator nie wyznaczył inspektora ochrony danych. W sprawach dotyczących prywatności i realizacji praw
          można kontaktować się bezpośrednio z Administratorem.
        </p>

        <p><strong>3. Formularz kontaktowy</strong></p>
        <p>W zwykłym formularzu kontaktowym przetwarzamy dane podane przez użytkownika:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>imię i nazwisko,</li>
          <li>adres e-mail,</li>
          <li>treść wiadomości,</li>
          <li>techniczne dane wysłania formularza, jeżeli są rejestrowane przez infrastrukturę lub FormSubmit.</li>
        </ul>
        <p>
          Formularz jest wysyłany przez usługę FormSubmit na adres kontakt@vantaframe.pl. Ukryte pole formularza wyłącza
          captcha FormSubmit w tym formularzu. Podstawą przetwarzania jest art. 6 ust. 1 lit. b RODO, gdy kontakt zmierza
          do zawarcia umowy lub działań przed jej zawarciem, a w pozostałych przypadkach art. 6 ust. 1 lit. f RODO.
          Uzasadnionym interesem jest obsługa zapytań i prowadzenie korespondencji biznesowej.
        </p>

        <p><strong>4. Kreator projektu FRAMEWORK</strong></p>
        <p>
          W formularzu leadowym FRAMEWORK przetwarzamy imię, adres e-mail, opcjonalnie nazwę firmy i numer telefonu,
          odpowiedzi projektowe oraz podsumowanie zgłoszenia. Zgłoszenie jest wysyłane przez FormSubmit AJAX.
        </p>
        <p>
          Checkbox przy formularzu potwierdza wyłącznie zapoznanie się z tą polityką. Nie jest zgodą na przetwarzanie
          danych i nie stanowi podstawy prawnej obsługi zapytania.
        </p>
        <p>
          FRAMEWORK zapisuje postęp lokalnie w przeglądarce pod kluczem localStorage <code>vf_framework_v1</code>.
          Zapis obejmuje odpowiedzi projektowe, aktualny krok i czas zapisu. Nie obejmuje imienia, firmy, e-maila ani telefonu.
          Dane pozostają w urządzeniu użytkownika do czasu usunięcia danych strony, nadpisania zapisu albo wysłania projektu,
          po którym aplikacja czyści zapisany postęp.
        </p>

        <p><strong>5. Opcjonalna rekomendacja AI</strong></p>
        <p>
          Rekomendacja AI jest opcjonalna, pomocnicza i niewiążąca. Nie jest ofertą VANTAFRAME i nie wywołuje skutków
          prawnych wobec użytkownika. Brak zgody na użycie AI nie blokuje wysłania projektu do VANTAFRAME.
        </p>
        <p>
          Endpoint <code>/api/project-recommendation</code> korzysta z Anthropic API. Kod usuwa z danych wejściowych pola
          <code> name</code>, <code> email</code>, <code> phone</code> i <code> company</code> przed wysłaniem zapytania do
          Anthropic. Do Anthropic trafiają odpowiedzi projektowe potrzebne do wygenerowania rekomendacji; mogą one stać się
          danymi osobowymi, jeżeli użytkownik sam wpisze w nich informacje identyfikujące.
        </p>

        <p><strong>6. Cookies i localStorage</strong></p>
        <p>Strona nie wdraża obecnie Google Analytics, Google Tag Managera ani cookies marketingowych. Używane mechanizmy to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><code>vf_cookie_consent_v1</code> w localStorage - zapisuje wybór w banerze cookies/localStorage oraz datę zapisu.</li>
          <li><code>vf_framework_v1</code> w localStorage - zapisuje postęp kreatora FRAMEWORK bez danych kontaktowych.</li>
        </ul>
        <p>
          Zablokowanie cookies lub localStorage może spowodować, że strona nie zapamięta ustawień albo postępu w kreatorze.
        </p>

        <p><strong>7. Hosting, pliki i zewnętrzne zasoby</strong></p>
        <p>
          Publiczna strona VANTAFRAME jest hostowana w Hostingerze. Kod nie zapisuje leadów ani wiadomości z formularzy
          w żadnej bazie danych.
        </p>
        <p>
          Strona ładuje font Outfit z Google Fonts przez <code>fonts.googleapis.com</code> i <code>fonts.gstatic.com</code>.
          W kodzie strony nie znaleziono wdrożonego Google reCAPTCHA, Google Analytics, Google Tag Managera ani Meta Pixel.
          Na stronie znajdują się zwykłe linki do Instagramu i LinkedIn; kliknięcie przenosi użytkownika do zewnętrznego serwisu.
        </p>

        <p><strong>8. Odbiorcy danych</strong></p>
        <p>W zależności od użytej funkcji dane mogą być przekazywane lub udostępniane:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Hostinger - hosting publicznej strony i infrastruktura serwerowa,</li>
          <li>FormSubmit - obsługa wysyłki formularzy,</li>
          <li>Anthropic - wyłącznie opcjonalna rekomendacja AI, w zakresie odpowiedzi projektowych,</li>
          <li>Google - dostarczenie fontów Google Fonts,</li>
          <li>dostawcy poczty e-mail używanej przez VANTAFRAME,</li>
          <li>dostawcy IT, utrzymania, bezpieczeństwa, doradcy prawni lub księgowi, jeżeli jest to potrzebne,</li>
          <li>podmioty uprawnione na podstawie przepisów prawa.</li>
        </ul>

        <p><strong>9. Przekazywanie danych poza EOG</strong></p>
        <p>
          Niektórzy dostawcy mogą przetwarzać dane w Stanach Zjednoczonych lub innych państwach poza Europejskim Obszarem
          Gospodarczym. Transfer może nastąpić tylko na podstawie mechanizmów przewidzianych w RODO, takich jak decyzja
          Komisji Europejskiej stwierdzająca odpowiedni stopień ochrony, standardowe klauzule umowne albo inne właściwe
          zabezpieczenia. Informację o stosowanych zabezpieczeniach można uzyskać, pisząc na kontakt@vantaframe.pl.
        </p>

        <p><strong>10. Okresy przechowywania</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>dane z formularzy i korespondencji - do 12 miesięcy od zakończenia kontaktu, chyba że kontakt prowadzi do umowy,</li>
          <li>dane związane z umową, ofertą, rozliczeniami lub obowiązkami prawnymi - przez okres wymagany do ich realizacji,</li>
          <li>dane potrzebne do ustalenia, dochodzenia lub obrony roszczeń - do upływu terminów przedawnienia,</li>
          <li>dane przetwarzane na podstawie zgody - do czasu jej wycofania, z zastrzeżeniem danych potrzebnych do innych celów,</li>
          <li>dane w localStorage - do zmiany ustawień, wyczyszczenia danych strony, nadpisania lub usunięcia wpisu.</li>
        </ul>

        <p><strong>11. Prawa użytkownika</strong></p>
        <p>Na zasadach określonych w RODO użytkownik ma prawo do:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>dostępu do danych i otrzymania ich kopii,</li>
          <li>sprostowania, usunięcia lub ograniczenia przetwarzania danych,</li>
          <li>przenoszenia danych, gdy przetwarzanie odbywa się automatycznie na podstawie zgody lub umowy,</li>
          <li>wniesienia sprzeciwu wobec przetwarzania opartego na art. 6 ust. 1 lit. f RODO,</li>
          <li>cofnięcia zgody w dowolnym momencie, jeżeli przetwarzanie odbywa się na podstawie zgody,</li>
          <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
        </ul>
        <p>
          Żądanie można przesłać na kontakt@vantaframe.pl albo listownie na adres Administratora. Dla ochrony danych
          Administrator może poprosić o informacje potrzebne do potwierdzenia tożsamości osoby składającej żądanie.
        </p>

        <p><strong>12. Czy podanie danych jest obowiązkowe?</strong></p>
        <p>
          Podanie danych jest dobrowolne. Pola wymagane są jednak niezbędne do wysłania formularza, udzielenia odpowiedzi
          albo przygotowania wstępnego podsumowania projektu. Niepodanie wymaganych danych może uniemożliwić obsługę zapytania.
          Zgoda na rekomendację AI jest dobrowolna i nie jest warunkiem wysłania zgłoszenia.
        </p>

        <p><strong>13. Bezpieczeństwo i dane wrażliwe</strong></p>
        <p>
          Administrator stosuje środki techniczne i organizacyjne odpowiednie do ryzyka. Prosimy, aby w formularzach nie
          podawać informacji, które nie są potrzebne do obsługi zapytania, w szczególności danych o zdrowiu, poglądach,
          przekonaniach, pochodzeniu, danych biometrycznych ani informacji o wyrokach i naruszeniach prawa.
        </p>

        <p><strong>14. Zmiany polityki</strong></p>
        <p>
          Polityka może być aktualizowana, jeżeli zmieni się sposób działania strony, zakres danych, dostawcy albo przepisy.
          Jeżeli w przyszłości zostaną wdrożone narzędzia analityczne lub marketingowe, będą wymagały odpowiedniej informacji
          i, jeżeli przepisy tego wymagają, uprzedniej zgody użytkownika.
        </p>
  </>
);

const EnglishPrivacyContent = () => (
  <>
        <p className="text-xs uppercase tracking-[0.22em] text-white/40">Last updated: July 21, 2026</p>

        <p><strong>1. About this policy</strong></p>
        <p>
          This policy explains how VANTAFRAME processes the personal data of users of the vantaframe.pl website, the
          contact form, and the FRAMEWORK project creator. It also describes the use of cookies, localStorage, and
          external services used by the site.
        </p>

        <p><strong>2. Data controller</strong></p>
        <p>
          The data controller is VANTAFRAME SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ, based in Kraków,
          ul. Żułowska 33 lok. 10, 31-436 Kraków, Poland, registered in the National Court Register (KRS) under
          number 0001253958, NIP 9452332952, REGON 545245372. Contact: kontakt@vantaframe.pl, phone +48 794 659 528.
        </p>
        <p>
          The controller has not appointed a data protection officer. For matters concerning privacy and the exercise
          of your rights, you can contact the controller directly.
        </p>

        <p><strong>3. Contact form</strong></p>
        <p>Through the standard contact form we process the data provided by the user:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>first and last name,</li>
          <li>email address,</li>
          <li>message content,</li>
          <li>technical data of the form submission, if recorded by the infrastructure or FormSubmit.</li>
        </ul>
        <p>
          The form is sent via the FormSubmit service to kontakt@vantaframe.pl. A hidden form field disables the
          FormSubmit captcha for this form. The legal basis for processing is Article 6(1)(b) GDPR when the contact
          is aimed at concluding a contract or actions taken prior to it, and in other cases Article 6(1)(f) GDPR.
          The legitimate interest is handling enquiries and conducting business correspondence.
        </p>

        <p><strong>4. FRAMEWORK project creator</strong></p>
        <p>
          In the FRAMEWORK lead form we process your name, email address, optionally company name and phone number,
          your project answers, and the submission summary. The submission is sent via FormSubmit AJAX.
        </p>
        <p>
          The checkbox next to the form only confirms that you have read this policy. It is not consent to data
          processing and is not a legal basis for handling your enquiry.
        </p>
        <p>
          FRAMEWORK saves progress locally in the browser under the localStorage key <code>vf_framework_v1</code>.
          The saved data includes your project answers, current step, and save time. It does not include your name,
          company, email, or phone number. The data stays on your device until site data is cleared, the entry is
          overwritten, or the project is submitted, after which the app clears the saved progress.
        </p>

        <p><strong>5. Optional AI recommendation</strong></p>
        <p>
          The AI recommendation is optional, supplementary, and non-binding. It is not an offer from VANTAFRAME and
          has no legal effect on the user. Declining to use AI does not block sending the project to VANTAFRAME.
        </p>
        <p>
          The <code>/api/project-recommendation</code> endpoint uses the Anthropic API. The code strips the
          <code> name</code>, <code> email</code>, <code> phone</code>, and <code> company</code> fields from the
          input before sending the request to Anthropic. The project answers needed to generate the recommendation
          are sent to Anthropic; these may become personal data if the user includes identifying information in
          their own answers.
        </p>

        <p><strong>6. Cookies and localStorage</strong></p>
        <p>The site does not currently implement Google Analytics, Google Tag Manager, or marketing cookies. The mechanisms in use are:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><code>vf_cookie_consent_v1</code> in localStorage - stores your choice in the cookie banner and the date it was saved.</li>
          <li><code>vf_framework_v1</code> in localStorage - stores FRAMEWORK creator progress without contact details.</li>
        </ul>
        <p>
          Blocking cookies or localStorage may prevent the site from remembering settings or creator progress.
        </p>

        <p><strong>7. Hosting, files, and external resources</strong></p>
        <p>
          The public VANTAFRAME website is hosted on Hostinger. The code does not store leads or form messages in
          any database.
        </p>
        <p>
          The site loads the Outfit font from Google Fonts via <code>fonts.googleapis.com</code> and
          <code> fonts.gstatic.com</code>. No implementation of Google reCAPTCHA, Google Analytics, Google Tag
          Manager, or Meta Pixel was found in the site's code. The site contains plain links to Instagram and
          LinkedIn; clicking them takes the user to an external service.
        </p>

        <p><strong>8. Data recipients</strong></p>
        <p>Depending on the feature used, data may be transferred to or shared with:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Hostinger - hosting of the public website and server infrastructure,</li>
          <li>FormSubmit - handling of form submissions,</li>
          <li>Anthropic - solely for the optional AI recommendation, limited to project answers,</li>
          <li>Google - delivery of Google Fonts,</li>
          <li>email service providers used by VANTAFRAME,</li>
          <li>IT, maintenance, and security providers, legal or accounting advisors, if needed,</li>
          <li>entities authorized under applicable law.</li>
        </ul>

        <p><strong>9. Data transfers outside the EEA</strong></p>
        <p>
          Some providers may process data in the United States or other countries outside the European Economic
          Area. Such transfers may only take place based on mechanisms provided for by the GDPR, such as an
          adequacy decision issued by the European Commission, standard contractual clauses, or other appropriate
          safeguards. Information about the safeguards applied can be obtained by writing to kontakt@vantaframe.pl.
        </p>

        <p><strong>10. Retention periods</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>data from forms and correspondence - up to 12 months after the contact ends, unless it leads to a contract,</li>
          <li>data related to a contract, offer, billing, or legal obligations - for the period required to fulfil them,</li>
          <li>data needed to establish, pursue, or defend claims - until the relevant limitation periods expire,</li>
          <li>data processed on the basis of consent - until consent is withdrawn, subject to data needed for other purposes,</li>
          <li>data in localStorage - until settings are changed, site data is cleared, or the entry is overwritten or deleted.</li>
        </ul>

        <p><strong>11. Your rights</strong></p>
        <p>Under the terms set out in the GDPR, you have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>access your data and receive a copy of it,</li>
          <li>rectify, erase, or restrict the processing of your data,</li>
          <li>data portability, where processing is carried out automatically on the basis of consent or a contract,</li>
          <li>object to processing based on Article 6(1)(f) GDPR,</li>
          <li>withdraw consent at any time, where processing is based on consent,</li>
          <li>lodge a complaint with the President of the Personal Data Protection Office (UODO).</li>
        </ul>
        <p>
          Requests can be sent to kontakt@vantaframe.pl or by post to the controller's address. To protect your
          data, the controller may ask for information needed to confirm the identity of the person making the
          request.
        </p>

        <p><strong>12. Is providing data mandatory?</strong></p>
        <p>
          Providing data is voluntary. However, required fields are necessary to submit the form, receive a reply,
          or prepare a preliminary project summary. Failing to provide the required data may make it impossible to
          handle your enquiry. Consent to the AI recommendation is voluntary and is not a condition for submitting
          your request.
        </p>

        <p><strong>13. Security and sensitive data</strong></p>
        <p>
          The controller applies technical and organizational measures appropriate to the risk. Please do not
          include information in the forms that is not needed to handle your enquiry, in particular data about
          health, opinions, beliefs, origin, biometric data, or information about criminal convictions and offences.
        </p>

        <p><strong>14. Changes to this policy</strong></p>
        <p>
          This policy may be updated if the way the site operates changes, the scope of data changes, providers
          change, or the law changes. If analytics or marketing tools are implemented in the future, they will
          require appropriate notice and, where the law requires it, the user's prior consent.
        </p>
  </>
);

const LegalModals = () => {
  const $isPrivacyOpen = useStore(isPrivacyOpen);
  const lang = useStore(currentLang, () => "pl");
  const isEn = lang === "en";

  return (
    <>
      <Modal
        isOpen={$isPrivacyOpen}
        onClose={() => togglePrivacy(false)}
        title={isEn ? "Privacy and Cookie Policy" : "Polityka prywatności i cookies"}
        closeAria={isEn ? "Close modal" : "Zamknij modal"}
        closeLabel={isEn ? "Close" : "Zamknij"}
      >
        {isEn ? <EnglishPrivacyContent /> : <PolishPrivacyContent />}
      </Modal>
    </>
  );
};

export default LegalModals;
