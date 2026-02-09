// Componente singola richiesta nella lista.
// Mostra tipo, date, badge stato e azioni (modifica/elimina).
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { stiliElementoRichiesta } from "../../../core/style/commonStyles";

// Colori per il badge stato
const COLORE_APPROVATO = "#16a34a";
const COLORE_RIFIUTATO = "#dc2626";
const COLORE_IN_ATTESA = "#f59e0b";

interface PropsElementoRichiesta {
  elemento: RichiestaFerie;
  inizioFormattato?: string;
  fineFormattata?: string;
  suEliminazione?: (id: number) => void;
  suModifica?: (elemento: RichiestaFerie) => void;
}

// Determina il colore del badge in base allo stato
function calcolaColoreBadge(stato: string): string {
  const statoMinuscolo = (stato || "").toLowerCase();
  if (statoMinuscolo.includes("approv") || statoMinuscolo === "approvato") {
    return COLORE_APPROVATO;
  }
  if (statoMinuscolo.includes("rifiut") || statoMinuscolo === "rifiutato") {
    return COLORE_RIFIUTATO;
  }
  return COLORE_IN_ATTESA;
}

export default function ElementoRichiesta({
  elemento,
  inizioFormattato,
  fineFormattata,
  suEliminazione,
  suModifica,
}: PropsElementoRichiesta) {
  const coloreBadge = calcolaColoreBadge(
    String(elemento.stato_approvazione || ""),
  );

  const inizioFallback =
    inizioFormattato ?? elemento.data_inizio.toLocaleDateString("it-IT");
  const fineFallback =
    fineFormattata ?? elemento.data_fine.toLocaleDateString("it-IT");

  return (
    <View style={stiliElementoRichiesta.scheda}>
      <View style={stiliElementoRichiesta.accentoSinistra} />
      <View style={stiliElementoRichiesta.contenuto}>
        <Text style={stiliElementoRichiesta.titolo}>
          {elemento.tipo_permesso || "Ferie"}
        </Text>
        <Text style={stiliElementoRichiesta.testoRiga}>
          Dal: {inizioFallback}
        </Text>
        <Text style={stiliElementoRichiesta.testoRiga}>
          Al: {fineFallback}
        </Text>
      </View>

      <View style={stiliElementoRichiesta.destra}>
        <View
          style={[
            stiliElementoRichiesta.badge,
            { backgroundColor: coloreBadge },
          ]}
        >
          <Text style={stiliElementoRichiesta.testoBadge}>
            {elemento.stato_approvazione}
          </Text>
        </View>
        <View style={stiliElementoRichiesta.azioniContenitore}>
          <TouchableOpacity
            onPress={() => suModifica?.(elemento)}
            style={stiliElementoRichiesta.azioneModifica}
          >
            <Text style={stiliElementoRichiesta.testoModifica}>Modifica</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => suEliminazione?.(elemento.id_richiesta)}
          >
            <Text style={stiliElementoRichiesta.testoElimina}>Elimina</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
