import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "../../../core/theme/theme";
import { requestModalStyles } from "../../../core/style/commonStyles";

import {
  ABSENCE_OPTIONS,
  OVERTIME_OPTIONS,
  RequestType,
} from "../../../domain/entities/TypeRequest";

// Assicurati che il percorso di importazione sia corretto in base alla tua struttura file
import { RequestStatus } from "../../../domain/entities/RequestStatus";
// Importiamo le interfacce specifiche per costruire l'oggetto giusto
import { HolidayRequest } from "../../../domain/entities/HolidayRequest";
import { SickRequest } from "../../../domain/entities/SickRequest";
import { PermitsRequest } from "../../../domain/entities/PermitsRequest";
import { ExtraordinaryRequest } from "../../../domain/entities/RequestExtraordinary";

interface RequestModalProps {
  visible: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  mainType: "assenza" | "straordinari";
  onSubmit: (
    data: ExtraordinaryRequest | HolidayRequest | PermitsRequest | SickRequest,
  ) => void;
}

// Modale per creare richieste di assenza/straordinario
const RequestModal = ({
  visible,
  onClose,
  startDate,
  endDate,
  mainType,
  onSubmit,
}: RequestModalProps) => {
  const [subType, setSubType] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const isSingleDaySelection =
    startDate && endDate && startDate.toDateString() === endDate.toDateString();

  const isHolidayRequest =
    subType === RequestType.FERIE || subType?.toLowerCase().includes("ferie");

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

  const closePickers = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const renderIOSPicker = () => {
    if (!showStartPicker && !showEndPicker) return null;

    const isStart = showStartPicker;
    const value = isStart ? startDate || new Date() : endDate || new Date();
    const type = isStart ? "start" : "end";

    return (
      <Modal
        transparent
        animationType="fade"
        visible={showStartPicker || showEndPicker}
        onRequestClose={closePickers}
      >
        <TouchableWithoutFeedback onPress={closePickers}>
          <View style={requestModalStyles.pickerOverlay}>
            <TouchableWithoutFeedback>
              <View style={requestModalStyles.pickerSheet}>
                <View style={requestModalStyles.pickerHeader}>
                  <Text style={requestModalStyles.pickerTitle}>
                    Seleziona orario
                  </Text>
                  <TouchableOpacity onPress={closePickers}>
                    <Text style={requestModalStyles.pickerClose}>Chiudi</Text>
                  </TouchableOpacity>
                </View>

                <DateTimePicker
                  value={value}
                  mode="time"
                  is24Hour
                  display="spinner"
                  themeVariant="light"
                  textColor={Colors.textPrimary}
                  onChange={(event, date) => {
                    if (event?.type === "dismissed") {
                      closePickers();
                      return;
                    }
                    handleTimeChange(type, event, date || value);
                  }}
                  style={requestModalStyles.pickerIOS}
                />

                <TouchableOpacity
                  style={requestModalStyles.pickerConfirm}
                  onPress={closePickers}
                >
                  <Text style={requestModalStyles.pickerConfirmText}>OK</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  useEffect(() => {
    if (visible) {
      setSubType(null); // reset motivazione quando si riapre
      setStartTime(formatTimeValue(startDate));
      setEndTime(formatTimeValue(endDate));
    }
  }, [visible, startDate, endDate]);

  const currentOptions =
    mainType === "straordinari" ? OVERTIME_OPTIONS : ABSENCE_OPTIONS;

  // --- MODIFICA: LOGICA DI COSTRUZIONE OGGETTI ---
  const handleSubmit = () => {
    if (!subType) {
      alert("Seleziona una motivazione!");
      return; // blocca invio senza motivazione
    }

    if (!startDate || !endDate) {
      alert("Date non valide!");
      return; // blocca invio senza date
    }

    let finalStartDate = startDate;
    let finalEndDate = endDate;

    const shouldApplyTime = isSingleDaySelection && !isHolidayRequest;

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
    }

    // DATI COMUNI (mockati: id_utente/stato dovrebbero venire dal backend)
    const MOCK_USER_ID = 1;
    const NEW_REQUEST_ID = 0; // Il backend genererà l'ID reale
    // Assumiamo che RequestStatus sia un Enum, usiamo un valore di default (es. PENDING/1)
    // Se RequestStatus è una stringa, metti "In Attesa"
    const DEFAULT_STATUS = RequestStatus.PENDING;

    let requestPayload:
      | ExtraordinaryRequest
      | HolidayRequest
      | PermitsRequest
      | SickRequest;

    // 1. GESTIONE STRAORDINARI
    if (mainType === "straordinari") {
      const extraRequest: ExtraordinaryRequest = {
        id_richiesta: NEW_REQUEST_ID,
        id_utente: MOCK_USER_ID,
        data_inizio: finalStartDate,
        data_fine: finalEndDate,
        stato_approvazione: DEFAULT_STATUS,
      };
      requestPayload = extraRequest;
    }
    // 2. GESTIONE ASSENZE (Ferie, Malattia, Permessi)
    else {
      // Normalizziamo la stringa per il confronto (dipende dai valori nel tuo ABSENCE_OPTIONS)
      const typeLower = subType.toLowerCase();

      if (typeLower.includes("ferie")) {
        // --- FERIE ---
        const holidayRequest: HolidayRequest = {
          id_richiesta: NEW_REQUEST_ID,
          id_utente: MOCK_USER_ID,
          data_inizio: finalStartDate,
          data_fine: finalEndDate,
          stato_approvazione: DEFAULT_STATUS,
        };
        requestPayload = holidayRequest;
      } else if (typeLower.includes("malattia")) {
        // --- MALATTIA ---
        const sickRequest: SickRequest = {
          id_richiesta: NEW_REQUEST_ID,
          id_utente: MOCK_USER_ID,
          data_inizio: finalStartDate,
          data_fine: finalEndDate,
          stato_approvazione: DEFAULT_STATUS,
          certificato_medico: "", // Placeholder: manca upload file nella UI
        };
        requestPayload = sickRequest;
      } else {
        // --- ALTRI PERMESSI (ROL, EX-FEST, ecc.) ---
        const permitsRequest: PermitsRequest = {
          id_richiesta: NEW_REQUEST_ID,
          id_utente: MOCK_USER_ID,
          tipo_permesso: subType, // Passiamo la stringa specifica (es. "ROL")
          data_inizio: finalStartDate,
          data_fine: finalEndDate,
          stato_approvazione: DEFAULT_STATUS,
        };
        requestPayload = permitsRequest;
      }
    }

    // Log per debug
    console.log("--------------------------------------------------"); // debug
    console.log(
      `[RequestModal] Invio richiesta tipo: ${mainType} - ${subType}`,
    );
    console.log(JSON.stringify(requestPayload, null, 2));
    console.log("--------------------------------------------------");

    // Invio al padre
    onSubmit(requestPayload);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={requestModalStyles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={requestModalStyles.modalContainer}
            >
              <View style={requestModalStyles.content}>
                <View style={requestModalStyles.handleIndicator} />

                <Text style={requestModalStyles.headerTitle}>
                  Nuova Richiesta
                </Text>
                <Text style={requestModalStyles.subHeader}>
                  {mainType === "assenza"
                    ? "Assenza / Permesso"
                    : "Straordinario"}
                </Text>

                <View style={requestModalStyles.dateRow}>
                  <View style={requestModalStyles.dateBox}>
                    <Text style={requestModalStyles.dateLabel}>Dal:</Text>
                    <Text style={requestModalStyles.dateValue}>
                      {formatDate(startDate)}
                    </Text>
                  </View>
                  <View style={requestModalStyles.dateBox}>
                    <Text style={requestModalStyles.dateLabel}>Al:</Text>
                    <Text style={requestModalStyles.dateValue}>
                      {formatDate(endDate)}
                    </Text>
                  </View>
                </View>

                {isSingleDaySelection && !isHolidayRequest && (
                  <>
                    <Text style={requestModalStyles.label}>
                      Orario (solo se 1 giorno)
                    </Text>
                    <View style={requestModalStyles.timeRow}>
                      <View style={requestModalStyles.timeBox}>
                        <Text style={requestModalStyles.dateLabel}>Inizio</Text>
                        <TouchableOpacity
                          style={requestModalStyles.timeInput}
                          onPress={() => openTimePicker("start")}
                        >
                          <Text style={requestModalStyles.timeText}>
                            {startTime}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={requestModalStyles.timeBox}>
                        <Text style={requestModalStyles.dateLabel}>Fine</Text>
                        <TouchableOpacity
                          style={requestModalStyles.timeInput}
                          onPress={() => openTimePicker("end")}
                        >
                          <Text style={requestModalStyles.timeText}>
                            {endTime}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}

                <Text style={requestModalStyles.label}>Motivazione:</Text>
                <Dropdown
                  style={[
                    requestModalStyles.dropdown,
                    isFocus && { borderColor: Colors.primary },
                  ]}
                  placeholderStyle={requestModalStyles.placeholderStyle}
                  selectedTextStyle={requestModalStyles.selectedTextStyle}
                  data={currentOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Seleziona..."
                  value={subType}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setSubType(item.value);
                    setIsFocus(false);
                  }}
                />
                <View style={requestModalStyles.buttonRow}>
                  <TouchableOpacity
                    style={requestModalStyles.cancelButton}
                    onPress={onClose}
                  >
                    <Text style={requestModalStyles.cancelButtonText}>
                      Annulla
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      requestModalStyles.confirmButton,
                      !subType && requestModalStyles.disabledButton,
                    ]}
                    onPress={handleSubmit}
                    disabled={!subType}
                  >
                    <Text style={requestModalStyles.confirmButtonText}>
                      Invia
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ height: 20 }} />
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      {Platform.OS === "ios" && renderIOSPicker()}
    </Modal>
  );
};

export default RequestModal;
