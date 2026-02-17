import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colori, Tipografia } from "../../../core/theme/theme";
import { stiliModaleRichiesta } from "../../../core/style/commonStyles";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { sw, sh, ms } from "../../../core/style/responsive";
import {
  normalizzaTipo,
  getColoreTipo,
} from "../../../shared/utils/coloriTipoRichiesta";

const formattaData = (d: Date | string) => {
  const data = typeof d === "string" ? new Date(d) : d;
  return data.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formattaStato = (stato?: string) => {
  if (!stato) return "In attesa";
  const s = stato.toLowerCase();
  if (s.includes("validato") && !s.includes("non")) return "Approvata";
  if (s.includes("autorizzato")) return "Autorizzata";
  if (s.includes("annullato")) return "Rifiutata";
  return "In attesa";
};

interface Props {
  visibile: boolean;
  giorno: string; // formato YYYY-MM-DD
  richieste: RichiestaFerie[];
  suChiusura: () => void;
}

export default function DayDetailModal({
  visibile,
  giorno,
  richieste,
  suChiusura,
}: Props) {
  const insets = useSafeAreaInsets();

  // Filtra richieste che includono il giorno selezionato
  const richiesteDelGiorno = richieste.filter((r) => {
    const start = new Date(r.data_inizio);
    const end = new Date(r.data_fine);
    const target = new Date(giorno);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return target >= start && target <= end;
  });

  const giornoFormattato = giorno
    ? new Date(giorno).toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visibile}
      onRequestClose={suChiusura}
    >
      <View style={stiliModaleRichiesta.sovrapposizione}>
        <View style={[stiliModaleRichiesta.intestazionePagina, { paddingTop: insets.top + sh(8) }]}>
          <TouchableOpacity
            style={stiliModaleRichiesta.pulsanteIndietro}
            onPress={suChiusura}
          >
            <Ionicons
              name="chevron-back"
              size={sw(24)}
              color={Colori.primario}
            />
            <Text style={stiliModaleRichiesta.testoIndietro}>Indietro</Text>
          </TouchableOpacity>
        </View>

        <Text style={stili.titolo}>{giornoFormattato}</Text>

        {richiesteDelGiorno.length === 0 ? (
          <View style={stili.vuoto}>
            <Text style={stili.testoVuoto}>
              Nessuna assenza registrata per questo giorno.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={stili.lista}
            contentContainerStyle={stili.listaContenuto}
            showsVerticalScrollIndicator={false}
          >
            {richiesteDelGiorno.map((r) => {
              const tipoNorm = normalizzaTipo(r.tipo_permesso);
              const colore = getColoreTipo(tipoNorm);
              const stato = formattaStato(r.stato_approvazione);
              return (
                <View key={r.id_richiesta} style={stili.card}>
                  <View style={stili.cardHeader}>
                    <View style={[stili.dot, { backgroundColor: colore }]} />
                    <Text style={stili.tipoLabel}>{tipoNorm}</Text>
                    <View
                      style={[
                        stili.badge,
                        stato === "Approvata" && stili.badgeApprovata,
                        stato === "Autorizzata" && stili.badgeAutorizzata,
                        stato === "Rifiutata" && stili.badgeRifiutata,
                      ]}
                    >
                      <Text style={stili.badgeTesto}>{stato}</Text>
                    </View>
                  </View>

                  <View style={stili.riga}>
                    <Text style={stili.etichetta}>Dal:</Text>
                    <Text style={stili.valore}>
                      {formattaData(r.data_inizio)}
                    </Text>
                  </View>
                  <View style={stili.riga}>
                    <Text style={stili.etichetta}>Al:</Text>
                    <Text style={stili.valore}>
                      {formattaData(r.data_fine)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const stili = StyleSheet.create({
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
    backgroundColor: "#F5F5F5",
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
    backgroundColor: "#FEF3C7",
  },
  badgeApprovata: {
    backgroundColor: "#D1FAE5",
  },
  badgeAutorizzata: {
    backgroundColor: "#DBEAFE",
  },
  badgeRifiutata: {
    backgroundColor: "#FEE2E2",
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
