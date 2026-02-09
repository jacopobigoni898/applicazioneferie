import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  storageAuth,
  DatiSessioneAuth,
} from "../../src/core/auth/authStorage";
import {
  accediConMicrosoft,
  aggiornaTokenMicrosoft,
} from "../../src/core/auth/authService";

// Margine in ms prima della scadenza per tentare il refresh
const MARGINE_SCADENZA_MS = 30_000;

// Hook che gestisce la sessione di autenticazione:
// - Caricamento iniziale della sessione da SecureStore
// - Verifica scadenza e refresh silenzioso del token
// - Timer automatico per il refresh prima della scadenza
// - Login e logout
export const useSessioneAuth = () => {
  const [sessione, impostaSessione] = useState<DatiSessioneAuth | null>(null);
  const [inCaricamento, impostaInCaricamento] = useState(true);
  const tokenAccesso = sessione?.tokenAccesso ?? null;

  // Verifica locale con margine se il token è prossimo alla scadenza
  const sessioneScaduta = useCallback((s: DatiSessioneAuth | null) => {
    if (!s?.scadenzaA) return false;
    return Date.now() >= s.scadenzaA - MARGINE_SCADENZA_MS;
  }, []);

  // Se scaduto prova refresh silenzioso, altrimenti invalida la sessione
  const assicuraSessioneFresca = useCallback(
    async (
      corrente: DatiSessioneAuth | null,
    ): Promise<DatiSessioneAuth | null> => {
      if (!corrente) return null;
      if (!sessioneScaduta(corrente)) return corrente;
      if (!corrente.tokenAggiornamento) return null;

      const aggiornata = await aggiornaTokenMicrosoft(
        corrente.tokenAggiornamento,
      );
      if (!aggiornata) return null;

      await storageAuth.salvaSessione(aggiornata);
      return aggiornata;
    },
    [sessioneScaduta],
  );

  // Caricamento iniziale: verifica se esiste una sessione salvata in SecureStore
  useEffect(() => {
    const caricaToken = async () => {
      try {
        const salvata = await storageAuth.recuperaSessione();
        if (salvata) {
          const fresca = await assicuraSessioneFresca(salvata);
          if (fresca) {
            if (__DEV__) {
              console.log(
                "[useSessioneAuth] sessione caricata da storage",
                fresca,
              );
            }
            impostaSessione(fresca);
          } else {
            await storageAuth.cancellaSessione();
          }
        }
      } finally {
        impostaInCaricamento(false);
      }
    };

    caricaToken();
  }, [assicuraSessioneFresca]);

  // Accesso con Microsoft
  const accedi = useCallback(async () => {
    try {
      const nuovaSessione = await accediConMicrosoft();
      if (!nuovaSessione) return; // login cancellato o fallito

      if (__DEV__) {
        console.log(
          "[useSessioneAuth] token ricevuto da login:",
          nuovaSessione,
        );
      }
      await storageAuth.salvaSessione(nuovaSessione);
      impostaSessione(nuovaSessione);
    } catch (errore) {
      console.error("Errore durante il login", errore);
    }
  }, []);

  // Disconnessione
  const esci = useCallback(async () => {
    await storageAuth.cancellaSessione();
    impostaSessione(null);
  }, []);

  // Timer per il refresh silenzioso prima della scadenza del token
  useEffect(() => {
    if (!sessione?.scadenzaA) return;

    const ora = Date.now();
    const refreshTra = sessione.scadenzaA - ora - MARGINE_SCADENZA_MS;
    const ritardo = Math.max(refreshTra, 0);

    const timer = setTimeout(async () => {
      const fresca = await assicuraSessioneFresca(sessione);
      if (fresca) {
        impostaSessione(fresca);
        await storageAuth.salvaSessione(fresca);
      } else {
        await esci();
        Alert.alert("Sessione scaduta", "Accedi nuovamente per continuare.");
      }
    }, ritardo);

    return () => clearTimeout(timer);
  }, [sessione, assicuraSessioneFresca, esci]);

  return {
    sessione,
    tokenAccesso,
    inCaricamento,
    accedi,
    esci,
    impostaSessione,
  };
};
