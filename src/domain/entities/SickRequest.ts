import { StatoRichiesta } from "./RequestStatus";

// Entità Richiesta Malattia
export interface RichiestaMalattia {
  id_richiesta: number;
  id_utente: number;
  data_inizio: Date;
  data_fine: Date;
  stato_approvazione: StatoRichiesta;
  certificato_medico: string;
}
