import { useCallback, useEffect, useState } from "react";
import { recuperaLoginMicrosoft } from "../../src/api/authApi";
import type { Utente } from "../../src/domain/entities/User";

// Hook che gestisce il caricamento e l'aggiornamento del profilo utente.
// Quando il tokenAccesso cambia, recupera automaticamente il profilo dal backend.
export const useProfiloUtente = (tokenAccesso: string | null) => {
  const [utente, impostaUtente] = useState<Utente | null>(null);
  const [inCaricamentoUtente, impostaInCaricamentoUtente] = useState(false);

  // Recupera il profilo utente dal backend
  const aggiornaUtente = useCallback(async () => {
    if (!tokenAccesso) return;
    impostaInCaricamentoUtente(true);
    try {
      const profilo = await recuperaLoginMicrosoft();
      impostaUtente(profilo);
    } catch (errore) {
      console.error("Errore nel recupero profilo", errore);
      impostaUtente(null);
    } finally {
      impostaInCaricamentoUtente(false);
    }
  }, [tokenAccesso]);

  // Quando il token cambia, recupera il profilo utente
  useEffect(() => {
    if (!tokenAccesso) {
      impostaUtente(null);
      return;
    }
    aggiornaUtente();
  }, [tokenAccesso, aggiornaUtente]);

  return {
    utente,
    inCaricamentoUtente,
    aggiornaUtente,
    impostaUtente,
  };
};
