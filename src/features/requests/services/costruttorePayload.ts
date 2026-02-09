// Funzioni per la costruzione dei payload di richiesta e la conversione in DTO.
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";
import { TipoRichiesta } from "../../../domain/entities/TypeRequest";
import { RichiestaStraordinario } from "../../../domain/entities/RequestExtraordinary";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { RichiestaPermesso } from "../../../domain/entities/PermitsRequest";
import { RichiestaMalattia } from "../../../domain/entities/SickRequest";
import { aStringaIsoLocale } from "./serializzazioneDate";
import {
  PayloadRichiesta,
  ParametriCostruzioneRichiesta,
  DtoBase,
  DtoRichiesta,
  DtoAggiornamentoPermesso,
  InputAggiornamentoFerie,
  eRichiestaPermesso,
  eRichiestaMalattia,
} from "./tipiRichieste";

// Costruisce il DTO per aggiornare un permesso a partire da un InputAggiornamentoFerie
export const costruisciDtoAggiornamentoPermesso = (
  payload: InputAggiornamentoFerie,
  tipo?: string,
): DtoAggiornamentoPermesso => ({
  tipo: tipo || "permesso",
  dataInizio: payload.DataInizio,
  dataFine: payload.DataFine,
  statoApprovazione: payload.StatoApprovazione,
  idRichiesta: payload.IdRichiesta,
});

// Costruisce il payload di dominio a partire dai parametri del form
export const costruisciPayloadRichiesta = ({
  tipoPrincipale,
  sottoTipo,
  dataInizio,
  dataFine,
  idUtente,
  stato = StatoRichiesta.IN_ATTESA,
}: ParametriCostruzioneRichiesta): PayloadRichiesta => {
  if (tipoPrincipale === "straordinari") {
    const richiesta: RichiestaStraordinario = {
      id_richiesta: 0,
      id_utente: idUtente,
      data_inizio: dataInizio,
      data_fine: dataFine,
      stato_approvazione: stato,
    };
    return richiesta;
  }

  const tipoMinuscolo = sottoTipo.toLowerCase();

  if (tipoMinuscolo.includes(TipoRichiesta.FERIE)) {
    const richiesta: RichiestaFerie = {
      id_richiesta: 0,
      id_utente: idUtente,
      data_inizio: dataInizio,
      data_fine: dataFine,
      stato_approvazione: stato,
    };
    return richiesta;
  }

  if (tipoMinuscolo.includes(TipoRichiesta.MALATTIA)) {
    const richiesta: RichiestaMalattia = {
      id_richiesta: 0,
      id_utente: idUtente,
      data_inizio: dataInizio,
      data_fine: dataFine,
      stato_approvazione: stato,
      certificato_medico: "",
    };
    return richiesta;
  }

  const richiesta: RichiestaPermesso = {
    id_richiesta: 0,
    id_utente: idUtente,
    tipo_permesso: sottoTipo,
    data_inizio: dataInizio,
    data_fine: dataFine,
    stato_approvazione: stato,
  };
  return richiesta;
};

// Converte un payload di dominio in un DTO serializzabile per il backend
export const mappaPayloadADto = (payload: PayloadRichiesta): DtoRichiesta => {
  const base: DtoBase = {
    id_richiesta: payload.id_richiesta,
    id_utente: payload.id_utente,
    data_inizio: aStringaIsoLocale(payload.data_inizio),
    data_fine: aStringaIsoLocale(payload.data_fine),
    stato_approvazione: payload.stato_approvazione,
  };

  if (eRichiestaPermesso(payload)) {
    return { ...base, tipo_permesso: payload.tipo_permesso };
  }
  if (eRichiestaMalattia(payload)) {
    return { ...base, certificato_medico: String(payload.certificato_medico) };
  }
  return base;
};
