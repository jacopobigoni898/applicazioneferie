import { Stack } from "expo-router";
import { AuthProvider } from "./_providers/AuthProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Navigatore principale dell'applicazione
function NavigatorePrincipale() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
    </Stack>
  );
}

// Layout radice dell'applicazione
export default function LayoutRadice() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigatorePrincipale />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
