// Entità Richiesta Permesso
export interface RichiestaPermesso {
  idRichiesta: number;
  idUtente: number;
  dataInizio: string;
  dataFine: string;
  stato: string;
  tipoPermesso: string;
}
