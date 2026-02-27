// Helper per la formattazione delle date nelle liste richieste.
// Converte stringhe o oggetti Date in formato leggibile italiano.

const opzioniData: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

const opzioniOrario: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

// Formatta una data (stringa o Date) in formato italiano leggibile
export function formattaStringaData(grezzo?: string | Date | null): string {
  if (!grezzo) return "";

  // Se è già un oggetto Date, formatta data e orario
  if (grezzo instanceof Date) {
    const parteData = new Intl.DateTimeFormat("it-IT", opzioniData).format(grezzo);
    const parteOrario = new Intl.DateTimeFormat("it-IT", opzioniOrario).format(grezzo);
    return `${parteData} ${parteOrario}`;
  }

  const stringa = String(grezzo);
  const data = new Date(stringa);
  if (isNaN(data.getTime())) return stringa; // fallback: restituisce l'originale

  // Controlla se la stringa contiene una componente oraria
  const contieneOrario = /T|:\d{2}/.test(stringa);

  const parteData = new Intl.DateTimeFormat("it-IT", opzioniData).format(data);
  if (contieneOrario) {
    const parteOrario = new Intl.DateTimeFormat("it-IT", opzioniOrario).format(
      data,
    );
    return `${parteData} ${parteOrario}`;
  }

  return parteData;
}
