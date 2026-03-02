// Hook unificato per la gestione del form richieste (creazione e modifica).
import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";
import {
  InputAggiornamentoRichiesta,
  TipoRichiestaDTO,
  AddRichiestaPayload,
} from "../services/requestsService";
import * as DocumentPicker from "expo-document-picker";
import { aStringaIsoLocale } from "../services/serializzazioneDate";
import { recuperaDocumento } from "../services/apiRichieste";

export type ModalitaForm = "crea" | "modifica";

export type ParametriFormRichiesta =
  | {
      modalita: "crea";
      visibile: boolean;
      dataInizio: Date | null;
      dataFine: Date | null;
      tipoPrincipale: "assenza" | "straordinari";
      tipiRichiesta: TipoRichiestaDTO[];
      suInvio: (payload: AddRichiestaPayload) => void;
    }
  | {
      modalita: "modifica";
      visibile: boolean;
      dataInizio: Date | string | null;
      dataFine: Date | string | null;
      idRichiesta: number;
      statoIniziale?: StatoRichiesta;
      suInvio: (payload: InputAggiornamentoRichiesta) => void;
    };

// Helper: formatta una data per la visualizzazione
const formattaData = (data: Date | null) =>
  data ? data.toLocaleDateString("it-IT") : "--/--/----";

// Helper: parsing difensivo di una data
const parsaData = (valore?: string | Date | null) => {
  if (!valore) return new Date();
  if (valore instanceof Date) return valore;
  const parsata = new Date(valore);
  if (!Number.isNaN(parsata.getTime())) return parsata;
  const parti = String(valore).split("-");
  if (parti.length === 3) {
    const a = Number(parti[0]);
    const m = Number(parti[1]) - 1;
    const g = Number(parti[2]);
    const dataSicura = new Date(Date.UTC(a, m, g, 9, 0, 0, 0));
    if (!Number.isNaN(dataSicura.getTime())) return dataSicura;
  }
  return new Date();
};

// Helper: parsing orario "HH:MM"
const parsaOrario = (valore: string) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(valore.trim());
  if (!match) return null;
  const ora = Number(match[1]);
  const minuto = Number(match[2]);
  if (ora < 0 || ora > 23 || minuto < 0 || minuto > 59) return null;
  return { ora, minuto };
};

// Helper: arrotonda ai 30 minuti più vicini
const arrotondaAMezzora = (data: Date) => {
  const arrotondata = new Date(data);
  const minuti = arrotondata.getMinutes();
  if (minuti < 15) {
    arrotondata.setMinutes(0, 0, 0);
  } else if (minuti < 45) {
    arrotondata.setMinutes(30, 0, 0);
  } else {
    arrotondata.setHours(arrotondata.getHours() + 1, 0, 0, 0);
  }
  return arrotondata;
};

// Helper: applica orario a una data usando UTC
const applicaOrarioAData = (data: Date, ora: number, minuto: number) => {
  const a = data.getFullYear();
  const m = data.getMonth();
  const g = data.getDate();
  return new Date(Date.UTC(a, m, g, ora, minuto, 0, 0));
};

