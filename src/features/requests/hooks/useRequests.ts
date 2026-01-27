import { useCallback, useEffect, useState } from "react";
import { fetchHolidaysByToken, HolidayListDto } from "../services/requestsService";

export function useRequests() {
  const [items, setItems] = useState<HolidayListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHolidaysByToken();
      setItems(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Errore di caricamento";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { items, loading, error, reload: loadData } as const;
}
