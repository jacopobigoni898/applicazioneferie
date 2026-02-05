// Hook unificato per la gestione del form richieste (creazione e modifica).
import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
  ABSENCE_OPTIONS,
  OVERTIME_OPTIONS,
  RequestType,
} from "../../../domain/entities/TypeRequest";
import { RequestStatus } from "../../../domain/entities/RequestStatus";
import {
  buildRequestPayload,
  RequestPayload,
  UpdateHolidayInput,
} from "../services/requestsService";

export type FormMode = "create" | "edit";

export type UseRequestFormParams =
  | {
      mode: "create";
      visible: boolean;
      startDate: Date | null;
      endDate: Date | null;
      mainType: "assenza" | "straordinari";
      userId: number | null;
      onSubmit: (payload: RequestPayload) => void;
    }
  | {
      mode: "edit";
      visible: boolean;
      // possibili Date o stringhe provenienti dall'item
      startDate: Date | string | null;
      endDate: Date | string | null;
      requestId: number;
      initialStatus?: RequestStatus;
      onSubmit: (payload: UpdateHolidayInput) => void;
    };

// Helpers condivisi
const formatDate = (date: Date | null) =>
  date ? date.toLocaleDateString("it-IT") : "--/--/----";

const parseDate = (value?: string | Date | null) => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  const parts = String(value).split("-");
  if (parts.length === 3) {
    const y = Number(parts[0]);
    const m = Number(parts[1]) - 1;
    const d = Number(parts[2]);
    const safeDate = new Date(Date.UTC(y, m, d, 9, 0, 0, 0));
    if (!Number.isNaN(safeDate.getTime())) return safeDate;
  }
  return new Date();
};

const parseTime = (value: string) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
};

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

const applyTimeToDate = (date: Date, hour: number, minute: number) => {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  return new Date(Date.UTC(y, m, d, hour, minute, 0, 0));
};

export const useRequestForm = (params: UseRequestFormParams) => {
  const { visible } = params;

  // Stato locale delle date (gestito qui sia per create che per edit)
  const [startDate, setStartDate] = useState<Date | null>(
    params.startDate ? parseDate(params.startDate) : null,
  );
  const [endDate, setEndDate] = useState<Date | null>(
    params.endDate ? parseDate(params.endDate) : null,
  );

  // Stato comune (riusato da create/edit)
  const [status, setStatus] = useState<RequestStatus>(
    params.mode === "edit"
      ? (params.initialStatus ?? RequestStatus.PENDING)
      : RequestStatus.PENDING,
  );
  const [subType, setSubType] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);

  const isSingleDaySelection =
    startDate && endDate && startDate.toDateString() === endDate.toDateString();

  const isSickRequest = useMemo(() => {
    return subType === RequestType.MALATTIA;
  }, [subType]);

  const currentOptions = useMemo(() => {
    if (params.mode !== "create") return [];
    return params.mainType === "straordinari"
      ? OVERTIME_OPTIONS
      : ABSENCE_OPTIONS;
  }, [params]);

  // Utility per chiudere entrambi i picker
  const closePickers = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const handleAllDayToggle = (value: boolean) => {
    if (isSickRequest) return; // malattia sempre all-day
    setIsAllDay(value);
    if (value) {
      setStartTime("09:00");
      setEndTime("18:00");
    }
  };

  const handleTimeChange = (
    type: "start" | "end",
    event: any,
    selectedDate?: Date,
  ) => {
    if (params.mode !== "create") return;

    if (Platform.OS === "ios" && event?.type === "dismissed") return;
    const pickedDate = selectedDate || new Date();
    const snapped = snapToHalfHour(pickedDate);
    const hours = String(snapped.getHours()).padStart(2, "0");
    const minutes = String(snapped.getMinutes()).padStart(2, "0");
    const formatted = `${hours}:${minutes}`;

    if (type === "start") setStartTime(formatted);
    else setEndTime(formatted);
  };

  const openTimePicker = (type: "start" | "end") => {
    if (params.mode !== "create") return;

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value:
          type === "start" ? startDate || new Date() : endDate || new Date(),
        mode: "time",
        is24Hour: true,
        onChange: (event, date) =>
          handleTimeChange(type, event, date || new Date()),
      });
      return;
    }

    type === "start" ? setShowStartPicker(true) : setShowEndPicker(true);
  };

  // Reset stato quando la modale cambia visibilità o cambia il range esterno (create)
  // o quando cambia l'item (edit). Evitiamo dipendenza da oggetti non stabili.
  useEffect(() => {
    if (visible) {
      setStatus(
        params.mode === "edit"
          ? (params.initialStatus ?? RequestStatus.PENDING)
          : RequestStatus.PENDING,
      );
      setSubType(null);
      setStartTime("09:00");
      setEndTime("18:00");
      setIsAllDay(false);
      closePickers();

      // Allineiamo le date allo stato esterno/nuovo item
      setStartDate(params.startDate ? parseDate(params.startDate) : null);
      setEndDate(params.endDate ? parseDate(params.endDate) : null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    visible,
    params.mode,
    params.mode === "edit" ? params.initialStatus : null,
    params.startDate,
    params.endDate,
  ]);

  // Valida input e costruisce il payload per create
  const handleSubmitCreate = () => {
    if (params.mode !== "create") return;
    const { mainType, userId, onSubmit } = params;

    if (!subType) {
      alert("Seleziona una motivazione!");
      return;
    }
    if (!startDate || !endDate) {
      alert("Date non valide!");
      return;
    }
    if (userId == null || Number.isNaN(userId)) {
      alert("Impossibile inviare la richiesta: utente non disponibile");
      return;
    }

    let finalStartDate = startDate;
    let finalEndDate = endDate;

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
          finalStartDate = applyTimeToDate(new Date(startDate.getTime()), 9, 0);
          finalEndDate = applyTimeToDate(new Date(endDate.getTime()), 18, 0);
        }
      } else {
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

    const requestPayload = buildRequestPayload({
      mainType,
      subType,
      startDate: finalStartDate,
      endDate: finalEndDate,
      userId,
      status: RequestStatus.PENDING,
    });

    onSubmit(requestPayload);
  };

  // Valida input e costruisce payload per edit
  const handleSubmitEdit = () => {
    if (params.mode !== "edit") return;
    if (!startDate || !endDate) {
      alert("Date non valide!");
      return;
    }
    if (endDate < startDate) {
      alert(
        "La data di fine deve essere successiva o uguale a quella di inizio",
      );
      return;
    }

    const payload: UpdateHolidayInput = {
      IdRichiesta: params.requestId,
      DataInizio: startDate.toISOString().slice(0, 10),
      DataFine: endDate.toISOString().slice(0, 10),
      StatoApprovazione: status,
    };

    params.onSubmit(payload);
  };

  return {
    // common
    formatDate,
    status,
    setStatus,
    isSingleDaySelection,
    isSickRequest,

    // subtype (create only)
    subType,
    setSubType,
    isFocus,
    setIsFocus,
    currentOptions,

    // date management
    startDate,
    endDate,
    setStartDate,
    setEndDate,

    // time (create only)
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    showStartPicker,
    showEndPicker,
    isAllDay,
    setIsAllDay: handleAllDayToggle,
    openTimePicker,
    handleTimeChange,
    closePickers,

    // submitters
    handleSubmitCreate,
    handleSubmitEdit,
  };
};
