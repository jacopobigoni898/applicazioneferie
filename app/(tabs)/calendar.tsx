import { View, Text, Button, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Colors, Spacing, Typography } from "../../src/core/theme/theme";
import CalendarComp from "../../src/presentation/component/calendar/CalendarComponent";
//import { LinearGradient } from "expo-linear-gradient";

export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.background}>
        <Text style={styles.title}>Calendario</Text>
        <CalendarComp></CalendarComp>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.medium,
    paddingTop: Spacing.title,
    marginLeft: Spacing.titleleft,
  },
  background: {
    backgroundColor: Colors.background,
    flex: 1,
  },
});
