# Polityka prywatności i plików cookies serwisu VANTAFRAME

**Wersja robocza z 21 lipca 2026 r.**

Dokument zawiera pola oznaczone `[UZUPEŁNIĆ]`. Nie należy publikować go jako wersji ostatecznej przed potwierdzeniem informacji wymienionych w liście kontrolnej na końcu, w szczególności warunków korzystania z FormSubmit.

---

## TREŚĆ DO PUBLIKACJI

# Polityka prywatności i plików cookies serwisu VANTAFRAME

**Ostatnia aktualizacja: 21 lipca 2026 r.**

## 1. O tej polityce

Ta polityka wyjaśnia, w jaki sposób przetwarzamy dane osobowe użytkowników strony internetowej `https://vantaframe.pl/`, w tym dane przesyłane przez formularz kontaktowy oraz kreator projektu FRAMEWORK. Opisuje również wykorzystywanie plików cookies i pamięci `localStorage`.

Polityka realizuje obowiązek informacyjny wynikający w szczególności z art. 13 rozporządzenia (UE) 2016/679 (RODO) oraz uwzględnia zasady dotyczące przechowywania informacji w urządzeniu użytkownika określone w art. 399 ustawy z 12 lipca 2024 r. – Prawo komunikacji elektronicznej.

## 2. Administrator danych

Administratorem danych osobowych jest:

**VANTAFRAME SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ** z siedzibą w Krakowie, ul. Żułowska 33 lok. 10, 31-436 Kraków, Polska, wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego pod numerem KRS 0001253958, NIP 9452332952, REGON 545245372, dalej „Administrator” albo „VANTAFRAME”.

Kontakt z Administratorem:

- e-mail: `kontakt@vantaframe.pl`;
- telefon: `+48 794 659 528`;
- korespondencyjnie: ul. Żułowska 33 lok. 10, 31-436 Kraków, Polska.

Administrator nie wyznaczył inspektora ochrony danych. We wszystkich sprawach dotyczących prywatności i realizacji praw można kontaktować się bezpośrednio z Administratorem przy użyciu powyższych danych.

## 3. Cele, zakres, podstawy prawne i okresy przetwarzania

Przetwarzamy tylko dane potrzebne do realizacji poniższych celów.

