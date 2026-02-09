// Helper per la serializzazione delle date verso il backend.
// Gestisce i diversi formati richiesti dall'API.

// Formatta un numero con zero iniziale a due cifre
export const formattaDueCifre = (n: number) => String(n).padStart(2, "0");

// Converte usando componenti UTC. Output: yyyy-MM-ddTHH:mm:ss senza Z
export const aStringaIsoLocale = (data: Date) => {
  const a = data.getUTCFullYear();
  const m = formattaDueCifre(data.getUTCMonth() + 1);
  const g = formattaDueCifre(data.getUTCDate());
  const o = formattaDueCifre(data.getUTCHours());
  const min = formattaDueCifre(data.getUTCMinutes());
  const s = formattaDueCifre(data.getUTCSeconds());
  return `${a}-${m}-${g}T${o}:${min}:${s}`;
};

// Versione con spazio al posto di "T" per backend che usa DateTime.Parse
export const aStringaDataOraConSpazio = (data: Date) => {
  return aStringaIsoLocale(data).replace("T", " ");
};

// Formatta una data come yyyy-MM-dd
export const formatoAnnoMeseGiorno = (d: Date) =>
  `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
