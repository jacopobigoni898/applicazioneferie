import { Platform, StyleSheet } from "react-native";
import { Colori, Tipografia } from "../theme/theme";

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
        shadowColor: Colori.ombra,
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
    fontSize: Tipografia.dimensione.md,
    color: Colori.testoPrimario,
  },
  sezioneDate: {
    marginLeft: 46,
    marginBottom: 14,
  },
  testoRiga: {
    color: Colori.testoRiga,
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
    color: Colori.bianco,
    fontWeight: Tipografia.peso.medio,
    fontSize: Tipografia.dimensione.sm,
  },
  azioniContenitore: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colori.secondario,
    paddingTop: 12,
  },
  azioneModifica: {
    backgroundColor: Colori.azioneModificaSfondo,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  testoModifica: {
    color: Colori.azioneModificaTesto,
    fontWeight: Tipografia.peso.grassetto,
    fontSize: 13,
  },
  azioneElimina: {
    backgroundColor: Colori.azioneEliminaSfondo,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  testoElimina: {
    color: Colori.azioneEliminaTesto,
    fontWeight: Tipografia.peso.grassetto,
    fontSize: 13,
  },
  azioneAutorizza: {
    backgroundColor: Colori.azioneAutorizzaSfondo,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  testoAutorizza: {
    color: Colori.azioneAutorizzaTesto,
    fontWeight: Tipografia.peso.grassetto,
    fontSize: 13,
  },
  azioneNonAutorizza: {
    backgroundColor: Colori.azioneEliminaSfondo,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  testoNonAutorizza: {
    color: Colori.azioneEliminaTesto,
    fontWeight: Tipografia.peso.grassetto,
    fontSize: 13,
  },
});
