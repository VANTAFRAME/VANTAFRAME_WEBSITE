---
title: "Bezpieczeństwo danych i RODO przy wdrażaniu AI: lista kontrolna"
seoTitle: "RODO i bezpieczeństwo danych przy wdrażaniu AI | VANTAFRAME"
description: "Praktyczna lista kontrolna bezpieczeństwa danych przy wdrażaniu AI w firmie: RODO, umowy powierzenia, warunki dostawcy modelu, uprawnienia, logi i AI Act."
lead: "Pytanie „co z naszymi danymi?” powinno paść na początku każdego projektu AI, a nie po uruchomieniu. Zebraliśmy kwestie, które warto rozstrzygnąć przed wdrożeniem, żeby rozwiązanie było bezpieczne i zgodne z przepisami."
category: "Bezpieczeństwo i prawo"
publishedAt: 2026-11-23
summary:
  - "Zanim dane trafią do modelu AI, ustal, jakie to dane i czy wszystkie są niezbędne."
  - "Sprawdź warunki dostawcy modelu: trenowanie na danych, miejsce przetwarzania, okres przechowywania."
  - "Zawrzyj umowy powierzenia z wykonawcą i dostawcami, którzy przetwarzają dane osobowe."
  - "Daj rozwiązaniu dostęp tylko do danych i operacji, których potrzebuje."
  - "Obowiązki z AI Act zależą od zastosowania systemu, a przepisy wchodzą w życie etapami."
faq:
  - q: "Czy mogę wysyłać dane klientów do ChatGPT?"
    a: "Zależy od wersji usługi, warunków umowy i rodzaju danych. Wersje konsumenckie i firmowe różnią się zasadami korzystania z danych. Przed użyciem danych osobowych sprawdź warunki dostawcy, podstawę prawną przetwarzania i to, czy masz zawartą umowę powierzenia. W razie wątpliwości dane lepiej zanonimizować albo ich nie przesyłać."
  - q: "Czy dane muszą być przetwarzane w Unii Europejskiej?"
    a: "RODO nie zakazuje przekazywania danych poza Europejski Obszar Gospodarczy, ale wymaga odpowiednich podstaw i zabezpieczeń. Część firm ma też wewnętrzne zasady lub wymagania klientów, które nakazują przetwarzanie w UE. Wielu dostawców modeli i chmur oferuje taką opcję."
  - q: "Kto odpowiada za dane w rozwiązaniu AI?"
    a: "Zwykle firma, która wdraża rozwiązanie, jest administratorem danych, a wykonawca i dostawcy usług przetwarzają je w jej imieniu. Role i obowiązki opisuje się w umowach powierzenia."
  - q: "Czy AI Act dotyczy małych firm?"
    a: "Tak, jeśli korzystają z systemów AI, ale zakres obowiązków zależy od zastosowania. Większość typowych zastosowań, jak asystent na dokumentach czy automatyzacja obiegu faktur, nie należy do kategorii wysokiego ryzyka. Szczegóły warto sprawdzić dla konkretnego przypadku."
relatedService:
  label: "Integracje AI"
  href: "/wdrozenia-ai/integracje-ai/"
