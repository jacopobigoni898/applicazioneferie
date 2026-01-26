import { useCallback, useMemo, useState } from "react";
import { DateData } from "react-native-calendars";
import { Colors } from "../../../core/theme/theme";

export type PeriodSelected = {
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  textColor?: string;
  disabled?: boolean;
  activeOpacity?: number;
};

export type MarkedDatesType = {
  [date: string]: PeriodSelected;
};

// Pre-calcola i weekend (domenica e lunedì) per l'anno corrente e il successivo
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

export function useRangeSelection() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Weekend pre-calcolati per evidenziare le giornate non lavorative
  const weekendMarks = useMemo(() => generateWeekendMarks(), []);

  const onDayPress = useCallback(
    (day: DateData) => {
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
    },
    [startDate, endDate],
  );

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

  const resetRange = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  return {
    startDate,
    endDate,
    markedDates,
    onDayPress,
    resetRange,
  };
}
