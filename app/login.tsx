import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "./_providers/AuthProvider";
import { Colori, Tipografia } from "../src/core/theme/theme";

// Schermata di accesso
export default function SchermataAccesso() {
  const { accedi, inCaricamento } = useAuth();
  const [inAccesso, impostaInAccesso] = useState(false);

  const gestisciAccesso = async () => {
    impostaInAccesso(true);
    try {
      await accedi();
    } finally {
      impostaInAccesso(false);
    }
  };

  const occupato = inCaricamento || inAccesso;

  return (
    <SafeAreaView
      style={stili.contenitore}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? Colori.loginSfondo : undefined}
      />
      <View style={stili.scheda}>
        <Text style={stili.titolo}>Accesso all'account</Text>
        <Text style={stili.sottotitolo}>
          Accedi con le credenziali Microsoft per continuare.
        </Text>
        <Pressable
          onPress={gestisciAccesso}
          style={[stili.pulsante, occupato && stili.pulsanteDisabilitato]}
          disabled={occupato}
        >
          {occupato ? (
            <ActivityIndicator color={Colori.bianco} />
          ) : (
            <Text style={stili.etichettaPulsante}>Accedi</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const stili = StyleSheet.create({
  contenitore: {
    flex: 1,
    backgroundColor: Colori.loginSfondo,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  scheda: {
    width: "100%",
    backgroundColor: Colori.loginScheda,
    borderRadius: 18,
    padding: 24,
    gap: 16,
  },
  titolo: {
    fontSize: Tipografia.dimensione.xl - 2,
    fontWeight: Tipografia.peso.grassetto,
    color: Colori.bianco,
  },
  sottotitolo: {
    fontSize: 15,
    color: Colori.loginTesto,
    lineHeight: 20,
  },
  pulsante: {
    backgroundColor: Colori.loginPulsante,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  pulsanteDisabilitato: {
    opacity: 0.6,
  },
  etichettaPulsante: {
    color: Colori.bianco,
    fontSize: Tipografia.dimensione.md,
    fontWeight: Tipografia.peso.medio,
  },
});
