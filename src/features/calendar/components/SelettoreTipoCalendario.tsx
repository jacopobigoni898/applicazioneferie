import React from "react";
import { Platform, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { stiliCalendario } from "../../../core/style/commonStyles";
import { MenuATendinaIOS } from "./IOSPullDown";

type OpzioneVista = { label: string; value: string };

type Props = {
  opzioni: OpzioneVista[];
  valore: string;
  etichettaSelezionata?: string;
  testoSegnaposto: string;
  inFocus: boolean;
  suFocus: (focus: boolean) => void;
  suSelezione: (valore: string) => void;
};

// Componente che gestisce la selezione del tipo di calendario.
// Su iOS usa il MenuATendinaIOS personalizzato, su Android usa il Dropdown nativo.
export default function SelettoreTipoCalendario({
  opzioni,
  valore,
  etichettaSelezionata,
  testoSegnaposto,
  inFocus,
  suFocus,
  suSelezione,
}: Props) {
  const eIOS = Platform.OS === "ios";

  return (
    <View>
      <Text style={stiliCalendario.sottotitolo}>
        Scegli il calendario da visualizzare
      </Text>

      {eIOS ? (
        <MenuATendinaIOS
          opzioni={opzioni}
          etichettaSelezionata={etichettaSelezionata}
          segnaposto={testoSegnaposto}
          suSelezione={suSelezione}
          stileTrigger={[
            stiliCalendario.menuATendina,
            stiliCalendario.selettoreIOS,
          ]}
          stileTestoSelezionato={stiliCalendario.stileTestoSelezionato}
          stileSegnaposto={stiliCalendario.stileSegnaposto}
        />
      ) : (
        <Dropdown
          style={[
            stiliCalendario.menuATendina,
            inFocus && stiliCalendario.menuATendinaFocus,
          ]}
          placeholderStyle={stiliCalendario.stileSegnaposto}
          selectedTextStyle={stiliCalendario.stileTestoSelezionato}
          inputSearchStyle={stiliCalendario.stileRicerca}
          iconStyle={stiliCalendario.stileIcona}
          data={opzioni}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!inFocus ? testoSegnaposto : "..."}
          value={valore}
          onFocus={() => suFocus(true)}
          onBlur={() => suFocus(false)}
          onChange={(item) => suSelezione(item.value)}
        />
      )}
    </View>
  );
}
