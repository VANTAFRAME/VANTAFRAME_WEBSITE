export default {
  pl: {
    seo: {
      title: "Automatyzacja procesów biznesowych w firmie | VANTAFRAME",
      description:
        "Automatyzujemy procesy w firmie: leady, oferty, zamówienia i synchronizację CRM/ERP w n8n i Make. AI tam, gdzie reguły nie wystarczą. Bezpłatna diagnoza.",
      ogTitle: "Automatyzacja procesów biznesowych w firmie",
    },
    hero: {
      eyebrow: "03 / AUTOMATYZACJA PROCESÓW",
      h1: ["AUTOMATYZACJA", "PROCESÓW", "BIZNESOWYCH."],
      lead: "Automatyzacja procesów biznesowych to wyzwalacze, przepływ danych między systemami i obsługa wyjątków. Zaczynamy od reguł, a AI dokładamy tylko tam, gdzie reguły nie wystarczają.",
      cta: "Umów bezpłatną rozmowę",
      visualCaption: "PRZEPŁYW AUTOMATYZACJI",
      visualA11y:
        "Diagram procesu: wyzwalacz uruchamia sprawdzenie warunków, następnie akcję w systemie. Gdy warunek nie jest spełniony albo wystąpi błąd, sprawa trafia do ścieżki wyjątku i do człowieka, a wynik jest zapisywany.",
      visualLabels: {
        "TRIGGER": "ZDARZENIE",
        "CONDITION": "WARUNEK",
        "ACTION": "DZIAŁANIE",
        "RESULT": "WYNIK",
        "NOTIFY": "ALERT",
        "DOC": "DOKUMENT",
        "ERR": "BŁĄD",
        "RETRY": "PONÓW",
        "QUEUE": "KOLEJKA",
        "OPTIONAL": "OPCJA",
        "AI OPTIONAL": "AI OPCJONALNIE",
        "IF": "JEŚLI",
        "EVENT": "WEJŚCIE",
        "FORM": "FORMULARZ",
        "CRON": "HARMONOGRAM",
        "MAIL": "E-MAIL"
},
    },
    valueStrip: {
      problem: "Ludzie przepisują dane, przekazują sprawy i pilnują statusów.",
      effect: "Proces startuje od zdarzenia, a ludzie dostają wyjątki i kroki do zatwierdzenia.",
      audience: "Właścicieli i managerów operacji.",
    },
    capabilities: {
      heading: ["CO", "AUTOMATYZUJEMY"],
      intro:
        "Automatyzujemy powtarzalną pracę między systemami i ludźmi: tam, gdzie ktoś dziś przepisuje, przekazuje, przypomina albo sprawdza.",
      triggers: {
        label: "URUCHOMIENIE",
        text: "Każdy proces zaczyna się od zdarzenia: formularza, zmiany statusu, wiadomości, zamówienia, webhooka (automatycznego powiadomienia z innego systemu) albo harmonogramu. Nikt nie musi pamiętać o uruchomieniu.",
        chips: ["FORMULARZ", "ZMIANA STATUSU", "WIADOMOŚĆ", "ZAMÓWIENIE", "WEBHOOK", "HARMONOGRAM"],
      },
      groups: [
        {
          tag: "PRZENOSIMY DANE",
          items: [
            {
              n: "01",
              tag: "PRZEPŁYW DANYCH",
              title: "Przepływ danych między systemami",
              from: ["FORMULARZ", "E-MAIL", "SKLEP"],
              to: ["CRM", "ERP"],
              desc: "Dane trafiają do właściwego systemu zamiast ręcznego kopiowania. Dopasowujemy pola jednego systemu do pól drugiego (np. „telefon” do „numer kontaktowy”), sprawdzamy poprawność i wychwytujemy duplikaty.",
              link: { slug: "integracje-ai", label: "Jak łączymy systemy" },
            },
            {
              n: "02",
              tag: "SYNCHRONIZACJA",
              title: "Synchronizacja CRM, ERP i narzędzi",
              from: ["CRM"],
              to: ["ERP", "NARZĘDZIA"],
              both: true,
              desc: "Dane klientów, zamówień i statusów są spójne we wszystkich systemach, a dla każdego pola ustalamy, który system jest wiarygodnym źródłem.",
            },
          ],
        },
        {
          tag: "PRZEKAZUJEMY SPRAWY",
          items: [
            {
              n: "03",
              tag: "LEADY",
              title: "Obsługa leadów",
              from: ["FORMULARZ"],
              to: ["CRM", "HANDLOWIEC"],
              desc: "Zapytanie trafia do CRM, jest przypisywane według reguł, a zespół dostaje powiadomienie z kontekstem. Klient dostaje potwierdzenie.",
            },
            {
              n: "04",
              tag: "POWIADOMIENIA",
              title: "Powiadomienia i przypomnienia",
              from: ["ZDARZENIE"],
              to: ["WŁAŚCIWA OSOBA"],
              desc: "Właściwa osoba dowiaduje się o zdarzeniu we właściwym kanale: w komunikatorze, mailu albo jako zadanie. Sprawy, które utknęły, wracają w przypomnieniu.",
            },
          ],
        },
        {
          tag: "PRZYGOTOWUJEMY DOKUMENTY",
          items: [
            {
              n: "05",
              tag: "OFERTY",
              title: "Generowanie ofert",
              from: ["CRM", "CENNIK"],
              to: ["DOKUMENT"],
              desc: "Oferta powstaje z danych w CRM i cennika według szablonu, jako dokument do przeglądu. Handlowiec zatwierdza, a system archiwizuje wersję.",
              link: { slug: "automatyzacja-dokumentow", label: "Praca z dokumentami" },
            },
          ],
        },
      ],
    },
    how: {
      heading: ["TEN SAM PROCES,", "DWA STANY"],
      intro:
        "Przykład koncepcyjny: zapytanie z formularza trafia do firmy. Poniżej ten sam proces, najpierw obsługiwany ręcznie, potem automatycznie. To ilustracja, nie opis wdrożenia klienta.",
      badge: "PRZYKŁAD KONCEPCYJNY",
      before: "PRZED AUTOMATYZACJĄ",
      after: "PO AUTOMATYZACJI",
      stageLabel: "ETAP",
      ai: "AI OPCJONALNIE",
      human: "CZŁOWIEK",
      optional: "WEDŁUG PROCESU",
      phases: [
        {
          label: "ZDARZENIE",
          tag: "ZDARZENIE",
          before: "Zapytanie trafia na skrzynkę mailową.",
          after: "Wysłanie formularza uruchamia proces.",
        },
        {
          label: "DANE",
          tag: "INTEGRACJA",
          before: "Pracownik przepisuje dane do CRM.",
          after: "System pobiera dane z formularza i sprawdza, czy kontakt już istnieje.",
        },
        {
          label: "REGUŁY",
          tag: "REGUŁY",
          before: "Sam sprawdza, czy dane są kompletne, i decyduje, komu przypisać sprawę.",
          after: "Reguły sprawdzają kompletność i wybierają opiekuna według regionu, branży i obłożenia.",
          ai: "Odczyt nieustrukturyzowanych danych, np. treści zapytania przysłanego mailem. Reguły biznesowe zostają jawne i przewidywalne.",
        },
        {
          label: "DZIAŁANIE",
          tag: "DZIAŁANIE",
          before: "Przekazuje sprawę dalej mailem lub wiadomością.",
          after: "System zakłada zadanie, powiadamia opiekuna i wysyła potwierdzenie klientowi.",
          human: {
            optional: true,
            text: "W zależności od procesu wybrane działania, np. wysyłkę oferty, może zatwierdzać człowiek.",
          },
        },
        {
          label: "WYJĄTKI",
          tag: "WYJĄTEK",
          before: "Braki i pomyłki wychodzą dopiero, gdy ktoś je zauważy.",
          after: "Niepełne dane i niepewne przypadki trafiają do kolejki wyjątków, do wskazanej osoby, z opisem przyczyny.",
          human: {
            text: "Wskazana osoba uzupełnia dane albo decyduje, co dalej.",
          },
        },
        {
          label: "WYNIK",
          tag: "LOGI",
          before: "Status aktualizuje ręcznie, jeśli o tym pamięta.",
          after: "Każde uruchomienie zapisuje, co weszło, co wykonano i jak się zakończyło.",
        },
      ],
      note: "Większość procesów da się zautomatyzować samymi regułami, bez żadnego modelu. AI dokładamy tylko w kroku, w którym reguły nie wystarczają, i nawet wtedy z kontrolą wyniku.",
    },
    useCases: {
      heading: ["ZASTOSOWANIA", "W FIRMIE"],
      badge: "SCENARIUSZE PRZYKŁADOWE",
      configNote:
        "Wyjątki i kroki zatwierdzenia to przykładowa konfiguracja procesu, nie uniwersalne działanie każdej automatyzacji.",
      detailsLabel: "Szczegóły",
      labels: {
        problem: "PROBLEM",
        flow: "PRZEBIEG",
        result: "REZULTAT",
        exception: "WYJĄTEK (PRZYKŁAD)",
        situation: "SYTUACJA",
        mechanism: "MECHANIZM",
      },
      items: [
        {
          n: "01",
          tag: "OBSŁUGA LEADÓW",
          title: "Kwalifikacja i przydział leadów",
          problemShort: "Zapytania wpadają z kilku źródeł, a część nie ma jasnego opiekuna.",
          flow: ["NOWY LEAD", "KWALIFIKACJA WEDŁUG REGUŁ", "PRZYDZIAŁ OPIEKUNA", "POWIADOMIENIE Z KONTEKSTEM"],
          exception: "Brak danych kontaktowych → kolejka do weryfikacji.",
          effect:
            "Każdy lead ma opiekuna od pierwszej chwili, a handlowiec dostaje zgłoszenie z kontekstem zamiast przepisywać dane.",
          problem:
            "Zapytania wpadają z kilku źródeł do skrzynki lub arkusza, ktoś ocenia je i przypisuje ręcznie, a część czeka dłużej niż powinna, bo nie wiadomo, kto się nimi zajmuje.",
          mechanism:
            "Nowy lead trafia do CRM, system sprawdza duplikaty, ocenia go według jawnych reguł (region, branża, rodzaj zapytania) i przypisuje opiekuna według obłożenia. Opiekun dostaje zadanie z kontekstem, a klient potwierdzenie. Leady bez danych kontaktowych trafiają do kolejki do weryfikacji.",
        },
        {
          n: "02",
          tag: "OFERTOWANIE",
          title: "Oferta z danych CRM",
          problemShort: "Oferty powstają z kopiowanych danych, więc zdarzają się różne wersje i literówki w cenach.",
          flow: ["ZMIANA STATUSU SZANSY", "DANE KLIENTA I CENNIK", "DOKUMENT Z SZABLONU", "AKCEPTACJA HANDLOWCA", "ARCHIWUM I WYSYŁKA"],
          exception: "Brak pozycji w cenniku → przekazanie do handlowca.",
          effect:
            "Oferty są spójne, mają jedną wersję źródłową, a ręczna praca ogranicza się do przeglądu.",
          problem:
            "Oferty powstają w edytorze tekstu z kopiowanych danych, więc zdarzają się różne wersje i literówki w cenach.",
          mechanism:
            "Po zmianie statusu szansy scenariusz pobiera dane klienta i pozycje, stosuje cennik, generuje dokument z szablonu i wysyła go handlowcowi do akceptacji. Zatwierdzona wersja trafia do archiwum i do klienta. Gdy pozycji brakuje w cenniku, sprawa wraca do handlowca.",
        },
        {
          n: "03",
          tag: "SYNCHRONIZACJA",
          title: "Zamówienia między sklepem a ERP",
          problemShort: "Zamówienia ze sklepu są wprowadzane do ERP ręcznie, a statusy wracają do klienta z opóźnieniem.",
          flow: ["ZAMÓWIENIE W SKLEPIE", "WALIDACJA DANYCH", "ZAPIS W ERP", "STATUS DO SKLEPU I KLIENTA"],
          exception: "Błędny adres lub brak towaru → lista wyjątków.",
          effect:
            "Zamówienia płyną bez ręcznego wprowadzania, a zespół widzi tylko to, co wymaga interwencji.",
          problem:
            "Zamówienia ze sklepu są ręcznie wprowadzane do ERP, a statusy realizacji wracają do klienta z opóźnieniem.",
          mechanism:
            "Scenariusz przenosi zamówienie do ERP z walidacją danych, a zmianę statusu wysyła z powrotem do sklepu i klienta. Zamówienia z błędnym adresem lub brakującym towarem trafiają na listę wyjątków.",
        },
        {
          n: "04",
          tag: "KADRY",
          title: "Onboarding nowej osoby",
          problemShort: "Przyjęcie pracownika wymaga wielu kroków w kilku działach, a łatwo je pominąć.",
          flow: ["WPIS W SYSTEMIE KADROWYM", "ZADANIA DLA IT, ADMINISTRACJI I PRZEŁOŻONEGO", "TERMINY I PRZYPOMNIENIA"],
          exception: "Niewykonany krok → eskalacja do osoby odpowiedzialnej.",
          effect:
            "Proces ma stałą, widoczną kolejność, a nic nie zależy od czyjejś pamięci.",
          problem:
            "Przyjęcie pracownika wymaga założenia kont, przekazania sprzętu i powiadomienia kilku działów, a kroki łatwo pominąć.",
          mechanism:
            "Wpis w systemie kadrowym uruchamia listę zadań dla IT, administracji i przełożonego z terminami oraz przypomnieniami. Niewykonane kroki eskalują do osoby odpowiedzialnej.",
        },
      ],
    },
    process: {
      heading: ["JAK WSPÓŁPRACUJEMY", "PRZY PROCESIE"],
      labels: { gets: "OTRZYMUJESZ", checks: "SPRAWDZAMY" },
      steps: [
        {
          n: "01",
          tag: "MAPOWANIE",
          title: "Mapa procesu takiego, jaki jest",
          gets: "Mapę kroków, osób, systemów i miejsc ręcznych przekazań, w których coś się powtarza albo gubi.",
          checks: "Czy mapa zgadza się z tym, jak proces naprawdę działa, razem z osobami, które go wykonują.",
        },
        {
          n: "02",
          tag: "PROJEKT",
          title: "Reguły, wyjątki i zakres",
          gets: "Opis wyzwalaczy, warunków, źródeł danych i ścieżek wyjątków oraz decyzję, które kroki zostają ręczne.",
          checks: "Czy każdy wyjątek ma właściciela i ścieżkę postępowania.",
        },
        {
          n: "03",
          tag: "BUDOWA",
          title: "Budowa scenariuszy",
          gets: "Działający scenariusz z udokumentowaną konfiguracją i połączeniami z systemami, zbudowany na narzędziu dobranym do zadania.",
          checks: "Czy scenariusz działa w każdej gałęzi, także wyjątkowych.",
        },
        {
          n: "04",
          tag: "TESTY",
          title: "Testy na realnych danych",
          gets: "Raport z testów na przykładowych i trudnych przypadkach.",
          checks: "Puste pola, duplikaty i niedostępne systemy oraz to, czy wyjątki trafiają do właściwych osób.",
        },
        {
          n: "05",
          tag: "URUCHOMIENIE",
          title: "Uruchomienie i utrzymanie",
          gets: "Uruchomiony proces z monitoringiem uruchomień i dokumentacją. Możemy też prowadzić dalszą opiekę albo przeszkolić Wasz zespół.",
          checks: "Tam, gdzie jest to uzasadnione, uruchamiamy proces równolegle z ręcznym i porównujemy wyniki, zanim go przełączymy. To jedna z możliwości, nie element każdego projektu.",
        },
      ],
    },
    faq: {
      heading: "PYTANIA O AUTOMATYZACJĘ",
      items: [
        {
          q: "Które procesy warto automatyzować i od którego zacząć?",
          a: "Warto automatyzować to, co jest powtarzalne, oparte na jasnych regułach i wykonywane często. Na początek najlepiej wybrać jeden proces z jednym właścicielem i dobrze znanymi krokami, bo wtedy łatwo ocenić, czy działa. Procesy rzadkie, bardzo zmienne albo oparte na osądzie lepiej zostawić ręcznie. W analizie oceniamy każdy osobno i mówimy wprost, co się nie opłaca.",
        },
        {
          q: "Czy do automatyzacji potrzebne jest AI?",
          a: "Najczęściej nie. Wyzwalacze, warunki, przepływ danych i synchronizacja działają na regułach i są bardziej przewidywalne niż model. AI ma sens w wąskich krokach, w których wejście jest nieustrukturyzowane, na przykład przy ocenie treści wiadomości, i nawet wtedy z kontrolą wyniku.",
        },
        {
          q: "Co się dzieje, gdy automatyzacja trafi na wyjątek lub błąd?",
          a: "Projektujemy to jawnie. Przypadek, którego scenariusz nie obsłuży, trafia do kolejki wyjątków z opisem przyczyny, a wskazana osoba dostaje powiadomienie. Gdy któryś system chwilowo nie działa, ponawianie zależy od rodzaju operacji: odczyt można powtórzyć bez ryzyka, a zapis albo wysyłkę tylko wtedy, gdy nie spowoduje to duplikatu. Scenariusze projektujemy tak, by zapobiegały przypadkowemu podwójnemu wykonaniu operacji, a gdy ponowienie jest ryzykowne albo się nie powiedzie, sprawa trafia do człowieka.",
        },
        {
          q: "Make, n8n czy kod na zamówienie, jak się decyduje?",
          a: "Zależy od złożoności, wolumenu, wymagań bezpieczeństwa i tego, kto będzie to utrzymywał. Gotowe platformy przyspieszają proste przepływy. Własny kod sprawdza się przy logice o dużym wolumenie i szczególnych wymaganiach. Dobieramy narzędzie do zadania i mówimy, dlaczego.",
        },
        {
          q: "Co po uruchomieniu, kto utrzymuje scenariusze?",
          a: "Systemy i reguły się zmieniają, więc scenariusze wymagają opieki: monitorowania uruchomień, aktualizacji po zmianie API i poprawek. Możemy ją prowadzić my albo przekazać dokumentację i przeszkolić Wasz zespół.",
        },
        {
          q: "Czy trzeba wymieniać obecne systemy?",
          a: "Zwykle nie. Scenariusze łączą się z narzędziami, których firma już używa, przez API, webhooki lub gotowe integracje. Jeśli jakiś system nie ma żadnego sposobu integracji, powiemy to w analizie i omówimy alternatywy, bez zakładania, że trzeba go wymienić.",
        },
        {
          q: "Czy pracownik może zatrzymać albo poprawić proces?",
          a: "Takie możliwości ustalamy na etapie projektowania. W zależności od procesu możemy przewidzieć wstrzymanie uruchomień, ręczne zatwierdzanie wybranych kroków oraz obsługę błędów przez wskazaną osobę.",
        },
      ],
    },
    manifesto: {
      lines: ["NIE AUTOMATYZUJEMY PROCESÓW, KTÓRYCH NIE ROZUMIEMY.", "NIE UKRYWAMY WYJĄTKÓW.", "NIE ZOSTAWIAMY CZŁOWIEKA BEZ KONTROLI."],
      final: ["AUTOMATYZUJEMY", "TO, CO", "POWTARZALNE."],
      steps: ["ZDARZENIE", "DANE", "REGUŁY", "DZIAŁANIE", "WYJĄTKI", "WYNIK"],
    },
    cta: {
      heading: ["MASZ PROCES, KTÓRY", "WARTO ZAUTOMATYZOWAĆ?"],
      sub: "Opisz jeden proces: co go uruchamia, kto go dziś wykonuje i w jakich systemach pracuje. Wskażemy, co zautomatyzować regułami, gdzie wystarczy integracja, a gdzie warto rozważyć AI. Pierwsza rozmowa i diagnoza są bezpłatne.",
      button: "Umów bezpłatną rozmowę",
    },
    related: {
      heading: "POWIĄZANE USŁUGI",
      items: [
        {
          slug: "integracje-ai",
          why: "Techniczna strona połączeń z CRM, ERP i API, na których działają scenariusze.",
        },
        {
          slug: "automatyzacja-dokumentow",
          why: "Gdy wejściem procesu są faktury, umowy lub formularze do odczytania.",
        },
      ],
    },
  },
  en: {
    seo: {
      title: "Business process automation for companies | VANTAFRAME",
      description:
        "We automate company processes: leads, quotes, orders and CRM/ERP synchronisation in n8n and Make. AI where rules are not enough. Free diagnosis.",
      ogTitle: "Business process automation for companies",
    },
    hero: {
      eyebrow: "03 / PROCESS AUTOMATION",
      h1: ["BUSINESS", "PROCESS", "AUTOMATION."],
      lead: "Business process automation means triggers, data flow between systems and exception handling. We start with rules and add AI only where rules are not enough.",
      cta: "Book a free call",
      visualCaption: "AUTOMATION FLOW",
      visualA11y:
        "Process diagram: a trigger starts a condition check, followed by an action in a system. When a condition is not met or an error occurs, the case goes to an exception path and to a person, and the result is logged.",
    },
    valueStrip: {
      problem: "People retype data, hand cases over and keep an eye on statuses.",
      effect: "The process starts from an event, and people receive the exceptions and the steps to approve.",
      audience: "Owners and operations managers.",
    },
    capabilities: {
      heading: ["WHAT WE", "AUTOMATE"],
      intro:
        "We automate repetitive work between systems and people: wherever someone today retypes, forwards, reminds or checks.",
      triggers: {
        label: "START",
        text: "Every process starts from an event: a form, a status change, a message, an order, a webhook (an automatic notification from another system) or a schedule. Nobody has to remember to start it.",
        chips: ["FORM", "STATUS CHANGE", "MESSAGE", "ORDER", "WEBHOOK", "SCHEDULE"],
      },
      groups: [
        {
          tag: "WE MOVE DATA",
          items: [
            {
              n: "01",
              tag: "DATA FLOW",
              title: "Data flow between systems",
              from: ["FORM", "EMAIL", "SHOP"],
              to: ["CRM", "ERP"],
              desc: "Data reaches the right system instead of being copied by hand. We match the fields of one system to those of another (e.g. “phone” to “contact number”), check correctness and catch duplicates.",
              link: { slug: "integracje-ai", label: "How we connect systems" },
            },
            {
              n: "02",
              tag: "SYNC",
              title: "CRM, ERP and tool synchronisation",
              from: ["CRM"],
              to: ["ERP", "TOOLS"],
              both: true,
              desc: "Customer, order and status data stay consistent across systems, and for each field we define which system is the reliable source.",
            },
          ],
        },
        {
          tag: "WE HAND OVER CASES",
          items: [
            {
              n: "03",
              tag: "LEADS",
              title: "Lead handling",
              from: ["FORM"],
              to: ["CRM", "SALESPERSON"],
              desc: "An enquiry lands in the CRM and is assigned by rules, and the team gets a notification with context. The customer gets a confirmation.",
            },
            {
              n: "04",
              tag: "NOTIFY",
              title: "Notifications and reminders",
              from: ["EVENT"],
              to: ["THE RIGHT PERSON"],
              desc: "The right person learns about an event in the right channel: a messenger, email or a task. Items that have stalled come back as reminders.",
            },
          ],
        },
        {
          tag: "WE PREPARE DOCUMENTS",
          items: [
            {
              n: "05",
              tag: "OFFERS",
              title: "Quote generation",
              from: ["CRM", "PRICE LIST"],
              to: ["DOCUMENT"],
              desc: "A quote is built from CRM data and the price list using a template, as a document for review. The salesperson approves, and the system archives the version.",
              link: { slug: "automatyzacja-dokumentow", label: "Working with documents" },
            },
          ],
        },
      ],
    },
    how: {
      heading: ["THE SAME PROCESS,", "TWO STATES"],
      intro:
        "A conceptual example: an enquiry from a form reaches the company. Below is the same process, first handled by hand, then automatically. It is an illustration, not a description of a client deployment.",
      badge: "CONCEPTUAL EXAMPLE",
      before: "BEFORE AUTOMATION",
      after: "AFTER AUTOMATION",
      stageLabel: "STAGE",
      ai: "AI OPTIONAL",
      human: "HUMAN",
      optional: "DEPENDS ON PROCESS",
      phases: [
        {
          label: "EVENT",
          tag: "TRIGGER",
          before: "The enquiry lands in a mailbox.",
          after: "Submitting the form starts the process.",
        },
        {
          label: "DATA",
          tag: "INTEGRATION",
          before: "An employee retypes the data into the CRM.",
          after: "The system fetches the data from the form and checks whether the contact already exists.",
        },
        {
          label: "RULES",
          tag: "RULES",
          before: "They check whether the data is complete and decide who gets the case.",
          after: "Rules check completeness and pick an owner by region, industry and workload.",
          ai: "Reading unstructured data, e.g. the text of an enquiry sent by email. The business rules stay explicit and predictable.",
        },
        {
          label: "ACTION",
          tag: "ACTION",
          before: "They pass the case on by email or message.",
          after: "The system creates a task, notifies the owner and sends the customer a confirmation.",
          human: {
            optional: true,
            text: "Depending on the process, selected actions, e.g. sending a quote, can be approved by a person.",
          },
        },
        {
          label: "EXCEPTIONS",
          tag: "EXCEPTION",
          before: "Gaps and mistakes surface only when someone notices them.",
          after: "Incomplete data and uncertain cases go to an exception queue, to a named person, with a description of the cause.",
          human: {
            text: "The named person completes the data or decides what happens next.",
          },
        },
        {
          label: "RESULT",
          tag: "LOG",
          before: "They update the status by hand, if they remember.",
          after: "Every run records what came in, what was done and how it ended.",
        },
      ],
      note: "Most processes can be automated with rules alone, without any model. We add AI only in the step where rules are not enough, and even then with a check on the result.",
    },
    useCases: {
      heading: ["USE CASES", "IN A COMPANY"],
      badge: "EXAMPLE SCENARIOS",
      configNote:
        "Exceptions and approval steps are an example process configuration, not what every automation does.",
      detailsLabel: "Details",
      labels: {
        problem: "PROBLEM",
        flow: "FLOW",
        result: "RESULT",
        exception: "EXCEPTION (EXAMPLE)",
        situation: "SITUATION",
        mechanism: "MECHANISM",
      },
      items: [
        {
          n: "01",
          tag: "LEAD OPS",
          title: "Qualifying and assigning leads",
          problemShort: "Enquiries arrive from several sources, and some have no clear owner.",
          flow: ["NEW LEAD", "QUALIFICATION BY RULES", "OWNER ASSIGNMENT", "NOTIFICATION WITH CONTEXT"],
          exception: "Missing contact details → queue for verification.",
          effect:
            "Every lead has an owner from the first moment, and the salesperson gets the enquiry with context instead of retyping data.",
          problem:
            "Enquiries arrive from several sources into a mailbox or spreadsheet, someone assesses and assigns them by hand, and some wait longer than they should because nobody knows who owns them.",
          mechanism:
            "A new lead goes into the CRM, the system checks for duplicates, assesses it against explicit rules (region, industry, type of enquiry) and assigns an owner by workload. The owner gets a task with context, and the customer a confirmation. Leads without contact details go to a queue for verification.",
        },
        {
          n: "02",
          tag: "OFFER OPS",
          title: "A quote from CRM data",
          problemShort: "Quotes are built from copied data, so different versions and typos in prices happen.",
          flow: ["OPPORTUNITY STATUS CHANGE", "CUSTOMER DATA AND PRICE LIST", "DOCUMENT FROM TEMPLATE", "SALESPERSON APPROVAL", "ARCHIVE AND SENDING"],
          exception: "Item missing from the price list → handed to the salesperson.",
          effect:
            "Quotes are consistent, have a single source version, and manual work is limited to review.",
          problem:
            "Quotes are written in a text editor from copied data, so different versions and typos in prices happen.",
          mechanism:
            "When an opportunity changes status, the scenario fetches customer data and line items, applies the price list, generates a document from a template and sends it to the salesperson for approval. The approved version goes to the archive and the customer. When an item is missing from the price list, the case goes back to the salesperson.",
        },
        {
          n: "03",
          tag: "SYNC",
          title: "Orders between shop and ERP",
          problemShort: "Shop orders are entered into the ERP by hand, and statuses reach the customer late.",
          flow: ["SHOP ORDER", "DATA VALIDATION", "ENTRY IN THE ERP", "STATUS TO SHOP AND CUSTOMER"],
          exception: "Wrong address or missing item → exception list.",
          effect:
            "Orders flow without manual entry, and the team sees only what needs intervention.",
          problem:
            "Shop orders are entered into the ERP by hand, and fulfilment statuses reach the customer late.",
          mechanism:
            "The scenario moves the order into the ERP with data validation and sends status changes back to the shop and the customer. Orders with a wrong address or a missing item go to an exception list.",
        },
        {
          n: "04",
          tag: "HR OPS",
          title: "Onboarding a new hire",
          problemShort: "Hiring someone takes many steps across several departments, and they are easy to miss.",
          flow: ["ENTRY IN THE HR SYSTEM", "TASKS FOR IT, ADMINISTRATION AND THE MANAGER", "DEADLINES AND REMINDERS"],
          exception: "Step left undone → escalation to the responsible person.",
          effect:
            "The process has a fixed, visible order, and nothing depends on someone's memory.",
          problem:
            "Hiring someone requires creating accounts, handing over equipment and notifying several departments, and steps are easy to miss.",
          mechanism:
            "An entry in the HR system starts a task list for IT, administration and the manager, with deadlines and reminders. Steps left undone escalate to the responsible person.",
        },
      ],
    },
    process: {
      heading: ["HOW WE WORK", "ON A PROCESS"],
      labels: { gets: "YOU RECEIVE", checks: "WE CHECK" },
      steps: [
        {
          n: "01",
          tag: "MAPPING",
          title: "The process map as it really is",
          gets: "A map of steps, people, systems and manual handovers, where things get repeated or lost.",
          checks: "Whether the map matches how the process really works, together with the people who perform it.",
        },
        {
          n: "02",
          tag: "DESIGN",
          title: "Rules, exceptions and scope",
          gets: "A description of triggers, conditions, data sources and exception paths, and a decision on which steps stay manual.",
          checks: "Whether every exception has an owner and a path to follow.",
        },
        {
          n: "03",
          tag: "BUILD",
          title: "Building scenarios",
          gets: "A working scenario with documented configuration and connections to your systems, built on a tool chosen for the job.",
          checks: "Whether the scenario works in every branch, including the exceptional ones.",
        },
        {
          n: "04",
          tag: "TESTING",
          title: "Testing on real data",
          gets: "A test report on typical and difficult cases.",
          checks: "Empty fields, duplicates and unavailable systems, and whether exceptions reach the right people.",
        },
        {
          n: "05",
          tag: "ROLLOUT",
          title: "Launch and maintenance",
          gets: "A running process with run monitoring and documentation. We can also provide ongoing care or train your team.",
          checks: "Where justified, we run the process in parallel with the manual one and compare results before switching over. It is one option, not part of every project.",
        },
      ],
    },
    faq: {
      heading: "QUESTIONS ABOUT AUTOMATION",
      items: [
        {
          q: "Which processes are worth automating, and where should we start?",
          a: "Automate what is repetitive, based on clear rules and done often. Best to start with one process that has a single owner and well-known steps, because then it is easy to judge whether it works. Leave manual the processes that are rare, highly variable or based on judgement. In the analysis we assess each one separately and say plainly what does not pay off.",
        },
        {
          q: "Does automation need AI?",
          a: "Most often it does not. Triggers, conditions, data flow and synchronisation run on rules and are more predictable than a model. AI makes sense in narrow steps where the input is unstructured, such as judging the content of a message, and even then with a check on the result.",
        },
        {
          q: "What happens when an automation hits an exception or an error?",
          a: "We design for it explicitly. A case the scenario cannot handle goes to an exception queue with a description of the cause, and a named person is notified. When a system is briefly down, retrying depends on the kind of operation: a read can be repeated without risk, while a write or a send only if it will not create a duplicate. We design scenarios to prevent an operation from accidentally running twice, and when a retry is risky or fails, the case goes to a person.",
        },
        {
          q: "Make, n8n or custom code: how do you decide?",
          a: "It depends on complexity, volume, security requirements and who will maintain it. Ready-made platforms speed up simple flows. Custom code works for high-volume logic and special requirements. We choose the tool for the job and explain why.",
        },
        {
          q: "What happens after launch, and who maintains the scenarios?",
          a: "Systems and rules change, so scenarios need care: monitoring runs, updating after API changes and fixes. We can provide it, or hand over documentation and train your team.",
        },
        {
          q: "Do we have to replace our current systems?",
          a: "Usually not. Scenarios connect to the tools the company already uses, through APIs, webhooks or ready-made integrations. If a system has no way of integrating at all, we will say so in the analysis and discuss alternatives, without assuming it must be replaced.",
        },
        {
          q: "Can an employee stop or correct a process?",
          a: "We set such options at the design stage. Depending on the process, we can provide for pausing runs, manual approval of selected steps and error handling by a named person.",
        },
      ],
    },
    manifesto: {
      lines: ["WE DO NOT AUTOMATE PROCESSES WE DO NOT UNDERSTAND.", "WE DO NOT HIDE EXCEPTIONS.", "WE DO NOT LEAVE PEOPLE WITHOUT CONTROL."],
      final: ["WE AUTOMATE", "WHAT IS", "REPEATABLE."],
      steps: ["EVENT", "DATA", "RULES", "ACTION", "EXCEPTIONS", "RESULT"],
    },
    cta: {
      heading: ["GOT A PROCESS WORTH", "AUTOMATING?"],
      sub: "Describe one process: what starts it, who does it today and which systems it runs in. We will point out what to automate with rules, where an integration is enough and where AI is worth considering. The first call and diagnosis are free.",
      button: "Book a free call",
    },
    related: {
      heading: "RELATED SERVICES",
      items: [
        {
          slug: "integracje-ai",
          why: "The technical side of connections to the CRM, ERP and APIs that scenarios run on.",
        },
        {
          slug: "automatyzacja-dokumentow",
          why: "When the process input is invoices, contracts or forms that need to be read.",
        },
      ],
    },
  },
};