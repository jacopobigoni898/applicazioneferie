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
import { HolidayRequest } from "../../../domain/entities/HolidayRequest";
import { UpdateHolidayInput } from "../services/requestsService";

import { RequestStatus } from "../../../domain/entities/RequestStatus";
import { useRequestForm } from "../hooks/useRequestForm";

const STATUS_OPTIONS = [
  { label: "Approvato", value: RequestStatus.APPROVED },
  { label: "Non validato", value: RequestStatus.PENDING },
  { label: "Annullato", value: RequestStatus.REJECTED },
];

export interface EditRequestModalProps {
  visible: boolean;
  item: HolidayRequest | null;
  onClose: () => void;
  onConfirm: (payload: UpdateHolidayInput) => void;
  saving?: boolean;
}

// Modale di modifica richiesta: riusa useRequestForm (mode edit) e gestisce picker data iOS con conferma
const EditRequestModal = ({
  visible,
  item,
  onClose,
  onConfirm,
  saving = false,
}: EditRequestModalProps) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    status,
    setStatus,
    formatDate,
    handleSubmitEdit,
  } = useRequestForm({
    mode: "edit",
    visible,
    startDate: item?.data_inizio ?? null,
    endDate: item?.data_fine ?? null,
    requestId: item?.id_richiesta ?? 0,
    initialStatus: item?.stato_approvazione as RequestStatus,
    onSubmit: onConfirm,
  });
  //stati temporanei in modo tale che finche l utente non conferma non vengono confermate le date
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (visible) {
      setShowStartPicker(false);
      setShowEndPicker(false);
      setTempStartDate(null);
      setTempEndDate(null);
    }
  }, [visible, item]);

  const isSameDay = useMemo(() => {
    if (!startDate || !endDate) return true;
    return (
      startDate.toISOString().slice(0, 10) ===
      endDate.toISOString().slice(0, 10)
    );
  }, [startDate, endDate]);

  const handleDateChange = (
    type: "start" | "end",
    _event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (type === "start") {
      if (Platform.OS === "ios") {
        if (date) setTempStartDate(date);
      } else {
        if (date) setStartDate(date);
        setShowStartPicker(false);
      }
    } else {
      if (Platform.OS === "ios") {
        if (date) setTempEndDate(date);
      } else {
        if (date) setEndDate(date);
        setShowEndPicker(false);
      }
    }
  };

  const renderPicker = (type: "start" | "end") => {
    const visibleFlag = type === "start" ? showStartPicker : showEndPicker;
    const value =
      type === "start" ? (startDate ?? new Date()) : (endDate ?? new Date());
    if (!visibleFlag) return null;

    if (Platform.OS === "ios") {
      const tempValue =
        type === "start" ? (tempStartDate ?? value) : (tempEndDate ?? value);
      return (
        <Modal transparent animationType="fade" visible={visibleFlag}>
          <TouchableWithoutFeedback
            onPress={() => {
              // tapping outside cancels picker without applying changes
              if (type === "start") {
                setShowStartPicker(false);
                setTempStartDate(null);
              } else {
                setShowEndPicker(false);
                setTempEndDate(null);
              }
            }}
          >
            <View style={requestModalStyles.pickerOverlay} />
          </TouchableWithoutFeedback>

          <View style={requestModalStyles.pickerSheet}>
            <View style={requestModalStyles.pickerHeader}>
              <Text style={requestModalStyles.pickerTitle}>Seleziona data</Text>
              <TouchableOpacity
                onPress={() => {
                  if (type === "start") {
                    setShowStartPicker(false);
                    setTempStartDate(null);
                  } else {
                    setShowEndPicker(false);
                    setTempEndDate(null);
                  }
                }}
              >
                <Text style={requestModalStyles.pickerClose}>Chiudi</Text>
              </TouchableOpacity>
            </View>

            <DateTimePicker
              value={tempValue}
              mode="date"
              display="spinner"
              onChange={(event, date) =>
                handleDateChange(type, event, date || tempValue)
              }
              style={requestModalStyles.pickerIOS}
              textColor={Colors.textPrimary}
            />

            <TouchableOpacity
              style={requestModalStyles.pickerConfirm}
              onPress={() => {
                if (type === "start") {
                  if (tempStartDate) setStartDate(tempStartDate);
                  setShowStartPicker(false);
                  setTempStartDate(null);
                } else {
                  if (tempEndDate) setEndDate(tempEndDate);
                  setShowEndPicker(false);
                  setTempEndDate(null);
                }
              }}
            >
              <Text style={requestModalStyles.pickerConfirmText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    }

    return (
      <DateTimePicker
        value={value}
        mode="date"
        display="default"
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
                      onPress={() => {
                        setTempStartDate(startDate ?? new Date());
                        setShowStartPicker(true);
                      }}
                    >
                      <Text style={requestModalStyles.dateValue}>
                        {formatDate(startDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={requestModalStyles.dateBox}>
                    <Text style={requestModalStyles.dateLabel}>Al:</Text>
                    <TouchableOpacity
                      style={requestModalStyles.timeInput}
                      onPress={() => {
                        setTempEndDate(endDate ?? new Date());
                        setShowEndPicker(true);
                      }}
                    >
                      <Text style={requestModalStyles.dateValue}>
                        {formatDate(endDate)}
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
                    setStatus(item.value as RequestStatus);
                    setIsFocus(false);
                  }}
                />

                <Text style={requestModalStyles.subHeader}>
                  {isSameDay
                    ? "Richiesta singolo giorno"
                    : "Richiesta multi giorno"}
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
                    onPress={handleSubmitEdit}
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
