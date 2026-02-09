// Enum per i tipi di richiesta (evita errori di battitura nel codice)
export enum TipoRichiesta {
  FERIE = "ferie",
  MALATTIA = "malattia",
  STUDIO = "Studio",
  MATRIMONIALE = "matrimoniale",
  L104 = "l104",
  VISITA_MEDICA = "visita medica",
  GENITORIALE = "genitoriale",
  STRAORDINARIO_DIURNO = "diurno",
  STRAORDINARIO_NOTTURNO = "notturno",
  STRAORDINARIO_FESTIVO = "festivo",
}

// Opzioni dropdown per assenze/permessi
export const OPZIONI_ASSENZA = [
  { label: "Ferie", value: TipoRichiesta.FERIE },
  { label: "Malattia", value: TipoRichiesta.MALATTIA },
  { label: "Studio", value: TipoRichiesta.STUDIO },
  { label: "Matrimoniale", value: TipoRichiesta.MATRIMONIALE },
  { label: "Visita medica", value: TipoRichiesta.VISITA_MEDICA },
  { label: "Genitoriale", value: TipoRichiesta.GENITORIALE },
  { label: "L104", value: TipoRichiesta.L104 },
];

// Opzioni dropdown per straordinari
export const OPZIONI_STRAORDINARIO = [
  { label: "Straordinario Diurno", value: TipoRichiesta.STRAORDINARIO_DIURNO },
  {
    label: "Straordinario Notturno",
    value: TipoRichiesta.STRAORDINARIO_NOTTURNO,
  },
  {
    label: "Straordinario Festivo",
    value: TipoRichiesta.STRAORDINARIO_FESTIVO,
  },
];

// Enum per le modalità di visualizzazione del calendario
export enum ModalitaCalendario {
  ASSENZA = "assenza",
  STRAORDINARI = "straordinari",
  ADMIN = "admin",
}

// Opzioni per il dropdown principale del calendario
export const OPZIONI_VISTA_CALENDARIO = [
  { label: "Richiesta Permessi", value: ModalitaCalendario.ASSENZA },
  { label: "Richiesta Straordinari", value: ModalitaCalendario.STRAORDINARI },
  { label: "Panoramica Generale (Admin)", value: ModalitaCalendario.ADMIN },
];
