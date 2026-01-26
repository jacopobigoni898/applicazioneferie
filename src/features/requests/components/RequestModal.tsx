import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "../../../core/theme/theme";
import { requestModalStyles } from "../../../core/style/commonStyles";
import { useRequestModalLogic } from "../hooks/useRequestModalLogic";
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

const RequestModal = ({
  visible,
  onClose,
  startDate,
  endDate,
  mainType,
  onSubmit,
}: RequestModalProps) => {
  const {
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
  } = useRequestModalLogic({
    visible,
    startDate,
    endDate,
    mainType,
    onSubmit,
  });

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
                    <View style={requestModalStyles.toggleRow}>
                      <Text style={requestModalStyles.toggleLabel}>
                        Tutto il giorno
                      </Text>
                      <Switch
                        value={isAllDay}
                        onValueChange={setIsAllDay}
                        trackColor={{ false: "#d3d6dc", true: Colors.primary }}
                        thumbColor={isAllDay ? Colors.surface : "#f4f4f4"}
                        ios_backgroundColor="#d3d6dc"
                      />
                    </View>

                    {!isAllDay && (
                      <>
                        <Text style={requestModalStyles.label}>
                          Orario (solo se 1 giorno)
                        </Text>
                        <View style={requestModalStyles.timeRow}>
                          <View style={requestModalStyles.timeBox}>
                            <Text style={requestModalStyles.dateLabel}>
                              Inizio
                            </Text>
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
                            <Text style={requestModalStyles.dateLabel}>
                              Fine
                            </Text>
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
