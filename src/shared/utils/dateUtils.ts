// Utilità centralizzate per il parsing e la formattazione delle date.
// Condiviso da useRequestForm, holidayMapper, DayDetailModal, formattaData.

/**
 * Parsing difensivo di una data da stringa, Date o null.
 * Restituisce sempre un oggetto Date valido (fallback: new Date()).
 */
export const parsaData = (valore?: string | Date | null): Date => {
  if (!valore) return new Date();
  if (valore instanceof Date) return valore;
  const parsata = new Date(valore);
  if (!Number.isNaN(parsata.getTime())) return parsata;
  const parti = String(valore).split("-");
  if (parti.length === 3) {
    const a = Number(parti[0]);
    const m = Number(parti[1]) - 1;
    const g = Number(parti[2]);
    const dataSicura = new Date(Date.UTC(a, m, g, 9, 0, 0, 0));
    if (!Number.isNaN(dataSicura.getTime())) return dataSicura;
  }
  return new Date();
};

/**
 * Formatta una data per la visualizzazione nei form (es. "24/02/2026").
 * Restituisce "--/--/----" se la data è null.
 */
export const formattaDataForm = (data: Date | null): string =>
  data ? data.toLocaleDateString("it-IT") : "--/--/----";

/**
 * Formatta una data per la visualizzazione nei dettagli (es. "24 feb 2026").
 */
export const formattaDataDettaglio = (d: Date | string): string => {
  const data = typeof d === "string" ? new Date(d) : d;
  return data.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
