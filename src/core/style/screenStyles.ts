import { StyleSheet } from "react-native";
import { Colori, Spaziatura, Tipografia } from "../theme/theme";

// Stili per le schermate
export const stiliSchermata = StyleSheet.create({
  contenitore: {
    flex: 1,
    backgroundColor: Colori.intestazione,
  },
  titolo: {
    fontSize: Tipografia.dimensione.xl,
    fontWeight: Tipografia.peso.medio,
    borderBottomWidth: 4,
    borderBottomColor: Colori.primario,
    paddingBottom: Spaziatura.xs,
  },
  bloccoTitolo: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
    marginLeft: Spaziatura.titoloSinistra,
    paddingTop: Spaziatura.titolo,
  },
  intestazione: {
    backgroundColor: Colori.intestazione,
  },
  superiore: {
    flex: 1,
  },
});
