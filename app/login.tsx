import React from "react";
import { SafeAreaView, Text, View, StyleSheet } from "react-native";

// Schermata di accesso (segnaposto)
export default function SchermataAccesso() {
    return (
        <SafeAreaView style={stili.contenitore}>
            <View style={stili.scheda}>
                <Text style={stili.titolo}>Accesso all'account</Text>
                <Text style={stili.sottotitolo}>
                    Schermata di accesso (segnaposto)
                </Text>
            </View>
        </SafeAreaView>
    );
}

const stili = StyleSheet.create({
    contenitore: {
        flex: 1,
        backgroundColor: "#0e1a2b",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    scheda: {
        width: "100%",
        backgroundColor: "#13233a",
        borderRadius: 18,
        padding: 24,
        gap: 16,
    },
    titolo: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
    },
    sottotitolo: {
        fontSize: 15,
        color: "#c7d2e5",
        lineHeight: 20,
    },
});
