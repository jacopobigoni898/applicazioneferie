// Riga con due selettori orario (inizio/fine) riutilizzabile.
// Usata nella modale di creazione per evitare duplicazione del layout orari.
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { stiliModaleRichiesta } from "../../core/style/commonStyles";

interface PropsRigaSelettoriOrario {
  orarioInizio: string;
  orarioFine: string;
  suPressioneInizio: () => void;
  suPressioneFine: () => void;
}

const RigaSelettoriOrario = ({
  orarioInizio,
  orarioFine,
  suPressioneInizio,
  suPressioneFine,
}: PropsRigaSelettoriOrario) => (
  <View style={stiliModaleRichiesta.rigaOrario}>
    <View style={stiliModaleRichiesta.casellaOrario}>
      <Text style={stiliModaleRichiesta.etichettaData}>Inizio</Text>
      <TouchableOpacity
        style={stiliModaleRichiesta.inputOrario}
        onPress={suPressioneInizio}
      >
        <Text style={stiliModaleRichiesta.testoOrario}>{orarioInizio}</Text>
      </TouchableOpacity>
    </View>
    <View style={stiliModaleRichiesta.casellaOrario}>
      <Text style={stiliModaleRichiesta.etichettaData}>Fine</Text>
      <TouchableOpacity
        style={stiliModaleRichiesta.inputOrario}
        onPress={suPressioneFine}
      >
        <Text style={stiliModaleRichiesta.testoOrario}>{orarioFine}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default RigaSelettoriOrario;
