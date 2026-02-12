// Hook per la gestione dello stato del selettore date nella modale di modifica.
// Gestisce date temporanee per iOS, apertura/chiusura e conferma/annullamento.
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface ParametriSelettoreData {
  visibile: boolean;
  dataInizio: Date | null;
  dataFine: Date | null;
  impostaDataInizio: (data: Date) => void;
  impostaDataFine: (data: Date) => void;
}

export function useSelettoreDataModifica({
  visibile,
  dataInizio,
  dataFine,
  impostaDataInizio,
  impostaDataFine,
}: ParametriSelettoreData) {
  const [mostraSelettoreInizio, impostaMostraSelettoreInizio] = useState(false);
  const [mostraSelettoreFine, impostaMostraSelettoreFine] = useState(false);
  const [dataInizioTemp, impostaDataInizioTemp] = useState<Date | null>(null);
  const [dataFineTemp, impostaDataFineTemp] = useState<Date | null>(null);

  // Reset quando la modale appare
  useEffect(() => {
    if (visibile) {
      impostaMostraSelettoreInizio(false);
      impostaMostraSelettoreFine(false);
      impostaDataInizioTemp(null);
      impostaDataFineTemp(null);
    }
  }, [visibile]);

  // Apre il selettore data per il tipo specificato
  const apriSelettore = (tipo: "inizio" | "fine") => {
    if (tipo === "inizio") {
      impostaDataInizioTemp(dataInizio ?? new Date());
      impostaMostraSelettoreInizio(true);
    } else {
      impostaDataFineTemp(dataFine ?? new Date());
      impostaMostraSelettoreFine(true);
    }
  };

  // Gestione cambio data differenziata per piattaforma
  const gestisciCambioData = (
    tipo: "inizio" | "fine",
    _evento: DateTimePickerEvent,
    data?: Date,
  ) => {
    if (tipo === "inizio") {
      if (Platform.OS === "ios") {
        if (data) impostaDataInizioTemp(data);
      } else {
        if (data) impostaDataInizio(data);
        impostaMostraSelettoreInizio(false);
      }
    } else {
      if (Platform.OS === "ios") {
        if (data) impostaDataFineTemp(data);
      } else {
        if (data) impostaDataFine(data);
        impostaMostraSelettoreFine(false);
      }
    }
  };

  // Chiude il picker senza applicare modifiche
  const chiudiSelettore = (tipo: "inizio" | "fine") => {
    if (tipo === "inizio") {
      impostaMostraSelettoreInizio(false);
      impostaDataInizioTemp(null);
    } else {
      impostaMostraSelettoreFine(false);
      impostaDataFineTemp(null);
    }
  };

  // Conferma la data selezionata nel picker iOS
  const confermaSelettore = (tipo: "inizio" | "fine") => {
    if (tipo === "inizio") {
      if (dataInizioTemp) impostaDataInizio(dataInizioTemp);
      impostaMostraSelettoreInizio(false);
      impostaDataInizioTemp(null);
    } else {
      if (dataFineTemp) impostaDataFine(dataFineTemp);
      impostaMostraSelettoreFine(false);
      impostaDataFineTemp(null);
    }
  };

  return {
    mostraSelettoreInizio,
    mostraSelettoreFine,
    dataInizioTemp,
    dataFineTemp,
    apriSelettore,
    gestisciCambioData,
    chiudiSelettore,
    confermaSelettore,
  };
}
