import { View, Text, StyleSheet } from "react-native";
import React, { useState, useMemo } from "react";
import { Calendar, LocaleConfig, DateData } from "react-native-calendars";
import { Colors, Typography } from "../../../core/theme/theme";

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

  const weekendMarks = useMemo(() => generateWeekendMarks(), []);
  //funzione che viene chiamate quando l'utente tocca un giorno el calendario
  const onDayPress = (day: DateData) => {
    if (!startDate || (startDate && endDate)) {
      //nessuna data selezionata
      setStartDate(day.dateString);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (day.dateString < startDate) {
        setStartDate(day.dateString);
      } else {
        setEndDate(day.dateString);
      }
    }
  };
  //marked dates ovvero quando un utente preme su un giorno
  const markedDates = useMemo(() => {
    // 2. Partiamo dai weekend calcolati
    let marks: MarkedDatesType = { ...weekendMarks };

    if (!startDate) return marks; // Se non c'è selezione, ritorna solo i weekend rossi

    // Sovrascriviamo lo stile per la data di inizio (vince sul rosso del weekend)
    marks[startDate] = {
      startingDay: true,
      color: Colors.primary,
      textColor: "white",
    };

    if (endDate) {
      // Sovrascriviamo lo stile per la data di fine
      marks[endDate] = {
        endingDay: true,
        color: Colors.primary,
        textColor: "white",
      };

      // Logica per colorare i giorni IN MEZZO
      let currentDate = new Date(startDate);
      let stopDate = new Date(endDate);

      currentDate.setDate(currentDate.getDate() + 1);

      while (currentDate < stopDate) {
        const dateString = currentDate.toISOString().split("T")[0];
        // Anche qui sovrascriviamo il weekend: se è selezionato diventa del colore del periodo
        marks[dateString] = { color: Colors.evidence, textColor: "white" };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return marks;
  }, [startDate, endDate, weekendMarks]); // Aggiunto weekendMarks alle dipendenze

  const formatDate = (d?: string | null) =>
    d ? d.split("-").reverse().join("/") : "-";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleziona un periodo</Text>
      <Calendar
        firstDay={1}
        markingType="period"
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          arrowColor: Colors.primary,
          todayTextColor: Colors.primary,
          monthTextColor: Colors.textPrimary,
          textDayFontWeight: Typography.weight.regular,
          textMonthFontWeight: Typography.weight.bold,
          textDayHeaderFontWeight: Typography.weight.medium,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
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
});
