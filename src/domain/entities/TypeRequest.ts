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
