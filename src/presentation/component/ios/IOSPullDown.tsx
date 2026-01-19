import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../core/theme/theme";
import { pullDownStyles } from "../../../core/style/commonStyles";

export type PullDownOption = {
  label: string;
  value: string;
};

type Props = {
  options: PullDownOption[];
  selectedLabel?: string;
  placeholder: string;
  onSelect: (value: string) => void;
  triggerStyle: ViewStyle | ViewStyle[];
  selectedTextStyle: TextStyle;
  placeholderStyle: TextStyle;
  chevronColor?: string;
};

export function IOSPullDown({
  options,
  selectedLabel,
  placeholder,
  onSelect,
  triggerStyle,
  selectedTextStyle,
  placeholderStyle,
  chevronColor,
}: Props) {
  // Stato di apertura/chiusura del menu
  const [open, setOpen] = useState(false);

  return (
    <View style={pullDownStyles.container}>
      <TouchableOpacity
        style={triggerStyle}
        onPress={() => setOpen((prev) => !prev)} // toggle apertura menu
        activeOpacity={0.85}
      >
        {/* Mostra il label selezionato o il placeholder */}
        <Text style={selectedLabel ? selectedTextStyle : placeholderStyle}>
          {selectedLabel || placeholder}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={chevronColor || Colors.textSecondary}
        />
      </TouchableOpacity>

      {open && (
        <View style={pullDownStyles.overlay}>
          <Pressable
            style={pullDownStyles.overlay}
            onPress={() => setOpen(false)} // chiusura tap fuori menu
          />
          <View style={pullDownStyles.menu}>
            {options.map((option, index) => (
              <Pressable
                key={option.value}
                style={({ pressed }) => [
                  pullDownStyles.menuItem,
                  pressed && pullDownStyles.menuItemPressed,
                  index === options.length - 1 && pullDownStyles.menuItemLast,
                ]}
                onPress={() => {
                  onSelect(option.value); // propaga selezione al parent
                  setOpen(false); // chiude menu dopo scelta
                }}
              >
                <Text style={pullDownStyles.menuItemText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
