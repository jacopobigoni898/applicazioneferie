// Hook unificato per la gestione del form richieste (creazione e modifica).
import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
  OPZIONI_ASSENZA,
  OPZIONI_STRAORDINARIO,
  TipoRichiesta,
} from "../../../domain/entities/TypeRequest";
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";
import {
  costruisciPayloadRichiesta,
  PayloadRichiesta,
  InputAggiornamentoFerie,
} from "../services/requestsService";
import { formatoAnnoMeseGiorno } from "../services/serializzazioneDate";

export type ModalitaForm = "crea" | "modifica";

export type ParametriFormRichiesta =
  | {
      modalita: "crea";
      visibile: boolean;
      dataInizio: Date | null;
      dataFine: Date | null;
      tipoPrincipale: "assenza" | "straordinari";
      idUtente: number | null;
      suInvio: (payload: PayloadRichiesta) => void;
    }
  | {
      modalita: "modifica";
      visibile: boolean;
      dataInizio: Date | string | null;
      dataFine: Date | string | null;
      idRichiesta: number;
      statoIniziale?: StatoRichiesta;
      suInvio: (payload: InputAggiornamentoFerie) => void;
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

  const eRichiestaMalattia = useMemo(() => {
    return sottoTipo === TipoRichiesta.MALATTIA;
  }, [sottoTipo]);

  const opzioniCorrente = useMemo(() => {
    if (parametri.modalita !== "crea") return [];
    return parametri.tipoPrincipale === "straordinari"
      ? OPZIONI_STRAORDINARIO
      : OPZIONI_ASSENZA;
  }, [parametri]);

  // Chiudi tutti i picker
  const chiudiSelettori = () => {
    impostaMostraSelettoreInizio(false);
    impostaMostraSelettoreFine(false);
  };

  const gestisciCambioOrario = (
    tipo: "inizio" | "fine",
    evento: any,
    dataSelezionata?: Date,
  ) => {
    if (parametri.modalita !== "crea") return;
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
    if (parametri.modalita !== "crea") return;

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
      impostaOrarioInizio("09:00");
      impostaOrarioFine("18:00");
      impostaTuttoIlGiorno(false);
      chiudiSelettori();

      impostaDataInizio(
        parametri.dataInizio ? parsaData(parametri.dataInizio) : null,
      );
      impostaDataFine(
        parametri.dataFine ? parsaData(parametri.dataFine) : null,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    visibile,
    parametri.modalita,
    parametri.modalita === "modifica" ? parametri.statoIniziale : null,
    parametri.dataInizio,
    parametri.dataFine,
  ]);

  // Valida e costruisce il payload per la creazione
  const gestisciInvioCreazione = () => {
    if (parametri.modalita !== "crea") return;
    const { tipoPrincipale, idUtente, suInvio } = parametri;

    if (!sottoTipo) {
      alert("Seleziona una motivazione!");
      return;
    }
    if (!dataInizio || !dataFine) {
      alert("Date non valide!");
      return;
    }
    if (idUtente == null || Number.isNaN(idUtente)) {
      alert("Impossibile inviare la richiesta: utente non disponibile");
      return;
    }

    let dataInizioFinale = dataInizio;
    let dataFineFinale = dataFine;

    if (eRichiestaMalattia) {
      dataInizioFinale = applicaOrarioAData(
        new Date(dataInizio.getTime()),
        9,
        0,
      );
      dataFineFinale = applicaOrarioAData(new Date(dataFine.getTime()), 18, 0);
    } else {
      const inizioParsato = parsaOrario(orarioInizio);
      const fineParsata = parsaOrario(orarioFine);
      if (!inizioParsato || !fineParsata) {
        alert("Inserisci orari validi nel formato HH:MM");
        return;
      }
      if (eSelezioneGiornoSingolo) {
        const deveApplicareOrario = !tuttoIlGiorno;
        if (deveApplicareOrario) {
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
    }

    const payloadRichiesta = costruisciPayloadRichiesta({
      tipoPrincipale,
      sottoTipo,
      dataInizio: dataInizioFinale,
      dataFine: dataFineFinale,
      idUtente,
      stato: StatoRichiesta.IN_ATTESA,
    });

    suInvio(payloadRichiesta);
  };

  // Valida e costruisce payload per la modifica
  const gestisciInvioModifica = () => {
    if (parametri.modalita !== "modifica") return;
    if (!dataInizio || !dataFine) {
      alert("Date non valide!");
      return;
    }
    if (dataFine < dataInizio) {
      alert(
        "La data di fine deve essere successiva o uguale a quella di inizio",
      );
      return;
    }

    const payload: InputAggiornamentoFerie = {
      IdRichiesta: parametri.idRichiesta,
      DataInizio: formatoAnnoMeseGiorno(dataInizio),
      DataFine: formatoAnnoMeseGiorno(dataFine),
      StatoApprovazione: stato,
    };

    parametri.suInvio(payload);
  };

  return {
    // Comuni
    formattaData,
    stato,
    impostaStato,
    eSelezioneGiornoSingolo,
    eRichiestaMalattia,

    // Sotto-tipo (solo creazione)
    sottoTipo,
    impostaSottoTipo,
    inFocus,
    impostaInFocus,
    opzioniCorrente,

    // Gestione date
    dataInizio,
    dataFine,
    impostaDataInizio,
    impostaDataFine,

    // Orari (solo creazione)
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
  };
};
