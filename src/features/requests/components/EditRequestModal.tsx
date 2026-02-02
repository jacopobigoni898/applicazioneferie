import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { requestModalStyles } from "../../../core/style/commonStyles";
import { Colors } from "../../../core/theme/theme";
import {
  HolidayListDto,
  UpdateHolidayInput,
} from "../services/requestsService";

const STATUS_OPTIONS = [
  { label: "Approvato", value: "approvato" },
  { label: "Non validato", value: "non validato" },
  { label: "Annullato", value: "annullato" },
];

const parseDate = (value?: string | null) => {
  if (!value) return new Date();
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const parts = value.split("-");
  if (parts.length === 3) {
    const y = Number(parts[0]);
    const m = Number(parts[1]) - 1;
    const d = Number(parts[2]);
    const safeDate = new Date(Date.UTC(y, m, d, 9, 0, 0, 0));
    if (!Number.isNaN(safeDate.getTime())) return safeDate;
  }
  return new Date();
};

const formatPayloadDate = (date: Date) => date.toISOString().slice(0, 10);
const formatDisplayDate = (date: Date) => date.toLocaleDateString("it-IT");

export interface EditRequestModalProps {
  visible: boolean;
  item: HolidayListDto | null;
  onClose: () => void;
  onConfirm: (payload: UpdateHolidayInput) => void;
  saving?: boolean;
}

const EditRequestModal = ({
  visible,
  item,
  onClose,
  onConfirm,
  saving = false,
}: EditRequestModalProps) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [status, setStatus] = useState<string>("non validato");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (visible && item) {
      setStartDate(parseDate(item.data_inizio as any));
      setEndDate(parseDate(item.data_fine as any));
      setStatus(String(item.stato_approvazione || "non validato"));
      setShowStartPicker(false);
      setShowEndPicker(false);
    }
  }, [visible, item]);

  const isSameDay = useMemo(() => {
    return (
      startDate.toISOString().slice(0, 10) === endDate.toISOString().slice(0, 10)
    );
  }, [startDate, endDate]);

  const handleDateChange = (
    type: "start" | "end",
    _event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (type === "start") {
      if (date) setStartDate(date);
      if (Platform.OS !== "ios") setShowStartPicker(false);
    } else {
      if (date) setEndDate(date);
      if (Platform.OS !== "ios") setShowEndPicker(false);
    }
  };

  const handleSave = () => {
    if (!item) return;
    if (!status) {
      alert("Seleziona uno stato");
      return;
    }
    if (endDate < startDate) {
      alert("La data di fine deve essere successiva o uguale a quella di inizio");
      return;
    }

    const payload: UpdateHolidayInput = {
      idRichiesta: item.id_richiesta,
      dataInizio: formatPayloadDate(startDate),
      dataFine: formatPayloadDate(endDate),
      statoApprovazione: status,
    };

    onConfirm(payload);
  };

  const renderPicker = (type: "start" | "end") => {
    const visibleFlag = type === "start" ? showStartPicker : showEndPicker;
    const value = type === "start" ? startDate : endDate;

    if (!visibleFlag) return null;

    return (
      <DateTimePicker
        value={value}
        mode="date"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={(event, date) => handleDateChange(type, event, date || value)}
      />
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={requestModalStyles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={requestModalStyles.modalContainer}
            >
              <View style={requestModalStyles.content}>
                <View style={requestModalStyles.handleIndicator} />
                <Text style={requestModalStyles.headerTitle}>
                  Modifica richiesta
                </Text>
                {item?.tipo_permesso ? (
                  <Text style={requestModalStyles.subHeader}>
                    {item.tipo_permesso}
                  </Text>
                ) : null}

                <Text style={requestModalStyles.label}>Periodo</Text>
                <View style={requestModalStyles.dateRow}>
                  <View style={requestModalStyles.dateBox}>
                    <Text style={requestModalStyles.dateLabel}>Dal:</Text>
                    <TouchableOpacity
                      style={requestModalStyles.timeInput}
                      onPress={() => setShowStartPicker(true)}
                    >
                      <Text style={requestModalStyles.dateValue}>
                        {formatDisplayDate(startDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={requestModalStyles.dateBox}>
                    <Text style={requestModalStyles.dateLabel}>Al:</Text>
                    <TouchableOpacity
                      style={requestModalStyles.timeInput}
                      onPress={() => setShowEndPicker(true)}
                    >
                      <Text style={requestModalStyles.dateValue}>
                        {formatDisplayDate(endDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={requestModalStyles.label}>Stato approvazione</Text>
                <Dropdown
                  style={[
                    requestModalStyles.dropdown,
                    isFocus && { borderColor: Colors.primary },
                  ]}
                  placeholderStyle={requestModalStyles.placeholderStyle}
                  selectedTextStyle={requestModalStyles.selectedTextStyle}
                  data={STATUS_OPTIONS}
                  labelField="label"
                  valueField="value"
                  placeholder="Seleziona..."
                  value={status}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setStatus(item.value);
                    setIsFocus(false);
                  }}
                />

                <Text style={requestModalStyles.subHeader}>
                  {isSameDay ? "Richiesta singolo giorno" : "Richiesta multi giorno"}
                </Text>

                <View style={requestModalStyles.buttonRow}>
                  <TouchableOpacity
                    style={requestModalStyles.cancelButton}
                    onPress={onClose}
                    disabled={saving}
                  >
                    <Text style={requestModalStyles.cancelButtonText}>
                      Annulla
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      requestModalStyles.confirmButton,
                      saving && requestModalStyles.disabledButton,
                    ]}
                    onPress={handleSave}
                    disabled={saving}
                  >
                    <Text style={requestModalStyles.confirmButtonText}>
                      {saving ? "Salvataggio..." : "Salva"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {renderPicker("start")}
                {renderPicker("end")}
                <View style={{ height: 20 }} />
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditRequestModal;
