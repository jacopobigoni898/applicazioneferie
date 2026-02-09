import { StatoRichiesta } from "./RequestStatus";

// Entità Richiesta Straordinario
export interface RichiestaStraordinario {
  id_richiesta: number;
  id_utente: number;
  data_inizio: Date;
  data_fine: Date;
  stato_approvazione: StatoRichiesta;
}
