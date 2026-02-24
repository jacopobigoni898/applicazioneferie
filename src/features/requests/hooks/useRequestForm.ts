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
import { parsaData, formattaDataForm } from "../../../shared/utils/dateUtils";
import {
  parsaOrario,
  arrotondaAMezzora,
  applicaOrarioAData,
  formattaOrario,
} from "../../../shared/utils/timeUtils";

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
    const formattato = formattaOrario(arrotondata.getHours(), arrotondata.getMinutes());

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
        const oreInizio = dataInizioParsata ? dataInizioParsata.getHours() : 9;
        const minInizio = dataInizioParsata ? dataInizioParsata.getMinutes() : 0;
        const oreFine = dataFineParsata ? dataFineParsata.getHours() : 18;
        const minFine = dataFineParsata ? dataFineParsata.getMinutes() : 0;
        // Se entrambi gli orari sono 00:00, usa valori di default (dati legacy senza orario)
        const inizioEZero = oreInizio === 0 && minInizio === 0;
        const fineEZero = oreFine === 0 && minFine === 0;
        impostaOrarioInizio(
          inizioEZero && fineEZero ? "09:00" : formattaOrario(oreInizio, minInizio),
        );
        impostaOrarioFine(
          inizioEZero && fineEZero ? "18:00" : formattaOrario(oreFine, minFine),
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

  // Carica il documento esistente quando la modale di modifica si apre
  useEffect(() => {
    let annulla = false;
    if (
      visibile &&
      parametri.modalita === "modifica" &&
      parametri.idRichiesta
    ) {
      impostaDocumentoInCaricamento(true);
      recuperaDocumento(parametri.idRichiesta)
        .then((doc) => {
          if (!annulla) impostaDocumento(doc);
        })
        .finally(() => {
          if (!annulla) impostaDocumentoInCaricamento(false);
        });
    } else {
      impostaDocumento(null);
      impostaDocumentoInCaricamento(false);
    }
    return () => {
      annulla = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibile, parametri.modalita === "modifica" ? parametri.idRichiesta : null]);

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
    formattaData: formattaDataForm,
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
  };
};
