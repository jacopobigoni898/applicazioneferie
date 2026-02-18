import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";

// Parsing difensivo delle date dall'API
const parsaData = (valore: any): Date => {
  const d = valore ? new Date(valore) : new Date();
  return Number.isNaN(d.getTime()) ? new Date() : d;
};

// Mappa la risposta del backend nell'entità RichiestaFerie
export const mappaRispostaFerie = (grezzo: any): RichiestaFerie => {
  const idNumero = Number(
    grezzo?.idRichiesta ?? grezzo?.id_richiesta ?? grezzo?.IdRichiesta ?? 0,
  );
  return {
    id_richiesta: idNumero,
    id_utente: Number(
      grezzo?.id_utente ?? grezzo?.IdUtente ?? grezzo?.userId ?? 0,
    ),
    data_inizio: parsaData(
      grezzo?.dataInizio ?? grezzo?.data_inizio ?? grezzo?.DataInizio,
    ),
    data_fine: parsaData(
      grezzo?.dataFine ?? grezzo?.data_fine ?? grezzo?.DataFine,
    ),
    stato_approvazione:
      grezzo?.StatoApprovazione ??
      grezzo?.stato_approvazione ??
      grezzo?.statoApprovazione ??
      StatoRichiesta.IN_ATTESA,
    tipo_permesso:
      grezzo?.tipo ??
      grezzo?.Tipo ??
      grezzo?.tipo_permesso ??
      grezzo?.TipoPermesso,
    nome_utente:
      grezzo?.nomeUtente ??
      grezzo?.NomeUtente ??
      grezzo?.nome_utente ??
      undefined,
  };
};
