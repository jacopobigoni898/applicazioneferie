import * as AuthSession from "expo-auth-session";
import { MSAL_ID_CLIENT, MSAL_AMBITI, MSAL_ID_TENANT } from "../../config/env";
import type { DatiSessioneAuth } from "./authStorage";

type RispostaToken = AuthSession.TokenResponse;

// Converte expiresIn (sec) in epoch ms con buffer per evitare richieste a token quasi scaduto
const calcolaScadenzaA = (scadeIn?: number): number => {
  const secondiSicuri = typeof scadeIn === "number" ? scadeIn : 3600;
  // buffer 60s per evitare richieste con token quasi scaduto
  return Date.now() + Math.max(secondiSicuri - 60, 30) * 1000;
};

// Normalizza la TokenResponse di MSAL nel nostro DatiSessioneAuth
const mappaRispostaToken = (rt: RispostaToken): DatiSessioneAuth | null => {
  if (!rt.accessToken) return null;
  return {
    tokenAccesso: rt.accessToken,
    tokenAggiornamento: rt.refreshToken ?? null,
    scadenzaA: calcolaScadenzaA(rt.expiresIn),
  };
};

// Login interattivo Microsoft (PKCE). Ritorna token, refreshToken (se concesso) e scadenzaA in ms.
export const accediConMicrosoft = async (): Promise<DatiSessioneAuth | null> => {
  const discovery = await AuthSession.fetchDiscoveryAsync(
    `https://login.microsoftonline.com/${MSAL_ID_TENANT}/v2.0`,
  );

  const uriRedirect = AuthSession.makeRedirectUri();

  const richiesta = new AuthSession.AuthRequest({
    clientId: MSAL_ID_CLIENT,
    scopes: MSAL_AMBITI,
    redirectUri: uriRedirect,
    usePKCE: true,
  });

  const risultato = await richiesta.promptAsync(discovery);

  if (risultato.type !== "success" || !risultato.params.code) {
    return null; // login cancellato o fallito
  }

  const rispostaToken = await AuthSession.exchangeCodeAsync(
    {
      clientId: MSAL_ID_CLIENT,
      code: risultato.params.code,
      redirectUri: uriRedirect,
      extraParams: {
        code_verifier: richiesta.codeVerifier || "",
      },
    },
    discovery,
  );

  return mappaRispostaToken(rispostaToken);
};

// Refresh silenzioso se disponibile un refresh token. Ritorna nuova sessione o null se fallisce.
export const aggiornaTokenMicrosoft = async (
  tokenAggiornamento: string,
): Promise<DatiSessioneAuth | null> => {
  const discovery = await AuthSession.fetchDiscoveryAsync(
    `https://login.microsoftonline.com/${MSAL_ID_TENANT}/v2.0`,
  );

  try {
    const rispostaToken = await AuthSession.refreshAsync(
      {
        clientId: MSAL_ID_CLIENT,
        refreshToken: tokenAggiornamento,
        scopes: MSAL_AMBITI,
      },
      discovery,
    );

    const mappato = mappaRispostaToken(rispostaToken);
    if (!mappato) return null;

    // Se il provider non restituisce un nuovo refreshToken, riutilizza il precedente
    if (!mappato.tokenAggiornamento) {
      mappato.tokenAggiornamento = tokenAggiornamento;
    }

    return mappato;
  } catch (errore) {
    console.warn("Refresh token fallito", errore);
    return null;
  }
};
