import React from 'react';
import { Modal, TouchableWithoutFeedback, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { stiliModaleRichiesta } from '../../../core/style/commonStyles';

type Option = {
  label: string;
  value: string;
};

interface Props {
  visible: boolean;
  options: Option[];
  onClose: () => void;
  onSelect: (option: Option) => void;
  title?: string;
}

export default function TipoRichiestaModal({ visible, options, onClose, onSelect, title = 'Seleziona tipo' }: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={stiliModaleRichiesta.sovrapposizioneSelettore} />
      </TouchableWithoutFeedback>
      <View style={stiliModaleRichiesta.foglioSelettore}>
        <View style={stiliModaleRichiesta.intestazioneSelettore}>
          <Text style={stiliModaleRichiesta.titoloSelettore}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={stiliModaleRichiesta.chiudiSelettore}>Chiudi</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={{ padding: 12 }}
              onPress={() => {
                onSelect(opt);
              }}
            >
              <Text style={{ paddingVertical: 6 }}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}
