import { Platform } from "react-native";

// URL base dell'API centralizzato (IP LAN della macchina host)
export const URL_BASE_API = Platform.select({
  ios: "http://192.168.10.71:5000/api",
  android: "http://192.168.10.71:5000/api",
  default: "http://192.168.10.71:5000/api",
}) as string;

// Configurazione Microsoft Entra ID / MSAL
export const MSAL_ID_CLIENT = "37bdcadd-4948-4dff-9c60-a3d119fa4ab5";
export const MSAL_ID_TENANT = "b3c5783b-8e0b-4639-85b6-e17c2dabed5b";
export const MSAL_AMBITI = [
  "api://37bdcadd-4948-4dff-9c60-a3d119fa4ab5/user_impersonation",
];
