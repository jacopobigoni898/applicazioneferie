import React from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../_providers/AuthProvider";
import { screenStyles, profileScreen } from "../../src/core/style/commonStyles";
export default function IndexScreen() {
  const { signOut, user, isUserLoading } = useAuth();

  return (
    <SafeAreaView style={screenStyles.container} edges={["top"]}>
      <View style={screenStyles.header}>
        <View style={screenStyles.titleBlock}>
          <Text style={screenStyles.title}>Il mio Profilo</Text>
        </View>
      </View>
      <View style={profileScreen.profiletop}>
        {isUserLoading ? (
          <Text style={profileScreen.informationProfileStyle}>
            Carico il profilo...
          </Text>
        ) : user ? (
          <View style={[profileScreen.cardProfile, profileScreen.profilePill]}>
            <View style={profileScreen.profileAvatar} />

            <View style={{ flex: 1, gap: 2 }}>
              <View style={profileScreen.profileNameRow}>
                <Text
                  style={[
                    profileScreen.informationProfileStyle,
                    { fontWeight: "700" },
                  ]}
                >
                  {user.name}
                </Text>
                <Text style={profileScreen.informationProfileStyle}>
                  {user.surname || "-"}
                </Text>
              </View>
              <Text
                style={[
                  profileScreen.informationProfileStyle,
                  profileScreen.profileRole,
                ]}
              >
                {user.role || "Dipendente"}
              </Text>
              <Text
                style={[
                  profileScreen.informationProfileStyle,
                  profileScreen.profileEmail,
                ]}
              >
                {user.email}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={profileScreen.informationProfileStyle}>
            Nessun profilo disponibile
          </Text>
        )}
      </View>
      <Button title="Logout" onPress={signOut} />
    </SafeAreaView>
  );
}

//comment
{
  /* <View style={{ marginVertical: 12 }}>
        <Button
          title={loading ? "Chiamo..." : "Chiama API"}
          onPress={loadData}
          disabled={loading}
        />
      </View> */
}
