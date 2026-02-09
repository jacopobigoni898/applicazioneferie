import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { stiliSchermata } from "../../src/core/style/commonStyles";

// Schermata del profilo utente (segnaposto)
export default function SchermataProfilo() {
  return (
    <SafeAreaView style={stiliSchermata.contenitore} edges={["top"]}>
      <View style={stiliSchermata.intestazione}>
        <View style={stiliSchermata.bloccoTitolo}>
          <Text style={stiliSchermata.titolo}>Il mio Profilo</Text>
        </View>
      </View>
      <View style={stiliSchermata.superiore}>
        <Text style={{ padding: 16, color: "#808080" }}>
          Contenuto del profilo (segnaposto)
        </Text>
      </View>
    </SafeAreaView>
  );
}