author: "dawid-jaskiewicz"
draft: false
---
Ten artykuł porządkuje temat od strony praktycznej i nie jest poradą prawną. Przy przetwarzaniu danych osobowych na większą skalę albo przy decyzjach dotyczących ludzi warto skonsultować projekt z prawnikiem lub inspektorem ochrony danych.
## 1. Jakie dane trafią do modelu
Zacznij od listy danych, z których ma korzystać rozwiązanie:
- Czy są wśród nich dane osobowe? Jakie: kontaktowe, finansowe, dotyczące zdrowia?
- Czy wszystkie są potrzebne do wykonania zadania?
- Czy część można usunąć lub zanonimizować przed przesłaniem do modelu?
Zasada minimalizacji danych z RODO sprawdza się też technicznie: mniej danych w zapytaniu to mniejsze ryzyko i często niższy koszt.
Szczególną ostrożność zachowaj przy danych szczególnych kategorii, na przykład dotyczących zdrowia, oraz przy tajemnicy przedsiębiorstwa.
## 2. Warunki dostawcy modelu
Rozwiązania AI korzystają z modeli dostawców takich jak OpenAI, Anthropic czy Google albo z modeli uruchamianych na własnej infrastrukturze. Przed wyborem sprawdź w warunkach usługi:
- **czy dane są wykorzystywane do trenowania modeli** – w usługach dla firm i przez API dostawcy zwykle deklarują, że tego nie robią, ale wersje konsumenckie mogą mieć inne zasady,
- **jak długo dane są przechowywane** i w jakim celu, na przykład do wykrywania nadużyć,
- **gdzie są przetwarzane** i czy można wybrać region,
- **czy dostawca oferuje umowę powierzenia przetwarzania danych (DPA)**.
Warunki co jakiś czas się zmieniają, więc warto je sprawdzać przy każdym większym projekcie, a nie polegać na tym, co było prawdą rok wcześniej.
## 3. Umowy i role
W typowym wdrożeniu firma jest administratorem danych, a wykonawca i dostawcy usług (modeli, chmury, platform automatyzacji) przetwarzają dane w jej imieniu. Potrzebne są wtedy umowy powierzenia, które opisują zakres, cel i zabezpieczenia.
Warto też uzupełnić rejestr czynności przetwarzania i sprawdzić, czy informacje dla osób, których dane dotyczą, obejmują nowe przetwarzanie. Jeśli przetwarzanie może powodować wysokie ryzyko dla praw lub wolności osób, RODO wymaga oceny skutków dla ochrony danych (DPIA).
## 4. Uprawnienia i dostęp
Rozwiązanie AI powinno mieć dostęp tylko do tych danych i operacji, których wymaga zadanie. W praktyce:
- osobne konta techniczne z ograniczonymi uprawnieniami zamiast kont administratorów,
- dostęp tylko do odczytu tam, gdzie zapis nie jest potrzebny,
- respektowanie uprawnień użytkowników, na przykład w [asystencie AI na dokumentach](/wiedza/asystent-ai-na-dokumentach-firmy/),
- akceptacja człowieka przed działaniami o realnym skutku: wysłaniem wiadomości do klienta, płatnością, zmianą danych w systemie,
- bezpieczne przechowywanie kluczy API i haseł, nigdy w treści instrukcji dla modelu ani w kodzie.
## 5. Logi i monitoring
Logi pozwalają sprawdzić, co rozwiązanie zrobiło, na jakich danych i z jakim wynikiem. Są potrzebne do wykrywania błędów, wyjaśniania reklamacji i wykazania zgodności z przepisami.
Logi same jednak zawierają dane. Ustal, co jest zapisywane, kto ma do tego dostęp i po jakim czasie zapisy są usuwane.
## 6. Odporność na manipulację
Modele AI przetwarzają tekst z zewnątrz: wiadomości, dokumenty, strony internetowe. Taki tekst może zawierać polecenia, które próbują zmienić zachowanie modelu (tzw. prompt injection). Podstawowe zabezpieczenia to:
- traktowanie treści z zewnątrz jako danych, a nie poleceń,
- ograniczone uprawnienia, żeby nawet zmanipulowany model nie mógł wykonać szkodliwej operacji,
- akceptacja człowieka przy działaniach o wysokim skutku,
- testy na przykładach takich prób przed uruchomieniem.
## 7. AI Act
Unijne rozporządzenie o sztucznej inteligencji (AI Act) wprowadza obowiązki zależne od zastosowania systemu. Praktyki uznane za niedopuszczalne, na przykład niektóre formy manipulacji czy scoringu społecznego, są zakazane od lutego 2025 roku. Najwięcej wymagań dotyczy systemów wysokiego ryzyka, między innymi w rekrutacji, ocenie zdolności kredytowej osób czy dostępie do usług publicznych.
Większość typowych zastosowań w firmach, takich jak asystent na dokumentach, obsługa zapytań czy automatyzacja dokumentów, nie należy do kategorii wysokiego ryzyka. Warto jednak zadbać o przejrzystość, czyli informowanie ludzi, że rozmawiają z systemem AI, oraz o przeszkolenie zespołu, który z AI korzysta.
Przepisy AI Act wchodzą w życie etapami, a część terminów była przedmiotem dalszych prac legislacyjnych. Przed projektem, w którym AI wpływa na decyzje dotyczące ludzi, sprawdź aktualny stan przepisów.
## 8. Korzystanie z AI poza kontrolą firmy
Często największe ryzyko nie dotyczy zaplanowanego wdrożenia, tylko tego, że pracownicy już teraz wklejają dane firmy do prywatnych kont w narzędziach AI. Sam zakaz rzadko działa. Lepiej:
- ustalić proste zasady: jakie narzędzia są dozwolone i jakich danych nie wolno do nich wprowadzać,
- zapewnić firmowe narzędzie z odpowiednimi warunkami,
- przeszkolić zespół z tych zasad.
## Lista kontrolna w skrócie
Przed uruchomieniem rozwiązania AI warto móc odpowiedzieć „tak” na każde z tych pytań:
1. Wiemy, jakie dane trafiają do modelu, i wszystkie są potrzebne.
2. Sprawdziliśmy warunki dostawcy modelu: trenowanie, przechowywanie, region.
3. Mamy umowy powierzenia z wykonawcą i dostawcami.
4. Zaktualizowaliśmy rejestr czynności przetwarzania i, jeśli trzeba, przeprowadziliśmy DPIA.
5. Rozwiązanie ma tylko niezbędne uprawnienia, a działania o realnym skutku zatwierdza człowiek.
6. Logi mają ustalony zakres, dostęp i czas przechowywania.
7. Przetestowaliśmy odporność na manipulację treścią z zewnątrz.
8. Wiemy, jak zastosowanie wpisuje się w AI Act.
9. Zespół zna zasady korzystania z AI w firmie.
Bezpieczeństwo łatwiej zaprojektować na początku niż dodać po uruchomieniu. Ogólną kolejność wdrożenia opisujemy w artykule [Jak wdrożyć AI w firmie: krok po kroku](/wiedza/jak-wdrozyc-ai-w-firmie/).