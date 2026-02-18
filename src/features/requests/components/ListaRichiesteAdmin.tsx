// Componente lista richieste ricevute (solo admin).
// Mostra richieste di altri utenti con pulsanti Autorizza/Rifiuta.
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ElementoRichiestaAdmin from "./ElementoRichiestaAdmin";
import { RichiestaFormattata } from "../hooks/useRichieste";
import { Colori } from "../../../core/theme/theme";

interface PropsListaRichiesteAdmin {
  dati: RichiestaFormattata[];
  inCaricamento: boolean;
  errore: string | null;
  suRicarica: () => void;
  suAutorizza: (id: number) => void;
  suRifiuta: (id: number) => void;
}

function ListaVuota({ inCaricamento }: { inCaricamento: boolean }) {
  if (inCaricamento) return null;
  return <Text style={stili.testoVuoto}>Nessuna richiesta ricevuta</Text>;
}

export default function ListaRichiesteAdmin({
  dati,
  inCaricamento,
  errore,
  suRicarica,
  suAutorizza,
  suRifiuta,
}: PropsListaRichiesteAdmin) {
  return (
    <View style={stili.contenitore}>
      {errore ? <Text style={stili.testoErrore}>{errore}</Text> : null}

      <FlatList
        data={dati}
        keyExtractor={(elemento, indice) =>
          `${elemento.id_richiesta || indice}`
        }
        renderItem={({ item }) => (
          <ElementoRichiestaAdmin
            elemento={item}
            inizioFormattato={item.inizioFormattato}
            fineFormattata={item.fineFormattata}
            suAutorizza={suAutorizza}
            suRifiuta={suRifiuta}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={inCaricamento} onRefresh={suRicarica} />
        }
        ListEmptyComponent={<ListaVuota inCaricamento={inCaricamento} />}
        ListFooterComponent={
          inCaricamento && dati.length > 0 ? <ActivityIndicator /> : null
        }
        contentContainerStyle={stili.contenutoLista}
      />
    </View>
  );
}

const stili = StyleSheet.create({
  contenitore: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  testoErrore: {
    color: "#d64545",
    marginBottom: 12,
  },
  testoVuoto: {
    color: Colori.testoSecondario,
    textAlign: "center",
    marginTop: 20,
  },
  contenutoLista: {
    paddingBottom: 24,
  },
});
