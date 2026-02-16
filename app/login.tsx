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
        backgroundColor={Platform.OS === "android" ? "#0e1a2b" : undefined}
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
            <ActivityIndicator color="#fff" />
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
    backgroundColor: "#0e1a2b",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  scheda: {
    width: "100%",
    backgroundColor: "#13233a",
    borderRadius: 18,
    padding: 24,
    gap: 16,
  },
  titolo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  sottotitolo: {
    fontSize: 15,
    color: "#c7d2e5",
    lineHeight: 20,
  },
  pulsante: {
    backgroundColor: "#2f7cf6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  pulsanteDisabilitato: {
    opacity: 0.6,
  },
  etichettaPulsante: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
