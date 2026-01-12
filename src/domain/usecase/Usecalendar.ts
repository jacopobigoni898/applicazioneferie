import {useState, useEffect, useCallback} from 'react';
import {Alert} from 'react-native';
import { Colors } from '../../themes/colors';
type MarketDate = {
    selected?: boolean;
    marked?: boolean;
    selectedColor?: string;
    dotColor?: string;
    tipo?:string;
    disabled?:boolean;
};

//eleneco dinamico delle date da marcare
type MarkedDates = {
    [date: string]: MarketDate;
};

export const useCalendario = () => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});

    const fetchDatesFromServer = useCallback(() => {

        // Simulazione di fetch delle date da un server
        const dateFromDb = [
            { data: '2024-07-10', tipo: 'holiday', stato : 'validato' },
            { data: '2024-07-15', tipo: 'sick' , stato: 'validato'},
            { data: '2024-07-20', tipo: 'permit',stato: 'validato' },
        ]
       const newMarkedDates: MarkedDates = {};

        dateFromDb.forEach((item) => {
            let color = 'gray';
            if(item.tipo === 'holiday') color = Colors.ferie;
            else if(item.tipo === 'sick') color = Colors.malattia;
            else if(item.tipo === 'permit') color = Colors.permesso;

            newMarkedDates[item.data] = {
                marked: true,
                selected: true,
                dotColor: color,
                tipo: item.tipo
            };
        });
        setMarkedDates(newMarkedDates);
    }, []);

    useEffect(() => {
        fetchDatesFromServer();
    }, [fetchDatesFromServer]);

    const HandleDayPress = (day: {dateString: string}) => {
        setSelectedDate(day.dateString);

        const evento = markedDates[day.dateString];
        if(evento && evento.tipo) {
            Alert.alert(`Dettagli giorno`, `Tipo: ${evento.tipo}`);
        } else {
            Alert.alert(`Nessun evento per questa data.`);
        }
    };

    const getMarkedDates = () => {
        return {
            ...markedDates,
            ...(selectedDate ? {
                [selectedDate]: {
                    ...(markedDates[selectedDate] || {}),
                    selected: true,
                    selectedColor: Colors.selected_day,
                }
            } : {})
        };
    };

    return {
        markedDates: getMarkedDates(),
        HandleDayPress,
        selectedDate
    };

}