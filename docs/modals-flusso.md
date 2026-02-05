# Flusso modali richieste (creazione e modifica)

Questo documento descrive, passo per passo, come funzionano le due modali di richieste (creazione e modifica), quali stati gestiscono, quali props si scambiano e come comunicano con il resto dell'app.

## Componenti coinvolti

- Calendario: `src/features/calendar/components/CalendarComponent.tsx`
- Modale creazione: `src/features/requests/components/RequestModal.tsx`
- Modale modifica: `src/features/requests/components/EditRequestModal.tsx`
- Hook form condiviso: `src/features/requests/hooks/useRequestForm.ts`
- Lista richieste + trigger modale edit: `app/(tabs)/richieste.tsx`
- Item di lista: `src/features/requests/components/RequestItem.tsx`
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
   - Schermata `app/(tabs)/richieste.tsx` usa `useRequests` per caricare e gestire la lista.
   - Ogni `RequestItem` espone i bottoni "Modifica" e "Elimina". Il click su "Modifica" passa l'item a `setEditContext`.
   - `editContext` contiene `{ item, updateFn }` dove `updateFn` è `sent.update` o `received.update` (provenienti da `useRequests`).

2) **Apertura modale**
   - `EditRequestModal` riceve: `visible`, `item`, `onClose`, `onConfirm`, `saving`.
   - Inizializza `useRequestForm` in modalità `edit` con: `startDate`, `endDate`, `requestId`, `initialStatus` derivati da `item`, e `onSubmit` collegato a `onConfirm` del parent.

3) **Stati interni gestiti da `useRequestForm` (mode edit)**
   - Date: `startDate`, `endDate` (parse da stringa o Date); setter `setStartDate`, `setEndDate`.
   - Stato approvazione: `status`, `setStatus`, inizializzato da `item.stato_approvazione`.
   - Picker data: flag `showStartPicker`, `showEndPicker` gestiti localmente in `EditRequestModal` con conferma su iOS.
   - Funzioni comuni: `formatDate`, `handleSubmitEdit` (valida date e prepara payload).
   - Nota: in edit non si usano orari, motivazione o all-day; il hook li mantiene ma non sono esposti/necessari nella UI.

4) **UI della modale**
   - Mostra periodo Dal/Al con bottoni che aprono i date picker.
   - Dropdown per stato approvazione (`APPROVED`, `PENDING`, `REJECTED`).
   - Pulsante "Salva" chiama `handleSubmitEdit` → che crea `UpdateHolidayInput` con `IdRichiesta`, `DataInizio`, `DataFine`, `StatoApprovazione`.

5) **Submit**
   - `onConfirm` fornito da `richieste.tsx` chiama `editContext.updateFn` (cioè `useRequests.update`).
   - `useRequests.update` fa optimistic update nello stato locale, determina il tipo (ferie vs permesso) e invoca `updateRequest` del service.
   - `updateRequest` smista: ferie → `updateHoliday`; permessi → `buildUpdatePermessoDto` → `updatePermits` (endpoint dedicato). Errori fanno rollback dell'optimistic update e propagano.

6) **Chiusura e stato saving**
   - `saving` blocca i bottoni e cambia etichetta "Salvataggio...".
   - Su successo, `richieste.tsx` chiude la modale (`setEditContext(null)`); su errore mostra alert.

## Flusso delete (per completezza)

- `RequestItem` chiama `onDelete` con l'id.
- `richieste.tsx` usa `useRequests.remove`: fa optimistic update, recupera `tipo_permesso` per decidere endpoint, poi chiama `deleteHolidayById`.
- `deleteHolidayById` smista: ferie → endpoint ferie; permessi → endpoint permessi; altri tipi lanciano errore per rollback.

## Riassunto props chiave

- `RequestModal`
  - `visible`, `onClose`: controllo apertura/chiusura.
  - `startDate`, `endDate`: range iniziale precompilato.
  - `mainType`: decide set opzioni (assenza vs straordinari).
  - `userId`: necessario per costruire il payload.
  - `onSubmit(payload: RequestPayload)`: chiamato dal hook al termine validazione.

- `EditRequestModal`
  - `visible`, `onClose`: controllo apertura/chiusura.
  - `item`: richiesta da modificare (date, tipo, stato).
  - `onConfirm(payload: UpdateHolidayInput)`: chiamato dopo validazione; gestito dal parent (`useRequests.update`).
  - `saving`: disabilita azioni durante la chiamata API.

## Dove toccare se serve

- Logica form condivisa: `src/features/requests/hooks/useRequestForm.ts` (aggiungere campi, validazioni, default).
- Invio API: `src/features/requests/services/requestsService.ts` (endpoint, mapping DTO, smistamento per tipo).
- Lista e apertura modale edit: `app/(tabs)/richieste.tsx` + `RequestItem` per i bottoni.
- Apertura modale create: `src/features/calendar/components/CalendarComponent.tsx` (bottone "Procedi con la richiesta").

Questo schema dovrebbe chiarire come gli stati e le props si propagano tra modali, hook e servizi, e come avviene la comunicazione con l'API per creare, modificare o cancellare le richieste.
