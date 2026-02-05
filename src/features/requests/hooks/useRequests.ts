import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteHolidayById,
  fetchHolidaysByToken,
  updateRequest,
  UpdateHolidayInput,
} from "../services/requestsService";
import { HolidayRequest } from "../../../domain/entities/HolidayRequest";

//funzione che si occupa della conversione delle stringhe in modo piu leggibile
function formatDateString(raw?: string | Date | null) {
  if (!raw) return "";
  if (raw instanceof Date) {
    const dateOpts: Intl.DateTimeFormatOptions = {
      day: "2-digit", //05
      month: "2-digit", //03
      year: "numeric",
    };
    const timeOpts: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const datePart = new Intl.DateTimeFormat("it-IT", dateOpts).format(raw);
    return `${datePart}`;
  }

  const str = String(raw);
  const date = new Date(str);
  if (isNaN(date.getTime())) return str; // fallback: return original

  // detect if time component is present in the input string
  const hasTime = /T|:\d{2}/.test(str);

  const dateOpts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const datePart = new Intl.DateTimeFormat("it-IT", dateOpts).format(date);
  if (hasTime) {
    const timePart = new Intl.DateTimeFormat("it-IT", timeOpts).format(date);
    return `${datePart} ${timePart}`;
  }

  return datePart;
}

type FormattedHoliday = HolidayRequest & {
  formatted_start: string;
  formatted_end: string;
};

export function useRequests(mode: "sent" | "received" = "sent") {
  const [items, setItems] = useState<HolidayRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //prima funzione che si avvia
  const loadData = useCallback(async () => {
    setLoading(true); // per fare capire che stiamo fetchandoi dati
    setError(null); // nessun errore
    try {
      // Nota: per ora usiamo lo stesso endpoint; se l'admin ha endpoint dedicato, sostituire qui
      const data = await fetchHolidaysByToken();
      setItems(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Errore di caricamento";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    loadData();
  }, [loadData, mode]);

  const formattedItems: FormattedHoliday[] = useMemo(() => {
    return items.map((it) => ({
      ...it,
      formatted_start: formatDateString(it.data_inizio as any),
      formatted_end: formatDateString(it.data_fine as any),
    }));
  }, [items]);

  const remove = useCallback(async (id: number) => {
    setError(null);
    // optimistic update con tipo per la delete
    let previous: HolidayRequest[] = [];
    let tipoForDelete: string | undefined;

    setItems((curr) => {
      previous = curr;
      const found = curr.find((it) => it.id_richiesta === id);
      tipoForDelete = found?.tipo_permesso;
      return curr.filter((it) => it.id_richiesta !== id);
    });

    try {
      await deleteHolidayById(id, tipoForDelete);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Errore eliminazione";
      setError(msg);
      setItems(previous); // rollback
    }
  }, []);

  const update = useCallback(async (payload: UpdateHolidayInput) => {
    setError(null);

    let previous: HolidayRequest[] = [];
    let tipoForUpdate: string | undefined;

    setItems((curr) => {
      previous = curr;
      return curr.map((it) => {
        if (it.id_richiesta === payload.IdRichiesta) {
          tipoForUpdate = it.tipo_permesso;
          return {
            ...it,
            data_inizio: new Date(payload.DataInizio),
            data_fine: new Date(payload.DataFine),
            stato_approvazione: payload.StatoApprovazione as any,
          };
        }
        return it;
      });
    });

    try {
      await updateRequest(payload, tipoForUpdate);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Errore aggiornamento";
      setError(msg);
      setItems(previous); // rollback
      throw err;
    }
  }, []);

  return {
    items,
    formattedItems,
    loading,
    error,
    reload: loadData,
    remove,
    update,
  } as const;
}
