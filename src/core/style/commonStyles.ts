import { Platform, StyleSheet } from "react-native";
import { Colori, Spaziatura, Tipografia } from "../theme/theme";
import { sw, sh, ms } from "./responsive";

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
        shadowColor: "#000",
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
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
    backgroundColor: Colori.superficie,
  },
  contenitoreModale: {
    flex: 1,
    width: "100%",
  },
  contenuto: {
    flexGrow: 1,
    backgroundColor: Colori.superficie,
    paddingHorizontal: sw(20),
    paddingBottom: sh(16),
  },
  intestazionePagina: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: sh(10),
    paddingHorizontal: sw(Spaziatura.md),
    backgroundColor: Colori.superficie,
  },
  pulsanteIndietro: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: sh(4),
    paddingRight: sw(12),
  },
  testoIndietro: {
    fontSize: ms(16),
    color: Colori.primario,
    marginLeft: sw(4),
  },
  titoloIntestazione: {
    fontSize: ms(20),
    fontWeight: "bold",
    textAlign: "center",
    color: Colori.testoPrimario,
  },
  sottointestazione: {
    fontSize: ms(13),
    color: Colori.testoSecondario,
    textAlign: "center",
    marginBottom: sh(16),
    textTransform: "uppercase",
  },
  rigaDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: sh(16),
    backgroundColor: "#F5F5F5",
    padding: sw(14),
    borderRadius: sw(12),
  },
  casellaData: { alignItems: "center", width: "45%" },
  etichettaData: { fontSize: ms(12), color: "#888" },
  valoreData: {
    fontSize: ms(15),
    fontWeight: "bold",
    color: Colori.testoPrimario,
  },
  rigaOrario: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: sh(14),
  },
  casellaOrario: { width: "48%" },
  inputOrario: {
    height: sh(48),
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: sw(10),
    paddingHorizontal: sw(12),
    marginTop: sh(6),
    fontSize: ms(15),
    color: Colori.testoPrimario,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  testoOrario: { fontSize: ms(15), color: Colori.testoPrimario },
  rigaInterruttore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: sh(10),
  },
  etichettaInterruttore: {
    fontSize: ms(15),
    color: Colori.testoPrimario,
    fontWeight: "500",
  },
  etichetta: {
    marginBottom: sh(6),
    fontSize: ms(14),
    fontWeight: "500",
    color: Colori.testoPrimario,
  },
  menuATendina: {
    height: sh(48),
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: sw(10),
    paddingHorizontal: sw(12),
    marginBottom: sh(20),
  },
  stileSegnaposto: { fontSize: ms(15), color: "#999" },
  stileTestoSelezionato: { fontSize: ms(15), color: Colori.testoPrimario },
  rigaPulsanti: {
    flexDirection: "row",
    paddingHorizontal: sw(20),
    paddingTop: sh(10),
    gap: sw(12),
  },
  pulsanteAnnulla: {
    flex: 1,
    paddingVertical: sh(14),
    borderRadius: sw(10),
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  testoPulsanteAnnulla: { color: "#666", fontWeight: "bold", fontSize: ms(14) },
  pulsanteConferma: {
    flex: 1,
    paddingVertical: sh(14),
    borderRadius: sw(10),
    backgroundColor: Colori.primario,
    alignItems: "center",
  },
  testoPulsanteConferma: { color: "white", fontWeight: "bold", fontSize: ms(14) },
  pulsanteDisabilitato: { backgroundColor: "#CCC" },
  sovrapposizioneSelettore: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  foglioSelettore: {
    backgroundColor: Colori.superficie,
    paddingHorizontal: sw(16),
    paddingTop: sh(12),
    paddingBottom: sh(20),
    borderTopLeftRadius: sw(18),
    borderTopRightRadius: sw(18),
  },
  intestazioneSelettore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: sh(10),
  },
  titoloSelettore: {
    fontSize: ms(16),
    fontWeight: "600",
    color: Colori.testoPrimario,
  },
  chiudiSelettore: {
    color: Colori.primario,
    fontWeight: "600",
    fontSize: ms(14),
  },
  confermaSelettore: {
    marginTop: sh(8),
    backgroundColor: Colori.primario,
    borderRadius: sw(12),
    alignItems: "center",
    paddingVertical: sh(12),
  },
  testoConfermaSelettore: {
    color: "#fff",
    fontWeight: "700",
    fontSize: ms(14),
  },
  selettoreIOS: {
    backgroundColor: Colori.superficie,
  },
  testoSegnapostoDocumento: {
    color: "#999",
    fontSize: ms(13),
  },
});

// Stili per il singolo elemento richiesta nella lista
export const stiliElementoRichiesta = StyleSheet.create({
  scheda: {
    marginHorizontal: 16,
    backgroundColor: Colori.superficiecard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  intestazione: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  accentoSinistra: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colori.primario,
    marginRight: 10,
  },
  titolo: {
    flex: 1,
    fontWeight: Tipografia.peso.medio,
    fontSize: 16,
    color: Colori.testoPrimario,
  },
  sezioneDate: {
    marginLeft: 46,
    marginBottom: 14,
  },
  testoRiga: {
    color: "#6b7280",
    fontWeight: Tipografia.peso.regolare,
    fontSize: 13,
    marginBottom: 3,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    minWidth: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  testoBadge: {
    color: "#fff",
    fontWeight: Tipografia.peso.medio,
    fontSize: 12,
  },
  azioniContenitore: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  azioneModifica: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  testoModifica: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 13,
  },
  azioneElimina: {
    backgroundColor: "#fef2f2",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  testoElimina: {
    color: "#dc2626",
    fontWeight: "700",
    fontSize: 13,
  },
});

// Stili per le tab nella schermata richieste
export const stiliTab = StyleSheet.create({
  etichetta: {
    textAlign: "center",
    fontWeight: Tipografia.peso.grassetto,
    fontSize: 16,
  },
});
