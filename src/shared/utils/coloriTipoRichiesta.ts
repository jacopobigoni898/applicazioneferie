// Mappa colori e funzioni di normalizzazione per i tipi di richiesta.
// Condiviso da CalendarComponent, DayDetailModal, GraficoAssenze, ElementoRichiesta.
import { Colori } from "../../core/theme/theme";

// Mappa colori per tipo di richiesta
export const COLORI_TIPO: Record<string, string> = {
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

// Restituisce il colore associato a un tipo di richiesta normalizzato
export const getColoreTipo = (tipoNormalizzato: string): string =>
  COLORI_TIPO[tipoNormalizzato] ?? Colori.primario;

// Normalizza la stringa tipo_permesso dal backend a un'etichetta standard
export const normalizzaTipo = (tipo?: string): string => {
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
