import { StatoRichiesta } from "./RequestStatus";

// Entità Richiesta Ferie
export interface RichiestaFerie {
  id_richiesta: number;
  id_utente: number;
  data_inizio: Date;
  data_fine: Date;
  stato_approvazione: StatoRichiesta;
  tipo_permesso?: string; // solo per riconoscerlo nell'app
}
