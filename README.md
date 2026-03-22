# expresto-examples

Beispiel-Anwendung für das Framework [expresto-server](https://github.com/tmatzke1905/expresto-server).

Dieses Repository soll eine vollständige Demo-Anwendung bereitstellen, in der `expresto-server` sowohl das React-Frontend ausliefert als auch für jedes relevante Framework-Feature passende Endpunkte, Beispielcode und Demo-Flows zur Verfügung stellt.

Zusätzlich soll eine fertig kompilierte, statische Auslieferung Teil des Repositories sein, sodass Interessenten direkt die `index.html` öffnen und sich die Anwendung ohne Setup ansehen können.

## Zielbild

Die Anwendung soll zeigen, wie ein Projekt mit `expresto-server` in der Praxis aufgebaut werden kann:

- `expresto-server` liefert die React-Anwendung und die API aus einem gemeinsamen Runtime-Kontext aus
- die Startseite ist eine Login-Seite mit sichtbar eingeblendeten statischen Demo-Credentials
- der Login läuft per HTTP Basic Auth und erzeugt danach ein JWT für alle weiteren geschützten Seiten und Requests
- nach dem Login landet der Benutzer in einer responsiven Anwendung mit Navigation über alle Framework-Features
- das Repository enthält zusätzlich eine fertig gebaute statische Vorschau, die per `index.html` lokal geöffnet werden kann
- Scheduler, EventBus und WebSocket werden über sichtbare UI-Elemente als zusammenhängende Live-Demo dargestellt
- jede Feature-Seite erklärt ein Framework-Thema mit:
  - kurzer Beschreibung
  - passender Dokumentationszusammenfassung
  - Backend-Codebeispiel
  - optionalem Frontend-Codebeispiel
  - lauffähigem Demo-Endpunkt oder Live-Beispiel

## Bestätigter Feature-Scope

Die Arbeitspakete basieren auf der aktuellen Dokumentation aus dem Upstream-Repository `expresto-server` auf Branch `main`, Stand Commit `abb6164`.

Für die erste Version der Beispiel-Anwendung werden die offiziell dokumentierten v1-Features berücksichtigt:

- Runtime-Bootstrap mit `createServer()`
- JSON-Konfiguration
- file-based Controllers
- Routing und Route-Sicherheit
- HTTP Basic Auth und JWT
- Lifecycle Hooks
- Service Registry
- EventBus / Event System
- Scheduler
- WebSocket-Support
- Prometheus-Metriken und OpenTelemetry-Grundlagen
- Public API und Framework Contracts

Themen aus der Upstream-Dokumentation, die ausdrücklich nicht Teil des stabilen v1-Scopes sind und deshalb zunächst nicht als vollwertige Demo-Features geplant werden:

- Clustering
- Plugin System

Diese beiden Themen können später als reine Hinweis- oder Roadmap-Seiten ergänzt werden, sollten aber nicht den ersten Build blockieren.

## Auslieferungsmodi

Die Beispiel-Anwendung soll in zwei Modi nutzbar sein:

1. Vollständige Demo-Laufzeit mit `expresto-server`
2. Statische Vorschau aus dem Repository durch direktes Öffnen der `index.html`

Der vollständige Demo-Modus zeigt die echte Integration aus Server, API, Authentifizierung, Scheduler und WebSocket.

Die statische Vorschau dient als sofort sichtbare Produkt- und Dokumentationsansicht ohne Setup. Da beim direkten Öffnen einer `index.html` keine laufende expresto-server-Runtime vorhanden ist, müssen serverabhängige Features in diesem Modus mit statischen Beispieldaten, Mock-Antworten oder klar gekennzeichneten Read-only-Demozuständen dargestellt werden.

## Zielarchitektur

Geplante Architektur der Beispiel-Anwendung:

1. `expresto-server` bootstrapped die Anwendung über `createServer(...)`.
2. Das Framework lädt die Demo-Controller für die Feature-Endpunkte.
3. Das Framework liefert zusätzlich die gebaute React-Anwendung als statische Web-App aus.
4. Die Login-Seite zeigt die statischen Demo-Basic-Credentials offen an.
5. Der Login ruft einen Backend-Endpunkt auf, der Basic Auth prüft und über die JWT-Helfer des Frameworks ein Token erzeugt.
6. Das Frontend speichert das JWT clientseitig und nutzt es für weitere HTTP-Requests und WebSocket-Verbindungen.
7. Der Scheduler erzeugt im Demo-Modus alle 10 Sekunden ein Ereignis mit der aktuellen Uhrzeit.
8. Die WebSocket-Verbindung verteilt diese Uhrzeit in Echtzeit an die UI.
9. Buttons in der UI rufen Demo-Endpunkte auf, die EventBus-Events mit vordefinierten Text-Payloads auslösen.
10. EventBus-Listener leiten diese Demo-Nachrichten an die UI weiter, sodass ein Textfeld sichtbar befüllt wird.
11. Alle Feature-Seiten verwenden eine gemeinsame Struktur für Beschreibung, Dokumentationsauszug, Codebeispiele und Live-Demo.
12. Zusätzlich wird ein statischer Preview-Build erzeugt und versioniert, der mit relativen Assets direkt über `index.html` geöffnet werden kann.

## Interaktive Live-Demos

Für die Demo-Anwendung sollen insbesondere drei Features nicht nur dokumentiert, sondern direkt in der UI erlebbar gemacht werden:

### Scheduler -> WebSocket -> UI

- ein Demo-Scheduler-Job läuft alle 10 Sekunden
- der Job erzeugt die aktuelle Server-Uhrzeit als Demo-Nachricht
- die Nachricht wird an verbundene Clients per WebSocket übertragen
- die UI zeigt Verbindungsstatus, letzte empfangene Uhrzeit und idealerweise einen kleinen Live-Feed

### EventBus -> UI-Aktion -> Textfeld

- auf der Event-System-Seite gibt es Buttons mit vorgegebenen Aktionen, z. B. `Begruessung`, `Warnung`, `Info`
- ein Button-Klick ruft einen Backend-Demo-Endpunkt auf
- das Backend emittiert ein EventBus-Event mit einem vorgefertigten Text
- ein Listener verarbeitet das Event und überträgt den Text an die UI
- die UI schreibt den empfangenen Text in ein sichtbares Textfeld

### Vorschau ohne Server

- in der statischen Repository-Vorschau werden diese Live-Demos mit vorbereiteten Beispielwerten simuliert
- die gleichen UI-Elemente bleiben sichtbar
- der Unterschied zwischen Live-Modus und Preview-Modus wird klar gekennzeichnet

## Geplanter Nutzerfluss

1. Benutzer öffnet `/`.
2. Die Login-Seite zeigt die Demo-Credentials und erklärt kurz den Auth-Flow.
3. Der Benutzer meldet sich per Basic Auth an.
4. Das Backend erstellt ein JWT und gibt es an das Frontend zurück.
5. Das Frontend wechselt in die geschützte Anwendungsansicht.
6. Über das Menü kann der Benutzer zwischen allen Feature-Seiten wechseln.
7. Jede Seite zeigt die zugehörigen Endpunkte, Beispielantworten und Quellcode-Snippets.
8. Auf den Live-Demo-Seiten sieht der Benutzer WebSocket-Status, Scheduler-Ausgaben und EventBus-Interaktionen direkt in der UI.

Vorschaufluss ohne Server:

1. Benutzer öffnet die versionierte `index.html` direkt aus dem Repository.
2. Die Anwendung startet in einem statischen Preview-Modus.
3. Navigation, Beschreibungen, Code-Beispiele und vorbereitete Demo-Daten sind ohne Backend sichtbar.
4. Serverabhängige Aktionen sind als Mock oder Read-only-Beispiel gekennzeichnet.
5. Scheduler-Uhrzeit, WebSocket-Nachrichten und EventBus-Texte werden mit vorbereiteten Beispielwerten dargestellt.

## Vorgesehene Seitenstruktur

Die Anwendung soll mindestens folgende Seiten bzw. Bereiche enthalten:

| Seite | Fokus | Backend-Demo |
|------|-------|--------------|
| Login | Basic Auth -> JWT Flow | Token-Ausgabe, Fehlerfälle |
| Overview | Einführung, Architektur, Navigation | Runtime-Info, Konfiguration |
| Bootstrap & Configuration | `createServer()`, Config, Startup-Regeln | Beispiel-Config, Startpfad |
| Controllers & Routing | Controller-Struktur, Routen, Security-Modi | öffentliche und geschützte Endpunkte |
| Security | Basic, JWT, Security Hooks | Login, geschützte Route, Auth-Status |
| Lifecycle Hooks | Hook-Reihenfolge und Hook-Kontext | Hook-Logs bzw. registrierte Hooks |
| Service Registry | Service-Registrierung und Nutzung | Demo-Service, Lookup, Shutdown-Hinweis |
| Event System | EventBus, Events, Payloads | Buttons senden Demo-Events und befuellen ein Textfeld |
| Scheduler | Cron-Jobs und Scheduler-Events | Demo-Job sendet alle 10s die aktuelle Uhrzeit |
| WebSocket | JWT-gesicherte Socket.IO-Verbindung | Live-Übertragung von Scheduler-Zeit und EventBus-Nachrichten |
| Metrics & Observability | Prometheus, Telemetry, Route-/Service-Sicht | `__metrics`, optionale Runtime-Infos |
| Public API & Contracts | stabile API-Oberfläche und Verträge | Typen, Contracts, Copy-Paste-Snippets |

Optionale spätere Seiten:

- Roadmap: Clustering
- Roadmap: Plugin System

## AP1 Umsetzungsstand

AP1 startet mit einem belastbaren Repository-Grundgeruest, auf dem die
spaeteren Arbeitspakete direkt aufsetzen koennen.

Bereits festgelegt und im Repository angelegt:

- Workspace-Struktur mit `apps/server` fuer die expresto-server-Runtime und
  `apps/web` fuer die React-Anwendung
- Inhaltsverzeichnis `content/` fuer Feature-Texte, Code-Snippets und
  Preview-Daten
- versionierter Zielordner `preview/` fuer die statische Auslieferung im
  Repository
- gemeinsame Basisdateien wie `.nvmrc`, `.editorconfig` und
  `tsconfig.base.json`
- Projektentscheidung `Node.js 22` als Mindest-Basis passend zum
  expresto-server-Runtime-Scope
- Repo-Skript `npm run check:structure` zur Pruefung der AP1-Grundstruktur
- Detaildokumentation der Struktur- und Inhaltsentscheidungen in
  `docs/ap1-foundation.md`

Kurzstruktur des Repositories nach AP1:

```txt
apps/
  server/
  web/
content/
docs/
preview/
scripts/
```

## AP2 Umsetzungsstand

AP2 setzt auf dem Grundgeruest aus AP1 auf und fuehrt den ersten echten
Bootstrap fuer Server, API und Web-Auslieferung ein.

Bereits festgelegt und im Repository angelegt:

- `expresto-server`-Bootstrap in `apps/server/src/main.ts`
- JSON-Runtime-Konfiguration in `apps/server/config/middleware.config.json`
- erster Demo-Endpunkt `GET /api/system/health`
- React-Build mit Vite in `apps/web/`
- regulärer Web-Build nach `apps/web/dist`
- versionierter Preview-Build nach `preview/`
- Root-Build-Kette ueber `npm run build`
- Dokumentation der AP2-Entscheidungen in `docs/ap2-bootstrap.md`

Aktuelle Befehle nach AP2:

- `npm run build`
- `npm run build:web`
- `npm run build:server`
- `npm run build:preview`
- `npm run start`
- `npm run check:structure`

Wichtiger Versionshinweis:

- `expresto-server` wird in AP2 bewusst als `1.0.0-beta` verwendet, weil das
  aktuell die npm-`latest` des Ziel-Frameworks ist
- die restlichen Bibliotheken wurden auf die zum Implementierungszeitpunkt
  aktuellen stabilen Versionen gezogen

## Arbeitspakete

### AP1: Projektgrundlage und technische Leitplanken

Ziel:
Ein belastbares Grundgerüst für Server, Frontend, Build und Inhaltsorganisation schaffen.

Inhalt:

- Projektstruktur für Server-Code, React-App, Beispielcode und Dokumentationsinhalte festlegen
- Build- und Startkonzept definieren
- Konventionen für Dateinamen, Feature-Ordner und Snippet-Ablage festlegen
- Entscheidung treffen, wie Upstream-Dokumentation lokal gespiegelt oder kuratiert wird
- Zielordner und Update-Prozess für den versionierten Preview-Build definieren

Ergebnis:

- stabiles Repository-Grundgerüst
- nachvollziehbare Struktur für alle folgenden Feature-Pakete

Aktuell umgesetzt:

- Root-Workspace mit `apps/server` und `apps/web`
- strukturierte Ablage für Inhalte unter `content/`
- dokumentierter Preview-Zielordner `preview/`
- gemeinsame Konfigurationsbasis für Node- und TypeScript-Projekte
- dokumentierte Detailentscheidungen in `docs/ap1-foundation.md`
- Repo-Validierung über `npm run check:structure`

### AP2: expresto-server Bootstrap und Auslieferung der React-Anwendung

Ziel:
Den Framework-Server als zentrales Runtime-Element aufsetzen.

Inhalt:

- `createServer()`-Bootstrap implementieren
- JSON-Konfiguration für die Demo-Anwendung anlegen
- statische Auslieferung der React-Build-Artefakte über denselben Server konfigurieren
- Trennung zwischen Web-App-Routen und API-Routen definieren
- separaten statischen Build mit relativen Asset-Pfaden erzeugen, der lokal per `index.html` funktioniert

Ergebnis:

- eine lauffähige expresto-server-Anwendung, die API und Frontend gemeinsam ausliefert

Aktuell umgesetzt:

- `createServer()`-Bootstrap in `apps/server/src/main.ts`
- JSON-Konfiguration in `apps/server/config/middleware.config.json`
- erste Controller-Auslieferung ueber `apps/server/src/controllers/system.controller.ts`
- statische Web-Auslieferung aus `apps/web/dist`
- separater Preview-Build nach `preview/` mit relativen Asset-Pfaden
- Root-Skripte fuer Build und Start
- dokumentierte AP2-Entscheidungen in `docs/ap2-bootstrap.md`

### AP3: Login-Flow, Session-Grundlage und geschützte Anwendung

Ziel:
Den vom Projekt geforderten Authentifizierungsfluss umsetzen.

Inhalt:

- Login-Seite als Startseite bauen
- statische Demo-Credentials sichtbar auf der Seite anzeigen
- Backend-Endpunkt für Basic-Auth-Login bereitstellen
- nach erfolgreicher Basic-Authentifizierung ein JWT erzeugen, z. B. mit `signToken()`
- Frontend-Session für das JWT aufbauen
- geschützte Navigationsstruktur für alle weiteren Seiten einführen
- Preview-Modus für Login und geschützte Bereiche definieren, z. B. mit Mock-Session und klarer Kennzeichnung

Ergebnis:

- reproduzierbarer Demo-Login
- JWT-basierte Nutzung aller weiteren Features

### AP4: Responsives Frontend-Grundgerüst und Feature-Navigation

Ziel:
Eine stabile, mobile-taugliche und erweiterbare UI-Struktur schaffen.

Inhalt:

- App-Layout für Desktop und Mobile entwickeln
- Hauptnavigation mit allen Features implementieren
- einheitliche Seitenvorlage für Titel, Beschreibung, Demo, Code und Dokumentation bauen
- Loading-, Error- und Empty-States definieren

Ergebnis:

- responsives Frontend-Grundgerüst
- konsistente UX über alle Feature-Seiten hinweg

### AP5: Gemeinsames System für Doku- und Code-Beispiele

Ziel:
Die Feature-Seiten aus wiederverwendbaren Inhaltsbausteinen speisen.

Inhalt:

- Format für Feature-Inhalte definieren, z. B. Markdown oder strukturierte JSON-/TS-Objekte
- Quellcode-Snippets lokal im Repository ablegen
- Dokumentationsauszüge aus den expresto-server-Docs kuratieren
- gemeinsame Komponenten für Snippet-Anzeige, Copy-Action und Doku-Referenzen bauen
- statische Demo-Daten für den Preview-Modus zentral verwalten
- vordefinierte Demo-Texte und Beispiel-Zeitereignisse für die interaktiven UI-Demos vorbereiten

Ergebnis:

- zentrale Inhaltsbasis für alle Seiten
- kein Live-Zugriff auf GitHub zur Laufzeit notwendig

### AP6: Kernseiten für HTTP- und Runtime-Features

Ziel:
Die wichtigsten Framework-Funktionen mit konkreten Endpunkten und Beispielen sichtbar machen.

Inhalt:

- Seite für Bootstrap & Configuration
- Seite für Controllers & Routing
- Seite für Security
- Seite für Lifecycle Hooks
- Seite für Service Registry
- Seite für Event System

Erwartete Demo-Inhalte:

- Beispiel-Controller
- öffentliche und JWT-geschützte Routen
- Hook-Ausführung und Hook-Kontext
- registrierte Services
- Event-Emission und Event-Logging
- Buttons für vordefinierte EventBus-Aktionen und ein Textfeld für die Ergebnisanzeige

Ergebnis:

- vollständige Demo der zentralen serverseitigen Kernfeatures

### AP7: Erweiterte Feature-Seiten für Scheduler, WebSocket und Observability

Ziel:
Die stärker runtime-orientierten Features als lauffähige Demos ergänzen.

Inhalt:

- Scheduler-Seite mit Job-Konfiguration, Job-Status und einer Live-Uhrzeit, die alle 10 Sekunden aktualisiert wird
- WebSocket-Seite mit JWT-gesichertem Verbindungsaufbau und Live-Empfang der Scheduler- und EventBus-Nachrichten
- Metrics-&-Observability-Seite mit Prometheus-Endpunkt und Telemetry-Hinweisen
- End-to-End-Demo definieren, in der Scheduler, EventBus und WebSocket gemeinsam mit UI-Widgets arbeiten
- für alle serverabhängigen Live-Demos eine statische Preview-Darstellung definieren

Erwartete Demo-Inhalte:

- Beispiel-Job mit klar sichtbarer Ausführung und Versand der aktuellen Uhrzeit alle 10 Sekunden
- WebSocket-Verbindungsstatus, Live-Nachrichtenfeed und Fehlerfälle
- EventBus-Nachrichten, die per Button ausgelöst und in der UI als Textfeldinhalt dargestellt werden
- Anzeige oder Erklärung relevanter Metriken wie `http_requests_total`

Ergebnis:

- komplette Demo der fortgeschrittenen Plattform-Features

### AP8: Public API, Contracts und Entwicklerführung

Ziel:
Die Beispiel-Anwendung nicht nur als Demo, sondern auch als Lern- und Referenzprojekt nutzbar machen.

Inhalt:

- Seite für Public API und stabile Framework Contracts aufbauen
- Typen, Export-Oberflächen und empfohlene Authoring-Patterns sichtbar machen
- klar markieren, was im v1-Scope stabil ist und was nicht

Ergebnis:

- die Anwendung wird zu einer praktischen Referenz für Projektstarts mit `expresto-server`

### AP9: Qualitätssicherung, Tests und Abschlussdokumentation

Ziel:
Die Beispiel-Anwendung stabilisieren und für andere Entwickler nachvollziehbar machen.

Inhalt:

- Smoke-Tests für Bootstrap, Login und zentrale Feature-Endpunkte
- Frontend-Checks für Navigation und geschützte Bereiche
- README, Startanleitung und Entwicklungsablauf vervollständigen
- offene Punkte und spätere Ausbaustufen dokumentieren
- Build-Prozess für die versionierte Preview-Auslieferung dokumentieren und validieren

Ergebnis:

- wartbare Demo-Anwendung mit klarer Setup- und Nutzungsdokumentation

## Branch- und Commit-Strategie

Jedes Arbeitspaket bekommt einen eigenen Arbeitsbranch mit Prefix `codex/`.

Nach Abschluss eines Arbeitspakets wird auf dem jeweiligen Branch ein inhaltlich passender Commit erstellt. Die folgende Liste definiert die vorgesehenen Branches und die geplante Commit-Richtung:

| Arbeitspaket | Branch | Beispiel fuer die Abschluss-Commit-Nachricht |
|------|--------|----------------------------------------------|
| AP1 | `codex/ap1-projektgrundlage` | `Lege das Grundgeruest fuer expresto-examples an` |
| AP2 | `codex/ap2-server-bootstrap` | `Binde expresto-server und die statische App-Auslieferung ein` |
| AP3 | `codex/ap3-login-und-jwt` | `Implementiere Demo-Login mit Basic Auth und JWT-Flow` |
| AP4 | `codex/ap4-frontend-navigation` | `Erstelle das responsive App-Layout und die Feature-Navigation` |
| AP5 | `codex/ap5-doku-und-snippets` | `Fuehre ein gemeinsames System fuer Doku, Snippets und Preview-Daten ein` |
| AP6 | `codex/ap6-kernseiten` | `Ergaenze die Kernseiten fuer Routing, Security, Hooks und Services` |
| AP7 | `codex/ap7-live-demos` | `Verbinde Scheduler, EventBus und WebSocket mit interaktiven UI-Demos` |
| AP8 | `codex/ap8-public-api-und-contracts` | `Dokumentiere Public API und stabile Framework-Contracts in der Demo-App` |
| AP9 | `codex/ap9-qa-und-dokumentation` | `Runde die Beispiel-App mit Tests, Preview-Build und Abschlussdoku ab` |

## Dokumentationsregel Pro Arbeitspaket

Jedes Arbeitspaket muss nicht nur implementiert, sondern auch sauber dokumentiert werden.

## Versionsrichtlinie Fuer Bibliotheken

Fuer alle eingesetzten Bibliotheken soll jeweils die zum Implementierungszeitpunkt aktuelle stabile Version verwendet werden.

Das bedeutet:

- keine veralteten Tutorial-Versionen oder bewusst alte Major-Versionen verwenden
- Vorabversionen wie `alpha`, `beta`, `rc` oder `canary` nur einsetzen, wenn sie ausdruecklich benoetigt und in der README begruendet werden
- vor der Installation oder Aktualisierung einer Bibliothek wird die aktuelle stabile Version noch einmal ueber die offizielle Paketquelle oder Hersteller-Dokumentation geprueft
- installierte Abhaengigkeiten sollen anschliessend konkret gelockt werden, damit der Build reproduzierbar bleibt

## Build-Regel Nach Jedem Lauf

Nach jeder inhaltlichen Umsetzung wird die Anwendung gebaut, bevor ein
Arbeitspaket abgeschlossen oder ein Zwischenstand uebergeben wird.

Das bedeutet:

- nach jeder relevanten Aenderung soll ein Build oder der jeweils passende
  Projekt-Check ausgefuehrt werden
- sobald Server- und Web-Build eingefuehrt sind, ist ein echter App-Build
  Pflicht und nicht optional
- solange in fruehen Arbeitspaketen noch kein vollstaendiger App-Build
  existiert, wird mindestens der vorhandene Repo-Check ausgefuehrt, aktuell
  `npm run check:structure`
- Build- oder Check-Ergebnisse werden im Abschluss jedes Laufs kurz benannt

Pflicht im Code:

- neuer oder geaenderter Code muss klar strukturiert, sinnvoll benannt und bei nicht offensichtlicher Logik knapp kommentiert sein
- Demo-Flows, Mock-Daten, Scheduler-, EventBus- und WebSocket-Verhalten muessen im Code nachvollziehbar auffindbar sein
- neue Endpunkte, UI-Komponenten und Integrationsstellen sollen so benannt und organisiert werden, dass das Arbeitspaket im Repository leicht nachvollzogen werden kann

Pflicht in der `README.md`:

- fuer jedes abgeschlossene Arbeitspaket muss der umgesetzte Umfang kurz dokumentiert oder aktualisiert werden
- wichtige Architekturentscheidungen, Abweichungen vom Plan und relevante Preview- oder Live-Demo-Besonderheiten muessen in der README festgehalten werden
- wenn ein Arbeitspaket neue Start-, Build-, Test- oder Bedienhinweise einfuehrt, muessen diese in der README nachgezogen werden

Arbeitsregel:

- pro Arbeitspaket wird auf dem zugeordneten `codex/...`-Branch gearbeitet
- nach Fertigstellung erfolgt genau ein klar formulierter Abschluss-Commit fuer das Arbeitspaket
- vor dem Abschluss-Commit wird geprueft, dass die Umsetzung sowohl im Code als auch in der `README.md` sauber dokumentiert ist
- vor dem Abschluss eines Laufs wird immer ein Build oder der passende Projekt-Check ausgefuehrt
- anschliessend kann der Branch gemerged oder per Pull Request weiterverarbeitet werden

## Empfohlene Umsetzungsreihenfolge

Die Arbeitspakete sollten in dieser Reihenfolge umgesetzt werden:

1. AP1 Projektgrundlage
2. AP2 Server-Bootstrap und Frontend-Auslieferung
3. AP3 Login und JWT-Flow
4. AP4 Responsives Frontend und Navigation
5. AP5 Gemeinsames Doku-/Snippet-System
6. AP6 Kernseiten
7. AP7 Scheduler, WebSocket, Observability
8. AP8 Public API und Contracts
9. AP9 Tests und Abschlussdokumentation

## Definition of Done

Die erste Version dieser Beispiel-Anwendung ist erreicht, wenn:

- Login per Basic Auth funktioniert und ein JWT erzeugt wird
- alle geplanten v1-Feature-Seiten erreichbar sind
- jede Seite mindestens eine lauffähige Demo und passende Code-Snippets enthält
- die React-Anwendung vollständig über `expresto-server` ausgeliefert wird
- eine fertig gebaute statische Vorschau im Repository enthalten ist und per `index.html` geöffnet werden kann
- die UI zeigt im Live-Modus eine per WebSocket empfangene Uhrzeit, die vom Scheduler alle 10 Sekunden aktualisiert wird
- EventBus-Aktionen können per Button ausgelöst werden und befüllen in der UI ein Textfeld mit vorgegebenen Texten
- die Navigation auf Desktop und Mobile sauber funktioniert
- die README den Aufbau, Start und Scope der Anwendung klar beschreibt

## Referenzen

Upstream-Repository:

- [expresto-server](https://github.com/tmatzke1905/expresto-server)

Wichtige Dokumentationsquellen:

- [Public API](https://github.com/tmatzke1905/expresto-server/blob/main/docs/public-api.md)
- [Configuration](https://github.com/tmatzke1905/expresto-server/blob/main/docs/configuration.md)
- [Controllers](https://github.com/tmatzke1905/expresto-server/blob/main/docs/controllers.md)
- [Security](https://github.com/tmatzke1905/expresto-server/blob/main/docs/security.md)
- [Lifecycle Hooks](https://github.com/tmatzke1905/expresto-server/blob/main/docs/lifecycle-hooks.md)
- [Service Registry](https://github.com/tmatzke1905/expresto-server/blob/main/docs/service-registry.md)
- [Event System](https://github.com/tmatzke1905/expresto-server/blob/main/docs/event-system.md)
- [Scheduler](https://github.com/tmatzke1905/expresto-server/blob/main/docs/scheduler.md)
- [WebSocket](https://github.com/tmatzke1905/expresto-server/blob/main/docs/websocket.md)
- [Metrics](https://github.com/tmatzke1905/expresto-server/blob/main/docs/metrics.md)
- [Framework Contracts](https://github.com/tmatzke1905/expresto-server/blob/main/docs/framework-contracts.md)
