// Servizio API per gli endpoint di presenza e luoghi.
import { http } from "../../../api/httpClient";
import { Luogo } from "../types/luogo";

const ENDPOINT_TUTTI_LUOGHI = "/Luogo/getAllLuoghi";
const ENDPOINT_AGGIUNGI_PRESENZA = "/Presenza/AddPresenza";

// Recupera tutti i luoghi disponibili
export const recuperaTuttiLuoghi = async (): Promise<Luogo[]> => {
  const { data } = await http.get<Luogo[]>(ENDPOINT_TUTTI_LUOGHI);
  return data || [];
};

// Registra la presenza dell'utente
export const aggiungiPresenza = async (idLuogo: number): Promise<void> => {
  await http.post(ENDPOINT_AGGIUNGI_PRESENZA, {
    presenza: new Date().toISOString(),
    idLuogo,
  });
};
