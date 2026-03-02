// Componente singola richiesta nella lista admin (richieste ricevute).
// Mostra tipo, nome utente, date, badge stato e azioni (autorizza/non autorizza).
import React from "react";
import { Alert, View, Text, TouchableOpacity } from "react-native";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { stiliElementoRichiesta } from "../../../core/style/commonStyles";
import {
  normalizzaTipo,
  getColoreTipo,
} from "../../../shared/utils/coloriTipoRichiesta";
import { capitalizza } from "../../../shared/utils/stringUtils";
import { calcolaColoreBadge } from "../../../shared/utils/badgeUtils";

interface PropsElementoRichiestaAdmin {
  elemento: RichiestaFerie;
  inizioFormattato?: string;
  fineFormattata?: string;
  suAutorizza?: (id: number) => void;
  suNonAutorizza?: (id: number) => void;
  suApri?: () => void;
}

export default function ElementoRichiestaAdmin({
  elemento,
  inizioFormattato,
  fineFormattata,
  suAutorizza,
  suNonAutorizza,
  suApri,
}: PropsElementoRichiestaAdmin) {
  const coloreBadge = calcolaColoreBadge(
    String(elemento.stato_approvazione || ""),
  );

  const inizioFallback =
    inizioFormattato ?? elemento.data_inizio.toLocaleString("it-IT");
  const fineFallback =
    fineFormattata ?? elemento.data_fine.toLocaleString("it-IT");

  return (
    <TouchableOpacity onPress={() => suApri?.()} activeOpacity={0.8}>
      <View style={stiliElementoRichiesta.scheda}>
        {/* Riga superiore: icona + titolo + badge */}
        <View style={stiliElementoRichiesta.intestazione}>
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
          <Text style={stiliElementoRichiesta.testoRiga}>
            Al: {fineFallback}
          </Text>
        </View>

        {/* Azioni admin */}
        <View style={stiliElementoRichiesta.azioniContenitore}>
          {(() => {
            const stato = String(
              elemento.stato_approvazione || "",
            ).toLowerCase();
            const isValidated = /valid|approv/i.test(stato);
            return (
              <>
                {!isValidated && (
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        "Conferma autorizzazione",
                        "Sei sicuro di voler autorizzare questa richiesta?",
                        [
                          { text: "Annulla", style: "cancel" },
                          {
                            text: "Autorizza",
                            onPress: () =>
                              suAutorizza?.(elemento.id_richiesta),
                          },
                        ],
                      )
                    }
                    style={stiliElementoRichiesta.azioneAutorizza}
                    activeOpacity={0.7}
                  >
                    <Text style={stiliElementoRichiesta.testoAutorizza}>
                      Autorizza
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Conferma non autorizzazione",
                      "Sei sicuro di voler non autorizzare questa richiesta?",
                      [
                        { text: "Annulla", style: "cancel" },
                        {
                          text: "Non autorizza",
                          style: "destructive",
                          onPress: () =>
                            suNonAutorizza?.(elemento.id_richiesta),
                        },
                      ],
                    )
                  }
                  style={stiliElementoRichiesta.azioneNonAutorizza}
                  activeOpacity={0.7}
                >
                  <Text style={stiliElementoRichiesta.testoNonAutorizza}>
                    Non autorizza
                  </Text>
                </TouchableOpacity>
              </>
            );
          })()}
        </View>
      </View>
    </TouchableOpacity>
  );
}
