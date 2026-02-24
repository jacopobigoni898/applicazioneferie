// Componente singola richiesta nella lista admin (richieste ricevute).
// Mostra tipo, nome utente, date, badge stato e azioni (autorizza/non autorizza).
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { stiliElementoRichiesta } from "../../../core/style/commonStyles";
import {
  normalizzaTipo,
  getColoreTipo,
} from "../../../shared/utils/coloriTipoRichiesta";

// Colori per il badge stato
const COLORE_APPROVATO = "#16a34a";
const COLORE_RIFIUTATO = "#dc2626";
const COLORE_IN_ATTESA = "#f59e0b";

function capitalizza(testo?: string): string {
  if (!testo) return "";
  return testo
    .toLowerCase()
    .split(" ")
    .map((parola) => parola.charAt(0).toUpperCase() + parola.slice(1))
    .join(" ");
}

interface PropsElementoRichiestaAdmin {
  elemento: RichiestaFerie;
  inizioFormattato?: string;
  fineFormattata?: string;
  suAutorizza?: (id: number) => void;
  suNonAutorizza?: (id: number) => void;
}

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

export default function ElementoRichiestaAdmin({
  elemento,
  inizioFormattato,
  fineFormattata,
  suAutorizza,
  suNonAutorizza,
}: PropsElementoRichiestaAdmin) {
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
        <View
          style={[
            stiliElementoRichiesta.accentoSinistra,
            { backgroundColor: getColoreTipo(normalizzaTipo(elemento.tipo_permesso)) },
          ]}
        />
        <Text style={stiliElementoRichiesta.titolo} numberOfLines={1}>
          {capitalizza(elemento.tipo_permesso)}
        </Text>
        <View
          style={[
            stiliElementoRichiesta.badge,
            { backgroundColor: coloreBadge },
          ]}
        >
          <Text style={stiliElementoRichiesta.testoBadge}>
            {capitalizza(String(elemento.stato_approvazione || ""))}
          </Text>
        </View>
      </View>

      {/* Nome utente */}
      {elemento.nomeUtente ? (
        <View style={stiliElementoRichiesta.sezioneDate}>
          <Text style={stiliElementoRichiesta.testoRiga}>
            Utente: {elemento.nomeUtente}
          </Text>
        </View>
      ) : null}

      {/* Date */}
      <View style={stiliElementoRichiesta.sezioneDate}>
        <Text style={stiliElementoRichiesta.testoRiga}>
          Dal: {inizioFallback}
        </Text>
        <Text style={stiliElementoRichiesta.testoRiga}>Al: {fineFallback}</Text>
      </View>

      {/* Azioni admin */}
      <View style={stiliElementoRichiesta.azioniContenitore}>
        <TouchableOpacity
          onPress={() => suAutorizza?.(elemento.id_richiesta)}
          style={stiliElementoRichiesta.azioneAutorizza}
          activeOpacity={0.7}
        >
          <Text style={stiliElementoRichiesta.testoAutorizza}>Autorizza</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => suNonAutorizza?.(elemento.id_richiesta)}
          style={stiliElementoRichiesta.azioneNonAutorizza}
          activeOpacity={0.7}
        >
          <Text style={stiliElementoRichiesta.testoNonAutorizza}>
            Non autorizza
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
