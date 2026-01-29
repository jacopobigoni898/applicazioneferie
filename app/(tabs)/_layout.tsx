import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "../../src/core/theme/theme";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, //rimuove il titolo su tutte le pagine
        tabBarActiveTintColor: Colors.primary, // icone/testo attivo
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
