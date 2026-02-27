import { useEffect } from "react";
import { Alert } from "react-native";
import { impostaHandlerNonAutorizzato } from "../../src/api/httpClient";
import { storageAuth } from "../../src/core/auth/authStorage";
import type { DatiSessioneAuth } from "../../src/core/auth/authStorage";
import type { Utente } from "../../src/domain/entities/User";

// Hook che registra l'handler globale per le risposte 401 (non autorizzato).
// Quando l'interceptor HTTP riceve un 401, pulisce lo stato dell'app e mostra un alert.
export const useHandlerNonAutorizzato = (
  impostaSessione: (s: DatiSessioneAuth | null) => void,
  impostaUtente: (u: Utente | null) => void,
) => {
  useEffect(() => {
    impostaHandlerNonAutorizzato(() => {
      Alert.alert(
        "Sessione scaduta",
        "Per favore accedi di nuovo per continuare.",
      );
      impostaSessione(null);
      impostaUtente(null);
      storageAuth.cancellaSessione();
    });
  }, [impostaSessione, impostaUtente]);
};
