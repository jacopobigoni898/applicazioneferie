// Componente singola richiesta nella lista admin (ricevute).
// Mostra tipo, utente, date, badge stato e azioni (autorizza/rifiuta).
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";
import { stiliElementoRichiesta } from "../../../core/style/commonStyles";
import {
  normalizzaTipo,
  getColoreTipo,
} from "../../../shared/utils/coloriTipoRichiesta";

const COLORE_APPROVATO = "#16a34a";
const COLORE_RIFIUTATO = "#dc2626";
const COLORE_IN_ATTESA = "#f59e0b";
const COLORE_AUTORIZZATO = "#2563eb";

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
  suAutorizza: (id: number) => void;
  suRifiuta: (id: number) => void;
}

function calcolaColoreBadge(stato: string): string {
  const statoMinuscolo = (stato || "").toLowerCase();
  if (statoMinuscolo.includes("autorizzat")) return COLORE_AUTORIZZATO;
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
  suRifiuta,
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

      {elemento.nome_utente ? (
        <View style={stili.rigaUtente}>
          <Text style={stili.testoUtente}>
            Utente: {elemento.nome_utente}
          </Text>
        </View>
      ) : null}

      <View style={stiliElementoRichiesta.sezioneDate}>
        <Text style={stiliElementoRichiesta.testoRiga}>
          Dal: {inizioFallback}
        </Text>
        <Text style={stiliElementoRichiesta.testoRiga}>Al: {fineFallback}</Text>
      </View>

      <View style={stiliElementoRichiesta.azioniContenitore}>
        <TouchableOpacity
          onPress={() => suAutorizza(elemento.id_richiesta)}
          style={stili.azioneAutorizza}
          activeOpacity={0.7}
        >
          <Text style={stili.testoAutorizza}>Autorizza</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => suRifiuta(elemento.id_richiesta)}
          style={stili.azioneRifiuta}
          activeOpacity={0.7}
        >
          <Text style={stili.testoRifiuta}>Rifiuta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const stili = StyleSheet.create({
  rigaUtente: {
    marginLeft: 46,
    marginBottom: 4,
  },
  testoUtente: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 13,
  },
  azioneAutorizza: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  testoAutorizza: {
    color: "#16a34a",
    fontWeight: "700",
    fontSize: 13,
  },
  azioneRifiuta: {
    backgroundColor: "#fef2f2",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  testoRifiuta: {
    color: "#dc2626",
    fontWeight: "700",
    fontSize: 13,
  },
});
