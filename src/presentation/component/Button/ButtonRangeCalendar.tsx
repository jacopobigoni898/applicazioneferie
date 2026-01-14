import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Colors, Typography } from "../../../core/theme/theme";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function CustomButton({
  title,
  onPress,
  disabled = false,
  isLoading = false,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      style={[
        styles.button,
        disabled && styles.disabledButton, // Applica stile grigio se disabilitato
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10, // Arrotondato moderno
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // Ombra leggera
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#ccc", // Grigio quando disabilitato
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    color: "#fff",
    fontSize: Typography.size.md,
    fontWeight: "700", // '700' = bold
  },
});
