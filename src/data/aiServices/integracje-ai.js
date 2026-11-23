export default {
  pl: {
    seo: {
      title: "Integracje AI z CRM, ERP i API firmy | VANTAFRAME",
      description:
        "Łączymy AI z CRM, ERP, Salesforce, Slackiem i bazami danych przez API i webhooki: uprawnienia, walidacja, logi i monitoring. Pierwsza rozmowa bezpłatna.",
      ogTitle: "Integracje AI z CRM, ERP i API",
      serviceType: "Integracja AI z systemami firmowymi",
    },
    hero: {
      eyebrow: "04 / INTEGRACJE AI",
      h1: ["INTEGRACJE AI", "Z SYSTEMAMI,", "KTÓRE MASZ."],
      lead: "Integracje AI z systemami firmy opieramy na API i webhookach: łączymy CRM, ERP, bazy danych i narzędzia wewnętrzne bez ich wymiany. Autoryzacja i bezpieczeństwo są częścią projektu od pierwszego dnia, a działanie połączeń jest monitorowane.",
      cta: "Umów bezpłatną rozmowę",
      visualCaption: "WARSTWA INTEGRACJI",
      visualA11y:
        "Diagram warstwy integracji: systemy źródłowe przechodzą przez autoryzację do warstwy integracji, stąd dane trafiają do komponentu AI, a wynik do systemu docelowego. Monitoring obserwuje cały przepływ i zgłasza błędy.",
      visualLabels: {
        "AI MODEL": "MODEL AI",
        "INTEGRATION LAYER": "INTEGRACJE",
        "DB": "BAZA",
        "REQUEST": "ŻĄDANIE",
        "QUERY": "ZAPYTANIE",
        "RESPONSE": "ODPOWIEDŹ",
        "RESULT": "WYNIK",
        "REJECT": "ODMOWA",
        "TIMEOUT": "LIMIT CZASU",
        "RETRY": "PONOWIENIE",
        "SYNC": "SYNCHRONIZACJA",
        "AUTH": "AUTORYZACJA",
        "DENIED": "ODMOWA",
        "LAYER": "WARSTWA",
        "TIME": "CZAS",
        "MONITOR": "MONITORING"
},
    },
    valueStrip: {
      problem: "Dane dla AI są rozrzucone po systemach, których nie da się wymienić.",
      effect: "AI korzysta z nich przez kontrolowaną warstwę, a wynik wraca tam, gdzie pracownik już pracuje.",
      audience: "Firm z istniejącym oprogramowaniem.",
    },
    capabilities: {
      heading: ["CO", "INTEGRUJEMY"],
      intro:
        "Integracja AI z systemami firmowymi to dołożenie warstwy, która pozwala AI korzystać z danych i funkcji systemów, które firma już ma. Nie wymieniamy tego, co działa.",
      distinction: {
        before: "To nie to samo co ",
        linkLabel: "automatyzacja procesów",
        slug: "automatyzacja-procesow",
        after: ": ta uruchamia kroki procesu, a integracja daje AI bezpieczny dostęp do danych i miejsce na wynik. Często działają razem.",
      },
      systemsLabel: "SYSTEMY I DANE FIRMY",
      systems: [
        {
          n: "01",
          tag: "CRM / ERP",
          title: "CRM i ERP",
          desc: "Klienci, zamówienia, produkty i statusy. Odczyt i zapis zgodnie ze strukturą danych i regułami systemu.",
          chips: ["KLIENCI", "ZAMÓWIENIA", "PRODUKTY", "STATUSY"],
        },
        {
          n: "02",
          tag: "SPRZEDAŻ",
          title: "Systemy sprzedażowe",
          desc: "Szanse sprzedaży, oferty, cenniki i zamówienia ze sklepu. Dane, na których pracują handlowcy.",
          chips: ["SZANSE", "OFERTY", "CENNIKI", "ZAMÓWIENIA ONLINE"],
        },
        {
          n: "03",
          tag: "WIEDZA",
          title: "Dokumenty i bazy wiedzy",
          desc: "Pliki, procedury, wewnętrzne wiki i bazy danych. Model dostaje fragmenty potrzebne do zadania, nie cały zasób.",
          chips: ["PLIKI", "PROCEDURY", "BAZY DANYCH"],
          link: { slug: "asystenci-ai", label: "Asystenci AI" },
        },
        {
          n: "04",
          tag: "KOMUNIKACJA",
          title: "Komunikacja i obsługa klienta",
          desc: "Poczta, komunikatory i system zgłoszeń. Wiadomości i historia kontaktu jako wejście, a zarazem miejsce, do którego może wrócić wynik.",
          chips: ["E-MAIL", "KOMUNIKATOR", "ZGŁOSZENIA"],
        },
        {
          n: "05",
          tag: "WEWNĘTRZNE",
          title: "Aplikacje wewnętrzne",
          desc: "Narzędzia zbudowane na własne potrzeby, także starsze, bez nowoczesnego API. Jeśli istnieje bezpieczny kanał dostępu do danych, łączymy je kontrolowanie.",
          chips: ["API WEWNĘTRZNE", "EKSPORT PLIKÓW", "BAZA DANYCH"],
        },
      ],
      ai: {
        label: "MODELE I USŁUGI AI",
        title: "Model jako osobny komponent",
        text: "Modele językowe, wyszukiwanie po znaczeniu, odczyt dokumentów. Model stoi za warstwą integracyjną: dostaje tylko przygotowane dane, a jego odpowiedź jest sprawdzana, zanim trafi do systemu. Konkretne platformy i dostawców dobieramy do projektu.",
        chips: ["MODELE JĘZYKOWE", "WYSZUKIWANIE PO ZNACZENIU", "ODCZYT DOKUMENTÓW"],
      },
      note: "To typowe kategorie, nie lista gotowych ani zrealizowanych integracji. Możliwość połączenia oceniamy w analizie, dla każdego systemu osobno. Nie każdy starszy system da się podłączyć bezpiecznie i z sensownym kosztem.",
    },
    how: {
      heading: ["JAK WYGLĄDA", "INTEGRACJA"],
      intro:
        "AI nie łączy się bezpośrednio z każdym systemem. Między systemami a modelem stoi warstwa integracyjna, która odpowiada za dostęp, przygotowanie danych i kontrolę wyniku. To odpowiedzialności architektury, a nie zawsze identyczny przebieg: zależnie od rozwiązania część z nich może nie występować, a dane i wywołania mogą iść w różnych kierunkach.",
      details: {
        eyebrow: "SZCZEGÓŁY TECHNICZNE",
        heading: ["SZCZEGÓŁY WARSTWY I", "SPOSOBY POŁĄCZENIA"],
        lead: "Pięć odpowiedzialności warstwy integracyjnej i monitoring, każda z opisem i głównym ryzykiem. Model nie dostaje bezpośredniego dostępu do systemów, a wynik jest sprawdzany, zanim trafi do systemu docelowego.",
        summary: "Opisy odpowiedzialności i ryzyka",
      },
      badge: "PRZYKŁADOWA ARCHITEKTURA",
      diagram: {
        a11y:
          "Schemat architektury. Po lewej systemy firmy (CRM, ERP, system zgłoszeń, narzędzie SaaS, starsza aplikacja), połączone dwukierunkowo z warstwą integracyjną. Warstwa odpowiada za dostęp i uprawnienia, pobieranie i przygotowanie danych, wywołanie modelu, walidację odpowiedzi oraz kontrolowany zapis lub przekazanie wyniku, a monitoring i obsługa błędów obejmują całość. Model AI znajduje się poza warstwą i dostaje wyłącznie przygotowane dane, nie ma bezpośredniego dostępu do systemów. Zweryfikowany wynik może trafić do systemu docelowego.",
        systemsLabel: "SYSTEMY FIRMY",
        systemsNote: "PRZYKŁADOWA KONFIGURACJA",
        layerLabel: "WARSTWA INTEGRACYJNA",
        modelLabel: "MODEL AI",
        modelNote: "Dostaje tylko przygotowane dane. Bez bezpośredniego dostępu do systemów.",
        targetLabel: "SYSTEM DOCELOWY",
        targetNote: "Przyjmuje zweryfikowany wynik.",
        riskLabel: "RYZYKO",
        systems: [
          { name: "CRM", route: "API", access: "ODCZYT · ZAPIS" },
          { name: "ERP", route: "API", access: "ODCZYT" },
          { name: "SYSTEM ZGŁOSZEŃ", route: "WEBHOOK", access: "ODCZYT" },
          { name: "NARZĘDZIE SAAS", route: "KONEKTOR", access: "ODCZYT" },
          { name: "STARSZA APLIKACJA", route: "ADAPTER", access: "ODCZYT" },
        ],
      },
      duties: [
        {
          tag: "DOSTĘP",
          title: "Dostęp i uprawnienia",
          desc: "Warstwa sprawdza tożsamość i zakres dostępu konta technicznego. O uprawnieniach nie decyduje model.",
          risk: "Odmowa dostępu zatrzymuje operację i zgłasza alert.",
        },
        {
          tag: "DANE",
          title: "Pobranie i przygotowanie danych",
          desc: "Odczyt przez wybraną drogę połączenia, dopasowanie pól jednego systemu do drugiego i ograniczenie danych do tego, co potrzebne zadaniu.",
          risk: "Niedostępne API albo przekroczony limit: zadanie czeka w kolejce. Niekompletne dane są oznaczane i, zależnie od projektu, trafiają do wyjaśnienia zamiast do modelu.",
        },
        {
          tag: "MODEL",
          title: "Wywołanie modelu",
          desc: "Model dostaje przygotowane dane i zadanie, a zwraca wynik w ustalonym formacie. Nie ma wglądu w systemy ani kluczy dostępu.",
          risk: "Model może się pomylić albo odpowiedzieć niezgodnie z formatem, dlatego jego wynik nie trafia do systemu bezpośrednio.",
        },
        {
          tag: "WALIDACJA",
          title: "Walidacja odpowiedzi",
          desc: "Warstwa sprawdza format i reguły wyniku. Tam, gdzie ryzyko jest większe, wynik czeka na zatwierdzenie człowieka.",
          risk: "Wynik niezgodny z formatem lub regułami jest odrzucany albo trafia do człowieka. Nie obiecujemy, że każdy błąd da się wychwycić automatycznie.",
        },
        {
          tag: "ZAPIS",
          title: "Kontrolowany zapis lub przekazanie",
          desc: "Zapis do systemu docelowego kontem, które ma uprawnienia tylko do potrzebnej operacji. W odpowiednich procesach projektujemy deduplikację i idempotentną obsługę operacji, czyli taką, w której powtórzenie nie zmienia wyniku.",
          risk: "Konflikt zapisu trafia do ręcznej analizy. Operację ponawiamy tylko wtedy, gdy jest to bezpieczne i obsługuje to zaprojektowany mechanizm.",
        },
      ],
      monitor: {
        tag: "MONITORING",
        title: "Monitoring i obsługa błędów",
        desc: "Logi wywołań, czas odpowiedzi, błędy i długość kolejek obejmują całość. Alerty wskazują problemy, ale część błędów wymaga decyzji człowieka.",
      },
      routes: {
        heading: "CZTERY SPOSOBY POŁĄCZENIA",
        items: [
          { tag: "API", desc: "Zapytania do udostępnionego interfejsu, z obsługą limitów, kolejnych stron wyników i wersji." },
          { tag: "WEBHOOK", desc: "System sam zgłasza zdarzenie. Odbiór jest weryfikowany i ustawiany w kolejce." },
          { tag: "KONEKTOR", desc: "Gotowe połączenie dostawcy, gdy jest wystarczające i bezpieczne." },
          { tag: "ADAPTER", desc: "Własna warstwa pośrednia, np. odczyt z eksportu plików albo z bazy przez kontrolowany widok." },
        ],
        note: "Dostępność konkretnego sposobu zależy od możliwości systemu, uprawnień i ograniczeń technicznych. Adapter nie zawsze rozwiązuje brak API: bywa niemożliwy albo nieopłacalny, np. gdy nie ma bezpiecznego kanału dostępu do danych.",
      },
      scopes:
        "Odczyt i zapis to osobne zakresy uprawnień, zależne też od tego, co system faktycznie udostępnia. Każdemu kontu nadajemy tylko te, które są potrzebne.",
    },
    useCases: {
      heading: ["ZASTOSOWANIA", "INTEGRACJI"],
      badge: "SCENARIUSZE PRZYKŁADOWE",
      detailsLabel: "Szczegóły",
      labels: {
        source: "ŹRÓDŁO",
        data: "DANE",
        task: "ZADANIE AI",
        target: "CEL",
        result: "REZULTAT",
        situation: "SYTUACJA",
        mechanism: "MECHANIZM",
      },
      items: [
        {
          n: "01",
          tag: "CRM",
          title: "AI w karcie klienta w CRM",
          source: "CRM: historia kontaktu",
          data: "Maile i notatki o kliencie",
          task: "Podsumowanie i propozycja kolejnego kroku",
          target: "Karta klienta w CRM, jako treść do weryfikacji",
          effect:
            "Informacja jest tam, gdzie handlowiec już pracuje, bez przełączania się między narzędziami.",
          problem:
            "Handlowcy muszą przeglądać maile i notatki, żeby zrozumieć stan relacji z klientem, a podsumowania nikt nie aktualizuje.",
          mechanism:
            "Webhook z CRM przekazuje zdarzenie do warstwy integracyjnej, która pobiera historię kontaktu i przekazuje ją do modelu. Podsumowanie i propozycja kolejnego kroku wracają jako notatka w karcie, oznaczona jako wygenerowana i przeznaczona do weryfikacji.",
        },
        {
          n: "02",
          tag: "ERP",
          title: "Analiza odchyleń w zamówieniach",
          source: "ERP: zamówienia",
          data: "Zmiany i rozbieżności w zamówieniach",
          task: "Reguły wskazują rozbieżności, AI opisuje je zrozumiale",
          target: "Raport do weryfikacji",
          effect:
            "Zespół dostaje opisane rozbieżności zamiast surowych eksportów, a dostęp do ERP pozostaje ograniczony i opisany.",
          problem:
            "Zespół operacyjny eksportuje dane z ERP do arkuszy, żeby szukać nieścisłości, więc raporty szybko się dezaktualizują.",
          mechanism:
            "Warstwa integracyjna cyklicznie pobiera zmiany przez API i przygotowuje je do analizy. Reguły wskazują rozbieżności, a AI przygotowuje ich zrozumiały opis. Wynik trafia do wskazanego systemu raportowego do weryfikacji.",
        },
        {
          n: "03",
          tag: "STARE SYSTEMY",
          title: "Starszy system bez nowoczesnego API",
          source: "Eksport danych lub inny uzgodniony kanał",
          data: "Wybrane informacje przygotowane przez adapter",
          task: "Klasyfikacja lub podsumowanie",
          target: "Wskazana aplikacja",
          effect:
            "Nowe rozwiązania mogą korzystać z danych starego systemu, a jego wymiana staje się decyzją, nie koniecznością.",
          problem:
            "Starszy system wewnętrzny przechowuje ważne dane, ale oferuje tylko eksport plików i dostęp do bazy.",
          mechanism:
            "Adapter odczytuje dane uzgodnionym, kontrolowanym kanałem i przygotowuje wybrane informacje w ustalonym schemacie. AI może je klasyfikować lub podsumowywać, a wynik trafia do wskazanej aplikacji. To możliwe tylko wtedy, gdy istnieje bezpieczny kanał dostępu do danych.",
        },
        {
          n: "04",
          tag: "WIELE SYSTEMÓW",
          title: "Jedna odpowiedź z kilku systemów",
          source: "CRM, zgłoszenia, magazyn",
          data: "Ujednolicony widok danych klienta, zgodny z uprawnieniami",
          task: "Propozycja odpowiedzi dla klienta",
          target: "Pracownik weryfikuje i wysyła",
          effect:
            "Jedno miejsce kontroli dostępu i jedno miejsce do diagnozowania problemów zamiast trzech.",
          problem:
            "Odpowiedź dla klienta wymaga danych z CRM, systemu zgłoszeń i magazynu, które nie są ze sobą połączone.",
          mechanism:
            "Warstwa integracyjna pobiera dane zgodnie z uprawnieniami osoby pytającej i składa z nich ujednolicony widok. AI przygotowuje na jego podstawie propozycję odpowiedzi, a pracownik ją weryfikuje.",
        },
      ],
    },
    process: {
      heading: ["JAK WSPÓŁPRACUJEMY", "PRZY INTEGRACJI"],
      indexLabel: "SPIS DOKUMENTACJI PROJEKTU",
      steps: [
        {
          n: "01",
          tag: "INWENTARZ",
          title: "Inwentarz systemów i ocena możliwości integracji",
          desc: "Zbieramy listę systemów, ich interfejsów, właścicieli i ograniczeń oraz ustalamy, które dane są potrzebne, skąd pochodzą i kto za nie odpowiada.",
        },
        {
          n: "02",
          tag: "ARCHITEKTURA",
          title: "Projekt przepływu danych i zabezpieczeń",
          desc: "Architektura integracji, model uprawnień (odczyt i zapis osobno), zarządzanie sekretami i obsługa błędów. Wymagania bezpieczeństwa uzgadniamy z zespołem IT przed pierwszą linią kodu.",
        },
        {
          n: "03",
          tag: "BUDOWA",
          title: "Działające połączenie, w miarę możliwości na środowisku testowym",
          desc: "Budujemy konektory, kolejki i przygotowanie danych, z logowaniem od początku. Preferujemy środowisko testowe oraz dane zanonimizowane lub syntetyczne, ale stosujemy je odpowiednio do warunków projektu.",
        },
        {
          n: "04",
          tag: "TESTY",
          title: "Wyniki testów awarii i zgodności danych",
          desc: "Sprawdzamy nie tylko ścieżkę poprawną: niedostępność systemu, błędne dane, zduplikowane zdarzenia i przekroczone limity. Potem weryfikujemy zgodność rekordów.",
        },
        {
          n: "05",
          tag: "URUCHOMIENIE",
          title: "Dokumentacja i zasady utrzymania",
          desc: "Przełączamy integrację etapami, z alertami i opisem postępowania w razie awarii. Rozwijamy ją, gdy firma zmienia lub dodaje systemy.",
        },
      ],
    },
    faq: {
      heading: "PYTANIA O INTEGRACJE AI",
      items: [
        {
          q: "Czy trzeba wymieniać obecne systemy, żeby dodać AI?",
          a: "Zwykle nie. Dokładamy warstwę integracyjną, która łączy istniejące systemy z modelem przez ich dostępne interfejsy. Wymiana bywa uzasadniona dopiero wtedy, gdy system uniemożliwia bezpieczny dostęp do danych, i też wtedy oceniamy ją osobno.",
        },
        {
          q: "Jak zabezpieczacie dostęp do danych: klucze i uprawnienia?",
          a: "Stosujemy osobne konta techniczne o minimalnych uprawnieniach, sekrety w dedykowanym magazynie i szyfrowane połączenia. Klucze nie trafiają do repozytorium ani do modelu, a do modelu trafiają tylko dane potrzebne do zadania. Dostęp można odwołać bez przebudowy rozwiązania. Szczegóły i wymagania bezpieczeństwa uzgadniamy z Waszym zespołem IT.",
        },
        {
          q: "Co, gdy system nie ma API?",
          a: "Są alternatywy: eksport plików, kontrolowany dostęp do bazy danych przez osobną warstwę, konektor dostawcy albo własny adapter. Każda ma wady, na przykład opóźnienie danych lub ryzyko przy zmianie struktury, więc przed wyborem opisujemy kompromisy. Zdarza się też, że żadna z dróg nie jest bezpieczna albo opłacalna, i wtedy mówimy to wprost.",
        },
        {
          q: "Czy AI może zmieniać dane w CRM lub ERP?",
          a: "Może, ale tylko tam, gdzie to ustalimy i gdzie system na to pozwala. Odczyt i zapis to osobne uprawnienia, a konto techniczne dostaje tylko potrzebne operacje. Odpowiedź modelu nie trafia do systemu bezpośrednio: najpierw sprawdza ją warstwa integracyjna, a tam, gdzie ryzyko jest większe, zapis czeka na zatwierdzenie człowieka.",
        },
        {
          q: "Co się dzieje, gdy API przestaje odpowiadać albo dane się rozjeżdżają?",
          a: "Dla każdego pola ustalamy źródło prawdy i zasady rozwiązywania konfliktów. Gdy API nie odpowiada albo przekroczono limit, zadania czekają w kolejce. Ponawiamy je tylko wtedy, gdy jest to bezpieczne i obsługuje to zaprojektowany mechanizm: odczyt zwykle można powtórzyć, a zapis tylko wtedy, gdy nie zdubluje danych. W odpowiednich procesach projektujemy deduplikację i idempotentną obsługę operacji. Gdy próby się wyczerpią albo ponowienie jest ryzykowne, sprawa trafia do kolejki do ręcznej analizy i generuje alert.",
        },
        {
          q: "Czy możemy zmienić model AI w przyszłości?",
          a: "Zwykle tak, bo model jest osobnym komponentem za warstwą integracyjną. Zmiana może jednak wymagać dostosowania integracji i formatów danych, ponownych testów oraz oceny jakości, bo różne modele odpowiadają inaczej i mają różne ograniczenia. Zakres prac zależy od tego, jak bardzo nowy model się różni.",
        },
        {
          q: "Jak monitorujecie integrację po uruchomieniu?",
          a: "Rejestrujemy logi wywołań, czas odpowiedzi, błędy i długość kolejek. Alerty informują o awarii połączenia, przekroczeniu limitów albo nietypowym ruchu. Zakres monitoringu i sposób powiadamiania ustalamy razem, zależnie od krytyczności systemu.",
        },
      ],
    },
    manifesto: {
      lines: ["NIE WYMIENIAMY SYSTEMÓW, KTÓRE DZIAŁAJĄ.", "NIE DAJEMY MODELOWI DOSTĘPU DO WSZYSTKIEGO.", "NIE OBIECUJEMY, ŻE KAŻDY SYSTEM DA SIĘ POŁĄCZYĆ."],
      final: ["ŁĄCZYMY AI Z TYM,", "CO FIRMA JUŻ MA,", "POD KONTROLĄ."],
      steps: ["API", "WEBHOOK", "KONEKTOR", "ADAPTER", "WALIDACJA", "MONITORING"],
    },
    cta: {
      heading: ["CHCESZ POŁĄCZYĆ AI", "Z ISTNIEJĄCYMI SYSTEMAMI?"],
      sub: "Wypisz systemy, z którymi ma współpracować rozwiązanie, dane, które mają trafić do AI, i miejsce, do którego ma wrócić wynik. Ocenimy dostępne interfejsy, ryzyka i sensowną architekturę. Pierwsza rozmowa i diagnoza są bezpłatne.",
      button: "Umów bezpłatną rozmowę",
    },
    related: {
      heading: "POWIĄZANE USŁUGI",
      items: [
        {
          slug: "wdrozenia-ai",
          why: "Gdy integracja jest częścią większego projektu: od analizy po monitoring.",
        },
        {
          slug: "automatyzacja-procesow",
          why: "Logika biznesowa, którą uruchamiają zdarzenia i dane przepływające przez integracje.",
        },
        {
          slug: "automatyzacja-dokumentow",
          why: "Gdy dane z faktur i umów mają trafiać do ERP lub CRM przez warstwę integracji.",
        },
      ],
    },
  },
  en: {
    seo: {
      title: "AI integration with your CRM, ERP and APIs | VANTAFRAME",
      description:
        "We connect AI to CRM, ERP, Salesforce, Slack and databases through APIs and webhooks: permissions, validation, logs and monitoring. The first call is free.",
      ogTitle: "AI integration with CRM, ERP and APIs",
      serviceType: "AI integration with company systems",
    },
    hero: {
      eyebrow: "04 / AI INTEGRATION",
      h1: ["AI INTEGRATION", "WITH THE SYSTEMS", "YOU ALREADY HAVE."],
      lead: "We build AI integration with company systems on APIs and webhooks: connecting the CRM, ERP, databases and internal tools without replacing them. Authorisation and security are part of the design from day one, and the connections are monitored.",
      cta: "Book a free call",
      visualCaption: "INTEGRATION LAYER",
      visualA11y:
        "Diagram of an integration layer: source systems pass through authorisation into the integration layer, from there data goes to the AI component and the result to the target system. Monitoring watches the whole flow and reports errors.",
    },
    valueStrip: {
      problem: "The data AI needs is spread across systems that cannot be replaced.",
      effect: "AI uses it through a controlled layer, and the result returns to where the employee already works.",
      audience: "Companies with existing software.",
    },
    capabilities: {
      heading: ["WHAT WE", "INTEGRATE"],
      intro:
        "AI integration with company systems means adding a layer that lets AI use the data and functions of the systems the company already has. We do not replace what works.",
      distinction: {
        before: "It is not the same as ",
        linkLabel: "process automation",
        slug: "automatyzacja-procesow",
        after: ": that runs the steps of a process, while integration gives AI safe access to data and a place for the result. They often work together.",
      },
      systemsLabel: "COMPANY SYSTEMS AND DATA",
      systems: [
        {
          n: "01",
          tag: "CRM / ERP",
          title: "CRM and ERP",
          desc: "Customers, orders, products and statuses. Reading and writing in line with the system's data structure and rules.",
          chips: ["CUSTOMERS", "ORDERS", "PRODUCTS", "STATUSES"],
        },
        {
          n: "02",
          tag: "SALES",
          title: "Sales systems",
          desc: "Opportunities, quotes, price lists and shop orders. The data salespeople work with.",
          chips: ["OPPORTUNITIES", "QUOTES", "PRICE LISTS", "ONLINE ORDERS"],
        },
        {
          n: "03",
          tag: "KNOWLEDGE",
          title: "Documents and knowledge bases",
          desc: "Files, procedures, internal wikis and databases. The model gets the fragments the task needs, not the whole resource.",
          chips: ["FILES", "PROCEDURES", "DATABASES"],
          link: { slug: "asystenci-ai", label: "AI assistants" },
        },
        {
          n: "04",
          tag: "COMMS",
          title: "Communication and customer service",
          desc: "Email, messengers and the ticketing system. Messages and contact history as input, and also a place the result can return to.",
          chips: ["EMAIL", "MESSENGER", "TICKETS"],
        },
        {
          n: "05",
          tag: "INTERNAL",
          title: "Internal applications",
          desc: "Tools built for the company's own needs, including older ones without a modern API. If a safe way to reach the data exists, we connect them in a controlled way.",
          chips: ["INTERNAL API", "FILE EXPORT", "DATABASE"],
        },
      ],
      ai: {
        label: "AI MODELS AND SERVICES",
        title: "The model as a separate component",
        text: "Language models, semantic search, document reading. The model sits behind the integration layer: it gets only prepared data, and its answer is checked before it reaches a system. We choose specific platforms and providers per project.",
        chips: ["LANGUAGE MODELS", "SEMANTIC SEARCH", "DOCUMENT READING"],
      },
      note: "These are typical categories, not a list of ready-made or completed integrations. We assess whether a connection is possible in the analysis, system by system. Not every older system can be connected safely and at a sensible cost.",
    },
    how: {
      heading: ["WHAT AN", "INTEGRATION LOOKS LIKE"],
      intro:
        "AI does not connect directly to every system. Between the systems and the model sits an integration layer that is responsible for access, data preparation and checking the result. These are responsibilities of the architecture, not always an identical sequence: depending on the solution some may not occur, and data and calls can flow in different directions.",
      details: {
        eyebrow: "TECHNICAL DETAILS",
        heading: ["THE LAYER IN DETAIL AND", "WAYS TO CONNECT"],
        lead: "The five responsibilities of the integration layer and monitoring, each with a description and its main risk. The model gets no direct access to systems, and its result is checked before it reaches the target system.",
        summary: "Responsibilities and risks, described",
      },
      badge: "EXAMPLE ARCHITECTURE",
      diagram: {
        a11y:
          "Architecture diagram. On the left, company systems (CRM, ERP, ticketing system, SaaS tool, older application) connected in both directions to the integration layer. The layer is responsible for access and permissions, fetching and preparing data, calling the model, validating the response and controlled writing or hand-over of the result, with monitoring and error handling across all of it. The AI model sits outside the layer and receives only prepared data, with no direct access to the systems. A verified result can go to a target system.",
        systemsLabel: "COMPANY SYSTEMS",
        systemsNote: "EXAMPLE CONFIGURATION",
        layerLabel: "INTEGRATION LAYER",
        modelLabel: "AI MODEL",
        modelNote: "Gets only prepared data. No direct access to the systems.",
        targetLabel: "TARGET SYSTEM",
        targetNote: "Receives the verified result.",
        riskLabel: "RISK",
        systems: [
          { name: "CRM", route: "API", access: "READ · WRITE" },
          { name: "ERP", route: "API", access: "READ" },
          { name: "TICKETING SYSTEM", route: "WEBHOOK", access: "READ" },
          { name: "SAAS TOOL", route: "CONNECTOR", access: "READ" },
          { name: "OLDER APPLICATION", route: "ADAPTER", access: "READ" },
        ],
      },
      duties: [
        {
          tag: "ACCESS",
          title: "Access and permissions",
          desc: "The layer checks the identity and access scope of the technical account. The model does not decide about permissions.",
          risk: "A denied access stops the operation and raises an alert.",
        },
        {
          tag: "DATA",
          title: "Fetching and preparing data",
          desc: "Reading through the chosen connection route, matching the fields of one system to another and limiting the data to what the task needs.",
          risk: "API unavailable or a limit exceeded: the task waits in a queue. Incomplete data is flagged and, depending on the project, goes to clarification instead of to the model.",
        },
        {
          tag: "MODEL",
          title: "Calling the model",
          desc: "The model gets prepared data and a task, and returns a result in an agreed format. It has no view into the systems and no access keys.",
          risk: "A model can be wrong or answer outside the format, so its result does not go to a system directly.",
        },
        {
          tag: "VALIDATION",
          title: "Validating the response",
          desc: "The layer checks the format and rules of the result. Where the risk is higher, the result waits for a person's approval.",
          risk: "A result that breaks the format or rules is rejected or goes to a person. We do not promise every error can be caught automatically.",
        },
        {
          tag: "WRITE",
          title: "Controlled write or hand-over",
          desc: "Writing to the target system with an account that has permissions only for the needed operation. In suitable processes we design deduplication and idempotent handling of operations, meaning repeating one does not change the result.",
          risk: "A write conflict goes to manual analysis. We retry an operation only when it is safe and handled by a designed mechanism.",
        },
      ],
      monitor: {
        tag: "MONITOR",
        title: "Monitoring and error handling",
        desc: "Call logs, response times, errors and queue lengths cover the whole. Alerts point to problems, but some errors need a person's decision.",
      },
      routes: {
        heading: "FOUR WAYS TO CONNECT",
        items: [
          { tag: "API", desc: "Requests to an exposed interface, handling rate limits, result pages and versions." },
          { tag: "WEBHOOK", desc: "The system reports an event itself. Receipt is verified and queued." },
          { tag: "CONNECTOR", desc: "A provider's ready-made connection, when it is sufficient and safe." },
          { tag: "ADAPTER", desc: "Our own intermediate layer, e.g. reading from a file export or from a database through a controlled view." },
        ],
        note: "Which way is available depends on the system's capabilities, permissions and technical limits. An adapter does not always solve a missing API: it can be impossible or not worth it, e.g. when there is no safe way to reach the data.",
      },
      scopes:
        "Reading and writing are separate permission scopes, and also depend on what the system actually exposes. We give each account only the ones that are needed.",
    },
    useCases: {
      heading: ["INTEGRATION", "USE CASES"],
      badge: "EXAMPLE SCENARIOS",
      detailsLabel: "Details",
      labels: {
        source: "SOURCE",
        data: "DATA",
        task: "AI TASK",
        target: "TARGET",
        result: "RESULT",
        situation: "SITUATION",
        mechanism: "MECHANISM",
      },
      items: [
        {
          n: "01",
          tag: "CRM",
          title: "AI inside the customer card in the CRM",
          source: "CRM: contact history",
          data: "Emails and notes about the customer",
          task: "A summary and a proposed next step",
          target: "The customer card in the CRM, as content to review",
          effect:
            "The information is where the salesperson already works, with no switching between tools.",
          problem:
            "Salespeople have to read through emails and notes to understand the state of the relationship with a customer, and nobody keeps the summaries up to date.",
          mechanism:
            "A webhook from the CRM passes the event to the integration layer, which fetches the contact history and passes it to the model. The summary and proposed next step return as a note in the card, marked as generated and meant for review.",
        },
        {
          n: "02",
          tag: "ERP",
          title: "Analysing deviations in orders",
          source: "ERP: orders",
          data: "Changes and discrepancies in orders",
          task: "Rules flag discrepancies, AI describes them clearly",
          target: "A report for review",
          effect:
            "The team gets described discrepancies instead of raw exports, and access to the ERP stays limited and documented.",
          problem:
            "The operations team exports ERP data into spreadsheets to look for inconsistencies, so reports quickly go out of date.",
          mechanism:
            "The integration layer periodically fetches changes through the API and prepares them for analysis. Rules flag the discrepancies, and AI prepares a clear description of them. The result goes to a designated reporting system for review.",
        },
        {
          n: "03",
          tag: "LEGACY",
          title: "An older system without a modern API",
          source: "A data export or another agreed channel",
          data: "Selected information prepared by an adapter",
          task: "Classification or summarisation",
          target: "A designated application",
          effect:
            "New solutions can use the old system's data, and replacing it becomes a decision, not a necessity.",
          problem:
            "An older internal system holds important data but offers only file export and database access.",
          mechanism:
            "An adapter reads the data through an agreed, controlled channel and prepares selected information in an agreed schema. AI can classify or summarise it, and the result goes to a designated application. This is possible only if a safe channel to the data exists.",
        },
        {
          n: "04",
          tag: "MULTI-SYSTEM",
          title: "One answer from several systems",
          source: "CRM, tickets, warehouse",
          data: "A unified view of customer data that respects permissions",
          task: "A proposed reply to the customer",
          target: "An employee reviews and sends it",
          effect:
            "One place to control access and one place to diagnose problems instead of three.",
          problem:
            "An answer for a customer needs data from the CRM, the ticketing system and the warehouse, which are not connected to each other.",
          mechanism:
            "The integration layer fetches data according to the permissions of the person asking and assembles a unified view. AI prepares a proposed reply from it, and an employee reviews it.",
        },
      ],
    },
    process: {
      heading: ["HOW WE WORK ON", "AN INTEGRATION"],
      indexLabel: "PROJECT DOCUMENTATION INDEX",
      steps: [
        {
          n: "01",
          tag: "INVENTORY",
          title: "Systems inventory and an assessment of integration options",
          desc: "We collect a list of systems, their interfaces, owners and limitations, and establish which data is needed, where it comes from and who is responsible for it.",
        },
        {
          n: "02",
          tag: "ARCHITECTURE",
          title: "Data flow and security design",
          desc: "The integration architecture, the permission model (reading and writing separately), secrets management and error handling. We agree security requirements with your IT team before the first line of code.",
        },
        {
          n: "03",
          tag: "BUILD",
          title: "A working connection, where possible on a test environment",
          desc: "We build connectors, queues and data preparation, with logging from the start. We prefer a test environment and anonymised or synthetic data, but apply them according to the conditions of the project.",
        },
        {
          n: "04",
          tag: "TESTING",
          title: "Results of failure and data-consistency tests",
          desc: "We test more than the happy path: an unavailable system, bad data, duplicated events and exceeded limits. Then we verify that records match.",
        },
        {
          n: "05",
          tag: "ROLLOUT",
          title: "Documentation and maintenance rules",
          desc: "We switch the integration over in stages, with alerts and a description of what to do in an outage. We extend it when the company changes or adds systems.",
        },
      ],
    },
    faq: {
      heading: "QUESTIONS ABOUT AI INTEGRATION",
      items: [
        {
          q: "Do we have to replace our current systems to add AI?",
          a: "Usually not. We add an integration layer that connects the existing systems to the model through their available interfaces. Replacement is justified only when a system prevents safe access to data, and even then we assess it separately.",
        },
        {
          q: "How do you secure data access: keys and permissions?",
          a: "We use separate technical accounts with minimal permissions, secrets in a dedicated store and encrypted connections. Keys do not reach the repository or the model, and the model gets only the data the task needs. Access can be revoked without rebuilding the solution. We agree the details and security requirements with your IT team.",
        },
        {
          q: "What if a system has no API?",
          a: "There are alternatives: file export, controlled access to a database through a separate layer, a provider's connector or our own adapter. Each has drawbacks, for example data delay or risk when the structure changes, so we describe the trade-offs before choosing. Sometimes none of the routes is safe or worth it, and then we say so plainly.",
        },
        {
          q: "Can AI change data in the CRM or ERP?",
          a: "It can, but only where we agree it and where the system allows it. Reading and writing are separate permissions, and the technical account gets only the needed operations. The model's answer does not reach the system directly: the integration layer checks it first, and where the risk is higher, the write waits for a person's approval.",
        },
        {
          q: "What happens when the API stops responding or data drifts apart?",
          a: "For each field we define the source of truth and the rules for resolving conflicts. When the API does not respond or a limit is exceeded, tasks wait in a queue. We retry them only when it is safe and handled by a designed mechanism: a read can usually be repeated, while a write only if it will not duplicate data. In suitable processes we design deduplication and idempotent handling of operations. When retries run out or a retry is risky, the case goes to a queue for manual analysis and raises an alert.",
        },
        {
          q: "Can we change the AI model in the future?",
          a: "Usually yes, because the model is a separate component behind the integration layer. A change may still require adapting the integration and data formats, retesting and assessing quality, because different models answer differently and have different limits. The amount of work depends on how much the new model differs.",
        },
        {
          q: "How do you monitor the integration after launch?",
          a: "We record call logs, response times, errors and queue lengths. Alerts report a connection failure, exceeded limits or unusual traffic. We agree the scope of monitoring and how to notify together, depending on how critical the system is.",
        },
      ],
    },
    manifesto: {
      lines: ["WE DO NOT REPLACE SYSTEMS THAT WORK.", "WE DO NOT GIVE A MODEL ACCESS TO EVERYTHING.", "WE DO NOT PROMISE EVERY SYSTEM CAN BE CONNECTED."],
      final: ["AI CONNECTED TO", "WHAT YOU HAVE,", "UNDER CONTROL."],
      steps: ["API", "WEBHOOK", "CONNECTOR", "ADAPTER", "VALIDATION", "MONITORING"],
    },
    cta: {
      heading: ["WANT TO CONNECT AI", "TO EXISTING SYSTEMS?"],
      sub: "List the systems the solution should work with, the data that should reach AI, and the place the result should return to. We will assess the available interfaces, the risks and a sensible architecture. The first call and diagnosis are free.",
      button: "Book a free call",
    },
    related: {
      heading: "RELATED SERVICES",
      items: [
        {
          slug: "wdrozenia-ai",
          why: "When integration is part of a bigger project: from analysis to monitoring.",
        },
        {
          slug: "automatyzacja-procesow",
          why: "The business logic that is triggered by events and data flowing through integrations.",
        },
        {
          slug: "automatyzacja-dokumentow",
          why: "When data from invoices and contracts should reach the ERP or CRM through the integration layer.",
        },
      ],
    },
  },
};