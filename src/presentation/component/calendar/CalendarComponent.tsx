import React, { useCallback, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Dropdown } from "react-native-element-dropdown";
import { calendarTheme } from "../../../core/theme/calendarTheme";
import { calendarStyles } from "../../../core/style/commonStyles";
import { useRangeSelection } from "../../../core/utils/useRangeSelection";
import { IOSPullDown } from "../ios/IOSPullDown";
import { configureCalendarLocale } from "../../../core/utils/calendarConfig";
import RequestModal from "../modal/RequestModal";
import {
  CALENDAR_VIEW_OPTIONS,
  CalendarMode,
} from "../../../domain/entities/TypeRequest";

// Configura localizzazione calendario (nomi mesi/giorni in italiano)
configureCalendarLocale();

export default function CalendarComp() {
  // Hook condiviso: gestisce selezione intervallo, date marcate e reset
  const { startDate, endDate, markedDates, onDayPress, resetRange } =
    useRangeSelection();
  //stato del tipo di calendario settato inzialmente a calendario assenze
  const [calendarType, setCalendarType] = useState<string>(
    CalendarMode.ABSENCE,
  );
  //stato del fitro
  const [isFocus, setIsFocus] = useState(false);
  //stato della modale quando farla diventare visibile
  const [modalVisible, setModalVisible] = useState(false);

  // Stato UI: piattaforma, opzione selezionata e testo placeholder
  const isIOS = Platform.OS === "ios";
  const selectedOption = CALENDAR_VIEW_OPTIONS.find(
    (option) => option.value === calendarType,
  );
  const placeholderText = "Scegli il tipo di calendario";

  // Cambio filtro calendario (assenze/straordinari/admin) e chiusura focus
  const handleOptionSelect = useCallback((value: string) => {
    setCalendarType(value);
    setIsFocus(false);
  }, []);

  const handleConfirm = () => {
    // Se intervallo valido: blocca admin non implementato, altrimenti apre modale richiesta
    if (startDate && endDate) {
      if (calendarType === CalendarMode.ADMIN) {
        Alert.alert("Admin", "Funzione admin non ancora implementata");
        return;
      }
      setModalVisible(true);
    }
  };

  const handleSubmission = (data: any) => {
    // Log di debug del payload che arriva dalla modale prima di chiudere
    console.log("[CalendarComp] payload inviato:", data);
    setModalVisible(false);
    Alert.alert("Successo", "Richiesta Inviata!");
    resetRange();
  };

  return (
    <View style={calendarStyles.container}>
      <View>
        <Text style={calendarStyles.subtitle}>
          Scegli il calendario da visualizzare
        </Text>
      </View>

      {isIOS ? (
        // iOS: pull-down custom per scelta del tipo calendario
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
        // Android / altre piattaforme: dropdown della libreria element-dropdown
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
          firstDay={1} // settimana inizia di lunedì
          markingType="period" // usa intervalli contigui per markedDates
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
