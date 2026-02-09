import { Platform } from "react-native";

// URL base dell'API (segnaposto - da configurare)
export const URL_BASE_API = Platform.select({
  ios: "http://localhost:5000/api",
  android: "http://localhost:5000/api",
  default: "http://localhost:5000/api",
}) as string;

// Configurazione Microsoft Entra ID / MSAL (segnaposto - da configurare)
export const MSAL_ID_CLIENT = "";
export const MSAL_ID_TENANT = "";
export const MSAL_AMBITI: string[] = [];
