import * as AuthSession from "expo-auth-session";
import { MSAL_CLIENT_ID, MSAL_SCOPES, MSAL_TENANT_ID } from "../../config/env";

// Gestisce il flusso di login Microsoft (PKCE) e restituisce l'access token, oppure null se annullato
export const signInWithMicrosoft = async (): Promise<string | null> => {
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

  return tokenResponse.accessToken ?? null;
};
