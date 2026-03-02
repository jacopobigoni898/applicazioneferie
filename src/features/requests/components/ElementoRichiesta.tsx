// Componente singola richiesta nella lista.
// Mostra tipo, date, badge stato e azioni (modifica/elimina).
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";
import { stiliElementoRichiesta } from "../../../core/style/commonStyles";
import {
  normalizzaTipo,
  getColoreTipo,
} from "../../../shared/utils/coloriTipoRichiesta";
import { capitalizza } from "../../../shared/utils/stringUtils";
import { calcolaColoreBadge } from "../../../shared/utils/badgeUtils";

interface PropsElementoRichiesta {
  elemento: RichiestaFerie;
  inizioFormattato?: string;
  fineFormattata?: string;
  suEliminazione?: (id: number) => void;
  suModifica?: (elemento: RichiestaFerie) => void;
}

// Determina il colore del badge in base allo stato
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
        {/* ← PASSO 3: sostituisci accentoSinistra con il pallino colorato */}
        <View
          style={[
            stiliElementoRichiesta.accentoSinistra,
            {
              backgroundColor: getColoreTipo(
                normalizzaTipo(elemento.tipo_permesso),
              ),
            },
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

      {/* Date */}
      <View style={stiliElementoRichiesta.sezioneDate}>
        <Text style={stiliElementoRichiesta.testoRiga}>
          Dal: {inizioFallback}
        </Text>
        <Text style={stiliElementoRichiesta.testoRiga}>Al: {fineFallback}</Text>
      </View>

      {/* Azioni: nascoste se la richiesta è validata o annullata */}
      {(() => {
        const statoRaw = String(
          elemento.stato_approvazione || "",
        ).toLowerCase();
        const valoriEnum = [
          StatoRichiesta.APPROVATO,
          StatoRichiesta.AUTORIZZATO,
          StatoRichiesta.RIFIUTATO,
        ].map((s) => String(s).toLowerCase());
        const corrispondenzaEsatta = valoriEnum.includes(statoRaw);
        // Copri possibili varianti testuali dal backend (es. "approvato", "validato")
        const corrispondenzaSottostringa =
          /approv|valid|autoriz|rifiut|annull/.test(statoRaw);
        const nascondi = corrispondenzaEsatta || corrispondenzaSottostringa;
        return !nascondi;
      })() && (
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
      )}
    </View>
  );
}