| Cel | Zakres danych | Podstawa prawna i prawnie uzasadniony interes | Okres przechowywania | Odbiorcy |
|---|---|---|---|---|
| Obsługa formularza kontaktowego i korespondencji | imię i nazwisko, adres e-mail, treść wiadomości oraz – jeżeli są rejestrowane – data i godzina wysłania, adres IP, dane przeglądarki i inne techniczne dane żądania | art. 6 ust. 1 lit. b RODO, gdy wiadomość zmierza do zawarcia umowy lub podjęcia działań przed jej zawarciem na żądanie użytkownika; w pozostałych przypadkach art. 6 ust. 1 lit. f RODO. Uzasadnionym interesem jest obsługa zapytań, prowadzenie komunikacji biznesowej i zachowanie ciągłości korespondencji | do 12 miesięcy od zakończenia korespondencji; jeżeli kontakt prowadzi do zawarcia umowy – przez okres realizacji umowy, spełnienia obowiązków prawnych i do upływu właściwych terminów przedawnienia roszczeń | FormSubmit, dostawca poczty e-mail, dostawca hostingu, dostawcy IT i bezpieczeństwa; doradcy prawni lub organy publiczne, gdy jest to konieczne |
| Obsługa zgłoszenia z kreatora FRAMEWORK, przygotowanie podsumowania i kontakt w sprawie projektu | imię, firma, adres e-mail, numer telefonu, odpowiedzi projektowe, wygenerowane podsumowanie, rekomendacja AI – jeżeli została użyta – oraz techniczne dane wysłania formularza, jeżeli są rejestrowane | art. 6 ust. 1 lit. b RODO w zakresie działań podejmowanych na żądanie użytkownika przed zawarciem umowy; pomocniczo art. 6 ust. 1 lit. f RODO. Uzasadnionym interesem jest obsługa zgłoszenia, poznanie potrzeb projektowych, przygotowanie odpowiedzi lub oferty i zachowanie ciągłości rozmów | do 12 miesięcy od ostatniego kontaktu; jeżeli dochodzi do zawarcia umowy – przez okres realizacji umowy, spełnienia obowiązków prawnych i do upływu właściwych terminów przedawnienia roszczeń | FormSubmit, dostawca poczty e-mail, dostawca hostingu, dostawcy IT; Anthropic wyłącznie w zakresie opisanym w kolejnym wierszu |
| Wygenerowanie opcjonalnej rekomendacji AI | do Anthropic przekazywane są wyłącznie odpowiedzi projektowe potrzebne do przygotowania rekomendacji; mechanizm został zaprojektowany tak, aby nie przekazywać imienia, firmy, adresu e-mail ani numeru telefonu. Odpowiedzi projektowe mogą jednak stać się danymi osobowymi, jeżeli użytkownik sam umieści w nich informacje pozwalające go zidentyfikować | art. 6 ust. 1 lit. a RODO – dobrowolna zgoda użytkownika na uruchomienie funkcji AI. Prawnie uzasadniony interes nie jest podstawą tego celu | po stronie VANTAFRAME dane są przetwarzane przez czas potrzebny do wygenerowania odpowiedzi; rekomendacja dołączona do wysłanego zgłoszenia jest przechowywana jak dane z FRAMEWORK. Okres retencji wejścia i wyjścia po stronie Anthropic: **[UZUPEŁNIĆ po sprawdzeniu używanego modelu, konfiguracji konta API oraz wyjątków bezpieczeństwa]** | Anthropic PBC oraz dostawca hostingu obsługujący endpoint `/api/project-recommendation` |
| Zapisywanie postępu w kreatorze FRAMEWORK | odpowiedzi projektowe i numer aktualnego kroku zapisane w `localStorage` pod kluczem `vf_framework_v1`; klucz nie zawiera danych kontaktowych | dopóki informacje pozostają wyłącznie w urządzeniu użytkownika, Administrator ich nie otrzymuje. Zapis służy dostarczeniu funkcji kreatora żądanej przez użytkownika; zastosowanie ma art. 399 ust. 3 pkt 2 Prawa komunikacji elektronicznej. Po wysłaniu odpowiedzi do VANTAFRAME lub Anthropic stosuje się podstawę właściwą dla danego celu opisanego wyżej | do chwili usunięcia danych strony przez użytkownika albo nadpisania/usunięcia klucza; obecna implementacja **[NIE MA AUTOMATYCZNEGO TERMINU USUNIĘCIA – POTWIERDZIĆ LUB WDROŻYĆ TERMIN]** | brak, dopóki dane pozostają wyłącznie w urządzeniu; po ich wysłaniu – odbiorcy wskazani dla FRAMEWORK lub rekomendacji AI |
| Zapamiętanie ustawień prywatności | informacja o wybranych ustawieniach zapisana w `localStorage` pod kluczem `vf_cookie_consent_v1` | zapis jest niezbędny do zapamiętania wyboru i nie wymaga odrębnej zgody na podstawie art. 399 ust. 3 pkt 2 Prawa komunikacji elektronicznej. Jeżeli informacja pozostaje wyłącznie w urządzeniu, Administrator jej nie otrzymuje | do chwili zmiany ustawień, wyczyszczenia danych strony albo usunięcia/nadpisania klucza | brak, jeżeli informacja pozostaje wyłącznie w urządzeniu |
| Zapewnienie bezpieczeństwa, diagnostyka błędów i przeciwdziałanie nadużyciom | w zakresie tworzonym przez hosting lub infrastrukturę: adres IP, data i godzina żądania, żądany adres URL, metoda i status odpowiedzi, identyfikatory techniczne, typ przeglądarki i urządzenia oraz dane diagnostyczne | art. 6 ust. 1 lit. f RODO. Uzasadnionym interesem jest ochrona strony i danych, wykrywanie nadużyć, zapewnienie dostępności oraz ustalanie przyczyn błędów | **[UZUPEŁNIĆ po sprawdzeniu ustawień hostingu; rekomendowany okres podstawowy: do 30 dni, z możliwością dłuższego zachowania danych dotyczących konkretnego incydentu]** | dostawca hostingu, dostawcy IT, utrzymania i bezpieczeństwa |
| Uwierzytelnianie administratorów w CMS | identyfikator sesji `vf_cms_session` oraz powiązane dane konta administratora i techniczne dane logowania, jeżeli są rejestrowane | art. 6 ust. 1 lit. f RODO. Uzasadnionym interesem jest kontrola dostępu do panelu, ochrona treści i infrastruktury oraz rozliczalność działań administracyjnych | cookie ma maksymalny okres ważności 7 dni; może zostać wcześniej unieważnione po wylogowaniu lub z przyczyn bezpieczeństwa **[POTWIERDZIĆ UNIEWAŻNIANIE PO WYLOGOWANIU]** | dostawca hostingu, dostawca bazy danych lub usług CMS – jeżeli dotyczy – oraz dostawcy IT i bezpieczeństwa |
| Ustalenie, dochodzenie lub obrona roszczeń oraz realizacja obowiązków prawnych | dane z formularzy, korespondencji i dokumentacji w zakresie niezbędnym do danej sprawy | art. 6 ust. 1 lit. f RODO – uzasadnionym interesem jest ochrona praw Administratora i obrona przed roszczeniami; art. 6 ust. 1 lit. c RODO, jeżeli przechowywanie wynika z przepisów prawa | do upływu właściwego terminu przedawnienia roszczeń albo przez okres wymagany przez przepisy prawa | doradcy prawni, księgowi lub ubezpieczyciele – jeżeli jest to potrzebne – oraz sądy, organy i inne podmioty uprawnione na podstawie prawa |

