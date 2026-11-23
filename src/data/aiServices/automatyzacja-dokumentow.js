export default {
  pl: {
    seo: {
      title: "Automatyzacja dokumentów i faktur (OCR, AI) | VANTAFRAME",
      description:
        "Automatyzujemy obieg dokumentów: faktury, umowy, zamówienia i formularze. Odczyt danych (OCR, AI), walidacja i przekazanie do systemów. Bezpłatna diagnoza.",
      ogTitle: "Automatyzacja dokumentów i faktur z OCR i AI",
      serviceType: "Automatyzacja dokumentów i obiegu dokumentów",
    },
    hero: {
      eyebrow: "06 / AUTOMATYZACJA DOKUMENTÓW",
      h1: ["AUTOMATYZACJA", "DOKUMENTÓW: OD", "SKANU DO DANYCH."],
      lead: "Automatyzacja dokumentów obejmuje faktury, umowy i formularze: odczyt OCR, ekstrakcję danych, walidację i obsługę wyjątków. Dane trafiają do Waszych systemów, a dokumenty, których nie da się odczytać pewnie, do człowieka.",
      cta: "Umów bezpłatną rozmowę",
      visualCaption: "DROGA DOKUMENTU",
      visualA11y:
        "Diagram drogi dokumentu: wejście skanu lub pliku, odczyt OCR, ekstrakcja pól, walidacja danych i przekazanie do systemu. Dokumenty z niepewnym odczytem albo błędem walidacji trafiają na ścieżkę wyjątku do człowieka.",
      visualLabels: {
        "DOCUMENT": "DOKUMENT",
        "RECORD": "REKORD",
        "VALIDATE": "WALIDACJA",
        "EXCEPTION": "WYJĄTEK",
        "HUMAN REVIEW": "KONTROLA RĘCZNA",
        "VENDOR": "DOSTAWCA",
        "DATE": "DATA",
        "TOTAL": "SUMA",
        "CHECKSUM": "SUMA KONTROLNA",
        "MATCH": "ZGODNOŚĆ",
        "INVOICE": "FAKTURA",
        "FORM": "FORMULARZ",
        "CONTRACT": "UMOWA",
        "CLASSIFY": "KLASYFIKACJA",
        "EXTRACT": "ODCZYT",
        "REVIEW": "KONTROLA",
        "FAIL": "BŁĄD"
},
    },
    valueStrip: {
      problem: "Dokumenty ktoś czyta i przepisuje.",
      effect: "Dane trafiają uporządkowane i sprawdzone, a wątpliwe dokumenty do człowieka.",
      audience: "Księgowości, sprzedaży i administracji.",
    },
    capabilities: {
      heading: [
        "CO",
        "PRZETWARZAMY"
      ],
      intro: "Automatyzacja obiegu dokumentów to odczyt danych z faktur i innych dokumentów, ekstrakcja potrzebnych pól, uporządkowanie, sprawdzenie i przekazanie danych do dalszej pracy. Zamieniamy dokumenty w dane, którym można zaufać na tyle, na ile pozwala ich jakość, a wątpliwe przypadki oddajemy człowiekowi.",
      notAi: "Nie każdy dokument wymaga AI.",
      notAiText: "Szablony, reguły, OCR i AI można łączyć. Wybór zależy od formatu dokumentów, jakości wejścia, rodzaju informacji i wymagań procesu.",
      indexLabel: "INDEKS DOKUMENTÓW",
      detailsLabel: "Pola i sposób przetwarzania",
      columns: {
        fields: "TYPOWE POLA",
        method: "MOŻLIWY SPOSÓB PRZETWARZANIA"
      },
      families: [
        {
          n: "01",
          tag: "FINANSE",
          title: "Dokumenty finansowe",
          desc: "Faktury kosztowe i sprzedażowe, także jako skany i PDF. Dane są gotowe do księgowania lub dalszej obróbki po sprawdzeniu.",
          fields: [
            "NUMER",
            "DATA",
            "KONTRAHENT",
            "NIP",
            "POZYCJE",
            "KWOTY",
            "TERMIN PŁATNOŚCI"
          ],
          how: "Przy stałym układzie wystarczą szablony i reguły. Przy wielu układach przydaje się elastyczny odczyt, także z AI, a skany wymagają OCR."
        },
        {
          n: "02",
          tag: "ZAMÓWIENIA",
          title: "Zamówienia i dokumenty sprzedażowe",
          desc: "Zamówienia, oferty i potwierdzenia przesyłane w różnych układach, często jako PDF.",
          fields: [
            "POZYCJE",
            "ILOŚCI",
            "ODBIORCA",
            "NUMER ZAMÓWIENIA"
          ],
          how: "Odczyt pozycji i dopasowanie ich do katalogu produktów regułami. AI może pomóc przy układach, które się różnią, a pozycje bez dopasowania trafiają do człowieka."
        },
        {
          n: "03",
          tag: "UMOWY",
          title: "Umowy i załączniki",
          desc: "Wyszukiwanie kluczowych elementów: stron, terminów, kwot i okresów wypowiedzenia. Wynik jest materiałem do przeglądu i nie zastępuje oceny prawnika.",
          fields: [
            "STRONY",
            "DATY",
            "OKRES WYPOWIEDZENIA",
            "KWOTY",
            "ZAŁĄCZNIKI"
          ],
          how: "Treść jest swobodna, więc przydaje się odczyt z AI, ale każdy odczyt wymaga potwierdzenia przez osobę odpowiedzialną."
        },
        {
          n: "04",
          tag: "FORMULARZE",
          title: "Formularze, wnioski i zgłoszenia",
          desc: "Formularze, wnioski i zgłoszenia papierowe lub w skanie. Pola trafiają do systemu w ustalonej strukturze.",
          fields: [
            "POLA FORMULARZA",
            "PODPIS",
            "ZAŁĄCZNIKI",
            "DATA"
          ],
          how: "Przy stałym formularzu sprawdza się szablon z OCR. Pismo odręczne i słaby skan często wymagają weryfikacji."
        },
        {
          n: "05",
          tag: "PRZYCHODZĄCE",
          title: "Korespondencja i dokumenty przychodzące",
          desc: "Załączniki z poczty i dokumenty z różnych kanałów, rozpoznawane i kierowane dalej według typu.",
          fields: [
            "TYP DOKUMENTU",
            "NADAWCA",
            "TEMAT",
            "ZAŁĄCZNIK"
          ],
          how: "Typ i nadawcę często da się rozpoznać regułami. AI jest opcjonalne przy treści nieustrukturyzowanej, na przykład gdy wiadomość nie ma stałego układu."
        }
      ],
      assistantNote: [
        {
          t: "Dokumenty mogą też służyć jako wiedza, w której pracownik wyszukuje odpowiedzi. To zadanie dla "
        },
        {
          l: "asystenci-ai",
          t: "asystentów AI"
        },
        {
          t: ". Tutaj zajmujemy się zamianą dokumentów w dane."
        }
      ]
    },
    how: {
      heading: [
        "DROGA",
        "DOKUMENTU"
      ],
      intro: "Poniżej widok pracownika, który sprawdza wynik przetwarzania jednego dokumentu: skan obok odczytanych pól, z oznaczeniem, co zostało odczytane, co wymaga sprawdzenia, a czego brakuje. To ilustracja, nie działający system.",
      demo: {
        windowLabel: "WIDOK WERYFIKACJI / PRZYKŁAD KONCEPCYJNY",
        badge: "PRZYKŁAD KONCEPCYJNY",
        fictional: "Dokument, firmy i kwoty są fikcyjne. To demonstracja, a nie działający system OCR.",
        docLabel: "DOKUMENT",
        fieldsLabel: "ODCZYTANE POLA",
        detailLabel: "SZCZEGÓŁY POLA",
        selectHint: "Wybierz pole, aby zobaczyć je w dokumencie.",
        status: {
          read: "ODCZYTANE",
          check: "WYMAGA SPRAWDZENIA",
          missing: "BRAK DANYCH"
        },
        doc: {
          title: "FAKTURA",
          numberLabel: "Nr",
          number: "FV/EX/0142",
          dateLabel: "Data wystawienia",
          date: "12.03.2025",
          sellerLabel: "Sprzedawca",
          seller: "Przykładowa Firma Sp. z o.o.",
          sellerId: "NIP 000-000-00-00",
          buyerLabel: "Nabywca",
          buyer: "Wzorcowy Odbiorca S.A.",
          orderLabel: "Zamówienie",
          order: "ZAM/EX/031",
          itemsHead: [
            "Pozycja",
            "Ilość",
            "Cena",
            "Wartość"
          ],
          items: [
            [
              "Usługa A",
              "2",
              "500,00 zł",
              "1 000,00 zł"
            ],
            [
              "Usługa B",
              "1",
              "250,00 zł",
              "250,00 zł"
            ]
          ],
          net: [
            "Netto",
            "1 250,00 zł"
          ],
          vat: [
            "VAT 23%",
            "287,50 zł"
          ],
          gross: [
            "Brutto",
            "1 537,50 zł"
          ],
          dueLabel: "Termin płatności",
          dueEmpty: "(brak w dokumencie)"
        },
        fields: [
          {
            id: "number",
            label: "Numer faktury",
            value: "FV/EX/0142",
            status: "read",
            hint: "",
            detail: "Odczytane z dokumentu. Odczyt nie oznacza jeszcze zatwierdzenia."
          },
          {
            id: "date",
            label: "Data wystawienia",
            value: "12.03.2025",
            status: "read",
            hint: "",
            detail: "Odczytane z dokumentu. Format daty jest poprawny."
          },
          {
            id: "vendor",
            label: "Kontrahent",
            value: "Przykładowa Firma Sp. z o.o.",
            status: "read",
            hint: "",
            detail: "Odczytane z dokumentu. W rzeczywistym procesie nazwę i identyfikator można porównać z danymi w systemie."
          },
          {
            id: "items",
            label: "Pozycje",
            value: "2 pozycje: 1 000,00 zł i 250,00 zł",
            status: "read",
            hint: "",
            detail: "Odczytane z dokumentu. Wartości pozycji sumują się do kwoty netto 1 250,00 zł."
          },
          {
            id: "gross",
            label: "Kwota brutto",
            value: "1 537,50 zł",
            status: "check",
            hint: "Różni się od zamówienia o 50,00 zł.",
            detail: "Sumy na fakturze są spójne: 1 250,00 zł + 287,50 zł = 1 537,50 zł. Powiązane zamówienie ZAM/EX/031 opiewa na 1 487,50 zł. Różnica 50,00 zł dotyczy porównania faktury z zamówieniem i wymaga rozstrzygnięcia przed przekazaniem danych."
          },
          {
            id: "due",
            label: "Termin płatności",
            value: "—",
            status: "missing",
            hint: "Nie ma go w dokumencie.",
            detail: "W przykładowym dokumencie nie ma terminu płatności. Pole wymaga uzupełnienia albo zatrzymania przetwarzania, zależnie od reguł procesu."
          }
        ],
        validation: {
          label: "WYNIK WALIDACJI",
          rows: [
            {
              label: "Sumy na fakturze",
              result: "ZGODNE",
              tone: "ok",
              text: "Netto 1 250,00 zł + VAT 287,50 zł = brutto 1 537,50 zł."
            },
            {
              label: "Zgodność z zamówieniem",
              result: "NIEZGODNE",
              tone: "check",
              text: "Brutto 1 537,50 zł, zamówienie ZAM/EX/031: 1 487,50 zł. Różnica 50,00 zł."
            },
            {
              label: "Kompletność pól",
              result: "BRAK POLA",
              tone: "missing",
              text: "W dokumencie nie ma terminu płatności."
            }
          ],
          note: "System niczego tu nie poprawia: różnica 50,00 zł wymaga rozstrzygnięcia przez pracownika, zanim dane trafią dalej."
        },
        paths: {
          label: "DALSZE DZIAŁANIA",
          applies: "DOTYCZY TEGO DOKUMENTU",
          notApplies: "NIE DOTYCZY TEGO DOKUMENTU",
          items: [
            {
              id: "ok",
              title: "Dane zgodne z regułami",
              text: "Przekazanie do systemu, jeśli proces na to pozwala.",
              applies: false
            },
            {
              id: "mismatch",
              title: "Niezgodność",
              text: "Weryfikacja przez pracownika. Dane nie przechodzą dalej, dopóki różnica nie zostanie rozstrzygnięta.",
              applies: true
            },
            {
              id: "missing",
              title: "Brak informacji",
              text: "Uzupełnienie albo zatrzymanie przetwarzania, zależnie od reguł procesu.",
              applies: true
            }
          ]
        }
      },
      limitsSection: {
        eyebrow: "WYJĄTKI I OGRANICZENIA",
        heading: ["CO ZOSTAJE", "PO STRONIE CZŁOWIEKA"],
        summary: "Odpowiedzialności, pojęcia i powody skierowania do człowieka",
      },
      dutiesLabel: "TRZY RÓŻNE ODPOWIEDZIALNOŚCI",
      duties: [
        {
          tag: "ODCZYT",
          title: "Odczyt",
          desc: "System rozpoznaje informacje zapisane w dokumencie."
        },
        {
          tag: "WALIDACJA",
          title: "Walidacja",
          desc: "Sprawdza kompletność, format i zgodność danych z ustalonymi regułami lub innymi źródłami."
        },
        {
          tag: "ZATWIERDZENIE",
          title: "Zatwierdzenie",
          desc: "Osoba uprawniona albo uzgodniona reguła procesu decyduje o dalszym wykorzystaniu danych."
        }
      ],
      dutiesNote: "Odczyt danych to nie zatwierdzenie.",
      glossaryLabel: "KRÓTKO O POJĘCIACH",
      glossary: [
        {
          term: "OCR",
          desc: "zamienia obraz dokumentu na tekst."
        },
        {
          term: "EKSTRAKCJA",
          desc: "wyodrębnia konkretne informacje."
        },
        {
          term: "KLASYFIKACJA",
          desc: "rozpoznaje rodzaj dokumentu."
        },
        {
          term: "OBIEG",
          desc: "określa, gdzie dokument lub dane trafiają dalej."
        }
      ],
      reasonsLabel: "TYPOWE POWODY SKIEROWANIA DO CZŁOWIEKA",
      reasons: [
        "NIEWYRAŹNY SKAN",
        "BRAKUJĄCA STRONA",
        "NIEPEŁNE POLE",
        "NIEZGODNA KWOTA",
        "DUPLIKAT",
        "ROZBIEŻNOŚĆ Z ZAMÓWIENIEM",
        "NIETYPOWY UKŁAD DOKUMENTU"
      ],
      limits: "Reguły walidacji wykrywają określone niezgodności, ale nie gwarantują poprawności każdego dokumentu. Nie obiecujemy, że wszystkie błędy zostaną wykryte.",
      handoff: [
        {
          t: "Dalszą drogę danych do ERP, CRM i księgowości opisujemy w "
        },
        {
          l: "integracje-ai",
          t: "integracjach AI"
        },
        {
          t: ", a obieg, akceptacje i powiadomienia w "
        },
        {
          l: "automatyzacja-procesow",
          t: "automatyzacji procesów"
        },
        {
          t: "."
        }
      ]
    },
    useCases: {
      heading: [
        "ZASTOSOWANIA",
        "W OBIEGU DOKUMENTÓW"
      ],
      badge: "SCENARIUSZE PRZYKŁADOWE",
      labels: {
        document: "DOKUMENT",
        read: "ODCZYT",
        check: "SPRAWDZAMY",
        system: "DO SYSTEMU",
        human: "KIEDY CZŁOWIEK",
        situation: "SYTUACJA"
      },
      items: [
        {
          n: "01",
          tag: "KSIĘGOWOŚĆ",
          title: "Faktury kosztowe do księgowości",
          channel: "E-MAIL · PDF · SKAN",
          situation: "Faktury przychodzą mailem w różnych układach, a księgowa ręcznie przepisuje dane do systemu.",
          document: "Faktura kosztowa przesłana jako załącznik (PDF lub skan).",
          read: "Kontrahent, NIP, numer, daty, pozycje i kwoty.",
          check: "NIP, sumy, zgodność z zamówieniem i duplikat.",
          system: "System księgowy, po walidacji lub zatwierdzeniu, jeśli proces tego wymaga.",
          human: "Faktura niejednoznaczna, niezgodna z zamówieniem albo o niepewnym odczycie. Księgowania nie wykonujemy bez kontroli."
        },
        {
          n: "02",
          tag: "UMOWY",
          title: "Umowy i terminy",
          channel: "PDF · SKAN",
          situation: "Terminy wypowiedzenia i odnowienia są ukryte w umowach, a ich pilnowanie opiera się na ręcznej liście.",
          document: "Umowa lub aneks w PDF albo w skanie.",
          read: "Strony, daty, okres wypowiedzenia i kwoty, każda wartość z odnośnikiem do miejsca w dokumencie.",
          check: "Czy każda odczytana wartość ma wskazanie w tekście umowy.",
          system: "Rejestr umów z odnośnikiem do dokumentu.",
          human: "Zawsze: odczyt jest materiałem do potwierdzenia przez osobę odpowiedzialną. To nie jest interpretacja prawna."
        },
        {
          n: "03",
          tag: "ZAMÓWIENIA",
          title: "Zamówienia przesłane jako PDF",
          channel: "E-MAIL · PDF",
          situation: "Klienci przysyłają zamówienia plikami o różnych układach, a handlowiec przepisuje je do systemu.",
          document: "Zamówienie przesłane jako PDF.",
          read: "Pozycje, ilości i dane odbiorcy.",
          check: "Dopasowanie pozycji do katalogu produktów.",
          system: "Zamówienie w ERP.",
          human: "Pozycje bez dopasowania trafiają do handlowca."
        },
        {
          n: "04",
          tag: "KADRY / ADMINISTRACJA",
          title: "Formularze i wnioski",
          channel: "PAPIER · SKAN",
          situation: "Wnioski i formularze przychodzą w papierze lub skanie, a administracja ręcznie wprowadza ich treść do systemu.",
          document: "Wniosek lub formularz, papierowy albo w skanie.",
          read: "Pola formularza w ustalonej strukturze.",
          check: "Kompletność i czytelność pól.",
          system: "Dane w jednej strukturze w systemie.",
          human: "Brakujące lub nieczytelne pola uruchamiają zadanie uzupełnienia na podstawie oryginału."
        }
      ]
    },
    process: {
      heading: [
        "JAK WSPÓŁPRACUJEMY",
        "PRZY DOKUMENTACH"
      ],
      labels: {
        gets: "OTRZYMUJESZ",
        more: "JAK SPRAWDZAMY"
      },
      scopeNote: "Zakres wdrożenia zależy od dokumentów, systemów i wymagań procesu.",
      steps: [
        {
          n: "01",
          tag: "PRÓBKI",
          title: "Analiza typów dokumentów i próbek",
          gets: "Zestaw próbek z podziałem na typy, układy i przypadki trudne.",
          more: "Zbieramy reprezentatywne dokumenty, także słabej jakości i nietypowe. Sprawdzamy, czy próbki oddają rzeczywistą różnorodność oraz kto dziś weryfikuje te dokumenty."
        },
        {
          n: "02",
          tag: "POLA",
          title: "Ustalenie wymaganych pól",
          gets: "Listę pól potrzebnych w systemie, z oznaczeniem, które są obowiązkowe.",
          more: "Ustalamy, jakie informacje z dokumentu trafiają do systemu i w jakiej strukturze. Sprawdzamy z osobami, które pracują na tych danych, co uznają za poprawne."
        },
        {
          n: "03",
          tag: "REGUŁY",
          title: "Projekt reguł walidacji",
          gets: "Reguły sprawdzania (format, sumy, zgodność z innymi źródłami, duplikaty), zasady kierowania do człowieka i ścieżkę wyjątków.",
          more: "Ustalamy też, kiedy potrzebne jest zatwierdzenie i kto jest właścicielem każdego wyjątku. Sprawdzamy, czy reguły obejmują przypadki z próbek."
        },
        {
          n: "04",
          tag: "TESTY",
          title: "Prototyp i testy",
          gets: "Działający prototyp i wyniki odczytu na reprezentatywnych dokumentach, w tym trudnych.",
          more: "Porównujemy odczyt z poprawnymi wartościami osobno dla każdego typu dokumentu i pola. Testujemy krzywe skany, nowe układy, brakujące pola i duplikaty oraz to, czy wątpliwe przypadki naprawdę trafiają do człowieka."
        },
        {
          n: "05",
          tag: "URUCHOMIENIE",
          title: "Uruchomienie i obsługa wyjątków",
          gets: "Uruchomiony proces z widokiem weryfikacji i zasadami obsługi wyjątków.",
          more: "Zakres automatyczny poszerzamy tylko tam, gdzie wyniki są stabilne i proces na to pozwala. Nowe układy dokumentów dodajemy w miarę ich pojawiania się."
        }
      ]
    },
    faq: {
      heading: "PYTANIA O AUTOMATYZACJĘ DOKUMENTÓW",
      items: [
        {
          q: "Jak sprawdzacie skuteczność odczytu i co ze słabymi skanami?",
          a: "Jakość odczytu zależy od jakości wejścia: skan prosto i w dobrej rozdzielczości da lepszy wynik niż zdjęcie z telefonu. Nie obiecujemy odczytu bez błędów. Skuteczność sprawdzamy na reprezentatywnych dokumentach z Waszej firmy, także trudnych: porównujemy odczyt z poprawnymi wartościami osobno dla każdego typu dokumentu i pola. Dokumenty słabej jakości są oznaczane i kierowane do weryfikacji."
        },
        {
          q: "Co dzieje się z dokumentem, którego nie da się odczytać pewnie?",
          a: "Nie trafia do systemu automatycznie. Trafia do kolejki wyjątków, gdzie pracownik widzi skan obok odczytanych pól, poprawia je i zatwierdza. To pracownik, a nie system, rozstrzyga wątpliwe przypadki."
        },
        {
          q: "Co jeśli system źle odczyta kwotę?",
          a: "Odczyt może się pomylić, zwłaszcza przy słabym skanie. Walidacja wychwytuje określone niezgodności, na przykład sumy, które się nie zgadzają, albo kwotę różną od zamówienia, ale nie gwarantuje poprawności każdego dokumentu. Dlatego pracownik widzi skan obok pola, a dane o większym znaczeniu mogą wymagać zatwierdzenia. Rozbieżności są oznaczane, a nie poprawiane po cichu."
        },
        {
          q: "Czy każdy dokument wymaga AI?",
          a: "Nie. Dokumenty o stałym układzie często obsłużą szablony i reguły, a skany wymagają OCR. AI pomaga tam, gdzie układy są różnorodne albo treść jest swobodna. Metody można łączyć, a wybór zależy od formatu dokumentów, jakości wejścia, rodzaju informacji i wymagań procesu. Jeśli AI nie jest potrzebne, powiemy to wprost."
        },
        {
          q: "Czy dokumenty muszą mieć jeden szablon?",
          a: "Nie, ale to wpływa na dobór metody. Stały układ można obsłużyć szablonem, a przy wielu układach przydaje się bardziej elastyczny odczyt, także z AI. Nowe, nietypowe układy mogą na początku częściej trafiać do weryfikacji, a ich obsługę dodajemy w miarę ich pojawiania się."
        },
        {
          q: "Czy dokument może wymagać zatwierdzenia przez człowieka?",
          a: "Tak. Odczyt danych to nie zatwierdzenie. W zależności od typu dokumentu i ryzyka proces może przewidywać zatwierdzenie zawsze, tylko w wyjątkach albo wcale, a rolę człowieka może też przejąć uzgodniona reguła. To ustalamy przy projektowaniu reguł, a decyzja należy do osoby uprawnionej."
        },
        {
          q: "Jak dane trafiają do mojego systemu: księgowość, ERP, CRM?",
          a: "Przez integrację z interfejsem systemu albo, gdy go brakuje, przez kontrolowany import plików. Dane przekazujemy po walidacji lub zatwierdzeniu, tam gdzie proces tego wymaga, a identyfikator dokumentu pomaga unikać duplikatów. Konkretne rozwiązanie zależy od możliwości Waszego systemu."
        },
        {
          q: "Co z dokumentami zawierającymi dane poufne lub osobowe?",
          a: "Bezpieczeństwo zależy od projektu całości: miejsca przetwarzania, dostępu do dokumentów, okresu przechowywania i logów. Ustalamy je przed budową, zgodnie z Waszymi wymaganiami i obowiązkami wynikającymi z RODO. Podpisujemy umowę powierzenia, a gdy trzeba, konfigurujemy przetwarzanie w UE. Dostęp do dokumentów ograniczamy do osób, które go potrzebują, a przy projekcie ustalamy, czy dokumenty poufne mogą być przetwarzane zewnętrznymi usługami."
        }
      ]
    },
    manifesto: {
      lines: ["NIE UDAJEMY, ŻE KAŻDY DOKUMENT DA SIĘ ODCZYTAĆ.", "NIE PRZEKAZUJEMY DANYCH DALEJ BEZ WALIDACJI.", "NIE ZOSTAWIAMY WYJĄTKÓW BEZ WŁAŚCICIELA."],
      final: ["DANE,", "KTÓRE MOŻNA", "SPRAWDZIĆ."],
      steps: ["WEJŚCIE", "OCR", "EKSTRAKCJA", "WALIDACJA", "WYJĄTKI", "SYSTEM"],
    },
    cta: {
      heading: [
        "CHCESZ ZAMIENIĆ",
        "DOKUMENTY W DANE?"
      ],
      sub: "Opisz, jakie dokumenty otrzymuje firma, co dziś robi się z nimi ręcznie, jakie informacje trzeba z nich wyciągnąć i do jakiego systemu mają trafić dane. Przykładowe dokumenty, także trudne, omówimy po pierwszym kontakcie. Nie przesyłaj w formularzu dokumentów z danymi poufnymi. Pierwsza rozmowa i diagnoza są bezpłatne.",
      button: "Umów bezpłatną rozmowę"
    },
    related: {
      heading: "POWIĄZANE USŁUGI",
      items: [
        {
          slug: "integracje-ai",
          why: "Przekazanie danych z dokumentów do księgowości, ERP i innych systemów.",
        },
        {
          slug: "automatyzacja-procesow",
          why: "Obieg, który zaczyna się od dokumentu: akceptacje, powiadomienia, kolejne kroki.",
        },
      ],
    },
  },
  en: {
    seo: {
      title: "Document and invoice automation (OCR, AI) | VANTAFRAME",
      description:
        "We automate document workflows: invoices, contracts, orders and forms. Data extraction (OCR, AI), validation and handing data over to your systems. Free diagnosis.",
      ogTitle: "Document and invoice automation with OCR and AI",
      serviceType: "Document and document-workflow automation",
    },
    hero: {
      eyebrow: "06 / DOCUMENT AUTOMATION",
      h1: ["DOCUMENT", "AUTOMATION: FROM", "SCAN TO DATA."],
      lead: "Document automation covers invoices, contracts and forms: OCR reading, data extraction, validation and exception handling. Data goes into your systems, and documents that cannot be read with confidence go to a person.",
      cta: "Book a free call",
      visualCaption: "DOCUMENT PATH",
      visualA11y:
        "Diagram of a document's path: a scan or file comes in, OCR reads it, fields are extracted, data is validated and passed to a system. Documents with uncertain reading or a validation error go down an exception path to a person.",
    },
    valueStrip: {
      problem: "Someone reads documents and retypes them.",
      effect: "The data arrives organised and checked, and doubtful documents go to a person.",
      audience: "Accounting, sales and administration.",
    },
    capabilities: {
      heading: [
        "WHAT WE",
        "PROCESS"
      ],
      intro: "Document workflow automation means reading data from invoices and other documents, extracting the fields you need, organising and checking them, and passing the data on for further work. We turn documents into data you can trust as far as their quality allows, and hand doubtful cases to a person.",
      notAi: "Not every document needs AI.",
      notAiText: "Templates, rules, OCR and AI can be combined. The choice depends on the document format, the quality of the input, the kind of information and the requirements of the process.",
      indexLabel: "DOCUMENT INDEX",
      detailsLabel: "Fields and how it is processed",
      columns: {
        fields: "TYPICAL FIELDS",
        method: "POSSIBLE WAY OF PROCESSING"
      },
      families: [
        {
          n: "01",
          tag: "FINANCE",
          title: "Financial documents",
          desc: "Purchase and sales invoices, including scans and PDFs. After checking, the data is ready for booking or further processing.",
          fields: [
            "NUMBER",
            "DATE",
            "COUNTERPARTY",
            "TAX ID",
            "LINE ITEMS",
            "AMOUNTS",
            "DUE DATE"
          ],
          how: "With a fixed layout, templates and rules are enough. With many layouts, flexible reading helps, including AI, and scans need OCR."
        },
        {
          n: "02",
          tag: "ORDERS",
          title: "Orders and sales documents",
          desc: "Orders, quotes and confirmations sent in different layouts, often as PDFs.",
          fields: [
            "LINE ITEMS",
            "QUANTITIES",
            "RECIPIENT",
            "ORDER NUMBER"
          ],
          how: "Reading line items and matching them to the product catalogue with rules. AI can help with layouts that differ, and items with no match go to a person."
        },
        {
          n: "03",
          tag: "CONTRACTS",
          title: "Contracts and attachments",
          desc: "Finding key elements: parties, dates, amounts and notice periods. The result is material for review and does not replace a lawyer's judgement.",
          fields: [
            "PARTIES",
            "DATES",
            "NOTICE PERIOD",
            "AMOUNTS",
            "ATTACHMENTS"
          ],
          how: "The text is free-form, so reading with AI helps, but every reading needs confirmation by the responsible person."
        },
        {
          n: "04",
          tag: "FORMS",
          title: "Forms, applications and requests",
          desc: "Forms, applications and submissions on paper or as scans. Fields reach the system in an agreed structure.",
          fields: [
            "FORM FIELDS",
            "SIGNATURE",
            "ATTACHMENTS",
            "DATE"
          ],
          how: "For a fixed form, a template with OCR works well. Handwriting and poor scans often need verification."
        },
        {
          n: "05",
          tag: "INBOUND",
          title: "Correspondence and incoming documents",
          desc: "Email attachments and documents from various channels, recognised and routed by type.",
          fields: [
            "DOCUMENT TYPE",
            "SENDER",
            "SUBJECT",
            "ATTACHMENT"
          ],
          how: "The type and sender can often be recognised with rules. AI is optional for unstructured content, for example when a message has no fixed layout."
        }
      ],
      assistantNote: [
        {
          t: "Documents can also serve as knowledge in which employees look up answers. That is a job for "
        },
        {
          l: "asystenci-ai",
          t: "AI assistants"
        },
        {
          t: ". Here we deal with turning documents into data."
        }
      ]
    },
    how: {
      heading: [
        "A DOCUMENT'S",
        "PATH"
      ],
      intro: "Below is the view of an employee checking the result of processing one document: the scan next to the fields that were read, marked as read, needing a check, or missing. It is an illustration, not a working system.",
      demo: {
        windowLabel: "VERIFICATION VIEW / CONCEPTUAL EXAMPLE",
        badge: "CONCEPTUAL EXAMPLE",
        fictional: "The document, companies and amounts are fictional. This is a demonstration, not a working OCR system.",
        docLabel: "DOCUMENT",
        fieldsLabel: "FIELDS READ",
        detailLabel: "FIELD DETAILS",
        selectHint: "Choose a field to see it in the document.",
        status: {
          read: "READ",
          check: "NEEDS CHECKING",
          missing: "NO DATA"
        },
        doc: {
          title: "INVOICE",
          numberLabel: "No.",
          number: "FV/EX/0142",
          dateLabel: "Issue date",
          date: "12.03.2025",
          sellerLabel: "Seller",
          seller: "Example Company Ltd.",
          sellerId: "Tax ID 000-000-00-00",
          buyerLabel: "Buyer",
          buyer: "Sample Buyer Inc.",
          orderLabel: "Order",
          order: "ZAM/EX/031",
          itemsHead: [
            "Item",
            "Qty",
            "Price",
            "Amount"
          ],
          items: [
            [
              "Service A",
              "2",
              "PLN 500.00",
              "PLN 1,000.00"
            ],
            [
              "Service B",
              "1",
              "PLN 250.00",
              "PLN 250.00"
            ]
          ],
          net: [
            "Net",
            "PLN 1,250.00"
          ],
          vat: [
            "VAT 23%",
            "PLN 287.50"
          ],
          gross: [
            "Gross",
            "PLN 1,537.50"
          ],
          dueLabel: "Payment due",
          dueEmpty: "(not in the document)"
        },
        fields: [
          {
            id: "number",
            label: "Invoice number",
            value: "FV/EX/0142",
            status: "read",
            hint: "",
            detail: "Read from the document. Reading it is not yet approval."
          },
          {
            id: "date",
            label: "Issue date",
            value: "12.03.2025",
            status: "read",
            hint: "",
            detail: "Read from the document. The date format is valid."
          },
          {
            id: "vendor",
            label: "Counterparty",
            value: "Example Company Ltd.",
            status: "read",
            hint: "",
            detail: "Read from the document. In a real process the name and identifier can be compared with the data in the system."
          },
          {
            id: "items",
            label: "Line items",
            value: "2 items: PLN 1,000.00 and PLN 250.00",
            status: "read",
            hint: "",
            detail: "Read from the document. The item amounts add up to the net total of PLN 1,250.00."
          },
          {
            id: "gross",
            label: "Gross amount",
            value: "PLN 1,537.50",
            status: "check",
            hint: "Differs from the order by PLN 50.00.",
            detail: "The totals on the invoice are consistent: PLN 1,250.00 + PLN 287.50 = PLN 1,537.50. The related order ZAM/EX/031 is for PLN 1,487.50. The PLN 50.00 difference comes from comparing the invoice with the order and needs to be resolved before the data is passed on."
          },
          {
            id: "due",
            label: "Payment due date",
            value: "—",
            status: "missing",
            hint: "Not in the document.",
            detail: "The example document has no payment due date. The field needs to be completed, or processing stopped, depending on the process rules."
          }
        ],
        validation: {
          label: "VALIDATION RESULT",
          rows: [
            {
              label: "Totals on the invoice",
              result: "CONSISTENT",
              tone: "ok",
              text: "Net PLN 1,250.00 + VAT PLN 287.50 = gross PLN 1,537.50."
            },
            {
              label: "Match with the order",
              result: "MISMATCH",
              tone: "check",
              text: "Gross PLN 1,537.50, order ZAM/EX/031: PLN 1,487.50. A difference of PLN 50.00."
            },
            {
              label: "Field completeness",
              result: "FIELD MISSING",
              tone: "missing",
              text: "The document has no payment due date."
            }
          ],
          note: "The system corrects nothing here: the PLN 50.00 difference needs to be resolved by an employee before the data goes any further."
        },
        paths: {
          label: "WHAT HAPPENS NEXT",
          applies: "APPLIES TO THIS DOCUMENT",
          notApplies: "DOES NOT APPLY TO THIS DOCUMENT",
          items: [
            {
              id: "ok",
              title: "Data consistent with the rules",
              text: "Passed to the system, if the process allows it.",
              applies: false
            },
            {
              id: "mismatch",
              title: "Mismatch",
              text: "Verification by an employee. The data does not move on until the difference is resolved.",
              applies: true
            },
            {
              id: "missing",
              title: "Missing information",
              text: "Completion or stopping the processing, depending on the process rules.",
              applies: true
            }
          ]
        }
      },
      limitsSection: {
        eyebrow: "EXCEPTIONS AND LIMITS",
        heading: ["WHAT STAYS", "WITH PEOPLE"],
        summary: "Responsibilities, terms and reasons to send a document to a person",
      },
      dutiesLabel: "THREE DIFFERENT RESPONSIBILITIES",
      duties: [
        {
          tag: "READ",
          title: "Reading",
          desc: "The system recognises the information written in the document."
        },
        {
          tag: "VALIDATE",
          title: "Validation",
          desc: "It checks completeness, format and the consistency of the data with agreed rules or other sources."
        },
        {
          tag: "APPROVE",
          title: "Approval",
          desc: "An authorised person, or an agreed process rule, decides how the data may be used next."
        }
      ],
      dutiesNote: "Reading data is not approval.",
      glossaryLabel: "THE TERMS IN BRIEF",
      glossary: [
        {
          term: "OCR",
          desc: "turns an image of a document into text."
        },
        {
          term: "EXTRACTION",
          desc: "pulls out specific pieces of information."
        },
        {
          term: "CLASSIFICATION",
          desc: "recognises what kind of document it is."
        },
        {
          term: "WORKFLOW",
          desc: "decides where a document or its data goes next."
        }
      ],
      reasonsLabel: "TYPICAL REASONS TO SEND A DOCUMENT TO A PERSON",
      reasons: [
        "BLURRY SCAN",
        "MISSING PAGE",
        "INCOMPLETE FIELD",
        "MISMATCHED AMOUNT",
        "DUPLICATE",
        "DIFFERS FROM THE ORDER",
        "UNUSUAL LAYOUT"
      ],
      limits: "Validation rules catch specific inconsistencies, but they do not guarantee that every document is correct. We do not promise that every error will be caught.",
      handoff: [
        {
          t: "We cover the onward path of data to the ERP, CRM and accounting in "
        },
        {
          l: "integracje-ai",
          t: "AI integration"
        },
        {
          t: ", and workflow, approvals and notifications in "
        },
        {
          l: "automatyzacja-procesow",
          t: "process automation"
        },
        {
          t: "."
        }
      ]
    },
    useCases: {
      heading: [
        "DOCUMENT WORKFLOW",
        "USE CASES"
      ],
      badge: "EXAMPLE SCENARIOS",
      labels: {
        document: "DOCUMENT",
        read: "READ",
        check: "WE CHECK",
        system: "TO THE SYSTEM",
        human: "WHEN A PERSON STEPS IN",
        situation: "SITUATION"
      },
      items: [
        {
          n: "01",
          tag: "ACCOUNTING",
          title: "Purchase invoices to accounting",
          channel: "EMAIL · PDF · SCAN",
          situation: "Invoices arrive by email in different layouts, and an accountant retypes the data into the system by hand.",
          document: "A purchase invoice sent as an attachment (PDF or scan).",
          read: "Counterparty, tax ID, number, dates, line items and amounts.",
          check: "Tax ID, totals, match with the order, and duplicates.",
          system: "The accounting system, after validation or approval where the process requires it.",
          human: "An ambiguous invoice, one that does not match the order, or one read with low confidence. We do not book anything without control."
        },
        {
          n: "02",
          tag: "CONTRACTS",
          title: "Contracts and deadlines",
          channel: "PDF · SCAN",
          situation: "Notice and renewal dates are buried in contracts, so tracking them relies on a manual list.",
          document: "A contract or an annex as a PDF or a scan.",
          read: "Parties, dates, notice period and amounts, each value with a pointer to its place in the document.",
          check: "Whether every value read has a place in the text of the contract.",
          system: "A contract register with a link to the document.",
          human: "Always: the reading is material for the responsible person to confirm. It is not a legal interpretation."
        },
        {
          n: "03",
          tag: "ORDERS",
          title: "Orders sent as PDFs",
          channel: "EMAIL · PDF",
          situation: "Customers send orders as files in different layouts, and a salesperson retypes them into the system.",
          document: "An order sent as a PDF.",
          read: "Line items, quantities and recipient details.",
          check: "Matching the items to the product catalogue.",
          system: "The order in the ERP.",
          human: "Items with no match go to the salesperson."
        },
        {
          n: "04",
          tag: "HR / ADMIN",
          title: "Forms and applications",
          channel: "PAPER · SCAN",
          situation: "Applications and forms arrive on paper or as scans, and administration retypes their content into the system by hand.",
          document: "An application or form, on paper or as a scan.",
          read: "The form fields, in an agreed structure.",
          check: "Completeness and legibility of the fields.",
          system: "The data in one structure in the system.",
          human: "Missing or illegible fields start a task to complete them from the original."
        }
      ]
    },
    process: {
      heading: [
        "HOW WE WORK",
        "ON DOCUMENTS"
      ],
      labels: {
        gets: "YOU RECEIVE",
        more: "HOW WE CHECK"
      },
      scopeNote: "The scope of a project depends on the documents, the systems and the requirements of the process.",
      steps: [
        {
          n: "01",
          tag: "SAMPLES",
          title: "Analysing document types and samples",
          gets: "A set of samples split into types, layouts and difficult cases.",
          more: "We collect representative documents, including poor-quality and unusual ones. We check whether the samples reflect the real variety, and who verifies these documents today."
        },
        {
          n: "02",
          tag: "FIELDS",
          title: "Defining the required fields",
          gets: "A list of the fields the system needs, marking which are mandatory.",
          more: "We establish which information from the document goes into the system and in what structure. We check with the people who work with this data what they consider correct."
        },
        {
          n: "03",
          tag: "RULES",
          title: "Designing the validation rules",
          gets: "The checking rules (format, totals, consistency with other sources, duplicates), the rules for sending a document to a person, and the exception path.",
          more: "We also establish when approval is needed and who owns each exception. We check that the rules cover the cases found in the samples."
        },
        {
          n: "04",
          tag: "TESTING",
          title: "Prototype and tests",
          gets: "A working prototype and reading results on representative documents, including difficult ones.",
          more: "We compare the reading with the correct values separately for each document type and field. We test crooked scans, new layouts, missing fields and duplicates, and whether doubtful cases really reach a person."
        },
        {
          n: "05",
          tag: "ROLLOUT",
          title: "Launch and exception handling",
          gets: "A running process with a verification view and rules for handling exceptions.",
          more: "We widen the automatic scope only where results are stable and the process allows it. We add new document layouts as they appear."
        }
      ]
    },
    faq: {
      heading: "QUESTIONS ABOUT DOCUMENT AUTOMATION",
      items: [
        {
          q: "How do you check reading accuracy, and what about poor scans?",
          a: "The quality of the reading depends on the quality of the input: a straight scan at good resolution gives a better result than a phone photo. We do not promise error-free reading. We check accuracy on representative documents from your company, including difficult ones: we compare the reading with the correct values separately for each document type and field. Poor-quality documents are flagged and sent for verification."
        },
        {
          q: "What happens to a document that cannot be read with confidence?",
          a: "It does not go into the system automatically. It goes to an exception queue, where an employee sees the scan next to the fields that were read, corrects them and approves. It is the employee, not the system, who decides doubtful cases."
        },
        {
          q: "What if the system misreads an amount?",
          a: "Reading can be wrong, especially from a poor scan. Validation catches specific inconsistencies, for example totals that do not add up or an amount that differs from the order, but it does not guarantee that every document is correct. That is why the employee sees the scan next to the field, and data of greater importance may require approval. Discrepancies are flagged, not corrected silently."
        },
        {
          q: "Does every document need AI?",
          a: "No. Documents with a fixed layout can often be handled with templates and rules, and scans need OCR. AI helps where layouts vary or the content is free-form. The methods can be combined, and the choice depends on the document format, the quality of the input, the kind of information and the requirements of the process. If AI is not needed, we will say so plainly."
        },
        {
          q: "Must documents all follow one template?",
          a: "No, but it affects the choice of method. A fixed layout can be handled with a template, while with many layouts more flexible reading helps, including AI. New, unusual layouts may go to verification more often at first, and we add support for them as they appear."
        },
        {
          q: "Can a document require approval by a person?",
          a: "Yes. Reading data is not approval. Depending on the type of document and the risk, a process can require approval always, only for exceptions, or not at all, and an agreed rule can also take over the role of the person. We establish this when designing the rules, and the decision belongs to an authorised person."
        },
        {
          q: "How does data get into my system: accounting, ERP, CRM?",
          a: "Through an integration with the system's interface or, when there is none, through a controlled file import. We pass data on after validation or approval where the process requires it, and a document identifier helps avoid duplicates. The specific solution depends on what your system allows."
        },
        {
          q: "What about documents that contain confidential or personal data?",
          a: "Security depends on the design of the whole: where processing happens, who has access to the documents, how long they are kept and the logs. We set them before building, in line with your requirements and your obligations under GDPR. We sign a data processing agreement and, where needed, configure processing in the EU. We limit access to documents to the people who need it, and in the project we establish whether confidential documents may be processed by external services."
        }
      ]
    },
    manifesto: {
      lines: ["WE DO NOT PRETEND EVERY DOCUMENT CAN BE READ.", "WE DO NOT PASS DATA ON WITHOUT VALIDATION.", "WE DO NOT LEAVE EXCEPTIONS WITHOUT AN OWNER."],
      final: ["DATA FROM DOCS", "THAT CAN BE", "CHECKED."],
      steps: ["INPUT", "OCR", "EXTRACTION", "VALIDATION", "EXCEPTIONS", "SYSTEM"],
    },
    cta: {
      heading: [
        "WANT TO TURN DOCUMENTS",
        "INTO DATA?"
      ],
      sub: "Describe the documents your company receives, what is done with them by hand today, what information needs to be pulled out of them and which system the data should go to. We will discuss sample documents, including difficult ones, after the first contact. Please do not send documents containing confidential data through the form. The first call and diagnosis are free.",
      button: "Book a free call"
    },
    related: {
      heading: "RELATED SERVICES",
      items: [
        {
          slug: "integracje-ai",
          why: "Passing data from documents to accounting, the ERP and other systems.",
        },
        {
          slug: "automatyzacja-procesow",
          why: "The flow that begins with a document: approvals, notifications, next steps.",
        },
      ],
    },
  },
};