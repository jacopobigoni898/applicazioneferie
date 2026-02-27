import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { stiliElementoRichiesta } from "../../../core/style/commonStyles";
import { Colori } from "../../../core/theme/theme";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";

interface Props {
  visibile: boolean;
  elemento: RichiestaFerie | null;
  suChiudi: () => void;
  suAutorizza?: (id: number) => void;
  suNonAutorizza?: (id: number) => void;
  suValida?: (id: number) => void; // API non pronta ma bottone presente
}

export default function ModaleAutorizzaRichiesta({
  visibile,
  elemento,
  suChiudi,
  suAutorizza,
  suNonAutorizza,
  suValida,
}: Props) {
  if (!elemento) return null;

  return (
    <Modal visible={visibile} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.foglio}>
          <Text style={styles.titolo}>Dettaglio richiesta</Text>
          <Text style={styles.riga}>Tipo: {elemento.tipo_permesso}</Text>
          {elemento.nomeUtente ? (
            <Text style={styles.riga}>Utente: {elemento.nomeUtente}</Text>
          ) : null}
          <Text style={styles.riga}>
            Dal: {elemento.data_inizio.toLocaleString()}
          </Text>
          <Text style={styles.riga}>
            Al: {elemento.data_fine.toLocaleString()}
          </Text>

          <View style={styles.bottoni}>
            <TouchableOpacity
              style={[styles.btn, styles.btnAutorizza]}
              onPress={() => {
                suAutorizza?.(elemento.id_richiesta);
                suChiudi();
              }}
            >
              <Text style={styles.testoBtn}>Autorizza</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnNonAutorizza]}
              onPress={() => {
                suNonAutorizza?.(elemento.id_richiesta);
                suChiudi();
              }}
            >
              <Text style={styles.testoBtn}>Non autorizza</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 12 }}>
            <TouchableOpacity
              style={[styles.btn, styles.btnValida]}
              onPress={() => {
                suValida?.(elemento.id_richiesta);
                // non chiudiamo automaticamente per lasciare feedback
              }}
            >
              <Text style={styles.testoBtn}>Valida (placeholder)</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 12 }}>
            <TouchableOpacity onPress={suChiudi} style={styles.chiudi}>
              <Text style={{ color: Colori.primario }}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  foglio: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  titolo: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  riga: {
    marginTop: 4,
  },
  bottoni: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
  },
  btnAutorizza: { backgroundColor: "#16a34a" },
  btnNonAutorizza: { backgroundColor: "#dc2626" },
  btnValida: { backgroundColor: "#3b82f6" },
  testoBtn: { color: "#fff", fontWeight: "600" },
  chiudi: { alignItems: "center", paddingVertical: 6 },
});
