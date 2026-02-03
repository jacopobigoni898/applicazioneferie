import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HolidayRequest } from "../../../domain/entities/HolidayRequest";
import { itemStyles } from "../../../core/style/commonStyles";

interface Props {
  item: HolidayRequest;
  formattedStart?: string;
  formattedEnd?: string;
  onDelete?: (id: number) => void;
  onEdit?: (item: HolidayRequest) => void;
}

export default function RequestItem({
  item,
  formattedStart,
  formattedEnd,
  onDelete,
  onEdit,
}: Props) {
  const status = (item.stato_approvazione || "").toLowerCase();
  const badgeColor =
    status.includes("approv") || status === "approvato"
      ? "#16a34a"
      : status.includes("rifiut") || status === "rifiutato"
        ? "#dc2626"
        : "#f59e0b";

  const fallbackStart = formattedStart ?? item.data_inizio.toLocaleDateString("it-IT");
  const fallbackEnd = formattedEnd ?? item.data_fine.toLocaleDateString("it-IT");

  return (
    <View style={itemStyles.card}>
      <View style={itemStyles.leftAccent} />
      <View style={itemStyles.content}>
        <Text style={itemStyles.title}>{item.tipo_permesso || "Ferie"}</Text>
        <Text style={itemStyles.rowText}>Dal: {fallbackStart}</Text>
        <Text style={itemStyles.rowText}>Al: {fallbackEnd}</Text>
      </View>

      <View style={itemStyles.right}>
        <View style={[itemStyles.badge, { backgroundColor: badgeColor }]}>
          <Text style={itemStyles.badgeText}>{item.stato_approvazione}</Text>
        </View>
        <View style={{ marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => onEdit?.(item)}
            style={{ marginBottom: 6 }}
          >
            <Text style={{ color: "#2563eb", fontWeight: "700" }}>
              Modifica
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete?.(item.id_richiesta)}>
            <Text style={{ color: "#dc2626", fontWeight: "700" }}>
              Elimina
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
