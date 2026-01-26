// Hook che gestisce la logica del modal richieste: stato UI, applicazione orari,
// validazioni base e costruzione payload per l'invio.
import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import {
  ABSENCE_OPTIONS,
  OVERTIME_OPTIONS,
  RequestType,
} from "../../../domain/entities/TypeRequest";
import { RequestStatus } from "../../../domain/entities/RequestStatus";
import {
  buildRequestPayload,
  RequestPayload,
} from "../services/requestsService";

export interface UseRequestModalLogicParams {
  visible: boolean;
  startDate: Date | null;
  endDate: Date | null;
  mainType: "assenza" | "straordinari";
  onSubmit: (data: RequestPayload) => void;
}

export const useRequestModalLogic = ({
  visible,
  startDate,
  endDate,
  mainType,
  onSubmit,
}: UseRequestModalLogicParams) => {
  // Stato UI selezioni
  const [subType, setSubType] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);

  const isSingleDaySelection =
    startDate && endDate && startDate.toDateString() === endDate.toDateString();

  const isHolidayRequest = useMemo(() => {
    return (
      subType === RequestType.FERIE || subType?.toLowerCase().includes("ferie")
    );
  }, [subType]);

  const isSickRequest = useMemo(() => {
    return subType === RequestType.MALATTIA;
  }, [subType]);

  // Formatta la data per la UI (dd/mm/yyyy) o placeholder se mancante
  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString("it-IT") : "--/--/----";
  };

  // Converte un oggetto Date in stringa HH:mm per la UI
  const formatTimeValue = (date: Date | null) => {
    if (!date) return "09:00";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Valida e parse stringa oraria HH:mm in {hour, minute}
  const parseTime = (value: string) => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
    if (!match) return null;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return { hour, minute };
  };

  // Arrotonda l'orario alla mezz'ora più vicina (00 o 30 minuti)
  const snapToHalfHour = (date: Date) => {
    const snapped = new Date(date);
    const minutes = snapped.getMinutes();
    if (minutes < 15) {
      snapped.setMinutes(0, 0, 0);
    } else if (minutes < 45) {
      snapped.setMinutes(30, 0, 0);
    } else {
      snapped.setHours(snapped.getHours() + 1, 0, 0, 0);
    }
    return snapped;
  };

  // Applica ore/minuti a una data usando UTC costruita con componenti locali (anti-shift)
  const applyTimeToDate = (date: Date, hour: number, minute: number) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return new Date(Date.UTC(y, m, d, hour, minute, 0, 0));
  };

  // Chiude entrambi i time picker
  const closePickers = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  // Gestisce toggle all-day e imposta orario di default 09:00–18:00
  const handleAllDayToggle = (value: boolean) => {
    if (isSickRequest) return; // malattia sempre all-day
    setIsAllDay(value);
    if (value) {
      setStartTime("09:00");
      setEndTime("18:00");
    }
  };

  // Aggiorna lo stato dell'orario dopo la scelta sul picker
  const handleTimeChange = (
    type: "start" | "end",
    event: any,
    selectedDate?: Date,
  ) => {
    // Su Android il picker inline non manda "dismissed"; su iOS lo gestiamo per uscire
    if (Platform.OS === "ios" && event?.type === "dismissed") return;

    const pickedDate = selectedDate || new Date();
    const snapped = snapToHalfHour(pickedDate);
    const formatted = formatTimeValue(snapped);

    if (type === "start") {
      setStartTime(formatted);
    } else {
      setEndTime(formatted);
    }
  };

  // Apre il time picker inline mostrato nel modal custom
  const openTimePicker = (type: "start" | "end") => {
    type === "start" ? setShowStartPicker(true) : setShowEndPicker(true);
  };

  // Reset stato quando il modal diventa visibile o cambiano le date selezionate
  useEffect(() => {
    if (visible) {
      setSubType(null);
      setStartTime("09:00");
      setEndTime("18:00");
      setIsAllDay(false);
      closePickers();
    }
  }, [visible, startDate, endDate]);

  const currentOptions = useMemo(
    () => (mainType === "straordinari" ? OVERTIME_OPTIONS : ABSENCE_OPTIONS),
    [mainType],
  );

  // Valida input, applica orari e costruisce il payload prima dell'invio
  const handleSubmit = () => {
    if (!subType) {
      alert("Seleziona una motivazione!");
      return;
    }

    if (!startDate || !endDate) {
      alert("Date non valide!");
      return;
    }

    let finalStartDate = startDate;
    let finalEndDate = endDate;

    // Malattia: sempre all-day, 09-18
    if (isSickRequest) {
      finalStartDate = applyTimeToDate(new Date(startDate.getTime()), 9, 0);
      finalEndDate = applyTimeToDate(new Date(endDate.getTime()), 18, 0);
    } else {
      const parsedStart = parseTime(startTime);
      const parsedEnd = parseTime(endTime);

      if (!parsedStart || !parsedEnd) {
        alert("Inserisci orari validi nel formato HH:MM");
        return;
      }

      if (isSingleDaySelection) {
        const shouldApplyTime = !isAllDay;

        if (shouldApplyTime) {
          finalStartDate = applyTimeToDate(
            new Date(startDate.getTime()),
            parsedStart.hour,
            parsedStart.minute,
          );
          finalEndDate = applyTimeToDate(
            new Date(endDate.getTime()),
            parsedEnd.hour,
            parsedEnd.minute,
          );

          if (finalEndDate < finalStartDate) {
            alert("L'orario di fine deve essere successivo a quello di inizio");
            return;
          }
        } else {
          // All-day singolo giorno: applica orario fisso 09-18
          finalStartDate = applyTimeToDate(new Date(startDate.getTime()), 9, 0);
          finalEndDate = applyTimeToDate(new Date(endDate.getTime()), 18, 0);
        }
      } else {
        // Multi-giorno: applica orario al primo giorno (inizio) e all'ultimo (fine)
        finalStartDate = applyTimeToDate(
          new Date(startDate.getTime()),
          parsedStart.hour,
          parsedStart.minute,
        );
        finalEndDate = applyTimeToDate(
          new Date(endDate.getTime()),
          parsedEnd.hour,
          parsedEnd.minute,
        );
      }
    }

    const MOCK_USER_ID = 1;
    const requestPayload = buildRequestPayload({
      mainType,
      subType,
      startDate: finalStartDate,
      endDate: finalEndDate,
      userId: MOCK_USER_ID,
      status: RequestStatus.PENDING,
    });

    console.log("--------------------------------------------------");
    console.log(
      `[RequestModal] Invio richiesta tipo: ${mainType} - ${subType}`,
    );
    console.log(JSON.stringify(requestPayload, null, 2));
    console.log("--------------------------------------------------");

    onSubmit(requestPayload);
  };

  return {
    subType,
    setSubType,
    isFocus,
    setIsFocus,
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    showStartPicker,
    showEndPicker,
    isAllDay,
    setIsAllDay: handleAllDayToggle,
    isSingleDaySelection,
    isHolidayRequest,
    isSickRequest,
    currentOptions,
    formatDate,
    openTimePicker,
    handleTimeChange,
    closePickers,
    handleSubmit,
  };
};
