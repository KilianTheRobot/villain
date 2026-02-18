# Flammenkind — kleines Textadventure

Dies ist ein minimalistisches Textadventure, das automatisch auf GitHub Pages veröffentlicht werden kann.

Kurze Anleitung:

- Die webseite liegt im Ordner `public/`.
- Auf pushes in den Branch `main` wird ein GitHub Action Workflow ausgelöst, der `public/` auf den Branch `gh-pages` deployt.
- GitHub Pages kann in den Repository-Einstellungen so konfiguriert werden, dass die Seite von `gh-pages` served wird (oder die automatische Seite von GitHub Pages wird die `gh-pages`-Branch verwenden).

Spielbeschreibung (kurz):

Der Spieler gibt einen Namen ein (Standard: Florian) und steuert einen Jugendlichen, der Feuer schießen kann. Er wurde von bösen Wölfen von seinen Eltern getrennt. Die Eltern sind in einem Schloss gefangen, das von Wölfen bewacht wird. Das Spiel endet nach etwa 10 Entscheidungen — je nach Entscheidungen variiert das Ende (Erfolg / knapper Sieg / Rückzug).

Deployment / Veröffentlichung

1. Push alle Änderungen nach `main`.
2. Der Workflow `.github/workflows/deploy.yml` (im Repo) deployed automatisch den Ordner `public/` auf die Branch `gh-pages`.
3. In GitHub: Repository -> Settings -> Pages: Stelle sicher, dass die Seite von der `gh-pages`-Branch veröffentlicht wird. Die URL wird in den Einstellungen angezeigt.

Wenn du stattdessen lieber GitHub Pages direkt von `main` (Ordner `/`) servieren willst, kannst du die Dateien aus `public/` nach Root verschieben und in Settings Pages Source auf `main / root` setzen.

Viel Spaß beim Testen!
