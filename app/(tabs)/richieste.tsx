import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchHolidaysByToken,
  HolidayListDto,
} from "../../src/features/requests/services/requestsService";

export default function Richieste() {
  const [items, setItems] = useState<HolidayListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
        const data = await fetchHolidaysByToken();
      setItems(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Errore di caricamento";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderItem = ({ item }: { item: HolidayListDto }) => {
    return (
      <View
        style={{
          padding: 12,
          borderRadius: 10,
          backgroundColor: "#f5f7fb",
          marginBottom: 10,
          borderWidth: 1,
          borderColor: "#e1e5ee",
        }}
      >
        <Text style={{ fontWeight: "700", marginBottom: 4 }}>
          {item.tipo_permesso || "Ferie"}
        </Text>
        <Text style={{ color: "#444" }}>Dal: {item.data_inizio}</Text>
        <Text style={{ color: "#444" }}>Al: {item.data_fine}</Text>
        <Text style={{ marginTop: 6, color: "#2563eb", fontWeight: "600" }}>
          Stato: {item.stato_approvazione}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
        Richieste inviate
      </Text>

      <TouchableOpacity
        onPress={loadData}
        disabled={loading}
        style={{
          padding: 12,
          borderRadius: 10,
          backgroundColor: loading ? "#9aa0a6" : "#2563eb",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>Aggiorna</Text>
        )}
      </TouchableOpacity>

      {error ? (
        <Text style={{ color: "#d64545", marginBottom: 12 }}>{error}</Text>
      ) : null}

      {loading && items.length === 0 ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item.id_richiesta || index}`}
          renderItem={renderItem}
          ListEmptyComponent={
            !loading ? (
              <Text style={{ color: "#555" }}>Nessuna richiesta trovata</Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
