import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import CalendarComp from "../../src/features/calendar/components/CalendarComponent";
import { screenStyles } from "../../src/core/style/commonStyles";

export default function CalendarScreen() {
  return (
    <SafeAreaView style={screenStyles.container} edges={["top"]}>
      <View style={screenStyles.header}>
        <View style={screenStyles.titleBlock}>
          <Text style={screenStyles.title}>Calendario</Text>
        </View>
      </View>
      <View style={screenStyles.top}>
        <CalendarComp></CalendarComp>
      </View>
    </SafeAreaView>
  );
}
