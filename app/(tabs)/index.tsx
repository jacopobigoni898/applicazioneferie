import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../_providers/AuthProvider";

export default function IndexScreen() {
  const { signOut, accessToken } = useAuth();
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const PC_IP = "192.168.10.87";

  const api = useMemo(
    () =>
      axios.create({
        baseURL: `http://${PC_IP}:5000/api`,
        timeout: 10000,
      }),
    [],
  );

  useEffect(() => {
    const id = api.interceptors.request.use(async (config) => {
      const token = await SecureStore.getItemAsync("msal_access_token");
      console.log("Interceptor - token:", token);
      console.log(
        "Interceptor - request URL:",
        `${config.baseURL ?? ""}${config.url ?? ""}`,
      );

      if (token) {
        // forza header Authorization anche se headers è AxiosHeaders
        if (
          config.headers &&
          typeof (config.headers as any).set === "function"
        ) {
          (config.headers as any).set("Authorization", `Bearer ${token}`);
        } else {
          config.headers = {
            ...(config.headers || {}),
            Authorization: `Bearer ${token}`,
          } as any;
        }
      }

      return config;
    });

    return () => {
      api.interceptors.request.eject(id);
    };
  }, [api]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setResult("");
    setError("");
    try {
      const res = await api.get("/Auth/microsoft-login");
      console.log("Dati ricevuti dal backend:", res.data);
      setResult(JSON.stringify(res.data));
    } catch (err: unknown) {
      console.error("Errore chiamata API:", err);
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (accessToken) {
      console.log("ACCESS TOKEN DAL CONTEXT:", accessToken);
      loadData();
    }
  }, [accessToken, loadData]);

  return (
    <SafeAreaView>
      <Text>Profile Screen</Text>
      <View style={{ marginVertical: 12 }}>
        <Button
          title={loading ? "Chiamo..." : "Chiama API"}
          onPress={loadData}
          disabled={loading}
        />
      </View>
      {result ? <Text>Risultato: {result}</Text> : null}
      {error ? <Text style={{ color: "red" }}>Errore: {error}</Text> : null}
      <Button title="Logout" onPress={signOut} />
    </SafeAreaView>
  );
}
