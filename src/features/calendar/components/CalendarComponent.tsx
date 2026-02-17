import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { temaCalendario } from "../../../core/theme/calendarTheme";
import { Colori } from "../../../core/theme/theme";
import { stiliCalendario } from "../../../core/style/commonStyles";
import { useSelezioneIntervallo } from "../hooks/useSelezioneIntervallo";
import { useTipoCalendario } from "../hooks/useTipoCalendario";
import { useInvioRichiestaCalendario } from "../hooks/useInvioRichiestaCalendario";
import SelettoreTipoCalendario from "./SelettoreTipoCalendario";
import { configuraLocaleCalendario } from "../utils/calendarConfig";
import ModaleRichiesta from "../../requests/components/RequestModal";
import { ModalitaCalendario } from "../../../domain/entities/TypeRequest";
import { recuperaTutteRichieste } from "../../requests/services/apiRichieste";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
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

  // Mappa colori e normalizzazione usata da GraficoAssenze
  const COLORI_TIPO: Record<string, string> = {
    Ferie: "#6BCB77",
    "Permesso studio": "#7A5AF8",
    "Visita medica": "#4D9DE0",
    "Permesso 104": "#F59E0B",
    "Congedo genitoriale": "#F4B4D6",
    "Permesso matrimoniale": "#FF6B6B",
    Malattia: "#FF6B6B",
    Permesso: "#4D9DE0",
    Assenza: Colori.primario,
  };
  const getColoreTipo = (label: string) =>
    COLORI_TIPO[label] ?? Colori.primario;
  const normalizzaTipo = (tipo?: string) => {
    const t = (tipo || "ferie").toLowerCase();
    if (t.includes("ferie")) return "Ferie";
    if (t.includes("studio")) return "Permesso studio";
    if (t.includes("visita")) return "Visita medica";
    if (t.includes("l104")) return "Permesso 104";
    if (t.includes("genitoriale")) return "Congedo genitoriale";
    if (t.includes("matrimon")) return "Permesso matrimoniale";
    if (t.includes("malatt")) return "Malattia";
    if (t.includes("permess")) return "Permesso";
    return "Assenza";
  };

  const [marcazioniPanoramica, setMarcazioniPanoramica] = useState<
    Record<string, any>
  >({});
  const [richiesteCaricate, setRichiesteCaricate] = useState<RichiestaFerie[]>(
    [],
  );
  const [giornoSelezionato, setGiornoSelezionato] = useState<string | null>(
    null,
  );
  const [modaleDettaglioVisibile, setModaleDettaglioVisibile] = useState(false);

  useEffect(() => {
    let annullato = false;
    const carica = async () => {
      if (tipoCalendario !== ModalitaCalendario.PANORAMICA_GENERALE) {
        setMarcazioniPanoramica({});
        setRichiesteCaricate([]);
        return;
      }

      try {
        const richieste: RichiestaFerie[] = await recuperaTutteRichieste();
        if (!annullato) setRichiesteCaricate(richieste);

        const map: Record<string, any> = {};
        const MS_PER_DAY = 24 * 60 * 60 * 1000;

        for (const r of richieste) {
          const start = new Date(r.data_inizio);
          const end = new Date(r.data_fine);
          const giorni = Math.max(
            1,
            Math.round((+end - +start) / MS_PER_DAY) + 1,
          );
          const tipoNorm = normalizzaTipo(r.tipo_permesso);
          const colore = getColoreTipo(tipoNorm);

          for (let i = 0; i < giorni; i++) {
            const d = new Date(+start + i * MS_PER_DAY);
            const key = d.toISOString().slice(0, 10);
            // Multi-dot: ogni giorno può avere più pallini
            if (!map[key]) {
              map[key] = { dots: [] };
            }
            // Evita duplicati dello stesso colore
            if (!map[key].dots.some((dot: any) => dot.color === colore)) {
              map[key].dots.push({ key: tipoNorm, color: colore });
            }
          }
        }

        if (!annullato) setMarcazioniPanoramica(map);
      } catch (e) {
        if (!annullato) {
          setMarcazioniPanoramica({});
          setRichiesteCaricate([]);
        }
      }
    };

    carica();
    return () => {
      annullato = true;
    };
  }, [tipoCalendario]);

  // In panoramica usiamo solo le marcature a pallino (multi-dot)
  // nelle altre modalità usiamo la selezione intervallo (period)
  const markedForCalendar =
    tipoCalendario === ModalitaCalendario.PANORAMICA_GENERALE
      ? marcazioniPanoramica
      : dateMarcate;

  // Gestisce il click su un giorno
  const gestisciClickGiorno = (day: any) => {
    if (tipoCalendario === ModalitaCalendario.PANORAMICA_GENERALE) {
      setGiornoSelezionato(day.dateString);
      setModaleDettaglioVisibile(true);
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
        suChiusura={() => setModaleDettaglioVisibile(false)}
      />
    </View>
  );
}
