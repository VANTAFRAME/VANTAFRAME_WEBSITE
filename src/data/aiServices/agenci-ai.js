export default {
  pl: {
    seo: {
      title: "Agenci AI dla firm: systemy wykonujące zadania | VANTAFRAME",
      description:
        "Agenci AI dla firm: wieloetapowe zadania na Waszych systemach, w granicach uprawnień, z zatwierdzaniem przez człowieka i logami. Pierwsza rozmowa bezpłatna.",
      ogTitle: "Agenci AI dla firm: zadania pod kontrolą",
    },
    hero: {
      eyebrow: "02 / AGENCI AI",
      h1: ["AGENCI AI DLA", "FIRM. ZADANIA", "POD KONTROLĄ."],
      lead: "Agent AI to system, który rozkłada zadanie na kroki, wywołuje API i narzędzia firmy, a wynik sprawdza, zanim cokolwiek zostanie zapisane. Działa w granicach uprawnień, a decyzje o większych skutkach zatwierdza człowiek.",
      cta: "Umów bezpłatną rozmowę",
      visualCaption: "PĘTLA WYKONANIA AGENTA",
      visualA11y:
        "Diagram pętli agenta: zadanie, plan, wywołanie narzędzia, weryfikacja, zatwierdzenie przez człowieka i wynik. Przy nieudanej weryfikacji agent wraca do planu albo przekazuje sprawę człowiekowi.",
      visualLabels: {
        "AGENT LOOP": "PĘTLA AGENTA",
        "ACT": "AKCJA",
        "OBSERVE": "ODCZYT",
        "VERIFY": "TEST",
        "DENY": "ODMOWA",
        "RETRY": "PONÓW",
        "HUMAN": "OSOBA",
        "FAIL": "BŁĄD",
        "RESULT": "WYNIK",
        "DONE": "GOTOWE",
        "RUN": "START",
        "HOLD": "CZEKA",
        "ALLOW": "ZEZWOLONO",
        "PERMISSIONS": "DOSTĘP",
        "TASK": "ZADANIE",
        "LOOP": "PĘTLA",
        "TOOLS": "NARZĘDZIA",
        "LOG": "LOGI",
        "DB": "BAZA",
        "MAIL": "E-MAIL"
},
    },
    definition: {
      eyebrow: "CZYM JEST AGENT AI",
      heading: ["CZYM JEST", "AGENT AI"],
      intro:
        "Cztery rozwiązania, które łatwo pomylić. To nie kolejne poziomy tej samej technologii, tylko różne sposoby działania systemu.",
      here: "TA STRONA",
      linkLabel: "Zobacz usługę",
      items: [
        {
          tag: "REGUŁY",
          title: "Automatyzacja",
          desc: "Wykonuje wcześniej zdefiniowany proces.",
          slug: "automatyzacja-procesow",
        },
        {
          tag: "ROZMOWA",
          title: "Chatbot",
          desc: "Obsługuje interakcję konwersacyjną. Jego możliwości zależą od integracji.",
        },
        {
          tag: "OBSŁUGA",
          title: "Asystent AI",
          desc: "Pomaga użytkownikowi analizować informacje i wykonywać zadania, zwykle pod jego kierunkiem.",
          slug: "asystenci-ai",
        },
        {
          tag: "CEL",
          title: "Agent AI",
          desc: "Realizuje powierzony cel, dobierając kolejne kroki i korzystając z dostępnych narzędzi w określonych granicach.",
          current: true,
        },
      ],
      closing:
        "Nie każde zadanie potrzebuje agenta. Dobieramy sposób działania systemu do procesu, ryzyka i oczekiwanego poziomu samodzielności.",
    },
    how: {
      detailsLabel: "Opis sześciu kroków",
      heading: ["JAK DZIAŁA", "AGENT AI"],
      intro:
        "Agent pracuje w pętli, a nie jednym strzałem. Po każdym kroku wynik jest sprawdzany, a operacje, które według konfiguracji wymagają zgody, zatrzymują się do decyzji człowieka.",
      diagram: {
        a11y:
          "Schemat na trzech torach: agent, system i człowiek. Człowiek lub system zleca cel, agent planuje i wybiera narzędzie, a kontrola systemu waliduje parametry i sprawdza uprawnienia. Jeśli konfiguracja tego wymaga, operacja czeka na zatwierdzenie człowieka. Następnie system wykonuje wywołanie i weryfikuje wynik. Błąd powoduje ponowienie lub nowy plan, albo przekazanie zadania człowiekowi. Wynik trafia do logów ze statusem.",
        lanes: { agent: "AGENT", system: "SYSTEM", human: "CZŁOWIEK" },
        nodes: {
          goal: "CEL",
          plan: "PLAN",
          tools: "NARZĘDZIA",
          gate: "KONTROLA",
          approve: "ZATWIERDZENIE",
          exec: "DZIAŁANIE",
          verify: "WERYFIKACJA",
          result: "WYNIK",
        },
        labels: {
          needsApproval: "WYMAGA ZGODY",
          allowed: "DOZWOLONE",
          retry: "BŁĄD: PONOWIENIE LUB NOWY PLAN",
          handover: "BŁĄD: PRZEKAZANIE CZŁOWIEKOWI",
        },
      },
      steps: [
        {
          label: "CEL",
          lane: "human",
          title: "Zadanie i granice",
          desc: "Zadanie zleca człowiek albo system, razem z danymi potrzebnymi do jego wykonania i zakresem tego, co agent może zrobić.",
        },
        {
          label: "PLAN",
          lane: "agent",
          title: "Rozbicie na kroki",
          desc: "Agent proponuje kolejność działań w ramach dostępnych narzędzi. Plan jest zapisywany.",
        },
        {
          label: "NARZĘDZIA",
          lane: "agent",
          title: "Wybór narzędzia",
          desc: "Agent wybiera narzędzie z listy dozwolonych i proponuje parametry wywołania. Sam niczego nie wykonuje.",
        },
        {
          label: "DZIAŁANIE",
          lane: "system",
          title: "Wykonanie wywołania",
          desc: "Wywołanie wykonuje warstwa systemowa. Zapisuje rezultat i ślad w logach.",
        },
        {
          label: "WERYFIKACJA",
          lane: "system",
          title: "Sprawdzenie wyniku",
          desc: "Reguły sprawdzają odpowiedź narzędzia i spójność danych, a agent ocenia, czy cel został osiągnięty. Błąd kończy się ponowieniem, nowym planem albo przekazaniem człowiekowi.",
        },
        {
          label: "WYNIK",
          lane: "human",
          title: "Wynik i status",
          desc: "Zapisujemy wynik, kroki i powody decyzji. Zadanie ma jasny status: zakończone, oczekuje albo przekazane człowiekowi.",
        },
      ],
      gate: {
        label: "KONTROLA",
        lane: "system",
        title: "Kontrola systemu i zatwierdzenie",
        desc: "Przed wykonaniem warstwa systemowa waliduje parametry i sprawdza uprawnienia. Jeśli konfiguracja wymaga zgody, operacja zatrzymuje się, a człowiek może ją przyjąć, zmienić lub odrzucić. O zatrzymaniu decyduje system, nie model.",
      },
      note: "Agent nie jest nieomylny ani w pełni autonomiczny. Dlatego projektujemy go wokół błędu: limity prób i czasu, weryfikacja, zatwierdzenia i możliwość zatrzymania.",
    },
    valueStrip: {
      problem: "Zadanie wymaga wielu kroków w kilku systemach i ktoś robi je ręcznie.",
      effect: "Agent przygotowuje lub wykonuje kroki w granicach uprawnień, a decyzje o większych skutkach zatwierdza człowiek.",
      audience: "Zespołów operacji, sprzedaży i obsługi z powtarzalnymi zadaniami.",
    },
    capabilities: {
      heading: ["CO BUDUJEMY", "W AGENTACH"],
      intro:
        "Agent jest tak użyteczny, jak bezpieczne są jego narzędzia i granice. Dlatego większość pracy to nie sam model, tylko to, co go otacza.",
      modelLabel: "MODEL",
      modelNote: "Proponuje kolejne kroki. Reszta należy do systemu.",
      frameLabel: "SYSTEM AGENTA",
      groups: [
        {
          tag: "WYKONUJE",
          lead: "Co agent robi",
          items: [
            {
              n: "01",
              tag: "NARZĘDZIA",
              title: "Narzędzia i wywołania API",
              desc: "Zdefiniowany zestaw narzędzi, np. odczyt z CRM, zapis zadania, powiadomienie. Każde ma jasno opisane dane wejściowe i wyjściowe, sprawdzane po stronie systemu.",
            },
            {
              n: "02",
              tag: "KONTEKST",
              title: "Kontekst i pamięć zadania",
              desc: "Agent dostaje dane potrzebne do zadania. Stan wieloetapowego procesu zapisujemy poza modelem, więc można go wznowić, sprawdzić i odtworzyć.",
            },
            {
              n: "03",
              tag: "KROKI",
              title: "Kolejność kroków",
              desc: "Zadanie dzielimy na kroki z jawnymi warunkami przejścia, limitami prób i czasu. Gdy krok zawiedzie, system wie, co dalej.",
            },
          ],
        },
        {
          tag: "OGRANICZA",
          lead: "Czego mu nie wolno",
          items: [
            {
              n: "04",
              tag: "UPRAWNIENIA",
              title: "Uprawnienia i granice działania",
              desc: "Osobne konta o ograniczonych rolach. Operacje nieodwracalne albo kosztowne są zablokowane lub wymagają zatwierdzenia.",
            },
            {
              n: "05",
              tag: "ZATWIERDZANIE",
              title: "Zatwierdzanie przez człowieka",
              desc: "Osoba dostaje podsumowanie tego, co agent zamierza zrobić, i może to przyjąć, zmienić albo odrzucić.",
            },
          ],
        },
        {
          tag: "POKAZUJE",
          lead: "Co widać po fakcie",
          items: [
            {
              n: "06",
              tag: "PRZEJRZYSTOŚĆ",
              title: "Logi i monitoring",
              desc: "Każdy krok, wywołanie i decyzja zostawia ślad. Alerty wskazują zadania, które utknęły albo zakończyły się błędem.",
            },
          ],
        },
      ],
    },
    useCases: {
      heading: ["PRZYKŁADY", "ZASTOSOWAŃ"],
      badge: "SCENARIUSZE PRZYKŁADOWE",
      detailsLabel: "Szczegóły",
      legend: { agent: "AGENT", approval: "ZATWIERDZENIE", human: "CZŁOWIEK" },
      labels: {
        task: "ZADANIE",
        path: "DZIAŁANIA",
        result: "REZULTAT",
        situation: "SYTUACJA",
        mechanism: "MECHANIZM",
      },
      items: [
        {
          n: "01",
          tag: "SPRZEDAŻ",
          title: "Przygotowanie oferty z kilku źródeł",
          task: "Przygotować projekt oferty dla klienta.",
          steps: [
            { kind: "agent", t: "Pobiera historię klienta, cennik i dostępność" },
            { kind: "agent", t: "Składa projekt według szablonu" },
            { kind: "agent", t: "Sprawdza zgodność z cennikiem" },
            { kind: "approval", t: "Handlowiec zatwierdza lub poprawia" },
            { kind: "human", t: "Handlowiec wysyła ofertę" },
          ],
          gate: "Zatwierdzenie: każdy projekt przed wysyłką.",
          effect:
            "Handlowiec dostaje kompletny projekt do oceny zamiast zbierać dane od zera, a wysyłka nadal wymaga jego decyzji.",
          problem:
            "Do przygotowania oferty trzeba sprawdzić historię klienta w CRM, cennik, dostępność w systemie i wcześniejsze wyceny. Handlowiec robi to ręcznie w kilku oknach.",
          mechanism:
            "Agent pobiera dane przez API, składa projekt oferty według szablonu i sprawdza zgodność z cennikiem. Gotowy projekt trafia do handlowca, który zatwierdza lub poprawia go przed wysyłką.",
        },
        {
          n: "02",
          tag: "OPERACJE",
          title: "Obsługa zgłoszeń wewnętrznych",
          task: "Skierować zgłoszenie do IT lub administracji.",
          steps: [
            { kind: "agent", t: "Klasyfikuje zgłoszenie" },
            { kind: "agent", t: "Sprawdza dane w katalogu użytkowników" },
            { kind: "agent", t: "Zakłada zadanie i powiadamia zespół" },
            { kind: "approval", t: "Sprawy nietypowe lub dotyczące dostępów trafiają do człowieka" },
          ],
          gate: "Zatwierdzenie: tylko sprawy nietypowe i dotyczące dostępów.",
          effect:
            "Rutynowe zgłoszenia trafiają od razu do właściwej kolejki, a ludzie zajmują się tymi, które wymagają oceny.",
          problem:
            "Zgłoszenia do działu IT lub administracji wymagają ustalenia kategorii, sprawdzenia uprawnień i założenia zadania w odpowiednim systemie.",
          mechanism:
            "Agent klasyfikuje zgłoszenie, sprawdza dane w katalogu użytkowników, zakłada zadanie i powiadamia właściwy zespół. Zgłoszenia nietypowe albo dotyczące dostępów idą do człowieka.",
        },
        {
          n: "03",
          tag: "FINANSE",
          title: "Uzgadnianie danych między systemami",
          task: "Znaleźć rozbieżności między CRM, fakturami i magazynem.",
          steps: [
            { kind: "agent", t: "Cyklicznie porównuje rekordy przez API" },
            { kind: "agent", t: "Wyszukuje rozbieżności i zbiera dokumenty" },
            { kind: "agent", t: "Przygotowuje opis problemu" },
            { kind: "approval", t: "Osoba odpowiedzialna ocenia proponowaną poprawkę" },
          ],
          gate: "Zatwierdzenie: każda poprawka w systemie. Sam agent jej nie wprowadza.",
          effect:
            "Rozbieżności są widoczne wcześniej i opisane, więc ich wyjaśnienie zajmuje mniej czasu.",
          problem:
            "Rozbieżności między CRM, systemem fakturowym i magazynem wychodzą dopiero przy zamknięciu okresu i są wyjaśniane ręcznie.",
          mechanism:
            "Agent cyklicznie porównuje rekordy przez API, wyszukuje rozbieżności, zbiera dokumenty źródłowe i przygotowuje opis problemu. Poprawek w systemach nie wprowadza sam, tylko proponuje je osobie odpowiedzialnej.",
        },
        {
          n: "04",
          tag: "OBSŁUGA KLIENTA",
          title: "Obsługa zwrotów i reklamacji",
          task: "Przygotować rekomendację w sprawie reklamacji.",
          steps: [
            { kind: "agent", t: "Zbiera dane zamówienia i historię kontaktu" },
            { kind: "agent", t: "Stosuje reguły polityki zwrotów" },
            { kind: "agent", t: "Przygotowuje rekomendację z uzasadnieniem" },
            { kind: "approval", t: "Pracownik rozstrzyga sprawy sporne" },
          ],
          gate: "Zatwierdzenie: sprawy sporne. Przypadki jednoznaczne wg ustalonej polityki.",
          effect:
            "Pracownik ocenia gotową sprawę z dokumentacją, zamiast ją składać, a decyzje są spójniejsze.",
          problem:
            "Każda reklamacja wymaga sprawdzenia zamówienia, regulaminu i historii kontaktu, zanim pracownik podejmie decyzję.",
          mechanism:
            "Agent zbiera dane zamówienia, stosuje reguły polityki zwrotów i przygotowuje rekomendację z uzasadnieniem. Decyzję w przypadkach spornych podejmuje pracownik.",
        },
      ],
    },
    access: {
      eyebrow: "UPRAWNIENIA I ZATWIERDZENIA",
      heading: ["CO AGENT MOŻE,", "A CO WYMAGA ZGODY"],
      intro:
        "Konkretne uprawnienia ustalamy indywidualnie dla systemu i procesu. Poniżej przykładowa konfiguracja, nie uniwersalna polityka.",
      badge: "PRZYKŁADOWA KONFIGURACJA",
      columns: [
        {
          kind: "auto",
          tag: "AUTOMATYCZNIE",
          title: "Dozwolone automatycznie",
          items: [
            "Odczyt danych z CRM, bazy lub katalogu",
            "Zakładanie zadań i powiadomień wewnętrznych",
            "Przygotowanie projektów i opisów do oceny",
          ],
        },
        {
          kind: "approval",
          tag: "ZA ZATWIERDZENIEM",
          title: "Wymagają zatwierdzenia",
          items: [
            "Wysyłka wiadomości do klientów",
            "Zmiana rekordów w systemach produkcyjnych",
            "Operacje kosztowne lub trudne do cofnięcia",
          ],
        },
        {
          kind: "blocked",
          tag: "ZABLOKOWANE",
          title: "Zablokowane",
          items: [
            "Usuwanie danych",
            "Zmiana uprawnień i dostępów",
            "Dostęp do systemów spoza zdefiniowanych narzędzi",
          ],
        },
      ],
      foot: "Agent używa osobnych kont o minimalnych rolach. Klucze i hasła są w warstwie systemowej, która wykonuje wywołania, i nie trafiają do modelu.",
    },
    process: {
      heading: ["JAK WSPÓŁPRACUJEMY", "PRZY AGENCIE"],
      labels: { does: "ROBIMY", gets: "OTRZYMUJESZ" },
      steps: [
        {
          n: "01",
          tag: "ZAKRES",
          title: "Zakres zadania i granice",
          does: "Ustalamy, co agent ma wykonywać, czego nie wolno mu robić i które decyzje zostają przy ludziach.",
          gets: "Spisany zakres zadania, lista narzędzi i systemów oraz zasady: co automatycznie, co za zatwierdzeniem, co zablokowane.",
        },
        {
          n: "02",
          tag: "ARCHITEKTURA",
          title: "Narzędzia, uprawnienia, przepływ",
          does: "Projektujemy zestaw narzędzi, konta o ograniczonych rolach, kroki zadania i punkty zatwierdzenia.",
          gets: "Projekt przepływu: narzędzia, role kont, punkty zatwierdzenia i opis zachowania przy błędzie.",
        },
        {
          n: "03",
          tag: "BUDOWA",
          title: "Budowa i integracje",
          does: "Budujemy agenta, jego narzędzia i logowanie. Najpierw w trybie tylko do odczytu, bez zapisów w systemach produkcyjnych.",
          gets: "Działającego agenta w środowisku testowym, z logami i narzędziami połączonymi z Waszymi systemami w trybie odczytu.",
        },
        {
          n: "04",
          tag: "TESTY",
          title: "Testy scenariuszy i błędów",
          does: "Sprawdzamy przypadki typowe, brzegowe i celowo zepsute: niedostępne API, niepełne dane, niejednoznaczne zadania.",
          gets: "Wyniki testów, także dla przypadków błędnych, i listę poprawek wynikających z tego, jak agent zachował się przy błędach.",
        },
        {
          n: "05",
          tag: "URUCHOMIENIE",
          title: "Uruchomienie i przegląd",
          does: "Uruchamiamy agenta z zatwierdzaniem tam, gdzie wymaga tego polityka uprawnień. Zakres samodzielności zmieniamy tylko wtedy, gdy logi pokazują stabilne wyniki.",
          gets: "Uruchomionego agenta z logami i alertami oraz przegląd logów po starcie, na którym opieramy wspólne decyzje o zmianie zakresu.",
        },
      ],
    },
    faq: {
      heading: "PYTANIA O AGENTÓW AI",
      items: [
        {
          q: "Czym agent AI różni się od chatbota i od zwykłej automatyzacji?",
          a: "Chatbot prowadzi rozmowę, a zwykła automatyzacja wykonuje zawsze te same kroki według reguł. Agent dobiera kolejne kroki zadania i wywołuje narzędzia, więc sprawdza się tam, gdzie przebieg zależy od treści. Jeśli przebieg da się opisać regułami, zwykła automatyzacja jest prostsza i bezpieczniejsza.",
        },
        {
          q: "Czy agent może działać bez nadzoru człowieka?",
          a: "Technicznie tak, ale nie zawsze powinien. Zakres samodzielności ustalamy per zadanie, na podstawie ryzyka: operacje odwracalne i niskiego ryzyka mogą przebiegać automatycznie, a te o skutkach poza systemem czekają na zatwierdzenie. Samodzielność poszerzamy dopiero, gdy pokazują to logi.",
        },
        {
          q: "Co się dzieje, gdy agent się pomyli albo wywoła złe narzędzie?",
          a: "Zakładamy, że to się zdarzy. Parametry narzędzi są walidowane, zakres dozwolonych operacji ograniczony, a wynik kroku sprawdzany regułami. Przy błędzie następuje ponowienie, zmiana planu albo przekazanie sprawy człowiekowi.",
        },
        {
          q: "Jak ograniczacie uprawnienia agenta do systemów?",
          a: "Agent używa osobnych kont z minimalnym zestawem ról i nie ma dostępu do niczego poza zdefiniowanymi narzędziami. Zapis, usuwanie i operacje kosztowne mogą być zablokowane albo wymagać zatwierdzenia, co ustalamy dla każdego systemu osobno. Klucze i hasła nie trafiają do modelu, tylko do warstwy systemowej wykonującej wywołania.",
        },
        {
          q: "Jak monitorować to, co agent zrobił?",
          a: "Każde zadanie ma zapis kroków: plan, wywołane narzędzia, parametry, wyniki i decyzje o zatwierdzeniu. Widać historię konkretnej sprawy, a alerty sygnalizują zadania, które utknęły albo kończą się błędem.",
        },
        {
          q: "Jak zatrzymać agenta?",
          a: "Zadania mają limity prób i czasu, a wykonanie można wstrzymać po stronie systemu, bez zmian w samym modelu. Operacje czekające na zatwierdzenie nie zostaną wykonane, dopóki ktoś ich nie przyjmie. Sposób zatrzymania i wznowienia ustalamy przy projektowaniu przepływu.",
        },
        {
          q: "Kiedy agent AI nie jest dobrym rozwiązaniem?",
          a: "Gdy przebieg da się opisać regułami, wystarczy zwykła automatyzacja. Agent nie sprawdzi się też tam, gdzie system nie ma API ani innego bezpiecznego sposobu wywołań, albo gdzie skutki pomyłki są nieodwracalne i nie da się ich zatwierdzić przed wykonaniem. Wtedy powiemy to wprost.",
        },
        {
          q: "Jakie dane przetwarza agent i jak są zabezpieczone?",
          a: "Agent pracuje na danych potrzebnych do konkretnego zadania i ma dostęp tylko do tego, czego potrzebuje. Zakres danych i miejsce ich przetwarzania ustalamy przed budową. Podpisujemy umowę powierzenia, a gdy wymagają tego Wasze zasady, konfigurujemy przetwarzanie w UE. Wybór dostawców i zabezpieczenia uzgadniamy w projekcie, z uwzględnieniem RODO i polityk Twojej firmy.",
        },
      ],
    },
    manifesto: {
      lines: ["NIE BUDUJEMY AGENTÓW, KTÓRE DZIAŁAJĄ BEZ GRANIC.", "NIE UKRYWAMY, CO AGENT ZROBIŁ.", "NIE ZAKŁADAMY, ŻE AGENT SIĘ NIE POMYLI."],
      final: ["AGENT DZIAŁA W", "USTALONYCH", "GRANICACH."],
      steps: ["CEL", "PLAN", "NARZĘDZIA", "DZIAŁANIE", "WERYFIKACJA", "WYNIK"],
    },
    cta: {
      heading: ["MASZ ZADANIE, KTÓRE", "WYMAGA AGENTA AI?"],
      sub: "Opisz zadanie, systemy i decyzje, które powinny zostać u ludzi. Ocenimy, czy agent jest tu właściwym rozwiązaniem i co powinien robić samodzielnie. Pierwsza rozmowa i diagnoza są bezpłatne.",
      button: "Umów bezpłatną rozmowę",
    },
    related: {
      heading: "POWIĄZANE USŁUGI",
      items: [
        {
          slug: "asystenci-ai",
          why: "Gdy system ma odpowiadać na pytania i wspierać ludzi, a nie wykonywać akcje.",
        },
        {
          slug: "integracje-ai",
          why: "Narzędzia agenta to w praktyce bezpieczne integracje z API i systemami firmy.",
        },
        {
          slug: "automatyzacja-procesow",
          why: "Gdy przebieg zadania da się opisać regułami, wystarczy automatyzacja bez AI.",
        },
      ],
    },
  },
  en: {
    seo: {
      title: "AI agents for business: systems that act | VANTAFRAME",
      description:
        "AI agents for companies: multi-step tasks on your systems, within permission limits, with human approval and logs. The first call is free.",
      ogTitle: "AI agents for business: tasks under control",
    },
    hero: {
      eyebrow: "02 / AI AGENTS",
      h1: ["AI AGENTS FOR", "BUSINESS. TASKS", "UNDER CONTROL."],
      lead: "An AI agent is a system that breaks a task into steps, calls your company's APIs and tools, and checks the result before anything is saved. It acts within defined permissions, and a person approves decisions with larger consequences.",
      cta: "Book a free call",
      visualCaption: "AGENT EXECUTION LOOP",
      visualA11y:
        "Diagram of an agent loop: task, plan, tool call, verification, human approval and result. If verification fails, the agent goes back to the plan or hands the case to a person.",
    },
    definition: {
      eyebrow: "WHAT AN AI AGENT IS",
      heading: ["WHAT IS AN", "AI AGENT"],
      intro:
        "Four solutions that are easy to confuse. They are not levels of the same technology, but different ways a system can work.",
      here: "THIS PAGE",
      linkLabel: "See the service",
      items: [
        {
          tag: "RULES",
          title: "Automation",
          desc: "Runs a predefined process.",
          slug: "automatyzacja-procesow",
        },
        {
          tag: "CONVERSATION",
          title: "Chatbot",
          desc: "Handles a conversational interaction. What it can do depends on its integrations.",
        },
        {
          tag: "SUPPORT",
          title: "AI assistant",
          desc: "Helps a user analyse information and carry out tasks, usually under the user's direction.",
          slug: "asystenci-ai",
        },
        {
          tag: "GOAL",
          title: "AI agent",
          desc: "Pursues an assigned goal, choosing the next steps and using the available tools within defined limits.",
          current: true,
        },
      ],
      closing:
        "Not every task needs an agent. We match how the system works to the process, the risk and the level of independence you expect.",
    },
    how: {
      detailsLabel: "Description of the six steps",
      heading: ["HOW AN AI", "AGENT WORKS"],
      intro:
        "An agent works in a loop, not in one shot. After each step the result is checked, and operations that the configuration says need consent stop until a person decides.",
      diagram: {
        a11y:
          "Diagram on three lanes: agent, system and human. A person or system sets the goal, the agent plans and picks a tool, and the system check validates parameters and permissions. If the configuration requires it, the operation waits for human approval. Then the system executes the call and verifies the result. An error leads to a retry or a new plan, or hands the task to a person. The result goes to the logs with a status.",
        lanes: { agent: "AGENT", system: "SYSTEM", human: "HUMAN" },
        nodes: {
          goal: "GOAL",
          plan: "PLAN",
          tools: "TOOLS",
          gate: "CHECKS",
          approve: "APPROVAL",
          exec: "ACTION",
          verify: "VERIFY",
          result: "RESULT",
        },
        labels: {
          needsApproval: "NEEDS APPROVAL",
          allowed: "ALLOWED",
          retry: "ERROR: RETRY OR NEW PLAN",
          handover: "ERROR: HAND TO A PERSON",
        },
      },
      steps: [
        {
          label: "GOAL",
          lane: "human",
          title: "Task and limits",
          desc: "A person or system sets the task, together with the data needed to carry it out and the scope of what the agent may do.",
        },
        {
          label: "PLAN",
          lane: "agent",
          title: "Breaking it into steps",
          desc: "The agent proposes an order of actions within the available tools. The plan is stored.",
        },
        {
          label: "TOOLS",
          lane: "agent",
          title: "Choosing a tool",
          desc: "The agent picks a tool from the allowed list and proposes the call parameters. It executes nothing itself.",
        },
        {
          label: "ACTION",
          lane: "system",
          title: "Executing the call",
          desc: "The system layer makes the call. It records the result and a trace in the logs.",
        },
        {
          label: "VERIFY",
          lane: "system",
          title: "Checking the result",
          desc: "Rules check the tool's response and the consistency of the data, and the agent judges whether the goal was reached. An error leads to a retry, a new plan or handing the case to a person.",
        },
        {
          label: "RESULT",
          lane: "human",
          title: "Result and status",
          desc: "We record the outcome, the steps and the reasons for decisions. A task has a clear status: completed, waiting or handed to a person.",
        },
      ],
      gate: {
        label: "CHECKS",
        lane: "system",
        title: "System check and approval",
        desc: "Before execution the system layer validates the parameters and checks permissions. If the configuration requires consent, the operation stops and a person can accept, change or reject it. The system decides to stop, not the model.",
      },
      note: "An agent is neither infallible nor fully autonomous. That is why we design around failure: retry and time limits, verification, approvals and the ability to stop it.",
    },
    valueStrip: {
      problem: "A task takes many steps across several systems and someone does it by hand.",
      effect: "The agent prepares or performs the steps within its permissions, and a person approves decisions with larger consequences.",
      audience: "Operations, sales and support teams with repetitive tasks.",
    },
    capabilities: {
      heading: ["WHAT WE BUILD", "INTO AGENTS"],
      intro:
        "An agent is only as useful as its tools are safe and its boundaries are clear. Most of the work is not the model itself but everything around it.",
      modelLabel: "MODEL",
      modelNote: "It proposes the next steps. The rest belongs to the system.",
      frameLabel: "AGENT SYSTEM",
      groups: [
        {
          tag: "EXECUTES",
          lead: "What the agent does",
          items: [
            {
              n: "01",
              tag: "TOOLS",
              title: "Tools and API calls",
              desc: "A defined set of tools, e.g. read from the CRM, create a task, send a notification. Each has clearly described inputs and outputs, validated by the system.",
            },
            {
              n: "02",
              tag: "CONTEXT",
              title: "Context and task memory",
              desc: "The agent gets the data needed for the task. The state of a multi-step process is stored outside the model, so it can be resumed, inspected and replayed.",
            },
            {
              n: "03",
              tag: "STEPS",
              title: "Order of steps",
              desc: "We split a task into steps with explicit transition conditions, retry limits and timeouts. When a step fails, the system knows what happens next.",
            },
          ],
        },
        {
          tag: "LIMITS",
          lead: "What it must not do",
          items: [
            {
              n: "04",
              tag: "PERMISSIONS",
              title: "Permissions and action limits",
              desc: "Separate accounts with limited roles. Irreversible or costly operations are blocked or require approval.",
            },
            {
              n: "05",
              tag: "APPROVAL",
              title: "Human approval",
              desc: "A person sees a summary of what the agent intends to do and can accept, change or reject it.",
            },
          ],
        },
        {
          tag: "SHOWS",
          lead: "What you can see afterwards",
          items: [
            {
              n: "06",
              tag: "OBSERVABILITY",
              title: "Logs and monitoring",
              desc: "Every step, call and decision leaves a trace. Alerts point to tasks that stalled or ended in error.",
            },
          ],
        },
      ],
    },
    useCases: {
      heading: ["EXAMPLE", "USE CASES"],
      badge: "EXAMPLE SCENARIOS",
      detailsLabel: "Details",
      legend: { agent: "AGENT", approval: "APPROVAL", human: "HUMAN" },
      labels: {
        task: "TASK",
        path: "ACTIONS",
        result: "RESULT",
        situation: "SITUATION",
        mechanism: "MECHANISM",
      },
      items: [
        {
          n: "01",
          tag: "SALES OPS",
          title: "Preparing a quote from several sources",
          task: "Prepare a draft quote for a customer.",
          steps: [
            { kind: "agent", t: "Fetches customer history, price list and availability" },
            { kind: "agent", t: "Assembles a draft from a template" },
            { kind: "agent", t: "Checks it against the price list" },
            { kind: "approval", t: "The salesperson approves or edits" },
            { kind: "human", t: "The salesperson sends the quote" },
          ],
          gate: "Approval: every draft before it is sent.",
          effect:
            "The salesperson reviews a complete draft instead of collecting data from scratch, and sending still requires their decision.",
          problem:
            "Preparing a quote means checking the customer's history in the CRM, the price list, stock in the system and earlier quotes. The salesperson does it by hand across several windows.",
          mechanism:
            "The agent fetches the data through APIs, assembles a draft quote from a template and checks it against the price list. The draft goes to the salesperson, who approves or edits it before sending.",
        },
        {
          n: "02",
          tag: "OPERATIONS",
          title: "Handling internal requests",
          task: "Route a request to IT or administration.",
          steps: [
            { kind: "agent", t: "Classifies the request" },
            { kind: "agent", t: "Checks the user directory" },
            { kind: "agent", t: "Creates the task and notifies the team" },
            { kind: "approval", t: "Unusual requests or ones involving access go to a person" },
          ],
          gate: "Approval: only unusual requests and ones involving access.",
          effect:
            "Routine requests reach the right queue immediately, and people handle the ones that need judgement.",
          problem:
            "Requests to IT or administration require determining a category, checking permissions and creating a task in the right system.",
          mechanism:
            "The agent classifies the request, checks the user directory, creates the task and notifies the right team. Unusual requests or ones involving access go to a person.",
        },
        {
          n: "03",
          tag: "FINANCE OPS",
          title: "Reconciling data between systems",
          task: "Find discrepancies between the CRM, invoices and the warehouse.",
          steps: [
            { kind: "agent", t: "Periodically compares records through APIs" },
            { kind: "agent", t: "Finds discrepancies and gathers documents" },
            { kind: "agent", t: "Prepares a description of the problem" },
            { kind: "approval", t: "The responsible person reviews the proposed fix" },
          ],
          gate: "Approval: every change in a system. The agent never makes it on its own.",
          effect:
            "Discrepancies show up earlier and are already described, so resolving them takes less time.",
          problem:
            "Discrepancies between the CRM, the invoicing system and the warehouse only surface at period close and are explained by hand.",
          mechanism:
            "The agent periodically compares records through APIs, finds discrepancies, gathers source documents and prepares a description of the problem. It does not change systems itself, it proposes fixes to the responsible person.",
        },
        {
          n: "04",
          tag: "CUSTOMER OPS",
          title: "Handling returns and complaints",
          task: "Prepare a recommendation on a complaint.",
          steps: [
            { kind: "agent", t: "Collects order data and contact history" },
            { kind: "agent", t: "Applies the returns policy rules" },
            { kind: "agent", t: "Prepares a recommendation with reasoning" },
            { kind: "approval", t: "An employee decides disputed cases" },
          ],
          gate: "Approval: disputed cases. Clear-cut ones follow the agreed policy.",
          effect:
            "The employee evaluates a prepared case with documentation instead of assembling it, and decisions are more consistent.",
          problem:
            "Each complaint requires checking the order, the policy and the contact history before an employee can decide.",
          mechanism:
            "The agent collects the order data, applies the returns policy rules and prepares a recommendation with reasoning. In disputed cases an employee makes the decision.",
        },
      ],
    },
    access: {
      eyebrow: "PERMISSIONS AND APPROVALS",
      heading: ["WHAT AN AGENT CAN DO,", "WHAT NEEDS CONSENT"],
      intro:
        "Specific permissions are set individually for each system and process. Below is an example configuration, not a universal policy.",
      badge: "EXAMPLE CONFIGURATION",
      columns: [
        {
          kind: "auto",
          tag: "AUTOMATIC",
          title: "Allowed automatically",
          items: [
            "Reading data from a CRM, database or directory",
            "Creating internal tasks and notifications",
            "Preparing drafts and descriptions for review",
          ],
        },
        {
          kind: "approval",
          tag: "NEEDS APPROVAL",
          title: "Require approval",
          items: [
            "Sending messages to customers",
            "Changing records in production systems",
            "Costly operations or ones hard to undo",
          ],
        },
        {
          kind: "blocked",
          tag: "BLOCKED",
          title: "Blocked",
          items: [
            "Deleting data",
            "Changing permissions and access",
            "Access to systems outside the defined tools",
          ],
        },
      ],
      foot: "The agent uses separate accounts with minimal roles. Keys and passwords live in the system layer that makes the calls and never reach the model.",
    },
    process: {
      heading: ["HOW WE WORK", "ON AN AGENT"],
      labels: { does: "WE DO", gets: "YOU RECEIVE" },
      steps: [
        {
          n: "01",
          tag: "SCOPING",
          title: "Task scope and boundaries",
          does: "We establish what the agent is to do, what it must never do and which decisions stay with people.",
          gets: "A written task scope, a list of tools and systems, and the rules: what is automatic, what needs approval, what is blocked.",
        },
        {
          n: "02",
          tag: "ARCHITECTURE",
          title: "Tools, permissions, flow",
          does: "We design the tool set, limited-role accounts, task steps and approval points.",
          gets: "A flow design: tools, account roles, approval points and a description of how the agent behaves on error.",
        },
        {
          n: "03",
          tag: "BUILD",
          title: "Building and integrations",
          does: "We build the agent, its tools and logging, first in read-only mode with no writes to production systems.",
          gets: "A working agent in a test environment, with logs and tools connected to your systems in read-only mode.",
        },
        {
          n: "04",
          tag: "TESTING",
          title: "Testing scenarios and failures",
          does: "We test typical cases, edge cases and deliberately broken ones: an unavailable API, incomplete data, ambiguous tasks.",
          gets: "Test results, including the failing cases, and a list of fixes based on how the agent behaved on errors.",
        },
        {
          n: "05",
          tag: "ROLLOUT",
          title: "Launch and review",
          does: "We launch the agent with approval wherever the permission policy requires it. We change the scope of independence only when logs show stable results.",
          gets: "A running agent with logs and alerts, plus a log review after launch that our joint decisions on changing the scope are based on.",
        },
      ],
    },
    faq: {
      heading: "QUESTIONS ABOUT AI AGENTS",
      items: [
        {
          q: "How is an AI agent different from a chatbot or ordinary automation?",
          a: "A chatbot holds a conversation, and ordinary automation always runs the same steps according to rules. An agent chooses the next steps of a task and calls tools, so it fits where the course of work depends on content. If the flow can be described by rules, ordinary automation is simpler and safer.",
        },
        {
          q: "Can an agent act without human supervision?",
          a: "Technically yes, but it should not always. We set the level of independence per task, based on risk: reversible, low-risk operations can run automatically, while those with effects outside the system wait for approval. We widen independence only when the logs show it is justified.",
        },
        {
          q: "What happens when an agent makes a mistake or calls the wrong tool?",
          a: "We assume it will happen. Tool parameters are validated, the range of allowed operations is limited and each step's result is checked with rules. On error there is a retry, a changed plan or a handover to a person.",
        },
        {
          q: "How do you limit the agent's permissions to systems?",
          a: "The agent uses separate accounts with a minimal set of roles and has no access to anything beyond the defined tools. Write, delete and costly operations can be blocked or tied to approval, which we set for each system separately. Keys and passwords never reach the model, only the system layer that executes the calls.",
        },
        {
          q: "How can we monitor what the agent has done?",
          a: "Every task has a record of its steps: the plan, the tools called, parameters, results and approval decisions. You can see the history of a specific case, and alerts flag tasks that stalled or ended in error.",
        },
        {
          q: "How do you stop an agent?",
          a: "Tasks have retry and time limits, and execution can be paused on the system side without changing the model itself. Operations waiting for approval are not executed until someone accepts them. How to stop and resume is decided when designing the flow.",
        },
        {
          q: "When is an AI agent not a good solution?",
          a: "When the flow can be described by rules, ordinary automation is enough. An agent also does not fit where a system has no API or other safe way to call it, or where the consequences of a mistake are irreversible and cannot be approved before execution. In that case we will say so plainly.",
        },
        {
          q: "What data does an agent process and how is it protected?",
          a: "The agent works on the data needed for the specific task and has access only to what it needs. We agree the scope of data and where it is processed before building. We sign a data processing agreement and, where your rules require it, configure processing in the EU. We agree the choice of providers and safeguards in the project, taking into account GDPR and your company's policies.",
        },
      ],
    },
    manifesto: {
      lines: ["WE DO NOT BUILD AGENTS THAT ACT WITHOUT LIMITS.", "WE DO NOT HIDE WHAT THE AGENT DID.", "WE DO NOT ASSUME AN AGENT WILL NEVER BE WRONG."],
      final: ["AN AGENT ACTS", "WITHIN LIMITS", "WE SET TOGETHER."],
      steps: ["GOAL", "PLAN", "TOOLS", "ACTION", "VERIFY", "RESULT"],
    },
    cta: {
      heading: ["GOT A TASK THAT", "NEEDS AN AI AGENT?"],
      sub: "Describe the task, the systems and the decisions that should stay with people. We will assess whether an agent is the right solution and what it should do on its own. The first call and diagnosis are free.",
      button: "Book a free call",
    },
    related: {
      heading: "RELATED SERVICES",
      items: [
        {
          slug: "asystenci-ai",
          why: "When the system should answer questions and support people rather than take actions.",
        },
        {
          slug: "integracje-ai",
          why: "An agent's tools are in practice secure integrations with company APIs and systems.",
        },
        {
          slug: "automatyzacja-procesow",
          why: "When a task's flow can be described by rules, plain automation without AI is enough.",
        },
      ],
    },
  },
};