Checkbox przy formularzu, którym użytkownik potwierdza zapoznanie się z polityką prywatności, nie jest zgodą na przetwarzanie danych i nie stanowi podstawy prawnej obsługi zapytania. Potwierdza jedynie otrzymanie informacji o przetwarzaniu.

Prosimy, aby w polach opisowych nie podawać szczególnych kategorii danych, takich jak informacje o zdrowiu, poglądach politycznych, przekonaniach religijnych, pochodzeniu rasowym lub etnicznym, orientacji seksualnej, danych biometrycznych ani informacji o wyrokach i naruszeniach prawa.

## 4. Odbiorcy danych

W zależności od użytej funkcji dane mogą być udostępniane następującym odbiorcom lub kategoriom odbiorców:

1. **Dostawca hostingu:** **[UZUPEŁNIĆ pełną nazwę prawną, adres i kraj; jeżeli jest nim Vercel, wskazać właściwy podmiot i plan]**.
2. **FormSubmit**, usługa obsługująca przesłanie formularzy na adres VANTAFRAME, prezentowana jako produkt Devro Labs. Formularz kontaktowy korzysta z `https://formsubmit.co/kontakt@vantaframe.pl`, a FRAMEWORK z `https://formsubmit.co/ajax/kontakt@vantaframe.pl`. Formalna nazwa podmiotu, adres, kraj przetwarzania, okres retencji, podprocesorzy i podstawa transferu: **[UZUPEŁNIĆ PO UZYSKANIU OD DOSTAWCY]**.
3. **Dostawca poczty e-mail:** **[UZUPEŁNIĆ pełną nazwę prawną, adres i kraj]**.
4. **Anthropic PBC** – wyłącznie gdy użytkownik uruchomi opcjonalną rekomendację AI; otrzymuje odpowiedzi projektowe, bez pól z imieniem, firmą, e-mailem i telefonem.
5. **Google** – tylko jeżeli fonty są faktycznie pobierane z `fonts.googleapis.com` lub `fonts.gstatic.com`, albo jeżeli FormSubmit uruchamia Google reCAPTCHA. Zakres i właściwy podmiot Google: **[UZUPEŁNIĆ PO AUDYCIE]**.
6. **Neon/Databricks** – tylko jeżeli Neon Postgres jest używany w CMS lub portfolio. Zgodnie z opisaną architekturą dane z formularzy nie powinny trafiać do Neon; **[POTWIERDZIĆ W KODZIE I KONFIGURACJI]**.
7. **Vercel Blob** – tylko jeżeli usługa jest używana do przechowywania plików lub zdjęć CMS/portfolio. Zgodnie z opisaną architekturą dane z formularzy nie powinny trafiać do Vercel Blob; **[POTWIERDZIĆ W KODZIE I KONFIGURACJI]**.
8. Dostawcy usług IT, utrzymania, cyberbezpieczeństwa i wsparcia technicznego – w zakresie niezbędnym do realizacji ich zadań.
9. Sądy, organy administracji, organy ścigania i inne podmioty uprawnione do otrzymania danych na podstawie przepisów prawa.

