export default {
  pl: {
    seo: {
      title: "Asystent AI dla firmy: wiedza i dokumentacja | VANTAFRAME",
      description:
        "Asystent AI odpowiada na pytania z wiedzy i dokumentacji firmy, pokazuje źródła i respektuje uprawnienia. Wspiera zespół. Pierwsza rozmowa bezpłatna.",
      ogTitle: "Asystent AI dla firmy: wiedza i dokumentacja",
      serviceType: "Asystent AI dla wiedzy firmowej",
    },
    hero: {
      eyebrow: "05 / ASYSTENCI AI",
      h1: ["ASYSTENT AI DLA", "FIRMY: ODPOWIEDZI", "Z TWOJEJ WIEDZY."],
      lead: "Asystent AI dla firmy odpowiada na pytania na podstawie Waszej dokumentacji i wiedzy, pokazuje źródła i respektuje uprawnienia. Odpowiada, ale nie wykonuje akcji: decyzje i działania zostają po stronie człowieka.",
      cta: "Umów bezpłatną rozmowę",
      visualCaption: "OBIEG PYTANIA I ODPOWIEDZI",
      visualA11y:
        "Diagram obiegu pytania: pytanie użytkownika, wyszukanie fragmentów w bazie wiedzy z kontrolą dostępu, zbudowanie kontekstu, odpowiedź oraz wskazanie źródeł, które użytkownik może sprawdzić.",
      visualLabels: {
        "USER": "UŻYTKOWNIK",
        "QUESTION": "PYTANIE",
        "CORPUS": "DOKUMENTY",
        "RETRIEVE": "WYSZUKANIE",
        "ACCESS": "UPRAWNIENIA",
        "CONTEXT": "KONTEKST",
        "EMPTY": "PUSTO",
        "CONTEXT ONLY": "TYLKO KONTEKST",
        "ANSWER": "ODPOWIEDŹ",
        "NO SOURCE FOUND": "BRAK ŹRÓDEŁ",
        "CHUNK": "FRAGMENT"
},
    },
    valueStrip: {
      problem: "Wiedza leży w wielu dokumentach, a ludzie tracą czas na szukanie.",
      effect: "Odpowiedź ze źródłami, a przy braku podstaw sygnał braku wiedzy.",
      audience: "Zespołów z dużą dokumentacją: obsługa, serwis, HR, zakupy.",
    },
    capabilities: {
      heading: ["CO BUDUJEMY", "W ASYSTENTACH"],
      intro:
        "Wiedza firmy jest rozproszona: w dokumentach, procedurach, instrukcjach i systemach. Pracownik traci czas na szukanie albo pyta kolegów o rzeczy, które są opisane, ale trudne do znalezienia. Asystent wiedzy firmowej pozwala wyszukiwać informacje w dokumentach firmowych i innych źródłach bez ręcznego przeszukiwania.",
      distinction: {
        before:
          "Asystent nie jest zwykłym chatbotem. Chatbot to przede wszystkim interfejs rozmowy, a to, co potrafi, zależy od jego integracji. Asystent opisany tu opiera się na wiedzy firmy: wyszukuje, przygotowuje odpowiedź lub roboczy opis i pokazuje źródła. To różne role, a nie kolejne poziomy tej samej technologii. Jeśli potrzebujecie bardziej samodzielnego wykonywania zadań w systemach, zobacz ",
        linkLabel: "agentów AI",
        slug: "agenci-ai",
        after: ".",
      },
      functions: [
        {
          tag: "WYSZUKIWANIE",
          word: "SZUKA",
          desc: "Znajduje fragmenty dokumentów i, zależnie od projektu, danych z różnych systemów, do których pracownik ma dostęp. Pytanie może brzmieć inaczej niż zapis.",
          link: { slug: "integracje-ai", label: "Jak łączymy systemy" },
        },
        {
          tag: "ODPOWIEDŹ",
          word: "ODPOWIADA",
          desc: "Przygotowuje odpowiedź albo roboczy opis lub podsumowanie na podstawie znalezionych fragmentów. Zakres zależy od projektu, a treść jest propozycją dla człowieka.",
        },
        {
          tag: "ŹRÓDŁA",
          word: "POKAZUJE ŹRÓDŁA",
          desc: "Dołącza odnośniki do dokumentów, żeby człowiek mógł sprawdzić treść w oryginale.",
        },
        {
          tag: "OGRANICZENIA",
          word: "SYGNALIZUJE BRAK WIEDZY",
          desc: "Gdy brakuje podstaw albo źródła są sprzeczne, ma to zasygnalizować zamiast zgadywać. Zachowanie projektujemy i testujemy, ale nie jest to gwarancja.",
        },
      ],
    },
    how: {
      under: {
        eyebrow: "SZCZEGÓŁY TECHNICZNE",
        heading: ["JAK TO DZIAŁA", "POD SPODEM"],
        lead: "Pięć kroków od pytania do odpowiedzi i krótkie wyjaśnienie wyszukiwania po dokumentach (RAG), dla osób, które chcą wiedzieć, co dzieje się za oknem odpowiedzi.",
        summary: "Jak to działa pod spodem",
      },
      heading: ["JAK DZIAŁA", "ASYSTENT"],
      intro:
        "Poniżej pytania pracownika w trzech możliwych wynikach: odpowiedź ze źródłami, sprzeczne źródła i brak danych. To ilustracja sposobu działania, a nie działający asystent.",
      demo: {
        windowLabel: "ASYSTENT / PRZYKŁAD KONCEPCYJNY",
        badge: "PRZYKŁAD KONCEPCYJNY",
        fictional: "Dokumenty, fragmenty i dane w przykładzie są fikcyjne.",
        tablistLabel: "Stan odpowiedzi asystenta",
        employee: "PRACOWNIK",
        questionLabel: "PYTANIE",
        answerLabel: "ODPOWIEDŹ ASYSTENTA",
        sourcesLabel: "ŹRÓDŁA",
        accessNote: "Tylko dokumenty dostępne dla tego konta",
        note: "Wskazanie źródła ułatwia sprawdzenie odpowiedzi, ale nie gwarantuje jej poprawności.",
        states: [
          {
            id: "answer",
            tab: "ODPOWIEDŹ ZE ŹRÓDŁAMI",
            status: "ODPOWIEDŹ Z ODNOŚNIKAMI",
            question: "Jak wygląda procedura reklamacji dla klienta B2B?",
            answer: [
              "Reklamację klienta B2B rejestruje dział obsługi klienta, a dział jakości ocenia zgłoszenie i wskazuje dalsze kroki. ",
              { ref: 1 },
              " Jeśli reklamacja zostanie uznana, rozlicza ją dział finansowy na podstawie decyzji działu jakości. ",
              { ref: 2 },
            ],
            sources: [
              {
                ref: 1,
                title: "Procedura reklamacji B2B",
                text: "Reklamację klienta B2B rejestruje dział obsługi klienta. Następnie dział jakości ocenia zgłoszenie i wskazuje dalsze kroki.",
              },
              {
                ref: 2,
                title: "Zasady rozliczania reklamacji",
                text: "Rozliczenie uznanej reklamacji wykonuje dział finansowy, na podstawie decyzji działu jakości.",
              },
            ],
          },
          {
            id: "conflict",
            tab: "SPRZECZNE ŹRÓDŁA",
            status: "WYMAGA WERYFIKACJI",
            question: "Kto decyduje o uznaniu reklamacji klienta B2B?",
            answer: [
              "W dokumentach są dwie różne zasady dotyczące tego, kto decyduje o uznaniu reklamacji B2B. ",
              { ref: 1 },
              " wskazuje dział jakości, a ",
              { ref: 2 },
              " dział obsługi klienta. Nie rozstrzygam, która obowiązuje. Sprawdź, który dokument jest aktualny, albo zapytaj jego właściciela.",
            ],
            sources: [
              {
                ref: 1,
                title: "Procedura reklamacji B2B",
                tag: "RÓŻNE ZAPISY",
                text: "Dział jakości ocenia zgłoszenie i decyduje o uznaniu reklamacji.",
              },
              {
                ref: 2,
                title: "Instrukcja obsługi klienta B2B",
                tag: "RÓŻNE ZAPISY",
                text: "Decyzję o uznaniu reklamacji podejmuje dział obsługi klienta.",
              },
            ],
          },
          {
            id: "nodata",
            tab: "BRAK DANYCH",
            status: "BRAK PODSTAW",
            question: "Jakie wyjątki od procedury reklamacji dotyczą klientów z zagranicy?",
            answer: [
              "W dostępnych dokumentach nie znalazłem informacji o wyjątkach dla klientów z zagranicy. Nie chcę zgadywać. Możesz zapytać właściciela procedury reklamacji albo sprawdzić, czy taki dokument istnieje poza zakresem moich źródeł.",
            ],
            sources: [],
            empty: "Nie znaleziono fragmentów pasujących do pytania.",
            searched: ["Procedura reklamacji B2B", "Zasady rozliczania reklamacji", "Instrukcja obsługi klienta B2B"],
            searchedLabel: "PRZESZUKANO, BEZ DOPASOWANIA",
          },
        ],
      },
      steps: [
        {
          label: "SKĄD",
          desc: "Informacje pochodzą z dokumentów i systemów, które wskażemy w projekcie. Zakres zależy od projektu i od tego, co firma chce udostępnić.",
        },
        {
          label: "WYSZUKIWANIE",
          desc: "System znajduje fragmenty pasujące do pytania, także gdy brzmi ono inaczej niż zapis, i bierze pod uwagę uprawnienia pytającego.",
        },
        {
          label: "ODPOWIEDŹ",
          desc: "Model przygotowuje odpowiedź lub roboczy opis na podstawie znalezionych fragmentów. Może się pomylić, dlatego projektujemy ograniczenia i testujemy odpowiedzi.",
        },
        {
          label: "ŹRÓDŁA",
          desc: "Do odpowiedzi dołączone są odnośniki do dokumentów, więc człowiek może sprawdzić treść w oryginale.",
        },
        {
          label: "BRAK DANYCH",
          desc: "Gdy podstaw brakuje albo źródła są sprzeczne, asystent ma to zasygnalizować zamiast zgadywać. Projektujemy to zachowanie i testujemy je na przykładach.",
        },
      ],
      rag: "Jedną z metod jest RAG, czyli generowanie odpowiedzi na podstawie wyszukanych fragmentów dokumentów. To nie jedyny sposób i nie każdy asystent go używa. Metodę dobieramy do źródeł i zadania.",
      behindLabel: "ZA ODPOWIEDZIĄ STOI TEŻ",
      behind: [
        {
          tag: "AKTUALNOŚĆ",
          title: "Aktualność wiedzy",
          desc: "Odpowiedź jest tak aktualna, jak źródło. Częstotliwość odświeżania zależy od źródła i sposobu synchronizacji, więc nie obiecujemy natychmiastowej aktualizacji wszystkich dokumentów. Ustalamy właściciela treści i zasady aktualizacji.",
        },
        {
          tag: "BŁĘDY MODELU",
          title: "Błędy modelu",
          desc: "Model może się pomylić mimo źródeł. Dlatego jest zgłaszanie błędnych odpowiedzi, przegląd zgłoszeń i testy na realnych pytaniach, a decyzje zostają po stronie człowieka.",
        },
        {
          tag: "UPRAWNIENIA",
          title: "Uprawnienia",
          desc: "Dostęp do dokumentów sprawdza warstwa wyszukiwania lub integracji, zanim treść trafi do modelu. Bezpieczeństwa nie opieramy na samym poleceniu dla modelu. Przy zmianach uprawnień w firmie sprawdzamy zasady ponownie.",
        },
      ],
    },
    useCases: {
      heading: ["ZASTOSOWANIA", "ASYSTENTA"],
      badge: "SCENARIUSZE PRZYKŁADOWE",
      detailsLabel: "Szczegóły",
      labels: {
        question: "PYTANIE PRACOWNIKA",
        sources: "ŹRÓDŁA",
        result: "PRZYKŁADOWY REZULTAT",
        verify: "SPOSÓB WERYFIKACJI",
        situation: "SYTUACJA",
        mechanism: "MECHANIZM",
      },
      items: [
        {
          n: "01",
          tag: "ONBOARDING",
          title: "Wdrożenie nowych pracowników",
          question: "Jak zgłosić nieobecność i kto ją zatwierdza?",
          sources: ["PROCEDURY KADROWE", "INSTRUKCJE"],
          result:
            "Odpowiedź w języku pytającego i wskazanie dokumentu, z którego pochodzi. Treści ograniczone do wybranych działów nie są dla nowej osoby dostępne.",
          verify: "Pracownik otwiera dokument źródłowy i sprawdza zapis.",
          problem:
            "Nowa osoba nie wie, gdzie szukać procedur, i pyta kolegów o rzeczy, które są opisane, ale trudne do znalezienia.",
          mechanism:
            "Asystent przeszukuje procedury i instrukcje, odpowiada na pytania własnymi słowami użytkownika i wskazuje dokument źródłowy. Treści ograniczone do wybranych działów są dla nich niedostępne.",
        },
        {
          n: "02",
          tag: "DOKUMENTACJA TECHNICZNA",
          title: "Dokumentacja techniczna i serwisowa",
          question: "Jak wygląda procedura wymiany tego podzespołu?",
          sources: ["INSTRUKCJE SERWISOWE", "DOKUMENTACJA TECHNICZNA"],
          result:
            "Właściwy fragment instrukcji dla opisanego problemu. Przy niejednoznacznym pytaniu asystent dopytuje o model lub wersję.",
          verify: "Technik porównuje odpowiedź z oryginałem instrukcji.",
          problem:
            "Technicy i serwisanci szukają w obszernych instrukcjach konkretnego parametru lub procedury, często w trakcie pracy.",
          mechanism:
            "Asystent wyszukuje właściwy fragment instrukcji po opisie problemu i podaje go ze wskazaniem dokumentu. Przy niejednoznacznym pytaniu dopytuje o model lub wersję.",
        },
        {
          n: "03",
          tag: "OBSŁUGA",
          title: "Wsparcie zespołu obsługi klienta",
          question: "Jakie warunki gwarancji obowiązują w tej kampanii?",
          sources: ["REGULAMINY", "WARUNKI GWARANCJI"],
          result:
            "Odpowiedź ze wskazaniem zapisu, z którego wynika. Konsultant sam decyduje, co powiedzieć klientowi.",
          verify: "Konsultant sprawdza zapis w regulaminie.",
          problem:
            "Konsultanci muszą pamiętać warunki gwarancji, regulaminy i wyjątki, a informacje zmieniają się między kampaniami.",
          mechanism:
            "Asystent odpowiada konsultantowi na pytania o zasady na podstawie dokumentów dostępnych w bazie i pokazuje, z którego zapisu wynika odpowiedź. Konsultant sam decyduje, co powiedzieć klientowi.",
        },
        {
          n: "04",
          tag: "ZGODNOŚĆ",
          title: "Polityki i wymagania wewnętrzne",
          question: "Kto musi zatwierdzić ten zakup według procedury zakupowej?",
          sources: ["POLITYKI WEWNĘTRZNE", "PROCEDURA ZAKUPOWA"],
          result:
            "Cytat z odpowiedniego fragmentu i wskazanie, do kogo kierować sprawy nietypowe. Gdy dokumenty nie obejmują pytania, asystent informuje o braku odpowiedzi.",
          verify: "Pracownik sprawdza zapis w polityce, a sprawy nietypowe kieruje do właściwej osoby.",
          problem:
            "Pracownicy nie są pewni, co mówi wewnętrzna polityka bezpieczeństwa albo procedura zakupowa, więc pytają dział prawny lub administrację.",
          mechanism:
            "Asystent cytuje właściwy fragment polityki i wskazuje, do kogo kierować pytania nietypowe. Pytania poza zakresem dokumentów kończą się informacją, że odpowiedzi nie ma w bazie.",
        },
      ],
    },
    process: {
      heading: ["JAK WSPÓŁPRACUJEMY", "PRZY ASYSTENCIE"],
      labels: { gets: "OTRZYMUJESZ", checks: "JAK SPRAWDZAMY JAKOŚĆ" },
      scopeNote: "Zakres etapów zależy od dostępnych źródeł wiedzy i potrzeb firmy.",
      steps: [
        {
          n: "01",
          tag: "ŹRÓDŁA",
          title: "Analiza źródeł wiedzy",
          gets: "Listę źródeł z oceną aktualności, właścicieli i sprzeczności.",
          checks: "Które dokumenty są wiarygodne i kto odpowiada za ich aktualizację. Zła lub nieaktualna dokumentacja daje złe odpowiedzi, więc zaczynamy od niej.",
        },
        {
          n: "02",
          tag: "DOSTĘP",
          title: "Uporządkowanie dostępu",
          gets: "Projekt wyszukiwania, model uprawnień i miejsce, w którym pracownicy zadają pytania.",
          checks: "Czy zakres dostępu odpowiada strukturze uprawnień w firmie.",
        },
        {
          n: "03",
          tag: "PROTOTYP",
          title: "Prototyp na ograniczonym zbiorze",
          gets: "Działający prototyp na wybranych dokumentach i dla wybranej grupy.",
          checks: "Czy odpowiedzi mają źródła i czy asystent sygnalizuje brak wiedzy.",
        },
        {
          n: "04",
          tag: "OCENA",
          title: "Testy na rzeczywistych pytaniach",
          gets: "Wyniki oceny odpowiedzi i listę poprawek.",
          checks: "Z osobami znającymi temat oceniamy trafność odpowiedzi i zachowanie przy braku danych. Testujemy też kontrolę dostępu.",
        },
        {
          n: "05",
          tag: "URUCHOMIENIE",
          title: "Uruchomienie i zasady aktualizacji wiedzy",
          gets: "Asystenta w wybranej grupie oraz zasady aktualizacji wiedzy i zgłaszania błędnych odpowiedzi.",
          checks: "Zbieramy opinie i słabe odpowiedzi. Zakres rozszerzamy, gdy wyniki są dobre.",
        },
      ],
    },
    faq: {
      heading: "PYTANIA O ASYSTENTÓW AI",
      items: [
        {
          q: "Czym asystent AI różni się od agenta?",
          a: "Asystent wspiera człowieka: wyszukuje, wyjaśnia, podsumowuje i przygotowuje robocze treści, które człowiek ocenia. Agent wykonuje zadania w systemach, na przykład zakłada zadania albo zmienia rekordy, więc potrzebuje uprawnień i zatwierdzeń. To różne role, a nie kolejne poziomy tej samej technologii. Wiele firm zaczyna od asystenta, bo ryzyko jest mniejsze. Agenta dobieramy wtedy, gdy rzeczywiście potrzebne jest wykonywanie zadań.",
        },
        {
          q: "Z jakich źródeł korzysta asystent i czy podaje je w odpowiedzi?",
          a: "Z dokumentów i systemów, które wskażemy w projekcie. Najpierw wyszukuje fragmenty pasujące do pytania i na nich opiera odpowiedź, zamiast polegać wyłącznie na pamięci modelu. Do odpowiedzi dołączamy odnośniki do źródeł, żeby człowiek mógł ją sprawdzić. Gdy brakuje podstaw, asystent ma to zasygnalizować. Projektujemy to zachowanie i testujemy je, ale nie gwarantujemy, że model nigdy się nie pomyli.",
        },
        {
          q: "Czy każdy pracownik zobaczy te same informacje?",
          a: "Nie powinien. Dostęp do dokumentów sprawdza warstwa wyszukiwania lub integracji, zanim treść trafi do modelu, zgodnie z uprawnieniami osoby pytającej. Nie opieramy tego na samym poleceniu dla modelu. Zasady testujemy przed uruchomieniem i przy zmianie struktury uprawnień.",
        },
        {
          q: "Co z odpowiedziami błędnymi lub nieaktualnymi?",
          a: "Zdarzają się, więc projektujemy sposoby ich wychwytywania: wskazanie źródeł, przycisk zgłoszenia błędnej odpowiedzi i przegląd takich zgłoszeń. Błędy często wynikają z nieaktualnej lub sprzecznej dokumentacji, więc ustalamy właściciela treści i proces aktualizacji.",
        },
        {
          q: "Czy dane firmowe trafiają do uczenia modelu?",
          a: "To zależy od wybranego dostawcy i konfiguracji, więc nie odpowiemy jednym zdaniem dla wszystkich przypadków. Przed budową ustalamy, jakie dane trafiają do modelu, gdzie są przetwarzane i jakie warunki obowiązują u dostawcy. Podpisujemy umowę powierzenia, a gdy wymagają tego Wasze zasady, konfigurujemy przetwarzanie w UE. Asystent ma dostęp tylko do tego, czego potrzebuje do zadania. Wymagania omawiamy przed wyborem rozwiązania.",
        },
        {
          q: "Jak aktualizuje się wiedzę asystenta?",
          a: "To zależy od źródła i sposobu synchronizacji: zawartość można odświeżać cyklicznie albo po zmianie dokumentów. Ustalamy właściciela treści i sposób zgłaszania nieaktualnych zapisów. Aktualizacja nie zawsze jest natychmiastowa, więc w projekcie opisujemy, po jakim czasie zmiana dokumentu trafia do odpowiedzi.",
        },
        {
          q: "Czy asystent może działać w narzędziu, z którego już korzystamy?",
          a: "Zwykle tak, jeśli to narzędzie pozwala na integrację. Miejsce, w którym pracownicy zadają pytania, ustalamy w projekcie, na przykład komunikator, intranet albo aplikacja wewnętrzna. Nie zakładamy z góry, że każda platforma jest obsługiwana, i oceniamy to w analizie.",
        },
      ],
    },
    manifesto: {
      lines: ["NIE UDAJEMY, ŻE ASYSTENT WIE WSZYSTKO.", "NIE POKAZUJEMY DOKUMENTÓW KAŻDEMU.", "NIE UKRYWAMY, SKĄD JEST ODPOWIEDŹ."],
      final: ["ODPOWIEDŹ,", "KTÓRĄ MOŻNA", "SPRAWDZIĆ."],
      steps: ["PYTANIE", "WYSZUKIWANIE", "ODPOWIEDŹ", "ŹRÓDŁA", "SPRAWDZENIE"],
    },
    cta: {
      heading: ["CHCESZ, ŻEBY ZESPÓŁ", "SZYBCIEJ ZNAJDOWAŁ ODPOWIEDZI?"],
      sub: "Opisz, gdzie dziś przechowywana jest wiedza, kto ma z niej korzystać i jakie pytania powtarzają się w firmie. Ocenimy, czy asystent ma tu sens, i jak ograniczyć ryzyko błędnych odpowiedzi. Pierwsza rozmowa i diagnoza są bezpłatne.",
      button: "Umów bezpłatną rozmowę",
    },
    related: {
      heading: "POWIĄZANE USŁUGI",
      items: [
        {
          slug: "agenci-ai",
          why: "Gdy system ma nie tylko odpowiadać, lecz także wykonywać zadania w narzędziach firmy.",
        },
        {
          slug: "integracje-ai",
          why: "Gdy wiedza jest rozproszona w wielu systemach, a asystent ma z nich korzystać.",
        },
        {
          slug: "automatyzacja-dokumentow",
          why: "Gdy dokumenty trzeba przetwarzać transakcyjnie: faktury, umowy i formularze.",
        },
      ],
    },
  },
  en: {
    seo: {
      title: "AI assistant for business: knowledge and docs | VANTAFRAME",
      description:
        "An AI assistant answers questions from company knowledge and documentation, shows sources and respects permissions. It supports the team, it does not act for it. Free call.",
      ogTitle: "AI assistant for business: knowledge and documentation",
      serviceType: "AI assistant for company knowledge",
    },
    hero: {
      eyebrow: "05 / AI ASSISTANTS",
      h1: ["AN AI ASSISTANT", "FOR YOUR COMPANY:", "YOUR OWN ANSWERS."],
      lead: "An AI assistant for your company answers questions based on your documentation and knowledge, shows its sources and respects permissions. It answers but does not take actions: decisions and actions stay with people.",
      cta: "Book a free call",
      visualCaption: "QUESTION AND ANSWER FLOW",
      visualA11y:
        "Diagram of a question flow: the user's question, retrieval of passages from the knowledge base with access control, building context, an answer and the sources the user can check.",
    },
    valueStrip: {
      problem: "Knowledge sits in many documents and people lose time searching.",
      effect: "An answer with sources, and a signal that knowledge is missing when there is no basis.",
      audience: "Teams with a lot of documentation: support, service, HR, purchasing.",
    },
    capabilities: {
      heading: ["WHAT WE BUILD", "INTO ASSISTANTS"],
      intro:
        "A company's knowledge is scattered across documents, procedures, instructions and systems. People lose time searching, or ask colleagues about things that are written down but hard to find. A company knowledge assistant lets them look up information in company documents and other sources without searching by hand.",
      distinction: {
        before:
          "An assistant is not just a chatbot. A chatbot is first of all a conversation interface, and what it can do depends on its integrations. The assistant described here is built on the company's knowledge: it searches, prepares an answer or a working draft and shows its sources. These are different roles, not successive levels of the same technology. If you need more independent task execution in your systems, see ",
        linkLabel: "AI agents",
        slug: "agenci-ai",
        after: ".",
      },
      functions: [
        {
          tag: "SEARCH",
          word: "SEARCHES",
          desc: "Finds passages of documents and, depending on the project, data from different systems that the employee has access to. The question can be worded differently from the text.",
          link: { slug: "integracje-ai", label: "How we connect systems" },
        },
        {
          tag: "ANSWER",
          word: "ANSWERS",
          desc: "Prepares an answer or a working description or summary from the passages it found. The scope depends on the project, and the content is a proposal for a person.",
        },
        {
          tag: "SOURCES",
          word: "SHOWS SOURCES",
          desc: "Attaches links to documents so a person can check the content in the original.",
        },
        {
          tag: "LIMITS",
          word: "SIGNALS A LACK OF KNOWLEDGE",
          desc: "When there is no basis or sources contradict each other, it is meant to say so instead of guessing. We design and test this behaviour, but it is not a guarantee.",
        },
      ],
    },
    how: {
      under: {
        eyebrow: "TECHNICAL DETAILS",
        heading: ["HOW IT WORKS", "UNDER THE HOOD"],
        lead: "Five steps from question to answer and a short explanation of document retrieval (RAG), for those who want to know what happens behind the answer window.",
        summary: "How it works under the hood",
      },
      heading: ["HOW AN", "ASSISTANT WORKS"],
      intro:
        "Below are an employee's questions in three possible outcomes: an answer with sources, contradicting sources and no data. It is an illustration of how it works, not a working assistant.",
      demo: {
        windowLabel: "ASSISTANT / CONCEPTUAL EXAMPLE",
        badge: "CONCEPTUAL EXAMPLE",
        fictional: "The documents, passages and data in the example are fictional.",
        tablistLabel: "State of the assistant's answer",
        employee: "EMPLOYEE",
        questionLabel: "QUESTION",
        answerLabel: "ASSISTANT'S ANSWER",
        sourcesLabel: "SOURCES",
        accessNote: "Only documents available to this account",
        note: "Citing a source makes an answer easier to check, but does not guarantee it is correct.",
        states: [
          {
            id: "answer",
            tab: "ANSWER WITH SOURCES",
            status: "ANSWER WITH REFERENCES",
            question: "What is the complaint procedure for a B2B customer?",
            answer: [
              "A B2B customer's complaint is registered by customer service, and the quality department assesses it and indicates the next steps. ",
              { ref: 1 },
              " If the complaint is accepted, the finance department settles it based on the quality department's decision. ",
              { ref: 2 },
            ],
            sources: [
              {
                ref: 1,
                title: "B2B complaints procedure",
                text: "A B2B customer's complaint is registered by customer service. Then the quality department assesses it and indicates the next steps.",
              },
              {
                ref: 2,
                title: "Complaint settlement rules",
                text: "An accepted complaint is settled by the finance department, based on the quality department's decision.",
              },
            ],
          },
          {
            id: "conflict",
            tab: "CONTRADICTING SOURCES",
            status: "NEEDS VERIFICATION",
            question: "Who decides whether a B2B customer's complaint is accepted?",
            answer: [
              "The documents contain two different rules on who decides whether a B2B complaint is accepted. ",
              { ref: 1 },
              " names the quality department, and ",
              { ref: 2 },
              " names customer service. I am not deciding which one applies. Check which document is current, or ask its owner.",
            ],
            sources: [
              {
                ref: 1,
                title: "B2B complaints procedure",
                tag: "DIFFERENT WORDING",
                text: "The quality department assesses the report and decides whether the complaint is accepted.",
              },
              {
                ref: 2,
                title: "B2B customer service manual",
                tag: "DIFFERENT WORDING",
                text: "The decision to accept a complaint is made by customer service.",
              },
            ],
          },
          {
            id: "nodata",
            tab: "NO DATA",
            status: "NO BASIS",
            question: "What exceptions to the complaint procedure apply to customers from abroad?",
            answer: [
              "I did not find information about exceptions for customers from abroad in the documents available to me. I do not want to guess. You can ask the owner of the complaints procedure, or check whether such a document exists outside the scope of my sources.",
            ],
            sources: [],
            empty: "No passages matching the question were found.",
            searched: ["B2B complaints procedure", "Complaint settlement rules", "B2B customer service manual"],
            searchedLabel: "SEARCHED, NO MATCH",
          },
        ],
      },
      steps: [
        {
          label: "WHERE FROM",
          desc: "Information comes from the documents and systems we agree in the project. The scope depends on the project and on what the company chooses to make available.",
        },
        {
          label: "SEARCH",
          desc: "The system finds passages that match the question, even when it is worded differently from the text, and takes the asker's permissions into account.",
        },
        {
          label: "ANSWER",
          desc: "The model prepares an answer or a working description from the passages found. It can be wrong, so we design limits and test the answers.",
        },
        {
          label: "SOURCES",
          desc: "Links to the documents are attached to the answer, so a person can check the content in the original.",
        },
        {
          label: "NO DATA",
          desc: "When the basis is missing or sources contradict each other, the assistant is meant to say so instead of guessing. We design this behaviour and test it on examples.",
        },
      ],
      rag: "One method is RAG: generating an answer from retrieved passages of documents. It is not the only way and not every assistant uses it. We choose the method to fit the sources and the task.",
      behindLabel: "BEHIND AN ANSWER THERE IS ALSO",
      behind: [
        {
          tag: "FRESHNESS",
          title: "Freshness of knowledge",
          desc: "An answer is only as current as its source. How often content is refreshed depends on the source and how it is synchronised, so we do not promise instant updating of all documents. We establish a content owner and update rules.",
        },
        {
          tag: "MODEL ERRORS",
          title: "Model errors",
          desc: "A model can be wrong even with sources. That is why there is reporting of wrong answers, a review of the reports and tests on real questions, and decisions stay with people.",
        },
        {
          tag: "PERMISSIONS",
          title: "Permissions",
          desc: "Access to documents is checked by the retrieval or integration layer before content reaches the model. We do not base security on an instruction to the model alone. When permissions change in the company, we check the rules again.",
        },
      ],
    },
    useCases: {
      heading: ["ASSISTANT", "USE CASES"],
      badge: "EXAMPLE SCENARIOS",
      detailsLabel: "Details",
      labels: {
        question: "EMPLOYEE'S QUESTION",
        sources: "SOURCES",
        result: "EXAMPLE RESULT",
        verify: "HOW TO VERIFY",
        situation: "SITUATION",
        mechanism: "MECHANISM",
      },
      items: [
        {
          n: "01",
          tag: "ONBOARDING",
          title: "Onboarding new employees",
          question: "How do I report an absence, and who approves it?",
          sources: ["HR PROCEDURES", "INSTRUCTIONS"],
          result:
            "An answer in the asker's own words and a pointer to the document it comes from. Content restricted to selected departments is not available to the new person.",
          verify: "The employee opens the source document and checks the wording.",
          problem:
            "A new person does not know where to look for procedures, and asks colleagues about things that are written down but hard to find.",
          mechanism:
            "The assistant searches procedures and instructions, answers questions in the user's own words and points to the source document. Content restricted to selected departments is unavailable to them.",
        },
        {
          n: "02",
          tag: "TECH DOCS",
          title: "Technical and service documentation",
          question: "What is the procedure for replacing this component?",
          sources: ["SERVICE MANUALS", "TECHNICAL DOCUMENTATION"],
          result:
            "The relevant passage of the manual for the problem described. For an ambiguous question the assistant asks about the model or version.",
          verify: "The technician compares the answer with the original manual.",
          problem:
            "Technicians and service staff look through extensive manuals for a specific parameter or procedure, often while working.",
          mechanism:
            "The assistant retrieves the relevant passage of the manual from a description of the problem and gives it with the document it comes from. For an ambiguous question it asks about the model or version.",
        },
        {
          n: "03",
          tag: "SUPPORT",
          title: "Supporting the customer service team",
          question: "What warranty terms apply in this campaign?",
          sources: ["TERMS AND CONDITIONS", "WARRANTY TERMS"],
          result:
            "An answer pointing to the wording it follows from. The agent decides what to tell the customer.",
          verify: "The agent checks the wording in the terms.",
          problem:
            "Agents have to remember warranty terms, regulations and exceptions, and the information changes between campaigns.",
          mechanism:
            "The assistant answers the agent's questions about the rules from the documents available in the knowledge base and shows which wording the answer follows from. The agent decides what to tell the customer.",
        },
        {
          n: "04",
          tag: "COMPLIANCE",
          title: "Internal policies and requirements",
          question: "Who has to approve this purchase under the procurement procedure?",
          sources: ["INTERNAL POLICIES", "PROCUREMENT PROCEDURE"],
          result:
            "A quote from the relevant passage and a pointer to whom to send unusual cases. When the documents do not cover the question, the assistant says there is no answer.",
          verify: "The employee checks the wording in the policy and sends unusual cases to the right person.",
          problem:
            "Employees are not sure what the internal security policy or procurement procedure says, so they ask the legal or administration department.",
          mechanism:
            "The assistant quotes the relevant passage of the policy and points to whom to send unusual questions. Questions outside the scope of the documents end with a statement that the answer is not in the knowledge base.",
        },
      ],
    },
    process: {
      heading: ["HOW WE WORK", "ON AN ASSISTANT"],
      labels: { gets: "YOU RECEIVE", checks: "HOW WE CHECK QUALITY" },
      scopeNote: "The scope of the stages depends on the available knowledge sources and the company's needs.",
      steps: [
        {
          n: "01",
          tag: "SOURCES",
          title: "Analysing knowledge sources",
          gets: "A list of sources with an assessment of freshness, owners and contradictions.",
          checks: "Which documents are reliable and who is responsible for updating them. Poor or outdated documentation gives poor answers, so we start with it.",
        },
        {
          n: "02",
          tag: "ACCESS",
          title: "Organising access",
          gets: "A design of search, the permission model and the place where employees ask questions.",
          checks: "Whether the scope of access matches the permission structure in the company.",
        },
        {
          n: "03",
          tag: "PROTOTYPE",
          title: "A prototype on a limited set",
          gets: "A working prototype on selected documents and for a selected group.",
          checks: "Whether answers have sources and whether the assistant signals a lack of knowledge.",
        },
        {
          n: "04",
          tag: "EVALUATION",
          title: "Testing on real questions",
          gets: "Results of assessing answers and a list of fixes.",
          checks: "With people who know the subject we assess how accurate answers are and how the assistant behaves when data is missing. We also test access control.",
        },
        {
          n: "05",
          tag: "ROLLOUT",
          title: "Launch and knowledge update rules",
          gets: "The assistant for a selected group, plus rules for updating knowledge and reporting wrong answers.",
          checks: "We collect feedback and weak answers. We widen the scope when results are good.",
        },
      ],
    },
    faq: {
      heading: "QUESTIONS ABOUT AI ASSISTANTS",
      items: [
        {
          q: "How is an AI assistant different from an agent?",
          a: "An assistant supports a person: it searches, explains, summarises and prepares working content that a person reviews. An agent carries out tasks in systems, for example creating tasks or changing records, so it needs permissions and approvals. These are different roles, not successive levels of the same technology. Many companies start with an assistant because the risk is lower. We choose an agent when carrying out tasks is genuinely needed.",
        },
        {
          q: "What sources does the assistant use, and does it cite them in the answer?",
          a: "The documents and systems we agree in the project. It first retrieves passages that match the question and bases the answer on them, instead of relying on the model's memory alone. We attach links to the sources so a person can check the answer. When there is no basis, the assistant is meant to say so. We design and test this behaviour, but we do not guarantee that a model will never be wrong.",
        },
        {
          q: "Will every employee see the same information?",
          a: "They should not. Access to documents is checked by the retrieval or integration layer before content reaches the model, according to the asker's permissions. We do not rely on an instruction to the model alone. We test the rules before launch and whenever the permission structure changes.",
        },
        {
          q: "What about wrong or outdated answers?",
          a: "They happen, so we design ways to catch them: cited sources, a button to report a wrong answer and a review of those reports. Errors often come from outdated or contradictory documentation, so we establish a content owner and an update process.",
        },
        {
          q: "Does company data go into training the model?",
          a: "It depends on the chosen provider and configuration, so one sentence cannot cover every case. Before building we establish what data reaches the model, where it is processed and what terms apply at the provider. We sign a data processing agreement and, where your rules require it, configure processing in the EU. The assistant has access only to what it needs for the task. We discuss the requirements before choosing a solution.",
        },
        {
          q: "How is the assistant's knowledge updated?",
          a: "It depends on the source and how it is synchronised: content can be refreshed periodically or after documents change. We establish a content owner and a way to report outdated entries. Updating is not always instant, so in the project we describe how long it takes for a change in a document to reach the answers.",
        },
        {
          q: "Can the assistant work in a tool we already use?",
          a: "Usually yes, if that tool allows integration. We agree the place where employees ask questions in the project, for example a messenger, an intranet or an internal application. We do not assume in advance that every platform is supported, and we assess it in the analysis.",
        },
      ],
    },
    manifesto: {
      lines: ["WE DO NOT PRETEND AN ASSISTANT KNOWS EVERYTHING.", "WE DO NOT SHOW DOCUMENTS TO EVERYONE.", "WE DO NOT HIDE WHERE AN ANSWER COMES FROM."],
      final: ["AN ANSWER", "YOU CAN", "CHECK."],
      steps: ["QUESTION", "SEARCH", "ANSWER", "SOURCES", "CHECK"],
    },
    cta: {
      heading: ["WANT YOUR TEAM TO", "FIND ANSWERS FASTER?"],
      sub: "Describe where knowledge is stored today, who should use it and which questions keep coming up in the company. We will assess whether an assistant makes sense here and how to limit the risk of wrong answers. The first call and diagnosis are free.",
      button: "Book a free call",
    },
    related: {
      heading: "RELATED SERVICES",
      items: [
        {
          slug: "agenci-ai",
          why: "When the system should not only answer but also carry out tasks in company tools.",
        },
        {
          slug: "integracje-ai",
          why: "When knowledge is scattered across many systems and the assistant should draw on them.",
        },
        {
          slug: "automatyzacja-dokumentow",
          why: "When documents need transactional processing: invoices, contracts and forms.",
        },
      ],
    },
  },
};