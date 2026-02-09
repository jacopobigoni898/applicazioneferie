import { StatoRichiesta } from "./RequestStatus";

// Entità Richiesta Permesso
export interface RichiestaPermesso {
  id_richiesta: number;
  id_utente: number;
  tipo_permesso: string;
  data_inizio: Date;
  data_fine: Date;
  stato_approvazione: StatoRichiesta;
}
