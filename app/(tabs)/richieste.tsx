// Schermata delle richieste: mostra richieste inviate (utente + admin)
// e ricevute (solo admin) con TabView e pull-to-refresh.
import React, { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, TabBar } from "react-native-tab-view";
import { stiliSchermata, stiliTab } from "../../src/core/style/commonStyles";
import { Colori } from "../../src/core/theme/theme";
import { useRichieste, TipoScheda } from "../../src/features/requests/hooks/useRichieste";
import { useModificaRichiesta } from "../../src/features/requests/hooks/useModificaRichiesta";
import ListaRichieste from "../../src/features/requests/components/ListaRichieste";
import ModaleModificaRichiesta from "../../src/features/requests/components/ModaleModificaRichiesta";

// Definizione delle tab
const PERCORSI_TAB = [
  { key: "inviate" as TipoScheda, title: "Richieste inviate" },
  { key: "ricevute" as TipoScheda, title: "Richieste ricevute" },
];

export default function SchermataRichieste() {
  const dimensioni = useWindowDimensions();
  const [indiceTab, impostaIndiceTab] = useState(0);

  // Hook per i dati delle due tab
  const inviate = useRichieste("inviate");
  const ricevute = useRichieste("ricevute");

  // Hook per la gestione della modifica
  const {
    elementoInModifica,
    modaleVisibile,
    inSalvataggio,
    apriModifica,
    chiudiModifica,
    confermaModifica,
  } = useModificaRichiesta();

  return (
    <SafeAreaView style={stiliSchermata.contenitore} edges={["top"]}>
      <View style={stiliSchermata.intestazione}>
        <View style={stiliSchermata.bloccoTitolo}>
          <Text style={stiliSchermata.titolo}>Richieste</Text>
        </View>
      </View>

      <TabView
        navigationState={{ index: indiceTab, routes: PERCORSI_TAB }}
        renderScene={({ route }) => {
          const datiTab = route.key === "inviate" ? inviate : ricevute;
          return (
            <ListaRichieste
              dati={datiTab.elementiFormattati}
              inCaricamento={datiTab.inCaricamento}
              errore={datiTab.errore}
              suRicarica={datiTab.ricarica}
              suEliminazione={datiTab.rimuovi}
              suModifica={(el) => apriModifica(el, datiTab.aggiorna)}
            />
          );
        }}
        onIndexChange={impostaIndiceTab}
        initialLayout={{ width: dimensioni.width }}
        renderTabBar={(props) => (
          <TabBar
            {...(props as any)}
            labelAllowFontScaling={false}
            indicatorStyle={{ backgroundColor: Colori.primario }}
            style={{
              backgroundColor: "transparent",
              marginTop: 24,
              height: 64,
              justifyContent: "center",
              paddingTop: 6,
            }}
            labelStyle={stiliTab.etichetta}
            activeColor="#000000"
            inactiveColor="#808080"
          />
        )}
      />

      <ModaleModificaRichiesta
        visibile={modaleVisibile}
        elemento={elementoInModifica}
        suChiusura={chiudiModifica}
        suConferma={confermaModifica}
        inSalvataggio={inSalvataggio}
      />
    </SafeAreaView>
  );
}
