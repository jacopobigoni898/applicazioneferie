import { View,Text,Button,Platform,StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { Calendar,LocaleConfig } from "react-native-calendars"; 
import CalendarComp from "../../src/presentation/component/CalendarComponent";
export default function CalendarScreen() {
    return (
        <SafeAreaView>
            <CalendarComp />
        </SafeAreaView>
    );
}