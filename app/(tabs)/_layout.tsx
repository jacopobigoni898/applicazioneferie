import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Colori } from "../../src/core/theme/theme";

// Layout delle tab dell'applicazione
export default function LayoutTab() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // nasconde l'intestazione su tutte le pagine
        tabBarActiveTintColor: Colori.primario, // colore icone/testo attivo
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Profilo",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendario",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="richieste"
        options={{
          title: "Richieste",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="form" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
