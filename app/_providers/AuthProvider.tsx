import React, { createContext, useContext, useMemo, useEffect } from "react";
import { useGuardiaAuth } from "../../src/core/auth/useAuthGuard";
import { useSessioneAuth } from "./useSessioneAuth";
import { useProfiloUtente } from "./useProfiloUtente";
import { useHandlerNonAutorizzato } from "./useHandlerNonAutorizzato";
import type { Utente } from "../../src/domain/entities/User";
import { http } from "../../src/api/httpClient";

// Definisce la forma dell'oggetto di autenticazione fornito da AuthProvider
type TipoContestoAuth = {
  utente: Utente | null;
  tokenAccesso: string | null;
  inCaricamento: boolean;
  inCaricamentoUtente: boolean;
  aggiornaUtente: () => Promise<void>;
  accedi: () => Promise<void>;
  esci: () => Promise<void>;
};

// Contesto condiviso per l'autenticazione
const ContestoAuth = createContext<TipoContestoAuth | undefined>(undefined);

// Provider di autenticazione che compone tre hook separati:
// - useSessioneAuth: gestione sessione, token, refresh e timer
// - useProfiloUtente: caricamento e aggiornamento profilo utente
// - useHandlerNonAutorizzato: gestione risposte 401 dall'API
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { tokenAccesso, inCaricamento, accedi, esci, impostaSessione } =
    useSessioneAuth();

  const { utente, inCaricamentoUtente, aggiornaUtente, impostaUtente } =
    useProfiloUtente(tokenAccesso);

  // Protegge le rotte: reindirizza a login se non autenticato
  useGuardiaAuth(tokenAccesso, inCaricamento, inCaricamentoUtente);

  // Registra handler globale per risposte 401
  useHandlerNonAutorizzato(impostaSessione, impostaUtente);

  const valoreContesto = useMemo(
    () => ({
      utente,
      tokenAccesso,
      inCaricamento,
      inCaricamentoUtente,
      aggiornaUtente,
      accedi,
      esci,
    }),
    [
      utente,
      tokenAccesso,
      inCaricamento,
      inCaricamentoUtente,
      aggiornaUtente,
      accedi,
      esci,
    ],
  );

  useEffect(() => {
    if (tokenAccesso) {
      http.defaults.headers.common.Authorization = `Bearer ${tokenAccesso}`;
    } else {
      // rimuove l'header quando non siamo autenticati
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete http.defaults.headers.common.Authorization;
    }
  }, [tokenAccesso]);

  return (
    <ContestoAuth.Provider value={valoreContesto}>
      {children}
    </ContestoAuth.Provider>
  );
};

// Hook per accedere al contesto di autenticazione
export const useAuth = () => {
  const ctx = useContext(ContestoAuth);
  if (!ctx) {
    throw new Error("useAuth deve essere usato all'interno di AuthProvider");
  }
  return ctx;
};

// Export di default per silenziare il warning di Expo Router
export default AuthProvider;
