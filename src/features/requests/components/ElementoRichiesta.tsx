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
    inizioFormattato ?? elemento.data_inizio.toLocaleString("it-IT");
  const fineFallback =
    fineFormattata ?? elemento.data_fine.toLocaleString("it-IT");

  return (
    <View style={stiliElementoRichiesta.scheda}>
      {/* Riga superiore: icona + titolo + badge */}
      <View style={stiliElementoRichiesta.intestazione}>
        <View style={stiliElementoRichiesta.accentoSinistra} />
        <Text style={stiliElementoRichiesta.titolo} numberOfLines={1}>
          {elemento.tipo_permesso}
        </Text>
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
      </View>

      {/* Date */}
      <View style={stiliElementoRichiesta.sezioneDate}>
        <Text style={stiliElementoRichiesta.testoRiga}>
          Dal: {inizioFallback}
        </Text>
        <Text style={stiliElementoRichiesta.testoRiga}>Al: {fineFallback}</Text>
      </View>

      {/* Azioni */}
      <View style={stiliElementoRichiesta.azioniContenitore}>
        <TouchableOpacity
          onPress={() => suModifica?.(elemento)}
          style={stiliElementoRichiesta.azioneModifica}
          activeOpacity={0.7}
        >
          <Text style={stiliElementoRichiesta.testoModifica}>Modifica</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => suEliminazione?.(elemento.id_richiesta)}
          style={stiliElementoRichiesta.azioneElimina}
          activeOpacity={0.7}
        >
          <Text style={stiliElementoRichiesta.testoElimina}>Elimina</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
