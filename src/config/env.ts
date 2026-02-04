import { Platform } from "react-native";

// Base URL centralizzato (qui fissato sull'IP LAN della macchina host)
export const API_BASE_URL = Platform.select({
  ios: "http://192.168.10.84:5000/api",
  android: "http://192.168.10.84:5000/api",
  default: "http://192.168.10.84:5000/api",
}) as string;

// Config Microsoft Entra ID / MSAL
export const MSAL_CLIENT_ID = "37bdcadd-4948-4dff-9c60-a3d119fa4ab5";
export const MSAL_TENANT_ID = "b3c5783b-8e0b-4639-85b6-e17c2dabed5b";
export const MSAL_SCOPES = [
  "api://37bdcadd-4948-4dff-9c60-a3d119fa4ab5/user_impersonation",
];