Odbiorcy otrzymują tylko dane niezbędne do realizacji danego zadania. Jeżeli odbiorca przetwarza dane w imieniu VANTAFRAME, powinien działać na podstawie umowy spełniającej wymagania art. 28 RODO.

## 5. Przekazywanie danych poza Europejski Obszar Gospodarczy

Niektórzy dostawcy mogą przetwarzać dane w Stanach Zjednoczonych lub innych państwach poza Europejskim Obszarem Gospodarczym. Transfer może nastąpić tylko wtedy, gdy istnieje podstawa przewidziana w rozdziale V RODO, na przykład decyzja Komisji Europejskiej stwierdzająca odpowiedni stopień ochrony albo standardowe klauzule umowne Komisji Europejskiej wraz z odpowiednimi środkami uzupełniającymi.

| Dostawca | Możliwy transfer | Zabezpieczenie |
|---|---|---|
| Anthropic PBC | Stany Zjednoczone i lokalizacje podprocesorów | jeżeli VANTAFRAME korzysta bezpośrednio z komercyjnego Claude API na warunkach Anthropic, opublikowany Data Processing Addendum włącza standardowe klauzule umowne; **[POTWIERDZIĆ właściwe konto, umowę, model i konfigurację]** |
| Vercel Inc. – jeżeli używany | Stany Zjednoczone i globalna infrastruktura/podprocesorzy | opublikowany DPA przewiduje standardowe klauzule umowne dla planów Pro i Enterprise; **[POTWIERDZIĆ plan, właściwy podmiot, region i objęcie DPA]** |
| FormSubmit / Devro Labs | **[UZUPEŁNIĆ kraj i lokalizacje]** | **[UZUPEŁNIĆ: decyzja stwierdzająca odpowiedni stopień ochrony, SCC albo inny mechanizm; do czasu potwierdzenia nie można rzetelnie opisać transferu]** |
| Dostawca poczty | **[UZUPEŁNIĆ]** | **[UZUPEŁNIĆ]** |
| Google – jeżeli używany | możliwy transfer poza EOG | **[UZUPEŁNIĆ po ustaleniu właściwej usługi, podmiotu i warunków]** |
| Neon/Databricks – jeżeli używany | Stany Zjednoczone i lokalizacje podprocesorów | **[UZUPEŁNIĆ na podstawie umowy właściwej dla konta; zweryfikować DPA, SCC i ewentualne zastosowanie EU–US Data Privacy Framework]** |

Informację o stosowanych zabezpieczeniach lub kopię właściwych postanowień można uzyskać, pisząc na `kontakt@vantaframe.pl`. Kopia może zostać odpowiednio zanonimizowana w celu ochrony tajemnic handlowych i bezpieczeństwa.

