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
import {
  stiliModaleRichiesta,
  ModaleDettagliostyle,
} from "../../../core/style/commonStyles";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { sw, sh, ms } from "../../../core/style/responsive";
import {
  normalizzaTipo,
  getColoreTipo,
} from "../../../shared/utils/coloriTipoRichiesta";
import { formattaDataDettaglio } from "../../../shared/utils/dateUtils";

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
        <View
          style={[
            stiliModaleRichiesta.intestazionePagina,
            { paddingTop: insets.top + sh(8) },
          ]}
        >
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

        <Text style={ModaleDettagliostyle.titolo}>{giornoFormattato}</Text>

        {richiesteDelGiorno.length === 0 ? (
          <View style={ModaleDettagliostyle.vuoto}>
            <Text style={ModaleDettagliostyle.testoVuoto}>
              Nessuna assenza registrata per questo giorno.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={ModaleDettagliostyle.lista}
            contentContainerStyle={ModaleDettagliostyle.listaContenuto}
            showsVerticalScrollIndicator={false}
          >
            {richiesteDelGiorno.map((r) => {
              const tipoNorm = normalizzaTipo(r.tipo_permesso);
              const colore = getColoreTipo(tipoNorm);
              const stato = formattaStato(r.stato_approvazione);
              return (
                <View key={r.id_richiesta} style={ModaleDettagliostyle.card}>
                  <View style={ModaleDettagliostyle.cardHeader}>
                    <View
                      style={[
                        ModaleDettagliostyle.dot,
                        { backgroundColor: colore },
                      ]}
                    />
                    <Text style={ModaleDettagliostyle.tipoLabel}>
                      {tipoNorm}
                    </Text>
                    <View
                      style={[
                        ModaleDettagliostyle.badge,
                        stato === "Approvata" &&
                          ModaleDettagliostyle.badgeApprovata,
                        stato === "Autorizzata" &&
                          ModaleDettagliostyle.badgeAutorizzata,
                        stato === "Rifiutata" &&
                          ModaleDettagliostyle.badgeRifiutata,
                      ]}
                    >
                      <Text style={ModaleDettagliostyle.badgeTesto}>
                        {stato}
                      </Text>
                    </View>
                  </View>

                  <View style={ModaleDettagliostyle.riga}>
                    <Text style={ModaleDettagliostyle.etichetta}>Dal:</Text>
                    <Text style={ModaleDettagliostyle.valore}>
                      {formattaDataDettaglio(r.data_inizio)}
                    </Text>
                  </View>
                  <View style={ModaleDettagliostyle.riga}>
                    <Text style={ModaleDettagliostyle.etichetta}>Al:</Text>
                    <Text style={ModaleDettagliostyle.valore}>
                      {formattaDataDettaglio(r.data_fine)}
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
