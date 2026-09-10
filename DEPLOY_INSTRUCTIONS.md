# Instrukcja Wgrania Strony na Serwer

Twoja strona została pomyślnie zbudowana i jest gotowa do publikacji.

## 1. Lokalizacja Plików
Wszystkie pliki gotowe do wgrania znajdują się w folderze:
`dist` (w katalogu głównym projektu)

## 2. Jak wgrać na serwer (FTP / Cyberduck)?
1. Otwórz klienta FTP (np. Cyberduck, FileZilla).
2. Połącz się ze swoim serwerem hostingowym.
3. Wejdź do katalogu publicznego domeny (zazwyczaj `public_html`, `www` lub nazwa katalogu domeny).
4. **Wgraj całą zawartość folderu `dist`** do tego katalogu.
   - Upewnij się, że wgrywasz *zawartość* folderu, a nie sam folder `dist` (plik `index.html` powinien być w głównym katalogu domeny).

## 3. Formularz Kontaktowy
Formularz jest skonfigurowany z usługą **FormSubmit**.
- Po pierwszym wypełnieniu formularza na żywej stronie, na adres `kontakt@vantaframe.pl` przyjdzie mail z prośbą o aktywację ("Activate Form").
- Kliknij przycisk w mailu, aby potwierdzić adres. Od tego momentu formularz będzie działał automatycznie.

## 4. Sprawdzenie
Po wgraniu plików wejdź na swoją domenę (np. `vantaframe.pl`) i odśwież stronę (Ctrl+F5 / Cmd+Shift+R), aby upewnić się, że widzisz nową wersję.

Powodzenia!
