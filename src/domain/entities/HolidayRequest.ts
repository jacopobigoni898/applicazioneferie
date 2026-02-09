// Entità Richiesta Ferie
export interface RichiestaFerie {
  idRichiesta: number;
  idUtente: number;
  dataInizio: string;
  dataFine: string;
  stato: string;
  tipoPermesso?: string;
}
