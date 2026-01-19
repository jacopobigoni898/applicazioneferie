import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import CalendarComp from "../../src/presentation/component/calendar/CalendarComponent";
import { calendarScreenStyles } from "../../src/core/style/commonStyles";

export default function CalendarScreen() {
  return (
    <SafeAreaView style={calendarScreenStyles.container} edges={["top"]}>
      <View style={calendarScreenStyles.header}>
        <View style={calendarScreenStyles.titleBlock}>
          <Text style={calendarScreenStyles.title}>Calendario</Text>
        </View>
      </View>
      <View style={calendarScreenStyles.top}>
        <CalendarComp></CalendarComp>
      </View>
    </SafeAreaView>
  );
}
