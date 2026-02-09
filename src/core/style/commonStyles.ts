import { StyleSheet } from "react-native";
import { Colori, Spaziatura, Tipografia } from "../theme/theme";

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
});

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

// Segnaposto: qui andranno gli stili per il calendario
export const stiliCalendario = StyleSheet.create({});

// Segnaposto: qui andranno gli stili per il profilo
export const stiliProfilo = StyleSheet.create({});

// Segnaposto: qui andranno gli stili per le richieste
export const stiliRichieste = StyleSheet.create({});

// Segnaposto: qui andranno gli stili per le tab
export const stiliTab = StyleSheet.create({});
