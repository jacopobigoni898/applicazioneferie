// Entità Richiesta Malattia
export interface RichiestaMalattia {
  idRichiesta: number;
  idUtente: number;
  dataInizio: string;
  dataFine: string;
  stato: string;
  certificatoMedico?: string;
}
