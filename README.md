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
7. Alle Feature-Seiten verwenden eine gemeinsame Struktur für Beschreibung, Dokumentationsauszug, Codebeispiele und Live-Demo.
8. Zusätzlich wird ein statischer Preview-Build erzeugt und versioniert, der mit relativen Assets direkt über `index.html` geöffnet werden kann.

## Geplanter Nutzerfluss

1. Benutzer öffnet `/`.
2. Die Login-Seite zeigt die Demo-Credentials und erklärt kurz den Auth-Flow.
3. Der Benutzer meldet sich per Basic Auth an.
4. Das Backend erstellt ein JWT und gibt es an das Frontend zurück.
5. Das Frontend wechselt in die geschützte Anwendungsansicht.
6. Über das Menü kann der Benutzer zwischen allen Feature-Seiten wechseln.
7. Jede Seite zeigt die zugehörigen Endpunkte, Beispielantworten und Quellcode-Snippets.

Vorschaufluss ohne Server:

1. Benutzer öffnet die versionierte `index.html` direkt aus dem Repository.
2. Die Anwendung startet in einem statischen Preview-Modus.
3. Navigation, Beschreibungen, Code-Beispiele und vorbereitete Demo-Daten sind ohne Backend sichtbar.
4. Serverabhängige Aktionen sind als Mock oder Read-only-Beispiel gekennzeichnet.

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
| Event System | EventBus, Events, Payloads | Demo-Events und Event-Log |
| Scheduler | Cron-Jobs und Scheduler-Events | Demo-Job, Ausführungsstatus |
| WebSocket | JWT-gesicherte Socket.IO-Verbindung | Connect-, Message- und Error-Demo |
| Metrics & Observability | Prometheus, Telemetry, Route-/Service-Sicht | `__metrics`, optionale Runtime-Infos |
| Public API & Contracts | stabile API-Oberfläche und Verträge | Typen, Contracts, Copy-Paste-Snippets |

Optionale spätere Seiten:

- Roadmap: Clustering
- Roadmap: Plugin System

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

Ergebnis:

- vollständige Demo der zentralen serverseitigen Kernfeatures

### AP7: Erweiterte Feature-Seiten für Scheduler, WebSocket und Observability

Ziel:
Die stärker runtime-orientierten Features als lauffähige Demos ergänzen.

Inhalt:

- Scheduler-Seite mit Job-Konfiguration, Job-Status und Event-Ausgabe
- WebSocket-Seite mit JWT-gesichertem Verbindungsaufbau
- Metrics-&-Observability-Seite mit Prometheus-Endpunkt und Telemetry-Hinweisen
- für alle serverabhängigen Live-Demos eine statische Preview-Darstellung definieren

Erwartete Demo-Inhalte:

- Beispiel-Job mit klar sichtbarer Ausführung
- WebSocket-Verbindungsstatus, Message-Demo und Fehlerfälle
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
