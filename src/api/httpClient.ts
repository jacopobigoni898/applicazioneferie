import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../config/env";

// Istanza Axios condivisa per tutte le chiamate API
export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Interceptor: allega automaticamente il bearer token salvato in SecureStore
http.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("msal_access_token");

  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    } as any;
  }

  return config;
});