## 6. Rekomendacja AI i zautomatyzowane decyzje

Rekomendacja AI jest funkcją opcjonalną. Endpoint `/api/project-recommendation` przekazuje do Anthropic wyłącznie odpowiedzi projektowe i nie przekazuje pól z imieniem, firmą, adresem e-mail ani numerem telefonu.

Rekomendacja jest automatycznie wygenerowaną, wstępną i niewiążącą informacją pomocniczą. Może być niepełna lub niedokładna i nie zastępuje indywidualnej analizy ani oferty VANTAFRAME. Nie wywołuje skutków prawnych ani w podobny sposób istotnie nie wpływa na użytkownika.

VANTAFRAME nie podejmuje wobec użytkowników decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, w tym profilowaniu, które wywoływałyby skutki prawne lub w podobny sposób istotnie na nich wpływały w rozumieniu art. 22 RODO.

Brak zgody na rekomendację AI nie uniemożliwia wysłania zapytania ani kontaktu z VANTAFRAME. Zgodę można wycofać w dowolnym momencie na przyszłość, kontaktując się z Administratorem. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania dokonanego przed jej wycofaniem. Jeżeli rekomendacja została już dołączona do zgłoszenia, dane niezbędne do obsługi samego zgłoszenia mogą być nadal przetwarzane na innych podstawach wskazanych w tej polityce.

## 7. Czy podanie danych jest obowiązkowe

Podanie danych w formularzach jest dobrowolne. Pola oznaczone jako wymagane są jednak niezbędne do wysłania formularza, udzielenia odpowiedzi, przygotowania wstępnego podsumowania lub podjęcia działań przed zawarciem umowy. Niepodanie tych danych może uniemożliwić obsługę zapytania.

Zgoda na rekomendację AI jest całkowicie dobrowolna i nie jest warunkiem przesłania zgłoszenia. Podanie numeru telefonu i nazwy firmy jest **[UZUPEŁNIĆ: wymagane albo opcjonalne]**; jeżeli pola są opcjonalne, ich niewypełnienie nie powinno blokować formularza.

Zablokowanie albo usunięcie danych `localStorage` może spowodować, że strona nie zapamięta ustawień prywatności lub postępu w kreatorze. Zablokowanie cookie `vf_cms_session` uniemożliwi administratorom zalogowanie się do CMS, ale nie wpływa na zwykłe korzystanie z publicznej części strony.

## 8. Prawa użytkownika

Na zasadach określonych w RODO użytkownik ma prawo do:

- uzyskania potwierdzenia, czy jego dane są przetwarzane, dostępu do danych i otrzymania ich kopii;
- sprostowania nieprawidłowych danych i uzupełnienia danych niekompletnych;
- usunięcia danych, jeżeli zachodzą przesłanki określone w art. 17 RODO;
- ograniczenia przetwarzania w przypadkach określonych w art. 18 RODO;
- przenoszenia danych, gdy przetwarzanie odbywa się automatycznie na podstawie zgody lub umowy;
- wniesienia sprzeciwu – z przyczyn związanych ze szczególną sytuacją użytkownika – wobec przetwarzania opartego na art. 6 ust. 1 lit. f RODO;
- wycofania zgody w dowolnym momencie, jeżeli podstawą przetwarzania jest zgoda; wycofanie nie wpływa na zgodność z prawem wcześniejszego przetwarzania;
- niepodlegania decyzji opartej wyłącznie na zautomatyzowanym przetwarzaniu w przypadkach objętych art. 22 RODO;
- wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych, jeżeli użytkownik uważa, że dane są przetwarzane niezgodnie z prawem.

Żądanie można przesłać na `kontakt@vantaframe.pl` albo listownie na adres Administratora. Dla ochrony danych Administrator może poprosić o informacje potrzebne do potwierdzenia tożsamości osoby składającej żądanie. Poszczególne prawa nie są bezwzględne; ich zastosowanie zależy od przesłanek określonych w RODO.

