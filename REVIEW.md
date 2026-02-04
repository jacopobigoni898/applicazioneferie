# Code review

## Priorita alta

- Config e segreti hardcodate: `API_BASE_URL`, `MSAL_CLIENT_ID`, `MSAL_TENANT_ID` e gli scope sono fissati in [src/config/env.ts](src/config/env.ts). Serve un layer di configurazione per ambiente (dev/stage/prod), lettura da `.env`/runtime e check di IP statici.
- Gestione token Microsoft fragile: l'access token viene solo salvato e riletto ([app/\_providers/AuthProvider.tsx](app/_providers/AuthProvider.tsx), [src/core/auth/authStorage.ts](src/core/auth/authStorage.ts)) senza refresh/silent login. Se scade, l'app resta con token invalido finche' non arriva un 401. Aggiungere refresh token/silent auth e scadenza locale.
- Tab "Ricevute" e modal admin non implementati: in [app/(tabs)/richieste.tsx](<app/(tabs)/richieste.tsx>) il tab usa lo stesso hook dei dati inviati; in [src/features/requests/hooks/useRequests.ts](src/features/requests/hooks/useRequests.ts) il parametro `mode` e' ignorato. Implementare endpoint differenziati o rimuovere il tab per evitare viste vuote o incoerenti.
- Selezione weekend errata: [src/features/calendar/hooks/useRangeSelection.ts](src/features/calendar/hooks/useRangeSelection.ts) marca come weekend domenica e lunedi (`getDay() === 0 || 1`). Probabile typo, va corretto (es. sabato/domenica) per non falsare il calendario.
- Visibilita' funzionalita' admin: il dropdown mostra "Panoramica Generale (Admin)" ma l'azione e' un semplice alert ([src/features/calendar/components/CalendarComponent.tsx](src/features/calendar/components/CalendarComponent.tsx)). Nascondere per utenti non admin o implementare la vista per evitare flussi morti.

## Priorita media

- Serializzazione date non uniforme: mix di `Date` e stringhe, uso di `toISOString()` in alcuni punti e `yyyy-MM-dd HH:mm:ss` in altri ([src/features/requests/services/requestsService.ts](src/features/requests/services/requestsService.ts), [src/features/requests/hooks/useRequestModalLogic.ts](src/features/requests/hooks/useRequestModalLogic.ts)). Definire helper unici (date-only vs datetime) per evitare drift/shift di timezone e allineare al formato atteso dal backend.
- Mapping dati con fallback silenzioso: [src/features/requests/mappers/holidayMapper.ts](src/features/requests/mappers/holidayMapper.ts) crea `new Date()` quando il parsing fallisce, rischiando dati corrotti. Meglio validare e scartare/mostrare errore.
- Status/enum incoerenti: `RequestStatus` contiene stringhe minuscole con spazi ([src/domain/entities/RequestStatus.ts](src/domain/entities/RequestStatus.ts)) mentre il backend potrebbe richiedere codici differenti (`Validato`, ecc.). Normalizzare i valori e centralizzare la traduzione verso/da API.
- Gestione esiti parziali ignorata: `submitHolidayByToken` ritorna `CreatedCount` e `SkippedDates` ma in UI non vengono mostrati ([src/features/requests/services/requestsService.ts](src/features/requests/services/requestsService.ts)). Segnalare le date saltate e i motivi all'utente.
- Error handling minimale: login e fetch ferie loggano ma non mostrano feedback strutturati (solo `alert` o `console.error`). Introdurre un sistema di notifiche/snackbar e categorizzare gli errori (rete, auth, validazione).

## Priorita bassa

- UI/UX consistenza: stili sparsi in [src/core/style/commonStyles.ts](src/core/style/commonStyles.ts) con colori hardcoded e ripetizioni. Estrarre palette/spacing in theme e riusare componenti (button, card, badge).
- Disaccoppiare componenti modali: `RequestModal` e `EditRequestModal` contengono logica duplicata per dropdown, picker e bottoni ([src/features/requests/components/RequestModal.tsx](src/features/requests/components/RequestModal.tsx), [src/features/requests/components/EditRequestModal.tsx](src/features/requests/components/EditRequestModal.tsx)). Estrarre componenti atomici (picker sheet, header, action bar) e ridurre stato locale.
- Logging in produzione: vari `console.log`/`console.error` e commenti di debug sparsi (es. [src/features/requests/services/requestsService.ts](src/features/requests/services/requestsService.ts), [app/\_providers/AuthProvider.tsx](app/_providers/AuthProvider.tsx)). Proteggerli con flag di ambiente o rimuoverli.
- Typing: diversi `any` nelle catch e nei mapper; sarebbe utile tipizzare le risposte API e usare discriminated unions per i payload di richiesta.
