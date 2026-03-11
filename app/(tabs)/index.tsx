import React, { useState } from "react";
import {
  Text,
  View,
  StatusBar,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../_providers/AuthProvider";
import { stiliSchermata } from "../../src/core/style/commonStyles";
import { Colori, Tipografia, Spaziatura } from "../../src/core/theme/theme";
import { ms } from "../../src/core/style/responsive";
import { useRichieste } from "../../src/features/requests/hooks/useRichieste";
import GraficoAssenze from "../../src/features/requests/components/GraficoAssenze";
import ModalePresenza from "../../src/features/presence/components/ModalePresenza";
import { RuoloUtente } from "../../src/domain/entities/User";

// Iniziali dell'utente per l'avatar
function ottieniIniziali(nome?: string, cognome?: string): string {
  const n = nome?.charAt(0)?.toUpperCase() ?? "";
  const c = cognome?.charAt(0)?.toUpperCase() ?? "";
  return `${n}${c}` || "?";
}

// Schermata del profilo utente
export default function SchermataProfilo() {
  const { esci, utente, inCaricamentoUtente } = useAuth();
  const inviate = useRichieste("inviate");
  const [modalePresenzaVisibile, impostaModalePresenza] = useState(false);

  const isAdmin = utente?.ruolo === RuoloUtente.ADMIN;

  return (
    <SafeAreaView style={stiliSchermata.contenitore} edges={["top"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          Platform.OS === "android" ? Colori.secondario : undefined
        }
      />
      <View style={stiliSchermata.intestazione}>
        <View style={stiliSchermata.bloccoTitolo}>
          <Text style={stiliSchermata.titolo}>Il mio Profilo</Text>
        </View>
      </View>

      <ScrollView
        style={stiliSchermata.superiore}
        contentContainerStyle={stiliProfilo.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card profilo utente */}
        <View style={stiliProfilo.cardProfilo}>
          {inCaricamentoUtente ? (
            <View style={stiliProfilo.contenitoreCaricamento}>
              <ActivityIndicator size="large" color={Colori.primario} />
              <Text style={stiliProfilo.testoCaricamento}>
                Carico il profilo...
              </Text>
            </View>
          ) : utente ? (
            <View style={stiliProfilo.contenitoreProfiloUtente}>
              {/* Avatar con iniziali */}
              <View style={stiliProfilo.avatar}>
                <Text style={stiliProfilo.testoAvatar}>
                  {ottieniIniziali(utente.nome, utente.cognome)}
                </Text>
              </View>

              {/* Info utente */}
              <Text style={stiliProfilo.nomeUtente}>
                {utente.nome} {utente.cognome}
              </Text>

              {/* Badge ruolo */}
              <View
                style={[
                  stiliProfilo.badgeRuolo,
                  isAdmin && stiliProfilo.badgeRuoloAdmin,
                ]}
              >
                <Ionicons
                  name={isAdmin ? "shield-checkmark" : "person"}
                  size={ms(13)}
                  color={
                    isAdmin
                      ? Colori.azioneAutorizzaTesto
                      : Colori.azioneModificaTesto
                  }
                />
                <Text
                  style={[
                    stiliProfilo.testoBadgeRuolo,
                    isAdmin && stiliProfilo.testoBadgeRuoloAdmin,
                  ]}
                >
                  {utente.ruolo}
                </Text>
              </View>

              {/* Riga email */}
              <View style={stiliProfilo.rigaDettaglio}>
                <Ionicons
                  name="mail-outline"
                  size={ms(16)}
                  color={Colori.testoSecondario}
                />
                <Text style={stiliProfilo.testoDettaglio}>{utente.email}</Text>
              </View>
            </View>
          ) : (
            <View style={stiliProfilo.contenitoreCaricamento}>
              <Ionicons
                name="person-circle-outline"
                size={ms(48)}
                color={Colori.testoSecondario}
              />
              <Text style={stiliProfilo.testoCaricamento}>
                Nessun profilo disponibile
              </Text>
            </View>
          )}
        </View>

        {/* Grafico assenze */}
        <GraficoAssenze
          richieste={inviate.elementi}
          inCaricamento={inviate.inCaricamento}
        />

        {/* Azioni */}
        <View style={stiliProfilo.contenitoreAzioni}>
          <TouchableOpacity
            style={stiliProfilo.pulsantePresenza}
            onPress={() => impostaModalePresenza(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="location-outline"
              size={ms(18)}
              color={Colori.bianco}
            />
            <Text style={stiliProfilo.testoPulsantePresenza}>
              Segnala Presenza
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stiliProfilo.pulsanteEsci}
            onPress={esci}
            activeOpacity={0.8}
          >
            <Ionicons
              name="log-out-outline"
              size={ms(18)}
              color={Colori.accento}
            />
            <Text style={stiliProfilo.testoPulsanteEsci}>Esci</Text>
          </TouchableOpacity>
        </View>

        <ModalePresenza
          visibile={modalePresenzaVisibile}
          suChiudi={() => impostaModalePresenza(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const stiliProfilo = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spaziatura.xl + Spaziatura.lg,
  },
  /* Card profilo */
  cardProfilo: {
    backgroundColor: Colori.bianco,
    borderRadius: 16,
    marginHorizontal: Spaziatura.md,
    marginTop: Spaziatura.md,
    marginBottom: Spaziatura.sm,
    borderColor: Colori.secondario,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: Colori.ombra,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  contenitoreCaricamento: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spaziatura.xl,
    gap: Spaziatura.sm,
  },
  testoCaricamento: {
    fontSize: ms(14),
    color: Colori.testoSecondario,
  },
  contenitoreProfiloUtente: {
    alignItems: "center",
    paddingVertical: Spaziatura.lg,
    paddingHorizontal: Spaziatura.md,
  },
  /* Avatar */
  avatar: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: Colori.superficiecard,
    borderWidth: 3,
    borderColor: Colori.primario,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spaziatura.md,
  },
  testoAvatar: {
    fontSize: ms(28),
    fontWeight: Tipografia.peso.grassetto,
    color: Colori.primario,
  },
  /* Nome */
  nomeUtente: {
    fontSize: ms(20),
    fontWeight: Tipografia.peso.grassetto,
    color: Colori.testoPrimario,
    marginBottom: Spaziatura.sm,
  },
  /* Badge ruolo */
  badgeRuolo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colori.azioneModificaSfondo,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: Spaziatura.md,
  },
  badgeRuoloAdmin: {
    backgroundColor: Colori.azioneAutorizzaSfondo,
  },
  testoBadgeRuolo: {
    fontSize: ms(12),
    fontWeight: Tipografia.peso.medio,
    color: Colori.azioneModificaTesto,
  },
  testoBadgeRuoloAdmin: {
    color: Colori.azioneAutorizzaTesto,
  },
  /* Riga dettaglio (email) */
  rigaDettaglio: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spaziatura.sm,
    backgroundColor: Colori.superficie,
    paddingHorizontal: Spaziatura.md,
    paddingVertical: 10,
    borderRadius: 10,
    width: "100%",
  },
  testoDettaglio: {
    fontSize: ms(14),
    color: Colori.testoSecondario,
    flexShrink: 1,
  },
  /* Azioni */
  contenitoreAzioni: {
    paddingHorizontal: Spaziatura.md,
    marginTop: Spaziatura.md,
    gap: Spaziatura.sm,
  },
  pulsantePresenza: {
    backgroundColor: Colori.primario,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spaziatura.sm,
    paddingVertical: 14,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colori.primario,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  testoPulsantePresenza: {
    color: Colori.bianco,
    fontWeight: Tipografia.peso.grassetto,
    fontSize: ms(15),
  },
  pulsanteEsci: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spaziatura.sm,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colori.accento,
    backgroundColor: Colori.bianco,
  },
  testoPulsanteEsci: {
    color: Colori.accento,
    fontWeight: Tipografia.peso.grassetto,
    fontSize: ms(15),
  },
});
