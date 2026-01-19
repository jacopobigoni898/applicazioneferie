import {
  View,
  Text,
  Button,
  Platform,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Colors, Spacing, Typography } from "../../src/core/theme/theme";
import CalendarComp from "../../src/presentation/component/calendar/CalendarComponent";
//import { LinearGradient } from "expo-linear-gradient";

export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendario</Text>
      </View>
      <View style={styles.top}>
        <CalendarComp></CalendarComp>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.top,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.medium,
    paddingTop: Spacing.title,
    marginLeft: Spacing.titleleft,
  },
  header: {
    //marginBottom: Spacing.marginbottomtitle,
    backgroundColor: Colors.top,
  },
  top: {
    flex: 1,
  },
});
