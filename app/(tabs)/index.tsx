import React from "react";
import { Button, Text, View, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../_providers/AuthProvider";
import { stiliSchermata } from "../../src/core/style/commonStyles";
import { useRichieste } from "../../src/features/requests/hooks/useRichieste";
import GraficoAssenze from "../../src/features/requests/components/GraficoAssenze";

// Schermata del profilo utente
export default function SchermataProfilo() {
  const { esci, utente, inCaricamentoUtente } = useAuth();
  const inviate = useRichieste("inviate");

  return (
    <SafeAreaView style={stiliSchermata.contenitore} edges={["top"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" ? "#f5f5f5" : undefined}
      />
      <View style={stiliSchermata.intestazione}>
        <View style={stiliSchermata.bloccoTitolo}>
          <Text style={stiliSchermata.titolo}>Il mio Profilo</Text>
        </View>
      </View>

      <View style={stiliSchermata.superiore}>
        {inCaricamentoUtente ? (
          <Text style={{ padding: 16, color: "#808080" }}>
            Carico il profilo...
          </Text>
        ) : utente ? (
          <View style={{ padding: 16, gap: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              {utente.nome} {utente.cognome}
            </Text>
            <Text style={{ fontSize: 14, color: "#808080" }}>
              {utente.email}
            </Text>
          </View>
        ) : (
          <Text style={{ padding: 16, color: "#808080" }}>
            Nessun profilo disponibile
          </Text>
        )}
        <GraficoAssenze
          richieste={inviate.elementi}
          inCaricamento={inviate.inCaricamento}
        />
        <View style={{ paddingHorizontal: 16 }}>
          <Button title="Esci" onPress={esci} />
        </View>
      </View>
    </SafeAreaView>
  );
}