Skargę można skierować do Prezesa Urzędu Ochrony Danych Osobowych, ul. Stanisława Moniuszki 1A, 00-014 Warszawa. Aktualne informacje o sposobach składania skarg są dostępne na `https://uodo.gov.pl/pl/526/2464`.

## 9. Cookies i localStorage

Cookies to małe informacje zapisywane w przeglądarce. `localStorage` to inny mechanizm pamięci przeglądarki, który pozwala stronie przechowywać dane lokalnie w urządzeniu użytkownika. Przepisy dotyczące przechowywania informacji w urządzeniu mogą mieć zastosowanie do obu mechanizmów.

Obecnie strona nie korzysta z Google Analytics, Google Tag Managera ani cookies marketingowych. Wykorzystywane są następujące mechanizmy:

| Nazwa | Mechanizm i użytkownicy | Cel i zawartość | Czas działania |
|---|---|---|---|
| `vf_cookie_consent_v1` | `localStorage`, użytkownicy strony | zapis ustawień dotyczących prywatności/cookies | do zmiany decyzji, usunięcia danych strony albo nadpisania/usunięcia klucza; obecnie brak automatycznej daty wygaśnięcia **[POTWIERDZIĆ]** |
| `vf_framework_v1` | `localStorage`, użytkownicy FRAMEWORK | odpowiedzi projektowe i aktualny krok; bez imienia, firmy, e-maila i telefonu | do usunięcia danych strony albo nadpisania/usunięcia klucza; obecnie brak automatycznej daty wygaśnięcia **[POTWIERDZIĆ LUB WDROŻYĆ TERMIN]** |
| `vf_cms_session` | cookie pierwszej strony, wyłącznie administratorzy CMS | uwierzytelnienie sesji administratora; cookie jest `HttpOnly` | maksymalnie 7 dni, z możliwością wcześniejszego unieważnienia **[POTWIERDZIĆ WYLOGOWANIE]** |

Mechanizmy niezbędne do dostarczenia funkcji żądanej przez użytkownika lub zapewnienia bezpieczeństwa nie wymagają zgody na zapis w urządzeniu, ale użytkownik musi otrzymać o nich jasną informację. Jeżeli w przyszłości zostaną wdrożone narzędzia analityczne, reklamowe lub inne niekonieczne mechanizmy, będą domyślnie wyłączone do czasu uzyskania wymaganej zgody, a polityka zostanie zaktualizowana.

Ustawienia można zmienić przez link „Ustawienia cookies” dostępny w stopce strony. Dane zapisane lokalnie można też usunąć w ustawieniach przeglądarki, czyszcząc dane witryny `vantaframe.pl`. Ustawienia przeglądarki pozwalają również blokować cookies lub pamięć strony, co może ograniczyć działanie opisanych funkcji.

## 10. Google Fonts, reCAPTCHA i zasoby zewnętrzne

Jeżeli kod strony pobiera fonty bezpośrednio z `fonts.googleapis.com` lub `fonts.gstatic.com`, przeglądarka nawiązuje połączenie z serwerami Google i przekazuje dane techniczne niezbędne do obsługi żądania, w tym adres IP i informacje o przeglądarce. **[POTWIERDZIĆ, CZY FONTY SĄ POBIERANE Z GOOGLE; JEŻELI SĄ HOSTOWANE LOKALNIE, USUNĄĆ TEN AKAPIT I GOOGLE FONTS Z LISTY ODBIORCÓW]**.

FormSubmit może korzystać z Google reCAPTCHA zależnie od konfiguracji formularza. **[POTWIERDZIĆ, CZY reCAPTCHA JEST AKTYWNA; JEŻELI TAK, OPISAĆ JEJ DZIAŁANIE, podstawę prawną, cookies, odbiorcę, retencję i transfer albo zastosować rozwiązanie niewymagające zewnętrznego trackera]**.

