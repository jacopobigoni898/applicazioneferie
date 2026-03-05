import React, { useState } from "react";
import { Button, Text, View, StatusBar, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../_providers/AuthProvider";
import { stiliSchermata } from "../../src/core/style/commonStyles";
import { Colori, Tipografia, Spaziatura } from "../../src/core/theme/theme";
import { ms } from "../../src/core/style/responsive";
import { useRichieste } from "../../src/features/requests/hooks/useRichieste";
import GraficoAssenze from "../../src/features/requests/components/GraficoAssenze";
import ModalePresenza from "../../src/features/presence/components/ModalePresenza";

// Schermata del profilo utente
export default function SchermataProfilo() {
  const { esci, utente, inCaricamentoUtente } = useAuth();
  const inviate = useRichieste("inviate");
  const [modalePresenzaVisibile, impostaModalePresenza] = useState(false);

  return (
    <SafeAreaView style={stiliSchermata.contenitore} edges={["top"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" ? Colori.secondario : undefined}
      />
      <View style={stiliSchermata.intestazione}>
        <View style={stiliSchermata.bloccoTitolo}>
          <Text style={stiliSchermata.titolo}>Il mio Profilo</Text>
        </View>
      </View>

      <View style={stiliSchermata.superiore}>
        {inCaricamentoUtente ? (
          <Text style={stiliProfilo.testoSecondario}>
            Carico il profilo...
          </Text>
        ) : utente ? (
          <View style={stiliProfilo.contenitoreInfo}>
            <Text style={stiliProfilo.nomeUtente}>
              {utente.nome} {utente.cognome}
            </Text>
            <Text style={stiliProfilo.emailUtente}>
              {utente.email}
            </Text>
          </View>
        ) : (
          <Text style={stiliProfilo.testoSecondario}>
            Nessun profilo disponibile
          </Text>
        )}
        <GraficoAssenze
          richieste={inviate.elementi}
          inCaricamento={inviate.inCaricamento}
        />
        <View style={stiliProfilo.contenitorePulsante}>
          <TouchableOpacity
            style={stiliProfilo.pulsantePresenza}
            onPress={() => impostaModalePresenza(true)}
          >
            <Text style={stiliProfilo.testoPulsantePresenza}>
              Segnala Presenza
            </Text>
          </TouchableOpacity>
          <Button title="Esci" onPress={esci} />
        </View>

        <ModalePresenza
          visibile={modalePresenzaVisibile}
          suChiudi={() => impostaModalePresenza(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const stiliProfilo = StyleSheet.create({
  testoSecondario: {
    padding: Spaziatura.md,
    color: Colori.testoSecondario,
  },
  contenitoreInfo: {
    padding: Spaziatura.md,
    gap: 4,
  },
  nomeUtente: {
    fontSize: ms(18),
    fontWeight: Tipografia.peso.grassetto,
    color: Colori.testoPrimario,
  },
  emailUtente: {
    fontSize: ms(14),
    color: Colori.testoSecondario,
  },
  contenitorePulsante: {
    paddingHorizontal: Spaziatura.md,
    gap: Spaziatura.sm,
  },
  pulsantePresenza: {
    backgroundColor: Colori.primario,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  testoPulsantePresenza: {
    color: Colori.bianco,
    fontWeight: Tipografia.peso.grassetto,
    fontSize: ms(14),
  },
});
