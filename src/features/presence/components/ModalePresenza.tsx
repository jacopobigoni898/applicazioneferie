import React, { useEffect, useState } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { stiliModaleRichiesta } from "../../../core/style/commonStyles";
import { Luogo } from "../types/luogo";
import { recuperaTuttiLuoghi, aggiungiPresenza } from "../services/apiPresenza";

interface Props {
  visibile: boolean;
  suChiudi: () => void;
}

export default function ModalePresenza({ visibile, suChiudi }: Props) {
  const [luoghi, impostaLuoghi] = useState<Luogo[]>([]);
  const [inCaricamento, impostaInCaricamento] = useState(false);
  const [invioInCorso, impostaInvioInCorso] = useState(false);

  useEffect(() => {
    if (!visibile) return;
    let annulla = false;
    const carica = async () => {
      impostaInCaricamento(true);
      try {
        const dati = await recuperaTuttiLuoghi();
        if (!annulla) impostaLuoghi(dati);
      } catch {
        if (!annulla) {
          Alert.alert("Errore", "Impossibile caricare i luoghi.");
        }
      } finally {
        if (!annulla) impostaInCaricamento(false);
      }
    };
    carica();
    return () => {
      annulla = true;
    };
  }, [visibile]);

  const gestisciSelezione = async (luogo: Luogo) => {
    impostaInvioInCorso(true);
    try {
      await aggiungiPresenza(luogo.idLuogo);
      Alert.alert("Presenza registrata", `Presenza segnalata presso: ${luogo.luogo}`);
      suChiudi();
    } catch {
      Alert.alert("Errore", "Impossibile registrare la presenza.");
    } finally {
      impostaInvioInCorso(false);
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visibile}
      onRequestClose={suChiudi}
    >
      <TouchableWithoutFeedback onPress={suChiudi}>
        <View style={stiliModaleRichiesta.sovrapposizioneSelettore} />
      </TouchableWithoutFeedback>
      <View style={stiliModaleRichiesta.foglioSelettore}>
        <View style={stiliModaleRichiesta.intestazioneSelettore}>
          <Text style={stiliModaleRichiesta.titoloSelettore}>
            Seleziona luogo
          </Text>
          <TouchableOpacity onPress={suChiudi}>
            <Text style={stiliModaleRichiesta.chiudiSelettore}>Chiudi</Text>
          </TouchableOpacity>
        </View>
        {inCaricamento || invioInCorso ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView>
            {luoghi.map((luogo) => (
              <TouchableOpacity
                key={luogo.idLuogo}
                style={stiliModaleRichiesta.voceSelettore}
                onPress={() => gestisciSelezione(luogo)}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={stiliModaleRichiesta.voceSelettoreTesto}
                >
                  {luogo.luogo}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}
