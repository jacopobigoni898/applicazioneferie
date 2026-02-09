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

// Stili del calendario
export const stiliCalendario = StyleSheet.create({
  contenitore: {
    flex: 1,
    backgroundColor: Colori.sfondo,
    paddingTop: 54,
    paddingHorizontal: 10,
  },
  sottotitolo: {
    fontSize: Tipografia.dimensione.md,
    fontWeight: Tipografia.peso.leggero,
    textAlign: "left",
    color: Colori.testoSecondario,
    paddingBottom: 10,
    paddingLeft: 5,
  },
  menuATendina: {
    marginBottom: Spaziatura.xl,
    height: 50,
    borderColor: Colori.bordo,
    borderWidth: 1.25,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colori.superficie,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selettoreIOS: {
    paddingHorizontal: 16,
  },
  menuATendinaFocus: {
    borderColor: Colori.primario,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  stileSegnaposto: { fontSize: 16, color: "#999" },
  stileTestoSelezionato: {
    fontSize: 16,
    color: Colori.testoPrimario || "#000",
    fontWeight: Tipografia.peso.medio,
  },
  stileIcona: { width: 20, height: 20 },
  stileRicerca: { height: 40, fontSize: 16 },
  contenitoreCalendario: { flex: 1 },
  pulsante: {
    backgroundColor: Colori.primario,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  pulsanteDisabilitato: { backgroundColor: "#CCCCCC" },
  testoPulsante: { color: "#fff", fontSize: 16, fontWeight: "regular" },
});

// Stili condivisi per il menu a tendina iOS
export const stiliMenuATendinaIOS = StyleSheet.create({
  contenitore: {
    position: "relative",
    zIndex: 20,
  },
  sovrapposizione: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: Colori.superficie,
    borderRadius: 16,
    borderColor: Colori.bordo,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 10,
    overflow: "hidden",
  },
  voceMenu: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colori.superficie,
    borderBottomColor: Colori.bordo,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  voceMenuUltima: {
    borderBottomWidth: 0,
  },
  voceMenuPremuta: { backgroundColor: Colori.primario },
  testoVoceMenu: {
    fontSize: 16,
    color: Colori.testoPrimario,
  },
});

// Stili condivisi per la modale di richiesta
export const stiliModaleRichiesta = StyleSheet.create({
  sovrapposizione: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  contenitoreModale: {
    width: "100%",
    maxHeight: "85%",
    justifyContent: "flex-end",
  },
  contenuto: {
    backgroundColor: Colori.superficie,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: Spaziatura.md + 4,
    paddingBottom: 24,
    maxHeight: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  indicatoreManiglia: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  titoloIntestazione: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: Colori.testoPrimario,
  },
  sottointestazione: {
    fontSize: 14,
    color: Colori.testoSecondario,
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  rigaDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 12,
  },
  casellaData: { alignItems: "center", width: "45%" },
  etichettaData: { fontSize: 12, color: "#888" },
  valoreData: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colori.testoPrimario,
  },
  rigaOrario: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  casellaOrario: { width: "48%" },
  inputOrario: {
    height: 48,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 6,
    fontSize: 16,
    color: Colori.testoPrimario,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  testoOrario: { fontSize: 16, color: Colori.testoPrimario },
  rigaInterruttore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  etichettaInterruttore: {
    fontSize: 16,
    color: Colori.testoPrimario,
    fontWeight: "500",
  },
  etichetta: {
    marginBottom: 8,
    fontWeight: "500",
    color: Colori.testoPrimario,
  },
  menuATendina: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 140,
  },
  stileSegnaposto: { fontSize: 16, color: "#999" },
  stileTestoSelezionato: { fontSize: 16, color: Colori.testoPrimario },
  rigaPulsanti: { flexDirection: "row", marginTop: 10 },
  pulsanteAnnulla: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  testoPulsanteAnnulla: { color: "#666", fontWeight: "bold" },
  pulsanteConferma: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: Colori.primario,
    alignItems: "center",
  },
  testoPulsanteConferma: { color: "white", fontWeight: "bold" },
  pulsanteDisabilitato: { backgroundColor: "#CCC" },
  sovrapposizioneSelettore: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  foglioSelettore: {
    backgroundColor: Colori.superficie,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  intestazioneSelettore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  titoloSelettore: {
    fontSize: 16,
    fontWeight: "600",
    color: Colori.testoPrimario,
  },
  chiudiSelettore: {
    color: Colori.primario,
    fontWeight: "600",
  },
  confermaSelettore: {
    marginTop: 10,
    backgroundColor: Colori.primario,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
  },
  testoConfermaSelettore: {
    color: "#fff",
    fontWeight: "700",
  },
  selettoreIOS: {
    backgroundColor: Colori.superficie,
  },
});
