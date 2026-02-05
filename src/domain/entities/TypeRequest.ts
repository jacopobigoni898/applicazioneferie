// FILE: src/domain/entities/TypeRequest.ts

// Enum per evitare errori di battitura nel codice ("ferie" vs "Ferie")
export enum RequestType {
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

// Liste pronte per essere usate nei dropdown
export const ABSENCE_OPTIONS = [
  { label: "Ferie ", value: RequestType.FERIE },
  { label: "Malattia", value: RequestType.MALATTIA },
  { label: "Studio", value: RequestType.STUDIO },
  { label: " Matrimoniale", value: RequestType.MATRIMONIALE },
  { label: " Visita medica", value: RequestType.VISITA_MEDICA },
  { label: " Genitoriale", value: RequestType.GENITORIALE },
  { label: " L104", value: RequestType.L104 },
];

export const OVERTIME_OPTIONS = [
  { label: "Straordinario Diurno", value: RequestType.STRAORDINARIO_DIURNO },
  {
    label: "Straordinario Notturno",
    value: RequestType.STRAORDINARIO_NOTTURNO,
  },
  { label: "Straordinario Festivo", value: RequestType.STRAORDINARIO_FESTIVO },
];

// Enum per le modalità di visualizzazione (evitiamo errori di battitura)
export enum CalendarMode {
  ABSENCE = "assenza",
  OVERTIME = "straordinari",
  ADMIN = "admin",
}

// Opzioni per il dropdown principale del Calendario
export const CALENDAR_VIEW_OPTIONS = [
  { label: "Richiesta Permessi", value: CalendarMode.ABSENCE },
  { label: "Richiesta Straordinari", value: CalendarMode.OVERTIME },
  { label: "Panoramica Generale (Admin)", value: CalendarMode.ADMIN },
];