Samo umieszczenie linków do zewnętrznych serwisów, takich jak Instagram lub LinkedIn, nie oznacza przekazania im danych przez VANTAFRAME. Po kliknięciu linku użytkownik przechodzi jednak do serwisu zewnętrznego, który przetwarza dane zgodnie z własnymi zasadami.

## 11. Bezpieczeństwo danych

Administrator stosuje środki techniczne i organizacyjne odpowiednie do ryzyka, których celem jest ochrona danych przed utratą, zniszczeniem, zmianą, nieuprawnionym ujawnieniem lub dostępem. Dostęp do danych otrzymują tylko osoby i podmioty, które potrzebują go do wykonania swoich zadań.

Przesyłanie danych przez internet zawsze wiąże się jednak z pewnym ryzykiem. Użytkownik nie powinien wpisywać do formularzy informacji, które nie są potrzebne do obsługi zapytania.

## 12. Zmiany polityki

Polityka może być aktualizowana, jeżeli zmieni się sposób działania strony, zakres danych, dostawcy albo przepisy. Aktualna wersja jest publikowana na `vantaframe.pl` wraz z datą ostatniej aktualizacji. Jeżeli zmiana wymaga ponownego uzyskania zgody, użytkownik zostanie o nią poproszony przed uruchomieniem odpowiedniego mechanizmu.

---

## LISTA KONTROLNA PRZED PUBLIKACJĄ

1. **Forma prawna.** Dla VANTAFRAME prawidłowa forma prawna to „spółka z ograniczoną odpowiedzialnością” („sp. z o.o.”). Pełna nazwa już zawiera formę prawną, więc osobna linia w polityce nie jest konieczna.
2. **REGON.** W projekcie przyjęto 9-cyfrowy REGON podmiotu `545245372`. GUS wskazuje, że numer osoby prawnej ma 9 cyfr, a numer jednostki lokalnej 14 cyfr. Przed publikacją porównać go jeszcze z aktualnym urzędowym odpisem lub wyszukiwarką REGON; przekazane oznaczenie `54524537200000` jest 14-cyfrową postacią z zerami na końcu.
3. **Hosting.** Ustalić pełną nazwę prawną dostawcy hostingu, kraj, plan, regiony przetwarzania, retencję logów, podprocesorów i DPA. Jeżeli jest to Vercel, sprawdzić, czy konto jest Pro lub Enterprise i czy opublikowany DPA obejmuje konto.
4. **FormSubmit – warunek krytyczny.** Uzyskać pełne dane operatora, jego kraj, lokalizacje serwerów, okresy retencji, listę podprocesorów, umowę powierzenia z art. 28 RODO oraz ważny mechanizm transferu poza EOG. Publiczna polityka FormSubmit z 2019 r. nie podaje tych elementów. Jeżeli dostawca ich nie przedstawi, zastąpić FormSubmit własnym endpointem i dostawcą pocztowym oferującym DPA.
5. **Poczta.** Uzupełnić pełną nazwę dostawcy poczty, kraj, DPA, retencję i transfery. Ustawić faktyczne usuwanie wiadomości z formularzy po przyjętym okresie 12 miesięcy, o ile nie ma podstawy do dłuższego przechowywania.
6. **Anthropic.** Potwierdzić, że endpoint używa bezpośredniego komercyjnego Claude API należącego do organizacji VANTAFRAME, a nie konta konsumenckiego lub pośrednika. Zachować DPA, potwierdzić SCC, używany model, retencję, ewentualne ZDR i podprocesorów. Sprawdzić, czy endpoint nie przekazuje adresu IP użytkownika w nagłówkach do Anthropic.
7. **FRAMEWORK.** Potwierdzić, które pola są obowiązkowe. Dodać instrukcję, aby w odpowiedziach projektowych nie umieszczać danych osobowych ani danych wrażliwych. Potwierdzić, czy rekomendacja i podsumowanie są przechowywane gdziekolwiek poza e-mailem.
8. **Google Fonts.** Sprawdzić kod i ruch sieciowy. Najprostsze rozwiązanie ograniczające ryzyko to lokalne hostowanie fontów i usunięcie odwołań do `fonts.googleapis.com` oraz `fonts.gstatic.com`.
9. **reCAPTCHA.** Sprawdzić, czy FormSubmit uruchamia reCAPTCHA. Jeżeli tak, uwzględnić Google, cookies i transfer w mechanizmie zgody albo wyłączyć tę integrację i zastosować prywatnościową ochronę antyspamową.
10. **Neon Postgres i Vercel Blob.** Potwierdzić faktyczne wykorzystanie, właściwe podmioty umowne, regiony, DPA i kategorie danych. Potwierdzić, że nie przechowują leadów ani wiadomości z formularzy, jeżeli polityka ma tak stanowić.
11. **Logi.** Ustalić rzeczywisty zakres i retencję logów hostingu, funkcji API, bazy danych i systemów bezpieczeństwa. Wdrożyć kontrolowany okres, np. 30 dni dla zwykłych logów, z możliwością zachowania danych konkretnego incydentu.
12. **localStorage.** Rozważyć wdrożenie automatycznego terminu usunięcia dla `vf_framework_v1`, np. 30 dni od ostatniej aktywności, i opisać faktyczny termin. Sprawdzić działanie linku „Ustawienia cookies”.
13. **CMS.** Potwierdzić, że `vf_cms_session` ma atrybuty `Secure`, `HttpOnly` i odpowiedni `SameSite`, że wylogowanie unieważnia sesję po stronie serwera oraz że maksymalny czas wynosi 7 dni.
14. **Analityka i marketing.** Ponownie sprawdzić produkcyjną wersję strony pod kątem GA, GTM, Meta Pixel, osadzonych widgetów społecznościowych i innych skryptów. Polityka może deklarować ich brak tylko tak długo, jak faktycznie nie są używane.
15. **Procesy wewnętrzne.** Udokumentować realizację praw użytkowników, retencję, usuwanie danych, obsługę naruszeń oraz umowy powierzenia. Sama polityka prywatności nie zastępuje tych działań.

