 import {RequestStatus} from './RequestStatus';
 
 export interface HolidayRequest {
    id_richiesta: number;
    id_utente: number;
    data_inizio: Date;
    data_fine: Date;
    stato_approvazione: RequestStatus;
}
