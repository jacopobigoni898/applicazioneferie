import { View, Text, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import ComponenteCalendario from "../../src/features/calendar/components/CalendarComponent";
import { stiliSchermata } from "../../src/core/style/commonStyles";

// Schermata del calendario
export default function SchermataCalendario() {
  return (
    <SafeAreaView style={stiliSchermata.contenitore} edges={["top"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" ? "#f5f5f5" : undefined}
      />
      <View style={stiliSchermata.intestazione}>
        <View style={stiliSchermata.bloccoTitolo}>
          <Text style={stiliSchermata.titolo}>Calendario</Text>
        </View>
      </View>
      <View style={stiliSchermata.superiore}>
        <ComponenteCalendario />
      </View>
    </SafeAreaView>
  );
}
