import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import React, { useState, useMemo } from "react";
import { Calendar, DateData } from "react-native-calendars";
import { Colors, Typography, Spacing } from "../../../core/theme/theme";
import { Dropdown } from "react-native-element-dropdown";

// --- IMPORTIAMO LA CONFIGURAZIONE LOCALE ---
import { configureCalendarLocale } from "../../../core/utils/calendarConfig";

// --- IMPORTIAMO LE ENTITÀ E LE OPZIONI (Refactoring Completo) ---
import RequestModal from "../modal/RequestModal";
import { RequestStatus } from "../../../domain/entities/RequestStatus";
import { HolidayRequest } from "../../../domain/entities/HolidayRequest";
import { SickRequest } from "../../../domain/entities/SickRequest";
import { PermitsRequest } from "../../../domain/entities/PermitsRequest";
import { ExtraordinaryRequest } from "../../../domain/entities/RequestExtraordinary";
import {
  CALENDAR_VIEW_OPTIONS,
  CalendarMode,
} from "../../../domain/entities/TypeRequest";

// Eseguiamo la configurazione della lingua
configureCalendarLocale();

type PeriodSelected = {
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  textColor?: string;
  disabled?: boolean;
  activeOpacity?: number;
};

type MarkedDatesType = {
  [date: string]: PeriodSelected;
};

// ... generateWeekendMarks rimane UGUALE ...
const generateWeekendMarks = (): MarkedDatesType => {
  const marks: MarkedDatesType = {};
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1];

  years.forEach((year) => {
    let d = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    while (d <= end) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 1) {
        const dateString = d.toISOString().split("T")[0];
        marks[dateString] = { textColor: Colors.accent };
      }
      d.setDate(d.getDate() + 1);
    }
  });
  return marks;
};

export default function CalendarComp() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // 1. MODIFICA QUI: Uso l'Enum invece della stringa "assenza" scritta a mano
  const [calendarType, setCalendarType] = useState<string>(
    CalendarMode.ABSENCE
  );

  const [isFocus, setIsFocus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const weekendMarks = useMemo(() => generateWeekendMarks(), []);

  const onDayPress = (day: DateData) => {
    const selectedDate = day.dateString;
    if (!startDate || (startDate && endDate && startDate !== endDate)) {
      setStartDate(selectedDate);
      setEndDate(selectedDate);
    } else if (startDate && endDate && startDate === endDate) {
      if (selectedDate > startDate) {
        setEndDate(selectedDate);
      } else {
        setStartDate(selectedDate);
        setEndDate(selectedDate);
      }
    } else {
      setStartDate(selectedDate);
      setEndDate(selectedDate);
    }
  };

  const markedDates = useMemo(() => {
    let marks: MarkedDatesType = { ...weekendMarks };
    if (!startDate) return marks;
    if (startDate && endDate && startDate === endDate) {
      marks[startDate] = {
        startingDay: true,
        endingDay: true,
        color: Colors.primary,
        textColor: "white",
      };
      return marks;
    }
    marks[startDate] = {
      startingDay: true,
      color: Colors.primary,
      textColor: "white",
    };
    if (endDate) {
      marks[endDate] = {
        endingDay: true,
        color: Colors.primary,
        textColor: "white",
      };
      let currentDate = new Date(startDate);
      let stopDate = new Date(endDate);
      currentDate.setDate(currentDate.getDate() + 1);
      while (currentDate < stopDate) {
        const dateString = currentDate.toISOString().split("T")[0];
        marks[dateString] = { color: Colors.evidence, textColor: "white" };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return marks;
  }, [startDate, endDate, weekendMarks]);

  const handleConfirm = () => {
    if (startDate && endDate) {
      // 2. MODIFICA QUI: Uso l'Enum per il controllo Admin
      if (calendarType === CalendarMode.ADMIN) {
        Alert.alert("Admin", "Funzione admin non ancora implementata");
        return;
      }
      setModalVisible(true);
    }
  };

  const handleSubmission = (data: any) => {
    // ... Logica di salvataggio identica a prima ...
    // (Omissis per brevità, il codice dentro è lo stesso della risposta precedente)

    // Solo per completezza riporto l'inizio:
    const commonData = {
      id_richiesta: Date.now(),
      id_utente: 1,
      data_inizio: data.startDate,
      data_fine: data.endDate,
      stato_approvazione: RequestStatus.PENDING,
    };
    // ... Switch case per i tipi ...
    setModalVisible(false);
    Alert.alert("Successo", `Richiesta Inviata!`);
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.subtitle}>
          Scegli il calendario da visualizzare
        </Text>
      </View>

      {/* 3. MODIFICA QUI: data={CALENDAR_VIEW_OPTIONS} invece di dropdownData */}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: Colors.primary }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={CALENDAR_VIEW_OPTIONS} // <--- ECCOLO!
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Scegli il tipo di calendario" : "..."}
        value={calendarType}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setCalendarType(item.value);
          setIsFocus(false);
        }}
      />

      <View style={{ flex: 1 }}>
        <Calendar
          firstDay={1}
          markingType="period"
          markedDates={markedDates}
          onDayPress={onDayPress}
          theme={{
            arrowColor: Colors.textPrimary,
            todayTextColor: Colors.primary,
            monthTextColor: Colors.textPrimary,
            textDayFontWeight: Typography.weight.regular,
            textMonthFontWeight: Typography.weight.medium,
            textDayHeaderFontWeight: Typography.weight.medium,
          }}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (!startDate || !endDate) && styles.buttonDisabled,
        ]}
        onPress={handleConfirm}
        disabled={!startDate || !endDate}
      >
        <Text style={styles.buttonText}>Procedi con la richiesta</Text>
      </TouchableOpacity>

      <RequestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        startDate={startDate ? new Date(startDate) : null}
        endDate={endDate ? new Date(endDate) : null}
        // 4. MODIFICA QUI: Logica più robusta con l'Enum
        mainType={
          calendarType === CalendarMode.OVERTIME ? "straordinari" : "assenza"
        }
        onSubmit={handleSubmission}
      />
    </View>
  );
}

// ... Styles rimangono identici ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 54,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.light,
    textAlign: "left",
    color: Colors.textSecondary,
    paddingBottom: 10,
    paddingLeft: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  buttonDisabled: { backgroundColor: "#CCCCCC" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  dropdown: {
    marginBottom: Spacing.xl,
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    backgroundColor: Colors.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderStyle: { fontSize: 16, color: "#999" },
  selectedTextStyle: { fontSize: 16, color: Colors.textPrimary || "#000" },
  iconStyle: { width: 20, height: 20 },
  inputSearchStyle: { height: 40, fontSize: 16 },
  subtitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.light,
    textAlign: "left",
    color: Colors.textSecondary,
    paddingBottom: 10,
    paddingLeft: 5,
  },
});
