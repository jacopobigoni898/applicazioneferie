// Selettore data cross-platform riutilizzabile.
// Su iOS mostra un bottom sheet con spinner; su Android usa il picker nativo.
import React from "react";
import {
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
import { stiliModaleRichiesta } from "../../core/style/commonStyles";
import { Colori } from "../../core/theme/theme";

interface PropsSelettoreData {
  visibile: boolean;
  valore: Date;
  valoreTemp?: Date;
  suCambio: (evento: DateTimePickerEvent, data?: Date) => void;
  suChiudi: () => void;
  suConferma: () => void;
}

const SelettoreDataPiattaforma = ({
  visibile,
  valore,
  valoreTemp,
  suCambio,
  suChiudi,
  suConferma,
}: PropsSelettoreData) => {
  if (!visibile) return null;

  if (Platform.OS === "ios") {
    const valoreCorrente = valoreTemp ?? valore;
    return (
      <Modal transparent animationType="fade" visible>
        <TouchableWithoutFeedback onPress={suChiudi}>
          <View style={stiliModaleRichiesta.sovrapposizioneSelettore} />
        </TouchableWithoutFeedback>

        <View style={stiliModaleRichiesta.foglioSelettore}>
          <View style={stiliModaleRichiesta.intestazioneSelettore}>
            <Text style={stiliModaleRichiesta.titoloSelettore}>
              Seleziona data
            </Text>
            <TouchableOpacity onPress={suChiudi}>
              <Text style={stiliModaleRichiesta.chiudiSelettore}>Chiudi</Text>
            </TouchableOpacity>
          </View>

          <DateTimePicker
            value={valoreCorrente}
            mode="date"
            display="spinner"
            onChange={(evento, data) => suCambio(evento, data || valoreCorrente)}
            style={stiliModaleRichiesta.selettoreIOS}
            textColor={Colori.testoPrimario}
          />

          <TouchableOpacity
            style={stiliModaleRichiesta.confermaSelettore}
            onPress={suConferma}
          >
            <Text style={stiliModaleRichiesta.testoConfermaSelettore}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <DateTimePicker
      value={valore}
      mode="date"
      display="default"
      onChange={(evento, data) => suCambio(evento, data || valore)}
    />
  );
};

export default SelettoreDataPiattaforma;
