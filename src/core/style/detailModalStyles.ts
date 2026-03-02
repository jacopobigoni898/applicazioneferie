import { StyleSheet } from "react-native";
import { Colori, Tipografia } from "../theme/theme";
import { sw, sh, ms } from "./responsive";

// Stili per la modale di dettaglio
export const ModaleDettagliostyle = StyleSheet.create({
  titolo: {
    fontSize: ms(20),
    fontWeight: Tipografia.peso.grassetto,
    color: Colori.testoPrimario,
    textTransform: "capitalize",
    paddingHorizontal: sw(20),
    paddingVertical: sh(16),
  },
  vuoto: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: sw(32),
  },
  testoVuoto: {
    color: Colori.testoSecondario,
    fontSize: ms(15),
    textAlign: "center",
  },
  lista: {
    flex: 1,
  },
  listaContenuto: {
    paddingHorizontal: sw(20),
    paddingBottom: sh(32),
  },
  card: {
    backgroundColor: Colori.sfondoInput,
    borderRadius: sw(12),
    padding: sw(14),
    marginBottom: sh(12),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: sh(12),
  },
  dot: {
    width: sw(12),
    height: sw(12),
    borderRadius: sw(6),
    marginRight: sw(8),
  },
  tipoLabel: {
    flex: 1,
    fontSize: ms(15),
    fontWeight: Tipografia.peso.grassetto,
    color: Colori.testoPrimario,
  },
  badge: {
    paddingHorizontal: sw(10),
    paddingVertical: sh(4),
    borderRadius: sw(8),
    backgroundColor: Colori.badgeInAttesaChiara,
  },
  badgeApprovata: {
    backgroundColor: Colori.badgeValidata,
  },
  badgeAutorizzata: {
    backgroundColor: Colori.badgeAutorizzata,
  },
  badgeRifiutata: {
    backgroundColor: Colori.badgeRifiutataChiara,
  },
  badgeTesto: {
    fontSize: ms(12),
    fontWeight: Tipografia.peso.medio,
    color: Colori.testoPrimario,
  },
  riga: {
    flexDirection: "row",
    marginBottom: sh(4),
  },
  etichetta: {
    width: sw(40),
    color: Colori.testoSecondario,
    fontSize: ms(13),
  },
  valore: {
    flex: 1,
    color: Colori.testoPrimario,
    fontSize: ms(13),
  },
});
