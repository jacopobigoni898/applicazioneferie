// Utilità centralizzate per la gestione degli orari.
// Estratte da useRequestForm per riuso e testabilità.

/** Parsing orario "HH:MM" → { ora, minuto } oppure null. */
export const parsaOrario = (
  valore: string,
): { ora: number; minuto: number } | null => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(valore.trim());
  if (!match) return null;
  const ora = Number(match[1]);
  const minuto = Number(match[2]);
  if (ora < 0 || ora > 23 || minuto < 0 || minuto > 59) return null;
  return { ora, minuto };
};

/** Arrotonda ai 30 minuti più vicini. */
export const arrotondaAMezzora = (data: Date): Date => {
  const arrotondata = new Date(data);
  const minuti = arrotondata.getMinutes();
  if (minuti < 15) {
    arrotondata.setMinutes(0, 0, 0);
  } else if (minuti < 45) {
    arrotondata.setMinutes(30, 0, 0);
  } else {
    arrotondata.setHours(arrotondata.getHours() + 1, 0, 0, 0);
  }
  return arrotondata;
};

/** Applica orario a una data usando UTC. */
export const applicaOrarioAData = (
  data: Date,
  ora: number,
  minuto: number,
): Date => {
  const a = data.getFullYear();
  const m = data.getMonth();
  const g = data.getDate();
  return new Date(Date.UTC(a, m, g, ora, minuto, 0, 0));
};

/** Formatta ore e minuti come "HH:MM". */
export const formattaOrario = (ore: number, minuti: number): string =>
  `${String(ore).padStart(2, "0")}:${String(minuti).padStart(2, "0")}`;
