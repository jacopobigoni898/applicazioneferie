import { Platform } from "react-native";

// Base URL centralizzato (qui fissato sull'IP LAN della macchina host)
export const API_BASE_URL = Platform.select({
  ios: "http://192.168.10.141:5000/api",
  android: "http://192.168.10.141:5000/api",
  default: "http://192.168.10.141:5000/api",
}) as string;
