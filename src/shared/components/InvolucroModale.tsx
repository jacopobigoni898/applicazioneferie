// Wrapper condiviso per le modali bottom-sheet.
// Gestisce overlay, KeyboardAvoidingView, indicatore di trascinamento e chiusura.
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { stiliModaleRichiesta } from "../../core/style/commonStyles";
import { Spaziatura } from "../../core/theme/theme";

interface PropsInvolucroModale {
  visibile: boolean;
  suChiusura: () => void;
  /** Contenuto aggiuntivo renderizzato fuori dal foglio (es. picker) */
  contenutoEsterno?: React.ReactNode;
  /** Handler opzionale per press sul contenuto (es. Keyboard.dismiss) */
  suPressioneContenuto?: () => void;
  children: React.ReactNode;
}

const InvolucroModale = ({
  visibile,
  suChiusura,
  contenutoEsterno,
  suPressioneContenuto,
  children,
}: PropsInvolucroModale) => (
  <Modal
    animationType="slide"
    transparent
    visible={visibile}
    onRequestClose={suChiusura}
  >
    <TouchableWithoutFeedback onPress={suChiusura}>
      <View style={stiliModaleRichiesta.sovrapposizione}>
        <TouchableWithoutFeedback onPress={suPressioneContenuto}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={stiliModaleRichiesta.contenitoreModale}
          >
            <View style={stiliModaleRichiesta.contenuto}>
              <View style={stiliModaleRichiesta.indicatoreManiglia} />
              {children}
              <View style={stili.spaziatureFondo} />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
    {contenutoEsterno}
  </Modal>
);

const stili = StyleSheet.create({
  spaziatureFondo: { height: Spaziatura.lg - 4 },
});

export default InvolucroModale;
