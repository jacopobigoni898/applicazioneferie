# Flusso modali richieste (creazione e modifica)

Questo documento descrive, passo per passo, come funzionano le due modali di richieste (creazione e modifica), quali stati gestiscono, quali props si scambiano e come comunicano con il resto dell'app.

## Componenti coinvolti

- Calendario: `src/features/calendar/components/CalendarComponent.tsx`
- Modale creazione: `src/features/requests/components/RequestModal.tsx`
- Modale modifica: `src/features/requests/components/ModaleModificaRichiesta.tsx`
- Hook form condiviso: `src/features/requests/hooks/useRequestForm.ts`
- Lista richieste + trigger modale edit: `app/(tabs)/richieste.tsx`
- Item di lista: `src/features/requests/components/ElementoRichiesta.tsx`
- Servizi di submit/update/delete: `src/features/requests/services/requestsService.ts`

## Flusso modale di **creazione**

1) **Selezione range nel calendario**
   - In `CalendarComponent` l'utente seleziona le date (`startDate`, `endDate`).
   - Bottone "Procedi con la richiesta" abilita la modale solo se entrambi i valori sono presenti.

2) **Apertura modale**
   - `RequestModal` riceve: `visible`, `onClose`, `startDate`, `endDate`, `mainType` ("assenza" o "straordinari"), `userId`, `onSubmit`.
   - Il hook `useRequestForm` viene istanziato in modalità `create` con questi parametri.

3) **Stati interni gestiti da `useRequestForm` (mode create)**
   - Date: `startDate`, `endDate` (copiate dai props all'apertura).
   - Orari: `startTime`, `endTime`, flag `isAllDay` per applicare o meno gli orari.
   - Picker orari: `showStartPicker`, `showEndPicker` + helper `openTimePicker`, `handleTimeChange`, `closePickers`.
   - Motivazione: `subType` + supporto focus `isFocus`; le opzioni arrivano da `ABSENCE_OPTIONS` o `OVERTIME_OPTIONS` in base a `mainType`.
   - Stato approvazione: fissato a `PENDING` in creazione.
   - Flag derivati: `isSingleDaySelection`, `isSickRequest` (per gestire permessi malattia sempre all-day).

4) **UI della modale**
   - Mostra il range date, i picker orari (gestione diversa per iOS/Android), il dropdown motivazione, toggle all-day quando applicabile.
   - Pulsante "Invia" chiama `handleSubmitCreate` del hook.

5) **Submit**
   - `handleSubmitCreate` valida motivazione, date, orari e userId.
   - Costruisce le date finali (applica orari o default 09:00-18:00, forza all-day per malattia).
   - Chiama `buildRequestPayload` (nel service) per ottenere il `RequestPayload` tipato (ferie/permesso/straordinario/malattia).
   - Invoca il `onSubmit` passato dal calendario. In `CalendarComponent` questo è `handleSubmission`, che manda il payload a `submitRequest` del service.

## Flusso modale di **modifica**

1) **Trigger dalla lista richieste**
   - Schermata `app/(tabs)/richieste.tsx` usa `useRichieste` per caricare e gestire la lista.
   - Ogni `ElementoRichiesta` espone i bottoni "Modifica" e "Elimina". Il click su "Modifica" passa l'item a `apriModifica`.
   - `useModificaRichiesta` gestisce il contesto `{ elemento, funzioneAggiornamento }` dove `funzioneAggiornamento` è `inviate.aggiorna` (provenienti da `useRichieste`).

2) **Apertura modale**
   - `ModaleModificaRichiesta` riceve: `visibile`, `elemento`, `suChiusura`, `suConferma`, `inSalvataggio`.
   - Inizializza `useFormRichiesta` in modalità `modifica` con: `dataInizio`, `dataFine`, `idRichiesta`, `statoIniziale` derivati da `elemento`, e `suInvio` collegato a `suConferma` del parent.

3) **Stati interni gestiti da `useFormRichiesta` (modalita modifica)**
   - Date: `dataInizio`, `dataFine` (parse da stringa o Date); setter `impostaDataInizio`, `impostaDataFine`.
   - Stato approvazione: `stato`, `impostaStato`, inizializzato da `elemento.stato_approvazione`.
   - Picker data: flag `mostraSelettoreInizio`, `mostraSelettoreFine` gestiti localmente in `ModaleModificaRichiesta` con conferma su iOS.
   - Funzioni comuni: `formattaData`, `gestisciInvioModifica` (valida date e prepara payload).
   - Nota: in modifica non si usano orari, motivazione o tutto-il-giorno per le date; il hook li mantiene ma non sono esposti/necessari nella UI.

4) **UI della modale**
   - Mostra periodo Dal/Al con bottoni che aprono i date picker.
   - Dropdown per stato approvazione (`APPROVATO`, `IN_ATTESA`, `RIFIUTATO`).
   - Pulsante "Salva" chiama `gestisciInvioModifica` → che crea `InputAggiornamentoRichiesta` con `IdRichiesta`, `DataInizio`, `DataFine`, `StatoApprovazione`.

5) **Submit**
   - `suConferma` fornito da `richieste.tsx` chiama `contesto.funzioneAggiornamento` (cioè `useRichieste.aggiorna`).
   - `useRichieste.aggiorna` fa optimistic update nello stato locale, poi invoca `aggiornaRichiesta` del service. Errori fanno rollback dell'optimistic update e propagano.

6) **Chiusura e stato salvataggio**
   - `inSalvataggio` blocca i bottoni e cambia etichetta "Salvataggio...".
   - Su successo, `useModificaRichiesta` chiude la modale (`impostaContesto(null)`); su errore mostra alert.

## Flusso delete (per completezza)

- `ElementoRichiesta` chiama `suEliminazione` con l'id.
- `richieste.tsx` usa `useRichieste.rimuovi`: fa optimistic update, recupera `tipo_permesso` per decidere endpoint, poi chiama `eliminaRichiesta`.

## Riassunto props chiave

- `RequestModal`
  - `visibile`, `suChiusura`: controllo apertura/chiusura.
  - `dataInizio`, `dataFine`: range iniziale precompilato.
  - `tipoPrincipale`: decide set opzioni (assenza vs straordinari).
  - `suInvio(payload: AddRichiestaPayload)`: chiamato dal hook al termine validazione.

- `ModaleModificaRichiesta`
  - `visibile`, `suChiusura`: controllo apertura/chiusura.
  - `elemento`: richiesta da modificare (date, tipo, stato).
  - `suConferma(payload: InputAggiornamentoRichiesta)`: chiamato dopo validazione; gestito dal parent (`useRichieste.aggiorna`).
  - `inSalvataggio`: disabilita azioni durante la chiamata API.

## Dove toccare se serve

- Logica form condivisa: `src/features/requests/hooks/useRequestForm.ts` (aggiungere campi, validazioni, default).
- Invio API: `src/features/requests/services/requestsService.ts` (endpoint, mapping DTO, smistamento per tipo).
- Lista e apertura modale edit: `app/(tabs)/richieste.tsx` + `ElementoRichiesta` per i bottoni.
- Apertura modale create: `src/features/calendar/components/CalendarComponent.tsx` (bottone "Procedi con la richiesta").

Questo schema dovrebbe chiarire come gli stati e le props si propagano tra modali, hook e servizi, e come avviene la comunicazione con l'API per creare, modificare o cancellare le richieste.
