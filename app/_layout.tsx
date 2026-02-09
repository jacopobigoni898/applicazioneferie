import { Stack } from "expo-router";

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
    return <NavigatorePrincipale />;
}
