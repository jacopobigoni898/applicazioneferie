// Componente riutilizzabile per il selettore orario iOS (bottom sheet).
// Estratto da RequestModal e ModaleModificaRichiesta per eliminare la duplicazione.
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colori } from "../../core/theme/theme";
import { stiliModaleRichiesta } from "../../core/style/commonStyles";

interface PropsSelettoreOrario {
  visibile: boolean;
  valore: Date;
  suChiusura: () => void;
  suCambio: (evento: any, data: Date) => void;
}

export default function SelettoreOrarioIOS({
  visibile,
  valore,
  suChiusura,
  suCambio,
}: PropsSelettoreOrario) {
  if (Platform.OS !== "ios" || !visibile) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visibile}
      onRequestClose={suChiusura}
    >
      <TouchableWithoutFeedback onPress={suChiusura}>
        <View style={stiliModaleRichiesta.sovrapposizioneSelettore}>
          <TouchableWithoutFeedback>
            <View style={stiliModaleRichiesta.foglioSelettore}>
              <View style={stiliModaleRichiesta.intestazioneSelettore}>
                <Text style={stiliModaleRichiesta.titoloSelettore}>
                  Seleziona orario
                </Text>
                <TouchableOpacity onPress={suChiusura}>
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
                onChange={(evento, data) => {
                  suCambio(evento, data || valore);
                }}
                style={stiliModaleRichiesta.selettoreIOS}
              />

              <TouchableOpacity
                style={stiliModaleRichiesta.confermaSelettore}
                onPress={suChiusura}
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
}
