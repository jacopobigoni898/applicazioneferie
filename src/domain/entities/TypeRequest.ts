// FILE: src/domain/entities/TypeRequest.ts

// Enum per evitare errori di battitura nel codice ("ferie" vs "Ferie")
export enum RequestType {
  FERIE = "ferie",
  MALATTIA = "malattia",
  ROL = "rol",
  CONGEDO = "congedo",
  STRAORDINARIO_DIURNO = "diurno",
  STRAORDINARIO_NOTTURNO = "notturno",
  STRAORDINARIO_FESTIVO = "festivo",
}

// Liste pronte per essere usate nei dropdown
export const ABSENCE_OPTIONS = [
  { label: "Ferie ", value: RequestType.FERIE },
  { label: "Malattia", value: RequestType.MALATTIA },
  { label: "Permesso ROL", value: RequestType.ROL },
  { label: "Congedo Matrimoniale", value: RequestType.CONGEDO },
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
