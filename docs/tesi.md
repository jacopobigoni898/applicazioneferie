# Tesi - Applicazione per la gestione delle ferie aziendali

## Indice
1. [Contesto e impostazione del documento](#1-contesto-e-impostazione-del-documento)  
 1.1. [Scopo del documento](#11-scopo-del-documento)  
 1.2. [Campo di applicazione](#12-campo-di-applicazione)  
 1.3. [Obiettivi del software](#13-obiettivi-del-software)  
2. [Metodologia e Ciclo di Vita del Software](#2-metodologia-e-ciclo-di-vita-del-software)  
 2.1. [Metodologia di lavoro](#21-metodologia-di-lavoro)  
 2.2. [Progettazione UI/UX](#22-progettazione-uiux)  
 2.3. [Dal prototipo al codice](#23-dal-prototipo-al-codice)  
3. [Stack Tecnologico e Ambiente di Sviluppo](#3-stack-tecnologico-e-ambiente-di-sviluppo)  
 3.1. [Tecnologie Frontend](#31-tecnologie-frontend)  
 3.2. [Linguaggio e Strumenti](#32-linguaggio-e-strumenti)  
 3.3. [Autenticazione e Sicurezza](#33-autenticazione-e-sicurezza)  
4. [Architettura del Sistema e Integrazione Backend](#4-architettura-del-sistema-e-integrazione-backend)  
 4.1. [Struttura a livelli](#41-struttura-a-livelli)  
 4.2. [Integrazione API](#42-integrazione-api)  
 4.3. [Normalizzazione dei dati](#43-normalizzazione-dei-dati)  
5. [Sviluppo Tecnico delle Funzionalità](#5-sviluppo-tecnico-delle-funzionalità)  
 5.1. [Interfaccia Calendario](#51-interfaccia-calendario)  
 5.2. [Gestione delle Modali](#52-gestione-delle-modali)  
 5.3. [Serializzazione delle Date](#53-serializzazione-delle-date)  
6. [Qualità del Codice e Validazione](#6-qualità-del-codice-e-validazione)  
 6.1. [Code Review e Refactoring](#61-code-review-e-refactoring)  
 6.2. [Test e Debugging](#62-test-e-debugging)  
 6.3. [User Experience Avanzata](#63-user-experience-avanzata)  
7. [Conclusioni e Evoluzioni Future](#7-conclusioni-e-evoluzioni-future)  
 7.1. [Risultati raggiunti](#71-risultati-raggiunti)  
 7.2. [Sviluppi futuri](#72-sviluppi-futuri)

---

## 1 Contesto e impostazione del documento
### 1.1 Scopo del documento
Il documento descrive l’architettura, le scelte metodologiche e le funzionalità principali dell’applicazione di gestione ferie, fornendo una base strutturata per la discussione di tesi.

### 1.2 Campo di applicazione
Il perimetro riguarda il frontend mobile sviluppato con Expo/React Native e la relativa integrazione con i servizi backend aziendali, includendo processi di autenticazione, gestione ferie e controllo amministrativo.

### 1.3 Obiettivi del software
Sono state definite due aree funzionali distinte:
- **Utenti**: invio richieste di ferie e permessi tramite `RequestModal`, selezione di intervalli nel calendario, allegato opzionale di documenti, consultazione dello stato di approvazione e cancellazione delle richieste con rollback ottimistico (`useRichieste`).
- **Amministratori**: consultazione delle richieste ricevute, autorizzazione o rifiuto massivo (`autorizzaRichiesta`, `rifiutaRichiesta`), modifica delle finestre temporali e gestione degli allegati tramite `ModaleModificaRichiesta`.
Tali obiettivi mirano a ridurre tempi di lavorazione, aumentare la trasparenza verso il personale e fornire un unico canale verificabile per audit interni. L’intero flusso è stato concepito per minimizzare errori di inserimento, guidare l’utente nella scelta del tipo di permesso e rendere tracciabile ogni passaggio di approvazione.

## 2 Metodologia e Ciclo di Vita del Software
### 2.1 Metodologia di lavoro
Il progetto è stato gestito con SAL settimanali: ogni iterazione ha previsto pianificazione degli obiettivi, verifica degli incrementi sviluppati e riallineamento su rischi e dipendenze. Tale cadenza ha garantito tracciabilità continua e riduzione del debito tecnico.
Durante i SAL sono stati condivisi prototipi, esiti delle prove su dispositivi reali e decisioni architetturali. Sono state adottate board kanban per visualizzare priorità, blocchi e dipendenze, favorendo la condivisione delle decisioni e l’adattamento continuo alle richieste dell’organizzazione.

### 2.2 Progettazione UI/UX
È stato predisposto un prototipo interattivo in Figma per validare flussi, gerarchie informative e uso dei colori semantici (`Colori` in `src/core/theme/theme.ts`). Test di usabilità in fase di prototipo hanno consentito di convergere su interazioni coerenti (es. apertura modali dal calendario, dropdown motivazioni) prima di impegnare sforzi di sviluppo.
Il prototipo ha evidenziato l’esigenza di un linguaggio visivo uniforme: icone, pulsanti e badge di stato sono stati armonizzati con la palette semantica, mentre gli spazi sono stati dimensionati tramite le utility responsive per garantire leggibilità sia su smartphone compatti sia su tablet. Le osservazioni raccolte sono state trasformate in azioni correttive immediatamente verificabili nel successivo SAL.

### 2.3 Dal prototipo al codice
La traduzione del design ha seguito una scomposizione in componenti React Native riusabili. Le viste calendario e tab sono state mappate su `CalendarComponent` e `TabView`. Le interazioni contestuali sono state incapsulate in modali (`RequestModal`, `ModaleModificaRichiesta`). I token di design (palette, tipografia, spaziature tramite `responsive`) sono stati centralizzati per mantenere coerenza con il prototipo e ridurre lo sforzo di sviluppo.
Ogni componente è stato collegato a hook dedicati per separare presentazione e logica. Questa scelta ha facilitato la validazione incrociata: lo stesso hook di form è stato riutilizzato per creazione e modifica, mentre i servizi di rete sono stati orchestrati da un layer di servizio unico per tutte le richieste ferie.

## 3 Stack Tecnologico e Ambiente di Sviluppo
### 3.1 Tecnologie Frontend
 La soluzione utilizza **React Native** con **Expo** per garantire distribuzione cross-platform e accesso uniforme ai moduli nativi (calendario, filesystem, secure storage).
Expo fornisce strumenti di sviluppo rapidi (Hot Reload, Dev Client) e una catena di build gestita che riduce la complessità di configurazione. L’adozione di SDK coerenti (calendario, file-system, secure store, sharing) assicura compatibilità tra piattaforme e riduce la frammentazione del codice.

### 3.2 Linguaggio e Strumenti
Lo sviluppo è condotto in **TypeScript** per garantire tipizzazione forte sui payload (`AddRichiestaPayload`, `InputAggiornamentoRichiesta`). Il controllo versione è gestito con **Git**, con branching dedicato per funzionalità e code review preventivo (`REVIEW.md`).
La tipizzazione ha consentito di intercettare incongruenze tra DTO backend e modelli applicativi in fase di compilazione, limitando i bug runtime. Le review hanno richiesto l’allineamento di enum e la gestione esplicita degli esiti parziali, rafforzando la qualità del codice.

### 3.3 Autenticazione e Sicurezza
L’accesso è basato su **Microsoft MSAL** tramite `expo-auth-session` (`authService.ts`). I token vengono salvati in `SecureStore` (`authStorage.ts`). Prima di ogni chiamata gli header Axios vengono arricchiti con il bearer tramite interceptor (`httpClient.ts`). Se il server risponde con 401, la sessione viene invalidata e l’utente è invitato ad autenticarsi nuovamente.
Il flusso di autenticazione prevede il recupero del discovery document, l’emissione della richiesta con PKCE e l’eventuale refresh automatico del token (gestito da `useSessioneAuth`). Tale ciclo riduce l’esposizione del token e garantisce continuità di servizio senza richieste ripetute di login.
Gli identificativi MSAL sono temporaneamente definiti in `src/config/env.ts` per l’ambiente di sviluppo: la migrazione verso variabili di ambiente è stata avviata, viene gestita come bonifica immediata ed è bloccante per ulteriori distribuzioni. Nessuna build di produzione verrà pubblicata finché tali riferimenti non saranno esternalizzati e rimossi dal controllo versione.
La configurazione definitiva prevede la lettura da variabili d’ambiente (es. `MSAL_CLIENT_ID`, `MSAL_TENANT_ID`, `MSAL_SCOPE_USER_IMPERSONATION`) impostate nelle pipeline di build e nei profili di esecuzione locali. I valori `CLIENT_ID` e `TENANT_ID` devono rispettare il formato UUID fornito da Azure AD; lo scope mantiene il formato `api://<client-id>/user_impersonation`. È previsto un file `.env.example` con segnaposto non sensibili per agevolare la configurazione locale. La repository dovrà escludere tali chiavi tramite configurazioni dedicate (`.env`, secret manager) per evitare esposizioni accidentali. La chiusura della migrazione è pianificata entro il prossimo SAL settimanale, con blocco di qualunque build successiva in caso di mancato completamento.

## 4 Architettura del Sistema e Integrazione Backend
### 4.1 Struttura a livelli
L’architettura applica una separazione netta:
- **UI (Modali e schermate)**: componenti presentazionali (`RequestModal`, `ModaleModificaRichiesta`, liste amministrative) prive di logica di business.
- **Logica (Hook)**: gestione stato e validazioni (`useRequestForm`, `useModificaRichiesta`, `useRichieste`, `useSessioneAuth`).
- **Data Layer (Service/API)**: orchestrazione chiamate e mapping (`apiRichieste.ts`, `tipiRichieste.ts`, `authService.ts`).
Questa stratificazione permette di sostituire il backend o di estendere le modali senza toccare la logica di accesso ai dati. I mapper fungono da ponte anti-fragilità, normalizzando naming eterogenei e prevenendo crash dovuti a campi mancanti.

### 4.2 Integrazione API
L’integrazione è stata sviluppata in parallelo al frontend tramite un client Axios condiviso (`httpClient.ts`) che applica timeout, base URL e token. I servizi `aggiungiRichiesta`, `aggiornaRichiesta`, `autorizzaRichiesta` e `recuperaDocumento` utilizzano FormData o payload JSON in base al requisito dell’endpoint, mantenendo header coerenti.
La scelta di separare endpoint admin e utente in `tipiRichieste.ts` consente un controllo puntuale dei percorsi e riduce il rischio di chiamate errate. Il recupero di documenti usa `responseType: arraybuffer` e scrive su cache locale per consentire la condivisione sicura tramite `expo-sharing`.

### 4.3 Normalizzazione dei dati
Il mapper `holidayMapper` uniforma le risposte provenienti da diversi naming convention (camelCase, snake_case, PascalCase) verso l’entità `RichiestaFerie`. Le date vengono parse in modo difensivo per evitare valori NaN e gli stati di approvazione vengono defaultati a `IN_ATTESA` in assenza di dato. Questa normalizzazione assicura che la UI lavori con modelli consistenti.
Inoltre, i tipi permesso vengono armonizzati tramite `normalizzaTipo`, così da associare colori e badge coerenti nelle viste calendario e lista. Ogni campo opzionale è gestito con fallback sicuri, evitando eccezioni in fase di rendering.

## 5 Sviluppo Tecnico delle Funzionalità
### 5.1 Interfaccia Calendario
`CalendarComponent` consente la selezione di intervalli data (`useSelezioneIntervallo`) e la scelta della modalità (assenza o straordinario) tramite `useTipoCalendario`. La UI evidenzia il range scelto e abilita la richiesta solo quando entrambe le estremità sono valorizzate. I dettagli giornalieri sono mostrati in `DayDetailModal` con colorazione tipologica (`getColoreTipo`).
Il componente adotta marcature multi-dot per rappresentare richieste sovrapposte e gestisce gli offset di fuso orario tramite serializzazione coerente. L’apertura della modale di dettaglio avviene con un gesto unico, mantenendo la coerenza delle animazioni tra iOS e Android.

### 5.2 Gestione delle Modali
- **RequestModal (creazione)**: delega a `useRequestForm` la validazione dei campi, la gestione dei picker orari (differenziando iOS/Android) e la costruzione del payload tipizzato. Supporta documenti opzionali e campi condizionati (codice richiesta, motivazione).
- **ModaleModificaRichiesta (admin)**: consente di aggiornare intervalli e stato approvazione, gestendo caricamento e rollback in caso di errore (`useModificaRichiesta`). Per gli amministratori è previsto anche il download e la condivisione dell’allegato (`recuperaDocumento`, integrazione con `expo-sharing` in `ModaleAutorizzaRichiesta`).
Il comportamento è stato pensato per evitare ambiguità: i bottoni di conferma evidenziano chiaramente l’azione (invio, autorizza, rifiuta), mentre i campi obbligatori sono validati prima dell’invio per ridurre round-trip inutili verso il backend.

### 5.3 Serializzazione delle Date
La conversione tra formati locali e richiesti dal backend è centralizzata in `serializzazioneDate.ts`. La funzione `aStringaIsoLocale` produce timestamp `yyyy-MM-ddTHH:mm:ss` con componenti UTC, mentre `formatoAnnoMeseGiorno` gestisce i filtri di recupero. In fase di mapping le date vengono trasformate in oggetti `Date` nativi, evitando incoerenze tra timezone e formati ISO.
Questa strategia previene discrepanze tra dispositivi con impostazioni di fuso differenti e assicura che le date appaiano coerenti nel calendario, nei dettagli e nei payload inviati.

## 6 Qualità del Codice e Validazione
### 6.1 Code Review e Refactoring
Sono state monitorate criticità come la gestione dei token e la presenza di identificativi MSAL hardcoded (client e tenant in `env.ts`). La migrazione verso variabili di ambiente è in corso ed è bloccante per qualsiasi nuova build.
Le review suggeriscono inoltre di centralizzare la traduzione degli enum di stato e di mostrare esiti parziali del submit (campi `CreatedCount`, `SkippedDates`), indirizzando refactoring futuri. Ulteriori attività pianificate includono la rimozione di duplicazioni di helper tra componenti e la creazione di una utility condivisa per l’estrazione di messaggi d’errore, così da rendere l’esperienza utente più uniforme.

### 6.2 Test e Debugging
La validazione corrente si basa su strumenti integrati in VSCode: debugging React Native con Expo, log controllati nei hook (`__DEV__` in `useSessioneAuth`) e alert applicativi per scenari di errore. L’assenza di test automatizzati costituisce un rischio noto e prioritario. È stato inserito come obiettivo immediato del prossimo sprint:
- casi unitari per i mapper (es. `holidayMapper`, `serializzazioneDate`);
- test di integrazione sui flussi di richiesta;
- esecuzione automatica nelle pipeline CI per prevenire regressioni.
La strategia di debug prevede sessioni su dispositivi reali, verifica della gestione degli allegati e simulazione di errori di rete, così da assicurare comportamenti prevedibili anche in condizioni degradate.
Le attività di test sono classificate come ad alta priorità e dovranno coprire in via preferenziale: autenticazione MSAL (login e refresh), serializzazione date tra timezone, aggiornamenti ottimistici con rollback e gestione documenti. L’obiettivo è bloccare ogni distribuzione finché la copertura minima su questi ambiti critici non sarà garantita.
La politica di blocco distribuzioni entrerà in vigore non appena la suite automatizzata sarà disponibile: allo stato attuale non esiste ancora uno script di test, ma la definizione di casi e pipeline è parte del prossimo sprint con obiettivo di completamento entro il SAL successivo. Sarà vietato rilasciare build oltre tale scadenza senza copertura minima sugli ambiti critici.

### 6.3 User Experience Avanzata
Sono stati adottati aggiornamenti ottimistici: `useRichieste` salva lo stato precedente, applica l’aggiornamento immediato e ripristina in caso di fallimento (`aggiorna`, `rimuovi`, `autorizza`, `rifiuta`). Il calendario mantiene la responsività grazie alla derivazione memorizzata degli intervalli e alla separazione tra dati crudi e dati formattati.
In futuro, tali aggiornamenti saranno accompagnati da notifiche contestuali (snackbar) per rendere ancora più evidente l’esito delle operazioni senza interrompere il flusso di lavoro.

## 7 Conclusioni e Evoluzioni Future
### 7.1 Risultati raggiunti
Il sistema soddisfa i requisiti iniziali di gestione ferie: selezione intervalli, creazione e modifica richieste, allegati, approvazione amministrativa e separazione chiara tra ruoli. L’architettura a livelli facilita manutenzione e riuso.
La coerenza tra prototipo e implementazione ha ridotto il tempo di formazione degli utenti e ha reso più fluido il passaggio dai test di usabilità all’uso quotidiano in azienda.

### 7.2 Sviluppi futuri
- **Sincronizzazione bidirezionale**: adozione di API avanzate o webhook per allineare in tempo reale approvazioni e modifiche.
- **Integrazione Business Intelligence**: esposizione di dataset verso Power BI per il monitoraggio dei flussi di assenza e di carico amministrativo.
- **Notifiche push**: introduzione di push per cambi di stato, integrando Expo Notifications e permessi granulari.
Sono inoltre previsti percorsi di hardening della sicurezza (segreti esternalizzati, header di sicurezza aggiuntivi) e l’introduzione di report periodici esportabili per HR e direzione, in modo da valorizzare i dati aggregati prodotti dal sistema.