export const useFormRichiesta = (parametri: ParametriFormRichiesta) => {
  const { visibile } = parametri;

  // Stato locale delle date
  const [dataInizio, impostaDataInizio] = useState<Date | null>(
    parametri.dataInizio ? parsaData(parametri.dataInizio) : null,
  );
  const [dataFine, impostaDataFine] = useState<Date | null>(
    parametri.dataFine ? parsaData(parametri.dataFine) : null,
  );

  // Stato comune
  const [stato, impostaStato] = useState<StatoRichiesta>(
    parametri.modalita === "modifica"
      ? (parametri.statoIniziale ?? StatoRichiesta.IN_ATTESA)
      : StatoRichiesta.IN_ATTESA,
  );
  const [sottoTipo, impostaSottoTipo] = useState<string | null>(null);
  const [idTipoRichiesta, impostaIdTipoRichiesta] = useState<number | null>(
    null,
  );
  const [nota, impostaNota] = useState("");
  const [codiceRichiesta, impostaCodiceRichiesta] = useState("");
  const [documento, impostaDocumento] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [documentoInCaricamento, impostaDocumentoInCaricamento] =
    useState(false);
  const [inFocus, impostaInFocus] = useState(false);
  const [orarioInizio, impostaOrarioInizio] = useState("09:00");
  const [orarioFine, impostaOrarioFine] = useState("18:00");
  const [mostraSelettoreInizio, impostaMostraSelettoreInizio] = useState(false);
  const [mostraSelettoreFine, impostaMostraSelettoreFine] = useState(false);
  const [tuttoIlGiorno, impostaTuttoIlGiorno] = useState(false);

  const eSelezioneGiornoSingolo =
    dataInizio &&
    dataFine &&
    dataInizio.toDateString() === dataFine.toDateString();

  // Tipi di richiesta dal backend (solo in modalità crea)
  const tipiRichiestaBackend =
    parametri.modalita === "crea" ? parametri.tipiRichiesta : undefined;

  const opzioniCorrente = useMemo(() => {
    if (parametri.modalita !== "crea") return [];
    return (tipiRichiestaBackend || []).map((t) => ({
      label: t.tipoRichiesta,
      value: String(t.idTipoRichiesta),
    }));
  }, [parametri, tipiRichiestaBackend]);

  // Determina se il tipo selezionato richiede codice o documenti
  const tipoSelezionato = useMemo(() => {
    if (parametri.modalita !== "crea" || idTipoRichiesta == null) return null;
    return (
      (tipiRichiestaBackend || []).find(
        (t) => t.idTipoRichiesta === idTipoRichiesta,
      ) ?? null
    );
  }, [parametri, tipiRichiestaBackend, idTipoRichiesta]);

  const richiedeCodice = tipoSelezionato?.richiedeCodice ?? false;
  const richiedeDocumenti = tipoSelezionato?.richiedeDocumenti ?? false;

  // Chiudi tutti i picker
  const chiudiSelettori = () => {
    impostaMostraSelettoreInizio(false);
    impostaMostraSelettoreFine(false);
  };

  // Selettore documento (PDF)
  const pickDocumento = async () => {
    try {
      const risultato = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      if (
        !risultato.canceled &&
        risultato.assets &&
        risultato.assets.length > 0
      ) {
        const asset = risultato.assets[0];
        impostaDocumento({
          uri: asset.uri,
          name: asset.name || "documento.pdf",
          type: asset.mimeType || "application/pdf",
        });
      }
    } catch (e) {
      // ignore
    }
  };

  const rimuoviDocumento = () => impostaDocumento(null);

  const gestisciCambioOrario = (
    tipo: "inizio" | "fine",
    evento: any,
    dataSelezionata?: Date,
  ) => {
    if (Platform.OS === "ios" && evento?.type === "dismissed") return;
    const dataPresa = dataSelezionata || new Date();
    const arrotondata = arrotondaAMezzora(dataPresa);
    const ore = String(arrotondata.getHours()).padStart(2, "0");
    const minuti = String(arrotondata.getMinutes()).padStart(2, "0");
    const formattato = `${ore}:${minuti}`;

    if (tipo === "inizio") impostaOrarioInizio(formattato);
    else impostaOrarioFine(formattato);
  };

  const apriSelettoreOrario = (tipo: "inizio" | "fine") => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value:
          tipo === "inizio" ? dataInizio || new Date() : dataFine || new Date(),
        mode: "time",
        is24Hour: true,
        onChange: (evento, data) =>
          gestisciCambioOrario(tipo, evento, data || new Date()),
      });
      return;
    }

    tipo === "inizio"
      ? impostaMostraSelettoreInizio(true)
      : impostaMostraSelettoreFine(true);
  };

  // Reset stato quando la modale cambia visibilità
  useEffect(() => {
    if (visibile) {
      impostaStato(
        parametri.modalita === "modifica"
          ? (parametri.statoIniziale ?? StatoRichiesta.IN_ATTESA)
          : StatoRichiesta.IN_ATTESA,
      );
      impostaSottoTipo(null);
      impostaIdTipoRichiesta(null);
      impostaNota("");
      impostaCodiceRichiesta("");
      impostaTuttoIlGiorno(false);
      chiudiSelettori();

      const dataInizioParsata = parametri.dataInizio
        ? parsaData(parametri.dataInizio)
        : null;
      const dataFineParsata = parametri.dataFine
        ? parsaData(parametri.dataFine)
        : null;

      if (parametri.modalita === "modifica") {
        // Estrai orario dalle date esistenti della richiesta
        const oreInizio = dataInizioParsata
          ? String(dataInizioParsata.getHours()).padStart(2, "0")
          : "09";
        const minInizio = dataInizioParsata
          ? String(dataInizioParsata.getMinutes()).padStart(2, "0")
          : "00";
        const oreFine = dataFineParsata
          ? String(dataFineParsata.getHours()).padStart(2, "0")
          : "18";
        const minFine = dataFineParsata
          ? String(dataFineParsata.getMinutes()).padStart(2, "0")
          : "00";
        // Se entrambi gli orari sono 00:00, usa valori di default (dati legacy senza orario)
        const inizioEZero = oreInizio === "00" && minInizio === "00";
        const fineEZero = oreFine === "00" && minFine === "00";
        impostaOrarioInizio(
          inizioEZero && fineEZero ? "09:00" : `${oreInizio}:${minInizio}`,
        );
        impostaOrarioFine(
          inizioEZero && fineEZero ? "18:00" : `${oreFine}:${minFine}`,
        );
      } else {
        impostaOrarioInizio("09:00");
        impostaOrarioFine("18:00");
      }

      impostaDataInizio(dataInizioParsata);
      impostaDataFine(dataFineParsata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    visibile,
    parametri.modalita,
    parametri.modalita === "modifica" ? parametri.statoIniziale : null,
    parametri.dataInizio,
    parametri.dataFine,
  ]);

  // RIMOSSO: non carichiamo automaticamente il documento all'apertura della modale
  // (evita chiamate non necessarie al backend quando la richiesta non ha documento).
  // Forniamo invece una funzione esplicita `caricaDocumento` che l'interfaccia
  // può chiamare su richiesta dell'utente (es. pulsante "Scarica documento").

  const caricaDocumento = async () => {
    if (parametri.modalita !== "modifica" || !parametri.idRichiesta)
      return null;
    impostaDocumentoInCaricamento(true);
    try {
      const doc = await recuperaDocumento(parametri.idRichiesta);
      impostaDocumento(doc);
      return doc;
    } catch (e) {
      // recuperaDocumento già gestisce errori e ritorna null in caso di problemi
      impostaDocumento(null);
      return null;
    } finally {
      impostaDocumentoInCaricamento(false);
    }
  };

  // Valida e costruisce il payload per la creazione
  const gestisciInvioCreazione = () => {
    if (parametri.modalita !== "crea") return;
    const { suInvio } = parametri;

    if (!sottoTipo) {
      alert("Seleziona una motivazione!");
      return;
    }
    if (!dataInizio || !dataFine) {
      alert("Date non valide!");
      return;
    }
    if (idTipoRichiesta == null) {
      alert("Seleziona un tipo di richiesta!");
      return;
    }

    let dataInizioFinale = dataInizio;
    let dataFineFinale = dataFine;

    const inizioParsato = parsaOrario(orarioInizio);
    const fineParsata = parsaOrario(orarioFine);
    if (!inizioParsato || !fineParsata) {
      alert("Inserisci orari validi nel formato HH:MM");
      return;
    }
    if (eSelezioneGiornoSingolo) {
      if (!tuttoIlGiorno) {
        dataInizioFinale = applicaOrarioAData(
          new Date(dataInizio.getTime()),
          inizioParsato.ora,
          inizioParsato.minuto,
        );
        dataFineFinale = applicaOrarioAData(
          new Date(dataFine.getTime()),
          fineParsata.ora,
          fineParsata.minuto,
        );
        if (dataFineFinale < dataInizioFinale) {
          alert("L'orario di fine deve essere successivo a quello di inizio");
          return;
        }
      } else {
        dataInizioFinale = applicaOrarioAData(
          new Date(dataInizio.getTime()),
          9,
          0,
        );
        dataFineFinale = applicaOrarioAData(
          new Date(dataFine.getTime()),
          18,
          0,
        );
      }
    } else {
      dataInizioFinale = applicaOrarioAData(
        new Date(dataInizio.getTime()),
        inizioParsato.ora,
        inizioParsato.minuto,
      );
      dataFineFinale = applicaOrarioAData(
        new Date(dataFine.getTime()),
        fineParsata.ora,
        fineParsata.minuto,
      );
    }

    const payload: AddRichiestaPayload = {
      dataInizio: aStringaIsoLocale(dataInizioFinale),
      dataFine: aStringaIsoLocale(dataFineFinale),
      idTipoRichiesta,
      nota,
    };
    if (richiedeCodice && codiceRichiesta.trim() !== "") {
      payload.codiceRichiesta = codiceRichiesta.trim();
    }
    if (documento) {
      payload.documento = documento;
    }
    suInvio(payload);
  };

  // Valida e costruisce payload per la modifica
  const gestisciInvioModifica = () => {
    if (parametri.modalita !== "modifica") return;
    if (!dataInizio || !dataFine) {
      alert("Date non valide!");
      return;
    }

    const inizioParsato = parsaOrario(orarioInizio);
    const fineParsata = parsaOrario(orarioFine);
    if (!inizioParsato || !fineParsata) {
      alert("Inserisci orari validi nel formato HH:MM");
      return;
    }

    const dataInizioFinale = applicaOrarioAData(
      new Date(dataInizio.getTime()),
      inizioParsato.ora,
      inizioParsato.minuto,
    );
    const dataFineFinale = applicaOrarioAData(
      new Date(dataFine.getTime()),
      fineParsata.ora,
      fineParsata.minuto,
    );

    if (dataFineFinale < dataInizioFinale) {
      alert(
        "La data/ora di fine deve essere successiva o uguale a quella di inizio",
      );
      return;
    }

    const payload: InputAggiornamentoRichiesta = {
      IdRichiesta: parametri.idRichiesta,
      DataInizio: aStringaIsoLocale(dataInizioFinale),
      DataFine: aStringaIsoLocale(dataFineFinale),
      StatoApprovazione: stato,
    };
    if (documento) {
      payload.Documento = documento;
    }

    parametri.suInvio(payload);
  };

  return {
    // Comuni
    formattaData,
    stato,
    impostaStato,
    eSelezioneGiornoSingolo,

    // Sotto-tipo (solo creazione)
    sottoTipo,
    impostaSottoTipo,
    idTipoRichiesta,
    impostaIdTipoRichiesta,
    nota,
    impostaNota,
    codiceRichiesta,
    impostaCodiceRichiesta,
    richiedeCodice,
    richiedeDocumenti,
    inFocus,
    impostaInFocus,
    opzioniCorrente,

    // Gestione date
    dataInizio,
    dataFine,
    impostaDataInizio,
    impostaDataFine,

    // Orari
    orarioInizio,
    orarioFine,
    mostraSelettoreInizio,
    mostraSelettoreFine,
    tuttoIlGiorno,
    impostaTuttoIlGiorno,
    apriSelettoreOrario,
    gestisciCambioOrario,
    chiudiSelettori,

    // Funzioni di invio
    gestisciInvioCreazione,
    gestisciInvioModifica,
    // Documento
    documento,
    documentoInCaricamento,
    pickDocumento,
    rimuoviDocumento,
    caricaDocumento,
  };
};
