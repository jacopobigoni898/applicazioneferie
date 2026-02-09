import { useCallback, useMemo, useState } from "react";
import { DateData } from "react-native-calendars";
import { Colori } from "../../../core/theme/theme";

// Tipo per un singolo giorno marcato nel calendario (periodo)
export type PeriodoSelezionato = {
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  textColor?: string;
  disabled?: boolean;
  activeOpacity?: number;
};

export type DateMarcateType = {
  [data: string]: PeriodoSelezionato;
};

// Pre-calcola i weekend (sabato e domenica) per l'anno corrente e il successivo
const generaSegnalaturaWeekend = (): DateMarcateType => {
  const segni: DateMarcateType = {};
  const annoCorrente = new Date().getFullYear();
  const anni = [annoCorrente, annoCorrente + 1];

  anni.forEach((anno) => {
    let giorno = new Date(anno, 0, 1);
    const fine = new Date(anno, 11, 31);
    while (giorno <= fine) {
      const giornoSettimana = giorno.getDay();
      // 0 = Domenica, 6 = Sabato
      if (giornoSettimana === 0 || giornoSettimana === 1) {
        const stringaData = giorno.toISOString().split("T")[0];
        segni[stringaData] = { textColor: Colori.accento };
      }
      giorno.setDate(giorno.getDate() + 1);
    }
  });
  return segni;
};

// Hook per la gestione della selezione di un intervallo di date nel calendario.
// Gestisce la logica di primo/secondo tap, la colorazione dei giorni selezionati
// e l'evidenziazione dei weekend.
export function useSelezioneIntervallo() {
  const [dataInizio, impostaDataInizio] = useState<string | null>(null);
  const [dataFine, impostaDataFine] = useState<string | null>(null);

  // Weekend pre-calcolati per evidenziare le giornate non lavorative
  const segniWeekend = useMemo(() => generaSegnalaturaWeekend(), []);

  // Gestisce il tap su un giorno del calendario
  const suPressioneGiorno = useCallback(
    (giorno: DateData) => {
      const dataSelezionata = giorno.dateString;

      // Primo tap o reset: imposta inizio e fine sullo stesso giorno
      if (!dataInizio || dataInizio !== dataFine) {
        impostaDataInizio(dataSelezionata);
        impostaDataFine(dataSelezionata);
      }
      // Secondo tap: se la data è successiva, estendi l'intervallo
      else if (dataSelezionata > dataInizio) {
        impostaDataFine(dataSelezionata);
      }
      // Altrimenti reset al nuovo giorno
      else {
        impostaDataInizio(dataSelezionata);
        impostaDataFine(dataSelezionata);
      }
    },
    [dataInizio, dataFine],
  );

  // Calcola le date marcate combinando weekend e selezione utente
  const dateMarcate = useMemo(() => {
    let segni: DateMarcateType = { ...segniWeekend };
    if (!dataInizio) return segni;

    // Selezione di un singolo giorno
    if (dataInizio && dataFine && dataInizio === dataFine) {
      segni[dataInizio] = {
        startingDay: true,
        endingDay: true,
        color: Colori.primario,
        textColor: "white",
      };
      return segni;
    }

    // Selezione di un intervallo
    segni[dataInizio] = {
      startingDay: true,
      color: Colori.primario,
      textColor: "white",
    };
    if (dataFine) {
      segni[dataFine] = {
        endingDay: true,
        color: Colori.primario,
        textColor: "white",
      };

      // Colora i giorni intermedi
      let dataCorrente = new Date(dataInizio);
      let dataStop = new Date(dataFine);
      dataCorrente.setDate(dataCorrente.getDate() + 1);
      while (dataCorrente < dataStop) {
        const stringaData = dataCorrente.toISOString().split("T")[0];
        segni[stringaData] = { color: Colori.evidenza, textColor: "white" };
        dataCorrente.setDate(dataCorrente.getDate() + 1);
      }
    }
    return segni;
  }, [dataInizio, dataFine, segniWeekend]);

  // Resetta la selezione corrente
  const resettaIntervallo = useCallback(() => {
    impostaDataInizio(null);
    impostaDataFine(null);
  }, []);

  return {
    dataInizio,
    dataFine,
    dateMarcate,
    suPressioneGiorno,
    resettaIntervallo,
  };
}
