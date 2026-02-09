// Tipi di richiesta disponibili
export enum TipoRichiesta {
  FERIE = "Ferie",
  MALATTIA = "Malattia",
  STUDIO = "Studio",
  PERMESSO = "Permesso",
  STRAORDINARIO = "Straordinario",
}

// Opzioni per il menu a tendina dei tipi di richiesta
export const opzioniTipoRichiesta = [
  { etichetta: "Ferie", valore: TipoRichiesta.FERIE },
  { etichetta: "Malattia", valore: TipoRichiesta.MALATTIA },
  { etichetta: "Studio", valore: TipoRichiesta.STUDIO },
  { etichetta: "Permesso", valore: TipoRichiesta.PERMESSO },
  { etichetta: "Straordinario", valore: TipoRichiesta.STRAORDINARIO },
];
