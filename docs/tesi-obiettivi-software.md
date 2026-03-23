# 1.3 Obiettivi del software: Definizione delle funzionalità core per utenti e amministratori

La piattaforma nasce con l’obiettivo di digitalizzare in modo completo il ciclo di vita delle richieste di assenza, riducendo tempi di approvazione e ambiguità operative. Per raggiungere questo scopo il software mette al centro due profili chiave – l’utente dipendente e l’amministratore HR – e costruisce per ciascuno un insieme coerente di funzionalità core, orchestrate attorno a un’unica base dati e a flussi di interazione omogenei tra mobile app e servizi backend.

## 1.3.1 Obiettivi per gli utenti

1. **Accesso sicuro e identità coerente.** Ogni dipendente accede tramite autenticazione token-based; il token è memorizzato in modo sicuro e iniettato automaticamente sulle chiamate HTTP, garantendo che tutte le operazioni (creazione, modifica, eliminazione) siano sempre riconducibili a un profilo univoco.
2. **Pianificazione autonoma delle assenze.** L’utente può selezionare un intervallo di date dal calendario, scegliere il tipo di permesso (ferie, permesso specifico, straordinario, malattia) e personalizzare la richiesta con motivazione, note e – quando previsto – allegare documentazione in formato PDF. Il supporto agli orari di inizio/fine e alle selezioni all-day consente di modellare sia assenze giornaliere sia permessi parziali.
3. **Gestione del ciclo di vita della richiesta.** Dopo l’invio, l’utente può modificare o annullare la propria richiesta finché il processo approvativo non è concluso. Gli stati (“non validato”, “validato”, “annullato”, “autorizzato”) vengono mostrati in modo consistente nell’interfaccia, così da comunicare chiaramente la posizione della richiesta nel workflow.
4. **Trasparenza e tracciabilità.** Ogni variazione (aggiornamento date, cambio stato, eliminazione) viene recepita in tempo reale dalla lista personale, sfruttando aggiornamenti ottimistici lato client e sincronizzazione server. L’utente ha quindi sempre la visibilità aggiornata delle proprie assenze pianificate e approvate.

## 1.3.2 Obiettivi per gli amministratori

1. **Vista centralizzata delle richieste.** Gli amministratori accedono a una panoramica completa di tutte le richieste inoltrate e possono recuperare rapidamente i dettagli necessari (periodo, tipo di permesso, note, eventuali documenti allegati) senza passaggi manuali o sistemi paralleli.
2. **Controllo e decisione sul workflow.** Attraverso modali dedicate l’amministratore può validare, autorizzare o rifiutare una richiesta, applicando le politiche aziendali. Il sistema espone endpoint specifici `/Richieste/admin/...` che distinguono nettamente le operazioni di backoffice dalle azioni lato utente.
3. **Gestione della compliance documentale.** Quando il tipo di permesso richiede allegati, l’amministratore può scaricare e verificare i documenti caricati dall’utente, assicurando la conformità delle richieste rispetto a normative interne o contrattuali.
4. **Riduzione dei tempi di ciclo.** L’integrazione tra vista lista, modali di decisione e aggiornamenti istantanei dello stato consente di chiudere il ciclo approvativo in pochi passaggi, minimizzando le comunicazioni esterne e garantendo tracciabilità delle decisioni.

## 1.3.3 Obiettivi condivisi e criteri di qualità

- **Usabilità mobile-first.** L’interfaccia privilegia componenti nativi (date/time picker, dropdown, badge di stato) per ridurre l’attrito all’uso su dispositivi mobili, scenario prevalente per utenti e responsabili.
- **Coerenza dei dati.** La presenza di mapper condivisi e payload tipizzati assicura che le informazioni scambiate con il backend siano normalizzate (formati data, enumerazioni di stato, identificativi di tipologia), prevenendo errori di interpretazione.
- **Sicurezza e privacy.** L’iniezione automatica del token, l’uso di storage sicuro e la segregazione dei percorsi `/admin` garantiscono che le operazioni sensibili siano consentite solo ai ruoli autorizzati e che i dati personali siano protetti lungo tutto il flusso.
- **Estendibilità.** La separazione tra componenti UI, hook di dominio e servizi HTTP rende l’applicazione pronta ad accogliere nuove tipologie di permesso o step approvativi aggiuntivi senza riscrivere i flussi esistenti.

Questi obiettivi costituiscono la bussola progettuale dell’applicazione: ogni nuova funzionalità deve rafforzare l’autonomia dell’utente nella pianificazione delle assenze e la capacità dell’amministrazione di governare in modo rapido, conforme e tracciabile l’intero processo autorizzativo.
