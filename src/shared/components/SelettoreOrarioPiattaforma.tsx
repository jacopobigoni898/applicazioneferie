// Selettore orario iOS riutilizzabile (bottom sheet con spinner).
// Usato nella modale di creazione per selezionare orario inizio/fine.
import React from "react";
import {
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { stiliModaleRichiesta } from "../../core/style/commonStyles";
import { Colori } from "../../core/theme/theme";

interface PropsSelettoreOrario {
  visibile: boolean;
  valore: Date;
  suCambio: (evento: any, data?: Date) => void;
  suChiudi: () => void;
}

const SelettoreOrarioPiattaforma = ({
  visibile,
  valore,
  suCambio,
  suChiudi,
}: PropsSelettoreOrario) => {
  if (Platform.OS !== "ios" || !visibile) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible
      onRequestClose={suChiudi}
    >
      <TouchableWithoutFeedback onPress={suChiudi}>
        <View style={stiliModaleRichiesta.sovrapposizioneSelettore}>
          <TouchableWithoutFeedback>
            <View style={stiliModaleRichiesta.foglioSelettore}>
              <View style={stiliModaleRichiesta.intestazioneSelettore}>
                <Text style={stiliModaleRichiesta.titoloSelettore}>
                  Seleziona orario
                </Text>
                <TouchableOpacity onPress={suChiudi}>
                  <Text style={stiliModaleRichiesta.chiudiSelettore}>
                    Chiudi
                  </Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={valore}
                mode="time"
                is24Hour
                display="spinner"
                minuteInterval={30}
                themeVariant="light"
                textColor={Colori.testoPrimario}
                onChange={(evento, data) => suCambio(evento, data || valore)}
                style={stiliModaleRichiesta.selettoreIOS}
              />

              <TouchableOpacity
                style={stiliModaleRichiesta.confermaSelettore}
                onPress={suChiudi}
              >
                <Text style={stiliModaleRichiesta.testoConfermaSelettore}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SelettoreOrarioPiattaforma;
