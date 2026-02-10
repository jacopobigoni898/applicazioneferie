// Selettore data multipiattaforma.
// Su iOS renderizza un picker a spinner dentro un bottom-sheet modale
// con conferma esplicita; su Android usa il picker nativo.
import React, { useEffect, useState } from "react";
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
import { stiliModaleRichiesta } from "../../../core/style/commonStyles";
import { Colori } from "../../../core/theme/theme";

export interface PropsSelettoreData {
  visibile: boolean;
  valore: Date;
  suConferma: (data: Date) => void;
  suChiusura: () => void;
}

const SelettoreDataPiattaforma = ({
  visibile,
  valore,
  suConferma,
  suChiusura,
}: PropsSelettoreData) => {
  // Data temporanea usata solo su iOS (conferma esplicita)
  const [valoreTemp, impostaValoreTemp] = useState(valore);

  // Sincronizza il valore temporaneo quando il picker si apre
  useEffect(() => {
    if (visibile) impostaValoreTemp(valore);
  }, [visibile, valore]);

  if (!visibile) return null;

  // --- iOS: bottom-sheet con spinner e OK ---
  if (Platform.OS === "ios") {
    return (
      <Modal transparent animationType="fade" visible>
        <TouchableWithoutFeedback onPress={suChiusura}>
          <View style={stiliModaleRichiesta.sovrapposizioneSelettore} />
        </TouchableWithoutFeedback>

        <View style={stiliModaleRichiesta.foglioSelettore}>
          <View style={stiliModaleRichiesta.intestazioneSelettore}>
            <Text style={stiliModaleRichiesta.titoloSelettore}>
              Seleziona data
            </Text>
            <TouchableOpacity onPress={suChiusura}>
              <Text style={stiliModaleRichiesta.chiudiSelettore}>Chiudi</Text>
            </TouchableOpacity>
          </View>

          <DateTimePicker
            value={valoreTemp}
            mode="date"
            display="spinner"
            onChange={(_e: DateTimePickerEvent, data?: Date) => {
              if (data) impostaValoreTemp(data);
            }}
            style={stiliModaleRichiesta.selettoreIOS}
            textColor={Colori.testoPrimario}
          />

          <TouchableOpacity
            style={stiliModaleRichiesta.confermaSelettore}
            onPress={() => suConferma(valoreTemp)}
          >
            <Text style={stiliModaleRichiesta.testoConfermaSelettore}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  // --- Android: picker nativo ---
  return (
    <DateTimePicker
      value={valore}
      mode="date"
      display="default"
      onChange={(_e: DateTimePickerEvent, data?: Date) => {
        suChiusura();
        if (data) suConferma(data);
      }}
    />
  );
};

export default SelettoreDataPiattaforma;
