import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

// Hook per la protezione delle rotte autenticate
// Reindirizza gli utenti non autenticati alla schermata di login
export const useGuardiaAuth = (
  tokenAccesso: string | null,
  inCaricamento: boolean,
  inCaricamentoUtente: boolean,
) => {
  const router = useRouter();
  const segmenti = useSegments();

  useEffect(() => {
    if (inCaricamento || inCaricamentoUtente) return;

    const nelleTab = segmenti[0] === "(tabs)";
    const alLogin = segmenti[0] === "login";

    if (!tokenAccesso && nelleTab) {
      router.replace("/login");
    }

    if (tokenAccesso && alLogin) {
      router.replace("/(tabs)");
    }
  }, [tokenAccesso, inCaricamento, inCaricamentoUtente, router, segmenti]);
};
