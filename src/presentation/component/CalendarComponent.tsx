import { Calendar, LocaleConfig } from "react-native-calendars"; 
import { useCalendario } from "../../domain/usecase/Usecalendar";
import { Colors } from "../../themes/colors";

LocaleConfig.locales['it'] = {
    monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
    monthNamesShort: ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'],
    dayNames: ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'],
    dayNamesShort: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
    today: 'Oggi'
};

LocaleConfig.defaultLocale = 'it';
export default function CalendarComp() { 
    const { markedDates, HandleDayPress, selectedDate } = useCalendario();
    return (<Calendar
        onDayPress={HandleDayPress}
        markedDates={markedDates}
        theme={{
            selectedDayBackgroundColor: Colors.selected_day,
            todayTextColor: Colors.text,
            dayTextColor: Colors.text,
            monthTextColor: Colors.text,
            arrowColor: Colors.text,
        }}
    />);


}