import { Platform, StyleSheet } from "react-native";
import { Colori, Spaziatura, Tipografia } from "../theme/theme";

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
    paddingHorizontal: Spaziatura.md,
    backgroundColor: Colori.superficie,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selettoreIOS: {
    paddingHorizontal: Spaziatura.md,
  },
  menuATendinaFocus: {
    borderColor: Colori.primario,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  stileSegnaposto: { fontSize: Tipografia.dimensione.md, color: Colori.testoDisabilitato },
  stileTestoSelezionato: {
    fontSize: Tipografia.dimensione.md,
    color: Colori.testoPrimario,
    fontWeight: Tipografia.peso.medio,
  },
  stileIcona: { width: 20, height: 20 },
  stileRicerca: { height: 40, fontSize: Tipografia.dimensione.md },
  contenitoreCalendario: { flex: 1 },
  pulsante: {
    backgroundColor: Colori.primario,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spaziatura.lg,
  },
  pulsanteDisabilitato: { backgroundColor: Colori.disabilitato },
  testoPulsante: {
    color: Colori.bianco,
    fontSize: Tipografia.dimensione.md,
    fontWeight: Tipografia.peso.regolare,
  },
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
        shadowColor: Colori.ombra,
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
    paddingHorizontal: Spaziatura.md,
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
    fontSize: Tipografia.dimensione.md,
    color: Colori.testoPrimario,
  },
});
