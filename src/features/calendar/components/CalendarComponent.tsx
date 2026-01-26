import React, { useCallback, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Dropdown } from "react-native-element-dropdown";
import { calendarTheme } from "../../../core/theme/calendarTheme";
import { calendarStyles } from "../../../core/style/commonStyles";
import { useRangeSelection } from "../hooks/useRangeSelection";
import { IOSPullDown } from "../../../core/ui/IOSPullDown";
import { configureCalendarLocale } from "../../../core/utils/calendarConfig";
import RequestModal from "../../../features/requests/components/RequestModal";
import {
  CALENDAR_VIEW_OPTIONS,
  CalendarMode,
} from "../../../domain/entities/TypeRequest";
import {
  RequestPayload,
  submitHolidayByToken,
  submitRequest,
} from "../../../features/requests/services/requestsService";

// Configura localizzazione calendario (nomi mesi/giorni in italiano)
configureCalendarLocale();

export default function CalendarComp() {
  const { startDate, endDate, markedDates, onDayPress, resetRange } =
    useRangeSelection();
  const [calendarType, setCalendarType] = useState<string>(
    CalendarMode.ABSENCE,
  );
  const [isFocus, setIsFocus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const isIOS = Platform.OS === "ios";
  const selectedOption = CALENDAR_VIEW_OPTIONS.find(
    (option) => option.value === calendarType,
  );
  const placeholderText = "Scegli il tipo di calendario";

  const handleOptionSelect = useCallback((value: string) => {
    setCalendarType(value);
    setIsFocus(false);
  }, []);

  const handleConfirm = () => {
    if (startDate && endDate) {
      if (calendarType === CalendarMode.ADMIN) {
        Alert.alert("Admin", "Funzione admin non ancora implementata");
        return;
      }
      setModalVisible(true);
    }
  };

  const handleSubmission = async (data: RequestPayload) => {
    try {
      const isHoliday =
        calendarType === CalendarMode.ABSENCE &&
        !(data as any).tipo_permesso &&
        !(data as any).certificato_medico;

      if (isHoliday) {
        await submitHolidayByToken(data.data_inizio, data.data_fine);
      } else {
        await submitRequest(data);
      }

      setModalVisible(false);
      Alert.alert("Successo", "Richiesta inviata!");
      resetRange();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Errore durante l'invio";
      Alert.alert("Errore", msg);
    }
  };

  return (
    <View style={calendarStyles.container}>
      <View>
        <Text style={calendarStyles.subtitle}>
          Scegli il calendario da visualizzare
        </Text>
      </View>

      {isIOS ? (
        <IOSPullDown
          options={CALENDAR_VIEW_OPTIONS}
          selectedLabel={selectedOption?.label}
          placeholder={placeholderText}
          onSelect={handleOptionSelect}
          triggerStyle={[calendarStyles.dropdown, calendarStyles.iosPicker]}
          selectedTextStyle={calendarStyles.selectedTextStyle}
          placeholderStyle={calendarStyles.placeholderStyle}
        />
      ) : (
        <Dropdown
          style={[
            calendarStyles.dropdown,
            isFocus && calendarStyles.dropdownFocus,
          ]}
          placeholderStyle={calendarStyles.placeholderStyle}
          selectedTextStyle={calendarStyles.selectedTextStyle}
          inputSearchStyle={calendarStyles.inputSearchStyle}
          iconStyle={calendarStyles.iconStyle}
          data={CALENDAR_VIEW_OPTIONS}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? placeholderText : "..."}
          value={calendarType}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => handleOptionSelect(item.value)}
        />
      )}

      <View style={calendarStyles.calendarWrapper}>
        <Calendar
          firstDay={1}
          markingType="period"
          markedDates={markedDates}
          onDayPress={onDayPress}
          theme={calendarTheme}
        />
      </View>

      <TouchableOpacity
        style={[
          calendarStyles.button,
          (!startDate || !endDate) && calendarStyles.buttonDisabled,
        ]}
        onPress={handleConfirm}
        disabled={!startDate || !endDate}
      >
        <Text style={calendarStyles.buttonText}>Procedi con la richiesta</Text>
      </TouchableOpacity>

      <RequestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        startDate={startDate ? new Date(startDate) : null}
        endDate={endDate ? new Date(endDate) : null}
        mainType={
          calendarType === CalendarMode.OVERTIME ? "straordinari" : "assenza"
        }
        onSubmit={handleSubmission}
      />
    </View>
  );
}
