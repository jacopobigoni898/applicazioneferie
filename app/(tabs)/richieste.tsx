import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { stiliSchermata } from "../../src/core/style/commonStyles";

// Schermata delle richieste (segnaposto)
export default function SchermataRichieste() {
  return (
    <SafeAreaView style={stiliSchermata.contenitore} edges={["top"]}>
      <View style={stiliSchermata.intestazione}>
        <View style={stiliSchermata.bloccoTitolo}>
          <Text style={stiliSchermata.titolo}>Richieste</Text>
        </View>
      </View>
      <View style={stiliSchermata.superiore}>
        <Text style={{ padding: 16, color: "#808080" }}>
          Contenuto delle richieste (segnaposto)
        </Text>
      </View>
    </SafeAreaView>
  );
}
