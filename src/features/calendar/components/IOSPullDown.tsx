import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colori } from "../../../core/theme/theme";
import { stiliMenuATendinaIOS } from "../../../core/style/commonStyles";

// Tipo per una singola opzione del menu a tendina
export type OpzioneMenuATendina = {
  label: string;
  value: string;
};

type Props = {
  opzioni: OpzioneMenuATendina[];
  etichettaSelezionata?: string;
  segnaposto: string;
  suSelezione: (valore: string) => void;
  stileTrigger: ViewStyle | ViewStyle[];
  stileTestoSelezionato: TextStyle;
  stileSegnaposto: TextStyle;
  coloreChevron?: string;
};

// Componente menu a tendina stile iOS con chevron e lista espandibile
export function MenuATendinaIOS({
  opzioni,
  etichettaSelezionata,
  segnaposto,
  suSelezione,
  stileTrigger,
  stileTestoSelezionato,
  stileSegnaposto,
  coloreChevron,
}: Props) {
  const [aperto, impostaAperto] = useState(false);

  return (
    <View style={stiliMenuATendinaIOS.contenitore}>
      <TouchableOpacity
        style={stileTrigger}
        onPress={() => impostaAperto((prev) => !prev)}
        activeOpacity={0.85}
      >
        <Text
          style={
            etichettaSelezionata ? stileTestoSelezionato : stileSegnaposto
          }
        >
          {etichettaSelezionata || segnaposto}
        </Text>
        <Ionicons
          name={aperto ? "chevron-up" : "chevron-down"}
          size={18}
          color={coloreChevron || Colori.testoSecondario}
        />
      </TouchableOpacity>

      {aperto && (
        <View style={stiliMenuATendinaIOS.sovrapposizione}>
          <Pressable
            style={stiliMenuATendinaIOS.sovrapposizione}
            onPress={() => impostaAperto(false)}
          />
          <View style={stiliMenuATendinaIOS.menu}>
            {opzioni.map((opzione, indice) => (
              <Pressable
                key={opzione.value}
                style={({ pressed }) => [
                  stiliMenuATendinaIOS.voceMenu,
                  pressed && stiliMenuATendinaIOS.voceMenuPremuta,
                  indice === opzioni.length - 1 &&
                    stiliMenuATendinaIOS.voceMenuUltima,
                ]}
                onPress={() => {
                  suSelezione(opzione.value);
                  impostaAperto(false);
                }}
              >
                <Text style={stiliMenuATendinaIOS.testoVoceMenu}>
                  {opzione.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
