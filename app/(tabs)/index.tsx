import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../_providers/AuthProvider";

export default function IndexScreen() {
    const { signOut } = useAuth();

    return (
        <SafeAreaView>
            <Text>Profile Screen</Text>
            <Button title="Logout" onPress={signOut} />
        </SafeAreaView>
    );
}