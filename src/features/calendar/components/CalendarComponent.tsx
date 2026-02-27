import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { temaCalendario } from "../../../core/theme/calendarTheme";
import { stiliCalendario } from "../../../core/style/commonStyles";
import { useSelezioneIntervallo } from "../hooks/useSelezioneIntervallo";
import { useTipoCalendario } from "../hooks/useTipoCalendario";
import { useInvioRichiestaCalendario } from "../hooks/useInvioRichiestaCalendario";
import { usePanoramicaGenerale } from "../hooks/usePanoramicaGenerale";
import SelettoreTipoCalendario from "./SelettoreTipoCalendario";
import { configuraLocaleCalendario } from "../utils/calendarConfig";
import ModaleRichiesta from "../../requests/components/RequestModal";
import { ModalitaCalendario } from "../../../domain/entities/TypeRequest";
import DayDetailModal from "./DayDetailModal";

// Configura localizzazione calendario (nomi mesi/giorni in italiano)
configuraLocaleCalendario();

// Componente principale del calendario.
// Compone tre hook separati:
// - useSelezioneIntervallo: gestione selezione date
// - useTipoCalendario: gestione tipo/dropdown calendario
// - useInvioRichiestaCalendario: gestione invio richiesta e stato modale
export default function ComponenteCalendario() {
  // Hook per la selezione dell'intervallo di date
  const {
    dataInizio,
    dataFine,
    dateMarcate,
    suPressioneGiorno,
    resettaIntervallo,
  } = useSelezioneIntervallo();

  // Hook per la gestione del tipo di calendario
  const {
    tipoCalendario,
    inFocus,
    impostaInFocus,
    opzioneSelezionata,
    gestisciSelezioneOpzione,
    opzioniVista,
    testoSegnaposto,
    tipiRichiesta,
  } = useTipoCalendario();

  // Hook per l'invio della richiesta e la gestione della modale
  const { modaleVisibile, chiudiModale, gestisciConferma, gestisciInvio } =
    useInvioRichiestaCalendario(tipoCalendario, resettaIntervallo);

  // Hook per la panoramica utente generale
  const {
    marcazioniPanoramica,
    richiesteCaricate,
    giornoSelezionato,
    modaleDettaglioVisibile,
    apriDettaglioGiorno,
    chiudiDettaglioGiorno,
  } = usePanoramicaGenerale(tipoCalendario);

  // In panoramica usiamo le marcature a pallino (multi-dot),
  // nelle altre modalità usiamo la selezione intervallo (period)
  const markedForCalendar =
    tipoCalendario === ModalitaCalendario.PANORAMICA_GENERALE
      ? marcazioniPanoramica
      : dateMarcate;

  // Gestisce il click su un giorno
  const gestisciClickGiorno = (day: any) => {
    if (tipoCalendario === ModalitaCalendario.PANORAMICA_GENERALE) {
      apriDettaglioGiorno(day.dateString);
    } else {
      suPressioneGiorno(day);
    }
  };

  return (
    <View style={stiliCalendario.contenitore}>
      <SelettoreTipoCalendario
        opzioni={opzioniVista}
        valore={tipoCalendario}
        etichettaSelezionata={opzioneSelezionata?.label}
        testoSegnaposto={testoSegnaposto}
        inFocus={inFocus}
        suFocus={impostaInFocus}
        suSelezione={gestisciSelezioneOpzione}
      />

      <View style={stiliCalendario.contenitoreCalendario}>
        <Calendar
          firstDay={1}
          markingType={
            tipoCalendario === ModalitaCalendario.PANORAMICA_GENERALE
              ? "multi-dot"
              : "period"
          }
          markedDates={markedForCalendar}
          onDayPress={gestisciClickGiorno}
          theme={temaCalendario}
        />
      </View>
      {(tipoCalendario === ModalitaCalendario.ASSENZA ||
        tipoCalendario === ModalitaCalendario.STRAORDINARI) && (
        <>
          <TouchableOpacity
            style={[
              stiliCalendario.pulsante,
              (!dataInizio || !dataFine) &&
                stiliCalendario.pulsanteDisabilitato,
            ]}
            onPress={() => gestisciConferma(dataInizio, dataFine)}
            disabled={!dataInizio || !dataFine}
          >
            <Text style={stiliCalendario.testoPulsante}>
              Procedi con la richiesta
            </Text>
          </TouchableOpacity>

          <ModaleRichiesta
            visibile={modaleVisibile}
            suChiusura={chiudiModale}
            dataInizio={dataInizio ? new Date(dataInizio) : null}
            dataFine={dataFine ? new Date(dataFine) : null}
            tipoPrincipale={
              tipoCalendario === ModalitaCalendario.STRAORDINARI
                ? "straordinari"
                : "assenza"
            }
            tipiRichiesta={tipiRichiesta}
            suInvio={gestisciInvio}
          />
        </>
      )}

      <DayDetailModal
        visibile={modaleDettaglioVisibile}
        giorno={giornoSelezionato || ""}
        richieste={richiesteCaricate}
        suChiusura={chiudiDettaglioGiorno}
      />
    </View>
  );
}
