import axios from "axios";
import { API_BASE_URL } from "../config/env";
import { authStorage } from "../core/auth/authStorage";

// Istanza Axios condivisa per tutte le chiamate API
export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Handler esterno per notificare l'app in caso di 401 (es. logout forzato)
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

// Interceptor richiesta: inserisce il bearer letto da SecureStore (via authStorage)
http.interceptors.request.use(async (config) => {
  const token = await authStorage.getAccessToken();

  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    } as any;
  }

  return config;
});

// Interceptor risposta: se arriva 401 il token è presumibilmente invalido → lo rimuoviamo
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      await authStorage.deleteToken();
      if (onUnauthorized) {
        onUnauthorized();
      }
    }
    return Promise.reject(error);
  },
);
