// Schermata delle richieste: mostra richieste inviate (utente + admin)
// e ricevute (solo admin) con TabView e pull-to-refresh.
import React, { useMemo, useState } from "react";
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
import { useRichiesteAdmin } from "../../src/features/requests/hooks/useRichiesteAdmin";
import { useModificaRichiesta } from "../../src/features/requests/hooks/useModificaRichiesta";
import ListaRichieste from "../../src/features/requests/components/ListaRichieste";
import ListaRichiesteAdmin from "../../src/features/requests/components/ListaRichiesteAdmin";
import ModaleModificaRichiesta from "../../src/features/requests/components/ModaleModificaRichiesta";
import { useAuth } from "../_providers/AuthProvider";
import { RuoloUtente } from "../../src/domain/entities/User";
import { StatoRichiesta } from "../../src/domain/entities/RequestStatus";

export default function SchermataRichieste() {
  const dimensioni = useWindowDimensions();
  const [indiceTab, impostaIndiceTab] = useState(0);
  const { utente } = useAuth();
  const eAdmin = utente?.ruolo === RuoloUtente.ADMIN;

  // Tab visibili: solo "inviate" per utenti, entrambe per admin
  const percorsiTab = useMemo(() => {
    const tab: { key: TipoScheda; title: string }[] = [
      { key: "inviate", title: "Richieste inviate" },
    ];
    if (eAdmin) {
      tab.push({ key: "ricevute", title: "Richieste ricevute" });
    }
    return tab;
  }, [eAdmin]);

  // Hook per i dati delle richieste inviate
  const inviate = useRichieste("inviate");

  // Hook per le richieste ricevute (admin) — esclude le proprie
  const ricevuteAdmin = useRichiesteAdmin(utente?.id ?? "");

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
        backgroundColor={Platform.OS === "android" ? "#f5f5f5" : undefined}
      />
      <View style={stiliSchermata.intestazione}>
        <View style={stiliSchermata.bloccoTitolo}>
          <Text style={stiliSchermata.titolo}>Richieste</Text>
        </View>
      </View>

      <TabView
        navigationState={{ index: indiceTab, routes: percorsiTab }}
        renderScene={({ route }) => {
          if (route.key === "ricevute" && eAdmin) {
            return (
              <ListaRichiesteAdmin
                dati={ricevuteAdmin.elementiFormattati}
                inCaricamento={ricevuteAdmin.inCaricamento}
                errore={ricevuteAdmin.errore}
                suRicarica={ricevuteAdmin.ricarica}
                suAutorizza={(id) =>
                  ricevuteAdmin.aggiornaStato(id, StatoRichiesta.AUTORIZZATO)
                }
                suRifiuta={(id) =>
                  ricevuteAdmin.aggiornaStato(id, StatoRichiesta.RIFIUTATO)
                }
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
