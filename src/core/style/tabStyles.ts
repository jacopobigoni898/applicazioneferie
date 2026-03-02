import { StyleSheet } from "react-native";
import { Tipografia } from "../theme/theme";

// Stili per le tab nella schermata richieste
export const stiliTab = StyleSheet.create({
  etichetta: {
    textAlign: "center",
    fontWeight: Tipografia.peso.grassetto,
    fontSize: Tipografia.dimensione.md,
  },
});
