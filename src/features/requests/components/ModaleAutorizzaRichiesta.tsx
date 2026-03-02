import React from "react";
import { Alert, Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { stiliElementoRichiesta } from "../../../core/style/commonStyles";
import { Colori, Tipografia } from "../../../core/theme/theme";
import { ms } from "../../../core/style/responsive";
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
              onPress={() =>
                Alert.alert(
                  "Conferma autorizzazione",
                  "Sei sicuro di voler autorizzare questa richiesta?",
                  [
                    { text: "Annulla", style: "cancel" },
                    {
                      text: "Autorizza",
                      onPress: () => {
                        suAutorizza?.(elemento.id_richiesta);
                        suChiudi();
                      },
                    },
                  ],
                )
              }
            >
              <Text style={styles.testoBtn}>Autorizza</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnNonAutorizza]}
              onPress={() =>
                Alert.alert(
                  "Conferma non autorizzazione",
                  "Sei sicuro di voler non autorizzare questa richiesta?",
                  [
                    { text: "Annulla", style: "cancel" },
                    {
                      text: "Non autorizza",
                      style: "destructive",
                      onPress: () => {
                        suNonAutorizza?.(elemento.id_richiesta);
                        suChiudi();
                      },
                    },
                  ],
                )
              }
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
    backgroundColor: Colori.bianco,
    borderRadius: 8,
    padding: 16,
  },
  titolo: {
    fontSize: ms(18),
    fontWeight: Tipografia.peso.medio,
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
  btnAutorizza: { backgroundColor: Colori.badgeApprovato },
  btnNonAutorizza: { backgroundColor: Colori.badgeRifiutato },
  btnValida: { backgroundColor: Colori.azioneValidaSfondo },
  testoBtn: { color: Colori.bianco, fontWeight: Tipografia.peso.medio },
  chiudi: { alignItems: "center", paddingVertical: 6 },
});
