import { useEffect, useState } from "react";
import { ModalitaCalendario } from "../../../domain/entities/TypeRequest";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { recuperaTutteRichieste } from "../../requests/services/apiRichieste";
import {
  normalizzaTipo,
  getColoreTipo,
} from "../../../shared/utils/coloriTipoRichiesta";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Hook per la gestione della panoramica utente generale.
// Carica tutte le richieste, costruisce le marcature multi-dot per il calendario
// e gestisce lo stato della modale di dettaglio giorno.
export function usePanoramicaGenerale(tipoCalendario: string) {
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

  // Apri la modale di dettaglio per un giorno specifico
  const apriDettaglioGiorno = (dateString: string) => {
    setGiornoSelezionato(dateString);
    setModaleDettaglioVisibile(true);
  };

  // Chiudi la modale di dettaglio
  const chiudiDettaglioGiorno = () => {
    setModaleDettaglioVisibile(false);
  };

  return {
    marcazioniPanoramica,
    richiesteCaricate,
    giornoSelezionato,
    modaleDettaglioVisibile,
    apriDettaglioGiorno,
    chiudiDettaglioGiorno,
  };
}
