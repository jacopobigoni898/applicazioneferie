import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
  ABSENCE_OPTIONS,
  OVERTIME_OPTIONS,
  RequestType,
} from "../../../domain/entities/TypeRequest";
import { RequestStatus } from "../../../domain/entities/RequestStatus";
import { HolidayRequest } from "../../../domain/entities/HolidayRequest";
import { SickRequest } from "../../../domain/entities/SickRequest";
import { PermitsRequest } from "../../../domain/entities/PermitsRequest";
import { ExtraordinaryRequest } from "../../../domain/entities/RequestExtraordinary";

export interface UseRequestModalLogicParams {
  visible: boolean;
  startDate: Date | null;
  endDate: Date | null;
  mainType: "assenza" | "straordinari";
  onSubmit: (
    data: ExtraordinaryRequest | HolidayRequest | PermitsRequest | SickRequest,
  ) => void;
}

export const useRequestModalLogic = ({
  visible,
  startDate,
  endDate,
  mainType,
  onSubmit,
}: UseRequestModalLogicParams) => {
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

  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString("it-IT") : "--/--/----";
  };

  const formatTimeValue = (date: Date | null) => {
    if (!date) return "09:00";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const parseTime = (value: string) => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
    if (!match) return null;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return { hour, minute };
  };

  const applyTimeToDate = (date: Date, hour: number, minute: number) => {
    const cloned = new Date(date);
    cloned.setHours(hour, minute, 0, 0);
    return cloned;
  };

  const closePickers = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const handleTimeChange = (
    type: "start" | "end",
    event: any,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android" && event?.type === "dismissed") return;

    const pickedDate = selectedDate || new Date();
    const formatted = formatTimeValue(pickedDate);

    if (type === "start") {
      setShowStartPicker(Platform.OS === "ios");
      setStartTime(formatted);
    } else {
      setShowEndPicker(Platform.OS === "ios");
      setEndTime(formatted);
    }

    if (Platform.OS === "ios") {
      closePickers();
    }
  };

  const openTimePicker = (type: "start" | "end") => {
    if (Platform.OS === "android") {
      const baseDate =
        type === "start" ? startDate || new Date() : endDate || new Date();

      DateTimePickerAndroid.open({
        value: baseDate,
        mode: "time",
        is24Hour: true,
        onChange: (event, date) =>
          handleTimeChange(type, event, date || baseDate),
      });
      return;
    }

    type === "start" ? setShowStartPicker(true) : setShowEndPicker(true);
  };

  useEffect(() => {
    if (visible) {
      setSubType(null);
      setStartTime(formatTimeValue(startDate));
      setEndTime(formatTimeValue(endDate));
      setIsAllDay(false);
    }
  }, [visible, startDate, endDate]);

  const currentOptions = useMemo(
    () => (mainType === "straordinari" ? OVERTIME_OPTIONS : ABSENCE_OPTIONS),
    [mainType],
  );

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

    const shouldApplyTime =
      isSingleDaySelection && !isHolidayRequest && !isAllDay;

    if (shouldApplyTime) {
      const parsedStart = parseTime(startTime);
      const parsedEnd = parseTime(endTime);

      if (!parsedStart || !parsedEnd) {
        alert("Inserisci orari validi nel formato HH:MM");
        return;
      }

      finalStartDate = applyTimeToDate(
        startDate,
        parsedStart.hour,
        parsedStart.minute,
      );
      finalEndDate = applyTimeToDate(endDate, parsedEnd.hour, parsedEnd.minute);

      if (finalEndDate < finalStartDate) {
        alert("L'orario di fine deve essere successivo a quello di inizio");
        return;
      }
    } else if (isSingleDaySelection && isAllDay && !isHolidayRequest) {
      finalStartDate = applyTimeToDate(startDate, 0, 0);
      finalEndDate = applyTimeToDate(endDate, 23, 59);
    }

    const MOCK_USER_ID = 1;
    const NEW_REQUEST_ID = 0;
    const DEFAULT_STATUS = RequestStatus.PENDING;

    let requestPayload:
      | ExtraordinaryRequest
      | HolidayRequest
      | PermitsRequest
      | SickRequest;

    if (mainType === "straordinari") {
      const extraRequest: ExtraordinaryRequest = {
        id_richiesta: NEW_REQUEST_ID,
        id_utente: MOCK_USER_ID,
        data_inizio: finalStartDate,
        data_fine: finalEndDate,
        stato_approvazione: DEFAULT_STATUS,
      };
      requestPayload = extraRequest;
    } else {
      const typeLower = subType.toLowerCase();

      if (typeLower.includes("ferie")) {
        const holidayRequest: HolidayRequest = {
          id_richiesta: NEW_REQUEST_ID,
          id_utente: MOCK_USER_ID,
          data_inizio: finalStartDate,
          data_fine: finalEndDate,
          stato_approvazione: DEFAULT_STATUS,
        };
        requestPayload = holidayRequest;
      } else if (typeLower.includes("malattia")) {
        const sickRequest: SickRequest = {
          id_richiesta: NEW_REQUEST_ID,
          id_utente: MOCK_USER_ID,
          data_inizio: finalStartDate,
          data_fine: finalEndDate,
          stato_approvazione: DEFAULT_STATUS,
          certificato_medico: "",
        };
        requestPayload = sickRequest;
      } else {
        const permitsRequest: PermitsRequest = {
          id_richiesta: NEW_REQUEST_ID,
          id_utente: MOCK_USER_ID,
          tipo_permesso: subType,
          data_inizio: finalStartDate,
          data_fine: finalEndDate,
          stato_approvazione: DEFAULT_STATUS,
        };
        requestPayload = permitsRequest;
      }
    }

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
    showStartPicker,
    showEndPicker,
    isAllDay,
    setIsAllDay,
    isSingleDaySelection,
    isHolidayRequest,
    currentOptions,
    formatDate,
    openTimePicker,
    handleTimeChange,
    closePickers,
    handleSubmit,
  };
};
