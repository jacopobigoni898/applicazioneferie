import {RequestStatus} from './RequestStatus';

export interface PermitsRequest {
    id_richiesta: number;
    id_utente: number;
    tipo_permesso: string;
    data_inizio: Date;
    data_fine: Date;
    stato_approvazione: RequestStatus;
}