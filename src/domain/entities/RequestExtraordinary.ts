// Entità Richiesta Straordinario
export interface RichiestaStraordinario {
  idRichiesta: number;
  idUtente: number;
  dataInizio: string;
  dataFine: string;
  stato: string;
  oreStraordinario: number;
}
