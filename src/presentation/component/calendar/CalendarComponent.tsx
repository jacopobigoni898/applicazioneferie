import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import React, { useState, useMemo } from "react";
import { Calendar, LocaleConfig, DateData } from "react-native-calendars";
import { Colors, Typography, Spacing } from "../../../core/theme/theme";
import { Dropdown } from "react-native-element-dropdown";
//configurazione in italiano del calendario
LocaleConfig.locales["it"] = {
  monthNames: [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ],
  monthNamesShort: [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
  today: "Oggi",
};
LocaleConfig.defaultLocale = "it";

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

//dati per filtro
const dropdownData = [
  { label: "Richiesta Assenza", value: "assenza" },
  { label: "Richiesta Straordinari", value: "straordinari" },
  { label: "Panoramica Generale (Admin)", value: "admin" },
];

const generateWeekendMarks = (): MarkedDatesType => {
  const marks: MarkedDatesType = {};
  const currentYear = new Date().getFullYear();
  // Calcoliamo i weekend per quest'anno e il prossimo per coprire lo scroll
  const years = [currentYear, currentYear + 1];

  years.forEach((year) => {
    let d = new Date(year, 0, 1); // 1 Gennaio
    const end = new Date(year, 11, 31); // 31 Dicembre

    while (d <= end) {
      const dayOfWeek = d.getDay();
      // 0 = Domenica, 6 = Sabato
      if (dayOfWeek === 0 || dayOfWeek === 1) {
        const dateString = d.toISOString().split("T")[0];
        marks[dateString] = {
          textColor: Colors.accent, // Rosso per il weekend (o usa Colors.error)
        };
      }
      d.setDate(d.getDate() + 1);
    }
  });

  return marks;
};

export default function CalendarComp() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  //stati per il dropdown
  const [calendarType, setCalendarType] = useState<string>("assenza"); // Default su Assenza
  const [isFocus, setIsFocus] = useState(false);

  const weekendMarks = useMemo(() => generateWeekendMarks(), []);
  //funzione che viene chiamate quando l'utente tocca un giorno el calendario
  const onDayPress = (day: DateData) => {
    const selectedDate = day.dateString;

    // CASO 1: Nessuna selezione OPPURE abbiamo già un range (es. dal 10 al 15) e clicchiamo un'altra data per ricominciare
    if (!startDate || (startDate && endDate && startDate !== endDate)) {
      setStartDate(selectedDate);
      setEndDate(selectedDate); // <--- TRUCCO: Impostiamo subito anche la fine!
    }
    // CASO 2: Abbiamo un giorno singolo selezionato (Start == End) e vogliamo estendere
    else if (startDate && endDate && startDate === endDate) {
      if (selectedDate > startDate) {
        // Se clicco dopo, estendo la fine
        setEndDate(selectedDate);
      } else {
        // Se clicco prima, ricomincio da capo con la nuova data
        setStartDate(selectedDate);
        setEndDate(selectedDate);
      }
    }
    // Fallback di sicurezza
    else {
      setStartDate(selectedDate);
      setEndDate(selectedDate);
    }
  };
  //marked dates ovvero quando un utente preme su un giorno
  const markedDates = useMemo(() => {
    // 1. Carichiamo i weekend
    let marks: MarkedDatesType = { ...weekendMarks };

    if (!startDate) return marks;

    // CASO SPECIALE: Giorno singolo (Inizio e Fine coincidono)
    if (startDate && endDate && startDate === endDate) {
      marks[startDate] = {
        startingDay: true, // Arrotonda a sinistra
        endingDay: true, // Arrotonda a destra -> Risultato: CERCHIO
        color: Colors.primary,
        textColor: "white",
      };
      return marks;
    }

    // CASO STANDARD: Periodo (Range di più giorni)
    // Qui vogliamo i "mezzi cerchi" agli estremi per dare l'idea di continuità

    // 1. Data Inizio (Mezzo cerchio sinistro)
    marks[startDate] = {
      startingDay: true,
      color: Colors.primary,
      textColor: "white",
    };

    // 2. Data Fine (Mezzo cerchio destro)
    if (endDate) {
      marks[endDate] = {
        endingDay: true,
        color: Colors.primary,
        textColor: "white",
      };

      // 3. Giorni in mezzo (Striscia continua)
      let currentDate = new Date(startDate);
      let stopDate = new Date(endDate);
      currentDate.setDate(currentDate.getDate() + 1);

      while (currentDate < stopDate) {
        const dateString = currentDate.toISOString().split("T")[0];
        // Se un weekend cade nel mezzo, lo coloriamo comunque come parte del periodo
        marks[dateString] = {
          color: Colors.evidence,
          textColor: "white",
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return marks;
  }, [startDate, endDate, weekendMarks]); // Aggiunto weekendMarks alle dipendenze

  const formatDate = (d?: string | null) =>
    d ? d.split("-").reverse().join("/") : "-";

  //funzione per la gestione del click sul bottone
  const handleConfirm = () => {
    if (startDate && endDate) {
      //navigazione
      Alert.alert("Periodo Selezionato", `Dal: ${startDate}\nAl: ${endDate}`);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.subtitle}>
          Scegli il calendario da visualizzare
        </Text>
      </View>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: Colors.primary }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={dropdownData}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 64,
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
  infoContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  infoText: {
    fontSize: Typography.size.md,
    color: Colors.textPrimary,
    marginVertical: 4,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC", // Grigio disabilitato
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    marginBottom: Spacing.xl,
    height: 50,
    borderColor: "#E0E0E0", // Bordo sottile grigio
    borderWidth: 1,
    borderRadius: 24, // Arrotondato
    paddingHorizontal: 16,
    backgroundColor: Colors.secondary, // Sfondo bianco "pillola"
    // Ombra leggera (Shadow)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Per Android
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.textPrimary || "#000",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  subtitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.light,
    textAlign: "left",
    color: Colors.textSecondary,
    paddingBottom: 10,
    paddingLeft: 5,
  },
});
