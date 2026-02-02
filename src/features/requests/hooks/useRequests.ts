import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteHolidayById,
  fetchHolidaysByToken,
  HolidayListDto,
  updateHoliday,
  UpdateHolidayInput,
} from "../services/requestsService";

//funzione che si occupa della conversione delle stringhe in modo piu leggibile
function formatDateString(raw?: string | null) {
  if (!raw) return "";
  const date = new Date(raw);
  if (isNaN(date.getTime())) return raw; // fallback: return original

  // detect if time component is present in the input
  const hasTime = /T|:\d{2}/.test(raw);

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

type FormattedHoliday = HolidayListDto & {
  formatted_start: string;
  formatted_end: string;
};

export function useRequests(mode: "sent" | "received" = "sent") {
  const [items, setItems] = useState<HolidayListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    // optimistic update
    let previous: HolidayListDto[] = [];
    setItems((curr) => {
      previous = curr;
      return curr.filter((it) => it.id_richiesta !== id);
    });
    try {
      await deleteHolidayById(id);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Errore eliminazione";
      setError(msg);
      setItems(previous); // rollback
    }
  }, []);

  const update = useCallback(async (payload: UpdateHolidayInput) => {
    setError(null);

    let previous: HolidayListDto[] = [];
    setItems((curr) => {
      previous = curr;
      return curr.map((it) =>
        it.id_richiesta === payload.idRichiesta
          ? {
              ...it,
              data_inizio: payload.dataInizio,
              data_fine: payload.dataFine,
              stato_approvazione: payload.statoApprovazione as any,
            }
          : it,
      );
    });

    try {
      await updateHoliday(payload);
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
