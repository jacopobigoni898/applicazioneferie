// Componente lista richieste con FlatList e pull-to-refresh.
// Mostra gli elementi formattati con stato vuoto e indicatore di caricamento.
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import ElementoRichiesta from "./ElementoRichiesta";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { RichiestaFormattata } from "../hooks/useRichieste";

interface PropsListaRichieste {
  dati: RichiestaFormattata[];
  inCaricamento: boolean;
  errore: string | null;
  suRicarica: () => void;
  suEliminazione: (id: number) => void;
  suModifica: (elemento: RichiestaFerie) => void;
}

// Componente visualizzato quando la lista è vuota
function ListaVuota({ inCaricamento }: { inCaricamento: boolean }) {
  if (inCaricamento) return null;
  return (
    <Text style={{ color: "#555", textAlign: "center", marginTop: 20 }}>
      Nessuna richiesta trovata
    </Text>
  );
}

export default function ListaRichieste({
  dati,
  inCaricamento,
  errore,
  suRicarica,
  suEliminazione,
  suModifica,
}: PropsListaRichieste) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
      {errore ? (
        <Text style={{ color: "#d64545", marginBottom: 12 }}>{errore}</Text>
      ) : null}

      <FlatList
        data={dati}
        keyExtractor={(elemento, indice) =>
          `${elemento.id_richiesta || indice}`
        }
        renderItem={({ item }) => (
          <ElementoRichiesta
            elemento={item}
            inizioFormattato={item.inizioFormattato}
            fineFormattata={item.fineFormattata}
            suEliminazione={suEliminazione}
            suModifica={suModifica}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={inCaricamento} onRefresh={suRicarica} />
        }
        ListEmptyComponent={<ListaVuota inCaricamento={inCaricamento} />}
        ListFooterComponent={
          inCaricamento && dati.length > 0 ? <ActivityIndicator /> : null
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
