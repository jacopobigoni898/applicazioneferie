import * as AuthSession from "expo-auth-session";
import { MSAL_CLIENT_ID, MSAL_SCOPES, MSAL_TENANT_ID } from "../../config/env";
import type { AuthSessionData } from "./authStorage";

type TokenResponse = AuthSession.TokenResponse;

// Converte expiresIn (sec) in epoch ms con piccolo buffer per evitare richieste a token quasi scaduto
const calcExpiresAt = (expiresIn?: number): number => {
  const safeSeconds = typeof expiresIn === "number" ? expiresIn : 3600;
  // buffer 60s per evitare richieste con token quasi scaduto
  return Date.now() + Math.max(safeSeconds - 60, 30) * 1000;
};

// Normalizza la TokenResponse di MSAL nel nostro AuthSessionData
const mapTokenResponse = (tr: TokenResponse): AuthSessionData | null => {
  if (!tr.accessToken) return null;
  return {
    accessToken: tr.accessToken,
    refreshToken: tr.refreshToken ?? null,
    expiresAt: calcExpiresAt(tr.expiresIn),
  };
};

// Login interattivo Microsoft (PKCE). Ritorna token, refreshToken (se concesso) e expiresAt in ms.
export const signInWithMicrosoft = async (): Promise<AuthSessionData | null> => {
  const discovery = await AuthSession.fetchDiscoveryAsync(
    `https://login.microsoftonline.com/${MSAL_TENANT_ID}/v2.0`,
  );

  const redirectUri = AuthSession.makeRedirectUri();

  const request = new AuthSession.AuthRequest({
    clientId: MSAL_CLIENT_ID,
    scopes: MSAL_SCOPES,
    redirectUri,
    usePKCE: true,
  });

  const result = await request.promptAsync(discovery);

  if (result.type !== "success" || !result.params.code) {
    return null; // login cancellato o fallito
  }

  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId: MSAL_CLIENT_ID,
      code: result.params.code,
      redirectUri,
      extraParams: {
        code_verifier: request.codeVerifier || "",
      },
    },
    discovery,
  );

  return mapTokenResponse(tokenResponse);
};

// Refresh silenzioso se e' disponibile un refresh token. Ritorna nuova sessione o null se fallisce.
export const refreshMicrosoftToken = async (
  refreshToken: string,
): Promise<AuthSessionData | null> => {
  const discovery = await AuthSession.fetchDiscoveryAsync(
    `https://login.microsoftonline.com/${MSAL_TENANT_ID}/v2.0`,
  );

  try {
    const tokenResponse = await AuthSession.refreshAsync(
      {
        clientId: MSAL_CLIENT_ID,
        refreshToken,
        scopes: MSAL_SCOPES,
      },
      discovery,
    );

    const mapped = mapTokenResponse(tokenResponse);
    if (!mapped) return null;

    // Se il provider non restituisce nuovo refreshToken, riutilizzo il precedente
    if (!mapped.refreshToken) {
      mapped.refreshToken = refreshToken;
    }

    return mapped;
  } catch (error) {
    console.warn("Refresh token fallito", error);
    return null;
  }
};
