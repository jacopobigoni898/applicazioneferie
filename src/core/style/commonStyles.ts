import { Platform, StyleSheet } from "react-native";
import { Colori, Spaziatura } from "../theme/theme";

// Stili comuni riutilizzabili
export const stiliComuni = StyleSheet.create({
  paddingSchermata: {
    paddingHorizontal: Spaziatura.md,
    paddingTop: Spaziatura.md,
  },
  rigaCentrata: {
    flexDirection: "row",
    alignItems: "center",
  },
  scheda: {
    backgroundColor: Colori.superficie,
    borderRadius: 12,
    padding: Spaziatura.md,
    ...Platform.select({
      ios: {
        shadowColor: Colori.ombra,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});

// Re-export dagli stili specifici per retrocompatibilità
export { stiliSchermata } from "./screenStyles";
export { stiliCalendario, stiliMenuATendinaIOS } from "./calendarStyles";
export { stiliModaleRichiesta } from "./requestModalStyles";
export { stiliElementoRichiesta } from "./requestItemStyles";
export { stiliTab } from "./tabStyles";
export { ModaleDettagliostyle } from "./detailModalStyles";
