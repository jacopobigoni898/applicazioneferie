# Documentazione dettagliata: RequestModal e ModaleModificaRichiesta

> Documento generato analizzando l'intero progetto. Descrive il funzionamento delle due modali,
> la costruzione dei payload, le funzioni di invio, la validazione e il flusso dati end-to-end.

---

## Indice

1. [Panoramica architetturale](#1-panoramica-architetturale)
2. [RequestModal (Creazione)](#2-requestmodal-creazione)
3. [ModaleModificaRichiesta (Modifica)](#3-modalemodificarichiesta-modifica)
4. [Hook condiviso: useFormRichiesta](#4-hook-condiviso-useformrichiesta)
5. [Costruzione dei payload](#5-costruzione-dei-payload)
6. [Flusso di invio: dalla modale al backend](#6-flusso-di-invio-dalla-modale-al-backend)
7. [Serializzazione delle date](#7-serializzazione-delle-date)
8. [Mapper: holidayMapper](#8-mapper-holidaymapper)
9. [Diagramma di flusso completo](#9-diagramma-di-flusso-completo)

---

## 1. Panoramica architetturale

Il sistema segue una separazione netta a livelli:

```
UI (Modali)
  └─> Hook (useFormRichiesta / useModificaRichiesta / useInvioRichiestaCalendario / useRichieste)
        └─> Service (apiRichieste.ts)
              └─> HTTP Client (httpClient.ts)
                    └─> Backend API
```

Le due modali (`RequestModal` e `ModaleModificaRichiesta`) **non contengono logica di business**.
Tutta la logica è delegata a hook specializzati:

| Modale                     | Hook principale               | Scopo                                  |
| -------------------------- | ----------------------------- | -------------------------------------- |
| `RequestModal`             | `useFormRichiesta`            | Validazione form + costruzione payload |
| `ModaleModificaRichiesta`  | `useFormRichiesta`            | Validazione form + costruzione payload |
| (orchestrazione modifica)  | `useModificaRichiesta`        | Gestione stato modale + salvataggio    |
| (orchestrazione creazione) | `useInvioRichiestaCalendario` | Gestione modale + invio API            |

---

## 2. RequestModal (Creazione)

**File:** `src/features/requests/components/RequestModal.tsx`

### 2.1 Props ricevute

```typescript
interface PropsModaleRichiesta {
  visibile: boolean; // Controlla visibilità della modale
  suChiusura: () => void; // Callback di chiusura
  dataInizio: Date | null; // Data inizio selezionata dal calendario
  dataFine: Date | null; // Data fine selezionata dal calendario
  tipoPrincipale: "assenza" | "straordinari"; // Categoria macro
  tipiRichiesta: TipoRichiestaDTO[]; // Lista tipi dal backend (dropdown)
  suInvio: (dati: AddRichiestaPayload) => void; // Callback di invio
}
```

### 2.2 Chi la istanzia

`RequestModal` viene renderizzata dentro `CalendarComponent.tsx`:

```tsx
<ModaleRichiesta
  visibile={modaleVisibile}
  suChiusura={chiudiModale}
  dataInizio={dataInizio ? new Date(dataInizio) : null}
  dataFine={dataFine ? new Date(dataFine) : null}
  tipoPrincipale={
    tipoCalendario === "straordinari" ? "straordinari" : "assenza"
  }
  tipiRichiesta={tipiRichiesta}
  suInvio={gestisciInvio} // ← viene da useInvioRichiestaCalendario
/>
```

### 2.3 Flusso utente

1. L'utente seleziona un intervallo di date nel calendario
2. Preme **"Procedi con la richiesta"** → si apre `RequestModal`
3. La modale mostra:
   - Date selezionate (non modificabili)
   - Switch **"Tutto il giorno"** (solo se giorno singolo)
   - Selettori **orario inizio/fine** (se non tutto il giorno)
   - Dropdown **tipo richiesta** (lista dal backend)
   - Campo **nota** (opzionale)
4. Preme **"Invia"** → `gestisciInvioCreazione()` valida e costruisce il payload
5. Il payload viene passato a `suInvio` (prop) → arriva a `useInvioRichiestaCalendario.gestisciInvio`
6. L'hook chiama `aggiungiRichiesta(payload)` (API POST)

### 2.4 Elementi UI specifici

- **Selettore orario iOS:** modale innestata con `DateTimePicker` in modalità `spinner`, arrotondamento ai 30 minuti
- **Selettore orario Android:** apre `DateTimePickerAndroid.open()` nativo
- **Pulsante "Invia":** disabilitato se `sottoTipo` è null (nessun tipo selezionato)

---

## 3. ModaleModificaRichiesta (Modifica)

**File:** `src/features/requests/components/ModaleModificaRichiesta.tsx`

### 3.1 Props ricevute

```typescript
interface PropsModaleModifica {
  visibile: boolean; // Controlla visibilità
  elemento: RichiestaFerie | null; // Richiesta da modificare
  suChiusura: () => void; // Callback chiusura
  suConferma: (payload: InputAggiornamentoRichiesta) => void; // Callback conferma
  inSalvataggio?: boolean; // Stato loading
}
```

### 3.2 Chi la istanzia

`ModaleModificaRichiesta` viene renderizzata nella schermata `richieste.tsx`:

```tsx
<ModaleModificaRichiesta
  visibile={modaleVisibile} // da useModificaRichiesta
  elemento={elementoInModifica} // da useModificaRichiesta
  suChiusura={chiudiModifica} // da useModificaRichiesta
  suConferma={confermaModifica} // da useModificaRichiesta
  inSalvataggio={inSalvataggio} // da useModificaRichiesta
/>
```

### 3.3 Flusso utente

1. L'utente vede la lista richieste nella tab "Richieste inviate" o "Richieste ricevute"
2. Preme su una richiesta → `apriModifica(elemento, datiTab.aggiorna)` (salva l'elemento e la funzione di aggiornamento nel contesto)
3. Si apre `ModaleModificaRichiesta` con i dati pre-compilati
4. La modale mostra:
   - **Tipo permesso** (readonly, dall'elemento)
   - **Date inizio/fine** modificabili tramite DatePicker
   - **Stato approvazione** (dropdown: Approvato / Non validato / Annullato)
5. Preme **"Salva"** → `gestisciInvioModifica()` valida e costruisce il payload
6. Il payload viene passato a `suConferma` → che è `confermaModifica` di `useModificaRichiesta`
7. `confermaModifica` chiama `contesto.funzioneAggiornamento(payload)` → che è `datiTab.aggiorna` di `useRichieste`
8. `aggiorna` applica un **aggiornamento ottimistico** sulla lista locale, poi chiama `aggiornaRichiesta(payload)` (API PUT)
9. In caso di errore: **rollback** allo stato precedente + Alert

### 3.4 Gestione DatePicker per piattaforma

| Piattaforma | Comportamento                                                                                                                                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **iOS**     | Apre una `Modal` innestata con `DateTimePicker` display `spinner`. Usa date temporanee (`dataInizioTemp`/`dataFineTemp`). La data viene applicata solo al click su "OK" (`confermaSelettore`). "Chiudi" annulla la modifica. |
| **Android** | Apre il `DateTimePicker` nativo inline. La data viene applicata immediatamente al cambio e il picker si chiude.                                                                                                              |

### 3.5 Opzioni stato approvazione

```typescript
const OPZIONI_STATO = [
  { etichetta: "Approvato", valore: StatoRichiesta.APPROVATO }, // "validato"
  { etichetta: "Non validato", valore: StatoRichiesta.IN_ATTESA }, // "non validato"
  { etichetta: "Annullato", valore: StatoRichiesta.RIFIUTATO }, // "annullato"
];
```

---

## 4. Hook condiviso: useFormRichiesta

**File:** `src/features/requests/hooks/useRequestForm.ts`

Questo hook è **polimorfico**: accetta un discriminante `modalita` che può essere `"crea"` o `"modifica"`, e restituisce campi diversi in base alla modalità.

### 4.1 Parametri di input (union type)

```typescript
// Modalità CREAZIONE
{
  modalita: "crea";
  visibile: boolean;
  dataInizio: Date | null;
  dataFine: Date | null;
  tipoPrincipale: "assenza" | "straordinari";
  tipiRichiesta: TipoRichiestaDTO[];          // Lista dropdown dal backend
  suInvio: (payload: AddRichiestaPayload) => void;
}

// Modalità MODIFICA
{
  modalita: "modifica";
  visibile: boolean;
  dataInizio: Date | string | null;
  dataFine: Date | string | null;
  idRichiesta: number;
  statoIniziale?: StatoRichiesta;
  suInvio: (payload: InputAggiornamentoRichiesta) => void;
}
```

### 4.2 Stato interno gestito

| Stato             | Tipo             | Usato in  | Descrizione                      |
| ----------------- | ---------------- | --------- | -------------------------------- |
| `dataInizio`      | `Date \| null`   | entrambi  | Data inizio corrente nel form    |
| `dataFine`        | `Date \| null`   | entrambi  | Data fine corrente nel form      |
| `stato`           | `StatoRichiesta` | modifica  | Stato approvazione selezionato   |
| `sottoTipo`       | `string \| null` | creazione | Valore dropdown tipo richiesta   |
| `idTipoRichiesta` | `number \| null` | creazione | ID numerico del tipo selezionato |
| `nota`            | `string`         | creazione | Nota opzionale                   |
| `orarioInizio`    | `string`         | creazione | Orario inizio (formato "HH:MM")  |
| `orarioFine`      | `string`         | creazione | Orario fine (formato "HH:MM")    |
| `tuttoIlGiorno`   | `boolean`        | creazione | Switch tutto il giorno           |

### 4.3 Reset automatico

Quando `visibile` cambia a `true`, l'`useEffect` esegue un reset completo:

- Stato → `StatoRichiesta.IN_ATTESA` (o `statoIniziale` in modifica)
- Sotto-tipo, ID tipo, nota → reset
- Orari → `"09:00"` / `"18:00"`
- Tutto il giorno → `false`
- Date → vengono ri-parsate dai parametri in input

### 4.4 Helper interni

| Funzione                                | Scopo                                                                                        |
| --------------------------------------- | -------------------------------------------------------------------------------------------- |
| `parsaData(valore)`                     | Parsing difensivo: accetta `Date`, `string ISO`, `string yyyy-MM-dd`. Fallback: `new Date()` |
| `parsaOrario(valore)`                   | Parsing "HH:MM" con validazione range (0-23, 0-59)                                           |
| `arrotondaAMezzora(data)`               | Arrotonda i minuti al multiplo di 30 più vicino                                              |
| `applicaOrarioAData(data, ora, minuto)` | Crea un nuovo `Date` UTC con giorno dalla data e orario specificato                          |
| `formattaData(data)`                    | Formattazione locale italiana: `dd/MM/yyyy`                                                  |

---

## 5. Costruzione dei payload

### 5.1 Payload di CREAZIONE (`gestisciInvioCreazione`)

Questa funzione viene chiamata premendo "Invia" in `RequestModal`.

**Flusso di validazione:**

```
1. sottoTipo è selezionato?              → NO → alert("Seleziona una motivazione!")
2. dataInizio e dataFine valide?         → NO → alert("Date non valide!")
3. idTipoRichiesta è presente?           → NO → alert("Seleziona un tipo di richiesta!")
4. orarioInizio e orarioFine parsabili?  → NO → alert("Inserisci orari validi...")
5. Se giorno singolo + NO tutto il giorno:
   - orarioFine > orarioInizio?          → NO → alert("L'orario di fine deve essere successivo...")
```

**Logica di composizione date finali:**

```
SE giorno singolo:
  SE tutto il giorno:
    dataInizioFinale = data + 09:00 UTC
    dataFineFinale   = data + 18:00 UTC
  ALTRIMENTI:
    dataInizioFinale = data + orarioInizio (arrotondato 30min) UTC
    dataFineFinale   = data + orarioFine (arrotondato 30min) UTC
ALTRIMENTI (multi-giorno):
  dataInizioFinale = dataInizio + orarioInizio UTC
  dataFineFinale   = dataFine   + orarioFine   UTC
```

**Payload risultante:**

```typescript
const payload: AddRichiestaPayload = {
  dataInizio: aStringaIsoLocale(dataInizioFinale), // "2026-02-12T09:00:00"
  dataFine: aStringaIsoLocale(dataFineFinale), // "2026-02-12T18:00:00"
  idTipoRichiesta: 3, // ID numerico dal dropdown
  nota: "Visita medica", // Testo libero opzionale
};
```

### 5.2 Payload di MODIFICA (`gestisciInvioModifica`)

Questa funzione viene chiamata premendo "Salva" in `ModaleModificaRichiesta`.

**Flusso di validazione:**

```
1. dataInizio e dataFine valide?  → NO → alert("Date non valide!")
2. dataFine >= dataInizio?        → NO → alert("La data di fine deve essere successiva...")
```

**Payload risultante:**

```typescript
const payload: InputAggiornamentoRichiesta = {
  IdRichiesta: 42, // ID numerico della richiesta esistente
  DataInizio: "2026-02-12", // Formato yyyy-MM-dd (formatoAnnoMeseGiorno)
  DataFine: "2026-02-14", // Formato yyyy-MM-dd
  StatoApprovazione: "approvato", // Valore enum StatoRichiesta
};
```

### 5.3 Differenze chiave tra i due payload

| Aspetto            | Creazione (`AddRichiestaPayload`)      | Modifica (`InputAggiornamentoRichiesta`)      |
| ------------------ | -------------------------------------- | --------------------------------------------- |
| **Formato date**   | ISO senza Z: `yyyy-MM-ddTHH:mm:ss`     | Solo data: `yyyy-MM-dd`                       |
| **Serializzatore** | `aStringaIsoLocale()` (componenti UTC) | `formatoAnnoMeseGiorno()` (componenti locali) |
| **Include orario** | Sì (embedded nella data)               | No                                            |
| **ID richiesta**   | Non presente (nuova)                   | `IdRichiesta` (obbligatorio)                  |
| **Tipo richiesta** | `idTipoRichiesta` (numerico)           | Non presente (non modificabile)               |
| **Nota**           | `nota` (stringa)                       | Non presente                                  |
| **Stato**          | Non presente (default backend)         | `StatoApprovazione` (stringa enum)            |

---

## 6. Flusso di invio: dalla modale al backend

### 6.1 Creazione (flusso completo)

```
RequestModal
  │ click "Invia"
  ▼
useFormRichiesta.gestisciInvioCreazione()
  │ validazione + costruzione AddRichiestaPayload
  ▼
suInvio(payload)   ← prop della modale
  │
  ▼
useInvioRichiestaCalendario.gestisciInvio(payload)
  │ chiama aggiungiRichiesta(payload)
  ▼
apiRichieste.aggiungiRichiesta(payload)
  │ POST /Richieste/utente/addRichiesta
  ▼
httpClient.post(endpoint, payload)
  │
  ▼
Backend risponde con RisultatoPostDTO
  │
  ▼
gestisciInvio controlla Esito:
  ├─ contiene "riusc" → Alert("Successo") + chiudi modale + reset intervallo calendario
  └─ altrimenti       → Alert("Errore", Motivazione || Esito)
```

### 6.2 Modifica (flusso completo)

```
ModaleModificaRichiesta
  │ click "Salva"
  ▼
useFormRichiesta.gestisciInvioModifica()
  │ validazione + costruzione InputAggiornamentoRichiesta
  ▼
suConferma(payload)   ← prop della modale
  │
  ▼
useModificaRichiesta.confermaModifica(payload)
  │ impostaInSalvataggio(true)
  │ chiama contesto.funzioneAggiornamento(payload)
  ▼
useRichieste.aggiorna(payload)
  │ 1. Salva snapshot lista corrente (per rollback)
  │ 2. Aggiornamento OTTIMISTICO locale della lista
  │ 3. Chiama aggiornaRichiesta(payload) (API)
  ▼
apiRichieste.aggiornaRichiesta(payload)
  │ PUT /Richieste/utente/updateRichiesta
  ▼
httpClient.put(endpoint, payload)
  │
  ▼
  ├─ Successo → confermaModifica chiude la modale (impostaContesto(null))
  └─ Errore   → useRichieste fa ROLLBACK lista + confermaModifica mostra Alert
```

### 6.3 Meccanismo di rollback ottimistico (useRichieste)

```typescript
const aggiorna = async (payload) => {
  let precedenti: RichiestaFerie[] = [];

  // 1. Aggiornamento ottimistico
  impostaElementi((correnti) => {
    precedenti = correnti; // ← salva snapshot
    return correnti.map((el) => {
      if (el.id_richiesta === payload.IdRichiesta) {
        return { ...el /* campi aggiornati */ };
      }
      return el;
    });
  });

  try {
    await aggiornaRichiesta(payload); // ← chiamata API
  } catch (err) {
    impostaElementi(precedenti); // ← ROLLBACK
    throw err; // ← propagato a useModificaRichiesta
  }
};
```

Lo stesso pattern è usato per `rimuovi` (eliminazione).

---

## 7. Serializzazione delle date

**File:** `src/features/requests/services/serializzazioneDate.ts`

### `aStringaIsoLocale(data: Date): string`

Usata nel payload di **creazione**. Legge componenti UTC e produce una stringa ISO **senza Z**:

```
Input:  new Date(Date.UTC(2026, 1, 12, 9, 0, 0))
Output: "2026-02-12T09:00:00"
```

Perché senza Z? Il backend si aspetta un datetime locale, non UTC con timezone.

### `formatoAnnoMeseGiorno(d: Date): string`

Usata nel payload di **modifica**. Legge componenti **locali** e produce solo la data:

```
Input:  new Date(2026, 1, 12)
Output: "2026-02-12"
```

### Perché due formati diversi?

- **Creazione:** il backend ha bisogno del datetime completo (data + orario) per calcolare permessi parziali
- **Modifica:** il backend gestisce solo il cambio di date (senza orario) e stato

---

## 8. Mapper: holidayMapper

**File:** `src/features/requests/mappers/holidayMapper.ts`

Il mapper `mappaRispostaFerie` è usato nella **direzione inversa** (backend → app) per normalizzare le risposte del backend nell'entità `RichiestaFerie`.

```typescript
export const mappaRispostaFerie = (grezzo: any): RichiestaFerie => {
  return {
    id_richiesta: Number(grezzo?.idRichiesta ?? grezzo?.id_richiesta ?? ...),
    id_utente:    Number(grezzo?.id_utente ?? grezzo?.IdUtente ?? ...),
    data_inizio:  parsaData(grezzo?.dataInizio ?? grezzo?.data_inizio ?? ...),
    data_fine:    parsaData(grezzo?.dataFine ?? grezzo?.data_fine ?? ...),
    stato_approvazione: grezzo?.StatoApprovazione ?? grezzo?.stato_approvazione ?? ...,
    tipo_permesso:      grezzo?.tipo ?? grezzo?.Tipo ?? ...,
  };
};
```

**Perché il parsing difensivo con fallback multipli?**
Il backend può restituire nomi di campo in formati diversi (camelCase, snake_case, PascalCase). Il mapper gestisce tutte le varianti con operatore `??`.

Viene invocato in `apiRichieste.recuperaTutteRichieste()`:

```typescript
const { data } = await http.get<any[]>(endpoint);
return (data || []).map(mappaRispostaFerie);
```

---

## 9. Diagramma di flusso completo

### Creazione richiesta

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────────────┐
│   Calendario    │     │   RequestModal   │     │ useInvioRichiestaCalend. │
│                 │     │                  │     │                          │
│ seleziona date  │────▶│ mostra form      │     │                          │
│ "Procedi"       │     │ tipo + orario    │     │                          │
│                 │     │ + nota           │     │                          │
│                 │     │                  │     │                          │
│                 │     │ click "Invia"    │────▶│ gestisciInvio(payload)   │
│                 │     │                  │     │   ▼                      │
│                 │     │                  │     │ aggiungiRichiesta()      │
│                 │     │                  │     │   POST → backend         │
│ reset date  ◀───│─────│   chiudi modale  │◀────│ successo/errore          │
└─────────────────┘     └──────────────────┘     └──────────────────────────┘
                              ▲
                              │ useFormRichiesta("crea")
                              │ - validazione
                              │ - costruzione AddRichiestaPayload
                              │ - gestione orari/date
```

### Modifica richiesta

```
┌────────────────┐     ┌──────────────────────┐     ┌────────────────────┐
│ ListaRichieste │     │ ModaleModificaRich.   │     │ useModificaRich.   │
│                │     │                      │     │                    │
│ click elemento │────▶│ mostra form          │     │ apriModifica()     │
│                │     │ date + stato         │     │ salva contesto     │
│                │     │                      │     │                    │
│                │     │ click "Salva"        │────▶│ confermaModifica() │
│                │     │                      │     │   ▼                │
│                │     │                      │     │ aggiorna(payload)  │──▶ PUT backend
│                │     │                      │     │   ▼                │
│ lista aggiorn. │◀────│   chiudi modale      │◀────│ ottimistico+API    │
│ (o rollback)   │     │                      │     │ rollback se errore │
└────────────────┘     └──────────────────────┘     └────────────────────┘
                              ▲
                              │ useFormRichiesta("modifica")
                              │ - validazione date
                              │ - costruzione InputAggiornamentoRichiesta
                              │ - gestione DatePicker iOS/Android
```

---

## Endpoint API coinvolti

| Operazione      | Metodo | Endpoint                                      | Payload                         |
| --------------- | ------ | --------------------------------------------- | ------------------------------- |
| Lista richieste | GET    | `/Richieste/utente/getAllRichiesteById?data=` | Query param: data in yyyy-MM-dd |
| Crea richiesta  | POST   | `/Richieste/utente/addRichiesta`              | `AddRichiestaPayload` (JSON)    |
| Modifica        | PUT    | `/Richieste/utente/updateRichiesta`           | `InputAggiornamentoRichiesta`   |
| Elimina         | DELETE | `/Richieste/utente/deleteRichiesta?id=`       | Query param: id numerico        |
| Tipi richiesta  | GET    | `/TipoRichiesta/getAllTipoRichiesta`          | Nessuno                         |

---

## Riepilogo catena di responsabilità

| Layer              | File                             | Responsabilità                                          |
| ------------------ | -------------------------------- | ------------------------------------------------------- |
| **UI**             | `RequestModal.tsx`               | Rendering form creazione, delegare a hook               |
| **UI**             | `ModaleModificaRichiesta.tsx`    | Rendering form modifica, DatePicker, delegare a hook    |
| **Form Logic**     | `useRequestForm.ts`              | Validazione, stato form, costruzione payload            |
| **Orchestrazione** | `useModificaRichiesta.ts`        | Gestione contesto modale modifica, salvataggio + errori |
| **Orchestrazione** | `useInvioRichiestaCalendario.ts` | Gestione modale creazione, invio + feedback             |
| **Data**           | `useRichieste.ts`                | Fetch lista, eliminazione, aggiornamento ottimistico    |
| **Service**        | `apiRichieste.ts`                | Chiamate HTTP tipizzate                                 |
| **Types**          | `tipiRichieste.ts`               | DTO, payload types, costanti endpoint                   |
| **Serialization**  | `serializzazioneDate.ts`         | Conversione Date → stringa per il backend               |
| **Mapper**         | `holidayMapper.ts`               | Conversione risposta backend → entità `RichiestaFerie`  |
