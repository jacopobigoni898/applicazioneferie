import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HolidayListDto } from "../services/requestsService";
import { itemStyles } from "../../../core/style/commonStyles";

interface Props {
  item: HolidayListDto;
  formattedStart?: string;
  formattedEnd?: string;
  onDelete?: (id: number) => void;
}

export default function RequestItem({
  item,
  formattedStart,
  formattedEnd,
  onDelete,
}: Props) {
  const status = (item.stato_approvazione || "").toLowerCase();
  const badgeColor =
    status.includes("approv") || status === "approvato"
      ? "#16a34a"
      : status.includes("rifiut") || status === "rifiutato"
        ? "#dc2626"
        : "#f59e0b";

  return (
    <View style={itemStyles.card}>
      <View style={itemStyles.leftAccent} />
      <View style={itemStyles.content}>
        <Text style={itemStyles.title}>{item.tipo_permesso || "Ferie"}</Text>
        <Text style={itemStyles.rowText}>
          Dal: {formattedStart ?? item.data_inizio}
        </Text>
        <Text style={itemStyles.rowText}>
          Al: {formattedEnd ?? item.data_fine}
        </Text>
      </View>

      <View style={itemStyles.right}>
        <View style={[itemStyles.badge, { backgroundColor: badgeColor }]}>
          <Text style={itemStyles.badgeText}>{item.stato_approvazione}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onDelete?.(item.id_richiesta)}
          style={{ marginTop: 8 }}
        >
          <Text style={{ color: "#dc2626", fontWeight: "700" }}>Elimina</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
