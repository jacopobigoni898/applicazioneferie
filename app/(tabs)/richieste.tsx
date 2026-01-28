import React, { useState, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRequests } from "../../src/features/requests/hooks/useRequests";
import RequestItem from "../../src/features/requests/components/RequestItem";
import { screenStyles, tabStyles } from "../../src/core/style/commonStyles";
import { TabView, TabBar } from "react-native-tab-view";
import { Colors } from "../../src/core/theme/theme";
type TabKey = "sent" | "received";

const tabs: { key: TabKey; label: string }[] = [
  { key: "sent", label: "Richieste inviate" },
  { key: "received", label: "Richieste ricevute" },
];

export default function Richieste() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0); //resta sulle richieste inviate
  const [routes] = useState([
    { key: "sent", title: "Richieste inviate" },
    { key: "received", title: "Richieste ricevute" },
  ]);

  const sent = useRequests("sent");
  const received = useRequests("received");
  // verifica che la lista non sia vuota
  const listEmpty = (loading: boolean) =>
    !loading ? (
      <Text style={{ color: "#555" }}>Nessuna richiesta trovata</Text>
    ) : null;

  const renderList = (
    data: any[],
    loadingFlag: boolean,
    errorMsg: string | null,
    reloadFn: () => void,
    removeFn: (id: number) => void,
  ) => (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
      {errorMsg ? (
        <Text style={{ color: "#d64545", marginBottom: 12 }}>{errorMsg}</Text>
      ) : null}

      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.id_richiesta || index}`}
        renderItem={({ item }: any) => (
          <RequestItem
            item={item}
            formattedStart={item.formatted_start}
            formattedEnd={item.formatted_end}
            onDelete={removeFn}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={loadingFlag} onRefresh={reloadFn} />
        }
        ListEmptyComponent={listEmpty(loadingFlag)}
        ListFooterComponent={
          loadingFlag && data.length > 0 ? <ActivityIndicator /> : null
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );

  return (
    <SafeAreaView style={screenStyles.container} edges={["top"]}>
      <View style={screenStyles.header}>
        <View style={screenStyles.titleBlock}>
          <Text style={screenStyles.title}>Richieste</Text>
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={({ route }) => {
          if (route.key === "sent")
            return renderList(
              sent.formattedItems,
              sent.loading,
              sent.error,
              sent.reload,
              sent.remove,
            );
          if (route.key === "received")
            return renderList(
              received.formattedItems,
              received.loading,
              received.error,
              received.reload,
              received.remove,
            );
          return null;
        }}
        onIndexChange={(i) => setIndex(i)}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...(props as any)}
            labelAllowFontScaling={false}
            indicatorStyle={{ backgroundColor: Colors.primary }}
            style={{
              backgroundColor: "transparent",
              marginTop: 24,
              height: 64,
              justifyContent: "center",
              paddingTop: 6,
            }}
            labelStyle={tabStyles.tabLabel}
            activeColor="#000000"
            inactiveColor="#808080"
          />
        )}
      />
    </SafeAreaView>
  );
}
