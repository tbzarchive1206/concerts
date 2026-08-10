# CONCERTS ARCHIVE

Samodzielne, statyczne archiwum koncertów THE BOYZ przygotowane do publikacji przez GitHub Pages. Wygląd i responsywne kafelki są zgodne z repozytoriami INSTA STORIES, INSTA POSTS i pozostałymi archiwami.

Każdy kafelek otwiera nagranie bezpośrednio w odtwarzaczu Google Drive w nowej karcie. Strona nie osadza odtwarzacza. Arkusze Google i wszystkie inne pliki, które nie są wideo, są automatycznie pomijane.

## Pierwsza publikacja

1. Utwórz publiczne repozytorium GitHub, np. `CONCERTS-ARCHIVE`.
2. Wyślij do niego całą zawartość tego folderu.
3. Dodaj `Settings → Secrets and variables → Actions → New repository secret`:
   - nazwa: `GOOGLE_DRIVE_API_KEY`
   - wartość: klucz z włączonym Google Drive API.
4. Ustaw `Settings → Actions → General → Workflow permissions → Read and write permissions`.
5. Ustaw `Settings → Pages → Build and deployment → Source → GitHub Actions`.
6. Uruchom `Actions → Update CONCERTS ARCHIVE → Run workflow`.

## Automatyczna aktualizacja

Workflow uruchamia się raz dziennie o `04:23 UTC`. Odczytuje bezpośrednią zawartość folderu Google Drive, wybiera wyłącznie pliki wideo, usuwa z wyświetlanych tytułów początkową numerację i rozszerzenie, zachowuje kolejność numerów, aktualizuje `data.js` i publikuje stronę.

Folder źródłowy: https://drive.google.com/drive/folders/1rO3U0kX8aeWhCjqiVLfeNrBjggvxPEB4
