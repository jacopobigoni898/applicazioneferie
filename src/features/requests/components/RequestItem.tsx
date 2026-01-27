import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HolidayListDto } from "../services/requestsService";

interface Props {
  item: HolidayListDto;
}

export default function RequestItem({ item }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.tipo_permesso || "Ferie"}</Text>
      <Text style={styles.text}>Dal: {item.data_inizio}</Text>
      <Text style={styles.text}>Al: {item.data_fine}</Text>
      <Text style={styles.status}>Stato: {item.stato_approvazione}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f5f7fb",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e1e5ee",
  },
  title: { fontWeight: "700", marginBottom: 4 },
  text: { color: "#444" },
  status: { marginTop: 6, color: "#2563eb", fontWeight: "600" },
});