## FORMA PRAWNA – CO WPISAĆ

W przypadku VANTAFRAME wpisz:

**spółka z ograniczoną odpowiedzialnością (sp. z o.o.)**

„Spółka kapitałowa” jest szerszą kategorią i może pojawić się w niektórych formularzach, ale najbardziej precyzyjną odpowiedzią pozostaje „spółka z ograniczoną odpowiedzialnością”. Inne spotykane opcje to m.in. jednoosobowa działalność gospodarcza, spółka cywilna, spółka jawna, partnerska, komandytowa, komandytowo-akcyjna, prosta spółka akcyjna, spółka akcyjna, fundacja i stowarzyszenie. Nie dotyczą one VANTAFRAME ujawnionej w KRS jako sp. z o.o.

## ŹRÓDŁA DO WERYFIKACJI

- RODO: https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32016R0679
- Prawo komunikacji elektronicznej, art. 399: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240001221
- Skargi do Prezesa UODO: https://uodo.gov.pl/pl/526/2464
- FormSubmit – publiczna polityka: https://formsubmit.co/privacy.pdf
- Anthropic DPA: https://www.anthropic.com/legal/data-processing-addendum
- Anthropic – retencja API: https://docs.anthropic.com/en/docs/build-with-claude/zero-data-retention
- Vercel DPA: https://vercel.com/legal/dpa
- Google Fonts – prywatność: https://developers.google.com/fonts/faq/privacy
- Databricks/Neon – privacy notice: https://www.databricks.com/legal/privacynotice
- GUS – budowa numeru REGON: https://bip.stat.gov.pl/dzialalnosc-statystyki-publicznej/rejestr-regon/podmioty-i-dane-objete-rejestrem/
