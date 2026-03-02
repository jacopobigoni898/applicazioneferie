// Schermata delle richieste: mostra richieste inviate (utente + admin)
// e ricevute (solo admin) con TabView e pull-to-refresh.
import React, { useState } from "react";
import {
  Text,
  View,
  useWindowDimensions,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, TabBar } from "react-native-tab-view";
import { stiliSchermata, stiliTab } from "../../src/core/style/commonStyles";
import { Colori } from "../../src/core/theme/theme";
import {
  useRichieste,
  TipoScheda,
} from "../../src/features/requests/hooks/useRichieste";
import { useModificaRichiesta } from "../../src/features/requests/hooks/useModificaRichiesta";
import ListaRichieste from "../../src/features/requests/components/ListaRichieste";
import ListaRichiesteAdmin from "../../src/features/requests/components/ListaRichiesteAdmin";
import ModaleModificaRichiesta from "../../src/features/requests/components/ModaleModificaRichiesta";
import { useAuth } from "../_providers/AuthProvider";
import { RuoloUtente } from "../../src/domain/entities/User";
import { StatoRichiesta } from "../../src/domain/entities/RequestStatus";

const PERCORSO_INVIATE = {
  key: "inviate" as TipoScheda,
  title: "Richieste inviate",
};
const PERCORSO_RICEVUTE = {
  key: "ricevute" as TipoScheda,
  title: "Richieste ricevute",
};

export default function SchermataRichieste() {
  const dimensioni = useWindowDimensions();
  const [indiceTab, impostaIndiceTab] = useState(0);
  const { utente } = useAuth();
  const isAdmin = utente?.ruolo === RuoloUtente.ADMIN;

  const percorsiTab = isAdmin
    ? [PERCORSO_INVIATE, PERCORSO_RICEVUTE]
    : [PERCORSO_INVIATE];

  // Hook per i dati delle due tab
  const inviate = useRichieste("inviate");
  const ricevute = useRichieste("ricevute", isAdmin);

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
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" ? Colori.secondario : undefined}
      />
      <View style={stiliSchermata.intestazione}>
        <View style={stiliSchermata.bloccoTitolo}>
          <Text style={stiliSchermata.titolo}>Richieste</Text>
        </View>
      </View>

      <TabView
        navigationState={{ index: indiceTab, routes: percorsiTab }}
        renderScene={({ route }) => {
          if (route.key === "ricevute") {
            return (
              <ListaRichiesteAdmin
                dati={ricevute.elementiFormattati}
                inCaricamento={ricevute.inCaricamento}
                errore={ricevute.errore}
                suRicarica={ricevute.ricarica}
                suAutorizza={(id: number) => ricevute.autorizza(id)}
                suNonAutorizza={(id: number) => ricevute.rifiuta(id)}
              />
            );
          }
          return (
            <ListaRichieste
              dati={inviate.elementiFormattati}
              inCaricamento={inviate.inCaricamento}
              errore={inviate.errore}
              suRicarica={inviate.ricarica}
              suEliminazione={inviate.rimuovi}
              suModifica={(el) => apriModifica(el, inviate.aggiorna)}
            />
          );
        }}
        onIndexChange={impostaIndiceTab}
        initialLayout={{ width: dimensioni.width }}
        renderTabBar={(props) =>
          isAdmin ? (
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
              activeColor={Colori.testoPrimario}
              inactiveColor={Colori.testoSecondario}
            />
          ) : null
        }
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
