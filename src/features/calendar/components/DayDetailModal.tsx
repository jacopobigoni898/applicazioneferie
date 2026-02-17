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
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { sw, sh } from "../../../core/style/responsive";

// Mappa colori per tipo (stessi di GraficoAssenze)
const COLORI_TIPO: Record<string, string> = {
  Ferie: "#6BCB77",
  "Permesso studio": "#7A5AF8",
  "Visita medica": "#4D9DE0",
  "Permesso 104": "#F59E0B",
  "Congedo genitoriale": "#F4B4D6",
  "Permesso matrimoniale": "#FF6B6B",
  Malattia: "#FF6B6B",
  Permesso: "#4D9DE0",
  Assenza: Colori.primario,
};

const getColoreTipo = (label: string) => COLORI_TIPO[label] ?? Colori.primario;

const normalizzaTipo = (tipo?: string) => {
  const t = (tipo || "ferie").toLowerCase();
  if (t.includes("ferie")) return "Ferie";
  if (t.includes("studio")) return "Permesso studio";
  if (t.includes("visita")) return "Visita medica";
  if (t.includes("l104")) return "Permesso 104";
  if (t.includes("genitoriale")) return "Congedo genitoriale";
  if (t.includes("matrimon")) return "Permesso matrimoniale";
  if (t.includes("malatt")) return "Malattia";
  if (t.includes("permess")) return "Permesso";
  return "Assenza";
};

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
      <View style={stili.contenitore}>
        <View style={[stili.intestazione, { paddingTop: insets.top + sh(8) }]}>
          <TouchableOpacity style={stili.pulsanteIndietro} onPress={suChiusura}>
            <Ionicons
              name="chevron-back"
              size={sw(24)}
              color={Colori.primario}
            />
            <Text style={stili.testoIndietro}>Indietro</Text>
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

                  {/* Note - placeholder, se esiste campo nota nel modello */}
                  {/* <View style={stili.riga}>
                    <Text style={stili.etichetta}>Note:</Text>
                    <Text style={stili.valore}>{r.nota || "-"}</Text>
                  </View> */}
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
  contenitore: {
    flex: 1,
    backgroundColor: Colori.sfondo,
  },
  intestazione: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sw(16),
    paddingBottom: sh(8),
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff",
    backgroundColor: Colori.superficie,
  },
  pulsanteIndietro: {
    flexDirection: "row",
    alignItems: "center",
  },
  testoIndietro: {
    color: Colori.primario,
    fontSize: Tipografia.dimensione.md,
    marginLeft: sw(4),
  },
  titolo: {
    fontSize: Tipografia.dimensione.xl,
    fontWeight: Tipografia.peso.grassetto,
    color: Colori.testoPrimario,
    textTransform: "capitalize",
    paddingHorizontal: sw(16),
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
    fontSize: Tipografia.dimensione.md,
    textAlign: "center",
  },
  lista: {
    flex: 1,
  },
  listaContenuto: {
    paddingHorizontal: sw(16),
    paddingBottom: sh(32),
  },
  card: {
    backgroundColor: Colori.superficie,
    borderRadius: 12,
    padding: sw(16),
    marginBottom: sh(12),
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    fontSize: Tipografia.dimensione.md,
    fontWeight: Tipografia.peso.grassetto,
    color: Colori.testoPrimario,
  },
  badge: {
    paddingHorizontal: sw(10),
    paddingVertical: sh(4),
    borderRadius: 8,
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
    fontSize: Tipografia.dimensione.sm,
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
    fontSize: Tipografia.dimensione.sm,
  },
  valore: {
    flex: 1,
    color: Colori.testoPrimario,
    fontSize: Tipografia.dimensione.sm,
  },
});
